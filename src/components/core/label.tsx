import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

// =============================================================================
// SKAI TAG/LABEL (From Figma Design System - Labels Section)
// =============================================================================
// Uses SKAI design tokens: 3 sizes × 3 types
// - Sizes: large (18px height), medium (14px height), small (14px height)
// - Types: fill (solid bg), stroke (bordered), flag (slight radius)
// =============================================================================

const skaiTagVariants = cva(
  // Base: Mulish font, inline-flex, smooth transitions
  "inline-flex items-center font-['Mulish'] font-normal transition-colors",
  {
    variants: {
      // SKAI Tag Types (from Figma Labels section)
      tagType: {
        // Fill: Solid Alien Green background
        fill: "bg-[#17F9B4] text-[#001615]",
        // Stroke: Transparent with Alien Green border
        stroke: "bg-transparent border border-[#17F9B4] text-[#17F9B4]",
        // Flag: Solid background with slight radius
        flag: "bg-[#17F9B4] text-[#001615]",
      },
      // SKAI Tag Sizes (from Figma)
      tagSize: {
        // Large: 18px height
        large:
          "h-[18px] px-2 py-0.5 text-[11px] leading-[14px] gap-1 rounded-full",
        // Medium: 14px height
        medium:
          "h-[14px] px-1.5 py-0.5 text-[10px] leading-[12px] gap-0.5 rounded-full",
        // Small: 14px height (same as medium in Figma)
        small:
          "h-[14px] px-1.5 py-0.5 text-[10px] leading-[12px] gap-0.5 rounded-full",
      },
    },
    compoundVariants: [
      // Flag type gets smaller border radius
      { tagType: "flag", tagSize: "large", className: "rounded" },
      { tagType: "flag", tagSize: "medium", className: "rounded-sm" },
      { tagType: "flag", tagSize: "small", className: "rounded-sm" },
    ],
    defaultVariants: {
      tagType: "fill",
      tagSize: "large",
    },
  },
);

export interface SkaiTagProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof skaiTagVariants> {
  /** Optional icon before text */
  icon?: React.ReactNode;
}

/**
 * SKAI Tag - Uses Figma design system tokens
 *
 * @example
 * // Fill tag (default)
 * <SkaiTag>Live</SkaiTag>
 *
 * // Stroke tag
 * <SkaiTag tagType="stroke">Beta</SkaiTag>
 *
 * // Flag with icon
 * <SkaiTag tagType="flag" icon={<FlagIcon />}>USA</SkaiTag>
 */
const SkaiTag = React.forwardRef<HTMLSpanElement, SkaiTagProps>(
  ({ className, tagType, tagSize, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(skaiTagVariants({ tagType, tagSize, className }))}
        {...props}
      >
        {icon && (
          <span
            className={cn(
              "[&_svg]:shrink-0",
              tagSize === "large" ? "[&_svg]:size-2.5" : "[&_svg]:size-2",
            )}
          >
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  },
);
SkaiTag.displayName = "SkaiTag";

export { Label, SkaiTag, skaiTagVariants };
