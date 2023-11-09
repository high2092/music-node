import * as S from '../styles/pages/error.css';

function NotFoundPage() {
  return (
    <div className={S.errorPage}>
      <div>페이지를 찾을 수 없어요.</div>
    </div>
  );
}

export default NotFoundPage;
