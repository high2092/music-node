import styled from '@emotion/styled';

export const CdIconDiv = styled.div<{ active: boolean }>`
  width: max-content;
  height: max-content;

  animation: rotate 1.5s linear infinite;
  animation-play-state: ${({ active }) => (active ? 'running' : 'paused')};

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  display: flex;
  justify-content: center;
  align-items: center;
`;
