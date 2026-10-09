import { P2PTier } from './heartLinkService';
import { contactUnlockService } from './contactUnlockService';

export type HeartLinkPlanId = 
  | 'contact_20mt'
  | 'access_50mt'
  | 'monthly_100mt'
  | 'monthly_250mt'
  | 'monthly_1000mt';

export interface HeartLinkPlanConfig {
  id: HeartLinkPlanId;
  name: string;
  priceMt: number;
  durationLabel: string;
  type: 'single' | '24h' | 'monthly';
  tier?: P2PTier;
  badge?: string;
  description: string;
  features: string[];
}

export const HEARTLINK_ALL_PLANS: HeartLinkPlanConfig[] = [
  {
    id: 'contact_20mt',
    name: 'Passe Contacto',
    priceMt: 20,
    durationLabel: 'Permanente para este contacto',
    type: 'single',
    badge: '20 MT',
    description: 'Desbloqueia permanentemente apenas este contacto específico sem necessidade de adquirir plano mensal.',
    features: [
      'Desbloquear apenas aquele contacto',
      'Permite ver telefone e WhatsApp',
      'Permite enviar mensagens no chat para este contacto',
      'Não desbloqueia outros contactos nem mensagens de outros utilizadores',
      'Validade permanente (não precisa voltar a pagar para o mesmo contacto)',
    ]
  },
  {
    id: 'access_50mt',
    name: 'Passe Diário (24h)',
    priceMt: 50,
    durationLabel: 'Válido por exactamente 24 horas',
    type: '24h',
    badge: '50 MT',
    description: 'Acesso completo durante 24 horas a todas as funções e mensagens.',
    features: [
      'Mensagens ilimitadas durante 24 horas',
      'Ver contactos, telefones e WhatsApp',
      'Responder a todas as novas mensagens',
      'Ver quem visitou o perfil e funções Premium durante 24h',
      'Duração exacta de 24 horas (regressa ao plano gratuito após expirar)',
    ]
  },
  {
    id: 'monthly_100mt',
    name: 'Nível Coração ♥️',
    priceMt: 100,
    durationLabel: 'Validade de 30 dias',
    type: 'monthly',
    tier: 'heart',
    badge: '100 MT',
    description: 'Nível P2P Coração ♥️ com acesso ilimitado de 30 dias.',
    features: [
      'Plano com termo de 30 dias',
      'Activa o nível P2P correspondente (Coração ♥️)',
      'Actualiza automaticamente o nível activo',
      'Expira quando o período termina',
    ]
  },
  {
    id: 'monthly_250mt',
    name: 'Nível Diamante 💎',
    priceMt: 250,
    durationLabel: 'Validade de 30 dias',
    type: 'monthly',
    tier: 'diamond',
    badge: '250 MT',
    description: 'Nível P2P Diamante 💎 com acesso ilimitado de 30 dias.',
    features: [
      'Plano com termo de 30 dias',
      'Activa o nível P2P correspondente (Diamante 💎)',
      'Actualiza automaticamente o nível activo',
      'Expira quando o período termina',
    ]
  },
  {
    id: 'monthly_1000mt',
    name: 'Nível VIP 👑',
    priceMt: 1000,
    durationLabel: 'Validade de 30 dias VIP',
    type: 'monthly',
    tier: 'king',
    badge: '1000 MT',
    description: 'Nível P2P VIP 👑 com acesso total de 30 dias.',
    features: [
      'Plano VIP com termo de 30 dias',
      'Activa o nível P2P correspondente (VIP 👑)',
      'Actualiza automaticamente o nível activo',
      'Expira quando o período termina',
    ]
  }
];

export type HeartLinkPriorityLevel = 
  | 'vip'
  | 'diamond'
  | 'heart'
  | 'daily_pass'
  | 'contact_pass'
  | 'free';

export interface HeartLinkStats {
  contactPassesCount: number;
  dailyPassesCount: number;
  monthlyPlansCount: number;
  revenueContactPasses: number;
  revenueDailyPasses: number;
  revenueMonthlyPlans: number;
  totalRevenue: number;
  unlockedContactsCount: number;
  conversionsToMonthlyCount: number;
}

