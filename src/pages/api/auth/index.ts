import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken } from '../../../utils/auth';

export default async function foo(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.cookies;
  const id = authenticateToken(token);
  return res.json({ id });
}
