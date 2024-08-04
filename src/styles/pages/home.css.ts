import { UI_MINIMIZE_CRITERIA_MAX_WIDTH, UI_MINI_CRITERIA_MAX_WIDTH } from '../../constants/style';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const homePage = recipe({
  base: {
    width: '100vw',
    height: '100vh',

    background: 'url(/image/background/30.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',

    color: 'white',
    fill: 'white',
    stroke: 'white',

    display: 'flex',
    flexDirection: 'column',

    position: 'relative',
    isolation: 'isolate',

    // ':after': {
    //   content: '',
    //   position: 'absolute',
    //   background: 'black',
    //   zIndex: -1,
    //   inset: 0,
    //   opacity: 0.2,
    // },
  },
  variants: {
    inProgress: {
      true: 'progress',
    },
  },
});

// Home ~
export const currentNodeInfo = style({
  position: 'fixed',
  top: 0,
  width: '100vw',
  zIndex: 1,

  backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

export const nodeManager = style({
  flexGrow: 1,
});

export const PLAYER_HEIGHT_REM = 12;
const UI_SECTION_HEIGHT_REM = PLAYER_HEIGHT_REM;

export const uiSectionContainer = recipe({
  base: {
    position: 'fixed',
    bottom: `-${UI_SECTION_HEIGHT_REM}rem`,
    transition: 'bottom 1s',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  variants: {
    open: {
      true: {
        bottom: 0,
      },
    },
  },
});

export const buttonSection = style({
  position: 'absolute',
  left: 0,
  display: 'flex',
});

export const uiSection = style({
  width: '100vw',
  height: `${UI_SECTION_HEIGHT_REM}rem`,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',

  display: 'flex',
  justifyContent: 'flex-end',

  '@media': {
    [`(max-width: ${UI_MINIMIZE_CRITERIA_MAX_WIDTH})`]: {
      justifyContent: 'center',
    },
  },
});

export const uiSectionItem = style({
  padding: '0.5rem',
});
// ~ Home

// UiSection ~
export const nodeList = style([
  uiSectionItem,
  {
    flex: 14,
    '@media': {
      [`(max-width: ${UI_MINIMIZE_CRITERIA_MAX_WIDTH})`]: {
        display: 'none',
      },
    },
  },
]);

export const searchBox = style([
  uiSectionItem,
  {
    flex: 8,
    '@media': {
      [`(max-width: ${UI_MINI_CRITERIA_MAX_WIDTH})`]: {
        display: 'none',
      },
    },
  },
]);

// ~ UiSection
