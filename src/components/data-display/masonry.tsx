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
const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ columns = 3, gap = 16, children, className, style, ...props }, ref) => {
    const getResponsiveClasses = () => {
      if (typeof columns === "number") {
        return "";
      }

      const classes: string[] = [];
      if (columns.sm) classes.push(`sm:columns-${columns.sm}`);
      if (columns.md) classes.push(`md:columns-${columns.md}`);
      if (columns.lg) classes.push(`lg:columns-${columns.lg}`);
      if (columns.xl) classes.push(`xl:columns-${columns.xl}`);

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
