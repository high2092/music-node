import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { serialize } from 'cookie';
import { REDIRECT_URI } from '../../../../constants/auth';
import { db } from '../../../../../firebase/firestore';
import { collection, query, where, doc, getDocs, runTransaction } from 'firebase/firestore';
import { getMusicNodeSequenceDbRef, getMusicSequenceDbRef, getUserDbRef } from '../../../../utils/db';
import { UserData, generateToken } from '../../../../utils/auth';

const userDbRef = collection(db, 'user');
const userSequenceRef = doc(db, 'app', 'user_sequence');

const API_KEY = process.env.KAKAO_REST_API_KEY;

export default async function kakaoOAuthCallback(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  const {
    data: { access_token },
  } = await axios.post('https://kauth.kakao.com/oauth/token', null, {
    params: {
      grant_type: 'authorization_code',
      client_id: API_KEY,
      redirect_uri: REDIRECT_URI,
      code,
    },
  });

  const {
    data: { id: kakaoId },
  } = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  // DB 검색
  const q = query(userDbRef, where('kakaoId', '==', kakaoId));
  const user = (await getDocs(q)).docs[0];
  let userData = user?.data() as UserData;

  if (!user) {
    // 회원가입
    await runTransaction(db, async (transaction) => {
      const { user_sequence } = (await transaction.get(userSequenceRef)).data();
      transaction.set(userSequenceRef, { user_sequence: user_sequence + 1 });
      userData = { id: user_sequence, kakaoId };
      transaction.set(doc(userDbRef), userData);

      const _userDbRef = getUserDbRef(user_sequence);
      const musicSequenceDbRef = getMusicSequenceDbRef(_userDbRef);
      const musicNodeSequenceDbRef = getMusicNodeSequenceDbRef(_userDbRef);

      transaction.set(musicSequenceDbRef, { music_sequence: 1 });
      transaction.set(musicNodeSequenceDbRef, { node_sequence: 1 });
    });
  }

  const token = await generateToken(userData);
  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  res.setHeader('Set-Cookie', cookie);

  return res.redirect('/').end();
}
