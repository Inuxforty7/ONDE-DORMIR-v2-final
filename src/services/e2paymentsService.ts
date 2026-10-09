/**
 * e2Payments Integration Service
 * Baseado no ecossistema oficial e2Payments / Explicador Moçambique
 * Portal de Registo / Conta Grátis: https://e2payments.explicador.co.mz/
 *
 * Oferece integração direta com M-Pesa (Vodacom) e e-Mola (Movitel)
 * com suporte para:
 * - Conta Grátis (Plano Basic)
 * - Credenciais API: Client ID, Client Secret, Wallet ID
 * - Criação de pedidos C2B (Push USSD) para clientes
 * - Consulta de estado de transações
 */

export interface E2PaymentsConfig {
  clientId: string;
  walletId: string;
  isSandbox: boolean;
  registeredPhone?: string;
  companyName?: string;
}

export interface E2PaymentsTransactionRequest {
  amount: number;
  phone: string; // ex: 84XXXXXXX ou 86/87XXXXXXX
  reference: string;
  method: 'MPESA' | 'EMOLA';
  description: string;
}

export interface E2PaymentsTransactionResponse {
  success: boolean;
  transactionId?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  message: string;
  amount: number;
  reference: string;
  timestamp: string;
}

const E2PAYMENTS_STORAGE_KEY = 'onde_dormir_e2payments_config';

export const E2PAYMENTS_OFFICIAL_URLS = {
  createAccountFree: 'https://e2payments.explicador.co.mz/register',
  loginPortal: 'https://e2payments.explicador.co.mz/login',
  dashboard: 'https://e2payments.explicador.co.mz/dashboard',
  whatsappSupport: 'https://wa.me/258847282824?text=Ol%C3%A1!%20Preciso%20de%20apoio%20na%20integra%C3%A7%C3%A3o%20e2Payments%20para%20o%20Onde%20Dormir%20Mo%C3%A7ambique.',
  githubRepo: 'https://github.com/Explicador/Mpesa-eMola-e2PaymentsApp',
};

class E2PaymentsService {
  private config: E2PaymentsConfig;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): E2PaymentsConfig {
    try {
      const saved = localStorage.getItem(E2PAYMENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Sanitizar e remover permanentemente qualquer segredo residual do localStorage
        if ('clientSecret' in parsed) {
          delete parsed.clientSecret;
          localStorage.setItem(E2PAYMENTS_STORAGE_KEY, JSON.stringify(parsed));
        }
        return {
          clientId: parsed.clientId || '',
          walletId: parsed.walletId || '',
          isSandbox: parsed.isSandbox ?? true,
          companyName: parsed.companyName || 'Águia Soluções & Serviços - Onde Dormir Moçambique',
          registeredPhone: parsed.registeredPhone || '+258847282824',
        };
      }
    } catch {
      // ignore
    }
    return {
      clientId: '',
      walletId: '',
      isSandbox: true,
      companyName: 'Águia Soluções & Serviços - Onde Dormir Moçambique',
      registeredPhone: '+258847282824',
    };
  }

  public getConfig(): E2PaymentsConfig {
    return { ...this.config };
  }

  public saveConfig(newConfig: Partial<E2PaymentsConfig>): void {
    const sanitized: E2PaymentsConfig = {
      clientId: (newConfig.clientId ?? this.config.clientId).trim(),
      walletId: (newConfig.walletId ?? this.config.walletId).trim(),
      isSandbox: Boolean(newConfig.isSandbox ?? this.config.isSandbox),
      companyName: newConfig.companyName ?? this.config.companyName,
      registeredPhone: newConfig.registeredPhone ?? this.config.registeredPhone,
    };
    this.config = sanitized;
    try {
      localStorage.setItem(E2PAYMENTS_STORAGE_KEY, JSON.stringify(sanitized));
    } catch {
      // ignore
    }
    this.listeners.forEach((l) => l());
  }

  public isConfigured(): boolean {
    return Boolean(this.config.clientId);
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  /**
   * Dispara um pedido de pagamento via backend seguro (/api/payments/initiate)
   * Sem expor credenciais no cliente e sem simulações falsas com timeouts
   */
  public async initiatePayment(
    req: E2PaymentsTransactionRequest
  ): Promise<E2PaymentsTransactionResponse> {
    const timestamp = new Date().toISOString();
    const cleanPhone = req.phone.replace(/\D/g, '');

    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'GENERAL_SERVICE',
          targetId: req.reference,
          amount: req.amount,
          paymentMethod: req.method,
          phoneNumber: cleanPhone,
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        return {
          success: false,
          status: 'FAILED',
          message: errorJson?.error || 'Falha ao iniciar pagamento no servidor.',
          amount: req.amount,
          reference: req.reference,
          timestamp,
        };
      }

      const json = await res.json();
      return {
        success: true,
        transactionId: json.data?.paymentId,
        status: 'PENDING',
        message: json.data?.instructions || `Pedido enviado via e2Payments (${req.method}). Aguarde confirmação no telemóvel ${cleanPhone}.`,
        amount: req.amount,
        reference: json.data?.reference || req.reference,
        timestamp,
      };
    } catch {
      return {
        success: false,
        status: 'FAILED',
        message: 'Servidor de pagamentos indisponível. Tente novamente mais tarde.',
        amount: req.amount,
        reference: req.reference,
        timestamp,
      };
    }
  }
}

export const e2paymentsService = new E2PaymentsService();
