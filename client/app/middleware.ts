import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isLoggedIn = !!token

  const { pathname } = request.nextUrl

  // Public auth routes that don't require login
  const publicAuthRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  const isPublicAuthRoute = publicAuthRoutes.some(route => pathname.startsWith(route))

  // If not logged in and trying to access protected routes
  if (!isLoggedIn && !isPublicAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If logged in and trying to access auth pages, redirect to dashboard
  if (isLoggedIn && isPublicAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}