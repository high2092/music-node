import styled from '@emotion/styled';

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
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
