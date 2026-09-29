/**
 * ONDE DORMIR MOÇAMBIQUE - Audit Trail Logging Service
 * Records administrative events without exposing private personal data
 */

import { apiClient, ApiResponse } from './apiClient';
import { DbAuditLog } from '../types/database';

class AuditService {
  /**
   * Log administrative audit action
   */
  public async logAction(
    action: string,
    resourceType: string,
    resourceId: string,
    previousState?: Record<string, any>,
    newState?: Record<string, any>
  ): Promise<ApiResponse<void>> {
    return apiClient.post('/admin/audit-logs', {
      action,
      resourceType,
      resourceId,
      previousState,
      newState,
    });
  }

  /**
   * Fetch recent audit logs for administrators
   */
  public async getRecentLogs(): Promise<ApiResponse<DbAuditLog[]>> {
    return apiClient.get<DbAuditLog[]>('/admin/audit-logs');
  }
}

export const auditService = new AuditService();
