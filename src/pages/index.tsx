import { useEffect } from 'react';
import { MusicManager } from '../components/MusicManager';
import { NodeManager } from '../components/NodeManager';
import { SearchManager } from '../components/SearchManager';
import * as S from '../styles/pages/index';
import { useAppDispatch, useAppSelector } from '../features/store';
import { LOCAL_STORAGE_KEY } from '../constants/interface';
import { decodeV1, encodeV1 } from '../utils/encoding';
import { load } from '../features/mainSlice';
import { Player } from '../components/Player';

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
