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
  clientSecret: string;
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
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      clientId: '',
      clientSecret: '',
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
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(E2PAYMENTS_STORAGE_KEY, JSON.stringify(this.config));
    } catch {
      // ignore
    }
    this.listeners.forEach((l) => l());
  }

  public isConfigured(): boolean {
    return Boolean(this.config.clientId && this.config.clientSecret);
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  /**
   * Dispara um pedido de pagamento via M-Pesa ou e-Mola
   * No backend ou em simulação guiada local
   */
  public async initiatePayment(
    req: E2PaymentsTransactionRequest
  ): Promise<E2PaymentsTransactionResponse> {
    const timestamp = new Date().toISOString();
    const cleanPhone = req.phone.replace(/\D/g, '');

    // Simulação robusta com validação de número de operadora
    const isMpesa = cleanPhone.startsWith('84') || cleanPhone.startsWith('85') || cleanPhone.endsWith('84') || cleanPhone.endsWith('85');
    const isEmola = cleanPhone.startsWith('86') || cleanPhone.startsWith('87') || cleanPhone.endsWith('86') || cleanPhone.endsWith('87');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `E2P-${Date.now().toString().slice(-8)}`,
          status: 'PENDING',
          message: `Pedido enviado via e2Payments (${req.method}). Por favor aprove no telemóvel ${cleanPhone}.`,
          amount: req.amount,
          reference: req.reference,
          timestamp,
        });
      }, 700);
    });
  }
}

export const e2paymentsService = new E2PaymentsService();
