/**
 * SKAI Page Layout Templates
 *
 * Pre-built page layouts for common SKAI application patterns.
 * These layouts enforce consistent structure, spacing, and typography.
 *
 * Usage:
 *   import { TradingPage, DashboardPage, AuthPage, ContentPage } from '@skai/ui';
 *
 * @packageDocumentation
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Container, VStack, HStack, Grid } from "../lib/layout";

// =============================================================================
// PAGE HEADER COMPONENT
// =============================================================================

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title: string;
  /** Page subtitle/description */
  subtitle?: string;
  /** Actions slot (buttons, filters) */
  actions?: React.ReactNode;
  /** Breadcrumb slot */
  breadcrumb?: React.ReactNode;
  /** Sticky header */
  sticky?: boolean;
}

/**
 * PageHeader - Standard page header with title, subtitle, and actions
 *
 * Typography:
 * - Title: headline-4 (Cormorant Garamond, 34px)
 * - Subtitle: para-1 (Manrope, 16px)
 */
export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      className,
      title,
      subtitle,
      actions,
      breadcrumb,
      sticky = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full py-6",
          sticky && "sticky top-0 z-10 bg-background/95 backdrop-blur",
          className,
        )}
        {...props}
      >
        {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
        <HStack justify="between" align="center" gap={4}>
          <VStack gap={1}>
            <h1 className="font-heading text-headline-4 text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="font-sans text-para-1 text-muted-foreground">
                {subtitle}
              </p>
            )}
          </VStack>
          {actions && <HStack gap={3}>{actions}</HStack>}
        </HStack>
      </div>
    );
  },
);
PageHeader.displayName = "PageHeader";

// =============================================================================
// TRADING PAGE LAYOUT
// =============================================================================

export interface TradingPageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Main trading panel */
  tradingPanel: React.ReactNode;
  /** Sidebar content (order book, history) */
  sidebar?: React.ReactNode;
  /** Bottom panel (positions, orders) */
  bottomPanel?: React.ReactNode;
  /** Sidebar position */
  sidebarPosition?: "left" | "right";
  /** Sidebar width */
  sidebarWidth?: "sm" | "md" | "lg";
}

const sidebarWidthMap = {
  sm: "w-80",
  md: "w-96",
  lg: "w-[420px]",
};

/**
 * TradingPage - Full-viewport trading layout
 *
 * Used for: Trade page, HiLo, Predictions
 * Structure: Main panel + optional sidebar + optional bottom panel
 */
export const TradingPage = React.forwardRef<HTMLDivElement, TradingPageProps>(
  (
    {
      className,
      tradingPanel,
      sidebar,
      bottomPanel,
      sidebarPosition = "right",
      sidebarWidth = "md",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col h-[calc(100vh-104px)]", // Account for header + bottom bar
          className,
        )}
        {...props}
      >
        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar */}
          {sidebar && sidebarPosition === "left" && (
            <aside
              className={cn(
                "border-r border-border flex-shrink-0 overflow-y-auto hidden lg:block",
                sidebarWidthMap[sidebarWidth],
              )}
            >
              {sidebar}
            </aside>
          )}

          {/* Main panel */}
          <main className="flex-1 overflow-y-auto">{tradingPanel}</main>

          {/* Right sidebar */}
          {sidebar && sidebarPosition === "right" && (
            <aside
              className={cn(
                "border-l border-border flex-shrink-0 overflow-y-auto hidden lg:block",
                sidebarWidthMap[sidebarWidth],
              )}
            >
              {sidebar}
            </aside>
          )}
        </div>

        {/* Bottom panel (positions, orders) */}
        {bottomPanel && (
          <div className="border-t border-border flex-shrink-0 max-h-64 overflow-y-auto">
            {bottomPanel}
          </div>
        )}
      </div>
    );
  },
);
TradingPage.displayName = "TradingPage";

// =============================================================================
// DASHBOARD PAGE LAYOUT
// =============================================================================

