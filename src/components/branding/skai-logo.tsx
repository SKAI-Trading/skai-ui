import * as React from "react";
import { cn } from "../../lib/utils";

// =============================================================================
// SKAI LOGO COMPONENT
// =============================================================================
// Matches Figma design system: logos/skai (777:1537)
// Sizes: Small (24px), Medium (48px), Large (64px)
// Variants: White, Black
// =============================================================================

export type SkaiLogoSize = "small" | "medium" | "large";
export type SkaiLogoVariant = "white" | "black";

export interface SkaiLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size preset from Figma: small (24px), medium (48px), large (64px) */
  size?: SkaiLogoSize;
  /** Color variant: white (for dark backgrounds) or black (for light backgrounds) */
  variant?: SkaiLogoVariant;
  /** Show icon only (without text) */
  iconOnly?: boolean;
}

// Size dimensions from Figma
const sizeConfig: Record<
  SkaiLogoSize,
  { height: number; fullWidth: number; iconWidth: number }
> = {
  small: { height: 24, fullWidth: 101, iconWidth: 22 },
  medium: { height: 48, fullWidth: 201, iconWidth: 43 },
  large: { height: 64, fullWidth: 267, iconWidth: 58 },
};

// SKAI Logo Icon (the angular "S" shape)
const SkaiLogoIcon: React.FC<{ size: number; fill: string }> = ({
  size,
  fill,
}) => {
  return (
    <svg
      width={size * 0.9}
      height={size}
      viewBox="0 0 58 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* SKAI Icon - Angular S shape */}
      <path d="M29 0L0 16V48L29 64L58 48V16L29 0Z" fill="url(#skai-gradient)" />
      <path d="M29 8L8 20V44L29 56L50 44V20L29 8Z" fill={fill} opacity="0.15" />
      <path
        d="M29 16L16 24V40L29 48L42 40V24L29 16Z"
        fill="url(#skai-gradient-inner)"
      />
      <defs>
        <linearGradient
          id="skai-gradient"
          x1="0"
          y1="0"
          x2="58"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#56C7F3" />
          <stop offset="1" stopColor="#17F9B4" />
        </linearGradient>
        <linearGradient
          id="skai-gradient-inner"
          x1="16"
          y1="16"
          x2="42"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#56C7F3" />
          <stop offset="1" stopColor="#17F9B4" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// SKAI Text Logo
const SkaiLogoText: React.FC<{ height: number; fill: string }> = ({
  height,
  fill,
}) => {
  return (
    <svg
      width={height * 3}
      height={height * 0.56}
      viewBox="0 0 195 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* S */}
      <path
        d="M0 28.5C0 28.5 4.5 33 15 33C25.5 33 30 28.5 30 22.5C30 16.5 25 14 15 12C5 10 5 7.5 15 7.5C25 7.5 27 10.5 27 10.5L30 4.5C30 4.5 25 0 15 0C5 0 0 4.5 0 10.5C0 16.5 5 19 15 21C25 23 25 25.5 15 25.5C5 25.5 3 22.5 3 22.5L0 28.5Z"
        fill={fill}
      />
      {/* K */}
      <path
        d="M40 32V1H50V14L65 1H78L60 16.5L78 32H65L50 19V32H40Z"
        fill={fill}
      />
      {/* A */}
      <path
        d="M95 32L80 1H92L100 21L108 1H120L105 32H95ZM88 25H112V32H88V25Z"
        fill={fill}
      />
      {/* I */}
      <path d="M125 32V1H135V32H125Z" fill={fill} />
      {/* Decorative dot */}
      <circle cx="185" cy="26" r="6" fill="url(#text-gradient)" />
      <defs>
        <linearGradient
          id="text-gradient"
          x1="179"
          y1="20"
          x2="191"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#56C7F3" />
          <stop offset="1" stopColor="#17F9B4" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/**
 * SKAI Logo - Official brand logo from Figma design system
 *
 * **Figma Reference:** Design System → logos/skai (777:1537)
 *
 * @example
 * // Default (medium, white variant)
 * <SkaiLogo />
 *
 * // Large black logo
 * <SkaiLogo size="large" variant="black" />
 *
 * // Icon only (no text)
 * <SkaiLogo iconOnly size="small" />
 */
const SkaiLogo = React.forwardRef<HTMLDivElement, SkaiLogoProps>(
  (
    {
      size = "medium",
      variant = "white",
      iconOnly = false,
      className,
      ...props
    },
    ref,
  ) => {
    const config = sizeConfig[size];
    const fill = variant === "white" ? "#FFFFFF" : "#001615";

    if (iconOnly) {
      return (
        <div
          ref={ref}
          className={cn("inline-flex items-center", className)}
          style={{ height: config.height, width: config.iconWidth }}
          {...props}
        >
          <SkaiLogoIcon size={config.height} fill={fill} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2", className)}
        style={{ height: config.height }}
        {...props}
      >
        <SkaiLogoIcon size={config.height} fill={fill} />
        <SkaiLogoText height={config.height} fill={fill} />
      </div>
    );
  },
);
SkaiLogo.displayName = "SkaiLogo";

export { SkaiLogo };
