import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { LAYOUT_HEIGHTS } from "../layout/app-shell";

// =============================================================================
// DOCK BAR VARIANTS
// =============================================================================

const dockBarVariants = cva(
  "fixed bottom-0 left-0 right-0 z-[100] flex items-center border-t",
  {
    variants: {
      /** Visual style variant */
      variant: {
        /** Default with blur */
        default:
          "border-border/50 bg-background/95 backdrop-blur shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.3)]",
        /** Solid background */
        solid: "border-border bg-background",
        /** Glass effect */
        glass:
          "border-white/5 bg-background/80 backdrop-blur-xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.5)]",
        /** Transparent */
        transparent: "border-transparent bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// =============================================================================
// DOCK BAR COMPONENT
// =============================================================================

export interface DockBarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dockBarVariants> {
  /** Ticker tape content (scrolling prices) - left side */
  ticker?: React.ReactNode;
  /** Dock icons/actions - right side */
  dock?: React.ReactNode;
  /** Center content */
  center?: React.ReactNode;
  /** Whether ticker should be full width */
  fullWidthTicker?: boolean;
  /** Safe area padding for iOS */
  safeArea?: boolean;
}

/**
 * DockBar - Bottom bar with ticker tape and dock icons
 *
 * Combines scrolling price ticker with quick-action dock icons.
 * Used across SKAI applications for persistent bottom navigation.
 *
 * @example Basic usage
 * ```tsx
 * <DockBar
 *   ticker={<TickerTape items={prices} />}
 *   dock={
 *     <>
 *       <DockBarIcon icon={<MessageSquare />} label="Chat" />
 *       <DockBarIcon icon={<Settings />} label="Settings" />
 *     </>
 *   }
 * />
 * ```
 *
 * @example Glass variant
 * ```tsx
 * <DockBar
 *   variant="glass"
 *   ticker={<TickerTape items={prices} speed="fast" />}
 *   dock={<QuickActions />}
 *   safeArea
 * />
 * ```
 */
const DockBar = React.forwardRef<HTMLDivElement, DockBarProps>(
  (
    {
      className,
      variant,
      ticker,
      dock,
      center,
      fullWidthTicker = false,
      safeArea = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          dockBarVariants({ variant }),
          safeArea && "safe-bottom",
          className,
        )}
        style={
          {
            "--dock-bar-height": `${LAYOUT_HEIGHTS.bottomBar}px`,
            height: `${LAYOUT_HEIGHTS.bottomBar}px`,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Ticker section */}
        {ticker && (
          <div
            className={cn(
              "flex-1 overflow-hidden",
              fullWidthTicker ? "" : "max-w-[70%]",
            )}
          >
            {ticker}
          </div>
        )}

        {/* Center content */}
        {center && (
          <div className="flex items-center justify-center px-4">{center}</div>
        )}

        {/* Dock section */}
        {dock && (
          <div className="flex items-center gap-1 px-2 shrink-0">{dock}</div>
        )}

        {/* Additional children */}
        {children}
      </div>
    );
  },
);

DockBar.displayName = "DockBar";

// =============================================================================
// DOCK BAR ICON
// =============================================================================

export interface DockBarIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon to display */
  icon: React.ReactNode;
  /** Label (shown on hover/tooltip) */
  label: string;
  /** Whether the icon is active */
  active?: boolean;
  /** Badge content */
  badge?: string | number;
  /** Badge color variant */
  badgeVariant?: "default" | "primary" | "destructive" | "warning";
  /** Size variant */
  size?: "sm" | "default" | "lg";
}

const iconSizeClasses = {
  sm: "h-7 w-7",
  default: "h-8 w-8",
  lg: "h-10 w-10",
};

const badgeVariantClasses = {
  default: "bg-muted-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  warning: "bg-yellow-500 text-yellow-950",
};

/**
 * DockBarIcon - Clickable icon for the dock bar
 *
 * @example
 * ```tsx
 * <DockBarIcon
 *   icon={<MessageSquare className="w-5 h-5" />}
 *   label="Messages"
 *   badge={3}
 *   onClick={() => openChat()}
 * />
 * ```
 */
const DockBarIcon = React.forwardRef<HTMLButtonElement, DockBarIconProps>(
  (
    {
      className,
      icon,
      label,
      active,
      badge,
      badgeVariant = "default",
      size = "default",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "relative flex items-center justify-center rounded-lg transition-all",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          iconSizeClasses[size],
          active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          className,
        )}
        title={label}
        aria-label={label}
        {...props}
      >
        {icon}
        {badge !== undefined && (
          <span
            className={cn(
              "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
              badgeVariantClasses[badgeVariant],
            )}
          >
            {badge}
          </span>
        )}
      </button>
    );
  },
);

DockBarIcon.displayName = "DockBarIcon";

// =============================================================================
// DOCK BAR SEPARATOR
// =============================================================================

export interface DockBarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * DockBarSeparator - Visual separator between dock icons
 */
const DockBarSeparator = React.forwardRef<
  HTMLDivElement,
  DockBarSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("h-6 w-px bg-border/50 mx-1", className)}
      aria-hidden="true"
      {...props}
    />
  );
});

DockBarSeparator.displayName = "DockBarSeparator";

// =============================================================================
// DOCK BAR SPACER
// =============================================================================

export interface DockBarSpacerProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * DockBarSpacer - Adds bottom padding to account for DockBar
 *
 * Use this at the bottom of scrollable content to prevent
 * the last items from being hidden behind the dock bar.
 */
const DockBarSpacer = React.forwardRef<HTMLDivElement, DockBarSpacerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{ height: `${LAYOUT_HEIGHTS.bottomBar}px` }}
        aria-hidden="true"
        {...props}
      />
    );
  },
);

DockBarSpacer.displayName = "DockBarSpacer";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  DockBar,
  DockBarIcon,
  DockBarSeparator,
  DockBarSpacer,
  dockBarVariants,
};