export interface DashboardPageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page header */
  header?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Sidebar content */
  sidebar?: React.ReactNode;
  /** Sidebar position */
  sidebarPosition?: "left" | "right";
  /** Sidebar width */
  sidebarWidth?: "sm" | "md" | "lg";
}

/**
 * DashboardPage - Standard dashboard layout with sidebar
 *
 * Used for: Portfolio, Admin, Settings
 * Structure: Header + Sidebar + Main content area
 */
export const DashboardPage = React.forwardRef<
  HTMLDivElement,
  DashboardPageProps
>(
  (
    {
      className,
      header,
      children,
      sidebar,
      sidebarPosition = "left",
      sidebarWidth = "sm",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col min-h-[calc(100vh-104px)]", className)}
        {...props}
      >
        {/* Page header */}
        {header && (
          <Container size="2xl" padding>
            {header}
          </Container>
        )}

        {/* Content area */}
        <Container size="2xl" padding className="flex-1">
          <div className="flex gap-8">
            {/* Left sidebar */}
            {sidebar && sidebarPosition === "left" && (
              <aside
                className={cn(
                  "flex-shrink-0 hidden md:block",
                  sidebarWidthMap[sidebarWidth],
                )}
              >
                {sidebar}
              </aside>
            )}

            {/* Main content */}
            <main className="flex-1 min-w-0">{children}</main>

            {/* Right sidebar */}
            {sidebar && sidebarPosition === "right" && (
              <aside
                className={cn(
                  "flex-shrink-0 hidden md:block",
                  sidebarWidthMap[sidebarWidth],
                )}
              >
                {sidebar}
              </aside>
            )}
          </div>
        </Container>
      </div>
    );
  },
);
DashboardPage.displayName = "DashboardPage";

// =============================================================================
// CONTENT PAGE LAYOUT
// =============================================================================

export interface ContentPageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page header */
  header?: React.ReactNode;
  /** Maximum content width */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Center content */
  centered?: boolean;
}

/**
 * ContentPage - Standard content page with constrained width
 *
 * Used for: Learn, Docs, About, Blog
 * Structure: Header + Centered content
 */
export const ContentPage = React.forwardRef<HTMLDivElement, ContentPageProps>(
  (
    { className, header, maxWidth = "lg", centered = true, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("min-h-[calc(100vh-104px)] py-8", className)}
        {...props}
      >
        <Container size={maxWidth} center={centered} padding>
          {header}
          <main className="mt-6">{children}</main>
        </Container>
      </div>
    );
  },
);
ContentPage.displayName = "ContentPage";

// =============================================================================
// AUTH PAGE LAYOUT
// =============================================================================

export interface AuthPageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Logo slot */
  logo?: React.ReactNode;
  /** Title */
  title?: string;
  /** Subtitle */
  subtitle?: string;
  /** Show background pattern */
  showPattern?: boolean;
}

/**
 * AuthPage - Centered authentication layout
 *
 * Used for: Login, Register, Verify, Forgot Password
 * Structure: Centered card with logo, title, form
 */
export const AuthPage = React.forwardRef<HTMLDivElement, AuthPageProps>(
  (
    {
      className,
      logo,
      title,
      subtitle,
      showPattern = true,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen flex items-center justify-center px-4 py-8",
          showPattern &&
            "bg-gradient-to-br from-green-coal-300 to-green-coal-200",
          className,
        )}
        {...props}
      >
        <div className="w-full max-w-md">
          <VStack gap={6} align="center">
            {/* Logo */}
            {logo && <div className="mb-4">{logo}</div>}

            {/* Title & Subtitle */}
            {(title || subtitle) && (
              <VStack gap={2} align="center" className="text-center">
                {title && (
                  <h1 className="font-heading text-headline-4 text-foreground">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="font-sans text-para-1 text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </VStack>
            )}

            {/* Form content */}
            <div className="w-full">{children}</div>
          </VStack>
        </div>
      </div>
    );
  },
);
AuthPage.displayName = "AuthPage";

