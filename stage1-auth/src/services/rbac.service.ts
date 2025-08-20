// Enhanced Role-Based Access Control (RBAC) Service

import { 
  UserRole, 
  Permission, 
  RoleDefinition, 
  UserWithRoles, 
  AccessContext, 
  PolicyRule 
} from '@/types/rbac';

// Role definitions with inheritance and permissions
export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to basic content',
    permissions: [
      'dashboard:read',
      'profile:read',
    ],
  },
  user: {
    id: 'user',
    name: 'User',
    description: 'Standard user with basic permissions',
    permissions: [
      'user:read',
      'profile:read',
      'profile:write',
      'dashboard:read',
    ],
    inherits: ['viewer'],
  },
  moderator: {
    id: 'moderator',
    name: 'Moderator',
    description: 'Moderator with user management permissions',
    permissions: [
      'user:read',
      'user:write',
      'profile:read',
      'profile:write',
      'dashboard:read',
      'settings:read',
    ],
    inherits: ['user'],
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    permissions: [
      'user:read',
      'user:write',
      'user:delete',
      'admin:read',
      'admin:write',
      'admin:delete',
      'profile:read',
      'profile:write',
      'dashboard:read',
      'settings:read',
      'settings:write',
      'analytics:read',
      'system:read',
      'system:write',
    ],
    inherits: ['moderator'],
  },
};

// Interface for RBAC operations
export interface IRBACService {
  hasPermission(user: UserWithRoles | null, permission: Permission): boolean;
  hasRole(user: UserWithRoles | null, role: UserRole): boolean;
  canAccessResource(user: UserWithRoles | null, context: AccessContext): boolean;
  getUserPermissions(userRoles: UserRole[]): Permission[];
  validateAccess(user: UserWithRoles | null, resource: string, action: string): boolean;
  getRoleHierarchy(role: UserRole): UserRole[];
  roleInheritsFrom(role: UserRole, targetRole: UserRole): boolean;
  getRoleDefinition(role: UserRole): RoleDefinition & { computedPermissions: Permission[] };
}

// Enhanced RBAC Service implementation
export class RBACService implements IRBACService {
  private roleDefinitions: Record<UserRole, RoleDefinition>;
  private policyRules: PolicyRule[];

  constructor(
    roleDefinitions: Record<UserRole, RoleDefinition> = ROLE_DEFINITIONS,
    policyRules: PolicyRule[] = []
  ) {
    this.roleDefinitions = roleDefinitions;
    this.policyRules = policyRules;
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(user: UserWithRoles | null, permission: Permission): boolean {
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }

    // Check if user is suspended
    if (user.metadata?.accountStatus === 'suspended') {
      return false;
    }

    const userPermissions = this.getUserPermissions(user.roles);
    return userPermissions.includes(permission);
  }

  /**
   * Check if user has a specific role
   */
  hasRole(user: UserWithRoles | null, role: UserRole): boolean {
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }

