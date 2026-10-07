export interface FriendshipRecord {
  id: string;
  user1Id: string;
  user1Name: string;
  user1Photo: string;
  user2Id: string;
  user2Name: string;
  user2Photo: string;
  user1Confirmed: boolean;
  user2Confirmed: boolean;
  status: 'pending' | 'confirmed';
  confirmedAt?: string;
  city?: string;
}

export interface MarriageRecord {
  id: string;
  user1Id: string;
  user1Name: string;
  user1Photo: string;
  user2Id: string;
  user2Name: string;
  user2Photo: string;
  user1Confirmed: boolean;
  user2Confirmed: boolean;
  status: 'pending' | 'confirmed';
  confirmedAt?: string;
  city?: string;
  weddingDate?: string;
}

export type P2PTier = 'heart' | 'diamond' | 'king';

export interface P2PGroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  text: string;
  time: string;
  createdAt: number;
}

const FRIENDSHIPS_STORAGE_KEY = 'onde_dormir_heartlink_friendships';
const MARRIAGES_STORAGE_KEY = 'onde_dormir_heartlink_marriages';

const INITIAL_FRIENDSHIPS: FriendshipRecord[] = [
  {
    id: 'f_hl-1_hl-2',
    user1Id: 'hl-1',
    user1Name: 'Ana Sofia',
    user1Photo: '/src/assets/images/moz_profile_ana_1790448736252.jpg',
    user2Id: 'hl-2',
    user2Name: 'Carlos Macamo',
    user2Photo: '/src/assets/images/moz_profile_carlos_1790448747366.jpg',
    user1Confirmed: true,
    user2Confirmed: true,
    status: 'confirmed',
    confirmedAt: '12/08/2026',
    city: 'Maputo',
  },
  {
    id: 'f_hl-3_hl-4',
    user1Id: 'hl-3',
    user1Name: 'Teresa Cossa',
    user1Photo: '/src/assets/images/moz_profile_teresa_1790448762512.jpg',
    user2Id: 'hl-4',
    user2Name: 'Paulo Manhique',
    user2Photo: '/src/assets/images/moz_profile_paulo_1790448772097.jpg',
    user1Confirmed: true,
    user2Confirmed: true,
    status: 'confirmed',
    confirmedAt: '28/08/2026',
    city: 'Inhambane',
  },
  {
    id: 'f_hl-5_hl-6',
    user1Id: 'hl-5',
    user1Name: 'Elisa Nhantumbo',
    user1Photo: '/src/assets/images/moz_profile_elisa_1790448779859.jpg',
    user2Id: 'hl-6',
    user2Name: 'Mussá Ibraimo',
    user2Photo: '/src/assets/images/moz_profile_mussa_1790448788329.jpg',
    user1Confirmed: true,
    user2Confirmed: true,
    status: 'confirmed',
    confirmedAt: '15/09/2026',
    city: 'Nampula',
  },
];

const INITIAL_MARRIAGES: MarriageRecord[] = [
  {
    id: 'm_hl-3_hl-4',
    user1Id: 'hl-3',
    user1Name: 'Teresa Cossa',
    user1Photo: '/src/assets/images/moz_profile_teresa_1790448762512.jpg',
    user2Id: 'hl-4',
    user2Name: 'Paulo Manhique',
    user2Photo: '/src/assets/images/moz_profile_paulo_1790448772097.jpg',
    user1Confirmed: true,
    user2Confirmed: true,
    status: 'confirmed',
    confirmedAt: '04/09/2026',
    weddingDate: '2026',
    city: 'Inhambane',
  },
];

