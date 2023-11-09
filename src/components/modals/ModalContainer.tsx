import { useAppSelector } from '../../features/store';
import { ModalType, ModalTypes } from '../../types/modal';
import { ExportModal } from './ExportModal';

type ModalComponents = {
  [key in ModalType]: (...params: any[]) => JSX.Element;
};

const ModalComponents: ModalComponents = {
  [ModalTypes.EXPORT]: ExportModal,
};

const DEFAULT_MODAL_Z_INDEX = 1000;

export const ModalContainer = () => {
  const { modals } = useAppSelector((state) => state.modal);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {modals.map(({ type, props }, idx) => {
        const ModalComponent = ModalComponents[type];
        return <ModalComponent key={`modal-${type}-${idx}`} zIndex={DEFAULT_MODAL_Z_INDEX + idx} {...props} />;
      })}
    </div>
  );
};
