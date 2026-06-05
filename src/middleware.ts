import { type NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const session = request.cookies.get('session')?.value;
  
  let user = null;
  if (session) {
    try {
      user = await decrypt(session);
    } catch (e) {
      // Invalid or expired token
      user = null;
    }
  }

  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
