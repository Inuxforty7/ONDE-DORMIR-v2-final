import React, { useState } from 'react';
import { 
  X, 
  Store, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  FileText, 
  Sparkles, 
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import { LoveShopStore } from '../types';
import { MOZ_PROVINCES_LIST } from './ExploreTab';
import { BillingInvoiceModal, BillingInvoiceData } from './BillingInvoiceModal';
import { TermsModal } from './TermsModal';

interface RegisterLoveShopStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStore: (store: LoveShopStore) => void;
  defaultCity?: string;
  defaultProvince?: string;
}

export const RegisterLoveShopStoreModal: React.FC<RegisterLoveShopStoreModalProps> = ({
  isOpen,
  onClose,
  onAddStore,
  defaultCity = 'Maputo',
  defaultProvince = 'Maputo Cidade',
}) => {
  const [step, setStep] = useState<'form' | 'subscription' | 'success'>('form');

  // Form State
  const [storeName, setStoreName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerNuitOrBi, setOwnerNuitOrBi] = useState('');
  const [city, setCity] = useState(defaultCity);
  const [province, setProvince] = useState(defaultProvince);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola'>('mpesa');
  const [paymentPhone, setPaymentPhone] = useState('');

  // Invoice Modal
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<BillingInvoiceData | null>(null);

  // Terms and Conditions State
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleProceedToSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !ownerName || !phone) return;
    setPaymentPhone(whatsapp || phone);
    setStep('subscription');
  };

  const handleConfirmAndActivate = () => {
    const newStore: LoveShopStore = {
      id: `store-${Date.now()}`,
      name: storeName,
      slogan: slogan || 'Artigos e presentes especiais selecionados com carinho.',
      logo: '🎁',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      verified: true,
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 1,
      city,
      province,
      address,
      phone: phone.startsWith('+') ? phone : `+258${phone.replace(/[^0-9]/g, '')}`,
      whatsapp: (whatsapp || phone).replace(/[^0-9]/g, ''),
      ownerName,
      ownerNuitOrBi,
      monthlyFee: 1000,
      isSubscriptionActive: true,
      registeredAt: new Date().toISOString().split('T')[0],
      platformTenure: 'Iniciou hoje na plataforma',
    };

    // Prepare Invoice
    const invoiceNum = `INV-LS-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceData: BillingInvoiceData = {
      invoiceNumber: invoiceNum,
      issueDate: new Date().toLocaleDateString('pt-MZ'),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-MZ'),
      status: 'PAID',
      moduleType: 'lodge',
      serviceTitle: 'Ativação de Loja Comercial Love Shop',
      serviceDescription: `Subscrição Mensal Love Shop • Ativação de Loja Comercial (${storeName})`,
      clientName: `${storeName} (${ownerName})`,
      clientNuitOrBi: ownerNuitOrBi || '400987654',
      clientPhone: phone,
      clientProvince: province,
      clientCity: city,
      itemDetails: [
        {
          description: `Subscrição Mensal Love Shop • Ativação de Loja Comercial (${storeName})`,
          quantity: 1,
          unitPriceMzn: 1000,
          totalMzn: 1000,
        },
      ],
      subtotalMzn: 1000,
      ivaRate: 0,
      ivaAmountMzn: 0,
      totalMzn: 1000,
      paymentMethod: paymentMethod === 'mpesa' ? 'M-Pesa' : 'e-Mola',
      transactionReference: `TX-LS-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setGeneratedInvoice(invoiceData);
    onAddStore(newStore);
    setStep('success');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
        <div 
          className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
                  Registo Obrigatório de Vendedor
                </h2>
                <p className="text-xs text-rose-700 font-semibold">
                  Módulo Oficial Love Shop • 1.000 MT / mês
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4">
            {step === 'form' && (
              <form onSubmit={handleProceedToSubscription} className="space-y-3.5">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Formalidade e Validação Comercial</span>
                  </div>
                  <p className="leading-relaxed">
                    Para garantir a segurança dos clientes, todos os vendedores da Love Shop passam por registo comercial. Os compradores têm acesso livre e gratuito.
                  </p>
                </div>

                {/* Nome da Loja */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Nome Comercial da Loja *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amor & Mais, Joias do Coração, Boutique Elegance"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                  />
                </div>

                {/* Slogan */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Slogan ou Especialidade
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Alianças de noivado, relógios finos e presentes inesquecíveis"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                  />
                </div>

                {/* Nome do Dono & NUIT/BI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Proprietário / Gerente *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nome completo do responsável"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      NUIT ou Número do BI *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 400123987 ou 110100..."
                      value={ownerNuitOrBi}
                      onChange={(e) => setOwnerNuitOrBi(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Localização */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Província *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none bg-white"
                    >
                      {MOZ_PROVINCES_LIST.filter((p) => p !== 'all').map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Endereço / Bairro */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Bairro ou Endereço Físico
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Bairro Polana Cimento, Av. Julius Nyerere nº 120"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                  />
                </div>

                {/* Telefones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Telefone de Atendimento *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="84 / 82 / 85..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      WhatsApp para Vendas *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="84 / 85 / 86..."
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Foto / Imagem da Loja */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Link da Foto da Loja / Vitrine (opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/25 cursor-pointer"
                >
                  <span>Avançar para Subscrição (1.000 MT/mês)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {step === 'subscription' && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                      Plano Mensal Love Shop
                    </span>
                    <span className="text-xs font-black bg-rose-600 text-white px-2 py-0.5 rounded-md">
                      1.000 MT / mês
                    </span>
                  </div>
                  <h3 className="text-base font-black text-neutral-900">
                    Ativação da Loja: {storeName}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Dá direito à publicação ilimitada de presentes, acessórios, alianças e relógios, selo de Loja Verificada, contacto direto com compradores e destaque na comunidade de 1.000 a 5.000 utilizadores ativos.
                  </p>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800 block">
                    Método de Pagamento da Mensalidade:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'mpesa'
                          ? 'border-red-500 bg-red-50 text-red-950 ring-2 ring-red-400/40'
                          : 'border-neutral-200 bg-white text-neutral-700'
                      }`}
                    >
                      <span className="text-xs font-black block">M-Pesa (Vodacom)</span>
                      <span className="text-[11px] text-neutral-500 block">Débito automático no telemóvel</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('emola')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'emola'
                          ? 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-400/40'
                          : 'border-neutral-200 bg-white text-neutral-700'
                      }`}
                    >
                      <span className="text-xs font-black block">e-Mola (Movitel)</span>
                      <span className="text-[11px] text-neutral-500 block">Confirmação rápida com PIN</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Número do Telemóvel para Pagamento ({paymentMethod === 'mpesa' ? '84/85' : '86/87'})
                  </label>
                  <input
                    type="tel"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    placeholder="84 123 4567"
                  />
                </div>

                {/* Terms Acceptance Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4.5 h-4.5 accent-rose-600 shrink-0 cursor-pointer"
                    />
                    <div className="text-xs text-neutral-700 leading-snug">
                      <span>Declaro que li e aceito os </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsTermsModalOpen(true);
                        }}
                        className="text-rose-700 font-bold underline hover:text-rose-900 cursor-pointer"
                      >
                        Termos e Condições Gerais
                      </button>{' '}
                      <span>do Onde Dormir Moçambique (Águia Soluções & Serviços).</span>
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="h-12 px-4 rounded-2xl border border-neutral-300 font-bold text-neutral-700 text-xs hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    disabled={!agreedToTerms}
                    onClick={handleConfirmAndActivate}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pagar 1.000 MT & Ativar Loja</span>
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-neutral-900">
                    Loja Registada e Ativada com Sucesso!
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto leading-relaxed">
                    A sua loja <strong>{storeName}</strong> já se encontra visível na vitrine pública do módulo Love Shop para milhares de potenciais clientes.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  {generatedInvoice && (
                    <button
                      type="button"
                      onClick={() => setIsInvoiceOpen(true)}
                      className="h-11 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Ver Fatura e Recibo (Bill)</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-11 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Concluir e Ir à Loja</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal Integration */}
      {generatedInvoice && (
        <BillingInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          invoiceData={generatedInvoice}
        />
      )}

      {/* Official Terms and Conditions Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          setAgreedToTerms(true);
          setIsTermsModalOpen(false);
        }}
        contextText="Ao registar a sua loja no Love Shop, confirme a leitura e aceitação dos Termos Gerais."
      />
    </>
  );
};
