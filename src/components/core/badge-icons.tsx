import { cn } from "../../lib/utils";

// =============================================================================
// BADGE ICON TYPES
// =============================================================================

export type BadgeCategory =
  | "onboarding"
  | "trading"
  | "social"
  | "achievement"
  | "special"
  | "gaming";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface BadgeIconDefinition {
  /** Unique badge identifier (slug) */
  id: string;
  /** Display name */
  name: string;
  /** Emoji icon (primary) */
  emoji: string;
  /** Optional image URL (takes precedence over emoji when set) */
  imageUrl?: string;
  /** Badge category */
  category: BadgeCategory;
  /** Badge rarity */
  rarity: BadgeRarity;
  /** Description */
  description: string;
  /** CSS color class or hex color for the badge */
  color?: string;
}

// =============================================================================
// BADGE DEFINITIONS - Single Source of Truth
// =============================================================================

/**
 * All badge definitions for the SKAI ecosystem.
 * This is the single source of truth for badge icons.
 * Admin panel uses this to populate badge options.
 */
export const BADGE_DEFINITIONS: Record<string, BadgeIconDefinition> = {
  // Onboarding Badges
  early_adopter: {
    id: "early_adopter",
    name: "Early Adopter",
    emoji: "🌅",
    category: "onboarding",
    rarity: "rare",
    description: "Joined during the early access period",
    color: "text-orange-400",
  },
  first_trade: {
    id: "first_trade",
    name: "First Trade",
    emoji: "🎯",
    category: "onboarding",
    rarity: "common",
    description: "Completed your first trade",
    color: "text-blue-400",
  },
  verified: {
    id: "verified",
    name: "Verified",
    emoji: "✓",
    category: "onboarding",
    rarity: "common",
    description: "Verified account",
    color: "text-green-400",
  },

  // Trading Badges
  whale: {
    id: "whale",
    name: "Whale",
    emoji: "🐋",
    category: "trading",
    rarity: "legendary",
    description: "High volume trader",
    color: "text-blue-500",
  },
  diamond_hands: {
    id: "diamond_hands",
    name: "Diamond Hands",
    emoji: "💎",
    category: "trading",
    rarity: "epic",
    description: "Held through volatility without selling",
    color: "text-cyan-400",
  },
  profit_master: {
    id: "profit_master",
    name: "Profit Master",
    emoji: "📈",
    category: "trading",
    rarity: "epic",
    description: "Consistently profitable trader",
    color: "text-green-500",
  },
  top_trader: {
    id: "top_trader",
    name: "Top Trader",
    emoji: "🏆",
    category: "trading",
    rarity: "legendary",
    description: "Top ranked trader",
    color: "text-yellow-400",
  },
  volume_king: {
    id: "volume_king",
    name: "Volume King",
    emoji: "👑",
    category: "trading",
    rarity: "legendary",
    description: "Highest trading volume",
    color: "text-yellow-500",
  },
  streak_master: {
    id: "streak_master",
    name: "Streak Master",
    emoji: "🔥",
    category: "trading",
    rarity: "epic",
    description: "Long winning streak",
    color: "text-orange-500",
  },

  // Social Badges
  social_influencer: {
    id: "social_influencer",
    name: "Influencer",
    emoji: "⭐",
    category: "social",
    rarity: "rare",
    description: "High follower count",
    color: "text-purple-400",
  },
  copy_leader: {
    id: "copy_leader",
    name: "Copy Leader",
    emoji: "🎯",
    category: "social",
    rarity: "epic",
    description: "Many traders copy your trades",
    color: "text-indigo-400",
  },
  community_champion: {
    id: "community_champion",
    name: "Community Champion",
    emoji: "🤝",
    category: "social",
    rarity: "rare",
    description: "Active community contributor",
    color: "text-pink-400",
  },
  referral_king: {
    id: "referral_king",
    name: "Referral King",
    emoji: "👥",
    category: "social",
    rarity: "rare",
    description: "Referred many new users",
    color: "text-teal-400",
  },

  // Achievement Badges
  defi_expert: {
    id: "defi_expert",
    name: "DeFi Expert",
    emoji: "🔮",
    category: "achievement",
    rarity: "epic",
    description: "Mastered DeFi protocols",
    color: "text-violet-400",
  },
  nft_collector: {
    id: "nft_collector",
    name: "NFT Collector",
    emoji: "🖼️",
    category: "achievement",
    rarity: "rare",
    description: "Active NFT collector",
    color: "text-rose-400",
  },
  hundred_trades: {
    id: "hundred_trades",
    name: "100 Trades",
    emoji: "💯",
    category: "achievement",
    rarity: "common",
    description: "Completed 100 trades",
    color: "text-amber-400",
  },
  thousand_trades: {
    id: "thousand_trades",
    name: "1K Trades",
    emoji: "🚀",
    category: "achievement",
    rarity: "rare",
    description: "Completed 1,000 trades",
    color: "text-red-400",
  },

  // Gaming Badges
  game_master: {
    id: "game_master",
    name: "Game Master",
    emoji: "🎮",
    category: "gaming",
    rarity: "epic",
    description: "Mastered all games",
    color: "text-fuchsia-400",
  },
  hilo_champion: {
    id: "hilo_champion",
    name: "HiLo Champion",
    emoji: "🃏",
    category: "gaming",
    rarity: "rare",
    description: "HiLo game champion",
    color: "text-emerald-400",
  },
  lucky_streak: {
    id: "lucky_streak",
    name: "Lucky Streak",
    emoji: "🍀",
    category: "gaming",
    rarity: "common",
    description: "Won multiple games in a row",
    color: "text-lime-400",
  },
  jackpot_winner: {
    id: "jackpot_winner",
    name: "Jackpot Winner",
    emoji: "💰",
    category: "gaming",
    rarity: "legendary",
    description: "Won a jackpot",
    color: "text-yellow-300",
  },

  // Special Badges
  founder: {
    id: "founder",
    name: "Founder",
    emoji: "🏛️",
    category: "special",
    rarity: "legendary",
    description: "SKAI founding member",
    color: "text-amber-500",
  },
  beta_tester: {
    id: "beta_tester",
    name: "Beta Tester",
    emoji: "🧪",
    category: "special",
    rarity: "rare",
    description: "Participated in beta testing",
    color: "text-sky-400",
  },
  bug_hunter: {
    id: "bug_hunter",
    name: "Bug Hunter",
    emoji: "🐛",
    category: "special",
    rarity: "epic",
    description: "Found and reported bugs",
    color: "text-lime-500",
  },
  og_member: {
    id: "og_member",
    name: "OG Member",
    emoji: "👴",
    category: "special",
    rarity: "legendary",
    description: "Original community member",
    color: "text-slate-300",
  },
};

