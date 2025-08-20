// RBAC Service Tests
import {
  RBACService,
  RBACServiceFactory,
  ROLE_DEFINITIONS,
  IRBACService,
} from '../rbac.service';
import { UserRole, Permission, UserWithRoles, AccessContext, PolicyRule } from '@/types/rbac';

describe('RBACService', () => {
  let rbacService: IRBACService;

  beforeEach(() => {
    rbacService = RBACServiceFactory.create();
  });

  describe('hasPermission', () => {
    const testUser: UserWithRoles = {
      id: 'user1',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['user'],
      metadata: {
        accountStatus: 'active',
        emailVerified: true,
      },
    };

    it('should return true when user has required permission', () => {
      const result = rbacService.hasPermission(testUser, 'profile:read');
      expect(result).toBe(true);
    });

    it('should return false when user does not have required permission', () => {
      const result = rbacService.hasPermission(testUser, 'admin:read');
      expect(result).toBe(false);
    });

    it('should return false for null user', () => {
      const result = rbacService.hasPermission(null, 'profile:read');
      expect(result).toBe(false);
    });

    it('should return false for user with no roles', () => {
      const userWithoutRoles: UserWithRoles = {
        ...testUser,
        roles: [],
      };
      const result = rbacService.hasPermission(userWithoutRoles, 'profile:read');
      expect(result).toBe(false);
    });

    it('should return false for suspended user', () => {
      const suspendedUser: UserWithRoles = {
        ...testUser,
        metadata: {
          accountStatus: 'suspended',
          emailVerified: true,
        },
      };
      const result = rbacService.hasPermission(suspendedUser, 'profile:read');
      expect(result).toBe(false);
    });
  });

  describe('hasRole', () => {
    const testUser: UserWithRoles = {
      id: 'user1',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['user', 'moderator'],
      metadata: {
        accountStatus: 'active',
        emailVerified: true,
      },
    };

    it('should return true when user has required role', () => {
      expect(rbacService.hasRole(testUser, 'user')).toBe(true);
      expect(rbacService.hasRole(testUser, 'moderator')).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      expect(rbacService.hasRole(testUser, 'admin')).toBe(false);
    });

    it('should return false for null user', () => {
      expect(rbacService.hasRole(null, 'user')).toBe(false);
    });
  });

  describe('getUserPermissions', () => {
    it('should return all permissions for user role including inherited ones', () => {
      const permissions = rbacService.getUserPermissions(['user']);
      
      // User should have their own permissions plus inherited from viewer
      expect(permissions).toContain('user:read');
      expect(permissions).toContain('profile:read');
      expect(permissions).toContain('profile:write');
      expect(permissions).toContain('dashboard:read');
      
      // Should not have admin permissions
      expect(permissions).not.toContain('admin:read');
    });

    it('should return admin permissions including all inherited ones', () => {
      const permissions = rbacService.getUserPermissions(['admin']);
      
      // Admin should have all permissions
      expect(permissions).toContain('admin:read');
      expect(permissions).toContain('admin:write');
      expect(permissions).toContain('admin:delete');
      expect(permissions).toContain('user:read');
      expect(permissions).toContain('user:write');
      expect(permissions).toContain('profile:read');
      expect(permissions).toContain('dashboard:read');
    });

    it('should handle multiple roles correctly', () => {
      const permissions = rbacService.getUserPermissions(['user', 'moderator']);
      
      // Should have permissions from both roles
      expect(permissions).toContain('user:read');
      expect(permissions).toContain('user:write'); // From moderator
      expect(permissions).toContain('settings:read'); // From moderator
    });

    it('should return empty array for empty roles', () => {
      const permissions = rbacService.getUserPermissions([]);
      expect(permissions).toEqual([]);
    });
  });

  describe('canAccessResource', () => {
    const testUser: UserWithRoles = {
      id: 'user1',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['user'],
      metadata: {
        accountStatus: 'active',
        emailVerified: true,
      },
    };

    it('should allow access to resources user has permission for', () => {
      const context: AccessContext = {
        resource: 'profile',
        action: 'read',
        userId: 'user1',
      };

      const result = rbacService.canAccessResource(testUser, context);
      expect(result).toBe(true);
    });

    it('should deny access to resources user does not have permission for', () => {
      const context: AccessContext = {
        resource: 'admin',
        action: 'read',
        userId: 'user1',
      };

      const result = rbacService.canAccessResource(testUser, context);
      expect(result).toBe(false);
    });

    it('should return false for null user', () => {
      const context: AccessContext = {
        resource: 'profile',
        action: 'read',
      };

      const result = rbacService.canAccessResource(null, context);
      expect(result).toBe(false);
    });
  });

  describe('validateAccess', () => {
    const testUser: UserWithRoles = {
      id: 'user1',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['moderator'],
      metadata: {
        accountStatus: 'active',
        emailVerified: true,
      },
    };

    it('should validate access correctly', () => {
      expect(rbacService.validateAccess(testUser, 'user', 'read')).toBe(true);
      expect(rbacService.validateAccess(testUser, 'user', 'write')).toBe(true);
      expect(rbacService.validateAccess(testUser, 'admin', 'read')).toBe(false);
    });
  });

  describe('getRoleHierarchy', () => {
    it('should return correct hierarchy for admin role', () => {
      const hierarchy = rbacService.getRoleHierarchy('admin');
      expect(hierarchy).toContain('admin');
      expect(hierarchy).toContain('moderator');
      expect(hierarchy).toContain('user');
      expect(hierarchy).toContain('viewer');
    });

    it('should return correct hierarchy for user role', () => {
      const hierarchy = rbacService.getRoleHierarchy('user');
      expect(hierarchy).toContain('user');
      expect(hierarchy).toContain('viewer');
      expect(hierarchy).not.toContain('admin');
      expect(hierarchy).not.toContain('moderator');
    });

    it('should return only itself for viewer role', () => {
      const hierarchy = rbacService.getRoleHierarchy('viewer');
      expect(hierarchy).toEqual(['viewer']);
    });
  });

  describe('roleInheritsFrom', () => {
    it('should correctly identify role inheritance', () => {
      expect(rbacService.roleInheritsFrom('admin', 'moderator')).toBe(true);
      expect(rbacService.roleInheritsFrom('admin', 'user')).toBe(true);
      expect(rbacService.roleInheritsFrom('admin', 'viewer')).toBe(true);
      expect(rbacService.roleInheritsFrom('user', 'viewer')).toBe(true);
      expect(rbacService.roleInheritsFrom('viewer', 'user')).toBe(false);
    });

    it('should return true for same role', () => {
      expect(rbacService.roleInheritsFrom('admin', 'admin')).toBe(true);
    });
  });

  describe('getRoleDefinition', () => {
    it('should return role definition with computed permissions', () => {
      const roleDefinition = rbacService.getRoleDefinition('admin');
      
      expect(roleDefinition.id).toBe('admin');
      expect(roleDefinition.name).toBe('Administrator');
      expect(roleDefinition.computedPermissions).toContain('admin:read');
      expect(roleDefinition.computedPermissions).toContain('user:read');
      expect(roleDefinition.computedPermissions).toContain('profile:read');
    });
  });
});

