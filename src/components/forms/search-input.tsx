import * as React from "react";
import { cn } from "../../lib/utils";
import { Input, InputProps } from "../core/input";
import { Search, X, Loader2 } from "lucide-react";

export interface SearchInputProps extends Omit<InputProps, "type" | "size"> {
  /** Show loading spinner */
  isLoading?: boolean;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Show clear button (default: true when value exists) */
  showClearButton?: boolean;
  /** Icon to show (default: Search) */
  icon?: React.ReactNode;
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Debounce delay in ms (0 = no debounce) */
  debounceMs?: number;
  /** Callback for debounced value */
  onDebouncedChange?: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value,
      onChange,
      onClear,
      showClearButton,
      isLoading = false,
      icon,
      size = "default",
      debounceMs = 0,
      onDebouncedChange,
      placeholder = "Search...",
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const debounceTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Sync internal value with controlled value
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    // Handle debounced callback
    React.useEffect(() => {
      if (debounceMs > 0 && onDebouncedChange) {
        debounceTimeoutRef.current = setTimeout(() => {
          onDebouncedChange(String(internalValue));
        }, debounceMs);

        return () => {
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
          }
        };
      }
    }, [internalValue, debounceMs, onDebouncedChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue("");
      onClear?.();

      // Create synthetic event for onChange
      if (onChange && inputRef.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeInputValueSetter?.call(inputRef.current, "");
        const event = new Event("input", { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }

      // Focus input after clear
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && internalValue) {
        e.preventDefault();
        handleClear();
      }
      props.onKeyDown?.(e);
    };

    const hasValue = Boolean(internalValue);
    const shouldShowClear = showClearButton ?? hasValue;

    const sizeStyles = {
      sm: {
        input: "h-8 text-sm pl-8 pr-8",
        icon: "left-2 h-3.5 w-3.5",
        clear: "right-2 h-3.5 w-3.5",
      },
      default: {
        input: "h-10 pl-10 pr-10",
        icon: "left-3 h-4 w-4",
        clear: "right-3 h-4 w-4",
      },
      lg: {
        input: "h-12 text-lg pl-12 pr-12",
        icon: "left-4 h-5 w-5",
        clear: "right-4 h-5 w-5",
      },
    };

    const combinedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
          node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    return (
      <div className="relative">
        {/* Search icon or custom icon */}
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
            sizeStyles[size].icon,
          )}
        >
          {icon || <Search className="h-full w-full" />}
        </span>

        <Input
          ref={combinedRef}
          type="search"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            sizeStyles[size].input,
            // Hide native search clear button
            "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
            className,
          )}
          aria-label={props["aria-label"] || placeholder}
          {...props}
        />

        {/* Clear button or loading spinner */}
        {(shouldShowClear || isLoading) && (
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2 flex items-center",
              sizeStyles[size].clear,
            )}
          >
            {isLoading ? (
              <Loader2
                className="h-full w-full text-muted-foreground animate-spin"
                aria-label="Loading"
              />
            ) : shouldShowClear && hasValue ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                aria-label="Clear search"
              >
                <X className="h-full w-full" />
              </button>
            ) : null}
          </span>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
