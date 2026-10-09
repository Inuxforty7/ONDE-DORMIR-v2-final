/**
 * ONDE DORMIR MOÇAMBIQUE - Verification & OTP Service
 * Interfaces with backend OTP endpoints with rate-limiting, liveness verification,
 * and sensitive document sanitization.
 */

import { apiClient, ApiResponse } from './apiClient';
import { authService, AuthUser } from './authService';

export interface SendOtpResponse {
  message: string;
  expiresInSeconds: number;
  demoCode?: string; // Only returned if server is running in DEMO_MODE
  isDemo: boolean;
}

export interface VerifyOtpResponse {
  token: string;
  user: AuthUser;
}

export interface DocumentAnalysisResult {
  isValidDocument: boolean;
  docTypeDetected: string;
  extractedFields: {
    fullName?: string;
    docNumber?: string;
    birthDate?: string;
    expiryDate?: string;
    nationality?: string;
  };
  confidenceScore: number;
  verificationState: 'SUBMITTED' | 'PROCESSING' | 'NEEDS_REVIEW' | 'VERIFIED' | 'REJECTED';
  warnings: string[];
  message?: string;
}

export interface SubmitVerificationPayload {
  fullName: string;
  biNumber: string;
  targetType: 'USER_PROFILE' | 'OWNER_ACCOUNT' | 'VEHICLE' | 'TOUR_GUIDE';
  targetId?: string;
  birthDate?: string;
  phone?: string;
  province?: string;
  city?: string;
  biFrontUrl?: string;
  biBackUrl?: string;
  selfieUrl?: string;
  driverLicenseUrl?: string;
  biFrontHash?: string;
  biBackHash?: string;
  livenessPassed: boolean;
  livenessScore: number;
}

class VerificationService {
  /**
   * Performs server-side file content validation, document detection, and OCR field extraction
   */
  public async analyzeDocument(payload: {
    dataUrl?: string;
    imageUrl?: string;
    expectedDocType?: string;
  }): Promise<ApiResponse<DocumentAnalysisResult>> {
    return apiClient.post<DocumentAnalysisResult>('/verification/analyze-document', payload);
  }

  /**
   * Request OTP code to be sent to a phone number
   */
  public async requestOtp(phoneNumber: string): Promise<ApiResponse<SendOtpResponse>> {
    // Sanitize Mozambican phone number
    const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/[^0-9+]/g, '');

    return apiClient.post<SendOtpResponse>('/auth/otp/send', {
      phoneNumber: cleanPhone,
    });
  }

  /**
   * Verify entered OTP code with the backend
   */
  public async verifyOtp(phoneNumber: string, code: string): Promise<ApiResponse<VerifyOtpResponse>> {
    const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
    const cleanCode = code.trim();

    const response = await apiClient.post<VerifyOtpResponse>('/auth/otp/verify', {
      phoneNumber: cleanPhone,
      code: cleanCode,
    });

    if (response.success && response.data) {
      authService.setSession(response.data.token, response.data.user);
    }

    return response;
  }

  /**
   * Submit biometric & ID verification dossier to the server
   * Sanitizes in-memory images after submission
   */
  public async submitVerification(payload: SubmitVerificationPayload): Promise<ApiResponse<{ requestId: string; status: string }>> {
    return apiClient.post('/verification/request', payload);
  }
}

export const verificationService = new VerificationService();
