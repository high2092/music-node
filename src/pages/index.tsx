import { useEffect } from 'react';
import { MusicManager } from '../components/MusicManager';
import { NodeManager } from '../components/NodeManager';
import { SearchManager } from '../components/SearchManager';
import * as S from '../styles/pages/index';
import { useAppDispatch, useAppSelector } from '../features/store';
import { LOCAL_STORAGE_KEY } from '../constants/interface';
import { decodeV1, encodeV1 } from '../utils/encoding';
import { addMusic, createMusicNode, load } from '../features/mainSlice';
import { Player } from '../components/Player';
import { musicService } from '../server/MusicService';
import { musicNodeService } from '../server/MusicNodeService';

function Home() {
  const dispatch = useAppDispatch();
  const { musics, musicNodes } = useAppSelector((state) => state.main);

  useEffect(() => {
    const code = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!code) return;

    const { musics, musicNodes } = JSON.parse(decodeV1(localStorage.getItem(LOCAL_STORAGE_KEY)));
    dispatch(load({ musics, musicNodes }));
  }, []);

  useEffect(() => {
    if (Object.values(musics).length == 0 && Object.values(musicNodes).length == 0) return;

    const code = encodeV1(JSON.stringify({ musics, musicNodes }));
    localStorage.setItem(LOCAL_STORAGE_KEY, code);
  }, [musics, musicNodes]);

  useEffect(() => {
    const preventDefault = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleAnchorDrag = async (e: DragEvent) => {
      const url = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');
      const regex = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;

      const match = url.match(regex);

      if (!match) return;
      const videoId = match[1];

      const response = await fetch(`/api/video-title?videoId=${videoId}`);
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }

      const { title } = await response.json();
      const music = musicService.createMusic(title, videoId);
      const musicNode = musicNodeService.createMusicNode(title, videoId);

      dispatch(addMusic(music));
      dispatch(createMusicNode(musicNode));
    };

    window.addEventListener('dragover', preventDefault);
    window.addEventListener('drop', handleAnchorDrag);
    return () => {
      window.removeEventListener('dragover', preventDefault);
      window.removeEventListener('drop', handleAnchorDrag);
    };
  }, []);

  return (
    <S.Home>
      <S.NodeManagerSection>
        <NodeManager />
      </S.NodeManagerSection>
      <S.UiSection>
        <S.NodeListSection>
          <MusicManager />
        </S.NodeListSection>
        <S.SearchSection>
          <SearchManager />
        </S.SearchSection>
        <S.PlayerSection>
          <Player />
        </S.PlayerSection>
      </S.UiSection>
    </S.Home>
  );
}

export default Home;
