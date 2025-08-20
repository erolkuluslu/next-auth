'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { Role, ROLE_HIERARCHY } from '@/types/auth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
  minimumRole?: Role;
  fallback?: ReactNode;
  showDebug?: boolean;
}

/**
 * RoleGuard component to conditionally render content based on user roles
 * Can use either allowedRoles (specific roles) or minimumRole (hierarchical)
 */
export default function RoleGuard({
  children,
  allowedRoles,
  minimumRole,
  fallback = null,
  showDebug = false,
}: RoleGuardProps) {
  const { data: session } = useSession();

  // Not authenticated
  if (!session?.user) {
    if (showDebug) {
      console.log('RoleGuard: User not authenticated');
    }
    return <>{fallback}</>;
  }

  const userRole = session.user.role;
  const userRoles = session.user.roles || [];

  if (showDebug) {
    console.log('RoleGuard Debug:', {
      userRole,
      userRoles,
      allowedRoles,
      minimumRole,
    });
  }

  // Check specific allowed roles
  if (allowedRoles.length > 0) {
    const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role as Role));
    if (!hasAllowedRole) {
      if (showDebug) {
        console.log('RoleGuard: User does not have required role');
      }
      return <>{fallback}</>;
    }
  }

  // Check minimum role hierarchy
  if (minimumRole) {
    const userRoleLevel = userRole ? ROLE_HIERARCHY[userRole as Role] : 0;
    const minimumRoleLevel = ROLE_HIERARCHY[minimumRole];
    
    if (userRoleLevel < minimumRoleLevel) {
      if (showDebug) {
        console.log('RoleGuard: User role level insufficient', {
          userRoleLevel,
          minimumRoleLevel,
        });
      }
      return <>{fallback}</>;
    }
  }

  // User has required permissions
  return <>{children}</>;
}