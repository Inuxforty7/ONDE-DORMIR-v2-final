import React, { useRef, useState } from 'react';
import { Camera, Video, Upload, Trash2, RefreshCw, AlertCircle, Play, Film, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export interface HeartLinkMediaState {
  photos: (string | null)[]; // Exactly 4 slots
  video: string | null;      // Exactly 1 slot
  videoDuration?: string;
}

interface HeartLinkMediaManagerProps {
  media: HeartLinkMediaState;
  onChange: (updated: HeartLinkMediaState) => void;
  isEditable?: boolean;
}

const MAX_PHOTO_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 30;

const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg', 'image/heic'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg', 'video/x-m4v'];

export const HeartLinkMediaManager: React.FC<HeartLinkMediaManagerProps> = ({
  media,
  onChange,
  isEditable = true,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeSlotTarget, setActiveSlotTarget] = useState<number | 'video' | null>(null);

  const photoInputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const slotLabels = [
    { title: 'Foto 1 (Principal)', desc: 'Rosto visível e iluminado' },
    { title: 'Foto 2', desc: 'Ângulo / Corpo inteiro' },
    { title: 'Foto 3', desc: 'Estilo de vida ou lazer' },
    { title: 'Foto 4', desc: 'Sorriso ou momento especial' },
  ];

  // Helper to validate and convert file
  const handlePhotoFileChange = (slotIndex: number, file: File) => {
    setErrorMsg(null);

    // Validate type
    if (!ALLOWED_PHOTO_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      setErrorMsg('Formato inválido. Por favor envie uma imagem JPG, PNG ou WebP.');
      return;
    }

    // Validate size (5MB)
    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`A foto é demasiado grande. O limite máximo é de ${MAX_PHOTO_SIZE_MB}MB por foto.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const updatedPhotos = [...media.photos];
      while (updatedPhotos.length < 4) {
        updatedPhotos.push(null);
      }
      updatedPhotos[slotIndex] = dataUrl;
      onChange({
        ...media,
        photos: updatedPhotos,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileChange = (file: File) => {
    setErrorMsg(null);

    // Validate type
    if (!ALLOWED_VIDEO_TYPES.includes(file.type) && !file.type.startsWith('video/')) {
      setErrorMsg('Formato de vídeo inválido. Por favor envie um vídeo MP4, WebM ou MOV.');
      return;
    }

    // Validate size (30MB)
    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`O vídeo excede o tamanho máximo permitido de ${MAX_VIDEO_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onChange({
        ...media,
        video: dataUrl,
        videoDuration: '0:30 min',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (slotIndex: number) => {
    const updatedPhotos = [...media.photos];
    updatedPhotos[slotIndex] = null;
    onChange({
      ...media,
      photos: updatedPhotos,
    });
  };

  const handleRemoveVideo = () => {
    onChange({
      ...media,
      video: null,
      videoDuration: undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* Validation Alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-rose-700 hover:text-rose-900 font-bold px-1.5 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Photo Slots */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-neutral-800 uppercase tracking-wide flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-rose-600" />
            <span>4 Fotos do Perfil (Obrigatório Foto 1)</span>
          </label>
          <span className="text-[10px] font-bold text-neutral-500">
            {media.photos.filter(Boolean).length}/4 preenchidas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[0, 1, 2, 3].map((slotIdx) => {
            const photoUrl = media.photos[slotIdx];
            const meta = slotLabels[slotIdx];

            return (
              <div
                key={slotIdx}
                className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center ${
                  photoUrl
                    ? 'border-rose-300 bg-neutral-900 shadow-2xs group'
                    : 'border-dashed border-neutral-300 hover:border-rose-400 bg-neutral-50/80 hover:bg-rose-50/40'
                }`}
              >
                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={photoInputRefs[slotIdx]}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoFileChange(slotIdx, file);
                    e.target.value = '';
                  }}
                />

                {photoUrl ? (
                  <>
                    <img
                      src={photoUrl}
                      alt={meta.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Badge */}
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[9.5px] font-black text-white">
                      Slot {slotIdx + 1}
                    </div>

                    {/* Overlay Action Buttons */}
                    {isEditable && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                        <button
                          type="button"
                          onClick={() => photoInputRefs[slotIdx].current?.click()}
                          className="w-full py-1.5 px-2 rounded-xl bg-white/90 hover:bg-white text-neutral-900 text-[10.5px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                          <RefreshCw className="w-3 h-3 text-rose-600" />
                          <span>Substituir</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(slotIdx)}
                          className="w-full py-1.5 px-2 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white text-[10.5px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remover</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => photoInputRefs[slotIdx].current?.click()}
                    className="w-full h-full p-2.5 flex flex-col items-center justify-center text-center cursor-pointer active:scale-98 transition-transform"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-1.5 shadow-2xs">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-extrabold text-neutral-800 block">
                      {meta.title}
                    </span>
                    <span className="text-[9.5px] text-neutral-400 mt-0.5 block leading-tight">
                      Toque p/ enviar
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 1 Video Slot */}
      <div className="space-y-2 pt-2 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-neutral-800 uppercase tracking-wide flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-rose-600" />
            <span>1 Vídeo de Apresentação (30s - 60s)</span>
          </label>
          <span className="text-[10px] font-bold text-neutral-500">
            {media.video ? '1/1 enviado' : '0/1 disponível'}
          </span>
        </div>

        {/* Hidden Video Input */}
        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleVideoFileChange(file);
            e.target.value = '';
          }}
        />

        {media.video ? (
          <div className="relative rounded-2xl overflow-hidden border-2 border-rose-300 bg-black aspect-video max-h-52 w-full flex items-center justify-center group shadow-xs">
            <video
              src={media.video}
              controls
              playsInline
              className="w-full h-full object-contain"
            />

            {/* Video Controls Overlay */}
            {isEditable && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-xl bg-black/75 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-xs border border-white/20 shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-400" />
                  <span>Substituir</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="px-2.5 py-1 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-xs shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remover</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => videoInputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed border-neutral-300 hover:border-rose-400 bg-neutral-50/80 hover:bg-rose-50/40 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-99"
          >
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2 shadow-2xs">
              <Film className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-neutral-900">
              Carregar Vídeo de Apresentação
            </div>
            <p className="text-[11px] text-neutral-500 max-w-xs mt-0.5">
              Envie um vídeo curto (MP4, MOV ou WebM até 30MB) para destacar a sua personalidade.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
