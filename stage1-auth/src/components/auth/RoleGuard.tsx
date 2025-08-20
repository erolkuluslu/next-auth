// Role-based component protection
'use client';

import React from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { UserRole, Permission } from '@/types/rbac';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL roles/permissions
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component that conditionally renders children based on user roles and permissions
 */
export function RoleGuard({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requireAll = false,
  fallback = null,
  redirectTo,
}: RoleGuardProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    hasAnyRole, 
    hasAllRoles, 
    hasAnyPermission, 
    hasAllPermissions 
  } = useRBAC();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    if (redirectTo) {
      window.location.href = redirectTo;
      return null;
    }
    return fallback || (
      <div className="text-center p-4">
        <p className="text-gray-600">Authentication required</p>
      </div>
    );
  }

  // Check roles
  if (requiredRoles.length > 0) {
    const hasRoleAccess = requireAll 
      ? hasAllRoles(requiredRoles)
      : hasAnyRole(requiredRoles);
    
    if (!hasRoleAccess) {
      return fallback || (
        <div className="text-center p-4">
          <p className="text-gray-600">Insufficient permissions</p>
        </div>
      );
    }
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasPermissionAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
    
    if (!hasPermissionAccess) {
      return fallback || (
        <div className="text-center p-4">
          <p className="text-gray-600">Insufficient permissions</p>
        </div>
      );
    }
  }

  return <>{children}</>;
}

/**
 * Higher-order component for role-based protection
 */
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<RoleGuardProps, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <RoleGuard {...guardProps}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}

/**
 * Simple role-based visibility component
 */
interface ShowForRolesProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ShowForRoles({ roles, children, fallback = null }: ShowForRolesProps) {
  const { hasAnyRole, isAuthenticated } = useRBAC();

  if (!isAuthenticated || !hasAnyRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Simple permission-based visibility component
 */
interface ShowForPermissionsProps {
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ShowForPermissions({ permissions, children, fallback = null }: ShowForPermissionsProps) {
  const { hasAnyPermission, isAuthenticated } = useRBAC();

  if (!isAuthenticated || !hasAnyPermission(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}