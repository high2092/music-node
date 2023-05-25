import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Music } from '../types/music';
import { MusicNode } from '../types/musicNode';
import { XYPosition } from 'reactflow';
import { musicNodeService } from '../server/MusicNodeService';
import { musicService } from '../server/MusicService';

interface MainState {
  musics: Record<number, Music>;
  musicNodes: Record<number, MusicNode>;
  requireReactFlowUpdate: boolean;
  pointer: number;
  requirePlayerRewind: boolean;
}

const initialState: MainState = {
  musics: {},
  musicNodes: {},
  requireReactFlowUpdate: false,
  pointer: null,
  requirePlayerRewind: false,
};

interface ConnectNodePayload {
  source: string;
  target: string;
}

interface MoveNodePayload {
  id: string;
  position: XYPosition;
}

interface LoadPayload {
  musics: Record<number, Music>;
  musicNodes: Record<number, MusicNode>;
}

type PlayQuery = 'next' | number;

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

    load(state, action: PayloadAction<LoadPayload>) {
      const { musics, musicNodes } = action.payload;
      musicService.sequence = Object.values(musics).length + 1;
      musicNodeService.sequence = Object.values(musicNodes).length + 1;
      state.musics = musics;
      state.musicNodes = musicNodes;
      state.requireReactFlowUpdate = true;
    },

    setRequireReactFlowUpdate(state, action: PayloadAction<boolean>) {
      state.requireReactFlowUpdate = action.payload;
    },

    playNode(state, action: PayloadAction<PlayQuery>) {
      const next = getNextPointer(state.pointer, action.payload, state.musicNodes);

      if (next) {
        state.pointer = next;
        state.requirePlayerRewind = true;
      } else {
        alert('마지막 노드입니다.');
      }
    },

    setRequirePlayerRewind(state, action: PayloadAction<boolean>) {
      state.requirePlayerRewind = action.payload;
    },
  },
});

function getNextPointer(pointer: number, query: PlayQuery, musicNodes: Record<number, MusicNode>) {
  switch (query) {
    case 'next': {
      return musicNodes[pointer]?.next ?? null;
    }
    default: {
      return query;
    }
  }
}

export const { addMusic, createMusicNode, connectNode, moveNode, load, setRequireReactFlowUpdate, playNode, setRequirePlayerRewind } = mainSlice.actions;
