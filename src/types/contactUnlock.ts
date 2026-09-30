export type PlatformModule = 'accommodation' | 'guide' | 'car' | 'heartlink' | 'loveshop';

export interface ContactAttemptNotification {
  id: string;
  targetId: string;
  targetName: string;
  targetPhoto?: string;
  module: PlatformModule;
  moduleLabel: string;
  timestamp: string; // ISO string
  interestedCount: number; // Quantidade de clientes/interessados
  read: boolean;
  unlockFee: number; // Ex: 1000 MT/mês
  ownerPhone?: string;
  isUnlocked?: boolean;
}

export interface LockedContactTarget {
  id: string;
  name: string;
  photo?: string;
  phone?: string;
  whatsapp?: string;
  module: PlatformModule;
  moduleLabel: string;
  unlockFee?: number;
}
