import YouTube, { YouTubePlayer } from 'react-youtube';
import { useAppDispatch, useAppSelector } from '../features/store';
import { playNode, setIsLoading, setIsPlaying, setRequirePlayerRewind } from '../features/mainSlice';
import { useEffect, useRef, useState } from 'react';
import { PLAYER_HEIGHT_REM } from '../styles/pages';

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
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  return (
    <div style={{ width, height, background: 'black' }}>
      <div hidden={pointer === null}>
        <YouTube
          videoId={videoId ?? ''}
          opts={{ width, height, playerVars: { autoplay: 1, rel: 0 } }}
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
        />
      </div>
    </div>
  );
}
