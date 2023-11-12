import { PreparedModalProps } from '../../../types/modal';
import { CenteredModal } from '../Modal/Modal';
import { container, notice, subNotice, title } from './NoticeModal.css';

export function NoticeModal({ zIndex }: PreparedModalProps) {
  return <CenteredModal content={<Content />} zIndex={zIndex} />;
}

function Content() {
  return (
    <div className={container}>
      <div className={title}>공지사항</div>
      <div className={notice}>{'플레이리스트가 서버에 저장되도록 바뀌었어요. (2023. 11. 12)'}</div>
      <div className={subNotice}>{'카카오 계정으로 로그인할 수 있어요.'}</div>
      <div className={subNotice}>{'좌측 상단 <로컬 상태를 서버에 반영하기>를 클릭해 기존 플레이리스트를 불러올 수 있어요. (계정당 최초 1회 가능)'}</div>
    </div>
  );
}
