import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Pause, Trash2, Clock, Trash, Heart } from 'lucide-react';
import { getPlaylistById, deletePlaylist, removeSongFromPlaylist, toggleLikeSong as apiToggleLike } from '../services/api';
import { toggleFavoriteLocal, deletePlaylistSuccess } from '../redux/slices/playlistSlice';
import { playSong, togglePlay } from '../redux/slices/playerSlice';
import { ListSkeleton } from '../components/SkeletonLoader';

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentSong, isPlaying } = useSelector((state) => state.player);
  const { favorites } = useSelector((state) => state.playlists);

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      try {
        const data = await getPlaylistById(id);
        setPlaylist(data);
      } catch (error) {
        console.error(error);
        alert('Failed to load playlist');
        navigate('/library');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id, navigate]);

  const handlePlayAll = () => {
    if (!playlist || playlist.songs.length === 0) return;
    if (playlist.songs.some(s => s.id === currentSong?.id)) {
      dispatch(togglePlay());
    } else {
      dispatch(playSong({ song: playlist.songs[0], index: 0, queue: playlist.songs }));
    }
  };

  const handlePlayTrack = (song, index) => {
    if (currentSong?.id === song.id) {
      dispatch(togglePlay());
    } else {
      dispatch(playSong({ song, index, queue: playlist.songs }));
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;
    try {
      await deletePlaylist(playlist.id);
      dispatch(deletePlaylistSuccess(playlist.id));
      navigate('/library');
    } catch (error) {
      console.error(error);
      alert('Failed to delete playlist');
    }
  };

  const handleRemoveTrack = async (songId) => {
    try {
      await removeSongFromPlaylist(playlist.id, songId);
      // Update local state
      setPlaylist({
        ...playlist,
        songs: playlist.songs.filter(s => s.id !== songId)
      });
    } catch (error) {
      console.error(error);
      alert('Failed to remove track');
    }
  };

  const handleLike = async (song) => {
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

  if (loading) return <div className="py-12"><ListSkeleton count={6} /></div>;
  if (!playlist) return null;

  return (
    <div className="flex flex-col gap-6 pb-20 select-none animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 rounded-2xl border border-neutral-900 shadow-xl">
        <div className="w-48 h-48 bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xl">
          {playlist.cover ? (
            <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-neutral-500 font-extrabold">{playlist.name[0]}</span>
          )}
        </div>
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 flex-grow">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#00f3ff] neon-text-cyan">Playlist</span>
          <h1 className="text-4xl md:text-5xl font-black text-white">{playlist.name}</h1>
          <p className="text-sm text-neutral-400 mt-1">{playlist.description || 'No description provided'}</p>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium mt-2">
            <span>{playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}</span>
          </div>
        </div>

        {/* Action Header Button */}
        <button
          onClick={handleDeletePlaylist}
          className="p-3 bg-red-950/40 text-red-500 border border-red-900/60 rounded-xl hover:bg-red-900 hover:text-white transition duration-200 cursor-pointer shadow flex items-center justify-center gap-2 text-xs font-bold w-full md:w-auto"
          title="Delete Playlist"
        >
          <Trash2 size={16} />
          <span>Delete Playlist</span>
        </button>
      </div>

      {/* Playlist Actions */}
      {playlist.songs.length > 0 && (
        <div className="flex items-center gap-4 py-2">
          <button
            onClick={handlePlayAll}
            className="bg-[#00f3ff] hover:bg-[#00f3ff] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.8)] transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {playlist.songs.some(s => s.id === currentSong?.id) && isPlaying ? (
              <Pause size={24} fill="black" />
            ) : (
              <Play size={24} fill="black" className="translate-x-[2px]" />
            )}
          </button>
        </div>
      )}

      {/* Song list Table */}
      {playlist.songs.length > 0 ? (
        <div className="flex flex-col bg-neutral-950/20 border border-neutral-900/60 rounded-xl overflow-hidden mt-4 shadow">
          {/* Header Row */}
          <div className="hidden sm:grid grid-cols-12 text-xs font-bold text-neutral-500 p-3 border-b border-neutral-900">
            <span className="col-span-1 text-center">#</span>
            <span className="col-span-5">Title</span>
            <span className="col-span-3">Album</span>
            <span className="col-span-2">Date Added</span>
            <span className="col-span-1 text-right"><Clock size={14} className="ml-auto mr-4" /></span>
          </div>

          {/* Rows */}
          {playlist.songs.map((song, index) => {
            const isCurrent = currentSong?.id === song.id;
            const isLiked = favorites.some(s => s.id === song.id);

            return (
              <div 
                key={song.id} 
                onClick={() => handlePlayTrack(song, index)}
                className={`grid grid-cols-12 items-center p-3 hover:bg-neutral-900/40 border-b border-neutral-900 last:border-0 transition group text-sm cursor-pointer ${
                  isCurrent ? 'bg-neutral-900/20' : ''
                }`}
              >
                {/* Index / Play */}
                <div className="col-span-2 sm:col-span-1 text-center relative flex justify-center items-center">
                  <span className="text-neutral-500 group-hover:opacity-0 transition-opacity">{index + 1}</span>
                  <div className="absolute opacity-0 group-hover:opacity-100 text-white transition-opacity">
                    {isCurrent && isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="translate-x-[1px]" />}
                  </div>
                </div>

                {/* Track Title */}
                <div className="col-span-8 sm:col-span-5 flex items-center gap-3 min-w-0">
                  <img src={song.cover} className="w-10 h-10 rounded object-cover shadow" />
                  <div className="min-w-0">
                    <p className={`font-semibold truncate ${isCurrent ? 'text-[#00f3ff] neon-text-cyan' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{song.artist}</p>
                  </div>
                </div>

                {/* Album */}
                <span className="col-span-3 text-neutral-400 truncate hidden sm:block">
                  {song.album}
                </span>

                {/* Added At Date */}
                <span className="col-span-2 text-neutral-500 text-xs truncate hidden sm:block">
                  {new Date(song.createdAt).toLocaleDateString()}
                </span>

                {/* Duration & Actions */}
                <div className="col-span-2 sm:col-span-1 text-right flex items-center justify-end gap-3.5 pr-2 text-neutral-400">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLike(song); }}
                    className={`hover:text-white transition cursor-pointer ${isLiked ? 'text-[#00f3ff]' : ''}`}
                  >
                    <Heart size={14} fill={isLiked ? '#00f3ff' : 'none'} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRemoveTrack(song.id); }}
                    className="hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    title="Remove from playlist"
                  >
                    <Trash size={14} />
                  </button>
                  <span className="text-neutral-500 text-xs hidden sm:block">{formatDuration(song.duration)}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border border-neutral-900 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4">
          <p className="text-neutral-500 text-sm">This playlist has no songs yet.</p>
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
