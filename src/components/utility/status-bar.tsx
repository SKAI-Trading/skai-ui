import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../feedback/tooltip";

// =============================================================================
// STATUS BAR TYPES
// =============================================================================

export interface StatusBarItem {
  /** Unique identifier */
  id: string;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Value to display */
  value: React.ReactNode;
  /** Label/description */
  label?: string;
  /** Tooltip content */
  tooltip?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Whether to show loading skeleton */
  loading?: boolean;
  /** Whether the item is highlighted (positive change, etc.) */
  highlighted?: boolean;
  /** Highlight type (positive = green, negative = red) */
  highlightType?: "positive" | "negative" | "neutral";
  /** Custom className */
  className?: string;
}

const statusBarVariants = cva("flex items-center gap-1", {
  variants: {
    variant: {
      default: "bg-transparent",
      muted: "bg-muted/50 rounded-md",
      bordered: "border border-border rounded-md",
      glass:
        "bg-background/50 backdrop-blur-sm rounded-md border border-border/50",
    },
    size: {
      sm: "px-2 py-1 text-xs gap-3",
      md: "px-3 py-1.5 text-sm gap-4",
      lg: "px-4 py-2 text-base gap-5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface StatusBarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBarVariants> {
  /** Status items to display */
  items: StatusBarItem[];
  /** Separator between items */
  separator?: React.ReactNode;
  /** Whether items are clickable by default */
  clickable?: boolean;
  /** Whether to show dividers between items */
  showDividers?: boolean;
}

// =============================================================================
// STATUS BAR ITEM COMPONENT
// =============================================================================

interface StatusBarItemComponentProps {
  item: StatusBarItem;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

const iconSizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const highlightClasses = {
  positive: "text-green-500",
  negative: "text-red-500",
  neutral: "text-muted-foreground",
};

const StatusBarItemComponent: React.FC<StatusBarItemComponentProps> = ({
  item,
  size = "md",
  clickable = false,
}) => {
  const isClickable = clickable || !!item.onClick;

  const content = (
    <div
      className={cn(
        "flex items-center gap-1.5 shrink-0",
        isClickable && "cursor-pointer hover:opacity-80 transition-opacity",
        item.className,
      )}
      onClick={item.onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                item.onClick?.();
              }
            }
          : undefined
      }
    >
      {item.icon && (
        <span
          className={cn(
            "shrink-0 text-muted-foreground",
            iconSizeClasses[size],
          )}
        >
          {item.icon}
        </span>
      )}
      {item.loading ? (
        <span className="h-4 w-12 animate-pulse rounded bg-muted" />
      ) : (
        <span
          className={cn(
            "font-medium tabular-nums",
            item.highlighted &&
              item.highlightType &&
              highlightClasses[item.highlightType],
          )}
        >
          {item.value}
        </span>
      )}
      {item.label && (
        <span className="text-muted-foreground hidden sm:inline">
          {item.label}
        </span>
      )}
    </div>
  );

  if (item.tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>{item.tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

// =============================================================================
// STATUS BAR COMPONENT
// =============================================================================

/**
 * StatusBar - Display status items in a horizontal bar
 *
 * Perfect for header status displays showing points, balances, network status, etc.
 *
 * Features:
 * - Multiple visual variants (default, muted, bordered, glass)
 * - Icon and label support
 * - Tooltip support per item
 * - Loading states
 * - Highlight states (positive/negative)
 * - Clickable items
 * - Keyboard accessible
 *
 * @example Basic usage
 * ```tsx
 * <StatusBar
 *   items={[
 *     { id: "points", icon: <Star />, value: "1,234", label: "SKAI Points" },
 *     { id: "balance", icon: <Wallet />, value: "$5,678.90", label: "Balance" },
 *   ]}
 * />
 * ```
 *
 * @example With highlights and tooltips
 * ```tsx
 * <StatusBar
 *   variant="glass"
 *   items={[
 *     {
 *       id: "pnl",
 *       icon: <TrendingUp />,
 *       value: "+$234.50",
 *       highlighted: true,
 *       highlightType: "positive",
 *       tooltip: "24h PnL",
 *     },
 *     {
 *       id: "tier",
 *       icon: <Crown />,
 *       value: "Gold",
 *       tooltip: "Your current tier",
 *       onClick: () => openTierModal(),
 *     },
 *   ]}
 * />
 * ```
 */
const StatusBar = React.forwardRef<HTMLDivElement, StatusBarProps>(
  (
    {
      className,
      variant,
      size,
      items,
      separator,
      clickable = false,
      showDividers = false,
      ...props
    },
    ref,
  ) => {
    return (
      <TooltipProvider>
        <div
          ref={ref}
          className={cn(statusBarVariants({ variant, size }), className)}
          role="status"
          aria-label="Status information"
          {...props}
        >
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <StatusBarItemComponent
                item={item}
                size={size || "md"}
                clickable={clickable}
              />
              {index < items.length - 1 && (
                <>
                  {separator}
                  {showDividers && !separator && (
                    <div className="h-4 w-px bg-border shrink-0" />
                  )}
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </TooltipProvider>
    );
  },
);
StatusBar.displayName = "StatusBar";

export { StatusBar, StatusBarItemComponent, statusBarVariants };
