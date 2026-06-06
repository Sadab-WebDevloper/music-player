import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-neutral-900/30 p-4 rounded-xl border border-neutral-900/50 flex flex-col gap-3 animate-pulse">
      <div className="aspect-square bg-neutral-800 rounded-lg w-full"></div>
      <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
      <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-2 rounded-lg bg-neutral-900/10 border border-neutral-900/20 animate-pulse">
          <div className="w-12 h-12 bg-neutral-800 rounded"></div>
          <div className="flex-grow flex flex-col gap-2">
            <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
            <div className="h-3 bg-neutral-800 rounded w-1/4"></div>
          </div>
          <div className="w-8 h-4 bg-neutral-800 rounded"></div>
        </div>
      ))}
    </div>
  );
}
