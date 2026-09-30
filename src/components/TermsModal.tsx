import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Scale, Printer } from 'lucide-react';

export interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  contextText?: string;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  contextText,
}) => {
  const [hasAgreed, setHasAgreed] = useState(true);

  if (!isOpen) return null;

  const handleConfirmAcceptance = () => {
    try {
      localStorage.setItem('onde_dormir_terms_accepted', 'true');
      localStorage.setItem('onde_dormir_terms_accepted_at', new Date().toISOString());
      localStorage.setItem('onde_dormir_terms_version', '1.0');
    } catch {
      // LocalStorage fallback
    }

    if (onAccept) {
      onAccept();
    } else {
      onClose();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-neutral-200 bg-neutral-50/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shrink-0 shadow-2xs">
              <Scale className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 id="terms-modal-title" className="text-sm sm:text-base font-black text-neutral-900 leading-tight">
                Termos e Condições Gerais de Utilização
              </h2>
              <p className="text-[11px] text-neutral-500 font-semibold">
                Onde Dormir Moçambique • Águia Soluções & Serviços, SU, LDA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrint}
              className="w-8 h-8 rounded-xl hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors flex items-center justify-center cursor-pointer hidden sm:flex"
              title="Imprimir / Guardar Termos"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Fechar"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice for Users Registering */}
        {contextText && (
          <div className="px-4 sm:px-6 py-2.5 bg-blue-50/80 border-b border-blue-100 flex items-center gap-2 text-[11px] sm:text-xs text-blue-900 font-medium shrink-0">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{contextText}</span>
          </div>
        )}

        {/* Scrollable Terms Content (Exact Text Provided by User - 100% Unaltered) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-[13px] text-neutral-800 leading-relaxed font-normal select-text">
          
          {/* Main Title & Modules Banner */}
          <div className="text-center pb-4 border-b border-neutral-200 space-y-1.5">
            <span className="text-[10.5px] font-black uppercase tracking-widest text-neutral-400">
              Documento Legal Oficial
            </span>
            <h1 className="text-base sm:text-lg font-black text-neutral-900 uppercase">
              TERMOS E CONDIÇÕES GERAIS DE UTILIZAÇÃO
            </h1>
            <h2 className="text-sm sm:text-base font-bold text-blue-700">
              ONDE DORMIR MOÇAMBIQUE
            </h2>
            <p className="text-xs font-semibold text-neutral-600">
              Onde Dormir • Guia Turístico • Rent-a-Car • HeartLink • Love Shop
            </p>
            <p className="text-xs font-bold text-neutral-900 pt-2 italic">
              Ao utilizar ou registar-se no ONDE DORMIR MOÇAMBIQUE, o utilizador declara que leu, compreendeu e aceitou integralmente os presentes Termos e Condições.
            </p>
          </div>

          {/* 1. NATUREZA DO SERVIÇO E CONTACTO DIRECTO */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">1</span>
              NATUREZA DO SERVIÇO E CONTACTO DIRECTO
            </h3>
            <p className="text-neutral-700">
              O ONDE DORMIR MOÇAMBIQUE funciona exclusivamente como um diretório informativo e plataforma digital de facilitação de contactos entre utilizadores e prestadores de serviços.
            </p>
            <p className="font-semibold text-neutral-800">
              A plataforma permite a divulgação de:
            </p>
            <ul className="space-y-1 pl-1 text-neutral-700">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Alojamentos;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Hotéis;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Guest Houses;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Pensões;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Residenciais;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Guias Turísticos;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Serviços de Rent-a-Car;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Perfis de Conexão Social (HeartLink);</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Compra de presentes especiais para alguém especial;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Outros serviços autorizados pela plataforma.</span>
              </li>
            </ul>
            <p className="text-neutral-700 pt-1">
              Todas as negociações, reservas, alugueres, encontros, contratações, confirmações de estadia, pagamentos e demais acordos são realizados directamente entre as partes envolvidas de forma independente.
            </p>
            <p className="text-neutral-700 font-medium">
              O ONDE DORMIR MOÇAMBIQUE não participa nas negociações nem assume qualquer obrigação contratual entre utilizadores.
            </p>
          </section>

          {/* 2. CADASTRO E VERACIDADE DAS INFORMAÇÕES */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">2</span>
              CADASTRO E VERACIDADE DAS INFORMAÇÕES
            </h3>
            <p className="text-neutral-700">
              Ao efectuar um registo, o utilizador declara que todas as informações fornecidas são verdadeiras, completas e actualizadas.
            </p>
            <p className="font-semibold text-neutral-800">
              O responsável pelo anúncio garante a autenticidade:
            </p>
            <ul className="space-y-1 pl-1 text-neutral-700">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Dos contactos;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Das fotografias;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Da localização;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Dos preços apresentados;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Dos documentos submetidos;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Das descrições dos serviços.</span>
              </li>
            </ul>
            <p className="text-neutral-700 pt-1 font-semibold text-rose-800">
              É proibida a utilização de fotografias, documentos, números de telefone ou dados de terceiros sem autorização expressa desses terceiros.
            </p>
            <p className="text-neutral-700">
              A utilização de fotografias, documentos, números de telefone ou dados de terceiros, carece de apresentação à gestão do ONDE DORMIR MOÇAMBIQUE para a precisão e tomada de decisão.
            </p>
            <p className="text-neutral-700 font-bold">
              O utilizador assume integral responsabilidade pelas informações publicadas.
            </p>
          </section>

          {/* 3. PRIVACIDADE, SIGILO E DISCRIÇÃO */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">3</span>
              PRIVACIDADE, SIGILO E DISCRIÇÃO
            </h3>
            <p className="text-neutral-700">
              O ONDE DORMIR MOÇAMBIQUE respeita a privacidade dos seus utilizadores.
            </p>
            <p className="text-neutral-700">
              As informações e dados pessoais serão tratadas de forma confidencial e utilizadas apenas para o funcionamento da plataforma.
            </p>
            <p className="text-neutral-700">
              As interações entre utilizadores ocorrem sob responsabilidade exclusiva dos próprios utilizadores.
            </p>
            <p className="text-neutral-700 font-medium">
              O ONDE DORMIR MOÇAMBIQUE não garante nem supervisiona comunicações privadas realizadas fora da plataforma.
            </p>
          </section>

          {/* 4. PAGAMENTOS E TAXAS DE SERVIÇOS */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">4</span>
              PAGAMENTOS E TAXAS DE SERVIÇOS
            </h3>
            <p className="text-neutral-700">
              A plataforma poderá disponibilizar planos gratuitos e pagos.
            </p>
            <p className="text-neutral-700">
              Os pagamentos efectuados destinam-se exclusivamente ao acesso a funcionalidades, destaque, promoção ou verificação dentro da plataforma.
            </p>
            <p className="font-semibold text-neutral-800">
              O ONDE DORMIR MOÇAMBIQUE não recebe nem administra pagamentos relativos a:
            </p>
            <ul className="space-y-1 pl-1 text-neutral-700">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Reservas;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Hospedagens;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Alugueres de viaturas;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Serviços turísticos;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Encontros ou serviços acordados entre utilizadores;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Compra de presentes.</span>
              </li>
            </ul>
            <p className="text-neutral-700 font-bold pt-1">
              Todos esses pagamentos são efectuados directamente entre as partes de forma independente.
            </p>
          </section>

          {/* 5. RESPEITO ÀS LEIS DA REPÚBLICA DE MOÇAMBIQUE */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">5</span>
              RESPEITO ÀS LEIS DA REPÚBLICA DE MOÇAMBIQUE
            </h3>
            <p className="text-neutral-700">
              Todos os utilizadores comprometem-se a respeitar a legislação em vigor na República de Moçambique.
            </p>
            <p className="font-semibold text-neutral-800">
              É proibida qualquer utilização da plataforma para:
            </p>
            <ul className="space-y-1 pl-1 text-neutral-700">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✓</span>
                <span>Fraude;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✓</span>
                <span>Burla;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✓</span>
                <span>Extorsão;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✓</span>
                <span>Actividades ilegais;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✓</span>
                <span>Publicação de informações falsas;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✓</span>
                <span>Violação de direitos de terceiros;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">✓</span>
                <span>Assédio ou discriminação.</span>
              </li>
            </ul>
            <p className="text-neutral-700 font-medium pt-1">
              A plataforma poderá remover conteúdos ou suspender contas que violem estes princípios.
            </p>
          </section>

          {/* 6. PAPEL DA PLATAFORMA E LIMITAÇÃO DE RESPONSABILIDADE */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">6</span>
              PAPEL DA PLATAFORMA E LIMITAÇÃO DE RESPONSABILIDADE
            </h3>
            <p className="text-neutral-700">
              O ONDE DORMIR MOÇAMBIQUE actua exclusivamente como plataforma tecnológica de divulgação e conexões rápidas.
            </p>
            <p className="font-bold text-neutral-900">
              O ONDE DORMIR MOÇAMBIQUE:
            </p>
            <ul className="space-y-1 pl-1 text-neutral-700">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Não é proprietário dos estabelecimentos anunciados;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Não é proprietário das viaturas anunciadas;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Não é proprietário dos serviços turísticos anunciados;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Não é representante dos anunciantes;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Não é parte dos acordos celebrados entre utilizadores;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Não garante disponibilidade de serviços;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Não garante preços;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Não garante qualidade dos serviços;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Não garante resultados de encontros ou relacionamentos.</span>
              </li>
            </ul>
            <p className="text-neutral-900 font-bold pt-1 bg-amber-50 p-2 rounded-xl border border-amber-200 text-amber-900">
              ✓ Toda contratação ocorre exclusivamente entre as partes interessadas de forma independente.
            </p>
          </section>

          {/* 7. RESPONSABILIDADE DOS ANUNCIANTES */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">7</span>
              RESPONSABILIDADE DOS ANUNCIANTES
            </h3>
            <p className="text-neutral-700">
              Os anunciantes são integralmente responsáveis pelos seus anúncios, serviços, imagens, descrições e informações disponibilizadas.
            </p>
            <p className="text-neutral-700">
              O anunciante declara possuir autorização legal para divulgar os serviços anunciados.
            </p>
            <p className="text-neutral-700 font-bold">
              Qualquer informação falsa ou enganosa será da exclusiva responsabilidade do anunciante.
            </p>
          </section>

          {/* 8. FRAUDES, PERDAS E DANOS */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">8</span>
              FRAUDES, PERDAS E DANOS
            </h3>
            <p className="font-bold text-neutral-900">
              O ONDE DORMIR MOÇAMBIQUE não poderá ser responsabilizado por:
            </p>
            <ul className="space-y-1 pl-1 text-neutral-700">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Fraudes;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Burlas;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Cancelamentos;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Perdas financeiras;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Danos materiais;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Acidentes;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Furtos;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Roubos;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Lesões pessoais;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Conflitos entre utilizadores;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">×</span>
                <span>Danos decorrentes de serviços contratados através da plataforma.</span>
              </li>
            </ul>
            <p className="text-neutral-900 font-bold pt-1 bg-neutral-100 p-2 rounded-xl">
              ✓ O utilizador reconhece que utiliza a plataforma por sua própria conta e risco.
            </p>
          </section>

          {/* 9. SELOS DE VERIFICAÇÃO */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">9</span>
              SELOS DE VERIFICAÇÃO
            </h3>
            <p className="text-neutral-700">
              Os selos de verificação servem apenas para indicar que determinados dados foram analisados pela plataforma.
            </p>
            <p className="font-semibold text-neutral-800">
              Exemplos:
            </p>
            <ul className="space-y-1 pl-1 text-neutral-700">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Telefone Confirmado;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Selfie Verificada;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>BI + Selfie Verificada;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Verificado pela Equipa.</span>
              </li>
            </ul>
            <p className="text-neutral-700 font-medium pt-1">
              Os selos não constituem garantia absoluta da identidade, honestidade, qualidade, segurança ou comportamento futuro do utilizador ou anunciante.
            </p>
          </section>

          {/* 10. ACEITAÇÃO DOS RISCOS */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">10</span>
              ACEITAÇÃO DOS RISCOS
            </h3>
            <p className="font-semibold text-neutral-800">
              Ao utilizar a plataforma, o utilizador reconhece que:
            </p>
            <ul className="space-y-1 pl-1 text-neutral-700">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Está a contactar terceiros independentes;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Assume os riscos inerentes às suas decisões;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Deve fazer as suas próprias verificações antes de efectuar pagamentos ou contratar serviços;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>É responsável pelas suas escolhas e decisões.</span>
              </li>
            </ul>
            <p className="text-neutral-900 font-bold pt-1">
              Toda utilização da plataforma ocorre por conta e risco do próprio utilizador.
            </p>
          </section>

          {/* 11. CONEXÕES SOCIAIS E RELACIONAMENTOS (HEARTLINK) */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">11</span>
              CONEXÕES SOCIAIS E RELACIONAMENTOS (HEARTLINK)
            </h3>
            <p className="text-neutral-700">
              O módulo HeartLink destina-se exclusivamente à facilitação de contactos entre adultos (maior de 18 anos).
            </p>
            <p className="text-neutral-700">
              O ONDE DORMIR MOÇAMBIQUE não realiza investigações criminais, avaliações psicológicas ou garantias sobre a conduta, intenções ou comportamento dos utilizadores.
            </p>
            <p className="text-neutral-700">
              Qualquer amizade, relacionamento, encontro ou interação realizada dentro ou fora da plataforma ocorre por decisão livre e exclusiva dos utilizadores envolvidos.
            </p>
            <p className="text-neutral-900 font-bold">
              Cada utilizador assume total responsabilidade pelos seus actos e decisões.
            </p>
          </section>

          {/* 12. RESERVA DE DIREITOS DA PLATAFORMA */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">12</span>
              RESERVA DE DIREITOS DA PLATAFORMA
            </h3>
            <p className="font-semibold text-neutral-800">
              O Onde Dormir Moçambique reserva-se o direito de, a qualquer momento e sem aviso prévio:
            </p>
            <ul className="space-y-1.5 pl-1 text-neutral-700">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                <span>Suspender ou remover anúncios, perfis, fotografias ou conteúdos considerados falsos, enganosos, ofensivos ou ilegais;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                <span>Solicitar documentação adicional para verificação de identidade, propriedade do estabelecimento, licença de actividade ou titularidade da viatura anunciada;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                <span>Suspender ou cancelar contas que utilizem informações falsas, fotografias de terceiros sem autorização ou que violem os presentes Termos e Condições;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                <span>Recusar novos registos quando existam indícios de fraude, burla, usurpação de identidade ou qualquer actividade que coloque em risco a segurança dos utilizadores;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                <span>Alterar, actualizar ou melhorar funcionalidades, planos, preços, regras de utilização e políticas internas da plataforma sempre que necessário;</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold shrink-0">✓</span>
                <span>Cooperar com as autoridades competentes da República de Moçambique sempre que houver suspeita de actividade ilícita ou determinação legal.</span>
              </li>
              <li className="flex items-start gap-1.5 font-bold text-rose-900 bg-rose-50 p-2 rounded-xl border border-rose-200">
                <span className="text-rose-600 font-bold shrink-0">✓</span>
                <span>Nos casos de suspensão, bloqueio ou cancelamento motivados por violação dos presentes Termos e Condições, fraude, utilização indevida da plataforma, fornecimento de informações falsas ou prática de actividades ilícitas, o utilizador não terá direito a qualquer reembolso, devolução de valores pagos, indemnização ou compensação.</span>
              </li>
            </ul>
            <p className="text-neutral-700 font-medium pt-1">
              O Onde Dormir Moçambique poderá igualmente encerrar contas ou remover anúncios para proteger a segurança da plataforma, dos utilizadores e dos anunciantes.
            </p>
          </section>

          {/* 13. LEGISLAÇÃO APLICÁVEL E RESOLUÇÃO DE LITÍGIOS */}
          <section className="space-y-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">13</span>
              LEGISLAÇÃO APLICÁVEL E RESOLUÇÃO DE LITÍGIOS
            </h3>
            <p className="text-neutral-700">
              Os presentes Termos e Condições são regidos pelas leis da República de Moçambique.
            </p>
            <p className="text-neutral-700">
              Qualquer litígio, reclamação ou disputa relacionada com a utilização da plataforma será submetida aos tribunais competentes da República de Moçambique, sem prejuízo dos mecanismos legais de resolução amigável previstos na legislação moçambicana.
            </p>
          </section>

          {/* 14. ACEITAÇÃO DOS TERMOS */}
          <section className="space-y-2.5 pb-2">
            <h3 className="font-black text-neutral-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 flex items-center justify-center text-[10px] font-black shrink-0">14</span>
              ACEITAÇÃO DOS TERMOS
            </h3>
            <p className="text-neutral-900 font-bold">
              Ao utilizar, registar-se ou anunciar serviços no Onde Dormir Moçambique, o utilizador declara que leu, compreendeu e aceitou integralmente os presentes Termos e Condições.
            </p>
            <div className="p-3 bg-neutral-100 rounded-2xl border border-neutral-200 text-neutral-900 font-bold space-y-1">
              <p className="text-xs text-blue-900 font-black">
                Onde Dormir Moçambique é uma plataforma de conexões rápidas e divulgação sob gestão da Águia Soluções & Serviços - Conexões Rápidas, SU, LDA.
              </p>
              <p className="text-[11.5px] text-neutral-700 font-medium">
                Todas as negociações, pagamentos, reservas, encontros, alugueres, hospedagens, transportes e demais acordos são realizados exclusivamente entre os utilizadores independentes, sob sua inteira responsabilidade, não assumindo a plataforma qualquer responsabilidade por actos, omissões, prejuízos, conflitos ou incumprimentos ocorridos entre as partes.
              </p>
            </div>
          </section>

        </div>

        {/* Sticky Action Bar */}
        <div className="p-3.5 sm:p-5 border-t border-neutral-200 bg-neutral-50 flex flex-col gap-2.5 shrink-0">
          
          {/* Explicit Confirmation Checkbox (When in registration/action flow) */}
          {onAccept && (
            <label className="flex items-start gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={hasAgreed}
                onChange={(e) => setHasAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 cursor-pointer shrink-0"
              />
              <span className="text-[11px] sm:text-xs text-neutral-800 font-bold leading-tight group-hover:text-neutral-950">
                Declaro que li, compreendi e aceito integralmente os presentes Termos e Condições Gerais de Utilização do Onde Dormir Moçambique (Águia Soluções & Serviços).
              </span>
            </label>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-700 font-bold text-xs border border-neutral-300 cursor-pointer active:scale-95 transition-all"
            >
              Fechar
            </button>

            {onAccept && (
              <button
                type="button"
                onClick={handleConfirmAcceptance}
                disabled={!hasAgreed}
                className="px-5 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Concordar e Avançar</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
