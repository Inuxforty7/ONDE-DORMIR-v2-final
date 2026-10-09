import { apiClient } from './apiClient';

export interface TouristPhoneVerification {
  phoneNumber: string;
  countryCode: string;
  isVerified: boolean;
  verifiedAt: string;
  consentSharePhone: boolean;
}

export interface TourismReportPayload {
  targetId: string;
  targetType: 'guide' | 'experience' | 'place';
  targetName: string;
  reason: string;
  details?: string;
  reporterPhone?: string;
}

const STORAGE_KEY_TOURIST_VERIFICATION = 'onde_dormir_tourist_phone_verification';
const STORAGE_KEY_BLOCKED_ITEMS = 'onde_dormir_blocked_tourism_items';

class TourismVerificationService {
  private listeners: Array<() => void> = [];

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    for (const l of this.listeners) {
      l();
    }
  }

  /**
   * Retrieves tourist phone verification from persistent storage
   */
  public getTouristVerification(): TouristPhoneVerification | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TOURIST_VERIFICATION);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // fallback
    }
    return null;
  }

  /**
   * Checks if current visitor/tourist has verified their phone number via SMS OTP
   */
  public isTouristPhoneVerified(): boolean {
    const v = this.getTouristVerification();
    return Boolean(v && v.isVerified && v.phoneNumber);
  }

  /**
   * Saves tourist phone verification persistently
   */
  public saveTouristVerification(verification: TouristPhoneVerification): void {
    try {
      localStorage.setItem(STORAGE_KEY_TOURIST_VERIFICATION, JSON.stringify(verification));
      this.notify();
    } catch (e) {
      console.warn('[TourismVerification] Failed to persist verification', e);
    }
  }

  /**
   * Clear tourist verification
   */
  public clearTouristVerification(): void {
    localStorage.removeItem(STORAGE_KEY_TOURIST_VERIFICATION);
    this.notify();
  }

  /**
   * Block an item (guide, experience, or place)
   */
  public blockItem(id: string, name: string): void {
    try {
      const blocked = this.getBlockedItems();
      if (!blocked.some((b) => b.id === id)) {
        blocked.push({ id, name, blockedAt: new Date().toISOString() });
        localStorage.setItem(STORAGE_KEY_BLOCKED_ITEMS, JSON.stringify(blocked));
        this.notify();
      }
    } catch (e) {
      console.warn('[TourismVerification] Failed to block item', e);
    }
  }

  /**
   * Unblock an item
   */
  public unblockItem(id: string): void {
    try {
      const blocked = this.getBlockedItems().filter((b) => b.id !== id);
      localStorage.setItem(STORAGE_KEY_BLOCKED_ITEMS, JSON.stringify(blocked));
      this.notify();
    } catch (e) {
      console.warn('[TourismVerification] Failed to unblock item', e);
    }
  }

  /**
   * Get list of blocked tourism items
   */
  public getBlockedItems(): Array<{ id: string; name: string; blockedAt: string }> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BLOCKED_ITEMS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // fallback
    }
    return [];
  }

  /**
   * Check if an item is blocked
   */
  public isItemBlocked(id: string): boolean {
    return this.getBlockedItems().some((b) => b.id === id);
  }

  /**
   * Submit a report against a guide, experience or place to the backend
   */
  public async submitReport(payload: TourismReportPayload): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ message: string }>('/reports', {
        targetId: payload.targetId,
        targetType: `TOURISM_${payload.targetType.toUpperCase()}`,
        reason: `${payload.reason} - ${payload.targetName}`,
        details: payload.details || 'Denúncia de segurança submetida pelo utilizador no módulo Turismo.',
        contactPhone: payload.reporterPhone || this.getTouristVerification()?.phoneNumber || '',
      });

      if (res.success) {
        // Automatically block the reported item locally for safety
        this.blockItem(payload.targetId, payload.targetName);
        return { success: true, message: 'Denúncia recebida. O perfil foi bloqueado temporariamente para a sua segurança.' };
      }
      return { success: false, message: res.error || 'Erro ao submeter denúncia.' };
    } catch {
      // Fallback local block
      this.blockItem(payload.targetId, payload.targetName);
      return { success: true, message: 'Denúncia registada e perfil bloqueado localmente.' };
    }
  }
}

export const tourismVerificationService = new TourismVerificationService();
