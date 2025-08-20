import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { MiddlewareServiceFactory } from '@/services/middleware.service';
import { UserRole } from '@/types/rbac';

// Enhanced RBAC Configuration following Single Responsibility and Open/Closed principles
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/dashboard': ['viewer', 'user', 'moderator', 'admin'],
  '/admin': ['admin'],
  '/profile': ['user', 'moderator', 'admin'],
  '/settings': ['moderator', 'admin'],
};

const PUBLIC_ROUTES = ['/auth/signin', '/auth/signup', '/auth/error'];
const PROTECTED_API_ROUTES = ['/api/user', '/api/admin'];

// Dependency Inversion: Using service factory to create orchestrator
const middlewareOrchestrator = MiddlewareServiceFactory.createOrchestrator(
  PROTECTED_ROUTES,
  PROTECTED_API_ROUTES,
  PUBLIC_ROUTES
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
      secret: process.env.NEXTAUTH_SECRET!,
    });

    // Delegate to orchestrator service
    return await middlewareOrchestrator.handleRequest(request, token);
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of error, redirect to signin page
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
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