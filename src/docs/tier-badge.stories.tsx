import type { Meta, StoryObj } from "@storybook/react";
import {
  TierBadge,
  TierBadgeList,
  TIER_CONFIG,
  type TierLevel,
} from "../components/trading/tier-badge";
import { SkaiIcon } from "../components/branding/skai-icon";

// =============================================================================
// TIER BADGE STORIES
// Demonstrates the fee tier badge system for SKAI Trading
// =============================================================================

const meta: Meta<typeof TierBadge> = {
  title: "Trading/TierBadge",
  component: TierBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**TierBadge** displays user tiers earned through points or purchased upgrades.

## Tier System
| Tier | Points Required | Purchase Price | Fee Discount |
|------|-----------------|----------------|--------------|
| Free | 0 | - | 0% |
| Bronze | 100 | $9.99 | 0% (5% cashback) |
| Silver | 1,000 | $24.99 | 10% |
| Gold | 5,000 | $49.99 | 15% |
| Platinum | 25,000 | $99.99 | 20% |
| Diamond | 100,000 | $249.99 | 30% |
| Legend | 500,000 | - (earned only) | 50% |

## Usage
\`\`\`tsx
import { TierBadge, getTierFromPoints } from "@skai/ui";

// Basic usage
<TierBadge tier="gold" />

// With fee display
<TierBadge tier="gold" showFee />

// Show points requirement
<TierBadge tier="gold" showPoints />

// Show purchase price
<TierBadge tier="gold" showPrice />

// Calculate from user points
const tier = getTierFromPoints(userPoints);
<TierBadge tier={tier} variant="detailed" currentPoints={userPoints} />

// Purchased tier (no progress bar)
<TierBadge tier="diamond" variant="detailed" unlockMethod="purchased" />
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    tier: {
      control: "select",
      options: ["free", "bronze", "silver", "gold", "platinum", "diamond", "legend"],
      description: "The tier level to display",
    },
    variant: {
      control: "select",
      options: ["default", "compact", "detailed", "icon-only"],
      description: "Display variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Badge size",
    },
    showFee: {
      control: "boolean",
      description: "Show fee percentage",
    },
    showPoints: {
      control: "boolean",
      description: "Show points requirement",
    },
    showPrice: {
      control: "boolean",
      description: "Show purchase price",
    },
    unlockMethod: {
      control: "select",
      options: ["points", "purchased", "gifted"],
      description: "How the user unlocked this tier",
    },
    animate: {
      control: "boolean",
      description: "Enable animation",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TierBadge>;

// =============================================================================
// BASIC VARIANTS
// =============================================================================

export const Default: Story = {
  args: {
    tier: "gold",
    variant: "default",
    size: "md",
  },
};

export const WithFee: Story = {
  args: {
    tier: "platinum",
    variant: "default",
    showFee: true,
  },
};

export const WithPoints: Story = {
  args: {
    tier: "silver",
    variant: "default",
    showPoints: true,
  },
};

export const WithPrice: Story = {
  args: {
    tier: "gold",
    variant: "default",
    showPrice: true,
  },
};

export const Compact: Story = {
  args: {
    tier: "diamond",
    variant: "compact",
  },
};

export const IconOnly: Story = {
  args: {
    tier: "gold",
    variant: "icon-only",
    size: "lg",
  },
};

export const Detailed: Story = {
  args: {
    tier: "silver",
    variant: "detailed",
    currentPoints: 8500,
  },
  parameters: {
    docs: {
      description: {
        story: "Detailed view shows progress towards next tier and benefits",
      },
    },
  },
};

export const DetailedPurchased: Story = {
  args: {
    tier: "diamond",
    variant: "detailed",
    unlockMethod: "purchased",
  },
  parameters: {
    docs: {
      description: {
        story: "Purchased tiers show Premium badge and no progress bar",
      },
    },
  },
};

// =============================================================================
// ALL TIERS
// =============================================================================

export const AllTiers: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          "free",
          "bronze",
          "silver",
          "gold",
          "platinum",
          "diamond",
          "legend",
        ] as TierLevel[]
      ).map((tier) => (
        <TierBadge key={tier} tier={tier} showFee showPoints />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All six tiers with their points requirements and fees",
      },
    },
  },
};

export const AllTiersWithPrices: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          "free",
          "bronze",
          "silver",
          "gold",
          "platinum",
          "diamond",
          "legend",
        ] as TierLevel[]
      ).map((tier) => (
        <TierBadge key={tier} tier={tier} showFee showPrice />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All seven tiers with their purchase prices and fees",
      },
    },
  },
};

export const AllTiersCompact: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(
        [
          "free",
          "bronze",
          "silver",
          "gold",
          "platinum",
          "diamond",
          "legend",
        ] as TierLevel[]
      ).map((tier) => (
        <TierBadge key={tier} tier={tier} variant="compact" size="sm" />
      ))}
    </div>
  ),
};

export const AllTiersDetailed: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      {(
        [
          "free",
          "bronze",
          "silver",
          "gold",
          "platinum",
          "diamond",
          "legend",
        ] as TierLevel[]
      ).map((tier) => (
        <TierBadge
          key={tier}
          tier={tier}
          variant="detailed"
          currentPoints={TIER_CONFIG[tier].pointsRequired + 500}
        />
      ))}
    </div>
  ),
};

// =============================================================================
// TIER BADGE LIST
// =============================================================================

export const TierList: StoryObj<typeof TierBadgeList> = {
  render: () => <TierBadgeList currentTier="gold" />,
  parameters: {
    docs: {
      description: {
        story: "Shows all tiers with the current tier highlighted",
      },
    },
  },
};

export const TierListVertical: StoryObj<typeof TierBadgeList> = {
  render: () => <TierBadgeList currentTier="silver" orientation="vertical" />,
};

// =============================================================================
// SIZES
// =============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <TierBadge tier="gold" size="sm" showFee />
      <TierBadge tier="gold" size="md" showFee />
      <TierBadge tier="gold" size="lg" showFee />
    </div>
  ),
};

// =============================================================================
// WALLET ICONS SHOWCASE
// =============================================================================

export const WalletIcons: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Wallet Provider Icons</h3>
      <div className="flex gap-6 items-center">
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="metamask" size="lg" />
          <span className="text-xs text-muted-foreground">MetaMask</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="coinbase" size="lg" />
          <span className="text-xs text-muted-foreground">Coinbase</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="phantom" size="lg" />
          <span className="text-xs text-muted-foreground">Phantom</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="walletconnect" size="lg" />
          <span className="text-xs text-muted-foreground">WalletConnect</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="rainbow" size="lg" />
          <span className="text-xs text-muted-foreground">Rainbow</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Wallet provider icons for connect button and wallet selection UI",
      },
    },
  },
};

// =============================================================================
// TIER ICONS SHOWCASE
// =============================================================================

export const TierIcons: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Fee Tier Icons</h3>
      <div className="flex gap-6 items-center">
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="tier-free" size="lg" />
          <span className="text-xs text-muted-foreground">Free</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="tier-bronze" size="lg" />
          <span className="text-xs text-muted-foreground">Bronze</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="tier-silver" size="lg" />
          <span className="text-xs text-muted-foreground">Silver</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="tier-gold" size="lg" />
          <span className="text-xs text-muted-foreground">Gold</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="tier-platinum" size="lg" />
          <span className="text-xs text-muted-foreground">Platinum</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="tier-diamond" size="lg" />
          <span className="text-xs text-muted-foreground">Diamond</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SkaiIcon name="tier-legend" size="lg" />
          <span className="text-xs text-muted-foreground">Legend</span>
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// REAL-WORLD USAGE EXAMPLE
// =============================================================================

export const UserProfileExample: Story = {
  render: () => {
    const userPoints = 18500; // Example: user has 18,500 points

    return (
      <div className="p-6 bg-card rounded-lg border space-y-4 max-w-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Your Tier Status</h3>
          <TierBadge tier="gold" variant="compact" size="sm" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Points</span>
            <span className="font-medium">{userPoints.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Fee</span>
            <span className="font-medium text-green-500">0.15%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Savings vs Free Tier</span>
            <span className="font-medium text-green-500">50% off</span>
          </div>
        </div>
        <TierBadge tier="gold" variant="detailed" currentPoints={userPoints} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example integration showing tier badge in a user profile context",
      },
    },
  },
};

export const PurchasedTierExample: Story = {
  render: () => {
    return (
      <div className="p-6 bg-card rounded-lg border space-y-4 max-w-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Premium Member</h3>
          <TierBadge tier="diamond" variant="compact" size="sm" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-cyan-500">★ Purchased</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Fee</span>
            <span className="font-medium text-green-500">0.05%</span>
          </div>
        </div>
        <TierBadge tier="diamond" variant="detailed" unlockMethod="purchased" />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Example of a user who purchased their Diamond tier upgrade",
      },
    },
  },
};
