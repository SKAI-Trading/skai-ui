/**
 * SKAI Layout Primitives
 *
 * Flexible layout components that designers can use to build any UI structure.
 * These components use CSS flexbox/grid and are fully customizable.
 *
 * Usage:
 *   import { Stack, Grid, Center, Container } from '@skai/ui';
 */

import * as React from "react";
import { cn } from "./utils";

/* ============================================
 * Stack - Vertical or horizontal stack
 * ============================================ */

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction of the stack */
  direction?: "horizontal" | "vertical";
  /** Shorthand: row = horizontal, col = vertical */
  dir?: "row" | "col";
  /** Gap between items (spacing scale: 0-24) */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
  /** Align items on cross axis */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Justify items on main axis */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Wrap items to next line */
  wrap?: boolean;
  /** Make stack full width */
  fullWidth?: boolean;
  /** Make stack full height */
  fullHeight?: boolean;
  /** Reverse the order */
  reverse?: boolean;
  /** As different element */
  as?: React.ElementType;
}

const gapMap: Record<number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
  20: "gap-20",
  24: "gap-24",
};

const alignMap: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyMap: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = "vertical",
      dir,
      gap = 4,
      align = "stretch",
      justify = "start",
      wrap = false,
      fullWidth = false,
      fullHeight = false,
      reverse = false,
      as: Component = "div",
      children,
      ...props
    },
    ref,
  ) => {
    const isHorizontal = dir === "row" || direction === "horizontal";

    return (
      <Component
        ref={ref}
        className={cn(
          "flex",
          isHorizontal
            ? reverse
              ? "flex-row-reverse"
              : "flex-row"
            : reverse
              ? "flex-col-reverse"
              : "flex-col",
          gapMap[gap],
          alignMap[align],
          justifyMap[justify],
          wrap && "flex-wrap",
          fullWidth && "w-full",
          fullHeight && "h-full",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Stack.displayName = "Stack";

/** Horizontal stack shorthand */
export const HStack = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, "direction" | "dir">
>((props, ref) => <Stack ref={ref} dir="row" {...props} />);
HStack.displayName = "HStack";

/** Vertical stack shorthand */
export const VStack = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, "direction" | "dir">
>((props, ref) => <Stack ref={ref} dir="col" {...props} />);
VStack.displayName = "VStack";

/* ============================================
 * Grid - CSS Grid layout
 * ============================================ */

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  /** Responsive columns: {sm: 1, md: 2, lg: 4} */
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6;
    md?: 1 | 2 | 3 | 4 | 5 | 6;
    lg?: 1 | 2 | 3 | 4 | 5 | 6;
    xl?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  /** Gap between items */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  /** Full width */
  fullWidth?: boolean;
}

const colsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      cols = 1,
      responsive,
      gap = 4,
      fullWidth = false,
      children,
      ...props
    },
    ref,
  ) => {
    const responsiveClasses = responsive
      ? [
          responsive.sm && `sm:grid-cols-${responsive.sm}`,
          responsive.md && `md:grid-cols-${responsive.md}`,
          responsive.lg && `lg:grid-cols-${responsive.lg}`,
          responsive.xl && `xl:grid-cols-${responsive.xl}`,
        ]
          .filter(Boolean)
          .join(" ")
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          colsMap[cols],
          gapMap[gap],
          fullWidth && "w-full",
          responsiveClasses,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Grid.displayName = "Grid";

/* ============================================
 * GridItem - Grid cell with span control
 * ============================================ */

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column span */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | "full";
  /** Row span */
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
}

const colSpanMap: Record<string | number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  12: "col-span-12",
  full: "col-span-full",
};

const rowSpanMap: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
};

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, colSpan = 1, rowSpan, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          colSpanMap[colSpan],
          rowSpan && rowSpanMap[rowSpan],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
GridItem.displayName = "GridItem";

/* ============================================
 * Center - Center content horizontally and vertically
 * ============================================ */

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use inline-flex instead of flex */
  inline?: boolean;
}

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, inline = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          inline ? "inline-flex" : "flex",
          "items-center justify-center",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Center.displayName = "Center";

