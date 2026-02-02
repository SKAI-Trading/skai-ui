import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

// =============================================================================
// DASHBOARD LAYOUT VARIANTS
// =============================================================================

const dashboardLayoutVariants = cva("flex min-h-screen w-full", {
  variants: {
    variant: {
      default: "bg-background",
      muted: "bg-muted/30",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// =============================================================================
// TYPES
// =============================================================================

export interface DashboardLayoutProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardLayoutVariants> {
  /** Sidebar content */
  sidebar?: React.ReactNode;
  /** Header content */
  header?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Sidebar collapsed state (controlled) */
  sidebarCollapsed?: boolean;
  /** Sidebar collapse change handler */
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
  /** Default collapsed state (uncontrolled) */
  defaultSidebarCollapsed?: boolean;
  /** Sidebar width when expanded */
  sidebarWidth?: number | string;
  /** Sidebar width when collapsed */
  sidebarCollapsedWidth?: number | string;
  /** Show sidebar toggle button */
  showSidebarToggle?: boolean;
  /** Mobile breakpoint (below this, sidebar becomes overlay) */
  mobileBreakpoint?: number;
}

export interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header slot (logo, branding) */
  header?: React.ReactNode;
  /** Navigation content */
  children: React.ReactNode;
  /** Footer slot (user info, settings) */
  footer?: React.ReactNode;
  /** Collapsed state */
  collapsed?: boolean;
}

export interface DashboardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title?: string;
  /** Page subtitle/description */
  subtitle?: string;
  /** Breadcrumb slot */
  breadcrumb?: React.ReactNode;
  /** Actions slot (buttons, filters) */
  actions?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Max width constraint */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Remove default padding */
  noPadding?: boolean;
}

// =============================================================================
// DASHBOARD SIDEBAR COMPONENT
// =============================================================================

/**
 * DashboardSidebar - Sidebar container with header/footer slots
 */
const DashboardSidebar = React.forwardRef<
  HTMLDivElement,
  DashboardSidebarProps
>(
  (
    { header, children, footer, collapsed = false, className, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col h-full bg-card border-r border-border",
          className,
        )}
        {...props}
      >
        {/* Sidebar Header */}
        {header && (
          <div
            className={cn(
              "shrink-0 border-b border-border",
              collapsed ? "p-2" : "p-4",
            )}
          >
            {header}
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav
          className={cn("flex-1 overflow-y-auto", collapsed ? "p-2" : "p-3")}
        >
          {children}
        </nav>

        {/* Sidebar Footer */}
        {footer && (
          <div
            className={cn(
              "shrink-0 border-t border-border",
              collapsed ? "p-2" : "p-3",
            )}
          >
            {footer}
          </div>
        )}
      </div>
    );
  },
);
DashboardSidebar.displayName = "DashboardSidebar";

// =============================================================================
// DASHBOARD CONTENT COMPONENT
// =============================================================================

/**
 * DashboardContent - Main content area with title, breadcrumb, actions
 */
const DashboardContent = React.forwardRef<
  HTMLDivElement,
  DashboardContentProps
>(
  (
    {
      title,
      subtitle,
      breadcrumb,
      actions,
      children,
      maxWidth = "full",
      noPadding = false,
      className,
      ...props
    },
    ref,
  ) => {
    const maxWidthClasses = {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 flex flex-col min-h-0",
          !noPadding && "p-6",
          className,
        )}
        {...props}
      >
        {/* Breadcrumb */}
        {breadcrumb && <div className="mb-4">{breadcrumb}</div>}

        {/* Page Header */}
        {(title || actions) && (
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              {title && (
                <h1 className="text-2xl font-semibold text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className={cn("flex-1", maxWidthClasses[maxWidth])}>
          {children}
        </div>
      </div>
    );
  },
);
DashboardContent.displayName = "DashboardContent";

// =============================================================================
// DASHBOARD LAYOUT COMPONENT
// =============================================================================

/**
 * DashboardLayout - Dashboard with collapsible sidebar
 *
 * Features:
 * - Collapsible sidebar (controlled or uncontrolled)
 * - Mobile responsive (overlay mode)
 * - Header slot for top navigation
 * - Breadcrumb support via DashboardContent
 *
 * @example Basic dashboard
 * ```tsx
 * <DashboardLayout
 *   sidebar={
 *     <DashboardSidebar header={<Logo />}>
 *       <NavGroup items={navItems} />
 *     </DashboardSidebar>
 *   }
 *   header={<TopNav />}
 * >
 *   <DashboardContent title="Overview" breadcrumb={<Breadcrumb />}>
 *     <DashboardWidgets />
 *   </DashboardContent>
 * </DashboardLayout>
 * ```
 *
 * @example Controlled sidebar
 * ```tsx
 * const [collapsed, setCollapsed] = useState(false);
 *
 * <DashboardLayout
 *   sidebarCollapsed={collapsed}
 *   onSidebarCollapsedChange={setCollapsed}
 *   sidebar={<Sidebar collapsed={collapsed} />}
 * >
 *   <Content />
 * </DashboardLayout>
 * ```
 */
const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (
    {
      sidebar,
      header,
      children,
      sidebarCollapsed: controlledCollapsed,
      onSidebarCollapsedChange,
      defaultSidebarCollapsed = false,
      sidebarWidth = 256,
      sidebarCollapsedWidth = 64,
      showSidebarToggle = true,
      mobileBreakpoint = 768,
      variant,
      className,
      ...props
    },
    ref,
  ) => {
    // Uncontrolled state
    const [internalCollapsed, setInternalCollapsed] = React.useState(
      defaultSidebarCollapsed,
    );

    // Mobile state
    const [isMobile, setIsMobile] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    // Determine collapsed state (controlled vs uncontrolled)
    const isCollapsed = controlledCollapsed ?? internalCollapsed;

    const handleCollapsedChange = (collapsed: boolean) => {
      if (controlledCollapsed === undefined) {
        setInternalCollapsed(collapsed);
      }
      onSidebarCollapsedChange?.(collapsed);
    };

    // Check for mobile on mount and resize
    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < mobileBreakpoint);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, [mobileBreakpoint]);

    // Close mobile sidebar on escape
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && mobileOpen) {
          setMobileOpen(false);
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [mobileOpen]);

    const currentWidth = isCollapsed ? sidebarCollapsedWidth : sidebarWidth;

    return (
      <div
        ref={ref}
        className={cn(dashboardLayoutVariants({ variant }), className)}
        {...props}
      >
        {/* Mobile Overlay */}
        {isMobile && mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        {sidebar && (
          <aside
            className={cn(
              "shrink-0 transition-all duration-300 ease-in-out",
              isMobile
                ? cn(
                    "fixed inset-y-0 left-0 z-50 transform",
                    mobileOpen ? "translate-x-0" : "-translate-x-full",
                  )
                : "relative",
            )}
            style={{ width: isMobile ? sidebarWidth : currentWidth }}
          >
            {/* Sidebar content */}
            <div className="h-full relative">
              {sidebar}

              {/* Collapse toggle (desktop only) */}
              {showSidebarToggle && !isMobile && (
                <button
                  onClick={() => handleCollapsedChange(!isCollapsed)}
                  className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent transition-colors"
                  aria-label={
                    isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                  }
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </button>
              )}

              {/* Mobile close button */}
              {isMobile && mobileOpen && (
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute right-2 top-2 p-2 rounded-md hover:bg-accent"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </aside>
        )}

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          {header && (
            <header className="shrink-0 border-b border-border">
              <div className="flex items-center gap-4 px-4 h-14">
                {/* Mobile menu button */}
                {isMobile && sidebar && (
                  <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 -ml-2 rounded-md hover:bg-accent"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                )}
                {header}
              </div>
            </header>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    );
  },
);
DashboardLayout.displayName = "DashboardLayout";

export {
  DashboardLayout,
  DashboardSidebar,
  DashboardContent,
  dashboardLayoutVariants,
};
