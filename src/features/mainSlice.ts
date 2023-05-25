import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Music } from '../types/music';
import { MusicNode } from '../types/musicNode';
import { XYPosition } from 'reactflow';

interface MainState {
  musics: Record<number, Music>;
  musicNodes: Record<number, MusicNode>;
}

const initialState: MainState = {
  musics: {},
  musicNodes: {},
};

interface ConnectNodePayload {
  source: string;
  target: string;
}

interface MoveNodePayload {
  id: string;
  position: XYPosition;
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    addMusic(state, action: PayloadAction<Music>) {
      const music = action.payload;
      state.musics[music.id] = music;
    },

    createMusicNode(state, action: PayloadAction<MusicNode>) {
      const musicNode = action.payload;
      state.musicNodes[musicNode.id] = musicNode;
    },

    connectNode(state, action: PayloadAction<ConnectNodePayload>) {
      const { source, target } = action.payload;
      state.musicNodes[Number(source)].next = Number(target);
    },

    moveNode(state, action: PayloadAction<MoveNodePayload[]>) {
      action.payload.forEach(({ id, position }) => {
        state.musicNodes[Number(id)].position = position;
      });
    },
  },
});

export const { addMusic, createMusicNode, connectNode, moveNode } = mainSlice.actions;
