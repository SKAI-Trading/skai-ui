import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Standard layout heights used across SKAI applications
 * These should be used for consistent viewport calculations
 */
export const LAYOUT_HEIGHTS = {
  /** Header height: 56px (h-14) */
  header: 56,
  /** Bottom ticker/dock bar height: 48px (h-12) */
  bottomBar: 48,
  /** Mobile bottom nav height: 64px (h-16) */
  mobileNav: 64,
  /** Total header + bottom bar: 104px */
  total: 104,
} as const;

/**
 * CSS class for full-height content (accounting for header + bottom bar)
 * Use this for trading pages and other full-viewport layouts
 */
export const FULL_HEIGHT_CLASS = `h-[calc(100vh-${LAYOUT_HEIGHTS.total}px)]`;

// =============================================================================
// APP SHELL CONTEXT
// =============================================================================

type AppShellContextValue = {
  /** Whether the sidebar is open (desktop) */
  sidebarOpen: boolean;
  /** Toggle sidebar state */
  toggleSidebar: () => void;
  /** Whether mobile menu is open */
  mobileMenuOpen: boolean;
  /** Set mobile menu state */
  setMobileMenuOpen: (open: boolean) => void;
  /** Current breakpoint */
  isMobile: boolean;
  /** Whether to show bottom bar */
  showBottomBar: boolean;
};

const AppShellContext = React.createContext<AppShellContextValue | null>(null);

/**
 * Hook to access AppShell context
 * Must be used within an AppShell component
 */
export function useAppShell() {
  const context = React.useContext(AppShellContext);
  if (!context) {
    throw new Error("useAppShell must be used within an AppShell component");
  }
  return context;
}

// =============================================================================
// APP SHELL VARIANTS
// =============================================================================

