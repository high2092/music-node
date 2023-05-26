import YouTube, { YouTubePlayer } from 'react-youtube';
import { useAppDispatch, useAppSelector } from '../features/store';
import { playNode, setRequirePlayerRewind } from '../features/mainSlice';
import { useEffect, useRef, useState } from 'react';

export function Player() {
  const dispatch = useAppDispatch();
  const { musicNodes, musics, pointer, requirePlayerRewind } = useAppSelector((state) => state.main);

  const [height, setHeight] = useState(0);

  const playerRef = useRef<YouTubePlayer>();

  const videoId = musics[musicNodes[pointer]?.musicId]?.videoId;

  useEffect(() => {
    setHeight(12 * parseFloat(getComputedStyle(document.documentElement).fontSize));
  }, []);

  useEffect(() => {
    if (!requirePlayerRewind) return;

    playerRef.current.seekTo(0);
    playerRef.current.playVideo();
    dispatch(setRequirePlayerRewind(false));
  }, [requirePlayerRewind]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <YouTube videoId={videoId ?? ''} opts={{ width: height * 2, height, playerVars: { autoplay: 1, rel: 0 } }} onReady={(e) => (playerRef.current = e.target)} onEnd={() => dispatch(playNode('next'))} />
    </div>
  );
}
