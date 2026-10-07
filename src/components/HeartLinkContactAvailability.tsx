import React from 'react';
import { 
  Phone, 
  Video, 
  MessageSquare, 
  Check, 
  Clock, 
  X,
  ShieldCheck,
  Lock,
  Sparkles
} from 'lucide-react';
import { ContactAvailability, ContactAvailabilityState } from '../types';

interface HeartLinkContactAvailabilityProps {
  availability?: ContactAvailability;
  isContactUnlocked?: boolean;
  className?: string;
  showTitle?: boolean;
  onActivateContactAccess?: () => void;
  isOwnProfile?: boolean;
}

export const DEFAULT_CONTACT_AVAILABILITY: ContactAvailability = {
  whatsapp: { state: 'available' },
  phone: { state: 'limited_hours', hours: '09:00 - 18:00' },
  videoCall: { state: 'unavailable' },
};

export const getStatusDetails = (
  state: ContactAvailabilityState, 
  hours?: string, 
  isContactUnlocked: boolean = true
) => {
  if (!isContactUnlocked) {
    return {
      label: 'Contacto indisponível',
      shortLabel: 'Indisponível',
      colorClass: 'bg-neutral-50 text-neutral-600 border-neutral-200',
      badgeBg: 'bg-neutral-400',
      dotColor: 'bg-rose-500',
      icon: <X className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />,
      statusIcon: '✕',
      statusText: 'Contacto indisponível'
    };
  }

  switch (state) {
    case 'available':
      return {
        label: 'Contacto disponível',
        shortLabel: 'Disponível',
        colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badgeBg: 'bg-emerald-500',
        dotColor: 'bg-emerald-500',
        icon: <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />,
        statusIcon: '✓',
        statusText: 'Contacto disponível'
      };
    case 'limited_hours':
      return {
        label: hours ? `Horário: ${hours}` : 'Horário específico',
        shortLabel: hours || 'Horário limitado',
        colorClass: 'bg-amber-50 text-amber-800 border-amber-200',
        badgeBg: 'bg-amber-500',
        dotColor: 'bg-amber-500',
        icon: <Clock className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />,
        statusIcon: '⏱',
        statusText: hours ? `${hours}` : 'Horário específico'
      };
    case 'unavailable':
    default:
      return {
        label: 'Contacto indisponível',
        shortLabel: 'Indisponível',
        colorClass: 'bg-rose-50 text-rose-700 border-rose-200',
        badgeBg: 'bg-rose-500',
        dotColor: 'bg-rose-500',
        icon: <X className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />,
        statusIcon: '✕',
        statusText: 'Contacto indisponível'
      };
  }
};

