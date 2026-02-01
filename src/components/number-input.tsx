import * as React from "react";
import { cn } from "../lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  /** Current value */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Show +/- buttons */
  showButtons?: boolean;
  /** Button position */
  buttonPosition?: "sides" | "right";
  /** Format display value */
  formatValue?: (value: number) => string;
  /** Parse input string to number */
  parseValue?: (value: string) => number;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      showButtons = true,
      buttonPosition = "sides",
      formatValue = (v) => v.toString(),
      parseValue = (v) => parseFloat(v) || 0,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState(formatValue(value));

    // Sync input value when prop changes
    React.useEffect(() => {
      setInputValue(formatValue(value));
    }, [value, formatValue]);

    const clamp = (v: number) => Math.min(max, Math.max(min, v));

    const increment = () => {
      const newValue = clamp(value + step);
      onChange(newValue);
    };

    const decrement = () => {
      const newValue = clamp(value - step);
      onChange(newValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setInputValue(raw);
      const parsed = parseValue(raw);
      if (!isNaN(parsed)) {
        onChange(clamp(parsed));
      }
    };

    const handleBlur = () => {
      setInputValue(formatValue(value));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        increment();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        decrement();
      }
    };

    const DecrementButton = (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Decrease value"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
    );

    const IncrementButton = (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={increment}
        disabled={disabled || value >= max}
        aria-label="Increase value"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    );

    if (buttonPosition === "right") {
      return (
        <div className={cn("flex items-center gap-1", className)}>
          <Input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="text-center"
            {...props}
          />
          {showButtons && (
            <div className="flex flex-col gap-0.5">
              {IncrementButton}
              {DecrementButton}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={cn("flex items-center gap-2", className)}>
        {showButtons && DecrementButton}
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="text-center"
          {...props}
        />
        {showButtons && IncrementButton}
      </div>
    );
  },
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
