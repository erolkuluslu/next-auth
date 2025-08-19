// NextAuth configuration following SOLID principles

import { NextAuthOptions } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import { AuthConfig, AuthCallbacks } from '@/types/auth';
import { AUTH_ROUTES, DEFAULT_REDIRECTS, SESSION_CONFIG } from '@/utils/constants';

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

// Single Responsibility: Each callback handler has one responsibility
class JwtCallbackHandler implements IJwtCallback {
  async handleJwtCallback({ token, account, profile, user }: any): Promise<any> {
    // First time login
    if (account && profile) {
      token.accessToken = account.access_token || undefined;
      token.idToken = account.id_token || undefined;
      token.refreshToken = account.refresh_token || undefined;
      
      // Add role information (default to 'user', can be enhanced with Auth0 roles)
      token.role = profile.role || 'user';
      token.sub = profile.sub || user?.id || undefined;
      token.email = profile.email || user?.email || undefined;
      token.name = profile.name || user?.name || undefined;
      token.picture = profile.picture || user?.image || undefined;
    }
    
    return token;
  }
}

class SessionCallbackHandler implements ISessionCallback {
  async handleSessionCallback({ session, token }: any): Promise<any> {
    // Send properties to the client
    session.accessToken = token.accessToken as string;
    session.idToken = token.idToken as string;
    session.role = token.role as string;
    
    if (session.user) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
    }
    
    return session;
  }
}

class SignInCallbackHandler implements ISignInCallback {
  async handleSignInCallback({ user, account, profile }: any): Promise<boolean> {
    // Add any sign-in validation logic here
    return true;
  }
}

// Factory for creating auth configuration (Dependency Inversion)
export class AuthConfigFactory {
  private static jwtHandler = new JwtCallbackHandler();
  private static sessionHandler = new SessionCallbackHandler();
  private static signInHandler = new SignInCallbackHandler();

  static createAuthOptions(): NextAuthOptions {
    return {
      providers: [
        Auth0Provider({
          clientId: process.env.AUTH0_CLIENT_ID!,
          clientSecret: process.env.AUTH0_CLIENT_SECRET!,
          issuer: `https://${process.env.AUTH0_DOMAIN}`,
          authorization: {
            params: {
              scope: 'openid profile email',
            },
          },
        }),
      ],
      session: {
        strategy: 'jwt',
        maxAge: SESSION_CONFIG.MAX_AGE,
        updateAge: SESSION_CONFIG.UPDATE_AGE,
      },
      jwt: {
        maxAge: SESSION_CONFIG.MAX_AGE,
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
          console.log('User signed in:', { user: user?.email, provider: account?.provider });
        },
        async signOut({ session }) {
          console.log('User signed out:', { user: session?.user?.email });
        },
      },
    };
  }

  // Open/Closed: Extensible for different environments
  static createAuthOptionsForEnvironment(env: 'development' | 'production'): NextAuthOptions {
    const baseOptions = this.createAuthOptions();
    
    if (env === 'development') {
      return {
        ...baseOptions,
        debug: true,
        logger: {
          error: console.error,
          warn: console.warn,
          debug: console.debug,
        },
      };
    }

    return baseOptions;
  }
}

// Export the configured auth options
export const authOptions = AuthConfigFactory.createAuthOptionsForEnvironment(
  process.env.NODE_ENV === 'production' ? 'production' : 'development'
);