/**
 * ONDE DORMIR MOÇAMBIQUE - Role-Based Access Control (RBAC) Specification
 * Powered by Águia Soluções & Serviços - Conexões Rápidas, SU, LDA
 */

export type UserRole = 'USER' | 'OWNER' | 'ADMIN' | 'SUPER_ADMIN' | 'PLATFORM_OWNER';

export type Permission =
  // Public & Consumer
  | 'property:search'
  | 'property:view'
  | 'property:favorite'
  | 'property:contact'
  | 'property:report'
  
  // Owner Operations (Scoped strictly to own resources)
  | 'property:create'
  | 'property:edit_own'
  | 'property:delete_own'
  | 'property:manage_photos_own'
  | 'property:manage_rooms_own'
  | 'property:manage_prices_own'
  | 'property:view_stats_own'
  
  // Fleet Owner (Rent-A-Car)
  | 'vehicle:create'
  | 'vehicle:edit_own'
  | 'vehicle:delete_own'
  | 'vehicle:view_rentals_own'
  
  // Admin Operations
  | 'admin:moderate'
  | 'admin:approve'
  | 'admin:suspend'
  | 'admin:verify'
  | 'admin:manage_reports'
  | 'admin:manage_premium'
  | 'admin:view_audit_logs'
  
  // Super Admin Operations
  | 'super_admin:manage_admins'
  | 'super_admin:system_config'
  | 'super_admin:export_audit_logs'
  | 'super_admin:emergency_override'
  
  // Platform Owner Private Business Governance
  | 'platform_owner:view_business_metrics'
  | 'platform_owner:manage_platform';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  USER: [
    'property:search',
    'property:view',
    'property:favorite',
    'property:contact',
    'property:report',
  ],
  OWNER: [
    'property:search',
    'property:view',
    'property:favorite',
    'property:contact',
    'property:report',
    'property:create',
    'property:edit_own',
    'property:delete_own',
    'property:manage_photos_own',
    'property:manage_rooms_own',
    'property:manage_prices_own',
    'property:view_stats_own',
    'vehicle:create',
    'vehicle:edit_own',
    'vehicle:delete_own',
    'vehicle:view_rentals_own',
  ],
  ADMIN: [
    'property:search',
    'property:view',
    'property:favorite',
    'property:contact',
    'property:report',
    'admin:moderate',
    'admin:approve',
    'admin:suspend',
    'admin:verify',
    'admin:manage_reports',
    'admin:manage_premium',
    'admin:view_audit_logs',
  ],
  SUPER_ADMIN: [
    'property:search',
    'property:view',
    'property:favorite',
    'property:contact',
    'property:report',
    'admin:moderate',
    'admin:approve',
    'admin:suspend',
    'admin:verify',
    'admin:manage_reports',
    'admin:manage_premium',
    'admin:view_audit_logs',
    'super_admin:manage_admins',
    'super_admin:system_config',
    'super_admin:export_audit_logs',
    'super_admin:emergency_override',
  ],
  PLATFORM_OWNER: [
    'property:search',
    'property:view',
    'property:favorite',
    'property:contact',
    'property:report',
    'admin:moderate',
    'admin:approve',
    'admin:suspend',
    'admin:verify',
    'admin:manage_reports',
    'admin:manage_premium',
    'admin:view_audit_logs',
    'super_admin:manage_admins',
    'super_admin:system_config',
    'super_admin:export_audit_logs',
    'super_admin:emergency_override',
    'platform_owner:view_business_metrics',
    'platform_owner:manage_platform',
  ],
};

/**
 * Validates if a user role has a specific permission.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Validates resource ownership to prevent horizontal privilege escalation.
 */
export function canManageResource(
  userRole: UserRole,
  userId: string,
  resourceOwnerId: string
): boolean {
  if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
    return true;
  }
  return userId === resourceOwnerId;
}
