// Role-Based Access Control (RBAC) system types

export type Permission = 
  | 'user:read'
  | 'user:write'
  | 'user:delete'
  | 'admin:read'
  | 'admin:write'
  | 'admin:delete'
  | 'profile:read'
  | 'profile:write'
  | 'dashboard:read'
  | 'settings:read'
  | 'settings:write'
  | 'analytics:read'
  | 'system:read'
  | 'system:write';

export type UserRole = 'user' | 'admin' | 'moderator' | 'viewer';

export interface RoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  permissions: Permission[];
  inherits?: UserRole[];
}

export interface UserWithRoles {
  id: string;
  email: string;
  name?: string;
  roles: UserRole[];
  permissions?: Permission[];
  metadata?: {
    lastLogin?: string;
    accountStatus: 'active' | 'suspended' | 'pending';
    emailVerified: boolean;
  };
}

export interface AccessContext {
  resource: string;
  action: string;
  userId?: string;
  userRoles?: UserRole[];
  metadata?: Record<string, any>;
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  resource: string;
  actions: string[];
  effect: 'allow' | 'deny';
  conditions?: {
    userRoles?: UserRole[];
    permissions?: Permission[];
    metadata?: Record<string, any>;
  };
}