describe('RBACServiceFactory', () => {
  it('should create service with default configurations', () => {
    const service = RBACServiceFactory.create();
    expect(service).toBeInstanceOf(RBACService);
  });

  it('should create service with custom roles', () => {
    const customRoles = {
      ...ROLE_DEFINITIONS,
      customRole: {
        id: 'customRole' as UserRole,
        name: 'Custom Role',
        description: 'Custom test role',
        permissions: ['user:read'] as Permission[],
      },
    };

    const service = RBACServiceFactory.create(customRoles);
    expect(service).toBeInstanceOf(RBACService);
  });

  it('should create service with policies', () => {
    const policies: PolicyRule[] = [
      {
        id: 'test-policy',
        name: 'Test Policy',
        description: 'Test policy description',
        resource: 'test',
        actions: ['read'],
        effect: 'allow',
      },
    ];

    const service = RBACServiceFactory.createWithPolicies(policies);
    expect(service).toBeInstanceOf(RBACService);
  });
});

describe('Role Definitions', () => {
  it('should have all required roles defined', () => {
    expect(ROLE_DEFINITIONS.viewer).toBeDefined();
    expect(ROLE_DEFINITIONS.user).toBeDefined();
    expect(ROLE_DEFINITIONS.moderator).toBeDefined();
    expect(ROLE_DEFINITIONS.admin).toBeDefined();
  });

  it('should have correct role inheritance structure', () => {
    expect(ROLE_DEFINITIONS.user.inherits).toContain('viewer');
    expect(ROLE_DEFINITIONS.moderator.inherits).toContain('user');
    expect(ROLE_DEFINITIONS.admin.inherits).toContain('moderator');
  });

  it('should have proper permission escalation', () => {
    const viewerPermissions = ROLE_DEFINITIONS.viewer.permissions;
    const userPermissions = ROLE_DEFINITIONS.user.permissions;
    const moderatorPermissions = ROLE_DEFINITIONS.moderator.permissions;
    const adminPermissions = ROLE_DEFINITIONS.admin.permissions;

    // Admin should have the most permissions
    expect(adminPermissions.length).toBeGreaterThan(moderatorPermissions.length);
    expect(moderatorPermissions.length).toBeGreaterThan(userPermissions.length);
    expect(userPermissions.length).toBeGreaterThan(viewerPermissions.length);
  });
});