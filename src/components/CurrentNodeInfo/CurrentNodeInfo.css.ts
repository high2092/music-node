import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const rotate = keyframes({
  '100%': {
    transform: 'rotate(360deg)',
  },
});

export const cdIcon = recipe({
  base: {
    width: 'max-content',
    height: 'max-content',

    animation: `${rotate} 1.5s linear infinite`,
    animationPlayState: 'paused',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  variants: {
    active: {
      true: {
        animationPlayState: 'running',
      },
    },
  },
});
