import * as React from "react";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Skeleton } from "./skeleton";

// =============================================================================
// BALANCE DISPLAY VARIANTS
// =============================================================================

const balanceDisplayVariants = cva(
  "inline-flex items-center gap-1.5 font-mono tabular-nums",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        success: "text-green-500",
        warning: "text-yellow-500",
        danger: "text-red-500",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

// =============================================================================
// TYPES
// =============================================================================

export interface BalanceDisplayProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof balanceDisplayVariants> {
  /** Balance value (number or string) */
  balance: number | string;
  /** Currency/token symbol (e.g., "ETH", "USD", "$") */
  symbol?: string;
  /** Icon to display (token icon, currency icon) */
  icon?: React.ReactNode;
  /** Position of symbol */
  symbolPosition?: "prefix" | "suffix";
  /** Position of icon */
  iconPosition?: "left" | "right";
  /** Loading state */
  loading?: boolean;
  /** Number of decimal places to display */
  decimals?: number;
  /** Use compact notation for large numbers (1K, 1M, etc.) */
  compact?: boolean;
  /** Show plus sign for positive values */
  showPlusSign?: boolean;
  /** Hide value (show dots for privacy) */
  hideValue?: boolean;
  /** Locale for number formatting */
  locale?: string;
  /** Custom formatter function */
  formatter?: (value: number) => string;
  /** Animate value changes */
  animate?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

const formatBalance = (
  value: number | string,
  options: {
    decimals?: number;
    compact?: boolean;
    showPlusSign?: boolean;
    locale?: string;
    formatter?: (value: number) => string;
  },
): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "0";

  // Custom formatter takes precedence
  if (options.formatter) {
    return options.formatter(numValue);
  }

  const {
    decimals = 2,
    compact = false,
    showPlusSign = false,
    locale = "en-US",
  } = options;

  let formatted: string;

  if (compact && Math.abs(numValue) >= 1000) {
    formatted = new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: decimals,
    }).format(numValue);
  } else {
    formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(numValue);
  }

  if (showPlusSign && numValue > 0) {
    formatted = `+${formatted}`;
  }

  return formatted;
};

// =============================================================================
// BALANCE DISPLAY COMPONENT
// =============================================================================

/**
 * BalanceDisplay - Token/currency balance display component
 *
 * Features:
 * - Number formatting with locale support
 * - Compact notation (1K, 1M, etc.)
 * - Loading skeleton
 * - Hide value for privacy
 * - Custom icons and symbols
 * - Multiple sizes and variants
 *
 * @example Basic usage
 * ```tsx
 * <BalanceDisplay balance={1234.56} symbol="ETH" />
 * ```
 *
 * @example With icon
 * ```tsx
 * <BalanceDisplay
 *   balance={1234.56}
 *   symbol="$"
 *   symbolPosition="prefix"
 *   icon={<DollarSign className="h-4 w-4" />}
 * />
 * ```
 *
 * @example Compact notation
 * ```tsx
 * <BalanceDisplay balance={1234567} compact symbol="SKAI" />
 * // Displays: 1.23M SKAI
 * ```
 *
 * @example Loading state
 * ```tsx
 * <BalanceDisplay balance={0} loading />
 * ```
 *
 * @example Hidden value (privacy)
 * ```tsx
 * <BalanceDisplay balance={1234.56} hideValue symbol="ETH" />
 * // Displays: •••••• ETH
 * ```
 */
const BalanceDisplay = React.forwardRef<HTMLDivElement, BalanceDisplayProps>(
  (
    {
      balance,
      symbol,
      icon,
      symbolPosition = "suffix",
      iconPosition = "left",
      loading = false,
      decimals = 2,
      compact = false,
      showPlusSign = false,
      hideValue = false,
      locale = "en-US",
      formatter,
      animate = false,
      variant,
      size,
      className,
      ...props
    },
    ref,
  ) => {
    const formattedValue = React.useMemo(
      () =>
        formatBalance(balance, {
          decimals,
          compact,
          showPlusSign,
          locale,
          formatter,
        }),
      [balance, decimals, compact, showPlusSign, locale, formatter],
    );

    // Size-based skeleton dimensions
    const skeletonSizes = {
      xs: "h-3 w-12",
      sm: "h-4 w-16",
      md: "h-5 w-20",
      lg: "h-6 w-24",
      xl: "h-7 w-28",
      "2xl": "h-8 w-32",
    };

    // Size-based icon dimensions
    const iconSizes = {
      xs: "h-3 w-3",
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
      "2xl": "h-7 w-7",
    };

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(balanceDisplayVariants({ variant, size }), className)}
          {...props}
        >
          {icon && iconPosition === "left" && (
            <span
              className={cn("shrink-0 opacity-50", iconSizes[size || "md"])}
            >
              {icon}
            </span>
          )}
          <Skeleton className={skeletonSizes[size || "md"]} />
          {icon && iconPosition === "right" && (
            <span
              className={cn("shrink-0 opacity-50", iconSizes[size || "md"])}
            >
              {icon}
            </span>
          )}
        </div>
      );
    }

    const displayValue = hideValue ? "••••••" : formattedValue;

    const valueWithSymbol = (
      <>
        {symbol && symbolPosition === "prefix" && (
          <span className="text-muted-foreground">{symbol}</span>
        )}
        <span
          className={cn(
            animate && "transition-all duration-300",
            hideValue && "tracking-wider",
          )}
        >
          {displayValue}
        </span>
        {symbol && symbolPosition === "suffix" && (
          <span className="text-muted-foreground ml-0.5">{symbol}</span>
        )}
      </>
    );

    return (
      <div
        ref={ref}
        className={cn(balanceDisplayVariants({ variant, size }), className)}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className={cn("shrink-0", iconSizes[size || "md"])}>
            {icon}
          </span>
        )}
        {valueWithSymbol}
        {icon && iconPosition === "right" && (
          <span className={cn("shrink-0", iconSizes[size || "md"])}>
            {icon}
          </span>
        )}
      </div>
    );
  },
);
BalanceDisplay.displayName = "BalanceDisplay";

// =============================================================================
// BALANCE CHANGE COMPONENT (Shows +/- change)
// =============================================================================

export interface BalanceChangeProps extends Omit<
  BalanceDisplayProps,
  "variant" | "showPlusSign"
> {
  /** Previous balance for calculating change */
  previousBalance?: number | string;
  /** Show as percentage */
  asPercentage?: boolean;
}

/**
 * BalanceChange - Shows balance with automatic positive/negative styling
 *
 * @example
 * ```tsx
 * <BalanceChange balance={5.23} symbol="%" />
 * // Green: +5.23%
 *
 * <BalanceChange balance={-2.15} symbol="%" />
 * // Red: -2.15%
 * ```
 */
const BalanceChange = React.forwardRef<HTMLDivElement, BalanceChangeProps>(
  ({ balance, asPercentage = false, symbol, ...props }, ref) => {
    const numValue =
      typeof balance === "string" ? parseFloat(balance) : balance;
    const variant =
      numValue > 0 ? "success" : numValue < 0 ? "danger" : "muted";
    const displaySymbol = asPercentage ? "%" : symbol;

    return (
      <BalanceDisplay
        ref={ref}
        balance={balance}
        variant={variant}
        showPlusSign={numValue > 0}
        symbol={displaySymbol}
        {...props}
      />
    );
  },
);
BalanceChange.displayName = "BalanceChange";

export { BalanceDisplay, BalanceChange, balanceDisplayVariants, formatBalance };
