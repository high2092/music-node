import { NextApiRequest, NextApiResponse } from 'next';
import { REDIRECT_URI } from '../../../../constants/auth';

const URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

export default async function kakaoOAuth(req: NextApiRequest, res: NextApiResponse) {
  return res.redirect(URL).end();
}
