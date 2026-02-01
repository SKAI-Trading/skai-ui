import * as React from "react";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// =============================================================================
// CENTERED LAYOUT VARIANTS
// =============================================================================

const centeredLayoutVariants = cva(
  "min-h-screen w-full flex flex-col items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-background",
        muted: "bg-muted/30",
        gradient: "bg-gradient-to-br from-green-coal-900 via-background to-green-coal-800",
        pattern:
          "bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-coal-900/20 via-background to-background",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  },
);

const centeredContentVariants = cva("w-full", {
  variants: {
    size: {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

// =============================================================================
// TYPES
// =============================================================================

export interface CenteredLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof centeredLayoutVariants> {
  /** Header slot (logo, back button) */
  header?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Footer slot (links, copyright) */
  footer?: React.ReactNode;
  /** Content max width */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Show decorative background elements */
  showDecorations?: boolean;
}

export interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card title */
  title?: string;
  /** Card subtitle/description */
  subtitle?: string;
  /** Logo/icon above title */
  logo?: React.ReactNode;
  /** Card content */
  children: React.ReactNode;
  /** Footer content (links, alternative actions) */
  footer?: React.ReactNode;
  /** Card variant */
  variant?: "default" | "bordered" | "elevated" | "glass";
}

// =============================================================================
// AUTH CARD COMPONENT
// =============================================================================

/**
 * AuthCard - Card container for auth pages (login, register, etc.)
 *
 * @example
 * ```tsx
 * <AuthCard
 *   logo={<SkaiLogo />}
 *   title="Welcome back"
 *   subtitle="Sign in to your account"
 *   footer={<Link href="/register">Create account</Link>}
 * >
 *   <LoginForm />
 * </AuthCard>
 * ```
 */
const AuthCard = React.forwardRef<HTMLDivElement, AuthCardProps>(
  (
    {
      title,
      subtitle,
      logo,
      children,
      footer,
      variant = "bordered",
      className,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      default: "bg-card",
      bordered: "bg-card border border-border",
      elevated: "bg-card shadow-xl",
      glass: "bg-card/80 backdrop-blur-xl border border-border/50",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-6 sm:p-8",
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {/* Logo */}
        {logo && (
          <div className="flex justify-center mb-6">{logo}</div>
        )}

        {/* Title & Subtitle */}
        {(title || subtitle) && (
          <div className="text-center mb-6">
            {title && (
              <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    );
  },
);
AuthCard.displayName = "AuthCard";

// =============================================================================
// CENTERED LAYOUT COMPONENT
// =============================================================================

/**
 * CenteredLayout - Centered content layout for auth pages
 *
 * Features:
 * - Vertically and horizontally centered
 * - Multiple background variants (gradient, pattern)
 * - Decorative background elements
 * - Max-width constraint
 * - Header/footer slots
 *
 * @example Login page
 * ```tsx
 * <CenteredLayout
 *   variant="gradient"
 *   header={<Logo />}
 *   footer={<FooterLinks />}
 * >
 *   <AuthCard title="Sign In">
 *     <LoginForm />
 *   </AuthCard>
 * </CenteredLayout>
 * ```
 *
 * @example With decorations
 * ```tsx
 * <CenteredLayout variant="pattern" showDecorations>
 *   <AuthCard logo={<SkaiLogo />} title="Create Account">
 *     <RegisterForm />
 *   </AuthCard>
 * </CenteredLayout>
 * ```
 */
const CenteredLayout = React.forwardRef<HTMLDivElement, CenteredLayoutProps>(
  (
    {
      header,
      children,
      footer,
      size = "sm",
      variant,
      padding,
      showDecorations = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(centeredLayoutVariants({ variant, padding }), className)}
        {...props}
      >
        {/* Decorative elements */}
        {showDecorations && (
          <>
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-skai-green/5 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-skai-green/5 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed top-1/2 left-0 w-64 h-64 bg-green-coal-500/10 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        {/* Header */}
        {header && (
          <div className="fixed top-0 left-0 right-0 z-10 p-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              {header}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={cn(centeredContentVariants({ size }), "relative z-0")}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="fixed bottom-0 left-0 right-0 z-10 p-4">
            <div className="text-center">{footer}</div>
          </div>
        )}
      </div>
    );
  },
);
CenteredLayout.displayName = "CenteredLayout";

export {
  CenteredLayout,
  AuthCard,
  centeredLayoutVariants,
  centeredContentVariants,
};
