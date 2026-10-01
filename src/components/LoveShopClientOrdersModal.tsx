import React, { useState } from 'react';
import { 
  X, 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Star, 
  MessageCircle, 
  Store, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { LoveShopOrder } from '../types';
import { loveShopOrderService } from '../services/loveShopOrderService';
import { LoveShopOrderReviewModal } from './LoveShopOrderReviewModal';

interface LoveShopClientOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (productId: string) => void;
}

export const LoveShopClientOrdersModal: React.FC<LoveShopClientOrdersModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [orders, setOrders] = useState<LoveShopOrder[]>(() => loveShopOrderService.getOrders());
  const [selectedOrderToReview, setSelectedOrderToReview] = useState<LoveShopOrder | null>(null);

  if (!isOpen) return null;

  const refreshOrders = () => {
    setOrders(loveShopOrderService.getOrders());
  };

  const completedWaitingReviewCount = orders.filter(
    (o) => o.status === 'concluido' && !o.hasReviewed
  ).length;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
        <div
          className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                  Meus Pedidos & Contactos
                </h3>
                <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                  Registo automático de compras e avaliações verificadas
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

          {/* Top Notice */}
          {completedWaitingReviewCount > 0 && (
            <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200/70 flex items-center justify-between text-xs text-amber-900 font-medium shrink-0">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                <span>
                  Tem <strong>{completedWaitingReviewCount} compra{completedWaitingReviewCount > 1 ? 's' : ''} concluída{completedWaitingReviewCount > 1 ? 's' : ''}</strong> para avaliar!
                </span>
              </span>
            </div>
          )}

          {/* Orders List */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
            {orders.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <ShoppingBag className="w-8 h-8 text-neutral-400 mx-auto" />
                <h4 className="text-xs font-bold text-neutral-800">
                  Nenhum pedido registado ainda
                </h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xs mx-auto">
                  Ao clicar em "Contactar Vendedor" no WhatsApp de qualquer produto, o sistema gera automaticamente o registo do seu pedido.
                </p>
              </div>
            ) : (
              orders.map((ord) => {
                const isPending = ord.status === 'pendente';
                const isCompleted = ord.status === 'concluido';
                const isCancelled = ord.status === 'cancelado';

                return (
                  <div
                    key={ord.id}
                    className="p-3.5 bg-neutral-50/70 hover:bg-neutral-50 rounded-2xl border border-neutral-200/90 space-y-3 transition-colors"
                  >
                    {/* Top Row: Order ID & Status */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-bold text-neutral-700 text-[11px]">
                        ID: {ord.id}
                      </span>
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200/70">
                          <Clock className="w-3 h-3 text-amber-600" /> Negociação Pendente
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200/70">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Venda Concluída
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-md">
                          <XCircle className="w-3 h-3 text-neutral-500" /> Negócio Cancelado
                        </span>
                      )}
                    </div>

                    {/* Product & Store info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={ord.productPhoto}
                        alt={ord.productName}
                        className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {ord.productName}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
                          <Store className="w-3 h-3 text-rose-600 shrink-0" />
                          <span className="truncate">{ord.storeName}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="shrink-0 font-bold text-rose-600">
                            {ord.productPrice.toLocaleString('pt-MZ')} MT
                          </span>
                        </div>
                        <div className="text-[10.5px] text-neutral-400">
                          Contactado em: {ord.createdAt}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-neutral-500">
                        {isPending && 'Aguarde o fecho do negócio com a loja.'}
                        {isCompleted && !ord.hasReviewed && 'Avaliação desbloqueada pelo vendedor!'}
                        {isCompleted && ord.hasReviewed && 'Avaliação verificada publicada ✅'}
                        {isCancelled && 'Contacto encerrado sem compra.'}
                      </span>

                      {isCompleted && !ord.hasReviewed && (
                        <button
                          type="button"
                          onClick={() => setSelectedOrderToReview(ord)}
                          className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>Avaliar Compra</span>
                        </button>
                      )}

                      {isCompleted && ord.hasReviewed && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Avaliado ⭐
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {selectedOrderToReview && (
        <LoveShopOrderReviewModal
          order={selectedOrderToReview}
          isOpen={Boolean(selectedOrderToReview)}
          onClose={() => setSelectedOrderToReview(null)}
          onReviewSubmitted={() => {
            refreshOrders();
            setSelectedOrderToReview(null);
          }}
        />
      )}
    </>
  );
};
