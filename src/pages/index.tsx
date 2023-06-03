import { useEffect, useRef, useState } from 'react';
import { MusicManager } from '../components/MusicManager';
import { NodeManager } from '../components/NodeManager';
import { SearchManager } from '../components/SearchManager';
import * as S from '../styles/pages/index';
import { useAppDispatch, useAppSelector } from '../features/store';
import { LOCAL_STORAGE_KEY } from '../constants/interface';
import { createMusicNodeByAnchor, load, reset, toggleIsPlaying } from '../features/mainSlice';
import { Player } from '../components/Player';
import { decodeV1, encodeV1 } from '../utils/encoding';
import { IconDiv } from '../components/icons/IconDiv';
import { UpIcon } from '../components/icons/UpIcon';
import { DownIcon } from '../components/icons/DownIcon';
import { CurrentNodeInfo } from '../components/CurrentNodeInfo';
import { ImportIcon } from '../components/icons/ImportIcon';
import { ExportIcon } from '../components/icons/ExportIcon';
import { openModal } from '../features/modalSlice';
import { ModalTypes } from '../types/modal';
import { ResetIcon } from '../components/icons/ResetIcon';
import { throttle } from 'lodash';
import { 분, 초 } from '../constants/time';
import { exitTutorial, startTutorial } from '../features/tutorialSlice';
import { extractVideoId } from '../utils/youtube';

function Home() {
  const dispatch = useAppDispatch();
  const { musics, musicNodes, reactFlowInstance } = useAppSelector((state) => state.main);
  const { tutorials } = useAppSelector((state) => state.tutorial);

  const [isUiOpen, setIsUiOpen] = useState(true);

  const loadInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const handleSpaceKeyDown = (e: KeyboardEvent) => {
      if (e.key !== ' ') return;

      dispatch(toggleIsPlaying());
    };

    const throttled = throttle(handleSpaceKeyDown, 0.2 * 초);

    window.addEventListener('keydown', throttled);
    return () => window.removeEventListener('keydown', throttled);
  }, []);

  useEffect(() => {
    handleUiSectionMouseMove();
  }, []);

  useEffect(() => {
    const code = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!code) {
      fetch('/data/demo.mnode', { method: 'GET' })
        .then((response) => response.text())
        .then((code) => {
          const { musics, musicNodes } = decodeV1(code);
          dispatch(load({ musics, musicNodes }));
        });

      dispatch(startTutorial());
    } else {
      try {
        const { musics, musicNodes } = decodeV1(code);
        dispatch(load({ musics, musicNodes }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (Object.values(musics).length == 0 && Object.values(musicNodes).length == 0) return;

    const code = encodeV1(musics, musicNodes);
    localStorage.setItem(LOCAL_STORAGE_KEY, code);
  }, [musics, musicNodes]);

  const handleAnchorDrop = async (e: React.DragEvent) => {
    const url = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');

    const videoId = extractVideoId(url);
    if (!videoId) return;

    const response = await fetch(`/api/video-title?videoId=${videoId}`);
    if (!response.ok) {
      console.error(response.statusText);
      return;
    }

    const { title: name } = await response.json();
    const position = reactFlowInstance.project({ x: e.clientX, y: e.clientY });
    dispatch(createMusicNodeByAnchor({ name, videoId, position }));
  };

  const handleFileInputChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const file = target.files[0];

    if (!file) return;

    const LOAD_CONFIRM_MESSAGE = `정말 플레이리스트를 불러올까요? 현재 상태가 덮어 써져요.`;
    const reader = new FileReader();
    reader.onload = () => {
      const code = reader.result as string;
      try {
        const { musics, musicNodes } = decodeV1(code);
        if (!confirm(LOAD_CONFIRM_MESSAGE)) return;
        dispatch(load({ musics, musicNodes }));
      } catch (e) {
        alert(e.message);
      }
    };
    reader.readAsText(file);
    target.value = '';
  };

  const handleResetButtonClick = () => {
    const RESET_CONFIRM_MESSAGE = '정말 현재 상태를 초기화할까요?';
    if (!confirm(RESET_CONFIRM_MESSAGE)) return;
    dispatch(reset());
  };

  const handleUiSectionMouseMove = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsUiOpen(false);
    }, 1 * 분);
  };

  return (
    <S.Home onDrop={handleAnchorDrop}>
      {Object.values(tutorials).findIndex((tutorial) => tutorial) !== -1 && (
        <div style={{ position: 'absolute', zIndex: 999, cursor: 'pointer' }} onClick={() => dispatch(exitTutorial())}>
          튜토리얼 종료
        </div>
      )}
      <S.CurrentNodeInfoSection>
        <CurrentNodeInfo />
      </S.CurrentNodeInfoSection>
      <S.NodeManagerSection>
        <NodeManager />
      </S.NodeManagerSection>
      <S.UiSectionContainer open={isUiOpen}>
        <div>
          <input ref={loadInputRef} id="load" type="file" accept=".mnode" onChange={handleFileInputChange} hidden />
          <S.ButtonSection>
            <IconDiv onClick={() => loadInputRef.current?.click()}>
              <ImportIcon />
            </IconDiv>
            <IconDiv onClick={() => dispatch(openModal({ type: ModalTypes.EXPORT }))}>
              <ExportIcon />
            </IconDiv>
            <IconDiv onClick={handleResetButtonClick}>
              <ResetIcon />
            </IconDiv>
          </S.ButtonSection>
          <IconDiv onClick={() => setIsUiOpen(!isUiOpen)}>{isUiOpen ? <DownIcon /> : <UpIcon />}</IconDiv>
        </div>
        <S.UiSection onMouseMove={throttle(handleUiSectionMouseMove, 3 * 초)}>
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
