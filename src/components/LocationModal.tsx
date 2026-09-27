import React, { useState } from 'react';
import { X, Navigation, Search, MapPin, Check, Globe } from 'lucide-react';
import { MOZ_PRESET_LOCATIONS, MozLocationPreset } from '../utils/geo';
import { UserLocationState } from '../types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: MozLocationPreset, neighborhood?: string) => void;
  onSelectAllMozambique?: () => void;
  onRequestGps: () => void;
  currentLocationName: string;
  userLocation?: UserLocationState;
  isGpsLoading: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  onSelectAllMozambique,
  onRequestGps,
  currentLocationName,
  userLocation,
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
          <div>
            <h2 className="text-sm sm:text-base font-black text-neutral-900">
              Escolha a sua Província ou Cidade
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              O aplicativo filtrará acomodações, rent-a-car, guias e conexões desta região.
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
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 pb-safe">
          {/* Quick Options: Todo Moçambique & GPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Nationwide Option */}
            <button
              onClick={() => {
                if (onSelectAllMozambique) onSelectAllMozambique();
                onClose();
              }}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                userLocation?.isAllMozambique
                  ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                userLocation?.isAllMozambique ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
              }`}>
                <Globe className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm truncate">Todas as Províncias</div>
                <div className={`text-[11px] truncate ${userLocation?.isAllMozambique ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  Directório nacional
                </div>
              </div>
            </button>

            {/* GPS Auto Button */}
            <button
              onClick={() => {
                onRequestGps();
                onClose();
              }}
              disabled={isGpsLoading}
              className="p-3 rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-left flex items-center gap-3 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs shrink-0">
                <Navigation className={`w-4 h-4 ${isGpsLoading ? 'animate-spin' : ''}`} />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-emerald-950 truncate">Localização GPS</div>
                <div className="text-[11px] text-emerald-800 truncate">
                  Auto-detetar dispositivo
                </div>
              </div>
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar cidade (Ex: Inhambane, Beira, Matola)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-9 pr-8 bg-neutral-100 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white border border-neutral-200 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="w-7 h-7 absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Province Selector Pills */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Províncias Rápidas:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Inhambane', id: 'inhambane-cidade' },
                { name: 'Maputo Cidade', id: 'maputo-central' },
                { name: 'Maputo Província', id: 'matola' },
                { name: 'Sofala', id: 'beira' },
                { name: 'Nampula', id: 'nampula' },
                { name: 'Gaza', id: 'bilene' },
                { name: 'Cabo Delgado', id: 'pemba' },
                { name: 'Tete', id: 'tete' },
                { name: 'Manica', id: 'chimoio' },
                { name: 'Zambézia', id: 'quelimane' },
                { name: 'Niassa', id: 'lichinga' },
              ].map((prov) => {
                const isProvActive = !userLocation?.isAllMozambique && (
                  userLocation?.province?.toLowerCase() === prov.name.toLowerCase()
                );
                return (
                  <button
                    key={prov.name}
                    onClick={() => {
                      const found = MOZ_PRESET_LOCATIONS.find((p) => p.id === prov.id) || MOZ_PRESET_LOCATIONS.find((p) => p.province === prov.name);
                      if (found) {
                        onSelectPreset(found);
                        onClose();
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isProvActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200/80'
                    }`}
                  >
                    {prov.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset list */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Cidades e Províncias de Moçambique
            </div>
            <div className="space-y-2">
              {filteredPresets.map((preset) => {
                const isSelected = !userLocation?.isAllMozambique && (
                  userLocation?.province?.toLowerCase() === preset.province.toLowerCase() ||
                  currentLocationName.toLowerCase().includes(preset.city.toLowerCase())
                );
                return (
                  <div
                    key={preset.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          onSelectPreset(preset);
                          onClose();
                        }}
                        className="flex items-center gap-2.5 text-left flex-1 cursor-pointer touch-manipulation"
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-neutral-900 block">
                            {preset.name}
                          </span>
                          <span className="text-[11px] text-neutral-500 font-medium">
                            Província de {preset.province}
                          </span>
                        </div>
                      </button>

                      {isSelected && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3 text-emerald-600" /> Ativo
                        </span>
                      )}
                    </div>

                    {/* Popular neighborhoods in this city */}
                    {preset.popularNeighborhoods.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-neutral-400 font-bold">
                          Bairros:
                        </span>
                        {preset.popularNeighborhoods.map((bairro) => (
                          <button
                            key={bairro}
                            onClick={() => {
                              onSelectPreset(preset, bairro);
                              onClose();
                            }}
                            className="h-7 px-2.5 rounded-lg bg-white border border-neutral-200 hover:border-emerald-400 text-neutral-700 text-[11px] font-medium transition-colors cursor-pointer active:scale-95 flex items-center"
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
                <div className="text-center py-6 text-neutral-500 text-xs">
                  Nenhuma cidade ou bairro encontrado para "{search}".
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100 text-[11px] text-neutral-500 text-center font-medium">
          Ao escolher uma localização, os serviços mostrados serão restritos a essa província.
        </div>
      </div>
    </div>
  );
};
