import * as React from "react";
import { cn } from "../../lib/utils";
import { SkaiIcon, type SkaiIconSize } from "../branding/skai-icon";

// =============================================================================
// TIER BADGE COMPONENT
// Displays user tier with icon and label
// Tiers: Free → Bronze → Silver → Gold → Platinum → Diamond
// Tiers are earned through points OR purchased upgrades
// =============================================================================

export type TierLevel =
  | "free"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "legend";

export type TierUnlockMethod = "points" | "purchased" | "gifted";

export interface TierConfig {
  label: string;
  /** Points required to unlock this tier (if earning via points) */
  pointsRequired: number;
  /** Price in USD to purchase this tier upgrade */
  purchasePrice: number | null;
  /** Fee discount percentage for this tier */
  feePercent: number;
  color: string;
  bgColor: string;
  borderColor: string;
  /** Benefits/perks included with this tier */
  benefits: string[];
}

export const TIER_CONFIG: Record<TierLevel, TierConfig> = {
  free: {
    label: "Free",
    pointsRequired: 0,
    purchasePrice: null,
    feePercent: 0.3,
    color: "#94a3b8",
    bgColor: "rgba(148, 163, 184, 0.1)",
    borderColor: "rgba(148, 163, 184, 0.3)",
    benefits: ["Basic trading access", "Community features"],
  },
  bronze: {
    label: "Bronze",
    pointsRequired: 100,
    purchasePrice: 9.99,
    feePercent: 0.25,
    color: "#CD7F32",
    bgColor: "rgba(205, 127, 50, 0.1)",
    borderColor: "rgba(205, 127, 50, 0.3)",
    benefits: ["5% cashback", "Bronze badge", "Priority support"],
  },
  silver: {
    label: "Silver",
    pointsRequired: 1000,
    purchasePrice: 24.99,
    feePercent: 0.2,
    color: "#C0C0C0",
    bgColor: "rgba(192, 192, 192, 0.15)",
    borderColor: "rgba(192, 192, 192, 0.4)",
    benefits: ["10% fee discount", "10% cashback", "1.2x points multiplier"],
  },
  gold: {
    label: "Gold",
    pointsRequired: 5000,
    purchasePrice: 49.99,
    feePercent: 0.15,
    color: "#FFD700",
    bgColor: "rgba(255, 215, 0, 0.1)",
    borderColor: "rgba(255, 215, 0, 0.3)",
    benefits: ["15% fee discount", "15% cashback", "1.4x points multiplier"],
  },
  platinum: {
    label: "Platinum",
    pointsRequired: 25000,
    purchasePrice: 99.99,
    feePercent: 0.1,
    color: "#E5E4E2",
    bgColor: "rgba(229, 228, 226, 0.15)",
    borderColor: "rgba(229, 228, 226, 0.4)",
    benefits: ["20% fee discount", "18% cashback", "1.5x points multiplier"],
  },
  diamond: {
    label: "Diamond",
    pointsRequired: 100000,
    purchasePrice: 249.99,
    feePercent: 0.05,
    color: "#B9F2FF",
    bgColor: "rgba(185, 242, 255, 0.1)",
    borderColor: "rgba(185, 242, 255, 0.3)",
    benefits: [
      "30% fee discount",
      "20% cashback",
      "1.6x points multiplier",
      "Priority support",
    ],
  },
  legend: {
    label: "Legend",
    pointsRequired: 500000,
    purchasePrice: null,
    feePercent: 0.02,
    color: "#9333EA",
    bgColor: "rgba(147, 51, 234, 0.1)",
    borderColor: "rgba(147, 51, 234, 0.3)",
    benefits: [
      "50% fee discount",
      "25% cashback",
      "2x points multiplier",
      "Priority support",
      "Legendary status",
    ],
  },
};

/**
 * Get the tier level based on user points
 */
export function getTierFromPoints(points: number): TierLevel {
  if (points >= 500000) return "legend";
  if (points >= 100000) return "diamond";
  if (points >= 25000) return "platinum";
  if (points >= 5000) return "gold";
  if (points >= 1000) return "silver";
  if (points >= 100) return "bronze";
  return "free";
}