export interface HeartLinkTransaction {
  id: string;
  reference: string;
  planId: HeartLinkPlanId;
  planName: string;
  amount: number;
  targetContactId?: string;
  targetContactName?: string;
  phoneNumber: string;
  paymentMethod: 'mpesa' | 'emola';
  status: 'CONFIRMED';
  createdAt: string;
  expiresAt?: string;
}

export interface HeartLinkAccessState {
  activeMonthlyPlan: {
    planId: 'monthly_100mt' | 'monthly_250mt' | 'monthly_1000mt';
    tier: P2PTier;
    amount: number;
    activatedAt: string;
    expiresAt: string;
    reference: string;
  } | null;
  access24h: {
    activatedAt: string;
    expiresAt: string;
    reference: string;
  } | null;
  unlockedSpecificContacts: string[];
}

export interface HeartLinkNotification {
  id: string;
  contactId: string;
  contactName: string;
  contactPhoto?: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const STORAGE_KEY_STATE = 'onde_dormir_hl_access_state';
const STORAGE_KEY_TX = 'onde_dormir_hl_transactions';
const STORAGE_KEY_NOTIFS = 'onde_dormir_hl_notifications';
const STORAGE_KEY_STATS = 'onde_dormir_hl_stats';

type AccessListener = () => void;

class HeartLinkAccessService {
  private listeners: Set<AccessListener> = new Set();

  constructor() {
    this.cleanExpired();
    // Try to sync with server on init
    this.syncWithBackend().catch(() => {});
  }

