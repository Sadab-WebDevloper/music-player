import React from 'react';
import { Play, Pause } from 'lucide-react';

export default function SongCard({ song, isPlaying, isCurrentSong, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`group bg-white/5 hover:bg-white/10 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 cursor-pointer border border-white/5 hover:border-white/10 shadow-lg flex flex-col gap-3 relative ${
        isCurrentSong ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(0,243,255,0.2)]' : ''
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
            className={`w-12 h-12 bg-[#00f3ff] hover:bg-[#00f3ff] text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.8)] transition-transform transform active:scale-95 duration-200 cursor-pointer ${
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
        <h3 className={`text-sm font-bold truncate ${isCurrentSong ? 'text-[#00f3ff] neon-text-cyan' : 'text-white'}`} title={song.title}>
          {song.title}
        </h3>
        <p className="text-xs text-neutral-400 truncate mt-1" title={song.artist}>
          {song.artist}
        </p>
      </div>
    </div>
  );
}
