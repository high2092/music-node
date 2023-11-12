import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  if (!token) return NextResponse.json({}, { status: 401 });

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/data/:path*', '/api/auth'],
};