export const HeartLinkContactAvailabilitySection: React.FC<HeartLinkContactAvailabilityProps> = ({
  availability = DEFAULT_CONTACT_AVAILABILITY,
  isContactUnlocked = true,
  className = '',
  showTitle = true,
  onActivateContactAccess,
  isOwnProfile = false,
}) => {
  const whatsappConfig = availability?.whatsapp || DEFAULT_CONTACT_AVAILABILITY.whatsapp;
  const phoneConfig = availability?.phone || DEFAULT_CONTACT_AVAILABILITY.phone;
  const videoConfig = availability?.videoCall || DEFAULT_CONTACT_AVAILABILITY.videoCall;

  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      channelIcon: <MessageSquare className="w-4 h-4 text-emerald-600" />,
      config: whatsappConfig,
      details: getStatusDetails(whatsappConfig.state, whatsappConfig.hours, isContactUnlocked),
    },
    {
      id: 'phone',
      name: 'Telefone (Voz)',
      channelIcon: <Phone className="w-4 h-4 text-blue-600" />,
      config: phoneConfig,
      details: getStatusDetails(phoneConfig.state, phoneConfig.hours, isContactUnlocked),
    },
    {
      id: 'video',
      name: 'Chamada de Vídeo',
      channelIcon: <Video className="w-4 h-4 text-purple-600" />,
      config: videoConfig,
      details: getStatusDetails(videoConfig.state, videoConfig.hours, isContactUnlocked),
    },
  ];

  return (
    <div className={`border border-neutral-200/90 rounded-2xl bg-white p-3.5 shadow-2xs ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
              Acesso a Contactos
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isContactUnlocked 
              ? 'text-emerald-800 bg-emerald-100' 
              : 'text-amber-800 bg-amber-100'
          }`}>
            {isContactUnlocked ? 'Contacto disponível' : 'Requer plano ativo'}
          </span>
        </div>
      )}

      {!isContactUnlocked && (
        <div className="mb-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
          <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Contacto indisponível no momento</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-snug">
            O perfil é público e visível, mas o acesso a contactos directos requer que o titular tenha um plano de contacto ativo.
          </p>
          {isOwnProfile && onActivateContactAccess && (
            <button
              type="button"
              onClick={onActivateContactAccess}
              className="mt-1 w-full h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ativar Acesso a Contactos</span>
            </button>
          )}
        </div>
      )}

      <div className="space-y-2">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${channel.details.colorClass}`}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/90 shadow-2xs flex items-center justify-center shrink-0">
                {channel.channelIcon}
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900 leading-tight">
                  {channel.name}
                </div>
                {isContactUnlocked && channel.config.state === 'limited_hours' && channel.config.hours && (
                  <div className="text-[10px] font-medium text-amber-900 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-700 inline" />
                    <span>{channel.config.hours}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-black">
                {channel.details.statusIcon}
              </span>
              <span className="text-xs font-bold">
                {channel.details.statusText}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Compact mini-pills for profile cards
export const HeartLinkContactMiniBadges: React.FC<{ 
  availability?: ContactAvailability; 
  isContactUnlocked?: boolean;
  className?: string 
}> = ({
  availability = DEFAULT_CONTACT_AVAILABILITY,
  isContactUnlocked = true,
  className = '',
}) => {
  const whatsappConfig = availability?.whatsapp || DEFAULT_CONTACT_AVAILABILITY.whatsapp;
  const phoneConfig = availability?.phone || DEFAULT_CONTACT_AVAILABILITY.phone;
  const videoConfig = availability?.videoCall || DEFAULT_CONTACT_AVAILABILITY.videoCall;

  const getDot = (state: ContactAvailabilityState) => {
    if (!isContactUnlocked) return 'bg-rose-500';
    if (state === 'available') return 'bg-emerald-500';
    if (state === 'limited_hours') return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div 
        className="flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-neutral-200/80 text-[10px] font-bold text-neutral-700 shadow-2xs"
        title={isContactUnlocked ? `WhatsApp: ${whatsappConfig.state === 'available' ? 'Contacto disponível' : whatsappConfig.state === 'limited_hours' ? `Horário: ${whatsappConfig.hours || 'Limitado'}` : 'Contacto indisponível'}` : 'Contacto indisponível (requer plano ativo)'}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${getDot(whatsappConfig.state)}`} />
        <span>WA</span>
      </div>

      <div 
        className="flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-neutral-200/80 text-[10px] font-bold text-neutral-700 shadow-2xs"
        title={isContactUnlocked ? `Voz: ${phoneConfig.state === 'available' ? 'Contacto disponível' : phoneConfig.state === 'limited_hours' ? `Horário: ${phoneConfig.hours || 'Limitado'}` : 'Contacto indisponível'}` : 'Contacto indisponível (requer plano ativo)'}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${getDot(phoneConfig.state)}`} />
        <span>Voz</span>
      </div>

      <div 
        className="flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-neutral-200/80 text-[10px] font-bold text-neutral-700 shadow-2xs"
        title={isContactUnlocked ? `Vídeo: ${videoConfig.state === 'available' ? 'Contacto disponível' : videoConfig.state === 'limited_hours' ? `Horário: ${videoConfig.hours || 'Limitado'}` : 'Contacto indisponível'}` : 'Contacto indisponível (requer plano ativo)'}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${getDot(videoConfig.state)}`} />
        <span>Vídeo</span>
      </div>
    </div>
  );
};
