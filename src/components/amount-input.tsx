import * as React from "react";
import { cn } from "../lib/utils";
import { Input } from "./input";
import { Button } from "./button";
import { TokenIcon } from "./token-icon";

export interface AmountInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Token symbol for display */
  token?: string;
  /** Token icon URL */
  tokenIcon?: string;
  /** User's available balance */
  balance?: string | number;
  /** Show balance display */
  showBalance?: boolean;
  /** Show max button */
  showMaxButton?: boolean;
  /** Show half button */
  showHalfButton?: boolean;
  /** USD value equivalent */
  usdValue?: number;
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Decimal precision */
  decimals?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value (defaults to balance) */
  max?: number;
  /** Callback when max is clicked */
  onMaxClick?: () => void;
}

/**
 * Sanitize numeric input - only allow valid decimal numbers
 */
function sanitizeAmount(value: string, decimals: number = 18): string {
  // Remove non-numeric characters except decimal point
  let sanitized = value.replace(/[^0-9.]/g, "");

  // Only allow one decimal point
  const parts = sanitized.split(".");
  if (parts.length > 2) {
    sanitized = parts[0] + "." + parts.slice(1).join("");
  }

  // Limit decimal places
  if (parts.length === 2 && parts[1].length > decimals) {
    sanitized = parts[0] + "." + parts[1].slice(0, decimals);
  }

  // Remove leading zeros (except for "0." case)
  if (sanitized.length > 1 && sanitized[0] === "0" && sanitized[1] !== ".") {
    sanitized = sanitized.replace(/^0+/, "") || "0";
  }

  return sanitized;
}

const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      value,
      onChange,
      token,
      tokenIcon,
      balance,
      showBalance = true,
      showMaxButton = true,
      showHalfButton = false,
      usdValue,
      label,
      error,
      decimals = 18,
      min = 0,
      max,
      onMaxClick,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const effectiveMax =
      max ?? (balance !== undefined ? parseFloat(String(balance)) : undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeAmount(e.target.value, decimals);
      onChange(sanitized);
    };

    const handleMax = () => {
      if (onMaxClick) {
        onMaxClick();
      } else if (effectiveMax !== undefined) {
        onChange(String(effectiveMax));
      }
    };

    const handleHalf = () => {
      if (effectiveMax !== undefined) {
        const halfValue = effectiveMax / 2;
        onChange(halfValue.toFixed(Math.min(decimals, 6)));
      }
    };

    const numValue = parseFloat(value) || 0;
    const isOverMax = effectiveMax !== undefined && numValue > effectiveMax;
    const isUnderMin = numValue < min;
    const hasError = !!error || isOverMax || isUnderMin;

    return (
      <div className={cn("space-y-2", className)}>
        {/* Label & Balance Row */}
        {(label || (showBalance && balance !== undefined)) && (
          <div className="flex items-center justify-between text-sm">
            {label && <span className="text-muted-foreground">{label}</span>}
            {showBalance && balance !== undefined && (
              <span className="text-muted-foreground">
                Balance:{" "}
                <span className="text-foreground font-medium">
                  {parseFloat(String(balance)).toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </span>
                {token && <span className="ml-1">{token}</span>}
              </span>
            )}
          </div>
        )}

        {/* Input Row */}
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-background p-3",
            hasError ? "border-destructive" : "border-input",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          )}
        >
          {/* Token Icon */}
          {token && (
            <div className="flex items-center gap-2 pr-2 border-r border-border">
              <TokenIcon symbol={token} src={tokenIcon} size="md" />
              <span className="font-medium text-sm">{token}</span>
            </div>
          )}

          {/* Input */}
          <Input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={handleChange}
            placeholder="0.00"
            disabled={disabled}
            className="border-0 bg-transparent p-0 text-lg font-mono focus-visible:ring-0 focus-visible:ring-offset-0"
            {...props}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {showHalfButton && effectiveMax !== undefined && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleHalf}
                disabled={disabled}
                className="h-7 px-2 text-xs"
              >
                50%
              </Button>
            )}
            {showMaxButton && effectiveMax !== undefined && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleMax}
                disabled={disabled}
                className="h-7 px-2 text-xs text-primary hover:text-primary"
              >
                MAX
              </Button>
            )}
          </div>
        </div>

        {/* USD Value & Error Row */}
        <div className="flex items-center justify-between text-xs">
          {usdValue !== undefined && numValue > 0 && (
            <span className="text-muted-foreground">
              ≈ $
              {(usdValue * numValue).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          )}
          {hasError && (
            <span className="text-destructive ml-auto">
              {error ||
                (isOverMax
                  ? "Exceeds balance"
                  : isUnderMin
                    ? `Minimum: ${min}`
                    : "")}
            </span>
          )}
        </div>
      </div>
    );
  },
);

AmountInput.displayName = "AmountInput";

export { AmountInput, sanitizeAmount };
