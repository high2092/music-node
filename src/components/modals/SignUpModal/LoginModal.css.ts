import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const text = style({
  width: 'max-content',
  marginBottom: '1rem',
});

export const loginButton = style({
  width: '10rem',
});
