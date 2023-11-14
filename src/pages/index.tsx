import { useEffect, useRef, useState } from 'react';
import { MusicManager } from '../components/MusicManager/MusicManager';
import { NodeManager } from '../components/NodeManager/NodeManager';
import { SearchManager } from '../components/SearchManager/SearchManager';
import { useAppDispatch, useAppSelector } from '../features/store';
import { createMusicNodeV2, load, toggleIsPlaying } from '../features/mainSlice';
import { Player } from '../components/MusicPlayer/MusicPlayer';
import { UpIcon } from '../components/icons/UpIcon';
import { DownIcon } from '../components/icons/DownIcon';
import { CurrentNodeInfo } from '../components/CurrentNodeInfo/CurrentNodeInfo';
import { throttle } from 'lodash';
import { 분, 초 } from '../constants/time';
import { exitTutorial } from '../features/tutorialSlice';
import { extractVideoId } from '../utils/youtube';
import { cursorPointer } from '../components/icons/CursorPointer.css';
import { currentNodeInfo, homePage, nodeList, nodeManager, searchBox, uiSection, uiSectionContainer } from '../styles/pages/home.css';
import { handleUnauthorized, http } from '../utils/api';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { Music } from '../types/music';
import { MusicNode } from '../types/musicNode';
import { HOST } from '../constants/auth';
import { parse, serialize } from 'cookie';

interface HomePageProps {
  readonly: boolean;
  musics: Record<number, Music>;
  musicNodes: Record<number, MusicNode>;
}

function Home({ readonly, musics, musicNodes }: HomePageProps) {
  const dispatch = useAppDispatch();
  const { reactFlowInstance } = useAppSelector((state) => state.main);
  const { tutorials } = useAppSelector((state) => state.tutorial);

  const [isUiOpen, setIsUiOpen] = useState(true);

  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    dispatch(load({ musics, musicNodes }));
  }, []);

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

  const handleAnchorDrop = async (e: React.DragEvent) => {
    if (readonly) return;

    const url = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');

    const videoId = extractVideoId(url);
    if (!videoId) return;

    const position = reactFlowInstance.project({ x: e.clientX, y: e.clientY });

    const response = await http.post('/api/data/music-node', { videoId, position });
    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    const { music, musicNode } = await response.json();
    dispatch(createMusicNodeV2({ music, musicNode }));
  };

  const handleUiSectionMouseMove = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsUiOpen(false);
    }, 1 * 분);
  };

  return (
    <div className={homePage} onDrop={handleAnchorDrop}>
      {Object.values(tutorials).findIndex((tutorial) => tutorial) !== -1 && (
        <div style={{ position: 'absolute', zIndex: 999, cursor: 'pointer' }} onClick={() => dispatch(exitTutorial())}>
          튜토리얼 종료
        </div>
      )}
      <div className={currentNodeInfo}>
        <CurrentNodeInfo readonly={readonly} />
      </div>
      <div className={nodeManager}>
        <NodeManager readonly={readonly} />
      </div>

      <div className={uiSectionContainer({ open: isUiOpen })}>
        <div className={cursorPointer} onClick={() => setIsUiOpen(!isUiOpen)}>
          {isUiOpen ? <DownIcon /> : <UpIcon />}
        </div>
        <div className={uiSection} onMouseMove={throttle(handleUiSectionMouseMove, 3 * 초)}>
          {!readonly && (
            <>
              <div className={nodeList}>
                <MusicManager />
              </div>
              <div className={searchBox}>
                <SearchManager />
              </div>
            </>
          )}
          <Player />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<HomePageProps>> {
  const { token } = parse(context.req.headers?.cookie ?? '');

  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 60,
  });

  const response = await http.get(`${HOST}/api/data`, {
    credentials: 'include',
    headers: {
      Cookie: cookie,
    },
  });

  if (response.status !== 200) {
    return {
      props: {
        readonly: true,
        musics: {},
        musicNodes: {},
      },
    };
  }

  const { musics: musicList, musicNodes: musicNodeList } = await response.json();

  const musics = Object.fromEntries(musicList.map((music: Music) => [music.id, music]));
  const musicNodes = Object.fromEntries(musicNodeList.map((musicNode: MusicNode) => [musicNode.id, musicNode]));

  return {
    props: {
      readonly: false,
      musics,
      musicNodes,
    },
  };
}

export default Home;
