import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page itself
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const session = req.cookies.get('admin_session')?.value;

  if (session !== 'authenticated') {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