const appShellVariants = cva("min-h-screen flex flex-col", {
  variants: {
    /** Layout variant */
    variant: {
      /** Standard layout with header, content, footer */
      default: "",
      /** Full-height layout for trading pages (no footer, fixed viewport) */
      trading: "",
      /** Dashboard with sidebar */
      dashboard: "",
      /** Centered content (auth, landing) */
      centered: "items-center justify-center",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// =============================================================================
// APP SHELL COMPONENT
// =============================================================================

export interface AppShellProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appShellVariants> {
  /** Header slot */
  header?: React.ReactNode;
  /** Footer slot */
  footer?: React.ReactNode;
  /** Sidebar slot (for dashboard variant) */
  sidebar?: React.ReactNode;
  /** Bottom bar slot (ticker, dock) */
  bottomBar?: React.ReactNode;
  /** Whether to disable default padding (for full-height layouts) */
  noPadding?: boolean;
  /** Whether to show the bottom bar */
  showBottomBar?: boolean;
  /** Default sidebar state */
  defaultSidebarOpen?: boolean;
  /** Controlled sidebar state */
  sidebarOpen?: boolean;
  /** Callback when sidebar state changes */
  onSidebarChange?: (open: boolean) => void;
}

/**
 * AppShell - Main application layout wrapper
 *
 * Provides consistent layout structure across all SKAI applications.
 * Handles header, footer, sidebar, and bottom bar slots with proper
 * spacing and responsive behavior.
 *
 * @example
 * ```tsx
 * <AppShell
 *   header={<AppHeader />}
 *   footer={<AppFooter />}
 *   bottomBar={<DockBar />}
 * >
 *   <PageContent />
 * </AppShell>
 * ```
 *
 * @example Trading layout (full viewport)
 * ```tsx
 * <AppShell
 *   variant="trading"
 *   header={<AppHeader />}
 *   bottomBar={<DockBar />}
 *   noPadding
 * >
 *   <TradingPanel />
 * </AppShell>
 * ```
 */
const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      className,
      variant,
      header,
      footer,
      sidebar,
      bottomBar,
      noPadding = false,
      showBottomBar = true,
      defaultSidebarOpen = true,
      sidebarOpen: sidebarOpenProp,
      onSidebarChange,
      children,
      ...props
    },
    ref,
  ) => {
    // Mobile detection
    const [isMobile, setIsMobile] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    // Sidebar state (controlled or uncontrolled)
    const [_sidebarOpen, _setSidebarOpen] = React.useState(defaultSidebarOpen);
    const sidebarOpen = sidebarOpenProp ?? _sidebarOpen;
    const setSidebarOpen = React.useCallback(
      (open: boolean) => {
        if (onSidebarChange) {
          onSidebarChange(open);
        } else {
          _setSidebarOpen(open);
        }
      },
      [onSidebarChange],
    );

    const toggleSidebar = React.useCallback(() => {
      setSidebarOpen(!sidebarOpen);
    }, [sidebarOpen, setSidebarOpen]);

    // Mobile detection effect
    React.useEffect(() => {
      const mql = window.matchMedia("(max-width: 768px)");
      const onChange = () => setIsMobile(mql.matches);
      mql.addEventListener("change", onChange);
      setIsMobile(mql.matches);
      return () => mql.removeEventListener("change", onChange);
    }, []);

    // Context value
    const contextValue = React.useMemo<AppShellContextValue>(
      () => ({
        sidebarOpen,
        toggleSidebar,
        mobileMenuOpen,
        setMobileMenuOpen,
        isMobile,
        showBottomBar,
      }),
      [sidebarOpen, toggleSidebar, mobileMenuOpen, isMobile, showBottomBar],
    );

    // Calculate main content padding
    const mainPadding = noPadding ? "" : showBottomBar ? "pb-20 md:pb-12" : "";

    // Calculate min-height for main content
    const mainMinHeight =
      variant === "trading" ? "" : "min-h-[calc(100vh-56px)]";

    return (
      <AppShellContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(appShellVariants({ variant }), className)}
          {...props}
        >
          {/* Header */}
          {header}

          {/* Main content area */}
          {variant === "dashboard" && sidebar ? (
            // Dashboard layout with sidebar
            <div className="flex flex-1">
              {/* Sidebar */}
              <aside
                className={cn(
                  "hidden md:flex flex-col border-r border-border bg-background transition-all duration-300",
                  sidebarOpen ? "w-64" : "w-16",
                )}
              >
                {sidebar}
              </aside>

              {/* Main content */}
              <main className={cn("flex-1", mainMinHeight, mainPadding)}>
                {children}
              </main>
            </div>
          ) : (
            // Standard/trading layout
            <main className={cn("flex-1", mainMinHeight, mainPadding)}>
              {children}
            </main>
          )}

          {/* Footer (not shown in trading variant) */}
          {variant !== "trading" && footer}

          {/* Bottom bar (ticker, dock) */}
          {showBottomBar && bottomBar}
        </div>
      </AppShellContext.Provider>
    );
  },
);

AppShell.displayName = "AppShell";

// =============================================================================
// APP SHELL MAIN CONTENT
// =============================================================================

export interface AppShellContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use full viewport height (for trading pages) */
  fullHeight?: boolean;
  /** Center content horizontally */
  centered?: boolean;
  /** Maximum width constraint */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
  none: "",
};

/**
 * AppShellContent - Main content wrapper within AppShell
 *
 * Provides consistent content area with optional constraints.
 *
 * @example
 * ```tsx
 * <AppShell>
 *   <AppShellContent maxWidth="xl" centered>
 *     <PageContent />
 *   </AppShellContent>
 * </AppShell>
 * ```
 */
const AppShellContent = React.forwardRef<HTMLDivElement, AppShellContentProps>(
  (
    {
      className,
      fullHeight = false,
      centered = false,
      maxWidth = "none",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          fullHeight && FULL_HEIGHT_CLASS,
          centered && "mx-auto",
          maxWidthClasses[maxWidth],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

AppShellContent.displayName = "AppShellContent";

// =============================================================================
// EXPORTS
// =============================================================================

export { AppShell, AppShellContent, appShellVariants };
