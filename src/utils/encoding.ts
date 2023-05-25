import zlib from 'zlib';

const preV1 = 'musicnodev1';

export const encodeV1 = (plain: string) => {
  const compressedBytes = zlib.deflateSync(plain);
  return preV1 + encodeURIComponent(Buffer.from(compressedBytes).toString('base64'));
};

export const decodeV1 = (encoded: string) => {
  if (encoded.substring(0, preV1.length) !== preV1) throw new Error('인코딩 버전이 다릅니다.');
  const compressedBuffer = Buffer.from(decodeURIComponent(encoded.substring(preV1.length)), 'base64');
  const plain = zlib.inflateSync(compressedBuffer).toString('utf-8');
  return plain;
};
