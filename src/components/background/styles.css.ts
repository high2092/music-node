import { style } from '@vanilla-extract/css';

export const videoContainer = style({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: -1,
  width: '100vw',
  height: '100vh',
  objectFit: 'cover',
});
