/**
 * HeaderStatusPill - Animated status display component
 * 
 * Features:
 * - Animated number counter with smooth transitions
 * - Glow effects and hover states
 * - Tooltip support
 * - Click navigation
 * - Loading state
 */

import * as React from "react";
import { cn } from "../../../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../feedback/tooltip";

// =============================================================================
// ANIMATED NUMBER
// =============================================================================

export interface AnimatedNumberProps {
  /** The numeric value to display */
  value: number;
  /** Animation duration in ms */
  duration?: number;
  /** Format function for display */
  formatFn: (n: number) => string;
}

/**
 * AnimatedNumber - Smooth counting animation for numeric values
 */
export function AnimatedNumber({ 
  value, 
  duration = 500,
  formatFn 
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const previousValue = React.useRef(value);

  React.useEffect(() => {
    if (previousValue.current === value) return;
    
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOut;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValue.current = value;
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{formatFn(displayValue)}</span>;
}

// =============================================================================
// STATUS PILL
// =============================================================================

export interface HeaderStatusPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon component or custom icon */
  icon: React.ReactNode;
  /** Numeric value */
  value: number;
  /** Label for accessibility */
  label: string;
  /** Format function for value display */
  formatFn: (n: number) => string;
  /** Glow color (CSS color) */
  glowColor?: string;
  /** Icon color (CSS color) */
  iconColor?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** Animation duration */
  animationDuration?: number;
}

/**
 * HeaderStatusPill - Techy status indicator for header
 * 
 * @example
 * ```tsx
 * <HeaderStatusPill
 *   icon={<Trophy className="w-4 h-4" />}
 *   value={12500}
 *   label="SKAI Points"
 *   formatFn={(n) => n.toLocaleString()}
 *   glowColor="rgba(86, 199, 243, 0.3)"
 *   iconColor="#56C7F3"
 *   tooltip="Click to view leaderboard"
 *   onClick={() => navigate("/leaderboard")}
 * />
 * ```
 */
const HeaderStatusPill = React.forwardRef<HTMLButtonElement, HeaderStatusPillProps>(
  ({ 
    className,
    icon,
    value,
    label,
    formatFn,
    glowColor = "rgba(86, 199, 243, 0.3)",
    iconColor = "#56C7F3",
    isLoading,
    tooltip,
    animationDuration = 500,
    ...props 
  }, ref) => {
    const pill = (
      <button
        ref={ref}
        aria-label={label}
        className={cn(
          "group relative flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-gradient-to-r from-background/80 to-background/40",
          "border border-border/40 hover:border-border/60",
          "backdrop-blur-md transition-all duration-300",
          "hover:scale-[1.02] active:scale-[0.98]",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          className
        )}
        style={{
          boxShadow: `0 0 20px ${glowColor}`,
        }}
        {...props}
      >
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          }}
        />

        {/* Icon */}
        <span 
          className="relative z-10 shrink-0"
          style={{ color: iconColor }}
        >
          {icon}
        </span>

        {/* Value */}
        <span className="relative z-10 text-sm font-semibold tabular-nums text-foreground">
          {isLoading ? (
            <span className="inline-block w-12 h-4 bg-muted/50 rounded animate-pulse" />
          ) : (
            <AnimatedNumber 
              value={value} 
              formatFn={formatFn}
              duration={animationDuration}
            />
          )}
        </span>
      </button>
    );

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              {pill}
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return pill;
  }
);

HeaderStatusPill.displayName = "HeaderStatusPill";

// =============================================================================
// BALANCE DISPLAY (Specialized for crypto)
// =============================================================================

export interface HeaderBalanceDisplayProps extends Omit<HeaderStatusPillProps, 'value' | 'formatFn'> {
  /** Balance in native units (e.g., ETH not wei) */
  balance: string | number;
  /** Currency symbol */
  symbol?: string;
  /** Decimal places to show */
  decimals?: number;
}

/**
 * HeaderBalanceDisplay - Specialized pill for crypto balances
 */
const HeaderBalanceDisplay = React.forwardRef<HTMLButtonElement, HeaderBalanceDisplayProps>(
  ({ 
    balance, 
    symbol = "ETH",
    decimals = 4,
    label = "Balance",
    ...props 
  }, ref) => {
    const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
    
    const formatBalance = (n: number) => {
      if (n === 0) return `0 ${symbol}`;
      if (n < 0.0001) return `<0.0001 ${symbol}`;
      return `${n.toFixed(decimals)} ${symbol}`;
    };

    return (
      <HeaderStatusPill
        ref={ref}
        value={numBalance}
        formatFn={formatBalance}
        label={label}
        {...props}
      />
    );
  }
);

HeaderBalanceDisplay.displayName = "HeaderBalanceDisplay";

export { HeaderStatusPill, HeaderBalanceDisplay };
