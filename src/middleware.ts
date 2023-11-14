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
  matcher: ['/api/data/:path*', '/api/auth'],
};
