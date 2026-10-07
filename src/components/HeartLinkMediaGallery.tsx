import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Video, Camera, Sparkles } from 'lucide-react';
import { HeartLinkProfile } from '../types';

interface HeartLinkMediaGalleryProps {
  profile: HeartLinkProfile;
}

export const HeartLinkMediaGallery: React.FC<HeartLinkMediaGalleryProps> = ({ profile }) => {
  // Build items array from profile photos & video
  const photoList: string[] = (profile.photos && profile.photos.length > 0)
    ? profile.photos.filter(Boolean)
    : [profile.photo];

  // Up to 4 photos
  const validPhotos = photoList.slice(0, 4);
  const hasVideo = Boolean(profile.video);

  const mediaItems = [
    ...validPhotos.map((url, idx) => ({
      type: 'photo' as const,
      url,
      label: `Foto ${idx + 1}`,
      index: idx,
    })),
    ...(hasVideo && profile.video ? [{
      type: 'video' as const,
      url: profile.video,
      label: 'Vídeo 🎬',
      duration: profile.videoDuration || '0:30 min',
      index: validPhotos.length,
    }] : [])
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const currentItem = mediaItems[activeIndex] || mediaItems[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative w-full bg-neutral-950 flex flex-col overflow-hidden">
      {/* Main Display Stage */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] max-h-[380px] sm:max-h-[420px] w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
        {currentItem?.type === 'video' ? (
          <div className="w-full h-full flex items-center justify-center bg-black relative">
            <video
              src={currentItem.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <>
            <img
              src={currentItem?.url || profile.photo}
              alt={`${profile.name} - ${currentItem?.label || 'Foto'}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-all duration-300"
            />
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-black text-white border border-white/20 flex items-center gap-1 shadow-sm">
            {currentItem?.type === 'video' ? (
              <>
                <Video className="w-3 h-3 text-rose-400" />
                <span>Vídeo de Apresentação</span>
              </>
            ) : (
              <>
                <Camera className="w-3 h-3 text-rose-400" />
                <span>{activeIndex + 1} de {validPhotos.length} Fotos</span>
              </>
            )}
          </span>
          {hasVideo && currentItem?.type !== 'video' && (
            <span className="px-2 py-1 rounded-full bg-rose-600/90 text-white text-[9.5px] font-bold flex items-center gap-1 shadow-sm animate-pulse">
              <Play className="w-2.5 h-2.5 fill-white" />
              <span>Vídeo Disponível</span>
            </span>
          )}
        </div>

        {/* Navigation Arrows (if > 1 media item) */}
        {mediaItems.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors z-10 backdrop-blur-xs border border-white/20 active:scale-95 shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors z-10 backdrop-blur-xs border border-white/20 active:scale-95 shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Profile Info Overlay at Bottom of Hero */}
        <div className="absolute bottom-3 left-3 right-3 text-white z-10 pointer-events-none">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black drop-shadow-md">
              {profile.name}, {profile.age}
            </h2>
            {profile.verified && (
              <span className="text-[10px] font-bold bg-emerald-500/90 text-white px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
                ✓ Verificado
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-200 mt-0.5 drop-shadow-sm font-medium">
            {profile.city} • {profile.province}
          </p>
        </div>
      </div>

      {/* Thumbnails Strip (4 Photo Slots + 1 Video Slot) */}
      <div className="bg-neutral-900/95 p-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-white/10 shrink-0">
        {mediaItems.map((item, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-rose-500 ring-2 ring-rose-500/50 scale-105 shadow-md'
                  : 'border-white/20 opacity-65 hover:opacity-100'
              }`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-neutral-800 flex flex-col items-center justify-center text-white">
                  <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center shadow-xs">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </div>
                  <span className="text-[8.5px] font-black mt-0.5 uppercase">Vídeo</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.label}
                  className="w-full h-full object-cover"
                />
              )}
              {isSelected && (
                <div className="absolute inset-0 bg-rose-500/15 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
