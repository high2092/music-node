import { CenteredModal } from '../modals/Modal/Modal';
import { ball, loaderContainer } from './LoadingSpinner.css';

export function Spinner() {
  return <CenteredModal content={<Content />} zIndex={101} />;
}

function Content() {
  return (
    <div className={loaderContainer}>
      <div className={ball({})} />
      <div className={ball({ delay: 1 })} />
      <div className={ball({ delay: 2 })} />
    </div>
  );
}
