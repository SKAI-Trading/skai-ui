import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { LAYOUT_HEIGHTS } from "./app-shell";

// =============================================================================
// APP HEADER VARIANTS
// =============================================================================

const appHeaderVariants = cva(
  "sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/95",
  {
    variants: {
      /** Visual style variant */
      variant: {
        /** Default with border and blur */
        default: "border-border bg-background/95",
        /** Transparent (for hero sections) */
        transparent: "border-transparent bg-transparent",
        /** Solid background */
        solid: "border-border bg-background",
        /** Glass morphism effect */
        glass:
          "border-white/5 bg-[#0a0a0f]/80 shadow-[0_1px_15px_rgba(44,236,173,0.02)]",
      },
      /** Size variant */
      size: {
        /** Standard height: 56px (h-14) */
        default: "",
        /** Compact height: 48px (h-12) */
        compact: "",
        /** Large height: 64px (h-16) */
        large: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// =============================================================================
// APP HEADER COMPONENT
// =============================================================================

export interface AppHeaderProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof appHeaderVariants> {
  /** Logo/brand slot (left side) */
  logo?: React.ReactNode;
  /** Primary navigation slot (center or after logo) */
  navigation?: React.ReactNode;
  /** Search slot */
  search?: React.ReactNode;
  /** Right-side actions (wallet, notifications, etc.) */
  actions?: React.ReactNode;
  /** Mobile menu trigger (hamburger icon) */
  mobileMenuTrigger?: React.ReactNode;
  /** Whether navigation is centered */
  centerNav?: boolean;
  /** Container max width */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Safe area for iOS notch */
  safeArea?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

const sizeHeightClasses = {
  default: "h-14", // 56px - matches LAYOUT_HEIGHTS.header
  compact: "h-12", // 48px
  large: "h-16", // 64px
};

/**
 * AppHeader - Application header component
 *
 * Provides consistent header layout with slots for logo, navigation,
 * search, and actions. Fully responsive with mobile menu support.
 *
 * @example Basic usage
 * ```tsx
 * <AppHeader
 *   logo={<Logo />}
 *   navigation={<NavLinks />}
 *   actions={<WalletButton />}
 * />
 * ```
 *
 * @example With glass effect (SKAI style)
 * ```tsx
 * <AppHeader
 *   variant="glass"
 *   logo={<SkaiLogo />}
 *   navigation={<MainNav />}
 *   search={<GlobalSearch />}
 *   actions={
 *     <>
 *       <NotificationBell />
 *       <AccountMenu />
 *     </>
 *   }
 *   safeArea
 * />
 * ```
 */
const AppHeader = React.forwardRef<HTMLElement, AppHeaderProps>(
  (
    {
      className,
      variant,
      size = "default",
      logo,
      navigation,
      search,
      actions,
      mobileMenuTrigger,
      centerNav = false,
      maxWidth = "full",
      safeArea = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <header
        ref={ref}
        className={cn(
          appHeaderVariants({ variant, size }),
          safeArea && "safe-top",
          className,
        )}
        style={
          {
            "--header-height": `${LAYOUT_HEIGHTS.header}px`,
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          className={cn("container mx-auto px-4", maxWidthClasses[maxWidth])}
        >
          {/* Main header row */}
          <div
            className={cn(
              "flex items-center justify-between gap-4",
              sizeHeightClasses[size || "default"],
            )}
          >
            {/* Left section: Logo + Mobile menu */}
            <div className="flex items-center gap-2 shrink-0">
              {mobileMenuTrigger && (
                <div className="md:hidden">{mobileMenuTrigger}</div>
              )}
              {logo}
            </div>

            {/* Center section: Navigation (desktop) */}
            {navigation && (
              <nav
                className={cn(
                  "hidden md:flex items-center gap-1",
                  centerNav ? "flex-1 justify-center" : "",
                )}
              >
                {navigation}
              </nav>
            )}

            {/* Search (if provided) */}
            {search && (
              <div className="hidden sm:flex flex-1 max-w-md mx-4">
                {search}
              </div>
            )}

            {/* Right section: Actions */}
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          </div>

          {/* Additional content (sub-navigation, breadcrumbs, etc.) */}
          {children}
        </div>
      </header>
    );
  },
);

AppHeader.displayName = "AppHeader";

// =============================================================================
// APP HEADER NAV ITEM
// =============================================================================

export interface AppHeaderNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Whether the item is currently active */
  active?: boolean;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Badge content (notifications, etc.) */
  badge?: React.ReactNode;
  /** Use as a button instead of link */
  asButton?: boolean;
  /** Click handler (for button mode) */
  onSelect?: () => void;
}

/**
 * AppHeaderNavItem - Navigation item for AppHeader
 *
 * @example
 * ```tsx
 * <AppHeaderNavItem href="/trade" active icon={<TrendingUp />}>
 *   Trade
 * </AppHeaderNavItem>
 * ```
 */
const AppHeaderNavItem = React.forwardRef<
  HTMLAnchorElement,
  AppHeaderNavItemProps
>(
  (
    { className, active, icon, badge, asButton, onSelect, children, ...props },
    ref,
  ) => {
    const baseClasses = cn(
      "relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      active ? "text-foreground bg-accent" : "text-muted-foreground",
      className,
    );

    const content = (
      <>
        {icon && <span className="w-4 h-4">{icon}</span>}
        {children}
        {badge && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
            {badge}
          </span>
        )}
      </>
    );

    if (asButton) {
      return (
        <button type="button" className={baseClasses} onClick={onSelect}>
          {content}
        </button>
      );
    }

    return (
      <a ref={ref} className={baseClasses} {...props}>
        {content}
      </a>
    );
  },
);

AppHeaderNavItem.displayName = "AppHeaderNavItem";

// =============================================================================
// APP HEADER ACTIONS GROUP
// =============================================================================

export interface AppHeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spacing between items */
  spacing?: "tight" | "normal" | "loose";
}

const spacingClasses = {
  tight: "gap-1",
  normal: "gap-2",
  loose: "gap-4",
};

/**
 * AppHeaderActions - Container for header action items
 */
const AppHeaderActions = React.forwardRef<
  HTMLDivElement,
  AppHeaderActionsProps
>(({ className, spacing = "normal", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center", spacingClasses[spacing], className)}
      {...props}
    >
      {children}
    </div>
  );
});

AppHeaderActions.displayName = "AppHeaderActions";

// =============================================================================
// EXPORTS
// =============================================================================

export { AppHeader, AppHeaderNavItem, AppHeaderActions, appHeaderVariants };
