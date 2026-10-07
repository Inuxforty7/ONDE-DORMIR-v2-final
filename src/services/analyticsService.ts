/**
 * ONDE DORMIR MOÇAMBIQUE - Real Persistent Visit Analytics Service
 * Tracks genuine visits across the 5 main application modules:
 * - Onde Dormir (Pensões, Guest Houses & Residenciais)
 * - Turismo (Lugares, Experiências & Guias)
 * - Rent-a-Car (Aluguer de Viaturas & 4x4)
 * - HeartLink (Conexões Sociais & Relacionamentos)
 * - Love Shop (Presentes & Catálogo)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from './apiClient';

export type ModuleId = 'onde_dormir' | 'turismo' | 'rentacar' | 'heartlink' | 'loveshop';

export interface ModuleVisitsData {
  onde_dormir: number;
  turismo: number;
  rentacar: number;
  heartlink: number;
  loveshop: number;
}

export type AnalyticsEventType =
  | 'property_view'
  | 'search'
  | 'favorite'
  | 'whatsapp_click'
  | 'phone_click'
  | 'map_click'
  | 'module_visit';

const STORAGE_KEY = 'onde_dormir_module_visits';
const EVENT_NAME = 'onde-dormir-visits-updated';

const DEFAULT_VISITS: ModuleVisitsData = {
  onde_dormir: 0,
  turismo: 0,
  rentacar: 0,
  heartlink: 0,
  loveshop: 0,
};

class AnalyticsService {
  private listeners: Set<(visits: ModuleVisitsData) => void> = new Set();
  private cachedVisits: ModuleVisitsData | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.cachedVisits = this.readFromStorage();
          this.notifyListeners();
        }
      });
    }
  }

  private readFromStorage(): ModuleVisitsData {
    if (typeof window === 'undefined') return { ...DEFAULT_VISITS };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          onde_dormir: Math.max(0, Number(parsed.onde_dormir) || 0),
          turismo: Math.max(0, Number(parsed.turismo) || 0),
          rentacar: Math.max(0, Number(parsed.rentacar) || 0),
          heartlink: Math.max(0, Number(parsed.heartlink) || 0),
          loveshop: Math.max(0, Number(parsed.loveshop) || 0),
        };
      }
    } catch {
      // ignore JSON parse error
    }
    return { ...DEFAULT_VISITS };
  }

  private saveToStorage(visits: ModuleVisitsData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
    } catch {
      // ignore storage quota errors
    }
  }

  private notifyListeners(): void {
    const visits = this.getModuleVisits();
    this.listeners.forEach((listener) => {
      try {
        listener(visits);
      } catch {
        // ignore listener errors
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: visits }));
    }
  }

  /**
   * Get all module visit counters
   */
  public getModuleVisits(): ModuleVisitsData {
    if (!this.cachedVisits) {
      this.cachedVisits = this.readFromStorage();
    }
    return { ...this.cachedVisits };
  }

  /**
   * Get total visits combined from all 5 modules
   */
  public getTotalVisits(): number {
    const visits = this.getModuleVisits();
    return (
      (visits.onde_dormir || 0) +
      (visits.turismo || 0) +
      (visits.rentacar || 0) +
      (visits.heartlink || 0) +
      (visits.loveshop || 0)
    );
  }

  /**
   * Get visits for a specific module
   */
  public getVisitsForModule(moduleId: ModuleId): number {
    const visits = this.getModuleVisits();
    return visits[moduleId] || 0;
  }

  /**
   * Record a genuine visit to a specific module
   */
  public recordModuleVisit(moduleId: ModuleId): void {
    const current = this.getModuleVisits();
    const updated: ModuleVisitsData = {
      ...current,
      [moduleId]: (current[moduleId] || 0) + 1,
    };
    this.cachedVisits = updated;
    this.saveToStorage(updated);
    this.notifyListeners();

    // Async background telemetry event
    this.logEvent('module_visit', moduleId);
  }

  /**
   * Subscribe to visit count updates
   */
  public subscribe(listener: (visits: ModuleVisitsData) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Log an anonymous user engagement event
   */
  public logEvent(eventType: AnalyticsEventType, resourceId?: string, provinceCode?: string) {
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

/**
 * React hook to reactively subscribe to visit analytics
 */
export function useVisitAnalytics() {
  const [visits, setVisits] = useState<ModuleVisitsData>(() => analyticsService.getModuleVisits());
  const [totalVisits, setTotalVisits] = useState<number>(() => analyticsService.getTotalVisits());

  useEffect(() => {
    const update = (data: ModuleVisitsData) => {
      setVisits(data);
      setTotalVisits(
        (data.onde_dormir || 0) +
        (data.turismo || 0) +
        (data.rentacar || 0) +
        (data.heartlink || 0) +
        (data.loveshop || 0)
      );
    };

    const unsubscribe = analyticsService.subscribe(update);
    return unsubscribe;
  }, []);

  const getModuleCount = useCallback((id: ModuleId) => {
    return visits[id] || 0;
  }, [visits]);

  return {
    visits,
    totalVisits,
    getModuleCount,
  };
}

/**
 * Format visit count in simple clean Portuguese without technical jargon
 * Examples: "0 visitas", "1 visita", "900 visitas"
 */
export function formatVisitCount(count: number): string {
  const num = Math.max(0, count || 0);
  if (num === 1) {
    return '1 visita';
  }
  return `${num.toLocaleString('pt-PT')} visitas`;
}
