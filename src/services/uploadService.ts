/**
 * ONDE DORMIR MOÇAMBIQUE - Media Upload Service
 * Provides genuine file uploads to the backend endpoint (/api/upload).
 * Persists files to the server and returns persistent URLs (/uploads/...).
 */

import { apiClient, ApiResponse } from './apiClient';

export interface UploadResult {
  url: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  hash: string;
  category: string;
  uploadedAt: string;
}

export type UploadCategory = 'document' | 'profile' | 'property' | 'vehicle' | 'loveshop' | 'general';

class UploadService {
  /**
   * Uploads a File object directly to the backend.
   */
  public async uploadFile(
    file: File,
    category: UploadCategory = 'general'
  ): Promise<ApiResponse<UploadResult>> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Não foi possível ler o arquivo local.',
        });
      };

      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          resolve({
            success: false,
            error: 'Arquivo vazio ou formato inválido.',
          });
          return;
        }

        const res = await apiClient.post<UploadResult>('/upload', {
          dataUrl,
          fileName: file.name,
          fileType: file.type,
          category,
        });

        resolve(res);
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Uploads a dataURL (base64 string) directly.
   */
  public async uploadDataUrl(
    dataUrl: string,
    fileName: string,
    fileType: string,
    category: UploadCategory = 'general'
  ): Promise<ApiResponse<UploadResult>> {
    return apiClient.post<UploadResult>('/upload', {
      dataUrl,
      fileName,
      fileType,
      category,
    });
  }
}

export const uploadService = new UploadService();
