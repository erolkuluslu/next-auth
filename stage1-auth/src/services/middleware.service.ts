// Middleware service following SOLID principles

import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/rbac';
import { rbacService } from '@/services/rbac.service';

// Interface Segregation: Separate concerns for different middleware functions
export interface IRouteProtectionService {
  isProtectedRoute(pathname: string): boolean;
  getRequiredRoles(pathname: string): UserRole[] | null;
  createUnauthorizedResponse(origin: string): NextResponse;
}

export interface IApiProtectionService {
  isProtectedApiRoute(pathname: string): boolean;
  createApiUnauthorizedResponse(): NextResponse;
  createApiForbiddenResponse(): NextResponse;
}

export interface IRedirectService {
  createSignInRedirect(origin: string, callbackUrl: string): NextResponse;
  createDashboardRedirect(origin: string): NextResponse;
  shouldRedirectAuthenticated(pathname: string): boolean;
}

export interface ITokenValidationService {
  validateToken(token: any): boolean;
  extractUserRole(token: any): UserRole;
  extractUserId(token: any): string;
}

// Single Responsibility: Each service handles one aspect of middleware
export class RouteProtectionService implements IRouteProtectionService {
  private protectedRoutes: Record<string, UserRole[]>;

  constructor(protectedRoutes: Record<string, UserRole[]>) {
    this.protectedRoutes = protectedRoutes;
  }

  isProtectedRoute(pathname: string): boolean {
    return Object.keys(this.protectedRoutes).some(route =>
      pathname.startsWith(route)
    );
  }

  getRequiredRoles(pathname: string): UserRole[] | null {
    const route = Object.keys(this.protectedRoutes).find(route =>
      pathname.startsWith(route)
    );
    return route ? (this.protectedRoutes[route] || null) : null;
  }

  createUnauthorizedResponse(origin: string): NextResponse {
    return NextResponse.redirect(new URL('/unauthorized', origin));
  }
}

export class ApiProtectionService implements IApiProtectionService {
  private protectedApiRoutes: string[];

  constructor(protectedApiRoutes: string[]) {
    this.protectedApiRoutes = protectedApiRoutes;
  }

  isProtectedApiRoute(pathname: string): boolean {
    return this.protectedApiRoutes.some(route =>
      pathname.startsWith(route)
    );
  }

  createApiUnauthorizedResponse(): NextResponse {
    return new NextResponse(
      JSON.stringify({
        error: 'Authentication required',
        message: 'You must be signed in to access this resource.',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  createApiForbiddenResponse(): NextResponse {
    return new NextResponse(
      JSON.stringify({
        error: 'Insufficient permissions',
        message: 'You do not have permission to access this resource.',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export class RedirectService implements IRedirectService {
  private publicRoutes: string[];

  constructor(publicRoutes: string[]) {
    this.publicRoutes = publicRoutes;
  }

  createSignInRedirect(origin: string, callbackUrl: string): NextResponse {
    const signInUrl = new URL('/auth/signin', origin);
    signInUrl.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(signInUrl);
  }

  createDashboardRedirect(origin: string): NextResponse {
    return NextResponse.redirect(new URL('/dashboard', origin));
  }

  shouldRedirectAuthenticated(pathname: string): boolean {
    return this.publicRoutes.includes(pathname);
  }
}

export class TokenValidationService implements ITokenValidationService {
  validateToken(token: any): boolean {
    return !!(token && token.sub);
  }

  extractUserRole(token: any): UserRole {
    // Extract roles array or single role from token
    const roles = token?.roles || [token?.role] || ['user'];
    // Return the highest privilege role for middleware compatibility
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('moderator')) return 'moderator';
    if (roles.includes('user')) return 'user';
    return 'viewer';
  }

  extractUserId(token: any): string {
    return token?.sub || '';
  }
}

// Composite service that orchestrates all middleware services
export class MiddlewareOrchestrator {
  constructor(
    private routeProtection: IRouteProtectionService,
    private apiProtection: IApiProtectionService,
    private redirectService: IRedirectService,
    private tokenValidation: ITokenValidationService
  ) {}

  async handleRequest(request: NextRequest, token: any): Promise<NextResponse> {
    const { pathname, origin } = request.nextUrl;

    // Handle API routes
    if (pathname.startsWith('/api')) {
      return this.handleApiRoute(request, token, pathname);
    }

    // Handle public routes (redirect authenticated users)
    if (this.redirectService.shouldRedirectAuthenticated(pathname)) {
      if (this.tokenValidation.validateToken(token)) {
        return this.redirectService.createDashboardRedirect(origin);
      }
      return NextResponse.next();
    }

    // Handle protected routes
    if (this.routeProtection.isProtectedRoute(pathname)) {
      return this.handleProtectedRoute(request, token, pathname, origin);
    }

    return NextResponse.next();
  }

  private handleApiRoute(request: NextRequest, token: any, pathname: string): NextResponse {
    if (this.apiProtection.isProtectedApiRoute(pathname)) {
      if (!this.tokenValidation.validateToken(token)) {
        return this.apiProtection.createApiUnauthorizedResponse();
      }

      // Check admin-only API routes
      if (pathname.startsWith('/api/admin')) {
        const userRole = this.tokenValidation.extractUserRole(token);
        if (userRole !== 'admin') {
          return this.apiProtection.createApiForbiddenResponse();
        }
      }
    }

    return NextResponse.next();
  }

  private handleProtectedRoute(
    request: NextRequest,
    token: any,
    pathname: string,
    origin: string
  ): NextResponse {
    if (!this.tokenValidation.validateToken(token)) {
      return this.redirectService.createSignInRedirect(origin, request.url);
    }

    const requiredRoles = this.routeProtection.getRequiredRoles(pathname);
    if (requiredRoles) {
      const userRole = this.tokenValidation.extractUserRole(token);
      // Check if user has any of the required roles or higher privilege through inheritance
      const hasAccess = requiredRoles.some(role => rbacService.roleInheritsFrom(userRole, role) || userRole === role);
      if (!hasAccess) {
        return this.routeProtection.createUnauthorizedResponse(origin);
      }
    }

    // Add user info to headers
    const response = NextResponse.next();
    const userId = this.tokenValidation.extractUserId(token);
    const userRole = this.tokenValidation.extractUserRole(token);
    
    response.headers.set('x-user-id', userId);
    response.headers.set('x-user-role', userRole);
    response.headers.set('x-user-email', token?.email || '');

    return response;
  }
}

// Factory for creating middleware services
export class MiddlewareServiceFactory {
  static createOrchestrator(
    protectedRoutes: Record<string, UserRole[]>,
    protectedApiRoutes: string[],
    publicRoutes: string[]
  ): MiddlewareOrchestrator {
    const routeProtection = new RouteProtectionService(protectedRoutes);
    const apiProtection = new ApiProtectionService(protectedApiRoutes);
    const redirectService = new RedirectService(publicRoutes);
    const tokenValidation = new TokenValidationService();

    return new MiddlewareOrchestrator(
      routeProtection,
      apiProtection,
      redirectService,
      tokenValidation
    );
  }
}