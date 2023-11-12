import { style } from '@vanilla-extract/css';
import { modalStyle } from '../../../styles/components/ModalStyle.css';

export const container = style([modalStyle, { width: '35rem' }]);
export const title = style({
  fontSize: '1.5rem',
  paddingBottom: '0.5rem',
});

export const notice = style({
  paddingBottom: '0.2rem',
});

export const subNotice = style({
  lineHeight: '0.9rem',
  fontSize: '0.8rem',

  display: 'flex',

  ':before': {
    display: 'block',
    content: '-',
    margin: '0 0.2rem',
  },
});
