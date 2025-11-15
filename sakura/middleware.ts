import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify',
  '/appointments',
  '/appointments/confirmed',
  '/help',
  '/privacy',
]

// Define protected routes and their required roles
const protectedRoutes = {
  '/patient': ['patient', 'admin'],
  '/doctor': ['doctor', 'admin'],
  '/assistant': ['assistant', 'admin'],
  '/admin': ['admin'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get user session/token from cookies
  // Token is stored in both localStorage and cookies by apiClient
  const token = request.cookies.get('auth-token')?.value
  const userRole = request.cookies.get('user-role')?.value

  // Check if route requires authentication
  const requiresAuth = Object.keys(protectedRoutes).some((route) =>
    pathname.startsWith(route)
  )

  if (requiresAuth && !token) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  if (token && userRole) {
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          // Redirect to unauthorized page or dashboard
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }
    }
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

