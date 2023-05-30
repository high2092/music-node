import styled from '@emotion/styled';

export const SearchInputForm = styled.form<{ tutorial: boolean }>`
  display: flex;

  ${({ tutorial }) =>
    tutorial
      ? `
        outline: 3px solid red;
        position: relative;
        &::before {
          position: absolute;
          bottom: 1.5rem;
          width: max-content;
          content: '원하는 곡을 검색하고 검색 결과를 드래그하여 노드를 추가할 수 있어요.';
          color: red;
        }
      `
      : ''}
`;

const SPINNER_SIZE = '2rem';
export const WaitingSearchSpinnerContainer = styled.div`
  position: relative;

  width: ${SPINNER_SIZE};
  height: ${SPINNER_SIZE};
`;

export const WaitingSearchSpinner = styled.div<{ delayed?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: scale(0);

  background-color: rgba(255, 255, 255, 0.3);

  animation: bounce 2.1s ease-in-out ${({ delayed }) => (delayed ? 1 : 0)}s infinite;

  @keyframes bounce {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
`;

export const SearchResultListContainer = styled.div`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SearchResultList = styled.div`
  font-size: 0.7rem;

  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