// =============================================================================
// GRID PAGE LAYOUT
// =============================================================================

export interface GridPageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page header */
  header?: React.ReactNode;
  /** Number of columns */
  cols?: 1 | 2 | 3 | 4;
  /** Gap between items */
  gap?: 4 | 6 | 8;
}

/**
 * GridPage - Grid-based page layout
 *
 * Used for: Launchpad, Games, NFTs, Explore
 * Structure: Header + Responsive grid of cards
 */
export const GridPage = React.forwardRef<HTMLDivElement, GridPageProps>(
  ({ className, header, cols = 3, gap = 6, children, ...props }, ref) => {
    const responsiveCols: Record<
      1 | 2 | 3 | 4,
      { sm: 1 | 2; md: 1 | 2; lg: 1 | 2 | 3 | 4 }
    > = {
      1: { sm: 1, md: 1, lg: 1 },
      2: { sm: 1, md: 2, lg: 2 },
      3: { sm: 1, md: 2, lg: 3 },
      4: { sm: 1, md: 2, lg: 4 },
    };

    return (
      <div
        ref={ref}
        className={cn("min-h-[calc(100vh-104px)] py-8", className)}
        {...props}
      >
        <Container size="2xl" padding>
          {header}
          <Grid
            cols={1}
            responsive={responsiveCols[cols]}
            gap={gap}
            className="mt-6"
          >
            {children}
          </Grid>
        </Container>
      </div>
    );
  },
);
GridPage.displayName = "GridPage";

// =============================================================================
// SECTION COMPONENTS
// =============================================================================

export interface PageSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Actions slot */
  actions?: React.ReactNode;
  /** Padding */
  padding?: boolean;
}

/**
 * PageSection - Reusable section within a page
 */
export const PageSection = React.forwardRef<HTMLDivElement, PageSectionProps>(
  (
    { className, title, subtitle, actions, padding = true, children, ...props },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(padding && "py-8", className)}
        {...props}
      >
        {(title || subtitle || actions) && (
          <HStack justify="between" align="start" className="mb-6">
            <VStack gap={1}>
              {title && (
                <h2 className="font-subheading text-sub-1 text-foreground">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="font-sans text-para-2 text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </VStack>
            {actions && <HStack gap={3}>{actions}</HStack>}
          </HStack>
        )}
        {children}
      </section>
    );
  },
);
PageSection.displayName = "PageSection";

// =============================================================================
// EMPTY STATE
// =============================================================================

export interface PageEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon slot */
  icon?: React.ReactNode;
  /** Title */
  title: string;
  /** Description */
  description?: string;
  /** Actions slot */
  actions?: React.ReactNode;
}

/**
 * PageEmptyState - Empty state for pages with no content
 */
export const PageEmptyState = React.forwardRef<
  HTMLDivElement,
  PageEmptyStateProps
>(({ className, icon, title, description, actions, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-muted-foreground text-4xl">{icon}</div>
      )}
      <h3 className="font-subheading text-sub-2 text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 font-sans text-para-2 text-muted-foreground max-w-md">
          {description}
        </p>
      )}
      {actions && <div className="mt-6">{actions}</div>}
    </div>
  );
});
PageEmptyState.displayName = "PageEmptyState";

// =============================================================================
// LOADING STATE
// =============================================================================

export interface PageLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Loading message */
  message?: string;
}

/**
 * PageLoading - Full-page loading state
 */
export const PageLoading = React.forwardRef<HTMLDivElement, PageLoadingProps>(
  ({ className, message = "Loading...", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center min-h-[calc(100vh-104px)]",
          className,
        )}
        {...props}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
        <p className="font-sans text-para-1 text-muted-foreground">{message}</p>
      </div>
    );
  },
);
PageLoading.displayName = "PageLoading";
