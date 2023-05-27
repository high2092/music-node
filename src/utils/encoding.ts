import zlib from 'zlib';
import { Music } from '../types/music';
import { MusicNode } from '../types/musicNode';

const preV1 = 'musicnodev1';

export const encodeV1 = (musics: Record<number, Music>, musicNodes: Record<number, MusicNode>) => {
  const plain = JSON.stringify({ musics, musicNodes });
  const compressedBytes = zlib.deflateSync(plain);
  return preV1 + encodeURIComponent(Buffer.from(compressedBytes).toString('base64'));
};

export const decodeV1 = (encoded: string) => {
  if (encoded.substring(0, preV1.length) !== preV1) throw new Error('인코딩 버전이 다릅니다.');
  const compressedBuffer = Buffer.from(decodeURIComponent(encoded.substring(preV1.length)), 'base64');
  const plain = zlib.inflateSync(compressedBuffer).toString('utf-8');
  const { musics, musicNodes } = JSON.parse(plain);
  return { musics, musicNodes };
};

export function getLastSequence(record: Record<number, any>) {
  return Math.max(...Object.keys(record).map(Number));
}
