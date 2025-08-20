// RBAC Hook for React components
'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { rbacService } from '@/services/rbac.service';
import { UserRole, Permission, AccessContext, UserWithRoles } from '@/types/rbac';

export interface UseRBACReturn {
  // User information
  user: UserWithRoles | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Role checking
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
  
  // Permission checking
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  
  // Resource access checking
  canAccess: (resource: string, action: string) => boolean;
  canAccessResource: (context: AccessContext) => boolean;
  
  // Utility functions
  getUserRoles: () => UserRole[];
  getUserPermissions: () => Permission[];
  getRoleHierarchy: (role: UserRole) => UserRole[];
}

/**
 * Enhanced RBAC hook for React components
 * Provides role and permission checking functionality
 */
export function useRBAC(): UseRBACReturn {
  const { data: session, status } = useSession();

  // Convert session user to UserWithRoles
  const user = useMemo((): UserWithRoles | null => {
    if (!session?.user) return null;

    return {
      id: session.user.id || session.user.email || 'unknown',
      email: session.user.email || '',
      name: session.user.name || undefined,
      roles: (session.user as any).roles || ['user'], // Default to 'user' role
      metadata: {
        lastLogin: (session.user as any).lastLogin,
        accountStatus: (session.user as any).accountStatus || 'active',
        emailVerified: (session.user as any).emailVerified || false,
      },
    };
  }, [session]);

  const isAuthenticated = !!session && !!user;
  const isLoading = status === 'loading';

  // Role checking functions
  const hasRole = (role: UserRole): boolean => {
    return rbacService.hasRole(user, role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const hasAllRoles = (roles: UserRole[]): boolean => {
    return roles.every(role => hasRole(role));
  };

  // Permission checking functions
  const hasPermission = (permission: Permission): boolean => {
    return rbacService.hasPermission(user, permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  // Resource access checking
  const canAccess = (resource: string, action: string): boolean => {
    return rbacService.validateAccess(user, resource, action);
  };

  const canAccessResource = (context: AccessContext): boolean => {
    return rbacService.canAccessResource(user, context);
  };

  // Utility functions
  const getUserRoles = (): UserRole[] => {
    return user?.roles || [];
  };

  const getUserPermissions = (): Permission[] => {
    if (!user?.roles) return [];
    return rbacService.getUserPermissions(user.roles);
  };

  const getRoleHierarchy = (role: UserRole): UserRole[] => {
    return rbacService.getRoleHierarchy(role);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    canAccessResource,
    getUserRoles,
    getUserPermissions,
    getRoleHierarchy,
  };
}

/**
 * Hook for checking specific role access
 */
export function useRoleAccess(requiredRole: UserRole) {
  const { hasRole, isAuthenticated, isLoading } = useRBAC();
  
  return {
    hasAccess: isAuthenticated && hasRole(requiredRole),
    isLoading,
    isAuthenticated,
  };
}

/**
 * Hook for checking specific permission access
 */
export function usePermissionAccess(requiredPermission: Permission) {
  const { hasPermission, isAuthenticated, isLoading } = useRBAC();
  
  return {
    hasAccess: isAuthenticated && hasPermission(requiredPermission),
    isLoading,
    isAuthenticated,
  };
}

/**
 * Hook for checking resource access
 */
export function useResourceAccess(resource: string, action: string) {
  const { canAccess, isAuthenticated, isLoading } = useRBAC();
  
  return {
    hasAccess: isAuthenticated && canAccess(resource, action),
    isLoading,
    isAuthenticated,
  };
}