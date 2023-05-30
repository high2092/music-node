import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Music } from '../types/music';
import { MusicNode } from '../types/musicNode';
import { ReactFlowInstance, XYPosition } from 'reactflow';
import { getLastSequence } from '../utils/encoding';
import { Draft } from '@reduxjs/toolkit';
import { CircularQueue } from '../utils/CircularQueue';

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
  log: CircularQueue<string>;
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
  log: new CircularQueue<string>(20),
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
      state.log.enqueue('add music');
      addMusicInternal(state, id, name, videoId);
    },

    createMusicNode(state, action: PayloadAction<MusicNode>) {
      const { id, musicId, position } = action.payload;
      state.log.enqueue(`create node ${id}`);
      createMusicNodeInternal(state, id, musicId, position);
    },

    createMusicNodeByAnchor(state, action: PayloadAction<{ name: string; videoId: string; position: XYPosition }>) {
      const { name, videoId, position } = action.payload;
      state.log.enqueue('create node by anchor');
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
      state.log.enqueue(`connect node ${source}-${target}`);
      state.musicNodes[Number(source)].next = Number(target);
    },

    moveNode(state, action: PayloadAction<MoveNodePayload[]>) {
      state.log.enqueue(`move node ${action.payload.map(({ id }) => id).join(' ')}`);
      action.payload.forEach(({ id, position }) => {
        const musicNode = state.musicNodes[Number(id)];
        if (!musicNode) return;
        musicNode.position = position;
      });
    },

    renameMusic(state, action: PayloadAction<RenameMusicPayload>) {
      const { id, name } = action.payload;
      state.log.enqueue(`rename music ${id}`);
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
      state.log.enqueue(`play node ${next} (query: ${query})`);

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
      state.log.enqueue(`delete node ${action.payload.join(' ')}`);
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
      state.log.enqueue(`disconnect node ${action.payload.map((id) => `${id}-${state.musicNodes[id].next}`).join(' ')}`);
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
      state.isPlaying = action.payload;
    },

    toggleIsPlaying(state) {
      state.log.enqueue(`play/pause`);
      if (state.pointer === null || state.isLoading) return;
      state.isPlaying = !state.isPlaying;
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

function addMusicInternal(state: Draft<MainState>, id: number, name: string, videoId: string) {
  const music = { id, name, videoId };
  if (Object.values(state.musics).find(({ videoId }) => videoId === music.videoId)) return;
  state.musics[id] = music;
  state.musicSequence++;
}

function createMusicNodeInternal(state: Draft<MainState>, id: number, musicId: number, position: XYPosition) {
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
  toggleIsPlaying,
  setIsLoading,
  findByMusicId,
  reset,
  renameMusic,
  setRequireReactFlowRename,
  setRequireReactFlowNodeFind,
} = mainSlice.actions;
