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

export const login = style({
  color: 'white',
  textDecoration: 'none',
  cursor: 'pointer',
});

export const helpButton = recipe({
  base: login,
  variants: {
    tutorial: {
      true: {
        ':before': {
          position: 'absolute',
          width: '15rem',
          left: '1.2rem',
          bottom: 0,
          content: '처음 방문하신 것 같네요.ㅤㅤㅤㅤㅤㅤ여기를 클릭해 사용법을 확인해보세요.',
        },
      },
    },
  },
});
