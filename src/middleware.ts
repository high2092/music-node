import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from './utils/auth';

export async function middleware(req: NextRequest) {
  try {
    const token = req.cookies.get('token');
    await authenticateToken(token.value);
  } catch {
    return NextResponse.json({}, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/auth',
    '/api/data/connect-node',
    '/api/data/delete-node',
    '/api/data/disconnect-node',
    '/api/data',
    '/api/data/move-node',
    '/api/data/music-node',
    '/api/data/node',
    '/api/data/rename-music',
    '/api/data/set',
  ],
};
