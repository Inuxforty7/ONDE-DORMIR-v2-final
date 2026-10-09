import { apiClient } from './apiClient';
import { authService } from './authService';

export type RenterVerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface RenterProfile {
  userId: string;
  fullName: string;
  phone: string;
  maskedBiNumber: string;
  driverLicenseNumber?: string;
  status: RenterVerificationStatus;
  verifiedAt?: string;
  verificationCode: string; // e.g. LOC-MZ-7482
}

const STORAGE_KEY_RENTER = 'onde_dormir_renter_profile';

class RenterVerificationService {
  /**
   * Retrieves sanitized renter profile from local persistence
   * Note: NEVER contains raw base64 photos or private ID documents
   */
  public getRenterProfile(): RenterProfile | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RENTER);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      // fallback
    }
    return null;
  }

  /**
   * Persists sanitized renter profile (no private document images)
   */
  public saveRenterProfile(profile: RenterProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY_RENTER, JSON.stringify(profile));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('onde-dormir-renter-status-changed', { detail: profile }));
      }
    } catch (e) {
      // fallback
    }
  }

  /**
   * Queries the backend for real-time verification status for a given user ID
   */
  public async checkServerRenterStatus(userId: string): Promise<RenterVerificationStatus> {
    try {
      const res = await apiClient.get<{ status: string; isVerified: boolean }>(`/verification/status/${userId}`);
      let status: RenterVerificationStatus = 'UNVERIFIED';

      if (res.success && res.data) {
        if (res.data.isVerified || res.data.status === 'VERIFIED') {
          status = 'VERIFIED';
        } else if (['UNDER_REVIEW', 'PENDING', 'NEEDS_REVIEW', 'SUBMITTED'].includes(res.data.status)) {
          status = 'PENDING';
        } else if (res.data.status === 'REJECTED') {
          status = 'REJECTED';
        }
      }

      // Sync local status
      const local = this.getRenterProfile();
      if (local && local.userId === userId) {
        local.status = status;
        this.saveRenterProfile(local);
      }

      return status;
    } catch (e) {
      const local = this.getRenterProfile();
      return local?.status || 'UNVERIFIED';
    }
  }

  /**
   * Checks if current user/renter is fully verified
   */
  public isRenterVerified(): boolean {
    const profile = this.getRenterProfile();
    return Boolean(profile && profile.status === 'VERIFIED');
  }

  /**
   * Generates unique reference code for verified renters
   */
  public generateVerificationCode(biNumber: string): string {
    let hash = 0;
    for (let i = 0; i < biNumber.length; i++) {
      hash = (hash << 5) - hash + biNumber.charCodeAt(i);
      hash |= 0;
    }
    const codeNum = Math.abs(hash % 9000) + 1000;
    return `LOC-MZ-${codeNum}`;
  }

  /**
   * Formats clean, professional WhatsApp contact message with verified badge reference
   * Protecting private ID documents (no raw attachments or base64)
   */
  public formatRenterContactMessage(params: {
    renterProfile: RenterProfile;
    carModel: string;
    carCity: string;
  }): string {
    const { renterProfile, carModel, carCity } = params;
    const licenseInfo = renterProfile.driverLicenseNumber ? ` | Carta: ${renterProfile.driverLicenseNumber}` : '';

    return encodeURIComponent(
      `Olá! Tenho interesse na viatura *${carModel}* em *${carCity}*.\n` +
      `Sou o locatário verificado *${renterProfile.fullName}* (Ref: ${renterProfile.verificationCode} | BI: ${renterProfile.maskedBiNumber}${licenseInfo}).\n` +
      `A viatura está disponível para aluguer?`
    );
  }
}

export const renterVerificationService = new RenterVerificationService();
