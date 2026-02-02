import * as React from "react";
import { cn } from "../../lib/utils";
import { TokenSelect, type Token } from "../trading/token-select";
import { ArrowDownUp } from "lucide-react";
import { Button } from "../core/button";

export interface SwapInputProps {
  /** "from" or "to" side of the swap */
  side: "from" | "to";
  /** Amount value */
  amount: string;
  /** Amount change handler */
  onAmountChange: (value: string) => void;
  /** Selected token symbol */
  token?: string;
  /** Token change handler */
  onTokenChange: (symbol: string) => void;
  /** Available tokens for selection */
  tokens: Token[];
  /** User's balance for the selected token */
  balance?: string | number;
  /** USD value of the amount */
  usdValue?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string;
  /** Class name */
  className?: string;
}

const SwapInput = React.forwardRef<HTMLDivElement, SwapInputProps>(
  (
    {
      side,
      amount,
      onAmountChange,
      token,
      onTokenChange,
      tokens,
      balance,
      usdValue,
      disabled = false,
      loading = false,
      error,
      className,
    },
    ref,
  ) => {
    const label = side === "from" ? "You pay" : "You receive";
    const showMaxButton = side === "from";

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-card p-4 transition-colors",
          error ? "border-destructive" : "border-border",
          disabled && "opacity-60",
          className,
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{label}</span>
          {balance !== undefined && (
            <span className="text-xs text-muted-foreground">
              Balance:{" "}
              <span className="text-foreground">
                {parseFloat(String(balance)).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            {loading ? (
              <div className="h-8 bg-muted animate-pulse rounded" />
            ) : (
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder="0"
                disabled={disabled || side === "to"}
                className={cn(
                  "w-full bg-transparent text-2xl font-medium outline-none",
                  "placeholder:text-muted-foreground",
                  side === "to" && "cursor-default",
                )}
              />
            )}
            {usdValue !== undefined && parseFloat(amount) > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                ≈ $
                {(usdValue * parseFloat(amount)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showMaxButton && balance !== undefined && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onAmountChange(String(balance))}
                disabled={disabled}
                className="h-7 px-2 text-xs text-primary"
              >
                MAX
              </Button>
            )}
            <TokenSelect
              value={token}
              onValueChange={onTokenChange}
              tokens={tokens}
              disabled={disabled}
              showBalance={false}
              size="default"
              className="w-[130px]"
            />
          </div>
        </div>

        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      </div>
    );
  },
);

SwapInput.displayName = "SwapInput";

// Swap container with flip button
export interface SwapContainerProps {
  fromInput: React.ReactNode;
  toInput: React.ReactNode;
  onFlip?: () => void;
  className?: string;
}

const SwapContainer: React.FC<SwapContainerProps> = ({
  fromInput,
  toInput,
  onFlip,
  className,
}) => {
  return (
    <div className={cn("relative space-y-1", className)}>
      {fromInput}

      {onFlip && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onFlip}
            className="h-10 w-10 rounded-full border-4 border-background bg-card hover:bg-accent"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
      )}

      {toInput}
    </div>
  );
};

export { SwapInput, SwapContainer };
