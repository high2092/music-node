import { useState } from 'react';
import { PreparedModalProps } from '../../../types/modal';
import { CenteredModal } from '../Modal/Modal';
import { container, loginButton, text, loginSpinner, loginSpinnerContainer } from './LoginModal.css';

export function LoginModal({ zIndex }: PreparedModalProps) {
  return <CenteredModal content={<Content />} zIndex={zIndex} handleDimmedClick={() => {}} />;
}

function Content() {
  const [waiting, setWaiting] = useState(false);

  return (
    <div className={container}>
      <div className={text}>플레이리스트를 구성하려면 먼저 로그인해주세요</div>

      {!waiting ? (
        <a className={loginButton} href="/api/oauth/kakao" onClick={() => setWaiting(true)}>
          <img src="/image/kakao_login_large_narrow.png" className={loginButton} />
        </a>
      ) : (
        <div className={loginSpinnerContainer}>
          <div className={loginSpinner} />
        </div>
      )}
    </div>
  );
}