export const heartLinkService = {
  getPairKey(idA: string, idB: string): string {
    return [idA, idB].sort().join('_');
  },

  // ================= FRIENDSHIPS =================
  getFriendships(): FriendshipRecord[] {
    const raw = localStorage.getItem(FRIENDSHIPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FRIENDSHIPS_STORAGE_KEY, JSON.stringify(INITIAL_FRIENDSHIPS));
      return INITIAL_FRIENDSHIPS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FRIENDSHIPS;
    }
  },

  saveFriendships(records: FriendshipRecord[]): void {
    localStorage.setItem(FRIENDSHIPS_STORAGE_KEY, JSON.stringify(records));
  },

  getConfirmedFriendshipsCount(): number {
    return this.getFriendships().filter((f) => f.status === 'confirmed').length;
  },

  confirmFriendship(params: {
    user1Id: string;
    user1Name: string;
    user1Photo: string;
    user2Id: string;
    user2Name: string;
    user2Photo: string;
    city?: string;
    asUser: 1 | 2;
  }): { record: FriendshipRecord; isNew: boolean; becameConfirmed: boolean } {
    const list = this.getFriendships();
    const pairKey = this.getPairKey(params.user1Id, params.user2Id);
    const existingIndex = list.findIndex(
      (f) => this.getPairKey(f.user1Id, f.user2Id) === pairKey
    );

    if (existingIndex >= 0) {
      const existing = list[existingIndex];
      if (existing.status === 'confirmed') {
        return { record: existing, isNew: false, becameConfirmed: false };
      }

      // Check which user confirmed
      let u1 = existing.user1Confirmed;
      let u2 = existing.user2Confirmed;
      if (params.asUser === 1) u1 = true;
      if (params.asUser === 2) u2 = true;

      const bothConfirmed = u1 && u2;
      const updated: FriendshipRecord = {
        ...existing,
        user1Confirmed: u1,
        user2Confirmed: u2,
        status: bothConfirmed ? 'confirmed' : 'pending',
        confirmedAt: bothConfirmed ? new Date().toLocaleDateString('pt-MZ') : existing.confirmedAt,
      };

      list[existingIndex] = updated;
      this.saveFriendships(list);
      return { record: updated, isNew: false, becameConfirmed: bothConfirmed };
    }

    // New request
    const isU1 = params.asUser === 1;
    const isU2 = params.asUser === 2;
    const both = isU1 && isU2;
    const newRecord: FriendshipRecord = {
      id: `f_${pairKey}`,
      user1Id: params.user1Id,
      user1Name: params.user1Name,
      user1Photo: params.user1Photo,
      user2Id: params.user2Id,
      user2Name: params.user2Name,
      user2Photo: params.user2Photo,
      user1Confirmed: isU1,
      user2Confirmed: isU2,
      status: both ? 'confirmed' : 'pending',
      confirmedAt: both ? new Date().toLocaleDateString('pt-MZ') : undefined,
      city: params.city || 'Maputo',
    };

    list.unshift(newRecord);
    this.saveFriendships(list);
    return { record: newRecord, isNew: true, becameConfirmed: both };
  },

  // ================= MARRIAGES =================
  getMarriages(): MarriageRecord[] {
    const raw = localStorage.getItem(MARRIAGES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MARRIAGES_STORAGE_KEY, JSON.stringify(INITIAL_MARRIAGES));
      return INITIAL_MARRIAGES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MARRIAGES;
    }
  },

  saveMarriages(records: MarriageRecord[]): void {
    localStorage.setItem(MARRIAGES_STORAGE_KEY, JSON.stringify(records));
  },

  getConfirmedMarriagesCount(): number {
    return this.getMarriages().filter((m) => m.status === 'confirmed').length;
  },

  confirmMarriage(params: {
    user1Id: string;
    user1Name: string;
    user1Photo: string;
    user2Id: string;
    user2Name: string;
    user2Photo: string;
    city?: string;
    asUser: 1 | 2;
  }): { record: MarriageRecord; isNew: boolean; becameConfirmed: boolean } {
    const list = this.getMarriages();
    const pairKey = this.getPairKey(params.user1Id, params.user2Id);
    const existingIndex = list.findIndex(
      (m) => this.getPairKey(m.user1Id, m.user2Id) === pairKey
    );

    if (existingIndex >= 0) {
      const existing = list[existingIndex];
      if (existing.status === 'confirmed') {
        return { record: existing, isNew: false, becameConfirmed: false };
      }

      let u1 = existing.user1Confirmed;
      let u2 = existing.user2Confirmed;
      if (params.asUser === 1) u1 = true;
      if (params.asUser === 2) u2 = true;

      const bothConfirmed = u1 && u2;
      const updated: MarriageRecord = {
        ...existing,
        user1Confirmed: u1,
        user2Confirmed: u2,
        status: bothConfirmed ? 'confirmed' : 'pending',
        confirmedAt: bothConfirmed ? new Date().toLocaleDateString('pt-MZ') : existing.confirmedAt,
      };

      list[existingIndex] = updated;
      this.saveMarriages(list);
      return { record: updated, isNew: false, becameConfirmed: bothConfirmed };
    }

    const isU1 = params.asUser === 1;
    const isU2 = params.asUser === 2;
    const both = isU1 && isU2;
    const newRecord: MarriageRecord = {
      id: `m_${pairKey}`,
      user1Id: params.user1Id,
      user1Name: params.user1Name,
      user1Photo: params.user1Photo,
      user2Id: params.user2Id,
      user2Name: params.user2Name,
      user2Photo: params.user2Photo,
      user1Confirmed: isU1,
      user2Confirmed: isU2,
      status: both ? 'confirmed' : 'pending',
      confirmedAt: both ? new Date().toLocaleDateString('pt-MZ') : undefined,
      city: params.city || 'Maputo',
      weddingDate: '2026',
    };

    list.unshift(newRecord);
    this.saveMarriages(list);
    return { record: newRecord, isNew: true, becameConfirmed: both };
  },

  // ================= P2P ACTIVE MEMBERSHIP =================
  getActiveP2PTier(visibility?: {
    isUnlocked: boolean;
    expiresAt?: string;
    planId?: string;
  } | null): P2PTier | null {
    if (!visibility || !visibility.isUnlocked) return null;
    if (visibility.expiresAt) {
      const exp = new Date(visibility.expiresAt).getTime();
      if (exp <= Date.now()) return null;
    }

    if (visibility.planId === 'vis_30d') return 'king';
    if (visibility.planId === 'vis_7d') return 'diamond';
    if (visibility.planId === 'vis_24h') return 'heart';

    return 'heart';
  },

  // Helper to determine the single active P2P tier for any profile
  getProfileP2PTier(profile: any): P2PTier | null {
    if (!profile) return null;

    // Check if profile is myProfile (user's own profile)
    const savedVis = localStorage.getItem('onde_dormir_heartlink_visibility');
    const myProfileSaved = localStorage.getItem('onde_dormir_my_heartlink_profile');
    let myId: string | null = null;
    if (myProfileSaved) {
      try {
        const parsed = JSON.parse(myProfileSaved);
        myId = parsed.id;
      } catch {}
    }

    if ((myId && profile.id === myId) || profile.id?.startsWith('my-') || profile.isMyProfile) {
      if (savedVis) {
        try {
          const vis = JSON.parse(savedVis);
          return this.getActiveP2PTier(vis);
        } catch {}
      }
    }

    // Check profile's explicit expiration date
    if (profile.visibilityExpiresAt && new Date(profile.visibilityExpiresAt).getTime() < Date.now()) {
      return null;
    }

    if (profile.activeP2PTier) return profile.activeP2PTier;
    if (profile.p2pTier) return profile.p2pTier;

    // Strict non-overlapping partitioning for showcase profiles
    // Every showcase profile belongs strictly to ONE single tier
    const str = String(profile.id || profile.name || '');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const mod = Math.abs(hash) % 3;
    if (mod === 0) return 'heart';
    if (mod === 1) return 'diamond';
    return 'king';
  },

  // Get active members assigned STRICTLY to a single tier (NO mixing across tiers)
  getTierMembers(tier: P2PTier, allProfiles: any[], myProfile?: any): any[] {
    const list = allProfiles.filter((p) => {
      if (myProfile && p.id === myProfile.id) return false;
      return this.getProfileP2PTier(p) === tier;
    });

    if (myProfile) {
      const myTier = this.getProfileP2PTier(myProfile);
      if (myTier === tier) {
        return [myProfile, ...list];
      }
    }

    return list;
  },

  // Direct contact consent tracking per user
  hasConsentForDirectContact(targetUserId: string): boolean {
    const raw = localStorage.getItem(`onde_dormir_hl_contact_consent_${targetUserId}`);
    return raw ? JSON.parse(raw) : true; // Default consent granted for demo, persisted in localStorage
  },

  setConsentForDirectContact(targetUserId: string, consent: boolean): void {
    localStorage.setItem(`onde_dormir_hl_contact_consent_${targetUserId}`, JSON.stringify(consent));
  },

  // ================= P2P GROUP MESSAGES =================
  getP2PMessages(tier: P2PTier): P2PGroupMessage[] {
    const raw = localStorage.getItem(`onde_dormir_p2p_chat_${tier}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    const defaults: Record<P2PTier, P2PGroupMessage[]> = {
      heart: [
        {
          id: 'p2p-h-1',
          senderId: 'hl-1',
          senderName: 'Ana Sofia',
          senderPhoto: '/src/assets/images/moz_profile_ana_1790448736252.jpg',
          text: 'Olá a todos no grupo ♥! Quem estiver em Maputo hoje para um café, mande mensagem!',
          time: '14:20',
          createdAt: Date.now() - 3600000,
        },
      ],
      diamond: [
        {
          id: 'p2p-d-1',
          senderId: 'hl-3',
          senderName: 'Teresa Cossa',
          senderPhoto: '/src/assets/images/moz_profile_teresa_1790448762512.jpg',
          text: 'Boa tarde pessoal do grupo ◆! Ótimo fim de semana para todos.',
          time: '15:10',
          createdAt: Date.now() - 7200000,
        },
      ],
      king: [
        {
          id: 'p2p-k-1',
          senderId: 'hl-2',
          senderName: 'Carlos Macamo',
          senderPhoto: '/src/assets/images/moz_profile_carlos_1790448747366.jpg',
          text: 'Saudações aos membros VIP ♛! Disponível para contactos e conversas diretas.',
          time: '16:05',
          createdAt: Date.now() - 10800000,
        },
      ],
    };

    localStorage.setItem(`onde_dormir_p2p_chat_${tier}`, JSON.stringify(defaults[tier]));
    return defaults[tier];
  },

  sendP2PMessage(tier: P2PTier, msg: Omit<P2PGroupMessage, 'id' | 'createdAt'>): P2PGroupMessage {
    const current = this.getP2PMessages(tier);
    const newMsg: P2PGroupMessage = {
      ...msg,
      id: `p2p_${tier}_${Date.now()}`,
      createdAt: Date.now(),
    };
    const updated = [...current, newMsg];
    localStorage.setItem(`onde_dormir_p2p_chat_${tier}`, JSON.stringify(updated));
    return newMsg;
  },
};
