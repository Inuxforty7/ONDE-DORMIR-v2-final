/**
 * ONDE DORMIR MOÇAMBIQUE - Server-Authoritative Auth Service
 * Enforces RBAC permissions, token management, and ownership validation
 */

import { apiClient } from './apiClient';
import { UserRole, Permission, hasPermission, canManageResource } from '../types/rbac';
import { VerificationLevel } from '../types/database';

export interface AuthUser {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: UserRole;
  phoneVerified: boolean;
  verificationLevel: VerificationLevel;
  isPremium: boolean;
  ownerId?: string | null;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private listeners: Array<(user: AuthUser | null) => void> = [];

  constructor() {
    this.refreshUser();
  }

  public subscribe(listener: (user: AuthUser | null) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public can(permission: Permission): boolean {
    if (!this.currentUser) return false;
    return hasPermission(this.currentUser.role, permission);
  }

  public canManage(resourceOwnerId: string): boolean {
    if (!this.currentUser) return false;
    return canManageResource(this.currentUser.role, this.currentUser.id, resourceOwnerId);
  }

  public async refreshUser(): Promise<AuthUser | null> {
    const token = apiClient.getToken();
    if (!token) {
      this.currentUser = null;
      this.notify();
      return null;
    }

    const res = await apiClient.get<AuthUser>('/auth/me');
    if (res.success && res.data) {
      this.currentUser = res.data;
    } else {
      this.currentUser = null;
      apiClient.setToken(null);
    }
    this.notify();
    return this.currentUser;
  }

  public setSession(token: string, user: AuthUser) {
    apiClient.setToken(token);
    this.currentUser = user;
    this.notify();
  }

  public logout() {
    apiClient.setToken(null);
    this.currentUser = null;
    this.notify();
  }
}

export const authService = new AuthService();
