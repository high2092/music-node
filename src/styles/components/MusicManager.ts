import styled from '@emotion/styled';

export const MusicList = styled.div<{ tutorial: boolean }>`
  font-size: 0.85rem;

  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    margin: 3px;
  }

  ${({ tutorial }) =>
    tutorial
      ? `
      & > div:first-child {
        outline: 3px solid red;
        position: relative;
        &::before {
          position: absolute;
          bottom: 3.1rem;
          width: max-content;
          content: '그래프 영역으로 드래그하여 노드를 추가할 수 있어요. 또는 유튜브 썸네일을 드래그해도 돼요.';
          color: red;
        }
      }
    `
      : ''}
`;
