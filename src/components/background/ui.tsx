import { useEffect, useState } from 'react';
import * as styles from './styles.css';

export function Background() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'o':
        case 'ㅐ': {
          setBackgroundIndex((backgroundIndex) => (backgroundIndex + 1) % 2);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (backgroundIndex === 0) return null;

  return (
    <video className={styles.videoContainer} autoPlay loop muted>
      <source src={'/image/background.mp4'} type="video/mp4" />
    </video>
  );
}
