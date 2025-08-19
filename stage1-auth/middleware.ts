import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define protected routes and their required roles
const protectedRoutes = {
  '/dashboard': ['user', 'admin'],
  '/admin': ['admin'],
  '/profile': ['user', 'admin'],
  '/settings': ['user', 'admin'],
} as const;

// Define public routes that should redirect authenticated users
const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/error'];

// Define API routes that require authentication
const protectedApiRoutes = ['/api/user', '/api/admin'];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // Skip middleware for static files and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  try {
    // Get the token from the request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Handle API routes
    if (pathname.startsWith('/api')) {
      return handleApiRoute(request, token, pathname);
    }

    // Handle public routes (redirect authenticated users)
    if (publicRoutes.includes(pathname)) {
      if (token) {
        // User is authenticated, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', origin));
      }
      return NextResponse.next();
    }

    // Handle protected routes
    const protectedRoute = Object.keys(protectedRoutes).find(route =>
      pathname.startsWith(route)
    );

    if (protectedRoute) {
      return handleProtectedRoute(
        request,
        token,
        protectedRoute as keyof typeof protectedRoutes,
        origin
      );
    }

    // Allow access to non-protected routes
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of error, redirect to signin page
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}

function handleApiRoute(request: NextRequest, token: any, pathname: string) {
  const isProtectedApiRoute = protectedApiRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedApiRoute) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({
          error: 'Authentication required',
          message: 'You must be signed in to access this resource.',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Check role-based access for admin API routes
    if (pathname.startsWith('/api/admin') && token.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({
          error: 'Insufficient permissions',
          message: 'You do not have permission to access this resource.',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  return NextResponse.next();
}

function handleProtectedRoute(
  request: NextRequest,
  token: any,
  route: keyof typeof protectedRoutes,
  origin: string
) {
  // Check if user is authenticated
  if (!token) {
    // Store the attempted URL to redirect after login
    const signInUrl = new URL('/auth/signin', origin);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check role-based access
  const requiredRoles = protectedRoutes[route];
  const userRole = token.role as string;

  if (!requiredRoles.includes(userRole as any)) {
    // User doesn't have required role
    const unauthorizedUrl = new URL('/unauthorized', origin);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // Add user info to headers for use in components
  const response = NextResponse.next();
  response.headers.set('x-user-id', token.sub || '');
  response.headers.set('x-user-role', userRole || 'user');
  response.headers.set('x-user-email', token.email || '');

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};