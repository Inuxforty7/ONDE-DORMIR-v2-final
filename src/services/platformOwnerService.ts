import { apiClient, ApiResponse } from './apiClient';

export interface PlatformOwnerOverview {
  visitorsToday: number;
  activeUsersNow: number;
  visitsThisMonth: number;
  registeredUsers: number;
  registeredOwners: number;
  activeAccommodations: number;
  whatsappContacts: number;
  phoneCalls: number;
  mapViews: number;
  searches: number;
  pwaInstalls: number;
}

export interface HappeningNow {
  activeUsers: number;
  mostUsedModule: string;
  mostSearchedLocations: string[];
  popularSearches: Array<{ term: string; count: number }>;
}

export interface ModulePerformanceItem {
  name: string;
  searches?: number;
  views?: number;
  contacts?: number;
  activeCount?: number;
  guidesAvailable?: number;
  placesCatalogued?: number;
  rentalRequests?: number;
  fleetCount?: number;
  profilesCount?: number;
  interactions?: number;
  ordersCount?: number;
  storesCount?: number;
  sharePercent: number;
}

export interface PlatformOwnerMetrics {
  overview: PlatformOwnerOverview;
  happeningNow: HappeningNow;
  modulePerformance: {
    ondeDormir: ModulePerformanceItem;
    turismo: ModulePerformanceItem;
    rentACar: ModulePerformanceItem;
    heartlink: ModulePerformanceItem;
    loveShop: ModulePerformanceItem;
  };
  topLocations: Array<{ name: string; searches: number }>;
  topProperties: Array<{ id: string; name: string; province: string; contacts: number; views: number }>;
  growth: {
    last7Days: { visitors: number; growthRatePercent: string };
    last30Days: { visitors: number; growthRatePercent: string };
    last90Days: { visitors: number; growthRatePercent: string };
  };
  funnel: {
    searches: number;
    propertyViews: number;
    contacts: number;
    searchToViewRate: string;
    viewToContactRate: string;
  };
  governance: {
    pendingApprovalsCount: number;
    pendingProperties: Array<{
      id: string;
      name: string;
      type: string;
      province: string;
      city: string;
      phone: string;
      status: string;
    }>;
    pendingVerificationsCount: number;
    pendingVerifications: any[];
    reportsCount: number;
    reports: any[];
    premiumPropertiesCount: number;
    activeSubscriptionsCount: number;
    realRevenueMzn: number;
  };
}

const PLATFORM_OWNER_TOKEN_KEY = 'odm_platform_owner_session';

class PlatformOwnerService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem(PLATFORM_OWNER_TOKEN_KEY);
    }
  }

  public isLoggedIn(): boolean {
    return Boolean(this.token);
  }

  public async login(masterPasscode: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const res = await apiClient.post<{ token: string; user: any }>('/platform-owner/auth', {
      masterPasscode,
    });

    if (res.success && res.data?.token) {
      this.token = res.data.token;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(PLATFORM_OWNER_TOKEN_KEY, res.data.token);
      }
      apiClient.setToken(res.data.token);
    }

    return res;
  }

  public logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(PLATFORM_OWNER_TOKEN_KEY);
    }
    apiClient.setToken(null);
  }

  public async getMetrics(): Promise<ApiResponse<PlatformOwnerMetrics>> {
    if (this.token) {
      apiClient.setToken(this.token);
    }
    return apiClient.get<PlatformOwnerMetrics>('/platform-owner/metrics');
  }
}

export const platformOwnerService = new PlatformOwnerService();