/**
 * @deprecated Use getTierFromPoints instead
 * Get the tier level based on 30-day trading volume
 */
export function getTierFromVolume(volume: number): TierLevel {
  return getTierFromPoints(volume);
}

/**
 * Format points for display (e.g., 1000 → "1K", 1500000 → "1.5M")
 */
export function formatPoints(points: number): string {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(points % 1000000 === 0 ? 0 : 1)}M`;
  }
  if (points >= 1000) {
    return `${(points / 1000).toFixed(points % 1000 === 0 ? 0 : 1)}K`;
  }
  return points.toString();
}

/**
 * @deprecated Use formatPoints instead
 */
export function formatVolume(volume: number): string {
  return formatPoints(volume);
}

// =============================================================================
// TIER BADGE VARIANTS
// =============================================================================

export type TierBadgeVariant = "default" | "compact" | "detailed" | "icon-only";
export type TierBadgeSize = "sm" | "md" | "lg";

export interface TierBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The tier level to display */
  tier: TierLevel;
  /** Display variant */
  variant?: TierBadgeVariant;
  /** Size of the badge */
  size?: TierBadgeSize;
  /** Show fee percentage */
  showFee?: boolean;
  /** Show points requirement */
  showPoints?: boolean;
  /** Show purchase price */
  showPrice?: boolean;
  /** Current user points (for progress display) */
  currentPoints?: number;
  /** How the user unlocked this tier */
  unlockMethod?: TierUnlockMethod;
  /** Animate on tier change */
  animate?: boolean;
}

const sizeConfig: Record<
  TierBadgeSize,
  { icon: SkaiIconSize; text: string; padding: string }
> = {
  sm: { icon: "xs", text: "text-xs", padding: "px-2 py-0.5" },
  md: { icon: "sm", text: "text-sm", padding: "px-3 py-1" },
  lg: { icon: "md", text: "text-base", padding: "px-4 py-1.5" },
};

export const TierBadge = React.forwardRef<HTMLDivElement, TierBadgeProps>(
  (
    {
      tier,
      variant = "default",
      size = "md",
      showFee = false,
      showPoints = false,
      showPrice = false,
      currentPoints,
      unlockMethod,
      animate = false,
      className,
      ...props
    },
    ref,
  ) => {
    const config = TIER_CONFIG[tier];
    const sizeConf = sizeConfig[size];
    const iconName = `tier-${tier}` as const;

    // Icon-only variant
    if (variant === "icon-only") {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center",
            animate && "animate-bounce-subtle",
            className,
          )}
          title={`${config.label} Tier - ${config.feePercent}% fee`}
          {...props}
        >
          <SkaiIcon name={iconName} size={sizeConf.icon} />
        </div>
      );
    }

    // Compact variant (icon + label)
    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border",
            sizeConf.padding,
            animate && "animate-pulse",
            className,
          )}
          style={{
            backgroundColor: config.bgColor,
            borderColor: config.borderColor,
            color: config.color,
          }}
          {...props}
        >
          <SkaiIcon name={iconName} size={sizeConf.icon} />
          <span className={cn("font-medium", sizeConf.text)}>
            {config.label}
          </span>
        </div>
      );
    }

    // Detailed variant (full info card)
    if (variant === "detailed") {
      const nextTier = getNextTier(tier);
      const nextConfig = nextTier ? TIER_CONFIG[nextTier] : null;
      const progress =
        nextConfig && currentPoints !== undefined
          ? Math.min(
              100,
              ((currentPoints - config.pointsRequired) /
                (nextConfig.pointsRequired - config.pointsRequired)) *
                100,
            )
          : 100;

      return (
        <div
          ref={ref}
          className={cn(
            "rounded-lg border p-4",
            animate && "animate-fade-in",
            className,
          )}
          style={{
            backgroundColor: config.bgColor,
            borderColor: config.borderColor,
          }}
          {...props}
        >
          <div className="flex items-center gap-3 mb-3">
            <SkaiIcon name={iconName} size="md" />
            <div>
              <div
                className="font-semibold text-lg"
                style={{ color: config.color }}
              >
                {config.label} Tier
                {unlockMethod === "purchased" && (
                  <span className="ml-2 text-xs opacity-70">★ Premium</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {config.feePercent}% swap fee
              </div>
            </div>
          </div>

          {/* Benefits list */}
          {config.benefits.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-muted-foreground mb-1">
                Benefits:
              </div>
              <div className="flex flex-wrap gap-1">
                {config.benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="text-xs px-2 py-0.5 rounded-full bg-secondary"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Progress to next tier (only for points-based) */}
          {nextConfig &&
            currentPoints !== undefined &&
            unlockMethod !== "purchased" && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress to {nextConfig.label}</span>
                  <span>
                    {formatPoints(currentPoints)} /{" "}
                    {formatPoints(nextConfig.pointsRequired)} pts
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: config.color,
                    }}
                  />
                </div>
              </div>
            )}

          {/* Upgrade option */}
          {nextConfig && nextConfig.purchasePrice && (
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              Or upgrade to {nextConfig.label} for ${nextConfig.purchasePrice}
            </div>
          )}
        </div>
      );
    }

    // Default variant
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border",
          sizeConf.padding,
          animate && "animate-pulse",
          className,
        )}
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
        }}
        {...props}
      >
        <SkaiIcon name={iconName} size={sizeConf.icon} />
        <span
          className={cn("font-medium", sizeConf.text)}
          style={{ color: config.color }}
        >
          {config.label}
        </span>
        {showFee && (
          <span
            className={cn("opacity-70", sizeConf.text)}
            style={{ color: config.color }}
          >
            {config.feePercent}%
          </span>
        )}
        {showPoints && (
          <span
            className={cn("opacity-60", sizeConf.text)}
            style={{ color: config.color }}
          >
            {formatPoints(config.pointsRequired)} pts
          </span>
        )}
        {showPrice && config.purchasePrice && (
          <span
            className={cn("opacity-60", sizeConf.text)}
            style={{ color: config.color }}
          >
            ${config.purchasePrice}
          </span>
        )}
      </div>
    );
  },
);

TierBadge.displayName = "TierBadge";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getNextTier(current: TierLevel): TierLevel | null {
  const tiers: TierLevel[] = [
    "free",
    "bronze",
    "silver",
    "gold",
    "platinum",
    "diamond",
    "legend",
  ];
  const currentIndex = tiers.indexOf(current);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
}

// =============================================================================
// TIER BADGE LIST - Shows all tiers with current highlighted
// =============================================================================

export interface TierBadgeListProps extends React.HTMLAttributes<HTMLDivElement> {
  currentTier: TierLevel;
  showFees?: boolean;
  orientation?: "horizontal" | "vertical";
}

export const TierBadgeList = React.forwardRef<
  HTMLDivElement,
  TierBadgeListProps
>(
  (
    {
      currentTier,
      showFees = true,
      orientation = "horizontal",
      className,
      ...props
    },
    ref,
  ) => {
    const tiers: TierLevel[] = [
      "free",
      "bronze",
      "silver",
      "gold",
      "platinum",
      "diamond",
      "legend",
    ];

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          className,
        )}
        {...props}
      >
        {tiers.map((tier) => (
          <TierBadge
            key={tier}
            tier={tier}
            variant="compact"
            size="sm"
            showFee={showFees}
            className={cn(
              "transition-all",
              tier === currentTier
                ? "ring-2 ring-offset-2 ring-offset-background scale-105"
                : "opacity-50",
            )}
            style={
              tier === currentTier
                ? {
                    // @ts-expect-error CSS custom property for ring color
                    "--tw-ring-color": TIER_CONFIG[tier].color,
                  }
                : undefined
            }
          />
        ))}
      </div>
    );
  },
);

TierBadgeList.displayName = "TierBadgeList";
