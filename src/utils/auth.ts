import { SignJWT, jwtVerify } from 'jose';
import { JWT_SECRET } from '../constants/auth';

type UserId = number;

export interface UserData {
  id: UserId;
  kakaoId: number;
  username?: string;
}

export async function authenticateToken(token: string): Promise<UserData> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
  const { id, kakaoId, username } = payload as unknown as UserData;
  return { id, kakaoId, username };
}

export async function generateToken(data: UserData): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  return await new SignJWT({ ...data }).setProtectedHeader({ alg: 'HS256', typ: 'JWT' }).setExpirationTime('1d').setIssuedAt(iat).setNotBefore(iat).sign(new TextEncoder().encode(JWT_SECRET));
}
