import { useState } from 'react';
import { useAppSelector } from '../features/store';
import { CopyIcon } from '../components/icons/CopyIcon';
import { copyToClipboard } from '../utils/clipboard';
import { cursorPointer } from '../components/icons/CursorPointer.css';
import { codeBlock, errorPage, msg } from '../styles/pages/error.css';

interface ErrorPageProps {
  err: Error;
}

function ErrorPage({ err }: ErrorPageProps) {
  const { log } = useAppSelector((state) => state.main);

  const [isCopied, setIsCopied] = useState(false);

  const errorInfo = JSON.stringify({ stack: err?.stack, log: log.toArray() });

  const handleCopyButtonClick = () => {
    copyToClipboard(errorInfo);
    setIsCopied(true);
  };

  return (
    <div className={errorPage}>
      <div className={msg}>
        <span>에러가 발생했어요. 다음 내용을 개발자에게 전달해주세요.</span>
        <div style={{ height: '1rem' }}>
          {isCopied && (
            <div onClick={() => location.reload()} style={{ width: 'max-content', marginTop: '0.5rem', color: '#30A2FF', cursor: 'pointer' }}>
              새로고침
            </div>
          )}
        </div>
      </div>
      <div className={codeBlock}>
        <div style={{ display: 'flex', justifyContent: 'right' }}>
          <div className={cursorPointer} style={{ width: 'max-content', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center' }} onClick={handleCopyButtonClick}>
            <div>클립보드에 복사</div>
            <CopyIcon />
          </div>
        </div>
        <div style={{ height: '80%', overflow: 'scroll', wordBreak: 'break-all' }}>{errorInfo}</div>
      </div>
    </div>
  );
}

export default ErrorPage;
