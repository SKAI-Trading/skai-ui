import * as React from "react";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// =============================================================================
// TRADING LAYOUT VARIANTS
// =============================================================================

const tradingLayoutVariants = cva("flex flex-col w-full", {
  variants: {
    height: {
      auto: "min-h-screen",
      full: "h-screen overflow-hidden",
      viewport: "h-[100dvh] overflow-hidden",
    },
  },
  defaultVariants: {
    height: "viewport",
  },
});

// =============================================================================
// TYPES
// =============================================================================

export interface TradingLayoutProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tradingLayoutVariants> {
  /** Header slot (navigation, account menu) */
  header?: React.ReactNode;
  /** Left sidebar slot (watchlist, positions) */
  leftSidebar?: React.ReactNode;
  /** Right sidebar slot (order book, trade form) */
  rightSidebar?: React.ReactNode;
  /** Main content slot (chart, trading view) */
  children: React.ReactNode;
  /** Footer slot (ticker, status bar) */
  footer?: React.ReactNode;
  /** Left sidebar width */
  leftSidebarWidth?: number | string;
  /** Right sidebar width */
  rightSidebarWidth?: number | string;
  /** Show left sidebar */
  showLeftSidebar?: boolean;
  /** Show right sidebar */
  showRightSidebar?: boolean;
  /** Gap between panels */
  gap?: 0 | 1 | 2 | 4;
  /** Padding around content */
  padding?: boolean;
}

export interface TradingPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Panel title */
  title?: string;
  /** Panel actions (buttons, settings) */
  actions?: React.ReactNode;
  /** Remove default padding */
  noPadding?: boolean;
  /** Panel variant */
  variant?: "default" | "bordered" | "elevated";
}

// =============================================================================
// TRADING PANEL COMPONENT
// =============================================================================

/**
 * TradingPanel - Container for trading UI sections
 *
 * @example
 * ```tsx
 * <TradingPanel title="Order Book" actions={<SettingsButton />}>
 *   <OrderBookContent />
 * </TradingPanel>
 * ```
 */
const TradingPanel = React.forwardRef<HTMLDivElement, TradingPanelProps>(
  (
    {
      title,
      actions,
      noPadding = false,
      variant = "default",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      default: "bg-card",
      bordered: "bg-card border border-border",
      elevated: "bg-card shadow-md",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col overflow-hidden rounded-lg",
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {(title || actions) && (
          <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
            {title && (
              <h3 className="text-sm font-medium text-foreground">{title}</h3>
            )}
            {actions && (
              <div className="flex items-center gap-1">{actions}</div>
            )}
          </div>
        )}
        <div className={cn("flex-1 overflow-auto", !noPadding && "p-3")}>
          {children}
        </div>
      </div>
    );
  },
);
TradingPanel.displayName = "TradingPanel";

// =============================================================================
// TRADING LAYOUT COMPONENT
// =============================================================================

/**
 * TradingLayout - Full-height trading view layout
 *
 * Features:
 * - Full viewport height (no scroll)
 * - Optional left/right sidebars
 * - Resizable panels ready
 * - Header and footer slots
 * - Zero padding mode for charts
 *
 * @example Basic trading view
 * ```tsx
 * <TradingLayout
 *   header={<Header />}
 *   leftSidebar={<Watchlist />}
 *   rightSidebar={<OrderForm />}
 *   footer={<TickerBar />}
 * >
 *   <TradingChart />
 * </TradingLayout>
 * ```
 *
 * @example Chart only (no sidebars)
 * ```tsx
 * <TradingLayout
 *   showLeftSidebar={false}
 *   showRightSidebar={false}
 * >
 *   <FullscreenChart />
 * </TradingLayout>
 * ```
 */
const TradingLayout = React.forwardRef<HTMLDivElement, TradingLayoutProps>(
  (
    {
      header,
      leftSidebar,
      rightSidebar,
      children,
      footer,
      leftSidebarWidth = 280,
      rightSidebarWidth = 320,
      showLeftSidebar = true,
      showRightSidebar = true,
      gap = 1,
      padding = false,
      height,
      className,
      ...props
    },
    ref,
  ) => {
    const gapClasses = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      4: "gap-4",
    };

    return (
      <div
        ref={ref}
        className={cn(tradingLayoutVariants({ height }), className)}
        {...props}
      >
        {/* Header */}
        {header && <div className="shrink-0">{header}</div>}

        {/* Main Content Area */}
        <div
          className={cn(
            "flex flex-1 min-h-0",
            gapClasses[gap],
            padding && "p-2",
          )}
        >
          {/* Left Sidebar */}
          {showLeftSidebar && leftSidebar && (
            <aside
              className="shrink-0 overflow-hidden"
              style={{ width: leftSidebarWidth }}
            >
              {leftSidebar}
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0 overflow-hidden">{children}</main>

          {/* Right Sidebar */}
          {showRightSidebar && rightSidebar && (
            <aside
              className="shrink-0 overflow-hidden"
              style={{ width: rightSidebarWidth }}
            >
              {rightSidebar}
            </aside>
          )}
        </div>

        {/* Footer */}
        {footer && <div className="shrink-0">{footer}</div>}
      </div>
    );
  },
);
TradingLayout.displayName = "TradingLayout";

export { TradingLayout, TradingPanel, tradingLayoutVariants };
