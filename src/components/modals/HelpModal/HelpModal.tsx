import { useEffect, useState } from 'react';
import { PreparedModalProps } from '../../../types/modal';
import { CenteredModal } from '../Modal/Modal';
import { container, content, description, image, navigator, nextButton } from './HelpModal.css';
import { preload } from '../../../utils/ux';

export function HelpModal({ zIndex }: PreparedModalProps) {
  useEffect(() => {}, []);

  return <CenteredModal content={<Content />} zIndex={zIndex} />;
}

const TITLES = ['노드 추가', '노드 재생', '노드 이동', '노드 연결', '노드 연결 끊기'];
const TUTORIALS = [<AddNode />, <PlayNode />, <MoveNode />, <ConnectNode />, <DisconnectNode />];

function Content() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    preload(['add-node-2', 'connect-node-2', 'disconnect-node-2', 'move-node-2', 'play-node-2']);
  }, []);

  return (
    <div className={container}>
      <div className={navigator}>
        <div className={nextButton({ disabled: index <= 0 })} onClick={() => setIndex((index) => Math.max(index - 1, 0))}>
          {'<'}
        </div>
        <div>{`${index + 1}. ${TITLES[index]}`}</div>
        <div className={nextButton({ disabled: index >= TUTORIALS.length - 1 })} onClick={() => setIndex((index) => Math.min(index + 1, TUTORIALS.length - 1))}>
          {'>'}
        </div>
      </div>
      {TUTORIALS[index]}
    </div>
  );
}

function AddNode() {
  return (
    <div className={content}>
      <img className={image} src="/image/guide/add-node-2.gif" />
      <div className={description}>
        유튜브 검색결과 또는 기존 음악을 <span>드래그</span>해 노드를 추가할 수 있어요
      </div>
    </div>
  );
}

function PlayNode() {
  return (
    <div className={content}>
      <img className={image} src="/image/guide/play-node-2.gif" />
      <div className={description}>
        노드를 <span>더블 클릭</span>해 재생할 수 있어요
      </div>
    </div>
  );
}

function MoveNode() {
  return (
    <div className={content}>
      <img className={image} src="/image/guide/move-node-2.gif" />
      <div className={description}>
        노드를 <span>드래그</span>해 이동할 수 있어요
      </div>
    </div>
  );
}

function ConnectNode() {
  return (
    <div className={content}>
      <img className={image} src="/image/guide/connect-node-2.gif" />
      <div className={description}>
        노드 아래의 점을 <span>드래그</span>해 노드를 연결할 수 있어요
      </div>
    </div>
  );
}

function DisconnectNode() {
  return (
    <div className={content}>
      <img className={image} src="/image/guide/disconnect-node-2.gif" />
      <div className={description}>
        연결선을 <span>클릭</span>하고 <span>백스페이스</span> 키를 눌러 노드 연결을 끊을 수 있어요
      </div>
    </div>
  );
}
