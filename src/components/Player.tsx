import YouTube, { YouTubePlayer } from 'react-youtube';
import { useAppDispatch, useAppSelector } from '../features/store';
import { playNode, setRequirePlayerRewind } from '../features/mainSlice';
import { useEffect, useRef, useState } from 'react';
import { PLAYER_HEIGHT_REM } from '../styles/pages';

export function Player() {
  const dispatch = useAppDispatch();
  const { musicNodes, musics, pointer, requirePlayerRewind } = useAppSelector((state) => state.main);

  const [height, setHeight] = useState(0);

  const playerRef = useRef<YouTubePlayer>();

  const videoId = musics[musicNodes[pointer]?.musicId]?.videoId;

  useEffect(() => {
    setHeight((PLAYER_HEIGHT_REM - 1) * parseFloat(getComputedStyle(document.documentElement).fontSize));
  }, []);

  useEffect(() => {
    if (!requirePlayerRewind) return;

    playerRef.current.seekTo(0);
    playerRef.current.playVideo();
    dispatch(setRequirePlayerRewind(false));
  }, [requirePlayerRewind]);

  return (
    <>
      <YouTube videoId={videoId ?? ''} opts={{ width: height * 2, height, playerVars: { autoplay: 1, rel: 0 } }} onReady={(e) => (playerRef.current = e.target)} onEnd={() => dispatch(playNode('next'))} />
    </>
  );
}
