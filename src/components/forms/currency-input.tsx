import * as React from "react";
import { cn } from "../../lib/utils";
import { Input } from "../core/input";

export interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  /** Current numeric value */
  value?: number | string;
  /** Callback when value changes */
  onValueChange?: (value: number | undefined, formatted: string) => void;
  /** Currency symbol to display */
  currency?: string;
  /** Position of currency symbol */
  currencyPosition?: "prefix" | "suffix";
  /** Number of decimal places */
  decimals?: number;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Thousands separator character */
  thousandSeparator?: string;
  /** Decimal separator character */
  decimalSeparator?: string;
  /** Allow negative values */
  allowNegative?: boolean;
  /** Custom className */
  className?: string;
  /** Show currency symbol inside input */
  showCurrencySymbol?: boolean;
}

/**
 * Format a number as a currency string
 */
function formatCurrency(
  value: number | undefined,
  decimals: number,
  thousandSeparator: string,
  decimalSeparator: string,
): string {
  if (value === undefined || isNaN(value)) {
    return "";
  }

  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");

  // Add thousand separators
  const formattedInt = intPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator,
  );

  return decPart !== undefined
    ? `${formattedInt}${decimalSeparator}${decPart}`
    : formattedInt;
}

/**
 * Parse a formatted string back to a number
 */
function parseFormattedValue(
  formatted: string,
  thousandSeparator: string,
  decimalSeparator: string,
): number | undefined {
  if (!formatted || formatted.trim() === "") {
    return undefined;
  }

  // Remove thousand separators and convert decimal separator
  let cleaned = formatted.replace(
    new RegExp(`\\${thousandSeparator}`, "g"),
    "",
  );
  if (decimalSeparator !== ".") {
    cleaned = cleaned.replace(decimalSeparator, ".");
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * CurrencyInput - An input field for currency/money values with formatting
 *
 * Features:
 * - Automatic thousand separators
 * - Configurable decimal places
 * - Currency symbol prefix/suffix
 * - Min/max validation
 * - Supports different locales (comma/period separators)
 *
 * @example
 * ```tsx
 * <CurrencyInput
 *   value={1234.56}
 *   onValueChange={(value) => setValue(value)}
 *   currency="$"
 *   decimals={2}
 * />
 * ```
 */
const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value,
      onValueChange,
      currency = "",
      currencyPosition = "prefix",
      decimals = 2,
      min,
      max,
      thousandSeparator = ",",
      decimalSeparator = ".",
      allowNegative = false,
      className,
      showCurrencySymbol = true,
      disabled,
      placeholder,
      ...props
    },
    ref,
  ) => {
    // Convert value to number if it's a string
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    // Track internal display value
    const [displayValue, setDisplayValue] = React.useState(() =>
      formatCurrency(
        numericValue,
        decimals,
        thousandSeparator,
        decimalSeparator,
      ),
    );

    // Track if user is actively editing
    const [isEditing, setIsEditing] = React.useState(false);

    // Update display value when external value changes (and not editing)
    React.useEffect(() => {
      if (!isEditing) {
        setDisplayValue(
          formatCurrency(
            numericValue,
            decimals,
            thousandSeparator,
            decimalSeparator,
          ),
        );
      }
    }, [
      numericValue,
      decimals,
      thousandSeparator,
      decimalSeparator,
      isEditing,
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      // Allow empty input
      if (inputValue === "") {
        setDisplayValue("");
        onValueChange?.(undefined, "");
        return;
      }

      // Build regex for valid characters
      const negativePattern = allowNegative ? "-?" : "";
      const separatorPattern = `[0-9${thousandSeparator}${decimalSeparator}]`;
      const validPattern = new RegExp(
        `^${negativePattern}${separatorPattern}*$`,
      );

      // Only allow valid characters
      if (!validPattern.test(inputValue)) {
        return;
      }

      // Prevent multiple decimal separators
      const decimalCount = (
        inputValue.match(new RegExp(`\\${decimalSeparator}`, "g")) || []
      ).length;
      if (decimalCount > 1) {
        return;
      }

      // Prevent negative sign anywhere except at the start
      if (allowNegative && inputValue.lastIndexOf("-") > 0) {
        return;
      }

      setDisplayValue(inputValue);

      // Parse and validate
      const parsed = parseFormattedValue(
        inputValue,
        thousandSeparator,
        decimalSeparator,
      );

      if (parsed !== undefined) {
        let finalValue = parsed;

        // Apply min/max constraints
        if (min !== undefined && finalValue < min) {
          finalValue = min;
        }
        if (max !== undefined && finalValue > max) {
          finalValue = max;
        }

        onValueChange?.(finalValue, inputValue);
      } else {
        onValueChange?.(undefined, inputValue);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsEditing(false);

      // Format the value on blur
      const parsed = parseFormattedValue(
        displayValue,
        thousandSeparator,
        decimalSeparator,
      );

      if (parsed !== undefined) {
        let finalValue = parsed;

        // Apply min/max constraints
        if (min !== undefined && finalValue < min) {
          finalValue = min;
        }
        if (max !== undefined && finalValue > max) {
          finalValue = max;
        }

        const formatted = formatCurrency(
          finalValue,
          decimals,
          thousandSeparator,
          decimalSeparator,
        );
        setDisplayValue(formatted);
        onValueChange?.(finalValue, formatted);
      }

      props.onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsEditing(true);
      props.onFocus?.(e);
    };

    // Build the display with currency symbol
    const inputContent = (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        placeholder={
          placeholder ?? `0${decimalSeparator}${"0".repeat(decimals)}`
        }
        className={cn(
          showCurrencySymbol &&
            currency &&
            currencyPosition === "prefix" &&
            "pl-7",
          showCurrencySymbol &&
            currency &&
            currencyPosition === "suffix" &&
            "pr-7",
          className,
        )}
        {...props}
      />
    );

    if (!showCurrencySymbol || !currency) {
      return inputContent;
    }

    return (
      <div className="relative">
        {currencyPosition === "prefix" && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {currency}
          </span>
        )}
        {inputContent}
        {currencyPosition === "suffix" && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {currency}
          </span>
        )}
      </div>
    );
  },
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput, formatCurrency, parseFormattedValue };