    return user.roles.includes(role);
  }

  /**
   * Check if user can access a resource with context
   */
  canAccessResource(user: UserWithRoles | null, context: AccessContext): boolean {
    if (!user) {
      return false;
    }

    // Apply policy rules first
    const policyResult = this.evaluatePolicies(user, context);
    if (policyResult !== null) {
      return policyResult;
    }

    // Fallback to permission-based access
    const permission = this.mapResourceActionToPermission(context.resource, context.action);
    if (permission) {
      return this.hasPermission(user, permission);
    }

    return false;
  }

  /**
   * Get all permissions for given roles (including inherited)
   */
  getUserPermissions(userRoles: UserRole[]): Permission[] {
    const allPermissions = new Set<Permission>();

    for (const role of userRoles) {
      this.collectRolePermissions(role, allPermissions, new Set());
    }

    return Array.from(allPermissions);
  }

  /**
   * Validate access to a resource/action combination
   */
  validateAccess(user: UserWithRoles | null, resource: string, action: string): boolean {
    return this.canAccessResource(user, { resource, action, userId: user?.id });
  }

  /**
   * Get role hierarchy (roles with their inherited roles)
   */
  getRoleHierarchy(role: UserRole): UserRole[] {
    const hierarchy: UserRole[] = [role];
    const roleDefinition = this.roleDefinitions[role];

    if (roleDefinition?.inherits) {
      for (const inheritedRole of roleDefinition.inherits) {
        hierarchy.push(...this.getRoleHierarchy(inheritedRole));
      }
    }

    return [...new Set(hierarchy)]; // Remove duplicates
  }

  /**
   * Check if one role inherits from another
   */
  roleInheritsFrom(role: UserRole, targetRole: UserRole): boolean {
    const hierarchy = this.getRoleHierarchy(role);
    return hierarchy.includes(targetRole);
  }

  /**
   * Get role definition with computed permissions
   */
  getRoleDefinition(role: UserRole): RoleDefinition & { computedPermissions: Permission[] } {
    const definition = this.roleDefinitions[role];
    const computedPermissions = this.getUserPermissions([role]);

    return {
      ...definition,
      computedPermissions,
    };
  }

  /**
   * Private method to collect permissions recursively
   */
  private collectRolePermissions(
    role: UserRole,
    permissions: Set<Permission>,
    visited: Set<UserRole>
  ): void {
    if (visited.has(role)) {
      return; // Prevent infinite recursion
    }

    visited.add(role);
    const roleDefinition = this.roleDefinitions[role];

    if (!roleDefinition) {
      return;
    }

    // Add direct permissions
    roleDefinition.permissions.forEach(permission => permissions.add(permission));

    // Add inherited permissions
    if (roleDefinition.inherits) {
      for (const inheritedRole of roleDefinition.inherits) {
        this.collectRolePermissions(inheritedRole, permissions, visited);
      }
    }
  }

  /**
   * Evaluate policy rules for access decision
   */
  private evaluatePolicies(user: UserWithRoles, context: AccessContext): boolean | null {
    for (const rule of this.policyRules) {
      if (this.matchesRule(rule, user, context)) {
        return rule.effect === 'allow';
      }
    }

    return null; // No matching policy
  }

  /**
   * Check if a policy rule matches the context
   */
  private matchesRule(rule: PolicyRule, user: UserWithRoles, context: AccessContext): boolean {
    // Check resource
    if (rule.resource !== '*' && rule.resource !== context.resource) {
      return false;
    }

    // Check action
    if (!rule.actions.includes('*') && !rule.actions.includes(context.action)) {
      return false;
    }

    // Check conditions
    if (rule.conditions) {
      if (rule.conditions.userRoles) {
        const hasRequiredRole = rule.conditions.userRoles.some(role => 
          user.roles.includes(role)
        );
        if (!hasRequiredRole) {
          return false;
        }
      }

      if (rule.conditions.permissions) {
        const userPermissions = this.getUserPermissions(user.roles);
        const hasRequiredPermission = rule.conditions.permissions.some(permission =>
          userPermissions.includes(permission)
        );
        if (!hasRequiredPermission) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Map resource/action to permission
   */
  private mapResourceActionToPermission(resource: string, action: string): Permission | null {
    const mapping: Record<string, Record<string, Permission>> = {
      user: {
        read: 'user:read',
        write: 'user:write',
        delete: 'user:delete',
      },
      admin: {
        read: 'admin:read',
        write: 'admin:write',
        delete: 'admin:delete',
      },
      profile: {
        read: 'profile:read',
        write: 'profile:write',
      },
      dashboard: {
        read: 'dashboard:read',
      },
      settings: {
        read: 'settings:read',
        write: 'settings:write',
      },
      analytics: {
        read: 'analytics:read',
      },
      system: {
        read: 'system:read',
        write: 'system:write',
      },
    };

    return mapping[resource]?.[action] || null;
  }
}

// Factory for creating RBAC service
export class RBACServiceFactory {
  static create(customRoles?: Record<UserRole, RoleDefinition>, policies?: PolicyRule[]): IRBACService {
    return new RBACService(customRoles, policies);
  }

  static createWithPolicies(policies: PolicyRule[]): IRBACService {
    return new RBACService(ROLE_DEFINITIONS, policies);
  }
}

// Export default instance
export const rbacService = RBACServiceFactory.create();