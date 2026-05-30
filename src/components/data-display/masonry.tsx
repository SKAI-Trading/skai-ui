"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  /** Gap between items in pixels */
  gap?: number;
  /** Children to render in masonry layout */
  children: React.ReactNode;
}

/**
 * Masonry Layout Component
 *
 * Creates a Pinterest-style masonry grid layout using CSS columns.
 * Automatically distributes items into columns based on available space.
 *
 * @example
 * <Masonry columns={3} gap={16}>
 *   {items.map(item => <Card key={item.id}>{item.content}</Card>)}
 * </Masonry>
 *
 * @example
 * // Responsive columns
 * <Masonry columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={24}>
 *   {items.map(item => <Card key={item.id}>{item.content}</Card>)}
 * </Masonry>
 */
// Static class lookups so Tailwind's JIT can actually see (and emit) every
// breakpoint/column combination. Interpolating `sm:columns-${n}` at runtime
// produces class names the content scanner never sees, so the CSS is never
// generated and responsive masonry silently collapses to a single column.
const COLUMN_CLASSES: Record<
  "sm" | "md" | "lg" | "xl",
  Record<number, string>
> = {
  sm: {
    1: "sm:columns-1",
    2: "sm:columns-2",
    3: "sm:columns-3",
    4: "sm:columns-4",
    5: "sm:columns-5",
    6: "sm:columns-6",
  },
  md: {
    1: "md:columns-1",
    2: "md:columns-2",
    3: "md:columns-3",
    4: "md:columns-4",
    5: "md:columns-5",
    6: "md:columns-6",
  },
  lg: {
    1: "lg:columns-1",
    2: "lg:columns-2",
    3: "lg:columns-3",
    4: "lg:columns-4",
    5: "lg:columns-5",
    6: "lg:columns-6",
  },
  xl: {
    1: "xl:columns-1",
    2: "xl:columns-2",
    3: "xl:columns-3",
    4: "xl:columns-4",
    5: "xl:columns-5",
    6: "xl:columns-6",
  },
};

const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ columns = 3, gap = 16, children, className, style, ...props }, ref) => {
    const getResponsiveClasses = () => {
      if (typeof columns === "number") {
        return "";
      }

      const classes: string[] = [];
      (["sm", "md", "lg", "xl"] as const).forEach((bp) => {
        const count = columns[bp];
        if (count) {
          // Fall back to a literal class only when within the static range;
          // out-of-range counts simply use the closest emitted class.
          const cls = COLUMN_CLASSES[bp][count] ?? COLUMN_CLASSES[bp][6];
          classes.push(cls);
        }
      });

      return classes.join(" ");
    };

    return (
      <div
        ref={ref}
        className={cn(
          typeof columns === "number" ? "" : "columns-1",
          getResponsiveClasses(),
          className,
        )}
        style={{
          columnCount: typeof columns === "number" ? columns : undefined,
          columnGap: gap,
          ...style,
        }}
        {...props}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="break-inside-avoid"
            style={{ marginBottom: gap }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  },
);

Masonry.displayName = "Masonry";

/**
 * MasonryItem - Optional wrapper for masonry items with animation
 */
interface MasonryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation delay based on index */
  index?: number;
  /** Enable fade-in animation */
  animate?: boolean;
}

const MasonryItem = React.forwardRef<HTMLDivElement, MasonryItemProps>(
  (
    { index = 0, animate = true, className, style, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "break-inside-avoid",
          animate && "animate-in fade-in-0 slide-in-from-bottom-4",
          className,
        )}
        style={{
          animationDelay: animate ? `${index * 50}ms` : undefined,
          animationFillMode: "backwards",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

MasonryItem.displayName = "MasonryItem";

export { Masonry, MasonryItem };
export type { MasonryProps, MasonryItemProps };
