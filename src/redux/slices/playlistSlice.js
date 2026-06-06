import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playlists: [],
  favorites: [],
  loading: false,
  error: null,
};

const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    playlistsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPlaylistsSuccess: (state, action) => {
      state.loading = false;
      state.playlists = action.payload;
    },
    fetchFavoritesSuccess: (state, action) => {
      state.loading = false;
      state.favorites = action.payload;
    },
    playlistsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addPlaylistSuccess: (state, action) => {
      state.playlists.unshift(action.payload);
    },
    deletePlaylistSuccess: (state, action) => {
      state.playlists = state.playlists.filter(p => p.id !== action.payload);
    },
    toggleFavoriteLocal: (state, action) => {
      const song = action.payload;
      const exists = state.favorites.some(s => s.id === song.id);
      if (exists) {
        state.favorites = state.favorites.filter(s => s.id !== song.id);
      } else {
        state.favorites.unshift(song);
      }
    }
  },
});

export const { 
  playlistsStart, 
  fetchPlaylistsSuccess, 
  fetchFavoritesSuccess, 
  playlistsFailure,
  addPlaylistSuccess,
  deletePlaylistSuccess,
  toggleFavoriteLocal
} = playlistSlice.actions;

export default playlistSlice.reducer;