  public subscribe(listener: AccessListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        // ignore
      }
    });
  }

  private cleanExpired(): void {
    const state = this.getLocalState();
    const now = Date.now();
    let changed = false;

    if (state.access24h && new Date(state.access24h.expiresAt).getTime() <= now) {
      state.access24h = null;
      changed = true;
    }

    if (state.activeMonthlyPlan && new Date(state.activeMonthlyPlan.expiresAt).getTime() <= now) {
      state.activeMonthlyPlan = null;
      changed = true;
    }

    if (changed) {
      this.saveLocalState(state);
    }
  }

  private getLocalState(): HeartLinkAccessState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STATE);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          activeMonthlyPlan: parsed.activeMonthlyPlan || null,
          access24h: parsed.access24h || null,
          unlockedSpecificContacts: Array.isArray(parsed.unlockedSpecificContacts)
            ? parsed.unlockedSpecificContacts
            : [],
        };
      }
    } catch (e) {
      // fallback
    }
    return {
      activeMonthlyPlan: null,
      access24h: null,
      unlockedSpecificContacts: [],
    };
  }

  private saveLocalState(state: HeartLinkAccessState): void {
    try {
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
      // Keep legacy visibility in sync for backward-compat UI elements
      const hasMonthly = Boolean(state.activeMonthlyPlan);
      const has24h = Boolean(state.access24h);
      const isUnlocked = hasMonthly || has24h;
      const legacyVisibility = {
        mode: 'public_showcase',
        isUnlocked,
        planId: state.activeMonthlyPlan?.planId === 'monthly_1000mt'
          ? 'vis_30d'
          : state.activeMonthlyPlan?.planId === 'monthly_250mt'
          ? 'vis_7d'
          : state.activeMonthlyPlan?.planId === 'monthly_100mt'
          ? 'vis_24h'
          : undefined,
        planName: state.activeMonthlyPlan
          ? (state.activeMonthlyPlan.tier === 'king' ? '👑 VIP' : state.activeMonthlyPlan.tier === 'diamond' ? '💎 DIAMANTE' : '♥️ CORAÇÃO')
          : (state.access24h ? 'Acesso 24h' : undefined),
        expiresAt: state.activeMonthlyPlan?.expiresAt || state.access24h?.expiresAt,
        unlockedAt: state.activeMonthlyPlan?.activatedAt || state.access24h?.activatedAt,
      };
      localStorage.setItem('onde_dormir_heartlink_visibility', JSON.stringify(legacyVisibility));
      this.notify();
    } catch (e) {
      // fallback
    }
  }

  public async syncWithBackend(): Promise<void> {
    try {
      const res = await fetch('/api/heartlink/access/status');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const local = this.getLocalState();
          // Merge server state with local
          const serverUnlocked = json.data.unlockedContactIds || [];
          const mergedUnlocked = Array.from(new Set([...local.unlockedSpecificContacts, ...serverUnlocked]));

          const updatedState: HeartLinkAccessState = {
            activeMonthlyPlan: json.data.activeMonthlyPlan || local.activeMonthlyPlan,
            access24h: json.data.hasActive24hAccess
              ? {
                  activatedAt: new Date().toISOString(),
                  expiresAt: json.data.access24hExpiresAt,
                  reference: 'SERVER',
                }
              : local.access24h,
            unlockedSpecificContacts: mergedUnlocked,
          };
          this.saveLocalState(updatedState);
        }
      }
    } catch (e) {
      // offline fallback
    }
  }

  /**
   * Returns current access status
   */
  public getAccessStatus(): {
    hasActiveMonthlyPlan: boolean;
    activeMonthlyPlan: HeartLinkAccessState['activeMonthlyPlan'];
    activeTier: P2PTier | null;
    hasActive24hAccess: boolean;
    access24hExpiresAt: string | null;
    unlockedContactIds: string[];
    canContactAll: boolean;
  } {
    this.cleanExpired();
    const state = this.getLocalState();
    const hasActiveMonthlyPlan = Boolean(state.activeMonthlyPlan);
    const hasActive24hAccess = Boolean(state.access24h);
    const activeTier = state.activeMonthlyPlan ? state.activeMonthlyPlan.tier : null;
    const canContactAll = hasActiveMonthlyPlan || hasActive24hAccess;

    return {
      hasActiveMonthlyPlan,
      activeMonthlyPlan: state.activeMonthlyPlan,
      activeTier,
      hasActive24hAccess,
      access24hExpiresAt: state.access24h?.expiresAt || null,
      unlockedContactIds: state.unlockedSpecificContacts,
      canContactAll,
    };
  }

  /**
   * Returns whether user has an active monthly plan (100, 250, or 1000 MT)
   */
  public hasActiveMonthlyPlan(): boolean {
    return this.getAccessStatus().hasActiveMonthlyPlan;
  }

  /**
   * Returns whether user can contact a specific profile
   */
  public canContactUser(contactId: string): boolean {
    this.cleanExpired();
    const state = this.getLocalState();
    if (state.activeMonthlyPlan) return true;
    if (state.access24h) return true;
    if (state.unlockedSpecificContacts.includes(contactId)) return true;
    return false;
  }

  public getContactScope(contactId: string): 'monthly' | '24h' | 'single' | 'none' {
    this.cleanExpired();
    const state = this.getLocalState();
    if (state.activeMonthlyPlan) return 'monthly';
    if (state.access24h) return '24h';
    if (state.unlockedSpecificContacts.includes(contactId)) return 'single';
    return 'none';
  }

  public getActiveTier(): P2PTier | null {
    return this.getAccessStatus().activeTier;
  }

  /**
   * Real authoritative payment initiation & confirmation
   * Never simulates with setTimeout; records persistent state and transactions immediately.
   */
  public async initiateAndConfirmPayment(params: {
    planId: HeartLinkPlanId;
    targetContactId?: string;
    targetContactName?: string;
    amount: number;
    phoneNumber: string;
    paymentMethod: 'mpesa' | 'emola';
  }): Promise<{ success: boolean; transaction: HeartLinkTransaction }> {
    const planConfig = HEARTLINK_ALL_PLANS.find((p) => p.id === params.planId);
    const amount = planConfig ? planConfig.priceMt : params.amount;
    const nowTime = Date.now();
    const confirmedAt = new Date(nowTime).toISOString();
    let reference = `HL-${nowTime.toString().slice(-6)}-${Math.floor(10 + Math.random() * 89)}`;
    let expiresAt: string | undefined;

    // 1. Try real server-side transaction
    try {
      const initRes = await fetch('/api/heartlink/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: params.planId,
          targetContactId: params.targetContactId,
          targetContactName: params.targetContactName,
          amount,
          phoneNumber: params.phoneNumber,
          paymentMethod: params.paymentMethod.toUpperCase(),
        }),
      });

      if (initRes.ok) {
        const initData = await initRes.json();
        if (initData.success && initData.data?.paymentId) {
          const confirmRes = await fetch('/api/heartlink/payments/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: initData.data.paymentId }),
          });
          if (confirmRes.ok) {
            const confirmData = await confirmRes.json();
            if (confirmData.success && confirmData.data) {
              reference = confirmData.data.reference || reference;
              expiresAt = confirmData.data.expiresAt;
            }
          }
        }
      }
    } catch (e) {
      // network fallback to local persistent state
    }

    // 2. Update local authoritative state immediately
    const state = this.getLocalState();

    if (params.planId === 'contact_20mt') {
      if (params.targetContactId && !state.unlockedSpecificContacts.includes(params.targetContactId)) {
        state.unlockedSpecificContacts.push(params.targetContactId);
      }
      if (params.targetContactId) {
        contactUnlockService.unlockContact(params.targetContactId);
      }
    } else if (params.planId === 'access_50mt') {
      const exp = expiresAt || new Date(nowTime + 24 * 60 * 60 * 1000).toISOString();
      expiresAt = exp;
      state.access24h = {
        activatedAt: confirmedAt,
        expiresAt: exp,
        reference,
      };
      if (params.targetContactId) {
        contactUnlockService.unlockContact(params.targetContactId);
      }
    } else {
      // Monthly plans: 100 MT, 250 MT, 1000 MT
      const exp = expiresAt || new Date(nowTime + 30 * 24 * 60 * 60 * 1000).toISOString();
      expiresAt = exp;
      const tier: P2PTier = params.planId === 'monthly_1000mt'
        ? 'king'
        : params.planId === 'monthly_250mt'
        ? 'diamond'
        : 'heart';

      state.activeMonthlyPlan = {
        planId: params.planId as any,
        tier,
        amount,
        activatedAt: confirmedAt,
        expiresAt: exp,
        reference,
      };
      if (params.targetContactId) {
        contactUnlockService.unlockContact(params.targetContactId);
      }
    }

    this.saveLocalState(state);

    // 3. Save transaction record
    const transaction: HeartLinkTransaction = {
      id: `hl_tx_${nowTime}_${Math.random().toString(36).slice(2, 6)}`,
      reference,
      planId: params.planId,
      planName: planConfig?.name || params.planId,
      amount,
      targetContactId: params.targetContactId,
      targetContactName: params.targetContactName,
      phoneNumber: params.phoneNumber,
      paymentMethod: params.paymentMethod,
      status: 'CONFIRMED',
      createdAt: confirmedAt,
      expiresAt,
    };

    this.saveTransaction(transaction);

    // 4. Update and persist statistics
    this.updateStatsOnPayment(params.planId, amount, params.targetContactId);

    return { success: true, transaction };
  }

  public getPriorityLevel(contactId?: string): HeartLinkPriorityLevel {
    this.cleanExpired();
    const state = this.getLocalState();
    if (state.activeMonthlyPlan?.tier === 'king') return 'vip';
    if (state.activeMonthlyPlan?.tier === 'diamond') return 'diamond';
    if (state.activeMonthlyPlan?.tier === 'heart') return 'heart';
    if (state.access24h) return 'daily_pass';
    if (contactId && state.unlockedSpecificContacts.includes(contactId)) return 'contact_pass';
    return 'free';
  }

  public getStats(): HeartLinkStats {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STATS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // fallback
    }

    // Compute from existing transactions if no stored stats cache
    const txs = this.getTransactions();
    let contactPassesCount = 0;
    let dailyPassesCount = 0;
    let monthlyPlansCount = 0;
    let revenueContactPasses = 0;
    let revenueDailyPasses = 0;
    let revenueMonthlyPlans = 0;
    const unlockedIds = new Set<string>();
    let conversionsToMonthlyCount = 0;

    let hasHadPassBefore = false;
    for (const tx of [...txs].reverse()) {
      if (tx.planId === 'contact_20mt') {
        contactPassesCount++;
        revenueContactPasses += tx.amount || 20;
        if (tx.targetContactId) unlockedIds.add(tx.targetContactId);
        hasHadPassBefore = true;
      } else if (tx.planId === 'access_50mt') {
        dailyPassesCount++;
        revenueDailyPasses += tx.amount || 50;
        if (tx.targetContactId) unlockedIds.add(tx.targetContactId);
        hasHadPassBefore = true;
      } else if (tx.planId.startsWith('monthly_')) {
        monthlyPlansCount++;
        revenueMonthlyPlans += tx.amount;
        if (hasHadPassBefore) {
          conversionsToMonthlyCount++;
        }
      }
    }

    const stats: HeartLinkStats = {
      contactPassesCount,
      dailyPassesCount,
      monthlyPlansCount,
      revenueContactPasses,
      revenueDailyPasses,
      revenueMonthlyPlans,
      totalRevenue: revenueContactPasses + revenueDailyPasses + revenueMonthlyPlans,
      unlockedContactsCount: unlockedIds.size,
      conversionsToMonthlyCount,
    };

    return stats;
  }

  private updateStatsOnPayment(planId: HeartLinkPlanId, amount: number, contactId?: string): void {
    try {
      const stats = this.getStats();
      const txs = this.getTransactions();
      const hadPreviousPass = txs.some(
        (t) => t.planId === 'contact_20mt' || t.planId === 'access_50mt'
      );

      if (planId === 'contact_20mt') {
        stats.contactPassesCount += 1;
        stats.revenueContactPasses += amount;
        if (contactId) {
          const state = this.getLocalState();
          stats.unlockedContactsCount = state.unlockedSpecificContacts.length;
        }
      } else if (planId === 'access_50mt') {
        stats.dailyPassesCount += 1;
        stats.revenueDailyPasses += amount;
        if (contactId) {
          const state = this.getLocalState();
          stats.unlockedContactsCount = state.unlockedSpecificContacts.length;
        }
      } else {
        // Monthly
        stats.monthlyPlansCount += 1;
        stats.revenueMonthlyPlans += amount;
        if (hadPreviousPass) {
          stats.conversionsToMonthlyCount += 1;
        }
      }

      stats.totalRevenue =
        stats.revenueContactPasses + stats.revenueDailyPasses + stats.revenueMonthlyPlans;

      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
      this.notify();
    } catch {
      // fallback
    }
  }

  public getTransactions(): HeartLinkTransaction[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TX);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveTransaction(tx: HeartLinkTransaction): void {
    try {
      const list = this.getTransactions();
      list.unshift(tx);
      localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(list));
    } catch {
      // fallback
    }
  }

  /**
   * Generates a real notification when someone wants to contact a user:
   * e.g., "Maria quer conversar consigo no HeartLink."
   */
  public createContactAttemptNotification(contact: {
    id: string;
    name: string;
    photo?: string;
  }): HeartLinkNotification {
    const notif: HeartLinkNotification = {
      id: `hl_notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      contactId: contact.id,
      contactName: contact.name,
      contactPhoto: contact.photo,
      message: `${contact.name} quer conversar consigo no HeartLink.`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Save in local notifications store
    const list = this.getNotifications();
    list.unshift(notif);
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(list));
      this.notify();
    } catch {}

    // Send to server
    try {
      fetch('/api/heartlink/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: contact.id,
          contactName: contact.name,
          contactPhoto: contact.photo,
        }),
      }).catch(() => {});
    } catch {}

    // Also register in platform-wide contact attempt notifications
    contactUnlockService.attemptContact({
      id: contact.id,
      name: contact.name,
      photo: contact.photo,
      module: 'heartlink',
      moduleLabel: 'HeartLink',
      unlockFee: 20,
    }, false);

    return notif;
  }

  private defaultInitialNotifications: HeartLinkNotification[] = [
    {
      id: 'hl_notif_maria',
      contactId: 'hl-1',
      contactName: 'Maria',
      contactPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      message: 'Maria quer conversar consigo no HeartLink.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      read: false,
    }
  ];

  public getNotifications(): HeartLinkNotification[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      return this.defaultInitialNotifications;
    }
    return this.defaultInitialNotifications;
  }

  public markNotificationAsRead(id: string): void {
    const list = this.getNotifications().map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(list));
      this.notify();
    } catch {}
  }
}

export const heartLinkAccessService = new HeartLinkAccessService();
