import { FieldValues, useForm } from 'react-hook-form';
import { ModalStyle } from '../../styles/common/ModalStyle';
import { PreparedModalProps } from '../../types/modal';
import { CenteredModal } from './Modal';
import { useAppSelector } from '../../features/store';
import { encodeV1 } from '../../utils/encoding';
import { downloadFile } from '../../utils/file';

export function ExportModal({ zIndex }: PreparedModalProps) {
  return <CenteredModal content={<Content />} zIndex={zIndex} />;
}

function Content() {
  const { musics, musicNodes } = useAppSelector((state) => state.main);
  const { register, handleSubmit } = useForm();

  const handleSave = ({ filename }: FieldValues) => {
    downloadFile(filename, encodeV1(musics, musicNodes));
  };

  return (
    <ModalStyle>
      <form onSubmit={handleSubmit(handleSave)}>
        <input {...register('filename', { required: true })} placeholder="파일 이름" />
        <button>저장</button>
      </form>
    </ModalStyle>
  );
}
