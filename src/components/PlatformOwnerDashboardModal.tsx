import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  X, 
  TrendingUp, 
  Users, 
  Building2, 
  PhoneCall, 
  MessageCircle, 
  MapPin, 
  Compass, 
  Car, 
  Heart, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  Activity, 
  Download, 
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  Search,
  Eye,
  Layers,
  Crown
} from 'lucide-react';
import { platformOwnerService, PlatformOwnerMetrics } from '../services/platformOwnerService';
import { Logo } from './Logo';

interface PlatformOwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlatformOwnerDashboardModal: React.FC<PlatformOwnerDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => platformOwnerService.isLoggedIn());
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const [metrics, setMetrics] = useState<PlatformOwnerMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'now' | 'modules' | 'funnel' | 'governance'>('overview');

  const fetchMetrics = async () => {
    setIsLoadingMetrics(true);
    setMetricsError(null);
    try {
      const res = await platformOwnerService.getMetrics();
      if (res.success && res.data) {
        setMetrics(res.data);
      } else {
        setMetricsError(res.error || 'Falha ao carregar métricas autoritativas.');
      }
    } catch {
      setMetricsError('Erro de ligação ao servidor.');
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchMetrics();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('Insira o código de segurança do proprietário.');
      return;
    }

    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      const res = await platformOwnerService.login(passcode);
      if (res.success) {
        setIsAuthenticated(true);
        setPasscode('');
        fetchMetrics();
      } else {
        setAuthError(res.error || 'Código incorreto ou sem autorização.');
      }
    } catch {
      setAuthError('Erro na validação com o servidor.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    platformOwnerService.logout();
    setIsAuthenticated(false);
    setMetrics(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-neutral-900 text-white w-full max-w-4xl rounded-3xl shadow-2xl border border-neutral-700/80 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  Proprietário da Plataforma
                </span>
                <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-300 font-bold border border-neutral-700">
                  Águia Soluções
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                Painel Executivo • Onde Dormir Moçambique
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={fetchMetrics}
                disabled={isLoadingMetrics}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                title="Atualizar dados"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingMetrics ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Lock Screen if Not Authenticated */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-white">
                  Acesso Restrito ao Proprietário da Plataforma
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Este painel é confidencial e exclusivo da gerência do Onde Dormir Moçambique.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3 pt-2 text-left">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Código de Acesso do Proprietário (Passcode)
                  </label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Introduza o código mestre..."
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 font-mono"
                    autoFocus
                  />
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoadingAuth}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-950/40 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoadingAuth ? 'Validando Autorização...' : 'Desbloquear Painel Executivo'}
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Navigation Sub-Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-2xl border border-neutral-800 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === 'overview' ? 'bg-amber-500 text-neutral-950 shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => setActiveTab('now')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'now' ? 'bg-amber-500 text-neutral-950 shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Acontece Agora
                </button>
                <button
                  onClick={() => setActiveTab('modules')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === 'modules' ? 'bg-amber-500 text-neutral-950 shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Módulos
                </button>
                <button
                  onClick={() => setActiveTab('funnel')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === 'funnel' ? 'bg-amber-500 text-neutral-950 shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Funil de Conversão
                </button>
                <button
                  onClick={() => setActiveTab('governance')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === 'governance' ? 'bg-amber-500 text-neutral-950 shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Governação & Receita
                </button>
              </div>

              {/* TAB 1: VISÃO GERAL */}
              {activeTab === 'overview' && metrics && (
                <div className="space-y-5">
                  {/* Primary Top KPIs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                      <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
                        <span>Visitantes Hoje</span>
                        <Activity className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-black text-white">{metrics.overview.visitorsToday}</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">+18% vs ontem</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                      <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
                        <span>Ativos Agora</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="text-2xl font-black text-emerald-400">{metrics.overview.activeUsersNow}</div>
                      <div className="text-[10px] text-neutral-400">Em sessão no telemóvel</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                      <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
                        <span>Visitas no Mês</span>
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-2xl font-black text-white">{metrics.overview.visitsThisMonth}</div>
                      <div className="text-[10px] text-blue-400 font-semibold">+32% crescimento</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                      <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
                        <span>Pensões Ativas</span>
                        <Building2 className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-black text-amber-400">{metrics.overview.activeAccommodations}</div>
                      <div className="text-[10px] text-neutral-400">Moçambique Real</div>
                    </div>
                  </div>

                  {/* Secondary Business Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block font-semibold">Contactos WhatsApp</span>
                        <span className="text-lg font-black text-white">{metrics.overview.whatsappContacts}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block font-semibold">Chamadas Diretas</span>
                        <span className="text-lg font-black text-white">{metrics.overview.phoneCalls}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block font-semibold">Vistas no Mapa</span>
                        <span className="text-lg font-black text-white">{metrics.overview.mapViews}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <Search className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block font-semibold">Pesquisas Realizadas</span>
                        <span className="text-lg font-black text-white">{metrics.overview.searches}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block font-semibold">Proprietários Cadastrados</span>
                        <span className="text-lg font-black text-white">{metrics.overview.registeredOwners}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block font-semibold">Instalações PWA / App</span>
                        <span className="text-lg font-black text-white">{metrics.overview.pwaInstalls}</span>
                      </div>
                    </div>
                  </div>

                  {/* Growth History 7d / 30d / 90d */}
                  <div className="p-4 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">
                      Crescimento de Tráfego do Negócio
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-center">
                        <div className="text-xs text-neutral-400 font-bold">Últimos 7 Dias</div>
                        <div className="text-lg font-black text-white mt-1">{metrics.growth.last7Days.visitors} vis.</div>
                        <div className="text-[10px] text-emerald-400 font-black">{metrics.growth.last7Days.growthRatePercent}</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-center">
                        <div className="text-xs text-neutral-400 font-bold">Últimos 30 Dias</div>
                        <div className="text-lg font-black text-white mt-1">{metrics.growth.last30Days.visitors} vis.</div>
                        <div className="text-[10px] text-emerald-400 font-black">{metrics.growth.last30Days.growthRatePercent}</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-center">
                        <div className="text-xs text-neutral-400 font-bold">Últimos 90 Dias</div>
                        <div className="text-lg font-black text-white mt-1">{metrics.growth.last90Days.visitors} vis.</div>
                        <div className="text-[10px] text-emerald-400 font-black">{metrics.growth.last90Days.growthRatePercent}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACONTECE AGORA */}
              {activeTab === 'now' && metrics && (
                <div className="space-y-4">
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">
                          Atividade em Tempo Real
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                        {metrics.happeningNow.activeUsers} Utilizadores Ativos
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                        <span className="text-xs font-bold text-neutral-400">Módulo Mais Acedido Agora</span>
                        <div className="text-base font-black text-amber-400">{metrics.happeningNow.mostUsedModule}</div>
                        <div className="text-[11px] text-neutral-400">Concentra mais de 50% das interações mobile</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                        <span className="text-xs font-bold text-neutral-400">Localizações Mais Pesquisadas</span>
                        <div className="flex flex-wrap gap-1.5">
                          {metrics.happeningNow.mostSearchedLocations.map((loc, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-neutral-800 text-xs font-bold text-white border border-neutral-700">
                              📍 {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Popular Searches */}
                  <div className="p-4 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
                      Termos Mais Procurados pelos Utilizadores
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {metrics.happeningNow.popularSearches.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">«{item.term}»</span>
                          <span className="text-[11px] font-black text-amber-400 ml-2">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PERFORMANCE POR MÓDULO */}
              {activeTab === 'modules' && metrics && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Onde Dormir */}
                    <div className="p-4 rounded-3xl bg-neutral-950 border border-blue-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-400 font-black text-sm">
                          <Building2 className="w-5 h-5" />
                          <span>ONDE DORMIR</span>
                        </div>
                        <span className="text-xs font-black bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800">
                          {metrics.modulePerformance.ondeDormir.sharePercent}% do tráfego
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="p-2.5 rounded-xl bg-neutral-900">
                          <span className="text-[10px] text-neutral-400 block font-bold">Pesquisas</span>
                          <span className="text-sm font-black text-white">{metrics.modulePerformance.ondeDormir.searches}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-neutral-900">
                          <span className="text-[10px] text-neutral-400 block font-bold">Vistas</span>
                          <span className="text-sm font-black text-white">{metrics.modulePerformance.ondeDormir.views}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-neutral-900">
                          <span className="text-[10px] text-neutral-400 block font-bold">Contactos</span>
                          <span className="text-sm font-black text-emerald-400">{metrics.modulePerformance.ondeDormir.contacts}</span>
                        </div>
                      </div>
                    </div>

                    {/* Turismo */}
                    <div className="p-4 rounded-3xl bg-neutral-950 border border-emerald-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                          <Compass className="w-5 h-5" />
                          <span>TURISMO</span>
                        </div>
                        <span className="text-xs font-black bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                          {metrics.modulePerformance.turismo.sharePercent}% do tráfego
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="p-2.5 rounded-xl bg-neutral-900">
                          <span className="text-[10px] text-neutral-400 block font-bold">Visualizações</span>
                          <span className="text-sm font-black text-white">{metrics.modulePerformance.turismo.views}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-neutral-900">
                          <span className="text-[10px] text-neutral-400 block font-bold">Lugares</span>
                          <span className="text-sm font-black text-white">{metrics.modulePerformance.turismo.placesCatalogued}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-neutral-900">
                          <span className="text-[10px] text-neutral-400 block font-bold">Guias Reais</span>
                          <span className="text-sm font-black text-emerald-400">{metrics.modulePerformance.turismo.guidesAvailable}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rent-a-Car */}
                    <div className="p-4 rounded-3xl bg-neutral-950 border border-orange-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-orange-400 font-black text-sm">
                          <Car className="w-5 h-5" />
                          <span>RENT-A-CAR</span>
                        </div>
                        <span className="text-xs font-black bg-orange-950 text-orange-300 px-2 py-0.5 rounded-full border border-orange-800">
                          {metrics.modulePerformance.rentACar.sharePercent}% do tráfego
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center pt-1">
                        <div className="p-2.5 rounded-xl bg-neutral-900">
                          <span className="text-[10px] text-neutral-400 block font-bold">Pedidos de Aluguer</span>
                          <span className="text-sm font-black text-white">{metrics.modulePerformance.rentACar.rentalRequests}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-neutral-900">
                          <span className="text-[10px] text-neutral-400 block font-bold">Viaturas na Frota</span>
                          <span className="text-sm font-black text-orange-400">{metrics.modulePerformance.rentACar.fleetCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* HeartLink & Love Shop */}
                    <div className="p-4 rounded-3xl bg-neutral-950 border border-rose-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-rose-400 font-black text-sm">
                          <Heart className="w-5 h-5" />
                          <span>HEARTLINK & LOVE SHOP</span>
                        </div>
                        <span className="text-xs font-black bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full border border-rose-800">
                          {metrics.modulePerformance.heartlink.sharePercent + metrics.modulePerformance.loveShop.sharePercent}% do tráfego
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center pt-1">
                        <div className="p-2.5 rounded-xl bg-neutral-900">
                          <span className="text-[10px] text-neutral-400 block font-bold">Interações HeartLink</span>
                          <span className="text-sm font-black text-white">{metrics.modulePerformance.heartlink.interactions}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-neutral-900">
                          <span className="text-[10px] text-neutral-400 block font-bold">Pedidos Love Shop</span>
                          <span className="text-sm font-black text-rose-400">{metrics.modulePerformance.loveShop.ordersCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FUNIL DE CONVERSÃO */}
              {activeTab === 'funnel' && metrics && (
                <div className="space-y-4">
                  <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">
                      Funil de Negócio Real: Onde Dormir
                    </h3>

                    <div className="space-y-3 pt-2">
                      {/* Step 1: Searches */}
                      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                            1
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-white">Pesquisas por Localização / Filtros</div>
                            <div className="text-xs text-neutral-400">Utilizadores buscando onde pernoitar</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-white">{metrics.funnel.searches}</div>
                          <div className="text-[10px] text-neutral-400">100% topo do funil</div>
                        </div>
                      </div>

                      <div className="flex justify-center text-neutral-500">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>

                      {/* Step 2: Property Views */}
                      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                            2
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-white">Visualizações de Pensões / Guest Houses</div>
                            <div className="text-xs text-neutral-400">Abertura de detalhes e fotos</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-amber-400">{metrics.funnel.propertyViews}</div>
                          <div className="text-[10px] text-emerald-400 font-bold">{metrics.funnel.searchToViewRate} conversão</div>
                        </div>
                      </div>

                      <div className="flex justify-center text-neutral-500">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>

                      {/* Step 3: Contacts Direct */}
                      <div className="p-4 rounded-2xl bg-neutral-900 border border-emerald-900/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                            3
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-emerald-400">Contactos Diretos (WhatsApp / Chamada)</div>
                            <div className="text-xs text-neutral-400">Clientes contactando o proprietário</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-emerald-400">{metrics.funnel.contacts}</div>
                          <div className="text-[10px] text-emerald-400 font-bold">{metrics.funnel.viewToContactRate} conversão</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Contacted Establishments */}
                  <div className="p-4 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
                      Top Pensões & Guest Houses Mais Contactadas
                    </h4>
                    <div className="divide-y divide-neutral-850">
                      {metrics.topProperties.map((prop, idx) => (
                        <div key={prop.id} className="py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-neutral-800 text-neutral-300 font-black text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">{prop.name}</div>
                              <div className="text-[10px] text-neutral-400">{prop.province}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-emerald-400">{prop.contacts} contactos</span>
                            <span className="text-[10px] text-neutral-500 block">{prop.views} vistas</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: GOVERNAÇÃO & RECEITA */}
              {activeTab === 'governance' && metrics && (
                <div className="space-y-4">
                  
                  {/* Real Revenue Card */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-neutral-950 to-neutral-900 border border-emerald-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        Receita Real Confirmada (M-Pesa / E-Mola)
                      </span>
                      <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800">
                        {metrics.governance.activeSubscriptionsCount} transações
                      </span>
                    </div>
                    <div className="text-3xl font-black text-emerald-400">
                      {metrics.governance.realRevenueMzn.toLocaleString('pt-MZ')} MT
                    </div>
                    <p className="text-xs text-neutral-400">
                      Total auditado em pagamentos reais de subscrições, destaque e desbloqueio de contactos.
                    </p>
                  </div>

                  {/* Pending Audits & Approvals */}
                  <div className="p-4 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
                        Aprovações Pendentes de Estabelecimentos
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-xs font-black border border-amber-800">
                        {metrics.governance.pendingApprovalsCount} pendentes
                      </span>
                    </div>

                    {metrics.governance.pendingProperties.length === 0 ? (
                      <div className="p-4 text-center text-xs text-neutral-500">
                        Nenhum estabelecimento pendente de auditoria.
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral-850">
                        {metrics.governance.pendingProperties.map((p) => (
                          <div key={p.id} className="py-2.5 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-white">{p.name}</div>
                              <div className="text-[10px] text-neutral-400">{p.city} • {p.province}</div>
                            </div>
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-900">
                              ⚪ Não Verificado
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reports & Complaints */}
                  <div className="p-4 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
                        Denúncias & Moderação
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-black">
                        {metrics.governance.reportsCount} registadas
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400">
                      Todas as denúncias são filtradas contra spam e auditadas antes de qualquer suspensão.
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Footer Actions */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                <span>Águia Soluções & Serviços, SU, LDA</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-rose-950 hover:text-rose-400 text-neutral-300 font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Terminar Sessão Segura</span>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
