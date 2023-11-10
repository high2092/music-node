import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/auth';

type UserId = number;

interface UserData {
  id: UserId;
  kakaoId: number;
}

export function authenticateToken(token: string): UserId {
  if (!token) throw new AuthenticationError();

  const { id } = jwt.verify(token, JWT_SECRET) as UserData;
  if (!id) throw new AuthenticationError();

  return id;
}

class AuthenticationError extends Error {}
