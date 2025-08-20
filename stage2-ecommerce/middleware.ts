// Middleware for route protection in Stage 2 E-commerce platform
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { NextRequestWithAuth } from 'next-auth/middleware';

// Define protected routes and their required roles
const protectedRoutes = {
  '/dashboard': ['user', 'moderator', 'admin'],
  '/profile': ['user', 'moderator', 'admin'],
  '/admin': ['admin'],
  '/admin/*': ['admin'],
  '/moderator': ['moderator', 'admin'],
  '/moderator/*': ['moderator', 'admin'],
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signout',
  '/auth/error',
  '/unauthorized',
  '/api/auth/*',
  '/api/health',
  '/products',
  '/products/*',
  '/categories',
  '/categories/*',
  '/search',
  '/_next/*',
  '/favicon.ico',
  '/site.webmanifest',
  '/apple-touch-icon.png',
  '/locales/*',
];

// Helper function to check if a route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route;
  });
}

// Helper function to check if user has required role for a route
function hasRequiredRole(pathname: string, userRole?: string): boolean {
  if (!userRole) return false;

  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (route.endsWith('*')) {
      if (pathname.startsWith(route.slice(0, -1))) {
        return allowedRoles.includes(userRole);
      }
    } else if (pathname === route) {
      return allowedRoles.includes(userRole);
    }
  }

  return true; // Allow access if route is not in protectedRoutes
}

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow public routes
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // Check if user has required role for protected routes
    if (!hasRequiredRole(pathname, token?.role as string)) {
      // Redirect to unauthorized page
      const url = req.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to public routes
        if (isPublicRoute(pathname)) {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
  }
);

// Configure which routes the middleware should run on
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
};