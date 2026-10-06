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
  ArrowRight,
  Plus
} from 'lucide-react';
import { LoveShopOrder } from '../types';
import { loveShopOrderService } from '../services/loveShopOrderService';
import { LoveShopOrderReviewModal } from './LoveShopOrderReviewModal';

interface LoveShopClientOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (productId: string) => void;
  initialTab?: 'compras' | 'vendas';
}

export const LoveShopClientOrdersModal: React.FC<LoveShopClientOrdersModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  initialTab = 'compras',
}) => {
  const [activeTab, setActiveTab] = useState<'compras' | 'vendas'>(initialTab);
  const [orders, setOrders] = useState<LoveShopOrder[]>(() => loveShopOrderService.getOrders());
  const [selectedOrderToReview, setSelectedOrderToReview] = useState<LoveShopOrder | null>(null);

  // Sync tab if initialTab changes on open
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setOrders(loveShopOrderService.getOrders());
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const refreshOrders = () => {
    setOrders(loveShopOrderService.getOrders());
  };

  const handleUpdateStatus = (orderId: string, status: 'concluido' | 'cancelado') => {
    loveShopOrderService.updateOrderStatus(orderId, status);
    refreshOrders();
  };

  const completedWaitingReviewCount = orders.filter(
    (o) => o.status === 'concluido' && !o.hasReviewed
  ).length;

  const pendingMerchantOrdersCount = orders.filter(
    (o) => o.status === 'pendente'
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
          {/* Header matching Image 2 */}
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-7.5 px-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Fazer novo pedido"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Pedir</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Segmented Tab Switcher (Compras as Visitor vs Vendas as Merchant) */}
          <div className="px-5 pt-3 pb-1 bg-neutral-50/70 border-b border-neutral-100 shrink-0">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-200/70 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('compras')}
                className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'compras'
                    ? 'bg-white text-rose-600 shadow-sm font-black'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Minhas Compras</span>
                {completedWaitingReviewCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
                    {completedWaitingReviewCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vendas')}
                className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'vendas'
                    ? 'bg-white text-neutral-900 shadow-sm font-black'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span>Minhas Vendas</span>
                {pendingMerchantOrdersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                    {pendingMerchantOrdersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Notice banner for Buyer Tab */}
          {activeTab === 'compras' && completedWaitingReviewCount > 0 && (
            <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200/70 flex items-center justify-between text-xs text-amber-900 font-medium shrink-0">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                <span>
                  Tem <strong>{completedWaitingReviewCount} compra{completedWaitingReviewCount > 1 ? 's' : ''} concluída{completedWaitingReviewCount > 1 ? 's' : ''}</strong> para avaliar!
                </span>
              </span>
            </div>
          )}

          {/* Notice banner for Merchant Tab */}
          {activeTab === 'vendas' && pendingMerchantOrdersCount > 0 && (
            <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200/70 flex items-center justify-between text-xs text-emerald-900 font-medium shrink-0">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Tem <strong>{pendingMerchantOrdersCount} pedido{pendingMerchantOrdersCount > 1 ? 's' : ''} pendente{pendingMerchantOrdersCount > 1 ? 's' : ''}</strong> de clientes. Confirme as vendas após entrega.
                </span>
              </span>
            </div>
          )}

          {/* Orders List */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
            {orders.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <PackageCheck className="w-8 h-8 text-neutral-400 mx-auto" />
                <h4 className="text-xs font-bold text-neutral-800">
                  {activeTab === 'compras' ? 'Nenhuma compra registada ainda' : 'Nenhum pedido de venda recebido ainda'}
                </h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xs mx-auto">
                  {activeTab === 'compras'
                    ? 'Ao contactar um vendedor no WhatsApp de qualquer produto, o sistema gera automaticamente o registo da sua compra.'
                    : 'Quando os clientes clicam para encomendar os seus artigos no WhatsApp, os pedidos surgem listados aqui para confirmação de entrega.'}
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
                          <Clock className="w-3 h-3 text-amber-600" /> Pendente
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200/70">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Venda Concluída
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-md">
                          <XCircle className="w-3 h-3 text-neutral-500" /> Cancelado
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
                          Data do pedido: {ord.createdAt}
                        </div>
                      </div>
                    </div>

                    {/* Actions Area */}
                    {activeTab === 'compras' ? (
                      /* Buyer Actions */
                      <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-neutral-500">
                          {isPending && 'Aguardando entrega e confirmação da loja.'}
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
                    ) : (
                      /* Merchant Actions */
                      <div className="pt-2 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] text-neutral-500">
                          {isPending && 'Gestão de entrega / fecho de venda:'}
                          {isCompleted && (
                            <span className="text-emerald-700 font-semibold">
                              Entrega confirmada pelo comerciante.
                            </span>
                          )}
                          {isCancelled && 'Venda cancelada pelo comerciante.'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(ord.id, 'cancelado')}
                                className="h-7 px-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(ord.id, 'concluido')}
                                className="h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                              >
                                <CheckCircle2 className="w-3 h-3 text-white" />
                                <span>Concluir Venda</span>
                              </button>
                            </>
                          )}

                          {isCompleted && (
                            <span className="text-[11px] font-bold text-neutral-600">
                              {ord.hasReviewed ? 'Cliente avaliou ⭐' : 'Aguardando avaliação do cliente'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
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
