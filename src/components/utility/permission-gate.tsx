import React from "react";

/**
 * Permission level for admin pages
 */
export type PermissionLevel = "none" | "read" | "write";

/**
 * Permissions map keyed by page/feature ID
 */
export interface PermissionsMap {
  [key: string]: PermissionLevel | boolean | string;
}

/**
 * Resolves a permission value to a PermissionLevel, handling legacy boolean
 * and string formats from JSONB storage.
 */
function resolvePermission(
  value: PermissionLevel | boolean | string | undefined | null
): PermissionLevel {
  if (value === null || value === undefined || value === "none") return "none";
  if (typeof value === "boolean") return value ? "write" : "none";
  if (value === "true") return "write";
  if (value === "false") return "none";
  if (value === "read" || value === "write") return value;
  return "none";
}

/**
 * Check if a permission value meets or exceeds the required level.
 */
function meetsPermissionLevel(
  actual: PermissionLevel,
  required: PermissionLevel
): boolean {
  if (required === "none") return true;
  if (required === "read") return actual === "read" || actual === "write";
  if (required === "write") return actual === "write";
  return false;
}

// ============================================================================
// PermissionGate Component
// ============================================================================

export interface PermissionGateProps {
  /** The page or feature ID to check permissions for */
  pageId: string;
  /** The permissions map (from admin role / useAdmin hook) */
  permissions?: PermissionsMap | null;
  /** The minimum required permission level. Default: "read" */
  requiredLevel?: PermissionLevel;
  /** The admin role name. "super_admin" bypasses all checks. */
  role?: string | null;
  /** Content to render when permission is granted */
  children: React.ReactNode;
  /** Optional fallback content when permission is denied */
  fallback?: React.ReactNode;
}

/**
 * PermissionGate - Conditionally renders children based on admin permissions.
 *
 * Use this component to wrap UI elements that should only be visible to admins
 * with the appropriate permission level for a given page/feature.
 *
 * @example
 * ```tsx
 * // Only show delete button for users with write access to "users" page
 * <PermissionGate
 *   pageId="users"
 *   permissions={permissions?.pagePermissions}
 *   role={permissions?.role}
 *   requiredLevel="write"
 * >
 *   <Button variant="destructive">Delete User</Button>
 * </PermissionGate>
 *
 * // Show different content for read-only users
 * <PermissionGate
 *   pageId="users"
 *   permissions={permissions?.pagePermissions}
 *   role={permissions?.role}
 *   requiredLevel="write"
 *   fallback={<span className="text-muted-foreground">Read-only access</span>}
 * >
 *   <Button>Save Changes</Button>
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  pageId,
  permissions,
  requiredLevel = "read",
  role,
  children,
  fallback = null,
}: PermissionGateProps): React.ReactElement | null {
  // Super admins always have access
  if (role === "super_admin") {
    return <>{children}</>;
  }

  // No permissions map = no access (unless super_admin already handled above)
  if (!permissions) {
    return <>{fallback}</>;
  }

  const rawPermission = permissions[pageId];
  const resolved = resolvePermission(rawPermission);

  if (meetsPermissionLevel(resolved, requiredLevel)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

// ============================================================================
// usePermission Hook
// ============================================================================

/**
 * Hook for checking permissions imperatively (for logic, not rendering).
 *
 * @example
 * ```tsx
 * const { canRead, canWrite } = usePermission("users", permissions, role);
 * if (canWrite) {
 *   await deleteUser(userId);
 * }
 * ```
 */
export function usePermission(
  pageId: string,
  permissions?: PermissionsMap | null,
  role?: string | null
): {
  canRead: boolean;
  canWrite: boolean;
  permissionLevel: PermissionLevel;
} {
  // Super admins always have full access
  if (role === "super_admin") {
    return { canRead: true, canWrite: true, permissionLevel: "write" };
  }

  if (!permissions) {
    return { canRead: false, canWrite: false, permissionLevel: "none" };
  }

  const resolved = resolvePermission(permissions[pageId]);

  return {
    canRead: meetsPermissionLevel(resolved, "read"),
    canWrite: meetsPermissionLevel(resolved, "write"),
    permissionLevel: resolved,
  };
}

export default PermissionGate;
