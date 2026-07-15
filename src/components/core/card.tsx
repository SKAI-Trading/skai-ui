import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true, renders the child as the root element (Radix Slot). Useful for
   * wrapping anchors / Links without nested interactive elements. */
  asChild?: boolean;
  /** Optional alternative element to render (e.g., "article", "section"). Ignored
   * when `asChild` is true. */
  as?: React.ElementType;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild = false, as, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : (as ?? "div");
    return (
      <Comp
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level / element ("h1"-"h6", default "h3"). Lets consumers preserve
   * a proper document outline without re-styling. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Comp = "h3", ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(
        // font-sans (Manrope) so card/section titles match the design system
        // ("UI headings = Manrope"); without it they inherit the global h1-h6
        // Cormorant display serif. A consumer can still pass font-serif to opt a
        // deliberate display title back in. (bugs c0151f91/61628e71/863868ef)
        "font-sans text-2xl font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// =============================================================================
// SKAI BRANDED CARD (From Figma Design System)
// =============================================================================
// Uses SKAI design tokens: 24px border radius, Green Coal backgrounds
// =============================================================================

export interface SkaiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as Radix Slot (wrap a child element like <a>). */
  asChild?: boolean;
  /** Alternative element. Ignored when asChild is true. */
  as?: React.ElementType;
}

const SkaiCard = React.forwardRef<HTMLDivElement, SkaiCardProps>(
  ({ className, asChild = false, as, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : (as ?? "div");
    return (
      <Comp
        ref={ref}
        className={cn(
          "rounded-[24px] border border-[#123F3C] bg-[#122524] text-white shadow-[0px_8px_24px_rgba(0,0,0,0.16)]",
          className,
        )}
        {...props}
      />
    );
  },
);
SkaiCard.displayName = "SkaiCard";

const SkaiCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
SkaiCardHeader.displayName = "SkaiCardHeader";

export interface SkaiCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level / element ("h1"-"h6", default "h3"). */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const SkaiCardTitle = React.forwardRef<HTMLHeadingElement, SkaiCardTitleProps>(
  ({ className, as: Comp = "h3", ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(
        "font-['Manrope'] text-lg font-semibold leading-6 tracking-[-0.04em] text-white",
        className,
      )}
      {...props}
    />
  ),
);
SkaiCardTitle.displayName = "SkaiCardTitle";

const SkaiCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-['Manrope'] text-sm text-[#95A09F] tracking-[-0.04em]", className)}
    {...props}
  />
));
SkaiCardDescription.displayName = "SkaiCardDescription";

const SkaiCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
SkaiCardContent.displayName = "SkaiCardContent";

const SkaiCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
SkaiCardFooter.displayName = "SkaiCardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  // SKAI branded exports
  SkaiCard,
  SkaiCardHeader,
  SkaiCardFooter,
  SkaiCardTitle,
  SkaiCardDescription,
  SkaiCardContent,
};
