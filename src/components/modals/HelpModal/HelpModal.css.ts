import { style } from '@vanilla-extract/css';
import { modalStyle } from '../../../styles/components/ModalStyle.css';
import { recipe } from '@vanilla-extract/recipes';

export const container = style([
  modalStyle,
  {
    height: '22rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
]);

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const image = style({
  width: '28rem',
  padding: '1rem',
});

export const description = style({
  height: '4rem',
});

export const nextButton = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  variants: {
    disabled: {
      true: {
        opacity: 0,
        color: 'grey',
        cursor: 'initial',
      },
    },
  },
});

export const navigator = style({
  width: '80%',
  display: 'flex',
  justifyContent: 'space-between',
});
