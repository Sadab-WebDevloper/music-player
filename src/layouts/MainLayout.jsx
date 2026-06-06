import React, { useRef, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BottomPlayer from '../components/BottomPlayer';
import { 
  setIsPlaying, nextSong, prevSong, setDuration, setCurrentTime, setVolume 
} from '../redux/slices/playerSlice';
import { fetchPlaylistsSuccess, fetchFavoritesSuccess } from '../redux/slices/playlistSlice';
import { getPlaylists, getLikedSongs, recordPlay } from '../services/api';

export default function MainLayout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { currentSong, isPlaying, volume, isRepeat } = useSelector((state) => state.player);

  const audioRef = useRef(null);
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [durationState, setDurationState] = useState(0);
  const [savedVolume, setSavedVolume] = useState(0.5);

  // Sync playlists and favorites on load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [playlistsData, favoritesData] = await Promise.all([
          getPlaylists(),
          getLikedSongs()
        ]);
        dispatch(fetchPlaylistsSuccess(playlistsData));
        dispatch(fetchFavoritesSuccess(favoritesData));
      } catch (error) {
        console.error('Error fetching library:', error);
      }
    };
    fetchUserData();
  }, [dispatch]);

  // Audio Play/Pause Sync
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error('Playback aborted:', err);
        dispatch(setIsPlaying(false));
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong, dispatch]);

  // Handle Song Change
  useEffect(() => {
    if (currentSong && audioRef.current) {
      // Record play count on backend (non-blocking)
      if (!currentSong.isExternal) {
        recordPlay(currentSong.id).catch(err => console.error(err));
      }
    }
  }, [currentSong]);

  // Sync Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Audio Event Handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTimeState(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDurationState(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error(e));
    } else {
      dispatch(nextSong());
    }
  };

  // Progress Seek Interaction
  const handleProgressClick = (e) => {
    if (!durationState || !audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * durationState;
    audioRef.current.currentTime = newTime;
    setCurrentTimeState(newTime);
  };

  // Volume Controls
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    dispatch(setVolume(val));
    if (val > 0) setSavedVolume(val);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setSavedVolume(volume);
      dispatch(setVolume(0));
    } else {
      dispatch(setVolume(savedVolume || 0.5));
    }
  };

  // Keyboard Shortcuts (Space, arrows, etc.)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is writing in any inputs
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          dispatch(setIsPlaying(!isPlaying));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (audioRef.current) {
            const newTime = Math.max(0, audioRef.current.currentTime - 5);
            audioRef.current.currentTime = newTime;
            setCurrentTimeState(newTime);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (audioRef.current) {
            const newTime = Math.min(durationState, audioRef.current.currentTime + 5);
            audioRef.current.currentTime = newTime;
            setCurrentTimeState(newTime);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          dispatch(setVolume(Math.min(1, volume + 0.1)));
          break;
        case 'ArrowDown':
          e.preventDefault();
          dispatch(setVolume(Math.max(0, volume - 0.1)));
          break;
        case 'KeyN':
          e.preventDefault();
          dispatch(nextSong());
          break;
        case 'KeyP':
          e.preventDefault();
          dispatch(prevSong());
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, durationState, dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans">
      {/* Sidebar Nav */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative pb-[120px] md:pb-20">
        <Topbar />
        
        {/* Scrollable Content View */}
        <main className="flex-grow overflow-y-auto px-4 md:px-6 pt-14 md:pt-6 pb-6 scroll-smooth">
          <Outlet />
        </main>
      </div>

      {/* Bottom Media Player */}
      <BottomPlayer 
        currentTime={currentTimeState}
        duration={durationState}
        onProgressClick={handleProgressClick}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        toggleMute={toggleMute}
        savedVolume={savedVolume}
      />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong ? currentSong.path : ''}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="auto"
      />
    </div>
  );
}
