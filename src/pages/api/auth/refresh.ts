import { collection, getDocs, query, setDoc, where } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../firebase/firestore';
import { UserData, generateRefreshToken, generateToken } from '../../../utils/auth';
import { serialize } from 'cookie';

const userDbRef = collection(db, 'user');

export default async function refresh(req: NextApiRequest, res: NextApiResponse) {
  const refresh = req.cookies.refresh;

  const q = query(userDbRef, where('refreshToken', '==', refresh ?? ''));
  const user = (await getDocs(q)).docs[0];

  const userData = user?.data() as UserData;

  if (!userData) {
    return res.status(401).end();
  }

  const newRefresh = generateRefreshToken();
  const accessToken = await generateToken(userData);

  await setDoc(user.ref, { ...userData, refreshToken: newRefresh });

  const cookie = serialize('token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 30,
  });

  const cookie2 = serialize('refresh', newRefresh, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });

  res.setHeader('Set-Cookie', [cookie, cookie2]);

  return res.status(200).end();
}
