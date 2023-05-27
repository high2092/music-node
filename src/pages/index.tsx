import { useEffect, useState } from 'react';
import { MusicManager } from '../components/MusicManager';
import { NodeManager } from '../components/NodeManager';
import { SearchManager } from '../components/SearchManager';
import * as S from '../styles/pages/index';
import { useAppDispatch, useAppSelector } from '../features/store';
import { LOCAL_STORAGE_KEY } from '../constants/interface';
import { addMusic, createMusicNode, load } from '../features/mainSlice';
import { Player } from '../components/Player';
import { decodeV1, encodeV1 } from '../utils/encoding';
import { IconDiv } from '../components/icons/IconDiv';
import { UpIcon } from '../components/icons/UpIcon';
import { DownIcon } from '../components/icons/DownIcon';
import { CurrentNodeInfo } from '../components/CurrentNodeInfo';

function Home() {
  const dispatch = useAppDispatch();
  const { musics, musicNodes, reactFlowInstance, musicSequence, musicNodeSequence } = useAppSelector((state) => state.main);

  const [isUiOpen, setIsUiOpen] = useState(true);

  useEffect(() => {
    const { musics, musicNodes } = JSON.parse(decodeV1(localStorage.getItem(LOCAL_STORAGE_KEY)));
    dispatch(load({ musics, musicNodes }));
  }, []);

  useEffect(() => {
    if (Object.values(musics).length == 0 && Object.values(musicNodes).length == 0) return;

    const code = encodeV1(JSON.stringify({ musics, musicNodes }));
    localStorage.setItem(LOCAL_STORAGE_KEY, code);
  }, [musics, musicNodes]);

  const handleAnchorDrop = async (e: React.DragEvent) => {
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

    const { title: name } = await response.json();
    const music = { id: musicSequence, name, videoId };
    const position = reactFlowInstance.project({ x: e.clientX, y: e.clientY });
    const musicNode = { id: musicNodeSequence, musicId: music.id, position, next: null };

    dispatch(addMusic(music));
    dispatch(createMusicNode(musicNode));
  };

  return (
    <S.Home onDrop={handleAnchorDrop}>
      <S.CurrentNodeInfoSection>
        <CurrentNodeInfo />
      </S.CurrentNodeInfoSection>
      <S.NodeManagerSection>
        <NodeManager />
      </S.NodeManagerSection>
      <S.UiSectionContainer open={isUiOpen}>
        <IconDiv onClick={() => setIsUiOpen(!isUiOpen)}>{isUiOpen ? <DownIcon /> : <UpIcon />}</IconDiv>
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
      </S.UiSectionContainer>
    </S.Home>
  );
}

export default Home;
