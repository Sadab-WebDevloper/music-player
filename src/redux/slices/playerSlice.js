import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSong: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
  volume: 0.5,
  currentTime: 0,
  duration: 0,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playSong: (state, action) => {
      const { song, index, queue } = action.payload;
      state.currentSong = song;
      state.isPlaying = true;
      if (queue) {
        state.queue = queue;
        state.currentIndex = index;
      } else {
        // Find or add song to queue
        const existingIdx = state.queue.findIndex(s => s.id === song.id);
        if (existingIdx !== -1) {
          state.currentIndex = existingIdx;
        } else {
          state.queue.push(song);
          state.currentIndex = state.queue.length - 1;
        }
      }
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    togglePlay: (state) => {
      if (state.currentSong) {
        state.isPlaying = !state.isPlaying;
      }
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    nextSong: (state) => {
      if (state.queue.length === 0) return;

      if (state.isShuffle) {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * state.queue.length);
        } while (newIndex === state.currentIndex && state.queue.length > 1);
        
        state.currentIndex = newIndex;
      } else {
        state.currentIndex = (state.currentIndex + 1) % state.queue.length;
      }
      state.currentSong = state.queue[state.currentIndex];
      state.isPlaying = true;
    },
    prevSong: (state) => {
      if (state.queue.length === 0) return;

      state.currentIndex = state.currentIndex - 1 < 0 ? state.queue.length - 1 : state.currentIndex - 1;
      state.currentSong = state.queue[state.currentIndex];
      state.isPlaying = true;
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },
    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
      state.currentIndex = -1;
      state.currentSong = null;
      state.isPlaying = false;
    }
  },
});

export const { 
  playSong, 
  setQueue, 
  togglePlay, 
  setIsPlaying, 
  nextSong, 
  prevSong, 
  toggleShuffle, 
  toggleRepeat, 
  setVolume, 
  setCurrentTime, 
  setDuration,
  addToQueue,
  clearQueue
} = playerSlice.actions;

export default playerSlice.reducer;
