import React from 'react';
import { Play, Pause } from 'lucide-react';

export default function SongCard({ song, isPlaying, isCurrentSong, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`group bg-neutral-900/40 hover:bg-neutral-800/60 p-4 rounded-xl transition-all duration-300 cursor-pointer border border-neutral-900/60 hover:border-neutral-800 shadow-md flex flex-col gap-3 relative ${
        isCurrentSong ? 'bg-neutral-800/80 border-neutral-700/80' : ''
      }`}
    >
      {/* Cover Art Image */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg select-none">
        <img 
          src={song.cover} 
          alt={song.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Play/Pause Hover Overlay */}
        <div 
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${
            isCurrentSong ? 'opacity-100 bg-black/50' : ''
          }`}
        >
          <button 
            className={`w-12 h-12 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full flex items-center justify-center shadow-lg transition-transform transform active:scale-95 duration-200 cursor-pointer ${
              isCurrentSong ? 'scale-105' : 'translate-y-3 group-hover:translate-y-0'
            }`}
          >
            {isCurrentSong && isPlaying ? (
              <Pause size={22} fill="black" />
            ) : (
              <Play size={22} fill="black" className="translate-x-[2px]" />
            )}
          </button>
        </div>

        {/* Floating tag if local vs external */}
        {song.isExternal && (
          <span className="absolute top-2 right-2 bg-neutral-950/80 text-[10px] text-neutral-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
            Web
          </span>
        )}
      </div>

      {/* Info Texts */}
      <div className="flex flex-col min-w-0">
        <h3 className={`text-sm font-bold truncate ${isCurrentSong ? 'text-[#1db954]' : 'text-white'}`} title={song.title}>
          {song.title}
        </h3>
        <p className="text-xs text-neutral-400 truncate mt-1" title={song.artist}>
          {song.artist}
        </p>
      </div>
    </div>
  );
}
