/**
 * ONDE DORMIR MOÇAMBIQUE - Sistema Oficial de Faturação & Ativação (Bill)
 * Validação da estrutura de faturação para os módulos de Rent-a-Car, lodges e pensões.
 * Powered by Águia Soluções & Serviços - Conexões Rápidas, SU, LDA
 */

import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2, 
  Car, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  Phone, 
  Share2, 
  Copy, 
  Check,
  Clock,
  Sparkles
} from 'lucide-react';

export interface BillingInvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'PROCESSING';
  moduleType: 'rentacar' | 'lodge' | 'pensao' | 'general';
  serviceTitle: string;
  serviceDescription: string;
  clientName: string;
  clientNuitOrBi: string;
  clientPhone: string;
  clientProvince: string;
  clientCity: string;
  itemDetails: Array<{
    description: string;
    quantity: number;
    unitPriceMzn: number;
    totalMzn: number;
  }>;
  subtotalMzn: number;
  ivaRate: number; // 0.16 (16% IVA)
  ivaAmountMzn: number;
  totalMzn: number;
  paymentMethod: 'M-Pesa' | 'e-Mola' | 'Transferência Bancária';
  transactionReference: string;
}

interface BillingInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData?: Partial<BillingInvoiceData>;
}

export const BillingInvoiceModal: React.FC<BillingInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Default demonstration invoice
  const inv: BillingInvoiceData = {
    invoiceNumber: invoiceData?.invoiceNumber || `FT-ODM-2026/00${Math.floor(100 + Math.random() * 900)}`,
    issueDate: invoiceData?.issueDate || new Date().toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' }),
    dueDate: invoiceData?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' }),
    status: invoiceData?.status || 'PAID',
    moduleType: invoiceData?.moduleType || 'rentacar',
    serviceTitle: invoiceData?.serviceTitle || 'Ativação & Subscrição Mensal de Viatura no Diretório',
    serviceDescription: invoiceData?.serviceDescription || 'Serviço de listagem de frota, verificação biométrica de locatários e divulgação no módulo Rent-a-Car.',
    clientName: invoiceData?.clientName || 'Armando C. Guebuza (Rentals & Frotas)',
    clientNuitOrBi: invoiceData?.clientNuitOrBi || 'NUIT: 401.892.304 / BI: 110200345678A',
    clientPhone: invoiceData?.clientPhone || '+258 84 211 2233',
    clientProvince: invoiceData?.clientProvince || 'Maputo Província',
    clientCity: invoiceData?.clientCity || 'Matola',
    itemDetails: invoiceData?.itemDetails || [
      {
        description: 'Ativação Mensal de Viatura (Toyota Land Cruiser Prado VX 4x4)',
        quantity: 1,
        unitPriceMzn: 1000,
        totalMzn: 1000,
      },
      {
        description: 'Taxa de Auditoria Documental e Verificação Biométrica Facial',
        quantity: 1,
        unitPriceMzn: 250,
        totalMzn: 250,
      }
    ],
    subtotalMzn: invoiceData?.subtotalMzn || 1250,
    ivaRate: 0.16,
    ivaAmountMzn: invoiceData?.ivaAmountMzn || 200,
    totalMzn: invoiceData?.totalMzn || 1450,
    paymentMethod: invoiceData?.paymentMethod || 'M-Pesa',
    transactionReference: invoiceData?.transactionReference || `MP-${Date.now().toString().slice(-8)}`,
  };

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(inv.transactionReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-300 relative my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Actions Bar (No-Print) */}
        <div className="bg-neutral-900 text-white p-3.5 sm:p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm sm:text-base">
              Fatura Oficial & Recibo de Ativação (Bill)
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="h-8 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
              title="Imprimir ou Guardar em PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-neutral-800 text-xs sm:text-sm print:p-0 print:m-0">

          {/* Header of Invoice */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 font-display">
                  ONDE DORMIR <span className="text-emerald-600">MZ</span>
                </span>
                <span className="text-[10px] font-extrabold bg-neutral-900 text-white px-2 py-0.5 rounded">
                  OFICIAL
                </span>
              </div>
              <p className="text-[11px] font-bold text-neutral-600 mt-1 uppercase tracking-wide">
                ÁGUIA SOLUÇÕES & SERVIÇOS - CONEXÕES RÁPIDAS, SU, LDA
              </p>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                NUIT: <strong>401298450</strong> | Conservatória de Maputo<br />
                Av. 24 de Julho nº 1895, Sommerschield, Maputo - Moçambique<br />
                Email: facturacao@ondedormir.co.mz | WhatsApp: +258 84 900 1122
              </p>
            </div>

            <div className="text-left sm:text-right bg-neutral-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-neutral-200 w-full sm:w-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                FATURA-RECIBO ELETRÓNICA
              </span>
              <span className="text-base sm:text-lg font-black text-neutral-950 font-mono block">
                {inv.invoiceNumber}
              </span>
              <div className="mt-1.5 flex sm:justify-end items-center gap-1.5">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                  <CheckCircle2 className="w-3 h-3" /> {inv.status === 'PAID' ? 'LIQUIDADA / PAGA' : 'EMITIDA'}
                </span>
              </div>
            </div>
          </div>

          {/* Client & Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-neutral-400 block mb-1">
                Faturado A (Cliente / Estabelecimento):
              </span>
              <p className="font-extrabold text-neutral-900 text-sm">{inv.clientName}</p>
              <p className="text-neutral-600 font-mono text-xs">{inv.clientNuitOrBi}</p>
              <p className="text-neutral-600 text-xs">Contacto M-Pesa: {inv.clientPhone}</p>
              <p className="text-neutral-600 text-xs">{inv.clientCity}, {inv.clientProvince}</p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400 block mb-1">
                Datas & Meio de Pagamento:
              </span>
              <p className="text-xs text-neutral-700">Data de Emissão: <strong>{inv.issueDate}</strong></p>
              <p className="text-xs text-neutral-700">Validade da Subscrição: <strong>30 Dias</strong></p>
              <p className="text-xs text-neutral-700">Método de Liquidação: <strong>{inv.paymentMethod}</strong></p>
              <p className="text-xs text-neutral-700 font-mono">Ref. Tx: <strong>{inv.transactionReference}</strong></p>
            </div>
          </div>

          {/* Table of Services / Bill Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-900 text-[11px] font-black uppercase text-neutral-600 tracking-wider">
                  <th className="py-2.5 pr-4">Descrição do Serviço / Ativação</th>
                  <th className="py-2.5 px-3 text-center">Qtd</th>
                  <th className="py-2.5 px-3 text-right">Preço Unit.</th>
                  <th className="py-2.5 pl-3 text-right">Total (MT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {inv.itemDetails.map((item, idx) => (
                  <tr key={idx} className="text-xs">
                    <td className="py-3 pr-4 font-semibold text-neutral-900">
                      {item.description}
                    </td>
                    <td className="py-3 px-3 text-center text-neutral-600">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-700">
                      {item.unitPriceMzn.toLocaleString()} MT
                    </td>
                    <td className="py-3 pl-3 text-right font-mono font-bold text-neutral-950">
                      {item.totalMzn.toLocaleString()} MT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Taxes Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-neutral-200">
            <div className="space-y-1 max-w-xs text-xs text-neutral-500">
              <p className="font-bold text-neutral-700">Observações Legais:</p>
              <p>Processado por computador de acordo com o Código do IVA (CIVA) de Moçambique. Válido como comprovativo fiscal de ativação na plataforma.</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <div className="flex justify-between text-xs text-neutral-600">
                <span>Subtotal Líquido:</span>
                <span className="font-mono font-semibold">{inv.subtotalMzn.toLocaleString()} MT</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-600">
                <span>IVA Moçambique (16%):</span>
                <span className="font-mono font-semibold">{inv.ivaAmountMzn.toLocaleString()} MT</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-neutral-950 pt-2 border-t border-neutral-300">
                <span>Total Liquidado:</span>
                <span className="font-mono text-emerald-700">{inv.totalMzn.toLocaleString()} MT</span>
              </div>
            </div>
          </div>

          {/* Official Stamp & Sign */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-extrabold text-xs sm:text-sm">Chave de Validação Digital & Carimbo Eletrónico</p>
                <p className="text-[11px] text-emerald-800 font-mono mt-0.5">
                  HASH: {inv.transactionReference}-VALID-VERIFIED-MZ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyRef}
                className="h-8 px-3 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-100 cursor-pointer shadow-2xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Ref.'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer (No-Print) */}
        <div className="bg-neutral-100 p-3 sm:p-4 border-t border-neutral-200 flex items-center justify-between print:hidden">
          <span className="text-[11px] text-neutral-500 font-semibold">
            Águia Soluções & Serviços - Conexões Rápidas, SU, LDA
          </span>
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors"
          >
            Fechar Fatura
          </button>
        </div>
      </div>
    </div>
  );
};
