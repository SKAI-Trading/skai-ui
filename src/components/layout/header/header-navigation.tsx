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
import { SkaiIcon, type SkaiIconName } from "../../branding/skai-icon";
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
    end?: boolean;
    className?: string | ((props: { isActive: boolean }) => string);
    children: React.ReactNode;
    "data-quest-target"?: string;
  }>;
  /** Route path */
  to: string;
  /** Only match exact path (for NavLink `end` prop) */
  end?: boolean;
  /** Quest target ID for tutorials */
  questTarget?: string;
}

/**
 * HeaderNavLink - Individual navigation link
 */
const HeaderNavLink = React.forwardRef<HTMLAnchorElement, HeaderNavLinkProps>(
  ({ className, active, LinkComponent, to, end, questTarget, children, ...props }, ref) => {
    const baseClasses = cn(
      "px-3 py-1.5 text-sm font-medium transition-colors flex items-center whitespace-nowrap",
      "hover:text-primary",
      active
        ? "text-primary"
        : "text-white",
      className
    );

    if (LinkComponent) {
      return (
        <LinkComponent
          to={to}
          end={end}
          className={({ isActive }: { isActive: boolean }) => cn(
            "px-3 py-1.5 text-sm font-medium transition-colors flex items-center whitespace-nowrap",
            "hover:text-primary",
            isActive
              ? "text-primary"
              : "text-white",
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
    timeoutRef.current = setTimeout(() => setOpen(false), 300);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(v) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(v);
      }}
      modal={false}
    >
      <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            className={cn(
              "px-0 py-3 text-base font-normal transition-colors rounded-md flex items-center whitespace-nowrap gap-1.5",
              "hover:text-primary",
              open ? "text-primary" : "text-white"
            )}
            style={{ letterSpacing: "-0.64px" }}
          >
            {label}
            <svg
              className="w-4 h-4 opacity-70"
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
        sideOffset={2}
        className="w-[200px] bg-[#122524] border-[#123f3c] rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.24)] p-4 gap-4 flex flex-col"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onCloseAutoFocus={(e) => e.preventDefault()}
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
            className="cursor-pointer flex items-center gap-2 w-full px-0 py-0 font-manrope text-base leading-[22px] tracking-[-0.64px] text-white hover:text-primary focus:text-primary hover:bg-transparent focus:bg-transparent"
          >
            {icon && <span>{icon}</span>}
            <span>{itemLabel}</span>
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
// NAV RICH DROPDOWN (Trade dropdown - Figma node 1362:1813)
// =============================================================================

export interface HeaderNavRichDropdownProps {
  /** Dropdown trigger label */
  label: string;
  /** Nav items with iconName + description */
  items: HeaderNavItemConfig[];
  /** Navigation handler */
  onNavigate?: (to: string) => void;
}

/**
 * HeaderNavRichDropdown - Dropdown with icon + title + description items
 * Matches Figma Trade dropdown: bg-[#122524], w-[300px], rounded-xl
 */
const HeaderNavRichDropdown: React.FC<HeaderNavRichDropdownProps> = ({
  label,
  items,
  onNavigate,
}) => {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 300);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(v) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(v);
      }}
      modal={false}
    >
      <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            className={cn(
              "px-0 py-3 text-base font-normal transition-colors rounded-md flex items-center whitespace-nowrap gap-1.5",
              "hover:text-primary",
              open ? "text-primary" : "text-white"
            )}
            style={{ letterSpacing: "-0.64px" }}
          >
            {label}
            <svg
              className="w-4 h-4 opacity-70"
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
        sideOffset={2}
        className="w-[300px] bg-[#122524] border-[#123f3c] rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.24)] pl-4 pr-8 py-4 gap-6 flex flex-col"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {items.map(({ to, label: itemLabel, iconName, description }) => (
          <DropdownMenuItem
            key={to}
            onSelect={() => {
              setOpen(false);
              if (onNavigate) {
                onNavigate(to);
              }
            }}
            className="cursor-pointer flex gap-2 items-start w-full px-0 py-0 hover:bg-transparent focus:bg-transparent"
          >
            {iconName && (
              <SkaiIcon
                name={iconName as SkaiIconName}
                className="w-6 h-6 text-[#56C7F3] shrink-0"
              />
            )}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-manrope text-base leading-[22px] tracking-[-0.64px] text-white">
                {itemLabel}
              </span>
              {description && (
                <span className="font-manrope text-xs leading-4 tracking-[-0.48px] text-white/64">
                  {description}
                </span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

HeaderNavRichDropdown.displayName = "HeaderNavRichDropdown";

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

export { HeaderNavLink, HeaderNavDropdown, HeaderNavRichDropdown, HeaderNavigation };
