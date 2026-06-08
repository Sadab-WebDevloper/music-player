import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, 
  Volume2, Volume1, VolumeX, Maximize2, Minimize2, ListMusic, Heart, Music4
} from 'lucide-react';
import { 
  togglePlay, nextSong, prevSong, toggleShuffle, toggleRepeat, setVolume 
} from '../redux/slices/playerSlice';
import { toggleFavoriteLocal } from '../redux/slices/playlistSlice';
import { toggleLikeSong as apiToggleLike } from '../services/api';

export default function BottomPlayer({ 
  currentTime, 
  duration, 
  onProgressClick,
  volume,
  handleVolumeChange,
  toggleMute,
  savedVolume
}) {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, isShuffle, isRepeat } = useSelector((state) => state.player);
  const { favorites } = useSelector((state) => state.playlists);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const { queue } = useSelector((state) => state.player);

  const isLiked = currentSong && favorites.some(s => s.id === currentSong.id);

  const handleLike = async () => {
    if (!currentSong) return;
    dispatch(toggleFavoriteLocal(currentSong));
    try {
      await apiToggleLike(currentSong.id);
    } catch (error) {
      console.error('Failed to sync like with server:', error);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;
  const volumePct = volume * 100;

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  if (!currentSong) return null;

  return (
    <>
      {/* Desktop & Mobile Bottom Player Bar */}
      <div className="player-glass fixed bottom-[56px] md:bottom-0 left-0 right-0 h-16 md:h-20 px-4 md:px-6 flex items-center justify-between z-45 text-white select-none">
        
        {/* Left Side: Track Info */}
        <div className="flex items-center gap-3 w-auto md:w-1/3 flex-grow md:flex-grow-0 min-w-0 md:min-w-[150px]">
          <img 
            src={currentSong.cover} 
            alt={currentSong.title} 
            className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover shadow-lg cursor-pointer flex-shrink-0"
            onClick={() => setIsFullScreen(true)}
          />
          <div className="overflow-hidden cursor-pointer flex-grow min-w-0 pr-2" onClick={() => setIsFullScreen(true)}>
            <h4 className="text-sm font-semibold truncate hover:underline">{currentSong.title}</h4>
            <p className="text-xs text-neutral-400 truncate hover:underline">{currentSong.artist}</p>
          </div>
          <button 
            onClick={handleLike}
            className={`hidden md:block p-1.5 transition-colors cursor-pointer ${isLiked ? 'text-[#1db954]' : 'text-neutral-400 hover:text-white'}`}
          >
            <Heart size={18} fill={isLiked ? '#1db954' : 'none'} />
          </button>
        </div>

        {/* Center: Controls & Seek bar (Desktop Only) */}
        <div className="hidden md:flex flex-col items-center gap-1.5 w-1/3 max-w-[600px] flex-grow">
          {/* Action Buttons */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => dispatch(toggleShuffle())}
              className={`p-1 transition-colors cursor-pointer ${isShuffle ? 'text-[#1db954]' : 'text-neutral-400 hover:text-white'}`}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>
            <button 
              onClick={() => dispatch(prevSong())}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Previous"
            >
              <SkipBack size={20} />
            </button>
            <button 
              onClick={() => dispatch(togglePlay())}
              className="bg-white hover:scale-105 active:scale-95 text-black p-2.5 rounded-full transition-all flex items-center justify-center shadow-md cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="translate-x-[1px]" />}
            </button>
            <button 
              onClick={() => dispatch(nextSong())}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Next"
            >
              <SkipForward size={20} />
            </button>
            <button 
              onClick={() => dispatch(toggleRepeat())}
              className={`p-1 transition-colors cursor-pointer ${isRepeat ? 'text-[#1db954]' : 'text-neutral-400 hover:text-white'}`}
              title="Repeat"
            >
              <Repeat size={18} />
            </button>
          </div>

          {/* Seek Bar */}
          <div className="w-full flex items-center gap-2.5 text-xs text-neutral-400">
            <span>{formatTime(currentTime)}</span>
            <div 
              onClick={onProgressClick}
              className="flex-grow h-1.5 bg-neutral-800 rounded-full cursor-pointer relative group"
            >
              <div 
                className="h-full bg-neutral-400 group-hover:bg-[#1db954] rounded-full transition-colors"
                style={{ width: `${progressPct}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                style={{ left: `calc(${progressPct}% - 6px)` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Side: Volume & Extra Utilities (Desktop Only) */}
        <div className="hidden md:flex items-center justify-end gap-3.5 w-1/3 min-w-[150px]">
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`p-1.5 transition-colors cursor-pointer ${showQueue ? 'text-[#1db954]' : 'text-neutral-400 hover:text-white'}`}
            title="Queue"
          >
            <ListMusic size={20} />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMute}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Mute/Unmute"
            >
              {getVolumeIcon()}
            </button>
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-20 md:w-24 h-1 rounded-full appearance-none cursor-pointer bg-neutral-800 accent-[#1db954] hover:accent-[#1db954] outline-none"
              style={{
                background: `linear-gradient(to right, #1db954 ${volumePct}%, #262626 ${volumePct}%)`
              }}
            />
          </div>
          <button 
            onClick={() => setIsFullScreen(true)}
            className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
            title="Full Screen"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {/* Mobile Mini Controls (Mobile Only) */}
        <div className="flex md:hidden items-center justify-end gap-3 flex-shrink-0">
          <button 
            onClick={handleLike}
            className={`p-1.5 transition-colors cursor-pointer ${isLiked ? 'text-[#1db954]' : 'text-neutral-400'}`}
          >
            <Heart size={20} fill={isLiked ? '#1db954' : 'none'} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); dispatch(togglePlay()); }}
            className="text-white p-2 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="translate-x-[1px]" />}
          </button>
        </div>
      </div>

      {/* Full Screen Player Overlay */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col justify-between p-6 md:p-12 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between text-neutral-400">
            <button 
              onClick={() => setIsFullScreen(false)}
              className="flex items-center gap-1 hover:text-white text-sm font-semibold transition cursor-pointer"
            >
              <Minimize2 size={20} />
              <span>Back</span>
            </button>
            <span className="text-xs uppercase tracking-widest font-bold">Now Playing</span>
            <button 
              onClick={() => setShowQueue(!showQueue)}
              className={`p-1 transition-colors cursor-pointer ${showQueue ? 'text-[#1db954]' : 'hover:text-white'}`}
            >
              <ListMusic size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 flex-grow max-w-5xl mx-auto w-full">
            {/* Left Cover Art */}
            <div className="w-64 h-64 md:w-96 md:h-96 relative flex-shrink-0 group">
              <img 
                src={currentSong.cover} 
                alt={currentSong.title} 
                className="w-full h-full rounded-2xl object-cover shadow-2xl transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Music4 className="text-white animate-pulse" size={48} />
              </div>
            </div>

            {/* Right Information & Big Slider */}
            <div className="flex flex-col gap-6 w-full max-w-lg">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight truncate">{currentSong.title}</h1>
                  <button onClick={handleLike} className="text-[#1db954] cursor-pointer">
                    <Heart size={28} fill={isLiked ? '#1db954' : 'none'} className={isLiked ? 'text-[#1db954]' : 'text-neutral-400 hover:text-white'} />
                  </button>
                </div>
                <p className="text-lg text-neutral-400 mt-2">{currentSong.artist}</p>
                <p className="text-sm text-neutral-500 mt-1 italic">{currentSong.album}</p>
              </div>

              {/* Seek Bar */}
              <div className="flex flex-col gap-2">
                <div 
                  onClick={onProgressClick}
                  className="w-full h-2 bg-neutral-800 rounded-full cursor-pointer relative group"
                >
                  <div 
                    className="h-full bg-[#1db954] rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-white rounded-full opacity-100 shadow"
                    style={{ left: `calc(${progressPct}% - 9px)` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-8 mt-4">
                <button 
                  onClick={() => dispatch(toggleShuffle())}
                  className={`p-2 transition-colors cursor-pointer ${isShuffle ? 'text-[#1db954]' : 'text-neutral-400 hover:text-white'}`}
                >
                  <Shuffle size={24} />
                </button>
                <button 
                  onClick={() => dispatch(prevSong())}
                  className="text-neutral-400 hover:text-white transition p-2 cursor-pointer"
                >
                  <SkipBack size={32} />
                </button>
                <button 
                  onClick={() => dispatch(togglePlay())}
                  className="bg-white hover:scale-105 active:scale-95 text-black p-5 rounded-full transition shadow-xl flex items-center justify-center cursor-pointer"
                >
                  {isPlaying ? <Pause size={36} fill="black" /> : <Play size={36} fill="black" className="translate-x-1" />}
                </button>
                <button 
                  onClick={() => dispatch(nextSong())}
                  className="text-neutral-400 hover:text-white transition p-2 cursor-pointer"
                >
                  <SkipForward size={32} />
                </button>
                <button 
                  onClick={() => dispatch(toggleRepeat())}
                  className={`p-2 transition-colors cursor-pointer ${isRepeat ? 'text-[#1db954]' : 'text-neutral-400 hover:text-white'}`}
                >
                  <Repeat size={24} />
                </button>
              </div>

              {/* Extra Volume Info in Fullscreen */}
              {/* <div className="hidden md:flex items-center justify-center gap-3 mt-4 text-neutral-400 w-2/3 mx-auto">
                <button onClick={toggleMute} className="cursor-pointer">{getVolumeIcon()}</button>
                <input 
                  type="range" 
                  min="0" max="1" step="0.01" 
                  value={volume} 
                  onChange={handleVolumeChange}
                  className="flex-grow h-1.5 rounded-full appearance-none cursor-pointer bg-neutral-800 accent-[#1db954]"
                />
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Queue Sidebar Drawer */}
      {showQueue && (
        <div className="fixed top-0 right-0 bottom-20 w-80 bg-neutral-950 border-l border-neutral-900 z-40 flex flex-col p-4 shadow-2xl animate-in slide-in-from-right duration-250 select-none">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
            <h3 className="font-bold text-lg text-white">Play Queue</h3>
            <button 
              onClick={() => setShowQueue(false)}
              className="text-neutral-400 hover:text-white text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="flex-grow overflow-y-auto mt-4 flex flex-col gap-2">
            <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider px-2">Now Playing</p>
            <div className="flex items-center gap-3 bg-neutral-900/60 p-2 rounded-lg border border-neutral-800">
              <img src={currentSong.cover} className="w-10 h-10 rounded object-cover" />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-white">{currentSong.title}</p>
                <p className="text-xs text-neutral-400 truncate">{currentSong.artist}</p>
              </div>
            </div>
            
            <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider px-2 mt-4">Next Up ({queue.length - queue.indexOf(currentSong) - 1 || 0})</p>
            {queue.slice(queue.indexOf(currentSong) + 1).length === 0 ? (
              <p className="text-xs text-neutral-600 italic px-2">Queue is empty</p>
            ) : (
              queue.slice(queue.indexOf(currentSong) + 1).map((song, i) => (
                <div key={`${song.id}-${i}`} className="flex items-center gap-3 hover:bg-neutral-900/40 p-2 rounded-lg transition">
                  <img src={song.cover} className="w-10 h-10 rounded object-cover" />
                  <div className="overflow-hidden flex-grow">
                    <p className="text-sm font-medium truncate text-white">{song.title}</p>
                    <p className="text-xs text-neutral-400 truncate">{song.artist}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
