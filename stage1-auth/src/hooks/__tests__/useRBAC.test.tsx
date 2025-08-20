// RBAC Hook Tests
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRBAC, useRoleAccess, usePermissionAccess, useResourceAccess } from '../useRBAC';

// Mock next-auth
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// Test component to use the hook
function TestComponent() {
  const {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasPermission,
    canAccess,
    getUserRoles,
    getUserPermissions,
  } = useRBAC();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div>
      <div data-testid="user-id">{user?.id}</div>
      <div data-testid="user-email">{user?.email}</div>
      <div data-testid="user-roles">{getUserRoles().join(', ')}</div>
      <div data-testid="user-permissions">{getUserPermissions().join(', ')}</div>
      <div data-testid="has-user-role">{hasRole('user').toString()}</div>
      <div data-testid="has-admin-role">{hasRole('admin').toString()}</div>
      <div data-testid="has-profile-read">{hasPermission('profile:read').toString()}</div>
      <div data-testid="has-admin-read">{hasPermission('admin:read').toString()}</div>
      <div data-testid="can-access-profile">{canAccess('profile', 'read').toString()}</div>
    </div>
  );
}

function RoleAccessTestComponent({ requiredRole }: { requiredRole: 'user' | 'admin' }) {
  const { hasAccess, isLoading, isAuthenticated } = useRoleAccess(requiredRole);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div data-testid="role-access">{hasAccess ? 'Access granted' : 'Access denied'}</div>
  );
}

function PermissionAccessTestComponent({ requiredPermission }: { requiredPermission: 'profile:read' | 'admin:read' }) {
  const { hasAccess, isLoading, isAuthenticated } = usePermissionAccess(requiredPermission);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div data-testid="permission-access">{hasAccess ? 'Access granted' : 'Access denied'}</div>
  );
}

function ResourceAccessTestComponent({ resource, action }: { resource: string; action: string }) {
  const { hasAccess, isLoading, isAuthenticated } = useResourceAccess(resource, action);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div data-testid="resource-access">{hasAccess ? 'Access granted' : 'Access denied'}</div>
  );
}

describe('useRBAC Hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show loading when session is loading', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      });

      render(<TestComponent />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated state', () => {
    it('should show not authenticated when no session', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      });

      render(<TestComponent />);
      expect(screen.getByText('Not authenticated')).toBeInTheDocument();
    });
  });

  describe('Authenticated user with user role', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user123',
            email: 'test@example.com',
            name: 'Test User',
            roles: ['user'],
            lastLogin: '2024-01-15',
            accountStatus: 'active',
            emailVerified: true,
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      });
    });

    it('should render user information correctly', () => {
      render(<TestComponent />);

      expect(screen.getByTestId('user-id')).toHaveTextContent('user123');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('user-roles')).toHaveTextContent('user');
    });

    it('should check roles correctly', () => {
      render(<TestComponent />);

      expect(screen.getByTestId('has-user-role')).toHaveTextContent('true');
      expect(screen.getByTestId('has-admin-role')).toHaveTextContent('false');
    });

    it('should check permissions correctly', () => {
      render(<TestComponent />);

      expect(screen.getByTestId('has-profile-read')).toHaveTextContent('true');
      expect(screen.getByTestId('has-admin-read')).toHaveTextContent('false');
    });

    it('should check resource access correctly', () => {
      render(<TestComponent />);

      expect(screen.getByTestId('can-access-profile')).toHaveTextContent('true');
    });

    it('should show user permissions including inherited ones', () => {
      render(<TestComponent />);

      const permissionsText = screen.getByTestId('user-permissions').textContent;
      expect(permissionsText).toContain('user:read');
      expect(permissionsText).toContain('profile:read');
      expect(permissionsText).toContain('profile:write');
      expect(permissionsText).toContain('dashboard:read');
    });
  });

  describe('Authenticated user with admin role', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'admin123',
            email: 'admin@example.com',
            name: 'Admin User',
            roles: ['admin'],
            lastLogin: '2024-01-15',
            accountStatus: 'active',
            emailVerified: true,
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      });
    });

    it('should have admin permissions', () => {
      render(<TestComponent />);

      expect(screen.getByTestId('has-admin-role')).toHaveTextContent('true');
      expect(screen.getByTestId('has-user-role')).toHaveTextContent('false'); // Direct role check
      expect(screen.getByTestId('has-admin-read')).toHaveTextContent('true');
    });

    it('should show comprehensive admin permissions', () => {
      render(<TestComponent />);

      const permissionsText = screen.getByTestId('user-permissions').textContent;
      expect(permissionsText).toContain('admin:read');
      expect(permissionsText).toContain('admin:write');
      expect(permissionsText).toContain('admin:delete');
      expect(permissionsText).toContain('user:read');
      expect(permissionsText).toContain('profile:read');
    });
  });

  describe('User with no roles', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'norole123',
            email: 'norole@example.com',
            name: 'No Role User',
            // No roles property
            lastLogin: '2024-01-15',
            accountStatus: 'active',
            emailVerified: true,
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      });
    });

    it('should default to user role and show basic permissions', () => {
      render(<TestComponent />);

      expect(screen.getByTestId('user-roles')).toHaveTextContent('user');
      expect(screen.getByTestId('has-user-role')).toHaveTextContent('true');
    });
  });
});

describe('useRoleAccess Hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should grant access when user has required role', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          email: 'test@example.com',
          roles: ['user'],
          accountStatus: 'active',
          emailVerified: true,
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(<RoleAccessTestComponent requiredRole="user" />);
    expect(screen.getByTestId('role-access')).toHaveTextContent('Access granted');
  });

  it('should deny access when user does not have required role', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          email: 'test@example.com',
          roles: ['user'],
          accountStatus: 'active',
          emailVerified: true,
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(<RoleAccessTestComponent requiredRole="admin" />);
    expect(screen.getByTestId('role-access')).toHaveTextContent('Access denied');
  });
});

describe('usePermissionAccess Hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should grant access when user has required permission', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          email: 'test@example.com',
          roles: ['user'],
          accountStatus: 'active',
          emailVerified: true,
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(<PermissionAccessTestComponent requiredPermission="profile:read" />);
    expect(screen.getByTestId('permission-access')).toHaveTextContent('Access granted');
  });

  it('should deny access when user does not have required permission', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          email: 'test@example.com',
          roles: ['user'],
          accountStatus: 'active',
          emailVerified: true,
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(<PermissionAccessTestComponent requiredPermission="admin:read" />);
    expect(screen.getByTestId('permission-access')).toHaveTextContent('Access denied');
  });
});

describe('useResourceAccess Hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should grant access for allowed resource/action combination', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          email: 'test@example.com',
          roles: ['user'],
          accountStatus: 'active',
          emailVerified: true,
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(<ResourceAccessTestComponent resource="profile" action="read" />);
    expect(screen.getByTestId('resource-access')).toHaveTextContent('Access granted');
  });

  it('should deny access for restricted resource/action combination', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          email: 'test@example.com',
          roles: ['user'],
          accountStatus: 'active',
          emailVerified: true,
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(<ResourceAccessTestComponent resource="admin" action="write" />);
    expect(screen.getByTestId('resource-access')).toHaveTextContent('Access denied');
  });
});