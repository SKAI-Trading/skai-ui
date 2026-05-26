import * as React from "react";
import { cn } from "../../lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "../core/button";
import { Input } from "../core/input";

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
    // Hold the latest format/parse callbacks in refs so consumers can pass
    // inline `formatValue={(v) => v.toFixed(2)}` without re-firing the sync
    // effect on every parent render (which would wipe in-flight keystrokes
    // and break controlled typing). The callback identity drifts every
    // render; the underlying behaviour is captured at call time instead.
    const formatValueRef = React.useRef(formatValue);
    const parseValueRef = React.useRef(parseValue);
    React.useEffect(() => {
      formatValueRef.current = formatValue;
      parseValueRef.current = parseValue;
    });

    const [inputValue, setInputValue] = React.useState(() =>
      formatValueRef.current(value),
    );

    // Sync input value when the numeric prop changes. Intentionally NOT
    // depending on the formatter — see ref dance above.
    React.useEffect(() => {
      setInputValue(formatValueRef.current(value));
    }, [value]);

    const clamp = (v: number) => Math.min(max, Math.max(min, v));

    const increment = (factor = 1) => {
      const newValue = clamp(value + step * factor);
      onChange(newValue);
    };

    const decrement = (factor = 1) => {
      const newValue = clamp(value - step * factor);
      onChange(newValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setInputValue(raw);
      const parsed = parseValueRef.current(raw);
      if (!isNaN(parsed)) {
        onChange(clamp(parsed));
      }
    };

    const handleBlur = () => {
      setInputValue(formatValueRef.current(value));
    };

    // ArrowUp / ArrowDown step the value. Shift increases the step 10x to match
    // spinbutton conventions in most UI kits (Material / Carbon / FAST).
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        increment(e.shiftKey ? 10 : 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        decrement(e.shiftKey ? 10 : 1);
      }
    };

    const DecrementButton = (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={(e) => decrement(e.shiftKey ? 10 : 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease value"
      >
        <MinusIcon className="h-4 w-4" aria-hidden="true" />
      </Button>
    );

    const IncrementButton = (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={(e) => increment(e.shiftKey ? 10 : 1)}
        disabled={disabled || value >= max}
        aria-label="Increase value"
      >
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
      </Button>
    );

    if (buttonPosition === "right") {
      return (
        <div className={cn("flex items-center gap-1", className)}>
          <Input
            ref={ref}
            type="text"
            inputMode="numeric"
            role="spinbutton"
            aria-valuenow={value}
            aria-valuemin={Number.isFinite(min) ? min : undefined}
            aria-valuemax={Number.isFinite(max) ? max : undefined}
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
          role="spinbutton"
          aria-valuenow={value}
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
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
