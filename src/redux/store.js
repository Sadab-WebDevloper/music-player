import { configureStore } from '@reduxjs/toolkit';

import playerReducer from './slices/playerSlice';
import playlistReducer from './slices/playlistSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    playlists: playlistReducer,
  },
});
