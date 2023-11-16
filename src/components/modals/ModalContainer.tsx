import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { ModalType, ModalTypes } from '../../types/modal';
import { ExportModal } from './ExportModal';
import { openModal } from '../../features/modalSlice';
import { NoticeModal } from './NoticeModal/NoticeModal';
import { HelpModal } from './HelpModal/HelpModal';

type ModalComponents = {
  [key in ModalType]: (...params: any[]) => JSX.Element;
};

const ModalComponents: ModalComponents = {
  [ModalTypes.EXPORT]: ExportModal,
  [ModalTypes.NOTICE]: NoticeModal,
  [ModalTypes.HELP]: HelpModal,
};

const DEFAULT_MODAL_Z_INDEX = 1000;

export const ModalContainer = () => {
  const dispatch = useAppDispatch();
  const { mounted } = useAppSelector((state) => state.ui);
  const { modals } = useAppSelector((state) => state.modal);

  useEffect(() => {
    if (mounted) dispatch(openModal({ type: ModalTypes.NOTICE }));
  }, [mounted]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {modals.map(({ type, props }, idx) => {
        const ModalComponent = ModalComponents[type];
        return <ModalComponent key={`modal-${type}-${idx}`} zIndex={DEFAULT_MODAL_Z_INDEX + idx} {...props} />;
      })}
    </div>
  );
};
