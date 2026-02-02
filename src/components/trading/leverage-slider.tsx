import * as React from "react";
import { cn } from "../../lib/utils";
import { Slider } from "../forms/slider";
import { Input } from "../core/input";
import { Badge } from "../core/badge";

export interface LeverageSliderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** Current leverage value */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Minimum leverage */
  min?: number;
  /** Maximum leverage */
  max?: number;
  /** Step increment */
  step?: number;
  /** Show quick select buttons */
  showQuickSelect?: boolean;
  /** Quick select values */
  quickSelectValues?: number[];
  /** Show input field */
  showInput?: boolean;
  /** Show risk indicator */
  showRiskIndicator?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

const getRiskLevel = (leverage: number, max: number) => {
  const ratio = leverage / max;
  if (ratio <= 0.25)
    return { level: "low", color: "text-green-500", bg: "bg-green-500" };
  if (ratio <= 0.5)
    return { level: "medium", color: "text-yellow-500", bg: "bg-yellow-500" };
  if (ratio <= 0.75)
    return { level: "high", color: "text-orange-500", bg: "bg-orange-500" };
  return { level: "extreme", color: "text-red-500", bg: "bg-red-500" };
};

const LeverageSlider = React.forwardRef<HTMLDivElement, LeverageSliderProps>(
  (
    {
      value,
      onChange,
      min = 1,
      max = 100,
      step = 1,
      showQuickSelect = true,
      quickSelectValues = [1, 5, 10, 25, 50, 100],
      showInput = true,
      showRiskIndicator = true,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const risk = getRiskLevel(value, max);
    const [inputValue, setInputValue] = React.useState(value.toString());

    React.useEffect(() => {
      setInputValue(value.toString());
    }, [value]);

    const handleSliderChange = (values: number[]) => {
      onChange(values[0]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setInputValue(raw);
      const parsed = parseFloat(raw);
      if (!isNaN(parsed) && parsed >= min && parsed <= max) {
        onChange(parsed);
      }
    };

    const handleInputBlur = () => {
      const parsed = parseFloat(inputValue);
      if (isNaN(parsed) || parsed < min) {
        onChange(min);
        setInputValue(min.toString());
      } else if (parsed > max) {
        onChange(max);
        setInputValue(max.toString());
      }
    };

    const filteredQuickSelect = quickSelectValues.filter(
      (v) => v >= min && v <= max,
    );

    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {/* Header with value display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Leverage</span>
            {showRiskIndicator && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs capitalize",
                  risk.color,
                  "border-current",
                )}
              >
                {risk.level} risk
              </Badge>
            )}
          </div>
          {showInput ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className="w-16 h-8 text-center text-sm"
              />
              <span className="text-sm font-medium">x</span>
            </div>
          ) : (
            <span className={cn("text-lg font-bold", risk.color)}>
              {value}x
            </span>
          )}
        </div>

        {/* Slider with risk gradient */}
        <div className="relative">
          <div
            className="absolute inset-0 h-2 rounded-full"
            style={{
              background:
                "linear-gradient(to right, #22c55e 0%, #eab308 33%, #f97316 66%, #ef4444 100%)",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <Slider
            value={[value]}
            onValueChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className="relative"
          />
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min}x</span>
          <span>{max}x</span>
        </div>

        {/* Quick select buttons */}
        {showQuickSelect && filteredQuickSelect.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filteredQuickSelect.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onChange(v)}
                disabled={disabled}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md border transition-colors",
                  value === v
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border",
                  disabled && "opacity-50 cursor-not-allowed",
                )}
              >
                {v}x
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
LeverageSlider.displayName = "LeverageSlider";

export { LeverageSlider };
