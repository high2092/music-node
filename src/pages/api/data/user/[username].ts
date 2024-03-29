import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../../firebase/firestore';
import { authenticateToken } from '../../../../utils/auth';

const userDbRef = collection(db, 'user');

export default async function musicNodeData(req: NextApiRequest, res: NextApiResponse) {
  const username = await getUsername(req.cookies.token);

  // 공개 여부 검사
  const q = query(userDbRef, where('username', '==', req.query.username));
  const user = (await getDocs(q)).docs[0];

  if (!user) {
    return res.status(404).end();
  }

  const { isPublic, id } = user.data() ?? {};

  if (!isPublic && req.query.username !== username) {
    return res.status(403).end();
  }

  const musicDbRef = collection(db, 'data', id.toString(), 'music');
  const musicNodeDbRef = collection(db, 'data', id.toString(), 'node');

  const musics = (await getDocs(musicDbRef)).docs.map((doc) => doc.data());
  const musicNodes = (await getDocs(musicNodeDbRef)).docs.map((doc) => doc.data());

  res.setHeader('Cache-Control', 'max-age=300');
  return res.json({ musics, musicNodes });
}

async function getUsername(token: string): Promise<string> {
  try {
    const { username } = await authenticateToken(token);
    return username;
  } catch {
    return '';
  }
}
