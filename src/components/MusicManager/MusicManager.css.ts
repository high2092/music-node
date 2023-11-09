import { style } from '@vanilla-extract/css';

export const musicList = style({
  fontSize: '0.85rem',
  overflowY: 'scroll',
  scrollbarWidth: 'none',
  '::-webkit-scrollbar': {
    display: 'none',
  },
});
