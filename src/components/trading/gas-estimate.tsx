import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { FuelIcon, AlertTriangleIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../feedback/tooltip";

const gasEstimateVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md font-medium tabular-nums",
  {
    variants: {
      size: {
        xs: "text-[10px] px-1.5 py-0.5",
        sm: "text-xs px-2 py-1",
        md: "text-sm px-2.5 py-1.5",
      },
      variant: {
        default: "bg-muted text-muted-foreground",
        low: "bg-green-500/10 text-green-600 dark:text-green-400",
        medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        high: "bg-red-500/10 text-red-600 dark:text-red-400",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "default",
    },
  },
);

export interface GasEstimateProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    Omit<VariantProps<typeof gasEstimateVariants>, "variant"> {
  /** Estimated gas in gwei */
  gasPrice?: number;
  /** Estimated cost in USD */
  estimatedCost?: number;
  /** Estimated time in seconds */
  estimatedTime?: number;
  /** Gas limit */
  gasLimit?: number;
  /** Show icon */
  showIcon?: boolean;
  /** Show tooltip with details */
  showTooltip?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
}

const getGasVariant = (
  gasPrice?: number,
): "low" | "medium" | "high" | "default" => {
  if (gasPrice === undefined) return "default";
  if (gasPrice < 30) return "low";
  if (gasPrice < 100) return "medium";
  return "high";
};

const formatGasPrice = (gwei: number): string => {
  if (gwei >= 1000) return `${(gwei / 1000).toFixed(1)}k`;
  return gwei.toFixed(0);
};

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `~${seconds}s`;
  if (seconds < 3600) return `~${Math.ceil(seconds / 60)}m`;
  return `~${Math.ceil(seconds / 3600)}h`;
};

const GasEstimate = React.forwardRef<HTMLDivElement, GasEstimateProps>(
  (
    {
      gasPrice,
      estimatedCost,
      estimatedTime,
      gasLimit,
      showIcon = true,
      showTooltip = true,
      loading = false,
      error,
      size,
      className,
      ...props
    },
    ref,
  ) => {
    const variant = getGasVariant(gasPrice);

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            gasEstimateVariants({ size, variant: "default" }),
            className,
          )}
          {...props}
        >
          {showIcon && <FuelIcon className="h-3 w-3 animate-pulse" />}
          <span className="animate-pulse">...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div
          ref={ref}
          className={cn(
            gasEstimateVariants({ size, variant: "high" }),
            className,
          )}
          {...props}
        >
          <AlertTriangleIcon className="h-3 w-3" />
          <span>Error</span>
        </div>
      );
    }

    const content = (
      <div
        ref={ref}
        className={cn(gasEstimateVariants({ size, variant }), className)}
        {...props}
      >
        {showIcon && <FuelIcon className="h-3 w-3" />}
        {gasPrice !== undefined && <span>{formatGasPrice(gasPrice)} gwei</span>}
        {estimatedCost !== undefined && (
          <>
            <span className="opacity-50">•</span>
            <span>${estimatedCost.toFixed(2)}</span>
          </>
        )}
        {estimatedTime !== undefined && (
          <>
            <span className="opacity-50">•</span>
            <span>{formatTime(estimatedTime)}</span>
          </>
        )}
      </div>
    );

    if (
      !showTooltip ||
      (gasPrice === undefined && estimatedCost === undefined)
    ) {
      return content;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 text-xs">
              {gasPrice !== undefined && (
                <div className="flex justify-between gap-4">
                  <span>Gas Price:</span>
                  <span>{gasPrice.toFixed(2)} gwei</span>
                </div>
              )}
              {gasLimit !== undefined && (
                <div className="flex justify-between gap-4">
                  <span>Gas Limit:</span>
                  <span>{gasLimit.toLocaleString()}</span>
                </div>
              )}
              {estimatedCost !== undefined && (
                <div className="flex justify-between gap-4">
                  <span>Est. Cost:</span>
                  <span>${estimatedCost.toFixed(4)}</span>
                </div>
              )}
              {estimatedTime !== undefined && (
                <div className="flex justify-between gap-4">
                  <span>Est. Time:</span>
                  <span>{formatTime(estimatedTime)}</span>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);
GasEstimate.displayName = "GasEstimate";

// Gas speed selector
export interface GasSpeedOption {
  label: string;
  gasPrice: number;
  estimatedTime: number;
}

export interface GasSpeedSelectorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  options: GasSpeedOption[];
  selected: number;
  onChange: (index: number) => void;
  estimatedCosts?: number[];
}

const GasSpeedSelector = React.forwardRef<
  HTMLDivElement,
  GasSpeedSelectorProps
>(
  (
    { options, selected, onChange, estimatedCosts, className, ...props },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("flex gap-2", className)} {...props}>
        {options.map((option, index) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(index)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors",
              selected === index
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
            )}
          >
            <span className="text-xs font-medium">{option.label}</span>
            <span className="text-[10px] text-muted-foreground">
              {formatGasPrice(option.gasPrice)} gwei
            </span>
            <span className="text-[10px] text-muted-foreground">
              {formatTime(option.estimatedTime)}
            </span>
            {estimatedCosts?.[index] !== undefined && (
              <span className="text-xs font-medium">
                ${estimatedCosts[index].toFixed(2)}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  },
);
GasSpeedSelector.displayName = "GasSpeedSelector";

export { GasEstimate, GasSpeedSelector, gasEstimateVariants };
