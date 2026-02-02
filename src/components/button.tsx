import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

// =============================================================================
// SHADCN BUTTON (Backwards Compatible)
// =============================================================================

const buttonVariants = cva(
  // Use SKAI typography class for consistency
  "skai-para-1-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

// =============================================================================
// SKAI BRANDED BUTTON (Perfect Figma Alignment)
// =============================================================================
// Uses SKAI typography system classes and design tokens
// - Typography: Uses skai-* classes for perfect consistency
// - Colors: Uses design token color values
// - Sizes: Aligned with Figma specifications
// =============================================================================

const skaiButtonVariants = cva(
  // Base: SKAI typography system + design system patterns
  "inline-flex items-center justify-center font-subheading transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      // SKAI Button Types (using design tokens)
      skaiType: {
        // Primary: Sky Blue (#56C0F6) bg, Green Coal text, hover → Teal (#2DEDAD)
        primary:
          "skai-sub-2-semibold bg-[#56C0F6] text-[#001615] hover:bg-[#2DEDAD] focus-visible:ring-[#2DEDAD]",
        // Secondary: Transparent bg, Sky Blue border/text
        secondary:
          "skai-sub-2-semibold bg-transparent border border-[#56C0F6] text-[#56C0F6] hover:bg-[#56C0F6]/10 focus-visible:ring-[#56C0F6]",
        // Tertiary: Transparent bg, White text, hover → Teal
        tertiary:
          "skai-sub-2 bg-transparent text-white hover:text-[#2DEDAD] focus-visible:ring-[#2DEDAD]",
        // Link: Teal text, underlined
        link: "skai-sub-2 bg-transparent text-[#2DEDAD] hover:text-[#56C0F6] underline underline-offset-4",
        // Destructive: Red theme for dangerous actions
        destructive:
          "skai-sub-2-semibold bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        // Success: Green theme for positive actions  
        success:
          "skai-sub-2-semibold bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600",
      },
      // SKAI Button Sizes (aligned with design system spacing)
      skaiSize: {
        // Massive: For hero CTAs and major actions
        massive:
          "h-[72px] px-12 py-5 rounded-2xl gap-3 [&_svg]:size-6",
        // Large: Primary action buttons
        large:
          "h-16 px-10 py-5 rounded-2xl gap-2.5 [&_svg]:size-5",
        // Medium: Standard UI buttons  
        medium:
          "h-[50px] px-8 py-3.5 rounded-xl gap-2 [&_svg]:size-4",
        // Small: Compact buttons for tight spaces
        small:
          "h-[46px] px-6 py-3 rounded-xl gap-2 [&_svg]:size-4",
        // Mini: Very small buttons for tables/lists
        mini:
          "h-8 px-4 py-1.5 rounded-lg gap-1 [&_svg]:size-3",
      },
    },
    defaultVariants: {
      skaiType: "primary",
      skaiSize: "medium",
    },
  },
);

export interface SkaiButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof skaiButtonVariants> {
  asChild?: boolean;
}

/**
 * SKAI Branded Button - Perfect Figma Design System Alignment
 * 
 * Uses SKAI typography classes and design tokens for perfect consistency.
 * All typography automatically scales responsively via CSS classes.
 *
 * @example
 * // Primary button (default - medium size, primary type)
 * <SkaiButton>Get Started</SkaiButton>
 *
 * // Large secondary button
 * <SkaiButton skaiType="secondary" skaiSize="large">Learn More</SkaiButton>
 *
 * // Small tertiary button
 * <SkaiButton skaiType="tertiary" skaiSize="small">Cancel</SkaiButton>
 * 
 * // Massive primary CTA
 * <SkaiButton skaiSize="massive">Start Trading</SkaiButton>
 *
 * // Destructive action
 * <SkaiButton skaiType="destructive" skaiSize="small">Delete</SkaiButton>
 */
const SkaiButton = React.forwardRef<HTMLButtonElement, SkaiButtonProps>(
  ({ className, skaiType, skaiSize, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(skaiButtonVariants({ skaiType, skaiSize, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
SkaiButton.displayName = "SkaiButton";

export { Button, buttonVariants, SkaiButton, skaiButtonVariants };
