import * as React from "react";
import { format, isValid, parse } from "date-fns";
import {
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../core/button";
import { Input } from "../core/input";
import { Popover, PopoverContent, PopoverTrigger } from "../overlays/popover";

/**
 * Internal simple calendar component for date selection
 * Note: Use `Calendar` from "../data-display/calendar" for the full-featured react-day-picker version
 */
interface SimpleCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const SimpleCalendar = ({
  selected,
  onSelect,
  disabled,
  minDate,
  maxDate,
  className,
}: SimpleCalendarProps) => {
  const [viewDate, setViewDate] = React.useState(selected || new Date());

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1,
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isDateDisabled = (date: Date) => {
    if (disabled?.(date)) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const isToday = (date: Date) => isSameDay(date, new Date());

  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
  }

  return (
    <div className={cn("p-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-muted-foreground font-medium py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => (
          <div key={i} className="aspect-square">
            {date ? (
              <button
                type="button"
                disabled={isDateDisabled(date)}
                onClick={() => onSelect?.(date)}
                className={cn(
                  "w-full h-full rounded-md text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                  isToday(date) && "border border-primary",
                  selected &&
                    isSameDay(date, selected) &&
                    "bg-primary text-primary-foreground",
                )}
              >
                {date.getDate()}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export interface DatePickerProps {
  /** Currently selected date */
  value?: Date;
  /** Callback when date changes */
  onChange?: (date: Date | undefined) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Date format string (date-fns format) */
  dateFormat?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Function to disable specific dates */
  disabled?: (date: Date) => boolean;
  /** Whether the input is disabled */
  inputDisabled?: boolean;
  /** Whether to allow clearing the date */
  clearable?: boolean;
  /** Whether to allow manual input */
  allowInput?: boolean;
  /** Custom className */
  className?: string;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Size variant */
  size?: "sm" | "default" | "lg";
}

/**
 * DatePicker component for selecting dates with a calendar popup.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [date, setDate] = useState<Date>();
 * <DatePicker value={date} onChange={setDate} />
 *
 * // With constraints
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   minDate={new Date()}
 *   maxDate={new Date(2026, 11, 31)}
 *   placeholder="Select a future date"
 * />
 *
 * // With manual input
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   allowInput={true}
 *   dateFormat="yyyy-MM-dd"
 *   clearable={true}
 * />
 * ```
 */
export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select date",
      dateFormat = "PPP",
      minDate,
      maxDate,
      disabled,
      inputDisabled = false,
      clearable = true,
      allowInput = false,
      className,
      error = false,
      errorMessage,
      size = "default",
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    // Sync input value with selected date
    React.useEffect(() => {
      if (value && isValid(value)) {
        setInputValue(format(value, dateFormat));
      } else {
        setInputValue("");
      }
    }, [value, dateFormat]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (allowInput && newValue) {
        // Try to parse the input
        const parsed = parse(newValue, dateFormat, new Date());
        if (isValid(parsed)) {
          onChange?.(parsed);
        }
      }
    };

    const handleSelect = (date: Date | undefined) => {
      onChange?.(date);
      setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
      setInputValue("");
    };

    const sizeClasses = {
      sm: "h-8 text-xs",
      default: "h-10",
      lg: "h-12 text-lg",
    };

    return (
      <div ref={ref} className={cn("relative", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              {allowInput ? (
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  disabled={inputDisabled}
                  error={error ? errorMessage : undefined}
                  className={cn(
                    sizeClasses[size],
                    "pr-10",
                    !value && "text-muted-foreground",
                  )}
                />
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  disabled={inputDisabled}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    sizeClasses[size],
                    !value && "text-muted-foreground",
                    error && "border-destructive",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value && isValid(value)
                    ? format(value, dateFormat)
                    : placeholder}
                </Button>
              )}

              {clearable && value && !inputDisabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {allowInput && (
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <SimpleCalendar
              selected={value}
              onSelect={handleSelect}
              disabled={disabled}
              minDate={minDate}
              maxDate={maxDate}
            />
          </PopoverContent>
        </Popover>

        {error && errorMessage && (
          <p className="mt-1 text-xs text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";

export { SimpleCalendar, type SimpleCalendarProps };
export default DatePicker;
