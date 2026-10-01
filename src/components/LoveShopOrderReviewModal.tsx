import React, { useState } from 'react';
import { X, Star, ShieldCheck, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { LoveShopOrder, DetailedReviewRating } from '../types';
import { loveShopOrderService } from '../services/loveShopOrderService';

interface LoveShopOrderReviewModalProps {
  order: LoveShopOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export const LoveShopOrderReviewModal: React.FC<LoveShopOrderReviewModalProps> = ({
  order,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [productQuality, setProductQuality] = useState<number>(5);
  const [deliverySpeed, setDeliverySpeed] = useState<number>(5);
  const [customerService, setCustomerService] = useState<number>(5);
  const [recommendation, setRecommendation] = useState<number>(5);
  const [overallSatisfaction, setOverallSatisfaction] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userCity, setUserCity] = useState<string>('Maputo');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ratings: DetailedReviewRating = {
      productQuality,
      deliverySpeed,
      customerService,
      recommendation,
      overallSatisfaction,
    };

    const review = loveShopOrderService.submitReview(
      order.id,
      ratings,
      comment,
      userName || order.clientName,
      userCity
    );

    if (review) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onReviewSubmitted();
        onClose();
      }, 1500);
    }
  };

  const renderStarSelector = (
    label: string,
    sublabel: string,
    value: number,
    onChange: (val: number) => void,
    affects: 'produto' | 'loja'
  ) => (
    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-neutral-900 block">{label}</span>
          <span className="text-[10px] text-neutral-500">{sublabel}</span>
        </div>
        <span
          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
            affects === 'produto'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          {affects === 'produto' ? 'Afeta Produto' : 'Afeta Loja'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`w-6 h-6 ${
                star <= value
                  ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                  : 'text-neutral-300'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-black text-neutral-700 ml-2">{value}.0</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold text-sm">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                Avaliar Compra Concluída
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                Pedido: {order.id} • {order.storeName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {isSuccess ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-neutral-900">
                Avaliação Registada com Sucesso!
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Obrigado pelo feedback! A sua avaliação afeta a reputação do produto e do serviço da loja de forma inteligente e verificada.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Product Info Card */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center gap-3">
                <img
                  src={order.productPhoto}
                  alt={order.productName}
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-neutral-900 truncate">
                    {order.productName}
                  </h4>
                  <div className="text-[11px] text-rose-600 font-bold mt-0.5">
                    {order.productPrice.toLocaleString('pt-MZ')} MT • {order.storeName}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Venda Concluída</span>
                </div>
              </div>

              {/* Informative Banner */}
              <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-xl text-[11px] text-rose-900 leading-relaxed">
                💡 <strong>Reputação Inteligente:</strong> A <em>Qualidade do Produto</em> avalia o artigo, enquanto <em>Tempo de Entrega, Atendimento e Recomendação</em> compõem a reputação da loja.
              </div>

              {/* 5 Rating Criteria */}
              <div className="space-y-2.5">
                {renderStarSelector(
                  '1. Qualidade do Produto',
                  'Acabamento, tecido/material e conformidade com o anúncio',
                  productQuality,
                  setProductQuality,
                  'produto'
                )}

                {renderStarSelector(
                  '2. Tempo de Entrega',
                  'Rapidez e pontualidade na entrega ou disponibilidade do artigo',
                  deliverySpeed,
                  setDeliverySpeed,
                  'loja'
                )}

                {renderStarSelector(
                  '3. Atendimento & Cordialidade',
                  'Atenção no WhatsApp, esclarecimento de dúvidas e educação',
                  customerService,
                  setCustomerService,
                  'loja'
                )}

                {renderStarSelector(
                  '4. Recomendação',
                  'Probabilidade de recomendar esta loja a amigos ou familiares',
                  recommendation,
                  setRecommendation,
                  'loja'
                )}

                {renderStarSelector(
                  '5. Satisfação Geral',
                  'Experiência global com esta compra',
                  overallSatisfaction,
                  setOverallSatisfaction,
                  'loja'
                )}
              </div>

              {/* User details & optional comment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Seu Nome (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dra. Elsa, João M."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:border-rose-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Sua Cidade
                  </label>
                  <input
                    type="text"
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                    className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:border-rose-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Comentário sobre a Compra (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Partilhe como foi a sua experiência com o produto e o atendimento..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:border-rose-600 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>Publicar Avaliação Verificada</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
