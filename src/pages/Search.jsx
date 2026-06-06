import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search as SearchIcon, Play, Pause, Plus, Heart, Clock, Music } from 'lucide-react';
import { playSong } from '../redux/slices/playerSlice';
import { toggleFavoriteLocal } from '../redux/slices/playlistSlice';
import { searchSongs, toggleLikeSong as apiToggleLike, addSongToPlaylist } from '../services/api';
import { ListSkeleton } from '../components/SkeletonLoader';

export default function Search() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';

  const { currentSong, isPlaying } = useSelector((state) => state.player);
  const { favorites, playlists } = useSelector((state) => state.playlists);

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePlaylistPopover, setActivePlaylistPopover] = useState(null);
  const popoverRef = useRef(null);

  // Sync state if query URL parameter changes
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  // Debounced search trigger
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
        setSearchParams({ query });
      } else {
        setResults([]);
        setSearchParams({});
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const performSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const searchData = await searchSongs(searchTerm);
      setResults(searchData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handlePlayTrack = (song, idx) => {
    dispatch(playSong({ song, index: idx, queue: results }));
  };

  const handleLike = async (song) => {
    dispatch(toggleFavoriteLocal(song));
    try {
      await apiToggleLike(song.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToPlaylist = async (playlistId, songId) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      setActivePlaylistPopover(null);
      alert('Added to playlist!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error adding song');
    }
  };

  // Click outside to close playlist popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setActivePlaylistPopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDuration = (sec) => {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Helper to highlight search keywords
  const highlightText = (text, keyword) => {
    if (!keyword || !text) return text;
    const parts = text.split(new RegExp(`(${keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === keyword.toLowerCase() 
        ? <mark key={i} className="bg-emerald-500/40 text-emerald-300 font-bold px-0.5 rounded">{part}</mark> 
        : part
    );
  };

  const topResult = results[0];

  return (
    <div className="flex flex-col gap-6 pb-16 select-none relative">
      {/* Search Input Box */}
      <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-full px-5 py-3.5 max-w-xl shadow-lg sticky top-0 z-10">
        <SearchIcon className="text-neutral-400" size={22} />
        <input
          type="text"
          placeholder="What do you want to play?"
          value={query}
          onChange={handleSearchChange}
          className="bg-transparent border-none outline-none text-white text-base w-full placeholder-neutral-500"
        />
      </div>

      {loading ? (
        <div className="mt-4"><ListSkeleton count={8} /></div>
      ) : results.length > 0 ? (
        <div className="flex flex-col gap-8">
          
          {/* Top Result & Songs list */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Top Result Card */}
            {topResult && (
              <div className="flex-1 lg:max-w-md flex flex-col gap-4">
                <h2 className="text-2xl font-bold tracking-tight">Top Result</h2>
                <div 
                  onClick={() => handlePlayTrack(topResult, 0)}
                  className="bg-neutral-900/40 hover:bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 flex flex-col justify-between gap-6 group transition duration-300 cursor-pointer relative"
                >
                  <img 
                    src={topResult.cover} 
                    alt={topResult.title} 
                    className="w-24 h-24 rounded-lg object-cover shadow-2xl"
                  />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-3xl font-extrabold tracking-tight truncate text-white">{topResult.title}</h3>
                    <p className="text-neutral-400 font-medium">
                      Song • <span className="hover:underline text-white">{topResult.artist}</span>
                    </p>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute right-6 bottom-6 bg-[#1db954] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 hover:scale-105 active:scale-95">
                    {currentSong?.id === topResult.id && isPlaying ? (
                      <Pause size={24} fill="black" />
                    ) : (
                      <Play size={24} fill="black" className="translate-x-[2px]" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Song Matches List */}
            <div className="flex-[2] flex flex-col gap-4">
              <h2 className="text-2xl font-bold tracking-tight">Songs</h2>
              <div className="flex flex-col bg-neutral-950/20 border border-neutral-900/60 rounded-xl overflow-hidden">
                {results.slice(0, 5).map((song, index) => {
                  const isCurrent = currentSong?.id === song.id;
                  const isLiked = favorites.some(s => s.id === song.id);

                  return (
                    <div 
                      key={song.id} 
                      className={`flex items-center justify-between p-3.5 hover:bg-neutral-900/60 transition group border-b border-neutral-900 last:border-0 ${
                        isCurrent ? 'bg-neutral-900/30' : ''
                      }`}
                    >
                      {/* Left: Play/Pause indicator & Details */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="relative w-10 h-10 flex-shrink-0 cursor-pointer" onClick={() => handlePlayTrack(song, index)}>
                          <img src={song.cover} className="w-full h-full rounded object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {isCurrent && isPlaying ? (
                              <Pause size={16} fill="white" className="text-white" />
                            ) : (
                              <Play size={16} fill="white" className="text-white translate-x-[1px]" />
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-[#1db954]' : 'text-white'}`}>
                            {highlightText(song.title, query)}
                          </p>
                          <p className="text-xs text-neutral-400 truncate mt-1">
                            {highlightText(song.artist, query)}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-4 text-neutral-400">
                        {/* Favorite button */}
                        <button 
                          onClick={() => handleLike(song)}
                          className={`hover:text-white transition cursor-pointer ${isLiked ? 'text-[#1db954]' : ''}`}
                        >
                          <Heart size={16} fill={isLiked ? '#1db954' : 'none'} />
                        </button>

                        {/* Add to playlist dropdown trigger */}
                        <div className="relative">
                          <button 
                            onClick={() => setActivePlaylistPopover(activePlaylistPopover === song.id ? null : song.id)}
                            className="hover:text-white p-1 transition cursor-pointer"
                            title="Add to playlist"
                          >
                            <Plus size={18} />
                          </button>
                          {activePlaylistPopover === song.id && (
                            <div 
                              ref={popoverRef}
                              className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                            >
                              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold px-4 py-2 border-b border-neutral-800">Add to Playlist</p>
                              {playlists.length === 0 ? (
                                <p className="text-xs text-neutral-600 italic px-4 py-2">No playlists available</p>
                              ) : (
                                playlists.map((playlist) => (
                                  <button
                                    key={playlist.id}
                                    onClick={() => handleAddToPlaylist(playlist.id, song.id)}
                                    className="text-left w-full px-4 py-2 text-xs hover:bg-neutral-800 text-neutral-300 hover:text-white truncate transition-colors"
                                  >
                                    {playlist.name}
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-xs">{formatDuration(song.duration)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Extended Web Results (Jamendo) */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Full Search Matches ({results.length})</h2>
            <div className="flex flex-col bg-neutral-950/20 border border-neutral-900/60 rounded-xl overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 text-xs font-bold text-neutral-500 p-3 border-b border-neutral-900">
                <span className="col-span-1 text-center">#</span>
                <span className="col-span-5">Title</span>
                <span className="col-span-3">Album</span>
                <span className="col-span-2">Genre</span>
                <span className="col-span-1 text-right"><Clock size={14} className="ml-auto mr-4" /></span>
              </div>

              {results.map((song, index) => {
                const isCurrent = currentSong?.id === song.id;
                const isLiked = favorites.some(s => s.id === song.id);

                return (
                  <div 
                    key={`all-${song.id}-${index}`}
                    className={`grid grid-cols-12 items-center p-3 text-sm hover:bg-neutral-900/40 border-b border-neutral-900 last:border-0 transition group ${
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

                    {/* Title & Artist */}
                    <div className="col-span-8 sm:col-span-5 flex items-center gap-3 min-w-0">
                      <img src={song.cover} className="w-9 h-9 rounded object-cover" />
                      <div className="min-w-0">
                        <p className={`font-semibold truncate text-sm ${isCurrent ? 'text-[#1db954]' : 'text-white'}`}>
                          {highlightText(song.title, query)}
                        </p>
                        <p className="text-xs text-neutral-400 truncate mt-0.5">
                          {highlightText(song.artist, query)}
                        </p>
                      </div>
                    </div>

                    {/* Album */}
                    <span className="col-span-3 text-neutral-400 truncate hidden sm:block">
                      {highlightText(song.album, query)}
                    </span>

                    {/* Genre */}
                    <span className="col-span-2 text-neutral-400 truncate hidden sm:block">
                      {highlightText(song.genre, query)}
                    </span>

                    {/* Duration / Options */}
                    <div className="col-span-2 sm:col-span-1 text-right flex items-center justify-end gap-3 pr-2">
                      <button 
                        onClick={() => handleLike(song)}
                        className={`hover:text-white transition cursor-pointer text-neutral-400 ${isLiked ? 'text-[#1db954]' : ''}`}
                      >
                        <Heart size={14} fill={isLiked ? '#1db954' : 'none'} />
                      </button>
                      <span className="text-neutral-400 text-xs hidden sm:block">{formatDuration(song.duration)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : query.trim() ? (
        <div className="text-center py-20 text-neutral-500">
          <p className="text-lg">No songs or artists found for "{query}"</p>
          <p className="text-sm mt-1 text-neutral-600">Double check spelling or try a different term.</p>
        </div>
      ) : (
        /* Empty / Pre-Search Page (Show categories) */
        <div className="flex flex-col gap-6 mt-4">
          <h2 className="text-2xl font-bold tracking-tight">Browse All</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {['Bollywood', 'Punjabi'].map((cat, i) => {
              // Harcoded gradient lists for premium look
              const gradients = [
                'from-pink-600 to-rose-700',
                'from-blue-600 to-indigo-700',
                'from-green-600 to-emerald-700',
                'from-amber-600 to-yellow-700',
                'from-purple-600 to-violet-700',
                'from-cyan-600 to-teal-700',
                'from-red-600 to-orange-700',
                'from-neutral-700 to-neutral-800'
              ];
              return (
                <div 
                  key={cat}
                  onClick={() => {
                    setQuery(cat);
                    setSearchParams({ query: cat });
                  }}
                  className={`bg-gradient-to-br ${gradients[i % gradients.length]} h-36 rounded-xl p-4 flex flex-col justify-between hover:scale-103 active:scale-97 cursor-pointer shadow-lg relative overflow-hidden transition-all duration-300 group`}
                >
                  <span className="font-extrabold text-xl tracking-tight text-white">{cat}</span>
                  <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 rotate-25 w-20 h-20 bg-black/10 rounded-lg group-hover:scale-110 transition duration-300 flex items-center justify-center">
                    <Music size={40} className="text-white/20" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
