// Enhanced Role Management Component for Admin Panel
'use client';

import React, { useState } from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { rbacService, ROLE_DEFINITIONS } from '@/services/rbac.service';
import { UserRole, Permission } from '@/types/rbac';

interface RoleManagementProps {
  className?: string;
}

export function RoleManagement({ className = '' }: RoleManagementProps) {
  const { getUserRoles, getUserPermissions, user } = useRBAC();
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  const currentRoles = getUserRoles();
  const currentPermissions = getUserPermissions();

  // Get role definition with computed permissions
  const roleDefinition = rbacService.getRoleDefinition(selectedRole);
  const roleHierarchy = rbacService.getRoleHierarchy(selectedRole);

  return (
    <RoleGuard 
      requiredPermissions={['admin:read', 'user:read']}
      fallback={
        <div className="text-center p-6">
          <p className="text-red-600">Access denied: Admin permissions required</p>
        </div>
      }
    >
      <div className={`space-y-6 ${className}`}>
        {/* Current User Role Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Current User: {user?.name || user?.email}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Assigned Roles</h4>
              <div className="space-y-2">
                {currentRoles.map((role) => (
                  <div
                    key={role}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 mr-2 mb-2"
                  >
                    {ROLE_DEFINITIONS[role].name}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Effective Permissions ({currentPermissions.length})
              </h4>
              <div className="max-h-32 overflow-y-auto">
                <div className="space-y-1">
                  {currentPermissions.map((permission) => (
                    <div
                      key={permission}
                      className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded"
                    >
                      {permission}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Explorer */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Role Explorer & Hierarchy
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role to Explore
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => (
                  <option key={key} value={key}>
                    {role.name} - {role.description}
                  </option>
                ))}
              </select>

              {/* Role Details */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  {roleDefinition.name}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {roleDefinition.description}
                </p>

                {/* Role Hierarchy */}
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Hierarchy:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    {roleHierarchy.map((role, index) => (
                      <React.Fragment key={role}>
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            role === selectedRole
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {ROLE_DEFINITIONS[role].name}
                        </span>
                        {index < roleHierarchy.length - 1 && (
                          <span className="text-gray-400">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Direct Permissions */}
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Direct Permissions ({roleDefinition.permissions.length}):
                  </span>
                  <div className="mt-1 space-y-1">
                    {roleDefinition.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="text-xs text-gray-600 bg-white px-2 py-1 rounded border"
                      >
                        {permission}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Computed Permissions */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                All Permissions (Including Inherited)
              </h4>
              <div className="p-4 bg-green-50 rounded-lg max-h-80 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {roleDefinition.computedPermissions.map((permission) => {
                    const isDirect = roleDefinition.permissions.includes(permission);
                    return (
                      <div
                        key={permission}
                        className={`text-sm px-3 py-2 rounded ${
                          isDirect
                            ? 'bg-green-200 text-green-800 font-medium'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {permission}
                        {isDirect && <span className="ml-2 text-xs">(direct)</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total: {roleDefinition.computedPermissions.length} permissions
              </p>
            </div>
          </div>
        </div>

        {/* Role Comparison Matrix */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Role Comparison Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inherits From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Can Access Admin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => {
                  const computedRole = rbacService.getRoleDefinition(key as UserRole);
                  const canAccessAdmin = computedRole.computedPermissions.some(p => 
                    p.startsWith('admin:')
                  );

                  return (
                    <tr key={key} className={selectedRole === key ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {role.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {role.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {role.inherits?.join(', ') || 'None'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {computedRole.computedPermissions.length}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            canAccessAdmin
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {canAccessAdmin ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permission Testing */}
        <RoleGuard 
          requiredPermissions={['admin:write']}
          fallback={
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Enhanced role management features require admin:write permission
              </p>
            </div>
          }
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Permission Testing Tool
            </h3>
            <p className="text-sm text-gray-600">
              This section would contain tools for testing and modifying user permissions.
              Available to users with admin:write permission.
            </p>
          </div>
        </RoleGuard>
      </div>
    </RoleGuard>
  );
}