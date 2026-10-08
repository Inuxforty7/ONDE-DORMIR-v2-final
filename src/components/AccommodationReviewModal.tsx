import React, { useState } from 'react';
import { X, Star, CheckCircle2, BedDouble, ShieldCheck } from 'lucide-react';
import { Accommodation } from '../types';
import { accommodationReviewService, AccommodationDetailedRating } from '../services/accommodationReviewService';

interface AccommodationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  accommodation: Accommodation | null;
  onReviewSubmitted?: () => void;
}

export const AccommodationReviewModal: React.FC<AccommodationReviewModalProps> = ({
  isOpen,
  onClose,
  accommodation,
  onReviewSubmitted,
}) => {
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [comment, setComment] = useState('');

  // 5 rating criteria (defaulted to 5 stars)
  const [conforto, setConforto] = useState(5);
  const [limpeza, setLimpeza] = useState(5);
  const [atendimento, setAtendimento] = useState(5);
  const [localizacao, setLocalizacao] = useState(5);
  const [seguranca, setSeguranca] = useState(5);

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen || !accommodation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setErrorMsg('Por favor insira o seu nome.');
      return;
    }

    const ratings: AccommodationDetailedRating = {
      conforto: Math.max(1, Math.min(5, conforto)),
      limpeza: Math.max(1, Math.min(5, limpeza)),
      atendimento: Math.max(1, Math.min(5, atendimento)),
      localizacao: Math.max(1, Math.min(5, localizacao)),
      seguranca: Math.max(1, Math.min(5, seguranca)),
    };

    try {
      accommodationReviewService.submitReview({
        accommodationId: accommodation.id,
        accommodationName: accommodation.name,
        userName: userName.trim(),
        userCity: userCity.trim() || undefined,
        ratings,
        comment: comment.trim() || undefined,
      });

      setIsSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      setTimeout(() => {
        setIsSuccess(false);
        setComment('');
        onClose();
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao submeter avaliação.');
    }
  };

  const renderStarSelector = (
    label: string,
    value: number,
    onChange: (val: number) => void
  ) => {
    return (
      <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 last:border-b-0">
        <span className="text-xs font-semibold text-neutral-800">{label}</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="p-1 text-neutral-300 hover:text-amber-400 focus:outline-none transition-colors cursor-pointer"
            >
              <Star
                className={`w-5 h-5 ${
                  star <= value
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-neutral-200'
                }`}
              />
            </button>
          ))}
          <span className="text-xs font-black text-neutral-700 w-5 text-right ml-1">
            {value}.0
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shrink-0 shadow-inner">
              <BedDouble className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="text-[11px] font-black tracking-wide text-amber-200">
                ⭐⭐⭐⭐⭐ Avaliação Geral
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Avaliar Alojamento
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Accommodation Summary Banner */}
        <div className="p-3 bg-neutral-50 border-b border-neutral-200/80 flex items-center gap-3 shrink-0">
          <img
            src={accommodation.photos?.[0]}
            alt={accommodation.name}
            className="w-12 h-12 rounded-2xl object-cover border border-neutral-200 shrink-0"
          />
          <div className="min-w-0 flex-1 text-xs">
            <h3 className="font-extrabold text-neutral-900 truncate flex items-center gap-1">
              <span>{accommodation.name}</span>
              {accommodation.verificationStatus === 'verified_in_person' && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              )}
            </h3>
            <p className="text-neutral-500 text-[11px] truncate">
              {accommodation.location.neighborhood || accommodation.location.district || accommodation.location.city}, {accommodation.location.province}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-neutral-900">
                Avaliação Registada com Sucesso!
              </h3>
              <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                Obrigado por partilhar a sua avaliação sobre a estadia.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* 5 Criteria Group */}
              <div className="bg-neutral-50/80 p-3 rounded-2xl border border-neutral-200/90 space-y-1">
                <div className="text-xs font-black text-neutral-800 uppercase tracking-wide pb-1 flex items-center gap-1">
                  <span>Critérios de Avaliação</span>
                </div>
                {renderStarSelector('Conforto', conforto, setConforto)}
                {renderStarSelector('Limpeza', limpeza, setLimpeza)}
                {renderStarSelector('Atendimento', atendimento, setAtendimento)}
                {renderStarSelector('Localização', localizacao, setLocalizacao)}
                {renderStarSelector('Segurança', seguranca, setSeguranca)}
              </div>

              {/* User details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    O seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Ex: João Machel"
                    className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                    placeholder="Ex: Maputo"
                    className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Optional Comment */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Comentário (opcional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Partilhe a sua experiência sobre a estadia, quarto ou atendimento..."
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 px-4 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <span>Submeter Avaliação</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
