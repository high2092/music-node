import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken } from '../../../utils/auth';

export default async function foo(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.cookies;
  if (!token) return res.status(401).end();
  const { id, username } = await authenticateToken(token);
  return res.json({ id, username });
}
