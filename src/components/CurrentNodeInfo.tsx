import { TOP_BAR_HEIGHT } from '../constants/style';
import { playNode, setIsPlaying, setRequireReactFlowNodeFind } from '../features/mainSlice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { shorten } from '../utils/string';
import { CdIcon } from './icons/CdIcon';
import { IconDiv } from './icons/IconDiv';
import { PauseIcon } from './icons/PauseIcon';
import { PlayIcon } from './icons/PlayIcon';
import { ScopeIcon } from './icons/ScopeIcon';
import { SkipToNextIcon } from './icons/SkipToNextIcon';
import { SkipToPrevIcon } from './icons/SkipToPrevIcon';
import * as S from '../styles/components/CurrentNodeInfo';
import { MapIcon } from './icons/MapIcon';
import { setShowMap } from '../features/uiSlice';
import { EmptyMapIcon } from './icons/EmptyMapIcon';

export function CurrentNodeInfo() {
  const dispatch = useAppDispatch();
  const { musicNodes, musics, pointer, isPlaying, reactFlowInstance } = useAppSelector((state) => state.main);
  const { showMap } = useAppSelector((state) => state.ui);

  const currentMusicName = musics[musicNodes[pointer]?.musicId]?.name;

  return (
    <div>
      <div style={{ flexGrow: 1, height: TOP_BAR_HEIGHT, paddingTop: '0.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ paddingRight: '0.3rem' }}>
            <S.CdIconDiv active={isPlaying}>
              <CdIcon />
            </S.CdIconDiv>
          </div>
          <div style={{ marginTop: '0.2rem' }}>{currentMusicName ? shorten(currentMusicName) : '재생 중인 노드가 없어요'}</div>
        </div>
        <div style={{ width: '6rem', display: 'flex', justifyContent: 'space-between' }}>
          <SkipToPrevIcon />
          <IconDiv onClick={() => pointer !== null && dispatch(setIsPlaying(!isPlaying))}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</IconDiv>
          <IconDiv onClick={() => pointer !== null && dispatch(playNode('skip'))}>
            <SkipToNextIcon />
          </IconDiv>
        </div>
      </div>
      <div style={{ position: 'absolute', height: '100%', right: 0, top: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <IconDiv onClick={() => pointer && dispatch(setRequireReactFlowNodeFind(pointer))}>
          <ScopeIcon />
        </IconDiv>
        <IconDiv onClick={() => dispatch(setShowMap(!showMap))}>{showMap ? <MapIcon /> : <EmptyMapIcon />}</IconDiv>
      </div>
    </div>
  );
}
