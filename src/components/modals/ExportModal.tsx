import { FieldValues, useForm } from 'react-hook-form';
import { PreparedModalProps } from '../../types/modal';
import { CenteredModal } from './Modal/Modal';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { encodeV1 } from '../../utils/encoding';
import { downloadFile } from '../../utils/file';
import { closeModal } from '../../features/modalSlice';
import { modalStyle } from '../../styles/components/ModalStyle.css';

export function ExportModal({ zIndex }: PreparedModalProps) {
  return <CenteredModal content={<Content />} zIndex={zIndex} />;
}

function Content() {
  const dispatch = useAppDispatch();
  const { musics, musicNodes } = useAppSelector((state) => state.main);
  const { register, handleSubmit } = useForm();

  const handleSave = ({ filename }: FieldValues) => {
    downloadFile(filename, encodeV1(musics, musicNodes));
    dispatch(closeModal());
  };

  return (
    <div className={modalStyle}>
      <form onSubmit={handleSubmit(handleSave)}>
        <input {...register('filename', { required: true })} placeholder="파일 이름" />
        <button>저장</button>
      </form>
    </div>
  );
}
