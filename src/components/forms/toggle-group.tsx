import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { toggleVariants } from "./toggle";

// =============================================================================
// ToggleGroup — single / multiple selection group built from native + a11y
// =============================================================================
// No external radix-toggle-group dep — implemented as a lightweight roving-focus
// group on top of the existing toggleVariants styling. Mirrors the Radix API
// shape (type="single" | "multiple", value, defaultValue, onValueChange).
// =============================================================================

type ToggleGroupContextValue = {
  value: string | string[];
  type: "single" | "multiple";
  size?: VariantProps<typeof toggleVariants>["size"];
  variant?: VariantProps<typeof toggleVariants>["variant"];
  disabled?: boolean;
  onItemSelect: (value: string) => void;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
  null,
);

const toggleGroupVariants = cva("inline-flex items-center justify-center gap-1", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: { orientation: "horizontal" },
});

export type ToggleGroupSingleProps = {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type ToggleGroupMultipleProps = {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type ToggleGroupProps =
  & React.HTMLAttributes<HTMLDivElement>
  & VariantProps<typeof toggleGroupVariants>
  & VariantProps<typeof toggleVariants>
  & { disabled?: boolean }
  & (ToggleGroupSingleProps | ToggleGroupMultipleProps);

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (props, ref) => {
    const {
      className,
      orientation,
      size,
      variant,
      disabled,
      children,
      type,
      ...rest
    } = props;

    const isControlled =
      (type === "single" && (props as ToggleGroupSingleProps).value !== undefined) ||
      (type === "multiple" &&
        (props as ToggleGroupMultipleProps).value !== undefined);

    const [internal, setInternal] = React.useState<string | string[]>(() => {
      if (type === "single") {
        return (props as ToggleGroupSingleProps).defaultValue ?? "";
      }
      return (props as ToggleGroupMultipleProps).defaultValue ?? [];
    });

    const currentValue = isControlled
      ? (type === "single"
        ? (props as ToggleGroupSingleProps).value ?? ""
        : (props as ToggleGroupMultipleProps).value ?? [])
      : internal;

    const onItemSelect = React.useCallback(
      (itemValue: string) => {
        if (type === "single") {
          const next = currentValue === itemValue ? "" : itemValue;
          if (!isControlled) setInternal(next);
          (props as ToggleGroupSingleProps).onValueChange?.(next);
        } else {
          const arr = Array.isArray(currentValue) ? currentValue : [];
          const next = arr.includes(itemValue)
            ? arr.filter((v) => v !== itemValue)
            : [...arr, itemValue];
          if (!isControlled) setInternal(next);
          (props as ToggleGroupMultipleProps).onValueChange?.(next);
        }
      },
      [currentValue, isControlled, props, type],
    );

    // Strip props that don't belong on the DOM element
    const domProps = { ...rest } as React.HTMLAttributes<HTMLDivElement>;
    delete (domProps as Record<string, unknown>).value;
    delete (domProps as Record<string, unknown>).defaultValue;
    delete (domProps as Record<string, unknown>).onValueChange;

    const ariaOrientation =
      orientation === "vertical" ? "vertical" : "horizontal";

    return (
      <ToggleGroupContext.Provider
        value={{
          value: currentValue,
          type,
          size,
          variant,
          disabled,
          onItemSelect,
        }}
      >
        <div
          ref={ref}
          role={type === "single" ? "radiogroup" : "group"}
          aria-orientation={ariaOrientation}
          className={cn(toggleGroupVariants({ orientation, className }))}
          data-orientation={ariaOrientation}
          {...domProps}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  },
);
ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  value: string;
}

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(({ className, children, value, size, variant, disabled, onClick, onKeyDown, ...props }, ref) => {
  const ctx = React.useContext(ToggleGroupContext);
  if (!ctx) {
    throw new Error("ToggleGroupItem must be used within a ToggleGroup");
  }

  const isPressed = ctx.type === "single"
    ? ctx.value === value
    : Array.isArray(ctx.value) && ctx.value.includes(value);

  const effectiveDisabled = disabled || ctx.disabled;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    ctx.onItemSelect(value);
  };

  // Allow Space/Enter to toggle even when nested inside complex parents (a11y)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      ctx.onItemSelect(value);
    }
  };

  const role = ctx.type === "single" ? "radio" : undefined;
  const ariaPressed = ctx.type === "single" ? undefined : isPressed;
  const ariaChecked = ctx.type === "single" ? isPressed : undefined;

  return (
    <button
      ref={ref}
      type="button"
      role={role}
      data-state={isPressed ? "on" : "off"}
      aria-pressed={ariaPressed}
      aria-checked={ariaChecked}
      disabled={effectiveDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        toggleVariants({
          variant: variant ?? ctx.variant,
          size: size ?? ctx.size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants };
