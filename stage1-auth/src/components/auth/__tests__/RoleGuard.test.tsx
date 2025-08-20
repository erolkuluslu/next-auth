// RoleGuard Component Tests
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { RoleGuard, ShowForRoles, ShowForPermissions } from '../RoleGuard';

// Mock next-auth
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// Mock the RBAC hook
jest.mock('@/hooks/useRBAC', () => ({
  useRBAC: () => {
    const session = mockUseSession();
    const isAuthenticated = !!session.data;
    const isLoading = session.status === 'loading';
    
    // Mock user with roles for testing
    const mockUser = session.data?.user ? {
      id: session.data.user.id || 'user123',
      email: session.data.user.email || 'test@example.com',
      name: session.data.user.name,
      roles: (session.data.user as any).roles || ['user'],
      metadata: {
        accountStatus: 'active' as const,
        emailVerified: true,
      },
    } : null;

    return {
      user: mockUser,
      isAuthenticated,
      isLoading,
      hasRole: (role: string) => {
        if (!mockUser) return false;
        return mockUser.roles.includes(role as any);
      },
      hasAnyRole: (roles: string[]) => {
        if (!mockUser) return false;
        return roles.some(role => mockUser.roles.includes(role as any));
      },
      hasAllRoles: (roles: string[]) => {
        if (!mockUser) return false;
        return roles.every(role => mockUser.roles.includes(role as any));
      },
      hasPermission: (permission: string) => {
        if (!mockUser) return false;
        const rolePermissions: Record<string, string[]> = {
          viewer: ['dashboard:read', 'profile:read'],
          user: ['user:read', 'profile:read', 'profile:write', 'dashboard:read'],
          moderator: ['user:read', 'user:write', 'profile:read', 'profile:write', 'dashboard:read', 'settings:read'],
          admin: ['user:read', 'user:write', 'user:delete', 'admin:read', 'admin:write', 'admin:delete', 'profile:read', 'profile:write', 'dashboard:read', 'settings:read', 'settings:write', 'analytics:read', 'system:read', 'system:write'],
        };
        
        return mockUser.roles.some(role => rolePermissions[role]?.includes(permission));
      },
      hasAnyPermission: (permissions: string[]) => {
        return permissions.some(permission => {
          if (!mockUser) return false;
          const rolePermissions: Record<string, string[]> = {
            viewer: ['dashboard:read', 'profile:read'],
            user: ['user:read', 'profile:read', 'profile:write', 'dashboard:read'],
            moderator: ['user:read', 'user:write', 'profile:read', 'profile:write', 'dashboard:read', 'settings:read'],
            admin: ['user:read', 'user:write', 'user:delete', 'admin:read', 'admin:write', 'admin:delete', 'profile:read', 'profile:write', 'dashboard:read', 'settings:read', 'settings:write', 'analytics:read', 'system:read', 'system:write'],
          };
          
          return mockUser.roles.some(role => rolePermissions[role]?.includes(permission));
        });
      },
      hasAllPermissions: (permissions: string[]) => {
        return permissions.every(permission => {
          if (!mockUser) return false;
          const rolePermissions: Record<string, string[]> = {
            viewer: ['dashboard:read', 'profile:read'],
            user: ['user:read', 'profile:read', 'profile:write', 'dashboard:read'],
            moderator: ['user:read', 'user:write', 'profile:read', 'profile:write', 'dashboard:read', 'settings:read'],
            admin: ['user:read', 'user:write', 'user:delete', 'admin:read', 'admin:write', 'admin:delete', 'profile:read', 'profile:write', 'dashboard:read', 'settings:read', 'settings:write', 'analytics:read', 'system:read', 'system:write'],
          };
          
          return mockUser.roles.some(role => rolePermissions[role]?.includes(permission));
        });
      },
    };
  },
}));

describe('RoleGuard Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show loading spinner when session is loading', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      });

      render(
        <RoleGuard requiredRoles={['user']}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('Unauthenticated state', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      });
    });

    it('should show authentication required message when user is not authenticated', () => {
      render(
        <RoleGuard requiredRoles={['user']}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Authentication required')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should show custom fallback when provided', () => {
      render(
        <RoleGuard 
          requiredRoles={['user']}
          fallback={<div>Custom Auth Required</div>}
        >
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Custom Auth Required')).toBeInTheDocument();
      expect(screen.queryByText('Authentication required')).not.toBeInTheDocument();
    });
  });

  describe('Role-based access control', () => {
    it('should show content when user has required role', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user123',
            email: 'test@example.com',
            roles: ['user'],
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      });

      render(
        <RoleGuard requiredRoles={['user']}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should hide content when user does not have required role', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user123',
            email: 'test@example.com',
            roles: ['user'],
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      });

      render(
        <RoleGuard requiredRoles={['admin']}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Insufficient permissions')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should work with multiple roles (requireAll=false)', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user123',
            email: 'test@example.com',
            roles: ['user'],
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      });

      render(
        <RoleGuard requiredRoles={['user', 'admin']} requireAll={false}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should work with multiple roles (requireAll=true)', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user123',
            email: 'test@example.com',
            roles: ['user'],
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      });

      render(
        <RoleGuard requiredRoles={['user', 'admin']} requireAll={true}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Insufficient permissions')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Permission-based access control', () => {
    it('should show content when user has required permission', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user123',
            email: 'test@example.com',
            roles: ['user'],
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      });

      render(
        <RoleGuard requiredPermissions={['profile:read']}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should hide content when user does not have required permission', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user123',
            email: 'test@example.com',
            roles: ['user'],
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      });

      render(
        <RoleGuard requiredPermissions={['admin:write']}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Insufficient permissions')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Combined role and permission checks', () => {
    it('should show content when user meets both role and permission requirements', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'admin123',
            email: 'admin@example.com',
            roles: ['admin'],
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      });

      render(
        <RoleGuard requiredRoles={['admin']} requiredPermissions={['admin:read']}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});

describe('ShowForRoles Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show content when user has required role', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'admin123',
          email: 'admin@example.com',
          roles: ['admin'],
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <ShowForRoles roles={['admin']}>
        <div>Admin Content</div>
      </ShowForRoles>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should hide content when user does not have required role', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          email: 'user@example.com',
          roles: ['user'],
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <ShowForRoles roles={['admin']}>
        <div>Admin Content</div>
      </ShowForRoles>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should show fallback when user does not have required role', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          email: 'user@example.com',
          roles: ['user'],
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <ShowForRoles roles={['admin']} fallback={<div>No Access</div>}>
        <div>Admin Content</div>
      </ShowForRoles>
    );

    expect(screen.getByText('No Access')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});

describe('ShowForPermissions Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show content when user has required permission', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'admin123',
          email: 'admin@example.com',
          roles: ['admin'],
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <ShowForPermissions permissions={['admin:read']}>
        <div>Admin Content</div>
      </ShowForPermissions>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should hide content when user does not have required permission', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          email: 'user@example.com',
          roles: ['user'],
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <ShowForPermissions permissions={['admin:read']}>
        <div>Admin Content</div>
      </ShowForPermissions>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should show fallback when user does not have required permission', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          email: 'user@example.com',
          roles: ['user'],
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <ShowForPermissions permissions={['admin:read']} fallback={<div>No Access</div>}>
        <div>Admin Content</div>
      </ShowForPermissions>
    );

    expect(screen.getByText('No Access')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});