/* ============================================
 * Container - Max-width container
 * ============================================ */

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max width size */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Center the container */
  center?: boolean;
  /** Horizontal padding */
  padding?: boolean;
}

const sizeMap: Record<string, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      size = "xl",
      center = true,
      padding = true,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          sizeMap[size],
          center && "mx-auto",
          padding && "px-4 md:px-6 lg:px-8",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Container.displayName = "Container";

/* ============================================
 * Spacer - Flexible space filler
 * ============================================ */

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fixed size (spacing scale) */
  size?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
  /** Grow to fill available space */
  flex?: boolean;
}

const spacerSizeMap: Record<number, string> = {
  0: "h-0 w-0",
  1: "h-1 w-1",
  2: "h-2 w-2",
  3: "h-3 w-3",
  4: "h-4 w-4",
  5: "h-5 w-5",
  6: "h-6 w-6",
  8: "h-8 w-8",
  10: "h-10 w-10",
  12: "h-12 w-12",
  16: "h-16 w-16",
  20: "h-20 w-20",
  24: "h-24 w-24",
};

export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size, flex = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          flex && "flex-1",
          size !== undefined && !flex && spacerSizeMap[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Spacer.displayName = "Spacer";

/* ============================================
 * Divider - Visual separator line
 * ============================================ */

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** With label */
  label?: string;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = "horizontal", label, ...props }, ref) => {
    if (label) {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-4", className)}
          {...props}
        >
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
          "bg-border",
          className,
        )}
        {...props}
      />
    );
  },
);
Divider.displayName = "Divider";

/* ============================================
 * AspectRatio - Maintain aspect ratio
 * ============================================ */

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio (width/height) */
  ratio?: number | "square" | "video" | "wide" | "ultrawide";
}

const ratioMap: Record<string, number> = {
  square: 1,
  video: 16 / 9,
  wide: 21 / 9,
  ultrawide: 32 / 9,
};

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = "video", children, style, ...props }, ref) => {
    const numericRatio = typeof ratio === "number" ? ratio : ratioMap[ratio];

    return (
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        style={{
          paddingBottom: `${100 / numericRatio}%`,
          ...style,
        }}
        {...props}
      >
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  },
);
AspectRatio.displayName = "AspectRatio";

/* ============================================
 * Hide - Conditionally hide content
 * ============================================ */

export interface HideProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hide on these breakpoints */
  below?: "sm" | "md" | "lg" | "xl";
  above?: "sm" | "md" | "lg" | "xl";
}

export const Hide = React.forwardRef<HTMLDivElement, HideProps>(
  ({ className, below, above, children, ...props }, ref) => {
    const hideClasses = [
      below === "sm" && "hidden sm:block",
      below === "md" && "hidden md:block",
      below === "lg" && "hidden lg:block",
      below === "xl" && "hidden xl:block",
      above === "sm" && "sm:hidden",
      above === "md" && "md:hidden",
      above === "lg" && "lg:hidden",
      above === "xl" && "xl:hidden",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={cn(hideClasses, className)} {...props}>
        {children}
      </div>
    );
  },
);
Hide.displayName = "Hide";

/* ============================================
 * Show - Conditionally show content
 * ============================================ */

export interface ShowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show only on these breakpoints */
  above?: "sm" | "md" | "lg" | "xl";
  below?: "sm" | "md" | "lg" | "xl";
}

export const Show = React.forwardRef<HTMLDivElement, ShowProps>(
  ({ className, above, below, children, ...props }, ref) => {
    const showClasses = [
      above === "sm" && "hidden sm:block",
      above === "md" && "hidden md:block",
      above === "lg" && "hidden lg:block",
      above === "xl" && "hidden xl:block",
      below === "sm" && "block sm:hidden",
      below === "md" && "block md:hidden",
      below === "lg" && "block lg:hidden",
      below === "xl" && "block xl:hidden",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={cn(showClasses, className)} {...props}>
        {children}
      </div>
    );
  },
);
Show.displayName = "Show";
