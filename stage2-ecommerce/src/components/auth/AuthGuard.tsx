'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Role } from '@/types/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: Role;
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * AuthGuard component to protect routes requiring authentication
 * Optionally can require specific roles
 */
export default function AuthGuard({
  children,
  requiredRole,
  redirectTo = '/auth/signin',
  fallback = <LoadingSpinner />,
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      // Not authenticated
      router.push(redirectTo);
      return;
    }

    if (requiredRole && session.user?.role !== requiredRole) {
      // Authenticated but insufficient role
      router.push('/unauthorized');
      return;
    }
  }, [session, status, router, requiredRole, redirectTo]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return <>{fallback}</>;
  }

  // Not authenticated
  if (!session) {
    return <>{fallback}</>;
  }

  // Authenticated but insufficient role
  if (requiredRole && session.user?.role !== requiredRole) {
    return <>{fallback}</>;
  }

  // Authenticated and authorized
  return <>{children}</>;
}