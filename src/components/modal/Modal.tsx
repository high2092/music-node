import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useAppDispatch } from '../../features/store';
import { closeModal } from '../../features/modalSlice';

interface ModalProps {
  content: JSX.Element;
  zIndex: number;
  handleDimmedClick?: () => void;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  transform?: string;
  dimmedOpacity?: number;
  onClick?: () => void;
}

export const Modal = ({ content, zIndex, handleDimmedClick, top, right, bottom, left, transform, dimmedOpacity, ...props }: ModalProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if ((!top && !right && !bottom && !left) || (top && bottom) || (left && right)) {
      console.warn('모달의 위치가 모호합니다.');
      console.warn({ top, bottom, left, right });
    }
  }, []);

  const styleProps = { zIndex, top, right, bottom, left, transform };

  handleDimmedClick ??= () => dispatch(closeModal());

  return (
    <>
      <ModalContent {...styleProps} {...props}>
        {content}
      </ModalContent>
      <Dimmed zIndex={zIndex - 1} onClick={handleDimmedClick} opacity={dimmedOpacity} />
    </>
  );
};

export const CenteredModal = ({ content, zIndex, handleDimmedClick, dimmedOpacity, ...props }: ModalProps) => {
  const coreProps = { content, zIndex, handleDimmedClick };
  const styleProps = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', dimmedOpacity };
  return <Modal {...coreProps} {...styleProps} {...props} />;
};

const ModalContent = styled.div<{ zIndex: number; top?: string; left?: string; bottom?: string; right?: string; transform?: string }>`
  position: fixed;
  ${({ zIndex, top, left, bottom, right, transform }) => `
    z-index: ${zIndex};
    top: ${top};
    left: ${left};
    bottom: ${bottom};
    right: ${right};
    transform: ${transform};
  `};
`;

export const Dimmed = styled.div<{ zIndex: number; opacity?: number }>`
  position: fixed;

  ${({ zIndex }) => `z-index: ${zIndex};`}
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background: black;
  opacity: ${({ opacity }) => opacity ?? 0.3};
`;
