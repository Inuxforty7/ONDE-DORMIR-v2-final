import { ContactAttemptNotification, LockedContactTarget, PlatformModule } from '../types/contactUnlock';

const UNLOCKED_STORAGE_KEY = 'onde_dormir_unlocked_targets';
const NOTIFICATIONS_STORAGE_KEY = 'onde_dormir_contact_notifications';

// Initial demo notifications to showcase monetization & privacy right away
const INITIAL_DEMO_NOTIFICATIONS: ContactAttemptNotification[] = [
  {
    id: 'notif-demo-1',
    targetId: 'moz-locked-demo',
    targetName: 'Pensão Sol & Mar (Baixa)',
    targetPhoto: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80',
    module: 'accommodation',
    moduleLabel: 'Onde Dormir',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // Há 18 min
    interestedCount: 3,
    read: false,
    unlockFee: 1000,
    isUnlocked: false,
  },
  {
    id: 'notif-demo-2',
    targetId: 'fleet-v3',
    targetName: 'Toyota Corolla Cross Hybrid',
    targetPhoto: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
    module: 'car',
    moduleLabel: 'Rent-a-Car',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // Há 45 min
    interestedCount: 2,
    read: false,
    unlockFee: 1000,
    isUnlocked: false,
  }
];

type Listener = () => void;

class ContactUnlockService {
  private listeners: Set<Listener> = new Set();

  private getUnlockedIds(): Set<string> {
    try {
      const saved = localStorage.getItem(UNLOCKED_STORAGE_KEY);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {
      // fallback
    }
    return new Set();
  }

  private saveUnlockedIds(ids: Set<string>): void {
    try {
      localStorage.setItem(UNLOCKED_STORAGE_KEY, JSON.stringify(Array.from(ids)));
    } catch (e) {
      // fallback
    }
  }

  public getNotifications(): ContactAttemptNotification[] {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_DEMO_NOTIFICATIONS;
  }

  private saveNotifications(list: ContactAttemptNotification[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
      this.notifyListeners();
    } catch (e) {
      // fallback
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        // ignore
      }
    });
  }

  /**
   * Verifica se o contacto de uma entidade está desbloqueado
   */
  public isContactUnlocked(targetId: string, defaultStatus?: boolean): boolean {
    const unlockedIds = this.getUnlockedIds();
    if (unlockedIds.has(targetId)) {
      return true;
    }
    // Se o perfil tem explicitamente isContactUnlocked: false, está bloqueado
    if (defaultStatus === false) {
      return false;
    }
    return true;
  }

  /**
   * Executa a tentativa de contacto.
   * Se bloqueado, gera notificação automática de interesse oculta (sem revelar dados do visitante)
   */
  public attemptContact(target: LockedContactTarget, defaultStatus?: boolean): {
    allowed: boolean;
    notification?: ContactAttemptNotification;
  } {
    const isUnlocked = this.isContactUnlocked(target.id, defaultStatus);
    if (isUnlocked) {
      return { allowed: true };
    }

    // Contacto bloqueado! Gerar/Atualizar notificação anónima automática para o proprietário
    const list = this.getNotifications();
    const existingIndex = list.findIndex((n) => n.targetId === target.id);
    let updatedNotif: ContactAttemptNotification;

    if (existingIndex >= 0) {
      const existing = list[existingIndex];
      updatedNotif = {
        ...existing,
        interestedCount: (existing.interestedCount || 1) + 1,
        timestamp: new Date().toISOString(),
        read: false,
        isUnlocked: false,
      };
      list[existingIndex] = updatedNotif;
    } else {
      updatedNotif = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        targetId: target.id,
        targetName: target.name,
        targetPhoto: target.photo,
        module: target.module,
        moduleLabel: target.moduleLabel,
        timestamp: new Date().toISOString(),
        interestedCount: 1,
        read: false,
        unlockFee: target.unlockFee || 1000,
        isUnlocked: false,
      };
      list.unshift(updatedNotif);
    }

    this.saveNotifications(list);

    return {
      allowed: false,
      notification: updatedNotif,
    };
  }

  /**
   * Helper que verifica o desbloqueio, despacha evento global se bloqueado
   * e retorna true (se permitido) ou false (se bloqueado).
   */
  public triggerContactAttempt(target: LockedContactTarget, defaultStatus?: boolean): boolean {
    const res = this.attemptContact(target, defaultStatus);
    if (!res.allowed) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('onde-dormir-contact-locked', { detail: target }));
      }
      return false;
    }
    return true;
  }

  /**
   * Desbloqueia o contacto de uma entidade APENAS após confirmação estrita do provedor
   * Bloqueia qualquer desbloqueio direto ou não autorizado
   */
  public unlockContact(targetId: string, isAuthoritativeConfirmed: boolean = false): boolean {
    if (!isAuthoritativeConfirmed) {
      console.warn(`[Security] Tentativa de desbloqueio rejeitada para targetId=${targetId}: requer liquidação confirmada pelo provedor.`);
      return false;
    }
    const unlockedIds = this.getUnlockedIds();
    unlockedIds.add(targetId);
    this.saveUnlockedIds(unlockedIds);

    // Marca notificações existentes deste targetId como desbloqueadas
    const list = this.getNotifications().map((n) => {
      if (n.targetId === targetId) {
        return { ...n, isUnlocked: true, read: true };
      }
      return n;
    });
    this.saveNotifications(list);
    return true;
  }

  public getUnreadCount(): number {
    return this.getNotifications().filter((n) => !n.read).length;
  }

  public markAllAsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    this.saveNotifications(list);
  }

  public markAsRead(id: string): void {
    const list = this.getNotifications().map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.saveNotifications(list);
  }

  public clearAllNotifications(): void {
    this.saveNotifications([]);
  }
}

export const contactUnlockService = new ContactUnlockService();
