import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const bounceHeight = 20;
const bounce = keyframes({
  '0%': {
    bottom: 0,
    backgroundColor: '#03A9F4',
  },
  '16.66%': {
    bottom: bounceHeight,
    backgroundColor: '#FB6542',
  },
  '33.33%': {
    bottom: 0,
    backgroundColor: '#FB6542',
  },
  '50%': {
    bottom: bounceHeight,
    backgroundColor: '#FFBB00',
  },
  '66.66%': {
    bottom: 0,
    backgroundColor: '#FFBB00',
  },
  '83.33%': {
    bottom: bounceHeight,
    backgroundColor: '#03A9F4',
  },
  '100%': {
    bottom: 0,
    backgroundColor: '#03A9F4',
  },
});

export const loaderContainer = style({
  position: 'relative',
  width: '50px',
  height: '50px',

  display: 'flex',
  justifyContent: 'space-between',
});

const size = '12px';

export const ball = recipe({
  base: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.5) !important',
    width: size,
    height: size,
    borderRadius: '50%',
    animation: `${bounce} 3s -.3s cubic-bezier(.62, .28, .23, .99) infinite`,
  },

  variants: {
    delay: {
      1: { animationDelay: '-.2s' },
      2: { animationDelay: '-.1s' },
    },
  },
});
