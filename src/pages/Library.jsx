import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Heart, Music, FolderHeart } from 'lucide-react';
import { createPlaylist } from '../services/api';
import { addPlaylistSuccess } from '../redux/slices/playlistSlice';

export default function Library() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { playlists, favorites } = useSelector((state) => state.playlists);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!playlistName.trim()) return;

    setLoading(true);
    try {
      const newPlaylist = await createPlaylist({
        name: playlistName,
        description: playlistDesc,
        isPrivate
      });
      dispatch(addPlaylistSuccess(newPlaylist));
      setPlaylistName('');
      setPlaylistDesc('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create playlist:', error);
      alert('Error creating playlist');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col gap-6 pb-16 select-none relative">
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Your Library</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#1db954] hover:bg-[#1ed760] text-black font-semibold text-sm px-4 py-2.5 rounded-full shadow transition transform hover:scale-103 active:scale-97 cursor-pointer"
        >
          <Plus size={18} />
          <span>Create Playlist</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Liked Songs Quick Card */}
        <div 
          onClick={() => navigate('/favorites')}
          className="md:col-span-2 bg-gradient-to-br from-violet-700 via-indigo-800 to-neutral-900 p-6 rounded-2xl flex flex-col justify-between h-56 hover:scale-102 transition duration-300 shadow-xl relative overflow-hidden group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
              <Heart size={28} fill="white" className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full text-neutral-200 backdrop-blur-sm">
              Favorites
            </span>
          </div>

          <div className="flex flex-col gap-1 z-10">
            <h2 className="text-3xl font-extrabold text-white">Liked Songs</h2>
            <p className="text-sm text-neutral-300 font-medium">
              {favorites.length} {favorites.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] w-36 h-36 bg-black/10 rounded-full group-hover:scale-110 transition duration-300 flex items-center justify-center pointer-events-none">
            <Heart size={64} className="text-white/5" fill="currentColor" />
          </div>
        </div>

        {/* User Playlists List */}
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            className="bg-neutral-900/40 hover:bg-neutral-800/60 p-4 rounded-xl border border-neutral-900/60 hover:border-neutral-800 transition duration-300 shadow-md group cursor-pointer flex flex-col gap-3 h-56"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-850 flex items-center justify-center max-h-32">
              {playlist.cover ? (
                <img 
                  src={playlist.cover} 
                  alt={playlist.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              ) : (
                <Music size={40} className="text-neutral-600" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-base truncate text-white group-hover:text-[#1db954] transition-colors">{playlist.name}</h3>
              <p className="text-xs text-neutral-400 truncate mt-1">
                Playlist • {playlist.isPrivate ? 'Private' : 'Public'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && (
        <div className="text-center py-20 border border-neutral-900/60 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3">
          <Music size={32} className="text-neutral-700" />
          <p className="text-neutral-500 text-sm">Create your first custom playlist to start seeding your favorite tracks.</p>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white border-b border-neutral-850 pb-2">New Playlist Details</h2>
            <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Name</label>
                <input
                  type="text"
                  placeholder="My Playlist #1"
                  required
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 focus:border-[#1db954] rounded-lg p-3 outline-none text-white transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Description</label>
                <textarea
                  placeholder="Give your playlist a descriptions..."
                  rows={3}
                  value={playlistDesc}
                  onChange={(e) => setPlaylistDesc(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 focus:border-[#1db954] rounded-lg p-3 outline-none text-white resize-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between border-t border-neutral-850 pt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 bg-neutral-950 accent-[#1db954] cursor-pointer"
                  />
                  <label htmlFor="isPrivate" className="text-sm text-neutral-300 select-none cursor-pointer">Private Playlist</label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 hover:bg-neutral-800 rounded-full text-sm font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-white hover:bg-neutral-200 text-black px-6 py-2 rounded-full font-bold text-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
