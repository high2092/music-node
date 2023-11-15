import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { authenticateToken } from '../../../utils/auth';

export default async function musicNodeData(req: NextApiRequest, res: NextApiResponse) {
  const { id } = await authenticateToken(req.cookies.token);

  const musicDbRef = collection(db, 'data', id.toString(), 'music');
  const musicNodeDbRef = collection(db, 'data', id.toString(), 'node');

  const musics = (await getDocs(musicDbRef)).docs.map((doc) => doc.data());
  const musicNodes = (await getDocs(musicNodeDbRef)).docs.map((doc) => doc.data());

  res.setHeader('Cache-Control', 'max-age=10');
  return res.json({ musics, musicNodes });
}
