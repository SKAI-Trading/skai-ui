import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

// =============================================================================
// APP FOOTER VARIANTS
// =============================================================================

const appFooterVariants = cva("w-full border-t", {
  variants: {
    /** Visual style variant */
    variant: {
      /** Default with border */
      default: "border-border bg-background",
      /** Minimal footer */
      minimal: "border-transparent bg-transparent",
      /** Dark footer */
      dark: "border-border/50 bg-muted/30",
      /** Glass effect */
      glass: "border-white/5 bg-background/50 backdrop-blur",
    },
    /** Size variant */
    size: {
      /** Compact footer */
      compact: "py-4",
      /** Default size */
      default: "py-8",
      /** Large footer with more spacing */
      large: "py-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// =============================================================================
// APP FOOTER COMPONENT
// =============================================================================

export interface AppFooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof appFooterVariants> {
  /** Logo/brand slot */
  logo?: React.ReactNode;
  /** Navigation links (organized by category) */
  links?: React.ReactNode;
  /** Social media links */
  social?: React.ReactNode;
  /** Copyright text */
  copyright?: React.ReactNode;
  /** Additional bottom content (legal links, etc.) */
  bottomContent?: React.ReactNode;
  /** Container max width */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

/**
 * AppFooter - Application footer component
 *
 * Provides consistent footer layout with slots for logo, links,
 * social icons, and copyright information.
 *
 * @example Basic usage
 * ```tsx
 * <AppFooter
 *   logo={<Logo />}
 *   copyright="© 2026 SKAI Trading. All rights reserved."
 * />
 * ```
 *
 * @example Full footer
 * ```tsx
 * <AppFooter
 *   variant="dark"
 *   logo={<SkaiLogo />}
 *   links={<FooterLinkGroups />}
 *   social={<SocialLinks />}
 *   copyright="© 2026 SKAI Trading"
 *   bottomContent={<LegalLinks />}
 * />
 * ```
 */
const AppFooter = React.forwardRef<HTMLElement, AppFooterProps>(
  (
    {
      className,
      variant,
      size,
      logo,
      links,
      social,
      copyright,
      bottomContent,
      maxWidth = "full",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <footer
        ref={ref}
        className={cn(appFooterVariants({ variant, size }), className)}
        {...props}
      >
        <div className={cn("container mx-auto px-4", maxWidthClasses[maxWidth])}>
          {/* Main footer content */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Logo and description */}
            {logo && (
              <div className="space-y-4">
                {logo}
              </div>
            )}

            {/* Navigation links */}
            {links}
          </div>

          {/* Social links */}
          {social && (
            <div className="mt-8 flex items-center justify-center gap-4 md:justify-start">
              {social}
            </div>
          )}

          {/* Bottom bar: copyright + legal */}
          <div className="mt-8 flex flex-col items-center gap-4 border-t border-border/50 pt-8 md:flex-row md:justify-between">
            {copyright && (
              <p className="text-sm text-muted-foreground">{copyright}</p>
            )}
            {bottomContent}
          </div>

          {/* Additional children */}
          {children}
        </div>
      </footer>
    );
  }
);

AppFooter.displayName = "AppFooter";

// =============================================================================
// FOOTER LINK GROUP
// =============================================================================

export interface FooterLinkGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Group title */
  title: string;
  /** Links in this group */
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
    badge?: string;
  }>;
}

/**
 * FooterLinkGroup - Group of footer links with title
 *
 * @example
 * ```tsx
 * <FooterLinkGroup
 *   title="Product"
 *   links={[
 *     { label: "Trade", href: "/trade" },
 *     { label: "Earn", href: "/earn" },
 *     { label: "Play", href: "/play", badge: "New" },
 *   ]}
 * />
 * ```
 */
const FooterLinkGroup = React.forwardRef<HTMLDivElement, FooterLinkGroupProps>(
  ({ className, title, links, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                {...(link.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {link.label}
                {link.badge && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {link.badge}
                  </span>
                )}
                {link.external && (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

FooterLinkGroup.displayName = "FooterLinkGroup";

// =============================================================================
// FOOTER SOCIAL LINK
// =============================================================================

export interface FooterSocialLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Social platform name (for accessibility) */
  platform: string;
  /** Icon to display */
  icon: React.ReactNode;
}

/**
 * FooterSocialLink - Social media link for footer
 *
 * @example
 * ```tsx
 * <FooterSocialLink
 *   platform="Twitter"
 *   icon={<TwitterIcon />}
 *   href="https://twitter.com/skai"
 * />
 * ```
 */
const FooterSocialLink = React.forwardRef<
  HTMLAnchorElement,
  FooterSocialLinkProps
>(({ className, platform, icon, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform}
      {...props}
    >
      {icon}
    </a>
  );
});

FooterSocialLink.displayName = "FooterSocialLink";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  AppFooter,
  FooterLinkGroup,
  FooterSocialLink,
  appFooterVariants,
};
