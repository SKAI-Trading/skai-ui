import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { LAYOUT_HEIGHTS } from "./app-shell";

// =============================================================================
// MOBILE NAV VARIANTS
// =============================================================================

const mobileNavVariants = cva(
  "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t md:hidden",
  {
    variants: {
      /** Visual style variant */
      variant: {
        /** Default with solid background */
        default: "border-border bg-background",
        /** Glass effect */
        glass: "border-white/10 bg-background/80 backdrop-blur-xl",
        /** Floating style with rounded corners */
        floating: "mx-4 mb-4 rounded-2xl border-border bg-background shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// =============================================================================
// MOBILE NAV COMPONENT
// =============================================================================

export interface MobileNavItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon: React.ReactNode;
  /** Active icon (optional, uses icon if not provided) */
  activeIcon?: React.ReactNode;
  /** Link href */
  href?: string;
  /** Click handler (for non-link items) */
  onClick?: () => void;
  /** Badge content */
  badge?: string | number;
  /** Whether to show badge as dot only */
  badgeDot?: boolean;
}

export interface MobileNavProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof mobileNavVariants> {
  /** Navigation items */
  items: MobileNavItem[];
  /** Currently active item ID */
  activeItem?: string;
  /** Callback when an item is selected */
  onItemSelect?: (item: MobileNavItem) => void;
  /** Custom link component (for router integration) */
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
  }>;
  /** Safe area padding for iOS */
  safeArea?: boolean;
}

/**
 * MobileNav - Bottom navigation bar for mobile devices
 *
 * Fixed to the bottom of the screen on mobile, hidden on desktop.
 * Supports badges, active states, and custom link components.
 *
 * @example Basic usage
 * ```tsx
 * <MobileNav
 *   items={[
 *     { id: "home", label: "Home", icon: <HomeIcon />, href: "/" },
 *     { id: "trade", label: "Trade", icon: <TrendingUpIcon />, href: "/trade" },
 *     { id: "play", label: "Play", icon: <GamepadIcon />, href: "/play" },
 *     { id: "profile", label: "Profile", icon: <UserIcon />, href: "/profile" },
 *   ]}
 *   activeItem="trade"
 * />
 * ```
 *
 * @example With React Router
 * ```tsx
 * import { Link } from "react-router-dom";
 *
 * <MobileNav
 *   items={navItems}
 *   activeItem={location.pathname}
 *   LinkComponent={Link}
 * />
 * ```
 */
const MobileNav = React.forwardRef<HTMLElement, MobileNavProps>(
  (
    {
      className,
      variant,
      items,
      activeItem,
      onItemSelect,
      LinkComponent = DefaultLink,
      safeArea = true,
      ...props
    },
    ref,
  ) => {
    return (
      <nav
        ref={ref}
        className={cn(
          mobileNavVariants({ variant }),
          safeArea && "safe-bottom pb-safe",
          className,
        )}
        style={
          {
            "--mobile-nav-height": `${LAYOUT_HEIGHTS.mobileNav}px`,
            height:
              variant === "floating" ? "auto" : `${LAYOUT_HEIGHTS.mobileNav}px`,
          } as React.CSSProperties
        }
        {...props}
      >
        {items.map((item) => {
          const isActive = activeItem === item.id || activeItem === item.href;
          const Icon =
            isActive && item.activeIcon ? item.activeIcon : item.icon;

          const content = (
            <>
              <span className="relative">
                {Icon}
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground",
                      item.badgeDot
                        ? "h-2 w-2"
                        : "h-4 min-w-4 px-1 text-[10px] font-bold",
                    )}
                  >
                    {!item.badgeDot && item.badge}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium mt-1",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </>
          );

          const baseClasses = cn(
            "flex flex-col items-center justify-center flex-1 py-2 min-h-[56px] transition-colors",
            isActive
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          );

          if (item.href) {
            return (
              <LinkComponent
                key={item.id}
                href={item.href}
                className={baseClasses}
              >
                {content}
              </LinkComponent>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className={baseClasses}
              onClick={() => {
                item.onClick?.();
                onItemSelect?.(item);
              }}
            >
              {content}
            </button>
          );
        })}
      </nav>
    );
  },
);

MobileNav.displayName = "MobileNav";

// Default link component (basic anchor)
const DefaultLink = ({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <a href={href} className={className}>
    {children}
  </a>
);

// =============================================================================
// MOBILE NAV SPACER
// =============================================================================

export interface MobileNavSpacerProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * MobileNavSpacer - Adds bottom padding to account for MobileNav
 *
 * Use this at the bottom of scrollable content to prevent
 * the last items from being hidden behind the mobile nav.
 *
 * @example
 * ```tsx
 * <div className="overflow-auto">
 *   <ContentList />
 *   <MobileNavSpacer />
 * </div>
 * ```
 */
const MobileNavSpacer = React.forwardRef<HTMLDivElement, MobileNavSpacerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("md:hidden", className)}
        style={{ height: `${LAYOUT_HEIGHTS.mobileNav}px` }}
        aria-hidden="true"
        {...props}
      />
    );
  },
);

MobileNavSpacer.displayName = "MobileNavSpacer";

// =============================================================================
// EXPORTS
// =============================================================================

export { MobileNav, MobileNavSpacer, mobileNavVariants };
