import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden flex flex-col animate-pulse">
      {/* Photo skeleton */}
      <div className="aspect-16/9 bg-neutral-200 relative">
        <div className="absolute top-3 left-3 w-16 h-5 bg-neutral-300 rounded-md" />
        <div className="absolute top-3 right-3 w-8 h-8 bg-neutral-300 rounded-full" />
        <div className="absolute bottom-3 left-3 w-24 h-4 bg-neutral-300 rounded-md" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Title */}
          <div className="h-5 bg-neutral-200 rounded-md w-3/4" />
          {/* Location */}
          <div className="h-3.5 bg-neutral-200 rounded-md w-1/2" />
          {/* Description */}
          <div className="space-y-1 pt-1">
            <div className="h-3 bg-neutral-200 rounded w-full" />
            <div className="h-3 bg-neutral-200 rounded w-4/5" />
          </div>
          {/* Amenities chips */}
          <div className="flex gap-1.5 pt-2">
            <div className="h-4 w-12 bg-neutral-200 rounded" />
            <div className="h-4 w-12 bg-neutral-200 rounded" />
            <div className="h-4 w-12 bg-neutral-200 rounded" />
          </div>
        </div>

        {/* Action row skeleton */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="h-4 bg-neutral-200 rounded w-20" />
          <div className="flex gap-1.5">
            <div className="h-9 w-24 bg-neutral-200 rounded-xl" />
            <div className="h-9 w-9 bg-neutral-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
