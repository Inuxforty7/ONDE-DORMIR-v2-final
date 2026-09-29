/**
 * ONDE DORMIR MOÇAMBIQUE - Resilient API Client
 * Features: Offline detection, automatic retries, standardized error handling
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  isOffline?: boolean;
}

const API_BASE = '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Only load non-sensitive session token from sessionStorage if present
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem('odm_session_token');
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem('odm_session_token', token);
      } else {
        sessionStorage.removeItem('odm_session_token');
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 2
  ): Promise<ApiResponse<T>> {
    // 1. Offline Check
    if (typeof window !== 'undefined' && !navigator.onLine) {
      return {
        success: false,
        error: 'Sem ligação à Internet. Verifique a sua rede e tente novamente.',
        isOffline: true,
      };
    }

    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        // Parse JSON response safely
        let body: any;
        try {
          body = await response.json();
        } catch {
          body = null;
        }

        if (!response.ok) {
          const errorMsg =
            body?.error ||
            (response.status === 401
              ? 'Sessão expirada. Por favor, autentique-se novamente.'
              : response.status === 403
              ? 'Acesso não autorizado a este recurso.'
              : response.status === 429
              ? 'Muitas tentativas. Por favor, aguarde alguns instantes.'
              : 'Não foi possível carregar os dados. Tente novamente.');

          return {
            success: false,
            error: errorMsg,
          };
        }

        return {
          success: true,
          data: body?.data !== undefined ? body.data : body,
        };
      } catch (err: any) {
        // If last attempt failed, return graceful failure
        if (attempt === retries) {
          return {
            success: false,
            error: 'Falha temporária de comunicação. Toque para tentar novamente.',
            isOffline: typeof window !== 'undefined' && !navigator.onLine,
          };
        }
        // Exponential backoff wait
        await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(2, attempt)));
      }
    }

    return {
      success: false,
      error: 'Não foi possível concluir o pedido.',
    };
  }

  public get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
