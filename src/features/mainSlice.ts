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
  isLoading: boolean;
  findMusicId: number;
  findDepth: number;
  foundNodeList: MusicNode[];
  requireReactFlowRename: number;
  requireReactFlowNodeFind: number;
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
  isLoading: false,
  findMusicId: 0,
  findDepth: 0,
  foundNodeList: [],
  requireReactFlowRename: null,
  requireReactFlowNodeFind: null,
};

interface ConnectNodePayload {
  source: string;
  target: string;
}

interface MoveNodePayload {
  id: string;
  position: XYPosition;
}

interface RenameMusicPayload {
  id: number;
  name: string;
}

interface LoadPayload {
  musics: Record<number, Music>;
  musicNodes: Record<number, MusicNode>;
}

type PlayQuery = 'next' | 'skip' | number;

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    addMusic(state, action: PayloadAction<Music>) {
      const { id, name, videoId } = action.payload;
      addMusicInternal(state, id, name, videoId);
    },

    createMusicNode(state, action: PayloadAction<MusicNode>) {
      const { id, musicId, position } = action.payload;
      createMusicNodeInternal(state, id, musicId, position);
    },

    createMusicNodeByAnchor(state, action: PayloadAction<{ name: string; videoId: string; position: XYPosition }>) {
      const { name, videoId, position } = action.payload;
      let music = Object.values(state.musics).find((music) => music.videoId === videoId);
      if (!music) {
        const id = state.musicSequence;
        music = { id, name, videoId };
        addMusicInternal(state, id, name, videoId);
      }
      createMusicNodeInternal(state, state.musicNodeSequence, music.id, position);
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

    renameMusic(state, action: PayloadAction<RenameMusicPayload>) {
      const { id, name } = action.payload;
      state.musics[id].name = name;
      state.requireReactFlowRename = id;
    },

    setRequireReactFlowRename(state, action: PayloadAction<number>) {
      state.requireReactFlowRename = action.payload;
    },

    load(state, action: PayloadAction<LoadPayload>) {
      const { musics, musicNodes } = action.payload;
      state.musics = musics;
      state.musicNodes = musicNodes;
      state.musicSequence = getLastSequence(musics) + 1;
      state.musicNodeSequence = getLastSequence(musicNodes) + 1;
      state.pointer = null;
      state.requireReactFlowUpdate = true;
    },

    setRequireReactFlowUpdate(state, action: PayloadAction<boolean>) {
      state.requireReactFlowUpdate = action.payload;
    },

    playNode(state, action: PayloadAction<PlayQuery>) {
      if (state.isLoading) return;

      const query = action.payload;
      const next = getNextPointer(state.pointer, query, state.musicNodes);

      if (next) {
        state.reactFlowInstance.fitView({ maxZoom: state.reactFlowInstance.getZoom(), duration: 2000, nodes: [{ id: next.toString() }] });
        if (state.musicNodes[next].musicId !== state.musicNodes[state.pointer]?.musicId) state.isLoading = true;
        else state.requirePlayerRewind = true;
        state.pointer = next;
      } else {
        alert('마지막 노드입니다.');
        if (query === 'next') {
          state.pointer = null;
          state.isPlaying = false;
        }
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
        if (state.pointer === id) {
          state.pointer = null;
          state.isPlaying = false;
        }
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
      state.reactFlowInstance.zoomTo(1.7);
    },

    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },

    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    findByMusicId(state, action: PayloadAction<number>) {
      if (state.findMusicId !== action.payload) {
        state.findMusicId = action.payload;
        state.findDepth = 0;
      }

      state.foundNodeList = Object.values(state.musicNodes).filter(({ musicId }) => musicId === state.findMusicId);
      const { foundNodeList, reactFlowInstance } = state;

      if (state.findDepth >= foundNodeList.length) state.findDepth = 0;
      if (foundNodeList.length === 0) {
        alert('노드를 찾을 수 없어요.');
        return;
      }
      state.requireReactFlowNodeFind = foundNodeList[state.findDepth].id;
      state.findDepth++;
    },

    setRequireReactFlowNodeFind(state, action: PayloadAction<number>) {
      state.requireReactFlowNodeFind = action.payload;
    },

    reset(state) {
      state.musics = initialState.musics;
      state.musicNodes = initialState.musicNodes;
      state.musicSequence = initialState.musicSequence;
      state.musicNodeSequence = initialState.musicNodeSequence;
      state.requireReactFlowUpdate = true;
      state.pointer = initialState.pointer;
      state.isPlaying = initialState.isPlaying;
    },
  },
});

function getNextPointer(pointer: number, query: PlayQuery, musicNodes: Record<number, MusicNode>) {
  switch (query) {
    case 'next':
    case 'skip': {
      return musicNodes[pointer]?.next ?? null;
    }
    default: {
      return query;
    }
  }
}

function addMusicInternal(state: MainState, id: number, name: string, videoId: string) {
  const music = { id, name, videoId };
  if (Object.values(state.musics).find(({ videoId }) => videoId === music.videoId)) return;
  state.musics[id] = music;
  state.musicSequence++;
}

function createMusicNodeInternal(state: MainState, id: number, musicId: number, position: XYPosition) {
  const musicNode = { id, musicId, position, next: null };
  state.musicNodes[id] = musicNode;
  state.musicNodeSequence++;
  state.newNode = musicNode;
}

export const {
  addMusic,
  createMusicNode,
  createMusicNodeByAnchor,
  connectNode,
  moveNode,
  load,
  setRequireReactFlowUpdate,
  playNode,
  setRequirePlayerRewind,
  deleteNodes,
  deleteEdges,
  setReactFLowInstance,
  setIsPlaying,
  setIsLoading,
  findByMusicId,
  reset,
  renameMusic,
  setRequireReactFlowRename,
  setRequireReactFlowNodeFind,
} = mainSlice.actions;
