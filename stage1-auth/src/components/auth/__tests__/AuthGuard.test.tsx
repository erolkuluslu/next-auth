import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { AuthGuard } from '../AuthGuard';

// Mock next-auth
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// Mock next/link
jest.mock('next/link', () => {
  return function MockedLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('AuthGuard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading spinner when session is loading', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
      update: jest.fn(),
    });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should show access denied when not authenticated and requireAuth is true', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    render(
      <AuthGuard requireAuth={true}>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('You must be signed in to view this page.')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when authenticated with correct role', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <AuthGuard requireAuth={true} allowedRoles={['user', 'admin']}>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
  });

  it('should show insufficient permissions when user role is not allowed', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <AuthGuard requireAuth={true} allowedRoles={['admin']}>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Insufficient Permissions')).toBeInTheDocument();
    expect(screen.getByText('You do not have the required role to access this page.')).toBeInTheDocument();
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('View Profile')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when requireAuth is false regardless of session', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    render(
      <AuthGuard requireAuth={false}>
        <div>Public Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    const customFallback = <div>Custom Access Denied</div>;

    render(
      <AuthGuard requireAuth={true} fallback={customFallback}>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Custom Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
  });

  it('should handle admin role correctly', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'admin123',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <AuthGuard requireAuth={true} allowedRoles={['admin']}>
        <div>Admin Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should default to user and admin roles when allowedRoles is not specified', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <AuthGuard requireAuth={true}>
        <div>Default Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Default Protected Content')).toBeInTheDocument();
  });

  it('should handle user without role gracefully', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user123',
          name: 'John Doe',
          email: 'john@example.com',
          // role is undefined
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <AuthGuard requireAuth={true} allowedRoles={['user', 'admin']}>
        <div>Protected Content</div>
      </AuthGuard>
    );

    // Should default to 'user' role and allow access
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});