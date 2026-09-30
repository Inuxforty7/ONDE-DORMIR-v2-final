import React from 'react';
import { Heart, Compass, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Accommodation } from '../types';
import { AccommodationCard } from './AccommodationCard';

interface SavedTabProps {
  savedAccommodations: Accommodation[];
  onSelectAccommodation: (item: Accommodation) => void;
  onToggleSave: (id: string) => void;
  onClearAllSaved: () => void;
  onNavigateToExplore: () => void;
}

export const SavedTab: React.FC<SavedTabProps> = ({
  savedAccommodations,
  onSelectAccommodation,
  onToggleSave,
  onClearAllSaved,
  onNavigateToExplore,
}) => {
  const [confirmClear, setConfirmClear] = React.useState(false);

  return (
    <div className="pb-32 pt-2 sm:pt-4 max-w-5xl mx-auto px-3.5 sm:px-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
            Hospedagens Guardadas
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            {savedAccommodations.length > 0
              ? `${savedAccommodations.length} alojamento(s) guardado(s) no seu dispositivo`
              : 'Nenhum estabelecimento guardado ainda'}
          </p>
        </div>

        {savedAccommodations.length > 0 && (
          <div>
            {confirmClear ? (
              <div className="flex items-center gap-2 animate-in fade-in duration-150">
                <span className="text-xs text-neutral-600 font-medium">Apagar tudo?</span>
                <button
                  onClick={() => {
                    onClearAllSaved();
                    setConfirmClear(false);
                  }}
                  className="h-9 px-3 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer hover:bg-rose-700 active:scale-95 shadow-xs"
                >
                  Sim
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="h-9 px-3 rounded-xl bg-neutral-200 text-neutral-800 text-xs font-semibold cursor-pointer hover:bg-neutral-300 active:scale-95"
                >
                  Não
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="h-10 px-3 text-xs sm:text-sm text-neutral-500 hover:text-rose-600 flex items-center gap-1.5 font-bold transition-colors cursor-pointer rounded-xl hover:bg-rose-50 active:scale-95"
                title="Limpar todos os guardados"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Limpar Lista</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Privacy note */}
      <div className="p-3.5 bg-neutral-100/90 rounded-2xl flex items-center gap-2.5 text-xs text-neutral-700 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Estes dados estão guardados estritamente na memória deste telemóvel/computador de forma privada.
        </span>
      </div>

      {/* Saved list or Empty state */}
      {savedAccommodations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
          {savedAccommodations.map((place) => (
            <AccommodationCard
              key={place.id}
              accommodation={place}
              onSelect={onSelectAccommodation}
              isSaved={true}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/90 text-center space-y-4 my-6 shadow-2xs">
          <div className="w-18 h-18 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base sm:text-lg text-neutral-900">
              Ainda não guardou nenhuma hospedagem
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
              Toque no ícone de coração em qualquer pensão ou guest house para guardar e consultar mais tarde com rapidez.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateToExplore}
              className="h-12 px-6 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-sm touch-manipulation"
            >
              <Compass className="w-4.5 h-4.5" />
              <span>Explorar Hospedagens Próximas</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
