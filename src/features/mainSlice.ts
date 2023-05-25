import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Music } from '../types/music';

interface MainState {
  musics: Record<number, Music>;
}

const initialState: MainState = {
  musics: {},
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    addMusic(state, action: PayloadAction<Music>) {
      const music = action.payload;
      state.musics[music.id] = music;
    },
  },
});

export const { addMusic } = mainSlice.actions;
