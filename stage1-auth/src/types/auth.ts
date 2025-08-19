// Authentication related types and interfaces

export interface User {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

export interface AuthSession {
  user?: User;
  expires: string;
}

export interface AuthProvider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export interface AuthError {
  error: string | null;
  callbackUrl?: string;
}

export interface AuthCallbacks {
  jwt?: (params: any) => Promise<any>;
  session?: (params: any) => Promise<any>;
  signIn?: (params: any) => Promise<boolean>;
  redirect?: (params: any) => Promise<string>;
}

export interface AuthConfig {
  providers: any[];
  callbacks?: AuthCallbacks;
  session: {
    strategy: 'jwt' | 'database';
  };
  pages?: {
    signIn?: string;
    signOut?: string;
    error?: string;
  };
}

// Role-based access control types
export type UserRole = 'user' | 'admin';

export interface RouteProtection {
  path: string;
  allowedRoles: UserRole[];
  requireAuth: boolean;
}

export interface ProtectedRouteConfig {
  [key: string]: UserRole[];
}