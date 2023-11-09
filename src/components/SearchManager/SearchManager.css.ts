import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const SPINNER_SIZE = '2rem';

export const spinnerContainer = style({
  position: 'relative',
  width: SPINNER_SIZE,
  height: SPINNER_SIZE,
});

const bounce = keyframes({
  '0%': {
    transform: 'scale(0)',
  },
  '50%': {
    transform: 'scale(1)',
  },
  '100%': {
    transform: 'scale(0)',
  },
});

export const spinner = recipe({
  base: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    transform: 'scale(0)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    animation: `${bounce} 2.1s ease-in-out infinite`,
  },

  variants: {
    delayed: {
      true: {
        animation: `${bounce} 2.1s ease-in-out 1s infinite`,
      },
    },
  },
});

export const searchResultContainer = style({
  height: '100%',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
