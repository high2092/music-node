import { style } from '@vanilla-extract/css';

export const centeredModal = style({
  position: 'fixed',

  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

export const dimmed = style({
  position: 'fixed',

  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',

  background: 'black',
  opacity: 0.3,
});
