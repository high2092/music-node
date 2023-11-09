import { style } from '@vanilla-extract/css';

export const errorPage = style({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  backgroundColor: 'black',
  color: 'white',
  fill: 'white',
  stroke: 'white',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const msg = style({
  margin: '2rem 0',
  backgroundColor: 'black',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const codeBlock = style({
  position: 'relative',
  width: '80%',
  height: '50%',

  padding: '1rem',

  backgroundColor: 'black',
  border: '3px solid white',
  borderRadius: '20px',
});
