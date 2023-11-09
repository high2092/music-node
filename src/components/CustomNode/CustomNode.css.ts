import { recipe } from '@vanilla-extract/recipes';

export const handle = recipe({
  base: {},
  variants: {
    disabled: {
      true: {
        opacity: 0,
      },
    },
  },
});
