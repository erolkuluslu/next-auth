// NextAuth configuration for Stage 2 E-commerce platform
// Adapted from Stage 1 auth system with SOLID principles

import { NextAuthOptions } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import { AuthConfig, AuthCallbacks, Role } from '@/types/auth';
import { getStage2EnvironmentConfig } from './environment';

// Auth routes configuration
export const AUTH_ROUTES = {
  SIGN_IN: '/auth/signin',
  SIGN_OUT: '/auth/signout',
  ERROR: '/auth/error',
  UNAUTHORIZED: '/unauthorized',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
};

export const DEFAULT_REDIRECTS = {
  AFTER_SIGN_IN: '/dashboard',
  AFTER_SIGN_OUT: '/',
  ON_ERROR: '/auth/error',
  UNAUTHORIZED: '/unauthorized',
};

// Interface Segregation: Separate callback concerns
interface IJwtCallback {
  handleJwtCallback(params: any): Promise<any>;
}

interface ISessionCallback {
  handleSessionCallback(params: any): Promise<any>;
}

interface ISignInCallback {
  handleSignInCallback(params: any): Promise<boolean>;
}

// Enhanced Auth0 role extraction utility function (from Stage 1)
function extractAuth0Roles(profile: any): { primaryRole: Role; allRoles: Role[] } {
  // Check multiple possible sources for Auth0 roles
  let roles: string[] = [];
  
  // 1. Custom claims (recommended Auth0 pattern)
  const customRolesClaim = profile['https://yourapp.com/roles'] || profile['https://localhost:3000/roles'];
  if (customRolesClaim) {
    roles = Array.isArray(customRolesClaim) ? customRolesClaim : [customRolesClaim];
  }
  
  // 2. App metadata (if roles stored in app_metadata)
  else if (profile.app_metadata?.roles) {
    roles = Array.isArray(profile.app_metadata.roles) ? profile.app_metadata.roles : [profile.app_metadata.roles];
  }
  
  // 3. User metadata (if roles stored in user_metadata)
  else if (profile.user_metadata?.roles) {
    roles = Array.isArray(profile.user_metadata.roles) ? profile.user_metadata.roles : [profile.user_metadata.roles];
  }
  
  // 4. Standard roles claim (if configured)
  else if (profile.roles) {
    roles = Array.isArray(profile.roles) ? profile.roles : [profile.roles];
  }
  
  // 5. Single role field (original check)
  else if (profile.role) {
    roles = [profile.role];
  }
  
  // 6. Check for Auth0 authorization extension format
  else if (profile['https://authorization-extension.auth0.com/roles']) {
    const authExtRoles = profile['https://authorization-extension.auth0.com/roles'];
    roles = Array.isArray(authExtRoles) ? authExtRoles : [authExtRoles];
  }
  
  // Default to 'user' if no roles found
  if (roles.length === 0) {
    roles = ['user'];
  }
  
  // Normalize role names (convert to lowercase, handle common variations)
  const normalizedRoles = roles.map(role => {
    const normalized = role.toLowerCase().trim();
    // Handle common Auth0 role name variations
    if (normalized === 'administrator' || normalized === 'admin') return 'admin';
    if (normalized === 'moderator' || normalized === 'mod') return 'moderator';
    if (normalized === 'user' || normalized === 'member') return 'user';
    if (normalized === 'viewer' || normalized === 'read-only') return 'viewer';
    return normalized;
  }).filter(role => ['admin', 'moderator', 'user', 'viewer'].includes(role)) as Role[];
  
  // Determine primary role (highest privilege)
  let primaryRole: Role = 'user';
  if (normalizedRoles.includes('admin')) primaryRole = 'admin';
  else if (normalizedRoles.includes('moderator')) primaryRole = 'moderator';
  else if (normalizedRoles.includes('user')) primaryRole = 'user';
  else if (normalizedRoles.includes('viewer')) primaryRole = 'viewer';
  
  return {
    primaryRole,
    allRoles: normalizedRoles.length > 0 ? normalizedRoles : ['user']
  };
}

