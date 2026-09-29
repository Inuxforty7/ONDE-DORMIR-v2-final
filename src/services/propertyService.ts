/**
 * ONDE DORMIR MOÇAMBIQUE - Scalable Property Service
 * Handles server-side pagination, search, status filtering, and report submissions
 */

import { apiClient, ApiResponse } from './apiClient';
import { Accommodation } from '../types';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PropertyQueryParams {
  page?: number;
  limit?: number;
  province?: string;
  category?: string;
  search?: string;
  verifiedOnly?: boolean;
  isOpen24h?: boolean;
  sortBy?: 'distance' | 'name' | 'verified' | 'rating' | 'price';
  userLat?: number;
  userLng?: number;
}

class PropertyService {
  /**
   * Fetches paginated properties from backend with filters applied on server
   */
  public async getProperties(params: PropertyQueryParams = {}): Promise<ApiResponse<PaginatedResult<Accommodation>>> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.province && params.province !== 'all') query.set('province', params.province);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.verifiedOnly) query.set('verifiedOnly', 'true');
    if (params.isOpen24h) query.set('isOpen24h', 'true');
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.userLat !== undefined) query.set('userLat', params.userLat.toString());
    if (params.userLng !== undefined) query.set('userLng', params.userLng.toString());

    return apiClient.get<PaginatedResult<Accommodation>>(`/properties?${query.toString()}`);
  }

  /**
   * Get single property by ID
   */
  public async getPropertyById(id: string): Promise<ApiResponse<Accommodation>> {
    return apiClient.get<Accommodation>(`/properties/${id}`);
  }

  /**
   * Submit an official complaint/report against a property or resource
   */
  public async submitReport(
    targetType: 'PROPERTY' | 'VEHICLE' | 'TOUR_GUIDE' | 'HEARTLINK_PROFILE',
    targetId: string,
    reason: string,
    details: string
  ): Promise<ApiResponse<{ reportId: string }>> {
    return apiClient.post('/reports', {
      targetType,
      targetId,
      reason,
      details,
    });
  }
}

export const propertyService = new PropertyService();
