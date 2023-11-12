import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '../features/store';
import { load } from '../features/mainSlice';
import { Music } from '../types/music';
import { MusicNode } from '../types/musicNode';
import { http } from '../utils/api';

export function useData() {
  const dispatch = useAppDispatch();

  const loadDB = useCallback(async () => {
    const response = await http.get('/api/data');
    if (response.status !== 200) return;

    const { musics: musicList, musicNodes: musicNodeList } = await response.json();

    const musics = Object.fromEntries(musicList.map((music: Music) => [music.id, music]));
    const musicNodes = Object.fromEntries(musicNodeList.map((musicNode: MusicNode) => [musicNode.id, musicNode]));

    dispatch(load({ musics, musicNodes }));
  }, []);

  useEffect(() => {
    loadDB();
  }, []);
}
