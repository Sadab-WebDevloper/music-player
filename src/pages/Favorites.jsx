import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Heart, Clock, HeartOff } from 'lucide-react';
import { playSong } from '../redux/slices/playerSlice';
import { toggleFavoriteLocal } from '../redux/slices/playlistSlice';
import { toggleLikeSong as apiToggleLike } from '../services/api';

export default function Favorites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentSong, isPlaying } = useSelector((state) => state.player);
  const { favorites } = useSelector((state) => state.playlists);

  const handlePlayAll = () => {
    if (favorites.length === 0) return;
    dispatch(playSong({ song: favorites[0], index: 0, queue: favorites }));
  };

  const handlePlayTrack = (song, index) => {
    dispatch(playSong({ song, index, queue: favorites }));
  };

  const handleUnlike = async (song) => {
    dispatch(toggleFavoriteLocal(song));
    try {
      await apiToggleLike(song.id);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDuration = (sec) => {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };



  return (
    <div className="flex flex-col gap-6 pb-20 select-none">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-b from-indigo-950 via-purple-950 to-neutral-950 p-6 md:p-8 rounded-2xl border border-neutral-900 shadow-xl">
        <div className="w-48 h-48 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xl">
          <Heart size={80} fill="white" className="text-white" />
        </div>
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 flex-grow">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#1db954]">Collection</span>
          <h1 className="text-4xl md:text-5xl font-black text-white">Liked Songs</h1>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium mt-2">
            <span>{favorites.length} {favorites.length === 1 ? 'song' : 'songs'}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {favorites.length > 0 && (
        <div className="flex items-center gap-4 py-2">
          <button
            onClick={handlePlayAll}
            className="bg-[#1db954] hover:bg-[#1ed760] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {favorites.some(s => s.id === currentSong?.id) && isPlaying ? (
              <Pause size={24} fill="black" />
            ) : (
              <Play size={24} fill="black" className="translate-x-[2px]" />
            )}
          </button>
        </div>
      )}

      {/* Song List Table */}
      {favorites.length > 0 ? (
        <div className="flex flex-col bg-neutral-950/20 border border-neutral-900/60 rounded-xl overflow-hidden mt-4 shadow">
          {/* Header Row */}
          <div className="hidden sm:grid grid-cols-12 text-xs font-bold text-neutral-500 p-3 border-b border-neutral-900">
            <span className="col-span-1 text-center">#</span>
            <span className="col-span-5">Title</span>
            <span className="col-span-3">Album</span>
            <span className="col-span-2">Genre</span>
            <span className="col-span-1 text-right"><Clock size={14} className="ml-auto mr-4" /></span>
          </div>

          {/* Rows */}
          {favorites.map((song, index) => {
            const isCurrent = currentSong?.id === song.id;

            return (
              <div 
                key={song.id} 
                className={`grid grid-cols-12 items-center p-3 hover:bg-neutral-900/40 border-b border-neutral-900 last:border-0 transition group text-sm ${
                  isCurrent ? 'bg-neutral-900/20' : ''
                }`}
              >
                {/* Index / Play */}
                <div className="col-span-2 sm:col-span-1 text-center relative flex justify-center items-center">
                  <span className="text-neutral-500 group-hover:opacity-0 transition-opacity">{index + 1}</span>
                  <button 
                    onClick={() => handlePlayTrack(song, index)}
                    className="absolute opacity-0 group-hover:opacity-100 text-white transition-opacity cursor-pointer"
                  >
                    {isCurrent && isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="translate-x-[1px]" />}
                  </button>
                </div>

                {/* Track Title */}
                <div className="col-span-8 sm:col-span-5 flex items-center gap-3 min-w-0">
                  <img src={song.cover} className="w-10 h-10 rounded object-cover shadow" />
                  <div className="min-w-0">
                    <p className={`font-semibold truncate ${isCurrent ? 'text-[#1db954]' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{song.artist}</p>
                  </div>
                </div>

                {/* Album */}
                <span className="col-span-3 text-neutral-400 truncate hidden sm:block">
                  {song.album}
                </span>

                {/* Genre */}
                <span className="col-span-2 text-neutral-400 truncate hidden sm:block">
                  {song.genre}
                </span>

                {/* Duration & Actions */}
                <div className="col-span-2 sm:col-span-1 text-right flex items-center justify-end gap-3.5 pr-2 text-neutral-400">
                  <button 
                    onClick={() => handleUnlike(song)}
                    className="hover:text-red-500 transition duration-200 cursor-pointer"
                    title="Remove from favorites"
                  >
                    <HeartOff size={14} className="text-[#1db954] hover:text-red-500" fill="#1db954" />
                  </button>
                  <span className="text-neutral-500 text-xs hidden sm:block">{formatDuration(song.duration)}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border border-neutral-900 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4">
          <p className="text-neutral-500 text-sm">You haven't liked any songs yet.</p>
          <button
            onClick={() => navigate('/search')}
            className="bg-white hover:bg-neutral-200 text-black px-6 py-2 rounded-full font-bold text-sm transition shadow cursor-pointer"
          >
            Find Songs
          </button>
        </div>
      )}
    </div>
  );
}
