/**
 * ONDE DORMIR MOÇAMBIQUE - Privacy-Preserving Analytics Service
 * Collects strictly minimized metrics without tracking personal identifiers.
 */

import { apiClient } from './apiClient';

export type AnalyticsEventType =
  | 'property_view'
  | 'search'
  | 'favorite'
  | 'whatsapp_click'
  | 'phone_click'
  | 'map_click';

class AnalyticsService {
  /**
   * Log an anonymous user engagement event
   */
  public logEvent(eventType: AnalyticsEventType, resourceId?: string, provinceCode?: string) {
    // Fire and forget; never block user interaction
    apiClient.post('/analytics/event', {
      eventType,
      resourceId,
      provinceCode,
    }).catch(() => {
      // Silently ignore telemetry failure in offline mode
    });
  }

  public trackWhatsAppClick(resourceId: string, province?: string) {
    this.logEvent('whatsapp_click', resourceId, province);
  }

  public trackPhoneClick(resourceId: string, province?: string) {
    this.logEvent('phone_click', resourceId, province);
  }

  public trackSearch(searchQuery: string, province?: string) {
    this.logEvent('search', searchQuery.slice(0, 50), province);
  }
}

export const analyticsService = new AnalyticsService();
