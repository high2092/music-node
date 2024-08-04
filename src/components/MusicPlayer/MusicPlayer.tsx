import YouTube, { YouTubePlayer } from 'react-youtube';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { playNode, setIsLoading, setIsPlaying, setRequirePlayerRewind } from '../../features/mainSlice';
import { useEffect, useRef, useState } from 'react';
import { PLAYER_HEIGHT_REM } from '../../styles/pages/home.css';
import { PlayerStatus } from '../../constants/youtube';
import { throttle } from 'lodash';
import { 초 } from '../../constants/time';

export function Player() {
  const dispatch = useAppDispatch();
  const { musicNodes, musics, pointer, requirePlayerRewind, isPlaying, isLoading } = useAppSelector((state) => state.main);

  const [height, setHeight] = useState(0);
  const width = height * 2;

  const playerRef = useRef<YouTubePlayer>();

  const videoId = musics[musicNodes[pointer]?.musicId]?.videoId;

  useEffect(() => {
    setHeight((PLAYER_HEIGHT_REM - 1) * parseFloat(getComputedStyle(document.documentElement).fontSize));
  }, []);

  useEffect(() => {
    if (requirePlayerRewind) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
      dispatch(setRequirePlayerRewind(false));
    }
  }, [requirePlayerRewind]);

  useEffect(() => {
    if (!playerRef.current || isLoading) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const player = playerRef.current;

      if (document.activeElement.tagName !== 'BODY') return;
      if (!player) return;

      switch (e.key) {
        case 'ArrowUp': {
          player.setVolume(player.getVolume() + 10);
          break;
        }
        case 'ArrowDown': {
          player.setVolume(player.getVolume() - 10);
          break;
        }
      }
    };

    const throttled = throttle(handleKeyDown, 0.1 * 초);

    window.addEventListener('keydown', throttled);
    return () => window.removeEventListener('keydown', throttled);
  }, []);

  return (
    <div style={{ width, height, background: 'black' }}>
      <div hidden={pointer === null}>
        <YouTube
          videoId={videoId ?? ''}
          opts={{ width, height, playerVars: { rel: 0 } }}
          onReady={(e) => {
            playerRef.current = e.target;
            dispatch(setIsLoading(false));
          }}
          onError={() => {
            dispatch(setIsLoading(false));
          }}
          onEnd={() => dispatch(playNode('next'))}
          onPause={() => dispatch(setIsPlaying(false))}
          onPlay={() => dispatch(setIsPlaying(true))}
          onStateChange={(e) => {
            if (e.data === PlayerStatus.UNSTARTED) {
              e.target.seekTo(0);
              e.target.playVideo();
            }
          }}
        />
      </div>
    </div>
  );
}
