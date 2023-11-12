import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { ModalType, ModalTypes } from '../../types/modal';
import { ExportModal } from './ExportModal';
import { openModal } from '../../features/modalSlice';
import { NoticeModal } from './NoticeModal/NoticeModal';

type ModalComponents = {
  [key in ModalType]: (...params: any[]) => JSX.Element;
};

const ModalComponents: ModalComponents = {
  [ModalTypes.EXPORT]: ExportModal,
  [ModalTypes.NOTICE]: NoticeModal,
};

const DEFAULT_MODAL_Z_INDEX = 1000;

export const ModalContainer = () => {
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.modal);

  useEffect(() => {
    dispatch(openModal({ type: ModalTypes.NOTICE }));
  }, []);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {modals.map(({ type, props }, idx) => {
        const ModalComponent = ModalComponents[type];
        return <ModalComponent key={`modal-${type}-${idx}`} zIndex={DEFAULT_MODAL_Z_INDEX + idx} {...props} />;
      })}
    </div>
  );
};
