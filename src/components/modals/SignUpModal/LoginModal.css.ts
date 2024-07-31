import { keyframes, style } from '@vanilla-extract/css';

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
  height: '2.5rem',
});

const spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

export const loginSpinnerContainer = style([
  loginButton,
  {
    backgroundColor: '#fee500',
    borderRadius: '4px',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
]);

const LOGIN_SPINNER_SIZE = '18px';

export const loginSpinner = style({
  boxSizing: 'border-box',
  width: LOGIN_SPINNER_SIZE,
  height: LOGIN_SPINNER_SIZE,
  borderRadius: '50%',
  border: '1.5px solid #191919',
  borderBottomColor: 'transparent',
  animation: `${spin} 1s linear infinite`,
});
