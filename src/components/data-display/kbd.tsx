import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const kbdVariants = cva(
  "pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted font-mono text-muted-foreground",
  {
    variants: {
      size: {
        sm: "h-5 px-1 text-[10px]",
        default: "h-6 px-1.5 text-xs",
        lg: "h-8 px-2 text-sm",
      },
      variant: {
        default: "border-border",
        outline: "border-border bg-transparent",
        solid:
          "border-transparent bg-foreground text-background",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {
  /**
   * Optional sequence of keys to render as separate <kbd> tags joined with "+".
   * Example: keys={["⌘", "K"]} renders <kbd>⌘</kbd> + <kbd>K</kbd>.
   * When provided, `children` is ignored.
   */
  keys?: React.ReactNode[];
}

/**
 * Kbd — semantic <kbd> primitive for keyboard hints.
 *
 * @example
 * <Kbd>⌘K</Kbd>
 * <Kbd keys={["⌘", "K"]} />
 * <Kbd size="sm" variant="outline">Esc</Kbd>
 */
const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, size, variant, keys, children, ...props }, ref) => {
    if (keys && keys.length > 0) {
      return (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          className="inline-flex items-center gap-1"
          {...props}
        >
          {keys.map((key, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <span className="text-xs text-muted-foreground" aria-hidden="true">
                  +
                </span>
              )}
              <kbd className={cn(kbdVariants({ size, variant }), className)}>
                {key}
              </kbd>
            </React.Fragment>
          ))}
        </span>
      );
    }
    return (
      <kbd
        ref={ref as React.Ref<HTMLElement>}
        className={cn(kbdVariants({ size, variant, className }))}
        {...props}
      >
        {children}
      </kbd>
    );
  },
);
Kbd.displayName = "Kbd";

export { Kbd, kbdVariants };
