// Authentication service following SOLID principles

import { User, AuthSession, UserRole } from '@/types/auth';

// Interface Segregation Principle: Separate interfaces for different concerns
export interface IAuthenticationService {
  getCurrentUser(): Promise<User | null>;
  signIn(providerId: string, callbackUrl?: string): Promise<void>;
  signOut(): Promise<void>;
}

export interface IAuthorizationService {
  hasRole(user: User | null, role: UserRole): boolean;
  canAccessRoute(user: User | null, requiredRoles: UserRole[]): boolean;
  getUserRole(user: User | null): UserRole;
}

export interface ISessionService {
  getSession(): Promise<AuthSession | null>;
  isSessionValid(session: AuthSession | null): boolean;
  getSessionExpiry(session: AuthSession | null): Date | null;
}

// Single Responsibility Principle: Each service has one clear responsibility
export class AuthenticationService implements IAuthenticationService {
  private signInProvider: any;

  constructor(signInProvider: any) {
    this.signInProvider = signInProvider;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const session = await this.getSessionFromProvider();
      return session?.user || null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async signIn(providerId: string, callbackUrl?: string): Promise<void> {
    try {
      await this.signInProvider(providerId, {
        callbackUrl: callbackUrl || '/dashboard',
        redirect: true,
      });
    } catch (error) {
      console.error('Sign in failed:', error);
      throw new Error('Authentication failed');
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.signInProvider.signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw new Error('Sign out failed');
    }
  }

  private async getSessionFromProvider(): Promise<AuthSession | null> {
    // This would integrate with NextAuth or other auth providers
    return null;
  }
}

export class AuthorizationService implements IAuthorizationService {
  hasRole(user: User | null, role: UserRole): boolean {
    if (!user || !user.role) return false;
    return user.role === role;
  }

  canAccessRoute(user: User | null, requiredRoles: UserRole[]): boolean {
    if (!user || !user.role) return false;
    return requiredRoles.includes(user.role as UserRole);
  }

  getUserRole(user: User | null): UserRole {
    return (user?.role as UserRole) || 'user';
  }
}

export class SessionService implements ISessionService {
  async getSession(): Promise<AuthSession | null> {
    // Implementation would integrate with NextAuth
    return null;
  }

  isSessionValid(session: AuthSession | null): boolean {
    if (!session) return false;
    
    const now = new Date();
    const expiry = new Date(session.expires);
    return expiry > now;
  }

  getSessionExpiry(session: AuthSession | null): Date | null {
    if (!session || !session.expires) return null;
    return new Date(session.expires);
  }
}

// Factory pattern for service creation (Dependency Inversion)
export class AuthServiceFactory {
  static createAuthenticationService(signInProvider: any): IAuthenticationService {
    return new AuthenticationService(signInProvider);
  }

  static createAuthorizationService(): IAuthorizationService {
    return new AuthorizationService();
  }

  static createSessionService(): ISessionService {
    return new SessionService();
  }
}