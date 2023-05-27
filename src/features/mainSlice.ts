import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Music } from '../types/music';
import { MusicNode } from '../types/musicNode';
import { ReactFlowInstance, XYPosition } from 'reactflow';
import { getLastSequence } from '../utils/encoding';

interface MainState {
  musics: Record<number, Music>;
  musicNodes: Record<number, MusicNode>;
  requireReactFlowUpdate: boolean;
  pointer: number;
  requirePlayerRewind: boolean;
  newNode: MusicNode;
  reactFlowInstance: ReactFlowInstance;
  musicSequence: number;
  musicNodeSequence: number;
  isPlaying: boolean;
  findMusicId: number;
  findDepth: number;
  foundNodeList: MusicNode[];
}

const initialState: MainState = {
  musics: {},
  musicNodes: {},
  requireReactFlowUpdate: false,
  pointer: null,
  requirePlayerRewind: false,
  newNode: null,
  reactFlowInstance: null,
  musicSequence: 1,
  musicNodeSequence: 1,
  isPlaying: false,
  findMusicId: 0,
  findDepth: 0,
  foundNodeList: [],
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
      if (Object.values(state.musics).find(({ videoId }) => videoId === music.videoId)) return;
      state.musics[music.id] = music;
      state.musicSequence++;
    },

    createMusicNode(state, action: PayloadAction<MusicNode>) {
      const musicNode = action.payload;
      state.musicNodes[musicNode.id] = musicNode;
      state.newNode = musicNode;
      state.musicNodeSequence++;
    },

    connectNode(state, action: PayloadAction<ConnectNodePayload>) {
      const { source, target } = action.payload;
      state.musicNodes[Number(source)].next = Number(target);
    },

    moveNode(state, action: PayloadAction<MoveNodePayload[]>) {
      action.payload.forEach(({ id, position }) => {
        const musicNode = state.musicNodes[Number(id)];
        if (!musicNode) return;
        musicNode.position = position;
      });
    },

    load(state, action: PayloadAction<LoadPayload>) {
      const { musics, musicNodes } = action.payload;
      state.musics = musics;
      state.musicNodes = musicNodes;
      state.musicSequence = getLastSequence(musics) + 1;
      state.musicNodeSequence = getLastSequence(musicNodes) + 1;
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
        state.reactFlowInstance.fitView({ maxZoom: state.reactFlowInstance.getZoom(), duration: 2000, nodes: [{ id: next.toString() }] });
      } else {
        alert('마지막 노드입니다.');
      }
    },

    setRequirePlayerRewind(state, action: PayloadAction<boolean>) {
      state.requirePlayerRewind = action.payload;
    },

    deleteNodes(state, action: PayloadAction<number[]>) {
      const musicNodeList = Object.values(state.musicNodes);
      action.payload.forEach((id) => {
        musicNodeList.forEach((musicNode) => {
          if (musicNode.next === id) state.musicNodes[musicNode.id].next = null;
        });
        delete state.musicNodes[id];
      });
    },

    deleteEdges(state, action: PayloadAction<number[]>) {
      action.payload.forEach((id) => {
        const musicNode = state.musicNodes[id];
        if (!musicNode) return;
        musicNode.next = null;
      });
    },

    setReactFLowInstance(state, action: PayloadAction<ReactFlowInstance>) {
      state.reactFlowInstance = action.payload;
    },

    setIsPlaying(state, action: PayloadAction<boolean>) {
      if (state.pointer === null) return;
      state.isPlaying = action.payload;
    },

    findByMusicId(state, action: PayloadAction<number>) {
      if (state.findMusicId !== action.payload) {
        state.findMusicId = action.payload;
        state.findDepth = 0;
        state.foundNodeList = Object.values(state.musicNodes).filter(({ musicId }) => musicId === state.findMusicId);
      }

      const { foundNodeList, reactFlowInstance } = state;

      if (foundNodeList.length === 0) {
        alert('노드를 찾을 수 없어요.');
        return;
      }
      if (state.findDepth >= foundNodeList.length) state.findDepth = 0;
      reactFlowInstance.fitView({ maxZoom: reactFlowInstance.getZoom(), duration: 2000, nodes: [{ id: foundNodeList[state.findDepth].id.toString() }] });
      state.findDepth++;
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

export const { addMusic, createMusicNode, connectNode, moveNode, load, setRequireReactFlowUpdate, playNode, setRequirePlayerRewind, deleteNodes, deleteEdges, setReactFLowInstance, setIsPlaying, findByMusicId } = mainSlice.actions;
