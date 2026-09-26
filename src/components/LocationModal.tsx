import React, { useState } from 'react';
import { X, Navigation, Search, MapPin, Check } from 'lucide-react';
import { MOZ_PRESET_LOCATIONS, MozLocationPreset } from '../utils/geo';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: MozLocationPreset, neighborhood?: string) => void;
  onRequestGps: () => void;
  currentLocationName: string;
  isGpsLoading: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  onRequestGps,
  currentLocationName,
  isGpsLoading,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredPresets = MOZ_PRESET_LOCATIONS.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term) ||
      p.province.toLowerCase().includes(term) ||
      p.popularNeighborhoods.some((b) => b.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-neutral-900">
              Onde você está ou pretende procurar?
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Escolha a localização para calcularmos as distâncias exatas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 pb-safe">
          {/* GPS Button with 48px touch ergonomics */}
          <button
            onClick={() => {
              onRequestGps();
              onClose();
            }}
            disabled={isGpsLoading}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/70 hover:bg-emerald-100 active:scale-98 text-emerald-950 font-semibold text-sm transition-all group cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Navigation className={`w-5 h-5 ${isGpsLoading ? 'animate-spin' : ''}`} />
              </div>
              <div className="text-left">
                <div className="text-neutral-900 font-extrabold text-sm sm:text-base">Usar GPS do meu telemóvel</div>
                <div className="text-xs text-emerald-800 font-medium mt-0.5">
                  Localização exata sem guardar histórico
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs shrink-0">
              Automático
            </span>
          </button>

          {/* Search box - 48px */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar cidade, província ou bairro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-10 bg-neutral-100 rounded-2xl text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white border border-neutral-200 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="w-8 h-8 absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 flex items-center justify-center cursor-pointer"
                title="Limpar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Preset list */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Principais Cidades e Regiões em Moçambique
            </div>
            <div className="space-y-2.5">
              {filteredPresets.map((preset) => {
                const isCurrent = currentLocationName.includes(preset.city);
                return (
                  <div
                    key={preset.id}
                    className="p-4 rounded-2xl border border-neutral-200/90 hover:border-emerald-300 hover:bg-neutral-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          onSelectPreset(preset);
                          onClose();
                        }}
                        className="flex items-center gap-3 text-left flex-1 cursor-pointer py-1 touch-manipulation"
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="font-extrabold text-sm sm:text-base text-neutral-900 block">
                            {preset.name}
                          </span>
                          <span className="text-xs text-neutral-500 font-medium">
                            {preset.province}
                          </span>
                        </div>
                      </button>

                      {isCurrent && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 shrink-0">
                          <Check className="w-3.5 h-3.5" /> Atual
                        </span>
                      )}
                    </div>

                    {/* Popular neighborhoods in this city */}
                    {preset.popularNeighborhoods.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-neutral-400 font-bold mr-1">
                          Bairros:
                        </span>
                        {preset.popularNeighborhoods.map((bairro) => (
                          <button
                            key={bairro}
                            onClick={() => {
                              onSelectPreset(preset, bairro);
                              onClose();
                            }}
                            className="h-9 px-3 rounded-xl bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-900 text-neutral-800 text-xs font-semibold transition-colors cursor-pointer active:scale-95 touch-manipulation flex items-center"
                          >
                            {bairro}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredPresets.length === 0 && (
                <div className="text-center py-6 text-neutral-500 text-sm">
                  Nenhuma cidade ou bairro encontrado para "{search}".
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-500 text-center font-medium">
          A localização é calculada no seu navegador apenas para ordenar os estabelecimentos por proximidade.
        </div>
      </div>
    </div>
  );
};
