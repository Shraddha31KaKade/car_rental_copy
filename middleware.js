import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Paths that require authentication and role checks
  const isAdminPath = pathname.startsWith('/admin');
  const isOwnerPath = pathname.startsWith('/owner');

  if (isAdminPath || isOwnerPath) {
    // Check for the loggedInUser cookie
    const userCookie = request.cookies.get('loggedInUser')?.value;

    if (!userCookie) {
      // Not logged in -> redirect to home (or login if there was a dedicated route)
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const user = JSON.parse(decodeURIComponent(userCookie));

      // Role authorization
      if (isAdminPath && user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      if (isOwnerPath && user.role !== 'OWNER' && user.role !== 'ADMIN') {
        // Admins can also view owner dashboards if needed, but if strictly owners only:
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      // If parsing fails, redirect
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/owner/:path*'],
};
