/**
 * HeaderNavigation - Desktop navigation with dropdown support
 * 
 * Features:
 * - Individual nav items
 * - Dropdown groups with hover support
 * - Active state indicators
 * - Badge support
 * - Admin-only items
 */

import * as React from "react";
import { cn } from "../../../lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../overlays/dropdown-menu";
import { Badge } from "../../core/badge";
import type { HeaderNavItemConfig, HeaderNavGroupConfig } from "./theme";

// =============================================================================
// NAV LINK ITEM
// =============================================================================

export interface HeaderNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Whether the item is active */
  active?: boolean;
  /** Custom link component (for React Router) */
  LinkComponent?: React.ComponentType<{
    to: string;
    className?: string | ((props: { isActive: boolean }) => string);
    children: React.ReactNode;
    "data-quest-target"?: string;
  }>;
  /** Route path */
  to: string;
  /** Quest target ID for tutorials */
  questTarget?: string;
}

/**
 * HeaderNavLink - Individual navigation link
 */
const HeaderNavLink = React.forwardRef<HTMLAnchorElement, HeaderNavLinkProps>(
  ({ className, active, LinkComponent, to, questTarget, children, ...props }, ref) => {
    const baseClasses = cn(
      "px-3 py-1.5 text-sm font-medium transition-colors rounded-md flex items-center whitespace-nowrap",
      "hover:text-primary",
      active 
        ? "text-primary bg-primary/10" 
        : "text-muted-foreground",
      className
    );

    if (LinkComponent) {
      return (
        <LinkComponent 
          to={to}
          className={({ isActive }: { isActive: boolean }) => cn(
            "px-3 py-1.5 text-sm font-medium transition-colors rounded-md flex items-center whitespace-nowrap",
            "hover:text-primary",
            isActive 
              ? "text-primary bg-primary/10" 
              : "text-muted-foreground",
            className
          )}
          data-quest-target={questTarget}
        >
          {children}
        </LinkComponent>
      );
    }

    return (
      <a 
        ref={ref} 
        href={to} 
        className={baseClasses}
        data-quest-target={questTarget}
        {...props}
      >
        {children}
      </a>
    );
  }
);

HeaderNavLink.displayName = "HeaderNavLink";

// =============================================================================
// NAV DROPDOWN
// =============================================================================

export interface HeaderNavDropdownProps {
  /** Dropdown label */
  label: string;
  /** Nav items in dropdown */
  items: HeaderNavItemConfig[];
  /** Navigation handler (for programmatic navigation) */
  onNavigate?: (to: string) => void;
  /** Show "Soon" badges */
  showBadges?: boolean;
}

/**
 * HeaderNavDropdown - Dropdown menu for nav groups
 */
const HeaderNavDropdown: React.FC<HeaderNavDropdownProps> = ({
  label,
  items,
  onNavigate,
  showBadges = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "px-3 py-1.5 text-sm font-medium transition-colors rounded-md flex items-center whitespace-nowrap gap-1",
              "hover:text-primary",
              open ? "text-primary" : "text-muted-foreground"
            )}
          >
            {label}
            <svg 
              className="w-3 h-3" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent
        align="start"
        className="w-48"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {items.map(({ to, label: itemLabel, icon, badge }) => (
          <DropdownMenuItem
            key={to}
            onSelect={() => {
              setOpen(false);
              if (onNavigate) {
                onNavigate(to);
              }
            }}
            className="cursor-pointer flex items-center gap-2 w-full"
          >
            {icon && <span>{icon}</span>}
            <span className="text-foreground">{itemLabel}</span>
            {(badge || showBadges) && (
              <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                {badge || "Soon"}
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

HeaderNavDropdown.displayName = "HeaderNavDropdown";

// =============================================================================
// FULL NAVIGATION BAR
// =============================================================================

export interface HeaderNavigationProps extends React.HTMLAttributes<HTMLElement> {
  /** Primary navigation items (displayed as individual links) */
  primaryItems?: HeaderNavItemConfig[];
  /** Grouped navigation (displayed as dropdowns) */
  groups?: HeaderNavGroupConfig[];
  /** Custom link component */
  LinkComponent?: React.ComponentType<{
    to: string;
    className?: string | ((props: { isActive: boolean }) => string);
    children: React.ReactNode;
    "data-quest-target"?: string;
  }>;
  /** Navigation handler */
  onNavigate?: (to: string) => void;
  /** Whether user is admin (to show admin-only groups) */
  isAdmin?: boolean;
  /** Quest targets for primary items */
  questTargets?: Record<string, string>;
}

/**
 * HeaderNavigation - Complete desktop navigation bar
 * 
 * @example
 * ```tsx
 * <HeaderNavigation
 *   primaryItems={[
 *     { to: "/ai", label: "AI" },
 *     { to: "/trade", label: "Trade" },
 *   ]}
 *   groups={[
 *     { id: "social", label: "Social", items: [...] },
 *     { id: "admin", label: "Admin", items: [...], adminOnly: true },
 *   ]}
 *   LinkComponent={NavLink}
 *   onNavigate={(to) => navigate(to)}
 *   isAdmin={isAdmin}
 * />
 * ```
 */
const HeaderNavigation = React.forwardRef<HTMLElement, HeaderNavigationProps>(
  ({ 
    className,
    primaryItems = [],
    groups = [],
    LinkComponent,
    onNavigate,
    isAdmin = false,
    questTargets = {},
    ...props 
  }, ref) => {
    return (
      <nav 
        ref={ref}
        className={cn(
          "hidden lg:flex items-center gap-1 h-10 overflow-x-auto scrollbar-hide",
          className
        )}
        {...props}
      >
        {/* Primary nav items */}
        {primaryItems.map(({ to, label }) => (
          <HeaderNavLink
            key={to}
            to={to}
            LinkComponent={LinkComponent}
            questTarget={questTargets[to]}
          >
            {label}
          </HeaderNavLink>
        ))}

        {/* Grouped dropdowns */}
        {groups
          .filter(group => !group.adminOnly || isAdmin)
          .map(({ id, label, items }) => (
            <HeaderNavDropdown
              key={id}
              label={label}
              items={items}
              onNavigate={onNavigate}
              showBadges={id === "comingSoon"}
            />
          ))
        }
      </nav>
    );
  }
);

HeaderNavigation.displayName = "HeaderNavigation";

export { HeaderNavLink, HeaderNavDropdown, HeaderNavigation };
