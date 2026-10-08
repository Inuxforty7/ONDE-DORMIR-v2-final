import React, { useState } from 'react';
import { X, Star, CheckCircle2, Car, ShieldCheck } from 'lucide-react';
import { CarRental } from '../types';
import { carRentalReviewService, CarRentalDetailedRating } from '../services/carRentalReviewService';

interface CarRentalReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: CarRental | null;
  onReviewSubmitted?: () => void;
}

export const CarRentalReviewModal: React.FC<CarRentalReviewModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onReviewSubmitted,
}) => {
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [comment, setComment] = useState('');

  // 5 criteria: 3 for vehicle, 2 for provider (default to 5 stars)
  const [vehicleCondition, setVehicleCondition] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [comfort, setComfort] = useState(5);
  const [customerService, setCustomerService] = useState(5);
  const [punctuality, setPunctuality] = useState(5);

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setErrorMsg('Por favor insira o seu nome.');
      return;
    }

    const ratings: CarRentalDetailedRating = {
      vehicleCondition,
      cleanliness,
      comfort,
      customerService,
      punctuality,
    };

    try {
      carRentalReviewService.submitReview({
        vehicleId: vehicle.id,
        vehicleModel: vehicle.model,
        providerId: vehicle.ownerId || vehicle.ownerName || 'empresa-rentacar',
        providerName: vehicle.ownerName || 'Operador de Aluguer',
        userName: userName.trim(),
        userCity: userCity.trim() || vehicle.city || 'Maputo',
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
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shrink-0 shadow-inner">
              <Star className="w-5 h-5 text-amber-200 fill-amber-200" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-orange-200">
                Avaliação de Experiência
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Avaliar Viatura e Serviço
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

        {/* Vehicle and Provider summary banner */}
        <div className="p-3 bg-neutral-50 border-b border-neutral-200/80 flex items-center gap-3 shrink-0">
          <img
            src={vehicle.photo}
            alt={vehicle.model}
            className="w-14 h-11 rounded-xl object-cover border border-neutral-200 shrink-0"
          />
          <div className="min-w-0 flex-1 text-xs">
            <h3 className="font-extrabold text-neutral-900 truncate">{vehicle.model}</h3>
            <p className="text-neutral-500 text-[11px] truncate">
              {vehicle.ownerName || 'Operador de Aluguer'} · {vehicle.city}
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
                Obrigado por partilhar a sua experiência com a viatura e o operador.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Group 1: Vehicle Quality Criteria */}
              <div className="bg-neutral-50/80 p-3 rounded-2xl border border-neutral-200/90 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-neutral-800 uppercase tracking-wide pb-1">
                  <Car className="w-3.5 h-3.5 text-orange-600" />
                  <span>Qualidade da Viatura</span>
                </div>
                {renderStarSelector('Estado da Viatura', vehicleCondition, setVehicleCondition)}
                {renderStarSelector('Limpeza', cleanliness, setCleanliness)}
                {renderStarSelector('Conforto', comfort, setComfort)}
              </div>

              {/* Group 2: Provider Service Criteria */}
              <div className="bg-neutral-50/80 p-3 rounded-2xl border border-neutral-200/90 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-neutral-800 uppercase tracking-wide pb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Serviço do Operador</span>
                </div>
                {renderStarSelector('Atendimento ao Cliente', customerService, setCustomerService)}
                {renderStarSelector('Pontualidade', punctuality, setPunctuality)}
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
                    className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
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
                    className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
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
                  placeholder="Partilhe mais detalhes sobre a viatura ou o serviço prestado..."
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white resize-none"
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
                  className="flex-1 h-11 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
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
