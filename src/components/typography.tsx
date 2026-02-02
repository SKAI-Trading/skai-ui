import * as React from "react";
import { cn } from "../lib/utils";

// Typography components that use the design system classes
// These match the typography.css classes exactly

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: 
    | "headline-2" | "headline-2-italic"
    | "headline-3" | "headline-3-italic" 
    | "headline-4"
    | "super-3" | "super-4"
    | "sub-1" | "sub-2" | "sub-2-semibold"
    | "number-1" | "number-2" | "number-3" | "number-4"
    | "para-1" | "para-1-semibold" | "para-2" | "para-2-semibold"
    | "label-1" | "label-2"
    | "page-title" | "section-title" | "card-title"
    | "body" | "small" | "price" | "caption" | "code";
  responsive?: boolean;
}

const Typography = React.forwardRef<
  HTMLElement,
  TypographyProps
>(({ className, variant = "body", as, responsive = true, ...props }, ref) => {
  // Map variants to appropriate HTML elements by default
  const defaultElement = React.useMemo(() => {
    if (as) return as;
    
    switch (variant) {
      case "headline-2":
      case "headline-2-italic":
      case "page-title":
        return "h1";
      case "headline-3":
      case "headline-3-italic":
      case "section-title":
        return "h2";
      case "headline-4":
      case "super-3":
        return "h3";
      case "super-4":
      case "sub-1":
        return "h4";
      case "sub-2":
      case "sub-2-semibold":
      case "card-title":
        return "h5";
      case "number-1":
      case "number-2":
      case "number-3":
      case "number-4":
      case "price":
        return "span";
      case "para-1":
      case "para-1-semibold":
      case "para-2":
      case "para-2-semibold":
      case "body":
        return "p";
      case "label-1":
      case "label-2":
        return "label";
      case "small":
      case "caption":
        return "small";
      case "code":
        return "code";
      default:
        return "div";
    }
  }, [as, variant]);

  // Apply the appropriate typography class
  const typographyClass = `skai-${variant}`;

  const Component = defaultElement;

  return (
    <Component
      className={cn(typographyClass, className)}
      ref={ref}
      {...props}
    />
  );
});

Typography.displayName = "Typography";

// =============================================================================
// SPECIFIC TYPOGRAPHY COMPONENTS
// =============================================================================

// Headlines
export const H1 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant" | "as">
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="headline-3"
    as="h1"
    className={className}
    {...props}
  />
));
H1.displayName = "H1";

export const H2 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant" | "as">
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="super-4"
    as="h2"
    className={className}
    {...props}
  />
));
H2.displayName = "H2";

export const H3 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant" | "as">
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="sub-1"
    as="h3"
    className={className}
    {...props}
  />
));
H3.displayName = "H3";

export const H4 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant" | "as">
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="sub-2-semibold"
    as="h4"
    className={className}
    {...props}
  />
));
H4.displayName = "H4";

// Body text
export const P = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, "variant" | "as">
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="body"
    as="p"
    className={className}
    {...props}
  />
));
P.displayName = "P";

export const Small = React.forwardRef<
  HTMLElement,
  Omit<TypographyProps, "variant" | "as">
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="small"
    as="small"
    className={className}
    {...props}
  />
));
Small.displayName = "Small";

// Special purpose
export const Price = React.forwardRef<
  HTMLSpanElement,
  Omit<TypographyProps, "variant" | "as">
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="price"
    as="span"
    className={className}
    {...props}
  />
));
Price.displayName = "Price";

export const Code = React.forwardRef<
  HTMLElement,
  Omit<TypographyProps, "variant" | "as">
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="code"
    as="code"
    className={cn("skai-code font-mono bg-muted px-1 py-0.5 rounded", className)}
    {...props}
  />
));
Code.displayName = "Code";

// =============================================================================
// COMPOSITE COMPONENTS
// =============================================================================

export interface BlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {}

export const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  BlockquoteProps
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn("skai-para-1 border-l-4 border-primary pl-6 italic", className)}
    {...props}
  />
));
Blockquote.displayName = "Blockquote";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  ordered?: boolean;
}

export const List = React.forwardRef<
  HTMLUListElement | HTMLOListElement,
  ListProps
>(({ className, ordered = false, ...props }, ref) => {
  const Component = ordered ? "ol" : "ul";
  
  return (
    <Component
      ref={ref as any}
      className={cn("skai-para-1 list-inside space-y-2", {
        "list-decimal": ordered,
        "list-disc": !ordered,
      }, className)}
      {...props}
    />
  );
});
List.displayName = "List";

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export const ListItem = React.forwardRef<
  HTMLLIElement,
  ListItemProps
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("skai-para-1", className)}
    {...props}
  />
));
ListItem.displayName = "ListItem";