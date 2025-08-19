import {
  AuthenticationService,
  AuthorizationService,
  SessionService,
  AuthServiceFactory,
} from '../auth.service';
import { User, UserRole } from '@/types/auth';

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let mockSignInProvider: jest.Mock;

  beforeEach(() => {
    mockSignInProvider = jest.fn();
    authService = new AuthenticationService(mockSignInProvider);
  });

  describe('signIn', () => {
    it('should call signIn provider with correct parameters', async () => {
      mockSignInProvider.mockResolvedValue(undefined);

      await authService.signIn('auth0', '/dashboard');

      expect(mockSignInProvider).toHaveBeenCalledWith('auth0', {
        callbackUrl: '/dashboard',
        redirect: true,
      });
    });

    it('should use default callbackUrl when not provided', async () => {
      mockSignInProvider.mockResolvedValue(undefined);

      await authService.signIn('auth0');

      expect(mockSignInProvider).toHaveBeenCalledWith('auth0', {
        callbackUrl: '/dashboard',
        redirect: true,
      });
    });

    it('should throw error when signIn fails', async () => {
      mockSignInProvider.mockRejectedValue(new Error('Sign in failed'));

      await expect(authService.signIn('auth0')).rejects.toThrow('Authentication failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no session', async () => {
      // Mock private method getSessionFromProvider to return null
      jest.spyOn(authService as any, 'getSessionFromProvider').mockResolvedValue(null);

      const user = await authService.getCurrentUser();

      expect(user).toBeNull();
    });

    it('should return user when session exists', async () => {
      const mockUser = {
        id: 'user123',
        email: 'user@example.com',
        name: 'John Doe',
      };

      jest.spyOn(authService as any, 'getSessionFromProvider').mockResolvedValue({
        user: mockUser,
      });

      const user = await authService.getCurrentUser();

      expect(user).toEqual(mockUser);
    });

    it('should return null when getCurrentUser throws error', async () => {
      jest.spyOn(authService as any, 'getSessionFromProvider').mockRejectedValue(new Error('Session error'));

      const user = await authService.getCurrentUser();

      expect(user).toBeNull();
    });
  });
});

describe('AuthorizationService', () => {
  let authzService: AuthorizationService;

  beforeEach(() => {
    authzService = new AuthorizationService();
  });

  describe('hasRole', () => {
    it('should return true when user has the specified role', () => {
      const user: User = {
        id: 'user123',
        email: 'user@example.com',
        role: 'admin',
      };

      expect(authzService.hasRole(user, 'admin')).toBe(true);
    });

    it('should return false when user does not have the specified role', () => {
      const user: User = {
        id: 'user123',
        email: 'user@example.com',
        role: 'user',
      };

      expect(authzService.hasRole(user, 'admin')).toBe(false);
    });

    it('should return false when user is null', () => {
      expect(authzService.hasRole(null, 'admin')).toBe(false);
    });

    it('should return false when user has no role', () => {
      const user: User = {
        id: 'user123',
        email: 'user@example.com',
      };

      expect(authzService.hasRole(user, 'admin')).toBe(false);
    });
  });

  describe('canAccessRoute', () => {
    it('should return true when user role is in required roles', () => {
      const user: User = {
        id: 'user123',
        email: 'user@example.com',
        role: 'admin',
      };

      expect(authzService.canAccessRoute(user, ['admin', 'user'])).toBe(true);
    });

    it('should return false when user role is not in required roles', () => {
      const user: User = {
        id: 'user123',
        email: 'user@example.com',
        role: 'user',
      };

      expect(authzService.canAccessRoute(user, ['admin'])).toBe(false);
    });

    it('should return false when user is null', () => {
      expect(authzService.canAccessRoute(null, ['admin'])).toBe(false);
    });
  });

  describe('getUserRole', () => {
    it('should return user role when user has role', () => {
      const user: User = {
        id: 'user123',
        email: 'user@example.com',
        role: 'admin',
      };

      expect(authzService.getUserRole(user)).toBe('admin');
    });

    it('should return default user role when user has no role', () => {
      const user: User = {
        id: 'user123',
        email: 'user@example.com',
      };

      expect(authzService.getUserRole(user)).toBe('user');
    });

    it('should return default user role when user is null', () => {
      expect(authzService.getUserRole(null)).toBe('user');
    });
  });
});

describe('SessionService', () => {
  let sessionService: SessionService;

  beforeEach(() => {
    sessionService = new SessionService();
  });

  describe('isSessionValid', () => {
    it('should return true for valid session', () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      const session = {
        user: { id: 'user123' },
        expires: futureDate,
      };

      expect(sessionService.isSessionValid(session)).toBe(true);
    });

    it('should return false for expired session', () => {
      const pastDate = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
      const session = {
        user: { id: 'user123' },
        expires: pastDate,
      };

      expect(sessionService.isSessionValid(session)).toBe(false);
    });

    it('should return false for null session', () => {
      expect(sessionService.isSessionValid(null)).toBe(false);
    });
  });

  describe('getSessionExpiry', () => {
    it('should return expiry date for valid session', () => {
      const expiryString = '2024-12-31T23:59:59.000Z';
      const session = {
        user: { id: 'user123' },
        expires: expiryString,
      };

      const expiry = sessionService.getSessionExpiry(session);
      expect(expiry).toEqual(new Date(expiryString));
    });

    it('should return null for session without expires', () => {
      const session = {
        user: { id: 'user123' },
        expires: '',
      };

      expect(sessionService.getSessionExpiry(session)).toBeNull();
    });

    it('should return null for null session', () => {
      expect(sessionService.getSessionExpiry(null)).toBeNull();
    });
  });
});

describe('AuthServiceFactory', () => {
  describe('createAuthenticationService', () => {
    it('should create AuthenticationService with provider', () => {
      const mockProvider = jest.fn();
      const service = AuthServiceFactory.createAuthenticationService(mockProvider);

      expect(service).toBeInstanceOf(AuthenticationService);
    });
  });

  describe('createAuthorizationService', () => {
    it('should create AuthorizationService', () => {
      const service = AuthServiceFactory.createAuthorizationService();

      expect(service).toBeInstanceOf(AuthorizationService);
    });
  });

  describe('createSessionService', () => {
    it('should create SessionService', () => {
      const service = AuthServiceFactory.createSessionService();

      expect(service).toBeInstanceOf(SessionService);
    });
  });
});