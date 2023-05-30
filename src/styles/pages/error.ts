import styled from '@emotion/styled';

export const ErrorPage = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;

  background-color: black;
  color: white;
  fill: white;
  stroke: white;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Message = styled.div`
  margin: 2rem 0;

  background-color: black;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CodeBlock = styled.div`
  position: relative;
  width: 80%;
  height: 50%;
  padding: 1rem;

  background-color: black;
  border: 3px solid white;
  border-radius: 20px;
`;
