import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

// =============================================================================
// SHADCN BUTTON (Backwards Compatible)
// =============================================================================

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
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
// SKAI BRANDED BUTTON (From Figma Design System)
// =============================================================================
// Uses SKAI design tokens: 4 sizes × 4 types
// - Sizes: massive, large, medium, small
// - Types: primary (sky blue), secondary (outlined), tertiary (text), link
// =============================================================================

const skaiButtonVariants = cva(
  // Base: Manrope font, -4% letter spacing, centered flex, smooth transitions
  "inline-flex items-center justify-center font-['Manrope'] font-normal tracking-[-0.04em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      // SKAI Button Types (from Figma CTA section)
      skaiType: {
        // Primary: Sky Blue bg, Green Coal text, hover → Alien Green
        primary:
          "bg-[#56C7F3] text-[#001615] hover:bg-[#17F9B4] focus-visible:ring-[#17F9B4]",
        // Secondary: Transparent bg, Sky Blue border/text
        secondary:
          "bg-transparent border border-[#56C7F3] text-[#56C7F3] hover:bg-[#56C7F3]/10 focus-visible:ring-[#56C7F3]",
        // Tertiary: Transparent bg, White text, hover → Alien Green
        tertiary:
          "bg-transparent text-white hover:text-[#17F9B4] focus-visible:ring-[#17F9B4]",
        // Link: Alien Green text, underlined
        link: "bg-transparent text-[#17F9B4] hover:text-[#56C7F3] underline underline-offset-4",
      },
      // SKAI Button Sizes (from Figma)
      skaiSize: {
        // Massive: 72px height, 48px horizontal padding
        massive:
          "h-[72px] px-12 py-5 text-lg leading-6 rounded-[16px] gap-2.5 [&_svg]:size-6",
        // Large: 64px height, 40px horizontal padding
        large:
          "h-16 px-10 py-5 text-base leading-[22px] rounded-[16px] gap-2.5 [&_svg]:size-6",
        // Medium: 50px height, 32px horizontal padding
        medium:
          "h-[50px] px-8 py-3.5 text-sm leading-[18px] rounded-xl gap-2 [&_svg]:size-4",
        // Small: 46px height, 24px horizontal padding
        small:
          "h-[46px] px-6 py-3 text-sm leading-[18px] rounded-xl gap-2 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      skaiType: "primary",
      skaiSize: "large",
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
 * SKAI Branded Button - Uses Figma design system tokens
 *
 * @example
 * // Primary large button (default)
 * <SkaiButton>Get Started</SkaiButton>
 *
 * // Secondary medium button
 * <SkaiButton skaiType="secondary" skaiSize="medium">Learn More</SkaiButton>
 *
 * // Tertiary small button
 * <SkaiButton skaiType="tertiary" skaiSize="small">Cancel</SkaiButton>
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
