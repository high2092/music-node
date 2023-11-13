import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/auth';

type UserId = number;

interface UserData {
  id: UserId;
  kakaoId: number;
  username: string;
}

export function authenticateToken(token: string): UserData {
  try {
    return jwt.verify(token, JWT_SECRET) as UserData;
  } catch {
    return { id: undefined, kakaoId: undefined, username: undefined };
  }
}

class AuthenticationError extends Error {}
