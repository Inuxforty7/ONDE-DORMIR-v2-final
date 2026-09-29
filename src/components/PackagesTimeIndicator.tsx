/**
 * ONDE DORMIR MOÇAMBIQUE - Indicador de Tempo nos Pacotes
 * Displays real-time live ticker of user registration seniority across all 4 modules:
 * 1. Onde Dormir (Lodges & Pensões)
 * 2. Rent-a-Car (Frotas e Viaturas)
 * 3. Guias Turísticos (Excursões & Credenciação)
 * 4. HeartLink (Passes VIP & Relacionamentos)
 */

import React from 'react';
import { Clock, ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTimeRegistered } from '../utils/userRegistration';

interface PackagesTimeIndicatorProps {
  moduleName?: 'Onde Dormir' | 'Rent-a-Car' | 'Guias Turísticos' | 'HeartLink' | 'Todos os Pacotes';
  packageTitle?: string;
  variant?: 'banner' | 'card' | 'pill';
  showLoyaltyBadge?: boolean;
}

export const PackagesTimeIndicator: React.FC<PackagesTimeIndicatorProps> = ({
  moduleName = 'Todos os Pacotes',
  packageTitle,
  variant = 'banner',
  showLoyaltyBadge = true,
}) => {
  const { days, hours, minutes, seconds, registrationDateFormatted, summaryText } = useTimeRegistered();

  if (variant === 'pill') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold">
        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
        <span className="truncate">Registado há: {days}d {hours}h {minutes}m {seconds}s</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
            <span>Tempo de Registo na Plataforma</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-2xs">
            {moduleName}
          </span>
        </div>

        {/* Live ticker grid */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="bg-white/90 p-1.5 rounded-xl border border-amber-200/80 shadow-2xs">
            <span className="text-base font-black text-amber-950 block leading-tight">{days}</span>
            <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">Dias</span>
          </div>
          <div className="bg-white/90 p-1.5 rounded-xl border border-amber-200/80 shadow-2xs">
            <span className="text-base font-black text-amber-950 block leading-tight">{String(hours).padStart(2, '0')}</span>
            <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">Horas</span>
          </div>
          <div className="bg-white/90 p-1.5 rounded-xl border border-amber-200/80 shadow-2xs">
            <span className="text-base font-black text-amber-950 block leading-tight">{String(minutes).padStart(2, '0')}</span>
            <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">Min</span>
          </div>
          <div className="bg-white/90 p-1.5 rounded-xl border border-amber-200/80 shadow-2xs">
            <span className="text-base font-black text-amber-950 block leading-tight">{String(seconds).padStart(2, '0')}</span>
            <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">Seg</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-amber-900/90 pt-1 border-t border-amber-200/60">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Membro ativo desde <strong>{registrationDateFormatted}</strong></span>
          </span>
          <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
            Antiguidade Verificada
          </span>
        </div>
      </div>
    );
  }

  // Full Banner (Default)
  return (
    <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border border-amber-400/30 text-white shadow-md relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                {packageTitle || `Pacote ${moduleName}`}
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-400 text-black">
                {summaryText}
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-0.5">
              Utilizador registado desde <strong>{registrationDateFormatted}</strong>
            </p>
          </div>
        </div>

        {/* Live Seniority Counter Display */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-black/50 border border-neutral-700 px-3 py-1.5 rounded-xl font-mono text-xs">
          <div className="flex flex-col items-center">
            <span className="font-black text-amber-300 text-sm leading-none">{days}</span>
            <span className="text-[8px] text-neutral-400 uppercase">dias</span>
          </div>
          <span className="text-amber-400 font-bold">:</span>
          <div className="flex flex-col items-center">
            <span className="font-black text-white text-sm leading-none">{String(hours).padStart(2, '0')}</span>
            <span className="text-[8px] text-neutral-400 uppercase">hrs</span>
          </div>
          <span className="text-amber-400 font-bold">:</span>
          <div className="flex flex-col items-center">
            <span className="font-black text-white text-sm leading-none">{String(minutes).padStart(2, '0')}</span>
            <span className="text-[8px] text-neutral-400 uppercase">min</span>
          </div>
          <span className="text-amber-400 font-bold">:</span>
          <div className="flex flex-col items-center">
            <span className="font-black text-amber-400 text-sm leading-none">{String(seconds).padStart(2, '0')}</span>
            <span className="text-[8px] text-neutral-400 uppercase">seg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
