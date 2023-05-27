import { useEffect } from 'react';
import { useAppDispatch } from '../features/store';
import { decodeV1 } from '../utils/encoding';
import { load } from '../features/mainSlice';
import { useRouter } from 'next/router';

function DemoPage() {
  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    fetch('/data/demo.mnode', { method: 'GET' })
      .then((response) => response.text())
      .then((code) => {
        const { musics, musicNodes } = decodeV1(code);
        dispatch(load({ musics, musicNodes }));
      });

    router.push('/');
  }, []);

  return <></>;
}

export default DemoPage;
