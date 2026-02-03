/**
 * HeaderLogo - Configurable brand logo component
 * 
 * Features:
 * - Logo image with optional text
 * - Hover animations
 * - Mobile/desktop variants
 * - Fully customizable via props
 */

import * as React from "react";
import { cn } from "../../../lib/utils";
import { defaultBrandConfig, headerColors, type HeaderBrandConfig } from "./theme";

export interface HeaderLogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /** Brand configuration */
  config?: Partial<HeaderBrandConfig>;
  /** Custom link component (for React Router) */
  LinkComponent?: React.ComponentType<{ to: string; className?: string; children: React.ReactNode }>;
  /** Logo size */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: { logo: "h-6 w-6", text: "text-base" },
  md: { logo: "h-8 w-8", text: "text-lg" },
  lg: { logo: "h-10 w-10", text: "text-xl" },
};

/**
 * HeaderLogo - Brand logo with optional text
 * 
 * @example Basic usage
 * ```tsx
 * <HeaderLogo />
 * ```
 * 
 * @example Custom branding
 * ```tsx
 * <HeaderLogo 
 *   config={{
 *     logoSrc: "/my-logo.svg",
 *     brandName: { primary: "My", secondary: "App" }
 *   }}
 *   LinkComponent={NavLink}
 * />
 * ```
 */
const HeaderLogo = React.forwardRef<HTMLAnchorElement, HeaderLogoProps>(
  ({ className, config, LinkComponent, size = "md", ...props }, ref) => {
    const mergedConfig = { ...defaultBrandConfig, ...config };
    const sizes = sizeClasses[size];
    
    const content = (
      <>
        <img
          src={mergedConfig.logoSrc}
          alt={mergedConfig.logoAlt}
          className={cn(
            sizes.logo,
            "transition-transform duration-300 group-hover:scale-105"
          )}
        />
        <span 
          className={cn(
            sizes.text,
            "font-medium tracking-tight",
            !mergedConfig.showTextOnMobile && "hidden sm:flex"
          )}
        >
          <span style={{ color: headerColors.brandPrimary }}>
            {mergedConfig.brandName.primary}
          </span>
          <span style={{ color: headerColors.textPrimary }}>
            {mergedConfig.brandName.secondary}
          </span>
        </span>
      </>
    );

    const linkClassName = cn(
      "flex items-center gap-2 group min-h-[44px] shrink-0",
      className
    );

    // Use custom link component if provided (for React Router, Next.js, etc.)
    if (LinkComponent) {
      return (
        <LinkComponent to={mergedConfig.brandUrl} className={linkClassName}>
          {content}
        </LinkComponent>
      );
    }

    return (
      <a ref={ref} href={mergedConfig.brandUrl} className={linkClassName} {...props}>
        {content}
      </a>
    );
  }
);

HeaderLogo.displayName = "HeaderLogo";

export { HeaderLogo };
