'use client';

import { useSession } from 'next-auth/react';
import { Role, ROLE_HIERARCHY, DEFAULT_PERMISSIONS } from '@/types/auth';

/**
 * Custom hook for Role-Based Access Control (RBAC)
 * Provides utilities for checking user permissions and roles
 */
export function useRBAC() {
  const { data: session, status } = useSession();

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!session?.user?.role) return false;
    
    const userRole = session.user.role as Role;
    const permissions = DEFAULT_PERMISSIONS[userRole];
    
    return permissions?.[permission] === true;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasRole = (roles: Role[]): boolean => {
    if (!session?.user?.roles) return false;
    
    const userRoles = session.user.roles as Role[];
    return roles.some(role => userRoles.includes(role));
  };

  /**
   * Check if user has minimum role level (hierarchical)
   */
  const hasMinimumRole = (minimumRole: Role): boolean => {
    if (!session?.user?.role) return false;
    
    const userRole = session.user.role as Role;
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const minimumLevel = ROLE_HIERARCHY[minimumRole] || 0;
    
    return userLevel >= minimumLevel;
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = (): boolean => {
    return status === 'authenticated' && !!session?.user;
  };

  /**
   * Check if user is admin
   */
  const isAdmin = (): boolean => {
    return session?.user?.role === 'admin';
  };

  /**
   * Check if user is moderator or higher
   */
  const isModerator = (): boolean => {
    return hasMinimumRole('moderator');
  };

  /**
   * Get user's primary role
   */
  const getUserRole = (): Role | null => {
    return (session?.user?.role as Role) || null;
  };

  /**
   * Get all user roles
   */
  const getUserRoles = (): Role[] => {
    return (session?.user?.roles as Role[]) || [];
  };

  /**
   * Get user permissions
   */
  const getUserPermissions = () => {
    if (!session?.user?.role) return {};
    
    const userRole = session.user.role as Role;
    return DEFAULT_PERMISSIONS[userRole] || {};
  };

  /**
   * Check if loading
   */
  const isLoading = (): boolean => {
    return status === 'loading';
  };

  return {
    // State
    isAuthenticated,
    isLoading,
    user: session?.user,
    session,
    
    // Role checks
    hasRole,
    hasMinimumRole,
    isAdmin,
    isModerator,
    getUserRole,
    getUserRoles,
    
    // Permission checks
    hasPermission,
    getUserPermissions,
  };
}