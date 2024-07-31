import { NextApiRequest, NextApiResponse } from 'next';
import { LOGOUT_REDIRECT_URI } from '../../../../../constants/auth';

const URL = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
  return res.redirect(URL).end();
}
