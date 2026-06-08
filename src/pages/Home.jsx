import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { playSong, togglePlay } from '../redux/slices/playerSlice';
import { getTrendingLocalSongs, getRecentlyPlayed } from '../services/api';
import SongCard from '../components/SongCard';
import { GridSkeleton } from '../components/SkeletonLoader';
import { Play } from 'lucide-react';

const popularArtists = [
  { name: 'Arijit Singh', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80' },
  { name: 'KK', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80' },
  { name: 'Karan Aujhla', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=200&q=80' }
];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentSong, isPlaying } = useSelector((state) => state.player);

  const [trendingLocal, setTrendingLocal] = useState([]);

  const [recentSongs, setRecentSongs] = useState([]);
  
  const [loadingLocal, setLoadingLocal] = useState(true);

  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const local = await getTrendingLocalSongs();
        setTrendingLocal(local);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLocal(false);
      }


    };

    fetchTrending();
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoadingRecent(true);
      try {
        const recent = await getRecentlyPlayed();
        setRecentSongs(recent);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecent();
  }, []);

  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return {
      title: 'Good morning, Sadab',
      subtext: 'Start your day with the perfect soundtrack. Enjoy energetic beats and fresh vibes.'
    };
    if (hour >= 12 && hour < 17) return {
      title: 'Good afternoon, Sadab',
      subtext: 'Keep the momentum going. Dive into your favorite playlists and discover new hits.'
    };
    if (hour >= 17 && hour < 21) return {
      title: 'Good evening, Sadab',
      subtext: 'Unwind and relax. Enjoy soothing melodies and your ultimate favorites.'
    };
    return {
      title: 'Good night, Sadab',
      subtext: 'Let the music play on. Tune into late-night vibes and deep tracks.'
    };
  };

  const { title, subtext } = getGreetingData();

  const handleSongPlay = (song, index, queue) => {
    if (currentSong?.id === song.id) {
      dispatch(togglePlay());
    } else {
      dispatch(playSong({ song, index, queue }));
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12 select-none animate-fade-in">
      {/* Hero Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-800 to-neutral-900 p-6 md:p-10 overflow-hidden shadow-2xl flex items-center justify-between min-h-[200px]">
        <div className="flex flex-col gap-3 max-w-lg z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">{title}</h1>
          <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
            {subtext}
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 opacity-10 md:opacity-20 pointer-events-none z-0">
          <img 
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Recently Played Section */}
      {recentSongs.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Recently Played</h2>
          {loadingRecent ? (
            <GridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {recentSongs.map((song, index) => (
                <SongCard 
                  key={`recent-${song.id}`}
                  song={song}
                  isPlaying={isPlaying}
                  isCurrentSong={currentSong && currentSong.id === song.id}
                  onClick={() => handleSongPlay(song, index, recentSongs)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Trending Local Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Trending Hits</h2>
        {loadingLocal ? (
          <GridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trendingLocal.map((song, index) => (
              <SongCard 
                key={`trend-${song.id}`}
                song={song}
                isPlaying={isPlaying}
                isCurrentSong={currentSong && currentSong.id === song.id}
                onClick={() => handleSongPlay(song, index, trendingLocal)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Popular Artists */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Popular Artists</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {popularArtists.map((artist) => (
            <div 
              key={artist.name}
              onClick={() => navigate(`/search?query=${encodeURIComponent(artist.name)}`)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-neutral-900/60 transition duration-300 group cursor-pointer"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg relative group">
                <img 
                  src={artist.cover} 
                  alt={artist.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={24} fill="white" className="text-white" />
                </div>
              </div>
              <span className="text-sm font-semibold text-neutral-200 group-hover:text-white truncate max-w-full text-center">
                {artist.name}
              </span>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
