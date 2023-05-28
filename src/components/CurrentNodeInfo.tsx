import { PLAY_ICON_SIZE } from '../constants/style';
import { playNode, setIsPlaying } from '../features/mainSlice';
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

export function CurrentNodeInfo() {
  const dispatch = useAppDispatch();
  const { musicNodes, musics, pointer, isPlaying, reactFlowInstance } = useAppSelector((state) => state.main);

  const currentMusicName = musics[musicNodes[pointer]?.musicId]?.name;

  return (
    <div>
      <div style={{ flexGrow: 1, height: `calc(${PLAY_ICON_SIZE} + 2rem)`, paddingTop: '0.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
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
          <IconDiv onClick={() => pointer !== null && dispatch(setIsPlaying(!isPlaying))}>{currentMusicName && isPlaying ? <PauseIcon /> : <PlayIcon />}</IconDiv>
          <IconDiv onClick={() => dispatch(playNode('next'))}>
            <SkipToNextIcon />
          </IconDiv>
        </div>
      </div>
      <IconDiv style={{ position: 'absolute', right: 0, top: 0 }} onClick={() => pointer && reactFlowInstance.fitView({ maxZoom: reactFlowInstance.getZoom(), duration: 1000, nodes: [{ id: pointer.toString() }] })}>
        <ScopeIcon />
      </IconDiv>
    </div>
  );
}
