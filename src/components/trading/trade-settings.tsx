import * as React from "react";
import { cn } from "../../lib/utils";
import { Input } from "../core/input";
import { Label } from "../core/label";
import { Button } from "../core/button";
import { Popover, PopoverContent, PopoverTrigger } from "../overlays/popover";
import { SettingsIcon, ChevronDownIcon } from "lucide-react";

// Slippage Selector Component
export interface SlippageSelectorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** Current slippage value in percentage */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Preset values */
  presets?: number[];
  /** Maximum allowed slippage */
  max?: number;
  /** Show warning above threshold */
  warningThreshold?: number;
  /** Show error above threshold */
  errorThreshold?: number;
  /** Compact mode (just shows value) */
  compact?: boolean;
  /** Label */
  label?: string;
}

const SlippageSelector = React.forwardRef<
  HTMLDivElement,
  SlippageSelectorProps
>(
  (
    {
      value,
      onChange,
      presets = [0.1, 0.5, 1.0],
      max = 50,
      warningThreshold = 1,
      errorThreshold = 5,
      compact = false,
      label = "Slippage Tolerance",
      className,
      ...props
    },
    ref,
  ) => {
    const [customValue, setCustomValue] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    const isWarning = value > warningThreshold && value <= errorThreshold;
    const isError = value > errorThreshold;
    const isCustom = !presets.includes(value);

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setCustomValue(raw);
      const parsed = parseFloat(raw);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= max) {
        onChange(parsed);
      }
    };

    const handlePresetClick = (preset: number) => {
      onChange(preset);
      setCustomValue("");
    };

    if (compact) {
      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1 h-7 px-2 text-xs",
                isWarning && "text-yellow-500",
                isError && "text-red-500",
              )}
            >
              <SettingsIcon className="h-3 w-3" />
              {value}%
              <ChevronDownIcon className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="end">
            <SlippageSelectorContent
              value={value}
              onChange={onChange}
              presets={presets}
              max={max}
              warningThreshold={warningThreshold}
              errorThreshold={errorThreshold}
              customValue={customValue}
              onCustomChange={handleCustomChange}
              onPresetClick={handlePresetClick}
              isCustom={isCustom}
              isWarning={isWarning}
              isError={isError}
            />
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <Label>{label}</Label>
        <SlippageSelectorContent
          value={value}
          onChange={onChange}
          presets={presets}
          max={max}
          warningThreshold={warningThreshold}
          errorThreshold={errorThreshold}
          customValue={customValue}
          onCustomChange={handleCustomChange}
          onPresetClick={handlePresetClick}
          isCustom={isCustom}
          isWarning={isWarning}
          isError={isError}
        />
      </div>
    );
  },
);
SlippageSelector.displayName = "SlippageSelector";

// Internal content component
interface SlippageSelectorContentProps {
  value: number;
  onChange: (value: number) => void;
  presets: number[];
  max: number;
  warningThreshold: number;
  errorThreshold: number;
  customValue: string;
  onCustomChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPresetClick: (preset: number) => void;
  isCustom: boolean;
  isWarning: boolean;
  isError: boolean;
}

const SlippageSelectorContent: React.FC<SlippageSelectorContentProps> = ({
  presets,
  customValue,
  onCustomChange,
  onPresetClick,
  isCustom,
  isWarning,
  isError,
  value,
}) => (
  <div className="space-y-3">
    <div className="flex gap-2">
      {presets.map((preset) => (
        <Button
          key={preset}
          variant={value === preset ? "default" : "outline"}
          size="sm"
          onClick={() => onPresetClick(preset)}
          className="flex-1"
        >
          {preset}%
        </Button>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="Custom"
        value={customValue}
        onChange={onCustomChange}
        className={cn(
          "text-right",
          isCustom && isWarning && "border-yellow-500",
          isCustom && isError && "border-red-500",
        )}
        min={0}
        max={50}
        step={0.1}
      />
      <span className="text-sm text-muted-foreground">%</span>
    </div>
    {isWarning && (
      <p className="text-xs text-yellow-500">
        High slippage may result in an unfavorable trade
      </p>
    )}
    {isError && (
      <p className="text-xs text-red-500">
        Very high slippage - transaction may be frontrun
      </p>
    )}
  </div>
);

// Deadline Selector Component
export interface DeadlineSelectorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** Current deadline in minutes */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Preset values in minutes */
  presets?: number[];
  /** Maximum deadline in minutes */
  max?: number;
  /** Label */
  label?: string;
  /** Compact mode */
  compact?: boolean;
}

const DeadlineSelector = React.forwardRef<
  HTMLDivElement,
  DeadlineSelectorProps
>(
  (
    {
      value,
      onChange,
      presets = [10, 20, 30, 60],
      max = 180,
      label = "Transaction Deadline",
      compact = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [customValue, setCustomValue] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setCustomValue(raw);
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= max) {
        onChange(parsed);
      }
    };

    const formatDeadline = (minutes: number) => {
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
      }
      return `${minutes}m`;
    };

    const content = (
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {presets.map((preset) => (
            <Button
              key={preset}
              variant={value === preset ? "default" : "outline"}
              size="sm"
              onClick={() => {
                onChange(preset);
                setCustomValue("");
              }}
            >
              {formatDeadline(preset)}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Custom"
            value={customValue}
            onChange={handleCustomChange}
            min={1}
            max={max}
          />
          <span className="text-sm text-muted-foreground">minutes</span>
        </div>
      </div>
    );

    if (compact) {
      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-7 px-2 text-xs"
            >
              {formatDeadline(value)}
              <ChevronDownIcon className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="end">
            {content}
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <Label>{label}</Label>
        {content}
      </div>
    );
  },
);
DeadlineSelector.displayName = "DeadlineSelector";

export { SlippageSelector, DeadlineSelector };
