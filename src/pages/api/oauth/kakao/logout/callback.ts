import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function logoutCallback(req: NextApiRequest, res: NextApiResponse) {
  const cookie = serialize('token', '', {
    path: '/',
    maxAge: -1,
  });

  const cookie2 = serialize('refresh', '', {
    path: '/',
    maxAge: -1,
  });

  res.setHeader('Set-Cookie', [cookie, cookie2]);

  return res.redirect('/').end();
}
