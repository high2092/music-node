export const HOST = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}` : 'https://mnode.vercel.app';
export const REDIRECT_URI = `${HOST}/api/oauth/kakao/callback`;
export const LOGOUT_REDIRECT_URI = `${HOST}/api/oauth/kakao/logout/callback`;
export const JWT_SECRET = process.env.JWT_SECRET;
