import { CSSProperties } from 'react';

export const ICON_SIZE = '1rem';
export const PLAY_ICON_SIZE = '1.5rem';
export const CD_ICON_SIZE = '1.5rem';
export const EDIT_ICON_SIZE = '0.6rem';
export const COPY_ICON_SIZE = '2rem';
export const MODAL_DEFAULT_BORDER_RADIUS = '20px';
export const TOP_BAR_HEIGHT = `calc(${PLAY_ICON_SIZE} + 2rem)`;
export const DEFAULT_NODE_COLOR = 'white';
export const UI_MINI_CRITERIA_MAX_WIDTH = '1000px';
export const UI_MINIMIZE_CRITERIA_MAX_WIDTH = '600px';
export const NODE_STYLE: CSSProperties = {
  minHeight: '2.5rem',
  minWidth: '6rem',
  maxWidth: 'max-content',

  border: '1px solid black',
  borderRadius: '1rem',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