/**
 * Get all badge definitions as an array
 */
export const getBadgeDefinitions = (): BadgeIconDefinition[] =>
  Object.values(BADGE_DEFINITIONS);

/**
 * Get badge definitions filtered by category
 */
export const getBadgesByCategory = (
  category: BadgeCategory,
): BadgeIconDefinition[] =>
  getBadgeDefinitions().filter((badge) => badge.category === category);

/**
 * Get badge definitions filtered by rarity
 */
export const getBadgesByRarity = (
  rarity: BadgeRarity,
): BadgeIconDefinition[] =>
  getBadgeDefinitions().filter((badge) => badge.rarity === rarity);

/**
 * Get a specific badge definition by ID
 */
export const getBadgeById = (id: string): BadgeIconDefinition | undefined =>
  BADGE_DEFINITIONS[id];

// =============================================================================
// COMMON EMOJI PALETTE - For admin to choose from
// =============================================================================

/**
 * Common emojis available for badge creation in admin panel.
 * Organized by category for easy selection.
 */
export const BADGE_EMOJI_PALETTE = {
  achievements: ["🏆", "🥇", "🥈", "🥉", "🎖️", "🏅", "⭐", "🌟", "✨", "💯"],
  trading: ["📈", "📉", "💹", "💰", "💎", "🐋", "🦈", "🚀", "🔥", "⚡"],
  social: ["👥", "🤝", "💬", "❤️", "🎯", "👑", "⭐", "🌍", "🔗", "📢"],
  gaming: ["🎮", "🎲", "🃏", "🎰", "🍀", "🎪", "🎭", "🎨", "🎵", "🎬"],
  special: ["🏛️", "🧪", "🐛", "👴", "🌅", "✓", "🔮", "🖼️", "💡", "🎁"],
  nature: ["🌈", "☀️", "🌙", "⚡", "🔥", "💧", "🌸", "🍀", "🌺", "🌻"],
  misc: ["💪", "🙌", "👏", "🎉", "🎊", "💫", "🌀", "❄️", "🔷", "🔶"],
} as const;

/**
 * Flat array of all available emojis
 */
export const ALL_BADGE_EMOJIS = Object.values(BADGE_EMOJI_PALETTE).flat();

// =============================================================================
// RARITY CONFIGURATION
// =============================================================================

export const RARITY_CONFIG: Record<
  BadgeRarity,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  common: {
    label: "Common",
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
    borderColor: "border-gray-500/30",
  },
  rare: {
    label: "Rare",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
  },
  epic: {
    label: "Epic",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
  },
  legendary: {
    label: "Legendary",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
  },
};

// =============================================================================
// CATEGORY CONFIGURATION
// =============================================================================

export const CATEGORY_CONFIG: Record<
  BadgeCategory,
  { label: string; icon: string; color: string }
> = {
  onboarding: { label: "Onboarding", icon: "🚪", color: "text-green-400" },
  trading: { label: "Trading", icon: "📊", color: "text-blue-400" },
  social: { label: "Social", icon: "👥", color: "text-purple-400" },
  achievement: { label: "Achievement", icon: "🏆", color: "text-yellow-400" },
  special: { label: "Special", icon: "⭐", color: "text-pink-400" },
  gaming: { label: "Gaming", icon: "🎮", color: "text-cyan-400" },
};

