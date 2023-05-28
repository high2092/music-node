import styled from '@emotion/styled';

export const Home = styled.div`
  width: 100vw;
  height: 100vh;

  background: url('image/background.jpg');
  background-size: cover;
  background-position: center center;
  color: white;
  fill: white;
  stroke: white;

  display: flex;
  flex-direction: column;
`;

// Home ~
export const CurrentNodeInfoSection = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 1;

  background-color: rgba(0, 0, 0, 0.5);
`;

export const NodeManagerSection = styled.div`
  flex-grow: 1;
`;

export const PLAYER_HEIGHT_REM = 12;
const UI_SECTION_HEIGHT_REM = PLAYER_HEIGHT_REM;

export const UiSectionContainer = styled.div<{ open: boolean }>`
  position: fixed;
  bottom: ${({ open }) => (open ? 0 : `-${UI_SECTION_HEIGHT_REM}rem`)};
  transition: bottom 1s;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ButtonSection = styled.div`
  position: absolute;
  left: 0;

  display: flex;
`;

export const UiSection = styled.div`
  width: 100vw;
  height: ${UI_SECTION_HEIGHT_REM}rem;

  background-color: rgba(0, 0, 0, 0.5);

  display: flex;

  & > * {
    padding: 0.5rem;
  }
`;
// ~ Home

// UiSection ~
export const NodeListSection = styled.div`
  flex: 14;
`;

export const SearchSection = styled.div`
  flex: 8;
`;

export const PlayerSection = styled.div`
  /* flex: 9; */
`;
// ~ UiSection