// Single Responsibility: Each callback handler has one responsibility
class JwtCallbackHandler implements IJwtCallback {
  async handleJwtCallback({ token, account, profile, user }: any): Promise<any> {
    // First time login
    if (account && profile) {
      token.accessToken = account.access_token || undefined;
      token.idToken = account.id_token || undefined;
      token.refreshToken = account.refresh_token || undefined;
      
      // Enhanced Auth0 role extraction from multiple sources
      const extractedRoles = extractAuth0Roles(profile);
      token.role = extractedRoles.primaryRole;
      token.roles = extractedRoles.allRoles;
      
      token.sub = profile.sub || user?.id || undefined;
      token.email = profile.email || user?.email || undefined;
      token.name = profile.name || user?.name || undefined;
      token.picture = profile.picture || user?.image || undefined;
      
      // Debug logging to see what Auth0 sends (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Stage 2 Auth0 Profile Data:', {
          profileKeys: Object.keys(profile),
          extractedRoles,
          rawProfile: profile
        });
      }
    }
    
    return token;
  }
}

class SessionCallbackHandler implements ISessionCallback {
  async handleSessionCallback({ session, token }: any): Promise<any> {
    // Send properties to the client
    session.accessToken = token.accessToken as string;
    session.idToken = token.idToken as string;
    session.role = token.role as Role;
    session.roles = token.roles as Role[];
    
    if (session.user) {
      session.user.id = token.sub as string;
      session.user.role = token.role as Role;
      session.user.roles = token.roles as Role[];
    }
    
    return session;
  }
}

class SignInCallbackHandler implements ISignInCallback {
  async handleSignInCallback({ user, account, profile }: any): Promise<boolean> {
    // Add any sign-in validation logic here
    // For e-commerce platform, we could check if user account is active
    return true;
  }
}

// Factory for creating auth configuration (Dependency Inversion)
export class Stage2AuthConfigFactory {
  private static jwtHandler = new JwtCallbackHandler();
  private static sessionHandler = new SessionCallbackHandler();
  private static signInHandler = new SignInCallbackHandler();

  static createAuthOptions(): NextAuthOptions {
    const env = getStage2EnvironmentConfig();
    
    return {
      providers: [
        Auth0Provider({
          clientId: env.auth.auth0ClientId,
          clientSecret: env.auth.auth0ClientSecret,
          issuer: `https://${env.auth.auth0Domain}`,
          authorization: {
            params: {
              scope: 'openid profile email',
              prompt: 'login', // Force login prompt every time
              audience: `https://${env.auth.auth0Domain}/api/v2/`, // Request Management API access
            },
          },
        }),
      ],
      session: {
        strategy: 'jwt',
        maxAge: env.auth.sessionMaxAge,
        updateAge: env.auth.sessionUpdateAge,
      },
      jwt: {
        maxAge: env.auth.sessionMaxAge,
      },
      callbacks: {
        jwt: this.jwtHandler.handleJwtCallback,
        session: this.sessionHandler.handleSessionCallback,
        signIn: this.signInHandler.handleSignInCallback,
        async redirect({ url, baseUrl }) {
          // Allows relative callback URLs
          if (url.startsWith('/')) return `${baseUrl}${url}`;
          // Allows callback URLs on the same origin
          else if (new URL(url).origin === baseUrl) return url;
          return baseUrl;
        },
      },
      pages: {
        signIn: AUTH_ROUTES.SIGN_IN,
        signOut: AUTH_ROUTES.SIGN_OUT,
        error: AUTH_ROUTES.ERROR,
      },
      events: {
        async signIn({ user, account, profile }) {
          console.log('Stage 2 E-commerce user signed in:', { 
            user: user?.email, 
            provider: account?.provider 
          });
        },
        async signOut({ session }) {
          console.log('Stage 2 E-commerce user signed out:', { 
            user: session?.user?.email 
          });
        },
      },
    };
  }

  // Open/Closed: Extensible for different environments
  static createAuthOptionsForEnvironment(env: 'development' | 'production'): NextAuthOptions {
    const baseOptions = this.createAuthOptions();
    const envConfig = getStage2EnvironmentConfig();
    
    if (env === 'development') {
      return {
        ...baseOptions,
        debug: envConfig.security.enableDebug,
        logger: {
          error: console.error,
          warn: console.warn,
          debug: console.debug,
        },
      };
    }

    return {
      ...baseOptions,
      debug: envConfig.security.enableDebug,
    };
  }
}

// Export the configured auth options
export const authOptions = Stage2AuthConfigFactory.createAuthOptionsForEnvironment(
  process.env.NODE_ENV === 'production' ? 'production' : 'development'
);