// =============================================================================
// BADGE ICON COMPONENT
// =============================================================================

export interface BadgeIconProps {
  /** Badge ID from BADGE_DEFINITIONS, OR custom emoji/imageUrl */
  badge?: string | BadgeIconDefinition;
  /** Custom emoji (overrides badge definition) */
  emoji?: string;
  /** Custom image URL (overrides badge definition and emoji) */
  imageUrl?: string;
  /** Size of the icon */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Additional CSS classes */
  className?: string;
  /** Show rarity glow effect */
  showGlow?: boolean;
  /** Rarity (for glow effect, auto-detected from badge if not provided) */
  rarity?: BadgeRarity;
}

const SIZE_CLASSES = {
  xs: "w-4 h-4 text-xs",
  sm: "w-5 h-5 text-sm",
  md: "w-6 h-6 text-base",
  lg: "w-8 h-8 text-lg",
  xl: "w-10 h-10 text-xl",
};

const GLOW_CLASSES: Record<BadgeRarity, string> = {
  common: "",
  rare: "shadow-[0_0_8px_rgba(59,130,246,0.5)]",
  epic: "shadow-[0_0_8px_rgba(168,85,247,0.5)]",
  legendary: "shadow-[0_0_12px_rgba(234,179,8,0.6)]",
};

/**
 * BadgeIcon component that renders either an emoji or an image.
 * Uses BADGE_DEFINITIONS as the source of truth.
 *
 * @example
 * // Using a predefined badge
 * <BadgeIcon badge="whale" size="md" />
 *
 * // Using custom emoji
 * <BadgeIcon emoji="🔥" size="lg" />
 *
 * // Using custom image
 * <BadgeIcon imageUrl="/badges/custom.png" size="md" />
 */
export function BadgeIcon({
  badge,
  emoji,
  imageUrl,
  size = "md",
  className,
  showGlow = false,
  rarity,
}: BadgeIconProps) {
  // Resolve badge definition
  let resolvedDef: BadgeIconDefinition | undefined;
  if (typeof badge === "string") {
    resolvedDef = BADGE_DEFINITIONS[badge];
  } else if (badge) {
    resolvedDef = badge;
  }

  // Determine what to render (priority: imageUrl > badge.imageUrl > emoji > badge.emoji)
  const finalImageUrl = imageUrl || resolvedDef?.imageUrl;
  const finalEmoji = emoji || resolvedDef?.emoji || "🏅";
  const finalRarity = rarity || resolvedDef?.rarity || "common";

  const sizeClass = SIZE_CLASSES[size];
  const glowClass = showGlow ? GLOW_CLASSES[finalRarity] : "";

  // Render image if available
  if (finalImageUrl) {
    return (
      <img
        src={finalImageUrl}
        alt={resolvedDef?.name || "Badge"}
        className={cn(
          sizeClass,
          "rounded-full object-cover",
          glowClass,
          className,
        )}
      />
    );
  }

  // Render emoji
  return (
    <span
      className={cn(
        sizeClass,
        "inline-flex items-center justify-center rounded-full",
        showGlow && glowClass,
        className,
      )}
      role="img"
      aria-label={resolvedDef?.name || "Badge"}
    >
      {finalEmoji}
    </span>
  );
}

// =============================================================================
// BADGE CHIP COMPONENT (Full Badge with Label)
// =============================================================================

export interface BadgeChipProps {
  /** Badge ID or definition */
  badge: string | BadgeIconDefinition;
  /** Show the badge name */
  showName?: boolean;
  /** Show rarity indicator */
  showRarity?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

/**
 * Full badge display with icon, name, and optional rarity indicator.
 */
export function BadgeChip({
  badge,
  showName = true,
  showRarity = false,
  size = "md",
  className,
}: BadgeChipProps) {
  const def = typeof badge === "string" ? BADGE_DEFINITIONS[badge] : badge;

  if (!def) {
    return null;
  }

  const rarityConfig = RARITY_CONFIG[def.rarity];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-1",
        rarityConfig.bgColor,
        rarityConfig.borderColor,
        "border",
        className,
      )}
    >
      <BadgeIcon
        badge={def}
        size={size === "sm" ? "xs" : size === "md" ? "sm" : "md"}
        showGlow={def.rarity === "legendary" || def.rarity === "epic"}
        rarity={def.rarity}
      />
      {showName && (
        <span
          className={cn(
            "font-medium",
            def.color || rarityConfig.color,
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base",
          )}
        >
          {def.name}
        </span>
      )}
      {showRarity && (
        <span className={cn("text-xs opacity-60", rarityConfig.color)}>
          ({rarityConfig.label})
        </span>
      )}
    </div>
  );
}
