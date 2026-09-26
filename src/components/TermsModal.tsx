import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">
                Termos e Condições de Uso
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Onde Dormir Moçambique • Directório Nacional
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terms Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 text-emerald-950 space-y-1.5">
            <div className="font-extrabold flex items-center gap-2 text-xs sm:text-sm text-emerald-900">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-700 shrink-0" />
              <span>Compromisso de Transparência e Responsabilidade</span>
            </div>
            <p className="text-xs text-emerald-800 leading-normal">
              Ao utilizar ou registar serviços no <strong>Onde Dormir Moçambique</strong>, concorda com as directrizes de boa fé, segurança e veracidade de informações.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">
              1. Natureza do Serviço e Contacto Directo
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600">
              O <strong>Onde Dormir Moçambique</strong> funciona como um catálogo informativo e plataforma de facilitação de contactos directos entre utilizadores e prestadores de serviços (Hospedagens, Guias Turísticos, Viaturas de Aluguer e Conexões). Todas as negociações, confirmações de estadia e pagamentos são combinados directamente entre as partes, sem cobrança de comissões por reserva.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">
              2. Cadastro e Veracidade de Informações
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600">
              Ao registar uma pensão, guest house, viatura, perfil de guia ou perfil de utilizador, o responsável garante a exactidão dos contactos (WhatsApp/Telefone), localização e fotografias fornecidas. É estritamente proibido o uso de dados ou fotos de terceiros sem autorização expressa.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">
              3. Privacidade, Sigilo e Discrição
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600">
              Respeitamos a privacidade individual. Não partilhamos dados pessoais para fins publicitários externos nem fazemos rastreio das buscas dos utilizadores. Módulos de conexões funcionam sob princípio de sigilo, consentimento mútuo entre adultos e discrição nas acomodações parceiras.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">
              4. Pagamentos e Taxas de Serviços
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600">
              Acesso a recursos exclusivos ou passes de serviços via M-Pesa / e-Mola conferem direito de consulta e desbloqueio temporário conforme o plano selecionado. Não cobramos comissões sobre as diárias dos hóspedes nas pensões.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">
              5. Respeito às Leis de Moçambique
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600">
              É exigido o cumprimento de todas as normas legais em vigor na República de Moçambique, incluindo respeito aos hóspedes, preservação da ordem pública e segurança nas instalações.
            </p>
          </div>
        </div>

        {/* Footer with 48px button */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto h-12 px-6 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer touch-manipulation"
          >
            Entendido e Concordo
          </button>
        </div>
      </div>
    </div>
  );
};
