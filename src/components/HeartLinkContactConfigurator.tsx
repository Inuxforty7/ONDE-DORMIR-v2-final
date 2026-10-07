import React from 'react';
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Clock, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';
import { ContactAvailability, ContactAvailabilityState } from '../types';

interface HeartLinkContactConfiguratorProps {
  value: ContactAvailability;
  onChange: (newValue: ContactAvailability) => void;
}

const PRESET_HOURS = [
  '08:00 - 18:00',
  '09:00 - 17:00',
  '18:00 - 22:00',
  'Fins de semana (10:00 - 20:00)',
  'Seg a Sex (08:00 - 16:00)',
];

export const HeartLinkContactConfigurator: React.FC<HeartLinkContactConfiguratorProps> = ({
  value,
  onChange,
}) => {
  const updateChannelState = (
    channel: 'whatsapp' | 'phone' | 'videoCall',
    state: ContactAvailabilityState
  ) => {
    onChange({
      ...value,
      [channel]: {
        ...value[channel],
        state,
        hours: state === 'limited_hours' ? value[channel]?.hours || '08:00 - 18:00' : value[channel]?.hours,
      },
    });
  };

  const updateChannelHours = (
    channel: 'whatsapp' | 'phone' | 'videoCall',
    hours: string
  ) => {
    onChange({
      ...value,
      [channel]: {
        ...value[channel],
        hours,
      },
    });
  };

  const channels: Array<{
    id: 'whatsapp' | 'phone' | 'videoCall';
    name: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Mensagens directas de texto e áudio',
      icon: <MessageSquare className="w-4 h-4 text-emerald-600" />,
    },
    {
      id: 'phone',
      name: 'Chamadas Telefónicas (Voz)',
      description: 'Contacto telefónico convencional',
      icon: <Phone className="w-4 h-4 text-blue-600" />,
    },
    {
      id: 'videoCall',
      name: 'Chamada de Vídeo',
      description: 'Conversas por videoconferência',
      icon: <Video className="w-4 h-4 text-purple-600" />,
    },
  ];

  return (
    <div className="space-y-3 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-200/90">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          Disponibilidade de Contacto
        </label>
        <span className="text-[10px] font-bold text-neutral-600">Configuração Real</span>
      </div>

      <div className="space-y-3">
        {channels.map((ch) => {
          const config = value[ch.id] || { state: 'available' };

          return (
            <div
              key={ch.id}
              className="bg-white p-3 rounded-xl border border-neutral-200 space-y-2.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                    {ch.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 leading-tight">
                      {ch.name}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {ch.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 State Option Buttons */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateChannelState(ch.id, 'available')}
                  className={`p-2 rounded-xl text-center border font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    config.state === 'available'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Disponível</span>
                  </div>
                  <span className="text-[9px] font-semibold opacity-90">Agora</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateChannelState(ch.id, 'limited_hours')}
                  className={`p-2 rounded-xl text-center border font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    config.state === 'limited_hours'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Horário</span>
                  </div>
                  <span className="text-[9px] font-semibold opacity-90">Específico</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateChannelState(ch.id, 'unavailable')}
                  className={`p-2 rounded-xl text-center border font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    config.state === 'unavailable'
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Não</span>
                  </div>
                  <span className="text-[9px] font-semibold opacity-90">Disponível</span>
                </button>
              </div>

              {/* Specific Hours Input when limited */}
              {config.state === 'limited_hours' && (
                <div className="pt-2 border-t border-neutral-100 space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Definir Intervalo de Horas:
                    </span>
                  </div>

                  <input
                    type="text"
                    value={config.hours || ''}
                    onChange={(e) => updateChannelHours(ch.id, e.target.value)}
                    placeholder="Ex: 08:00 - 18:00 ou Fins de semana"
                    className="w-full h-8 px-2.5 bg-amber-50/60 border border-amber-300 rounded-lg text-xs font-semibold text-neutral-800 outline-none focus:ring-1 focus:ring-amber-500"
                  />

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {PRESET_HOURS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => updateChannelHours(ch.id, preset)}
                        className={`text-[9px] px-2 py-0.5 rounded-md border font-bold cursor-pointer transition-colors ${
                          config.hours === preset
                            ? 'bg-amber-100 border-amber-400 text-amber-900'
                            : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
