import { TOP_BAR_HEIGHT } from '../../constants/style';
import { load, playNode, setIsPlaying, setRequireReactFlowNodeFind } from '../../features/mainSlice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { shorten } from '../../utils/string';
import { CdIcon } from '../icons/CdIcon';
import { PauseIcon } from '../icons/PauseIcon';
import { PlayIcon } from '../icons/PlayIcon';
import { ScopeIcon } from '../icons/ScopeIcon';
import { SkipToNextIcon } from '../icons/SkipToNextIcon';
import { SkipToPrevIcon } from '../icons/SkipToPrevIcon';
import { MapIcon } from '../icons/MapIcon';
import { setShowMap } from '../../features/uiSlice';
import { EmptyMapIcon } from '../icons/EmptyMapIcon';
import { cursorPointer } from '../icons/CursorPointer.css';
import { cdIcon, helpButton, login } from './CurrentNodeInfo.css';
import { LOCAL_STORAGE_KEY } from '../../constants/interface';
import { decodeV1 } from '../../utils/encoding';
import { handleUnauthorized, http } from '../../utils/api';
import { useEffect, useState } from 'react';
import { getCookie, setCookieDangerously } from '../../utils/cookie';
import Link from 'next/link';
import { HomeIcon } from '../icons/HomeIcon';
import { HelpIcon } from '../icons/HelpIcon';
import { openModal } from '../../features/modalSlice';
import { ModalTypes } from '../../types/modal';

const COOKIE_KEY = 'APPLY_LOCAL';

interface CurrentNodeInfoProps {
  readonly: boolean;
}

const TUTORIAL_COOKIE_KEY = 'MNODE_VISIT';

export function CurrentNodeInfo({ readonly }: CurrentNodeInfoProps) {
  const dispatch = useAppDispatch();
  const { musicNodes, musics, pointer, isPlaying, reactFlowInstance } = useAppSelector((state) => state.main);
  const { showMap } = useAppSelector((state) => state.ui);

  const [showLocalDataHelpText, setShowLocalDataHelpText] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [tutorial, setTutorial] = useState(false);

  const currentMusicName = musics[musicNodes[pointer]?.musicId]?.name;

  useEffect(() => {
    const visited = getCookie(TUTORIAL_COOKIE_KEY);
    if (!visited) setTutorial(true);
  }, []);

  useEffect(() => {
    const code = localStorage.getItem(LOCAL_STORAGE_KEY);
    const alreadyApplyLocal = getCookie(COOKIE_KEY);
    if (!alreadyApplyLocal && code && !readonly) setShowLocalDataHelpText(true);
  }, []);

  return (
    <div>
      <div style={{ flexGrow: 1, height: TOP_BAR_HEIGHT, paddingTop: '0.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ paddingRight: '0.3rem' }}>
            <div className={cdIcon({ active: isPlaying })}>
              <CdIcon />
            </div>
          </div>
          <div style={{ marginTop: '0.2rem' }}>{currentMusicName ? shorten(currentMusicName) : '재생 중인 노드가 없어요'}</div>
        </div>
        <div style={{ width: '6rem', display: 'flex', justifyContent: 'space-between' }}>
          <SkipToPrevIcon />
          <div className={cursorPointer} onClick={() => pointer !== null && dispatch(setIsPlaying(!isPlaying))}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </div>
          <div className={cursorPointer} onClick={() => pointer !== null && dispatch(playNode('skip'))}>
            <SkipToNextIcon />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', height: '100%', left: 0, top: 0 }}>
        {readonly && (
          <Link href="/" className={login}>
            <HomeIcon />
          </Link>
        )}
        {showLocalDataHelpText ? (
          isWaiting ? (
            <span>잠시만 기다려주세요...</span>
          ) : (
            <span
              className={login}
              onClick={async () => {
                setIsWaiting(true);

                const code = localStorage.getItem(LOCAL_STORAGE_KEY);

                const { musics, musicNodes } = decodeV1(code);

                const response = await http.post('/api/data/set', { musics: Object.values(musics), musicNodes: Object.values(musicNodes) });

                setCookieDangerously(COOKIE_KEY, '1');
                setShowLocalDataHelpText(false);

                if (response.status === 401) {
                  handleUnauthorized();
                  return;
                }

                if (response.status === 200) {
                  dispatch(load({ musics, musicNodes }));
                }
              }}
            >
              로컬 상태를 서버에 반영하기
            </span>
          )
        ) : (
          <div
            style={{ position: 'absolute', bottom: 0, left: 2 }}
            className={helpButton({ tutorial })}
            onClick={() => {
              setTutorial(false);
              setCookieDangerously(TUTORIAL_COOKIE_KEY, '1');
              dispatch(openModal({ type: ModalTypes.HELP }));
            }}
          >
            <HelpIcon />
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', height: '100%', right: 0, top: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className={cursorPointer} onClick={() => pointer && dispatch(setRequireReactFlowNodeFind(pointer))}>
          <ScopeIcon />
        </div>
        <div className={cursorPointer} onClick={() => dispatch(setShowMap(!showMap))}>
          {showMap ? <MapIcon /> : <EmptyMapIcon />}
        </div>
      </div>
    </div>
  );
}
