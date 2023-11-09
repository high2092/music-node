import { CSSProperties, useEffect } from 'react';
import { useAppDispatch } from '../../../features/store';
import { closeModal } from '../../../features/modalSlice';
import { centeredModal, dimmed } from './Modal.css';

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

  const styleProps: CSSProperties = { position: 'fixed', zIndex, top, right, bottom, left, transform };

  handleDimmedClick ??= () => dispatch(closeModal());

  return (
    <>
      <div style={styleProps} {...props}>
        {content}
      </div>
      <div className={dimmed} style={{ zIndex: zIndex - 1, opacity: dimmedOpacity }} onClick={handleDimmedClick} />
    </>
  );
};

export const CenteredModal = ({ content, zIndex, handleDimmedClick, dimmedOpacity, ...props }: ModalProps) => {
  const dispatch = useAppDispatch();

  handleDimmedClick ??= () => dispatch(closeModal());

  return (
    <>
      <div className={centeredModal} style={{ zIndex }} {...props}>
        {content}
      </div>
      <div className={dimmed} style={{ zIndex: zIndex - 1, opacity: dimmedOpacity }} onClick={handleDimmedClick} />
    </>
  );
};
