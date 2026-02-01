import type { Meta, StoryObj } from "@storybook/react";
import { TickerTape } from "../components/ticker-tape";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const meta: Meta<typeof TickerTape> = {
  title: "Layout/TickerTape",
  component: TickerTape,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Horizontally scrolling ticker tape for displaying prices, news, or announcements.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "muted", "bordered", "glass"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    direction: {
      control: "select",
      options: ["left", "right"],
    },
    speed: {
      control: { type: "range", min: 20, max: 150, step: 10 },
    },
    pauseOnHover: {
      control: "boolean",
    },
    showFade: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TickerTape>;

// Price ticker
export const PriceTicker: Story = {
  args: {
    items: [
      { id: "btc", content: "BTC $67,234.56 +2.3%", change: "positive" },
      { id: "eth", content: "ETH $3,456.78 -1.2%", change: "negative" },
      { id: "sol", content: "SOL $178.90 +5.6%", change: "positive" },
      { id: "bnb", content: "BNB $598.23 +0.8%", change: "positive" },
      { id: "xrp", content: "XRP $0.62 -0.3%", change: "negative" },
      { id: "ada", content: "ADA $0.45 +1.1%", change: "positive" },
    ],
    speed: 50,
    pauseOnHover: true,
  },
};

// News ticker
export const NewsTicker: Story = {
  args: {
    items: [
      { id: "1", content: "🔥 New feature: Limit orders now available!" },
      { id: "2", content: "📈 Trading volume up 50% this week" },
      {
        id: "3",
        content: "🎮 Tournament starts in 24 hours - $10,000 prize pool",
      },
      { id: "4", content: "💰 Fee reduction for Gold+ tier members" },
      { id: "5", content: "🚀 Mobile app coming soon" },
    ],
    variant: "bordered",
    speed: 40,
    pauseOnHover: true,
  },
};

// With icons
export const WithIcons: Story = {
  args: {
    items: [
      {
        id: "btc",
        content: (
          <span className="flex items-center gap-1">
            BTC $67,234 <TrendingUp className="h-3 w-3" /> +2.3%
          </span>
        ),
        change: "positive",
      },
      {
        id: "eth",
        content: (
          <span className="flex items-center gap-1">
            ETH $3,456 <TrendingDown className="h-3 w-3" /> -1.2%
          </span>
        ),
        change: "negative",
      },
      {
        id: "sol",
        content: (
          <span className="flex items-center gap-1">
            SOL $178 <Minus className="h-3 w-3" /> 0.0%
          </span>
        ),
        change: "neutral",
      },
    ],
    speed: 50,
  },
};

// Clickable items
export const Clickable: Story = {
  args: {
    items: [
      {
        id: "btc",
        content: "BTC $67,234",
        change: "positive",
        onClick: () => alert("View BTC"),
      },
      {
        id: "eth",
        content: "ETH $3,456",
        change: "negative",
        onClick: () => alert("View ETH"),
      },
      {
        id: "sol",
        content: "SOL $178",
        change: "positive",
        onClick: () => alert("View SOL"),
      },
    ],
    speed: 50,
  },
};

// With links
export const WithLinks: Story = {
  args: {
    items: [
      { id: "btc", content: "BTC $67,234", change: "positive", href: "#btc" },
      { id: "eth", content: "ETH $3,456", change: "negative", href: "#eth" },
      { id: "sol", content: "SOL $178", change: "positive", href: "#sol" },
    ],
    speed: 50,
  },
};

// With separator
export const WithSeparator: Story = {
  args: {
    items: [
      { id: "btc", content: "BTC $67,234", change: "positive" },
      { id: "eth", content: "ETH $3,456", change: "negative" },
      { id: "sol", content: "SOL $178", change: "positive" },
    ],
    separator: <span className="text-muted-foreground mx-4">•</span>,
    speed: 50,
  },
};

// Right direction
export const RightDirection: Story = {
  args: {
    items: [
      { id: "btc", content: "BTC $67,234", change: "positive" },
      { id: "eth", content: "ETH $3,456", change: "negative" },
      { id: "sol", content: "SOL $178", change: "positive" },
    ],
    direction: "right",
    speed: 50,
  },
};

// Fast speed
export const FastSpeed: Story = {
  args: {
    items: [
      { id: "1", content: "⚡ BREAKING: Major protocol upgrade!" },
      { id: "2", content: "📊 New all-time high volume!" },
      { id: "3", content: "🏆 Leaderboard updated!" },
    ],
    speed: 100,
    variant: "muted",
  },
};

// Slow speed
export const SlowSpeed: Story = {
  args: {
    items: [
      {
        id: "1",
        content:
          "Welcome to SKAI Trading - Your gateway to decentralized finance",
      },
      { id: "2", content: "Trade, Play, Earn - All in one platform" },
    ],
    speed: 25,
    variant: "bordered",
  },
};

// Without fade
export const NoFade: Story = {
  args: {
    items: [
      { id: "btc", content: "BTC $67,234", change: "positive" },
      { id: "eth", content: "ETH $3,456", change: "negative" },
      { id: "sol", content: "SOL $178", change: "positive" },
    ],
    showFade: false,
    variant: "bordered",
  },
};

// Small size
export const SmallSize: Story = {
  args: {
    items: [
      { id: "btc", content: "BTC +2.3%", change: "positive" },
      { id: "eth", content: "ETH -1.2%", change: "negative" },
      { id: "sol", content: "SOL +5.6%", change: "positive" },
    ],
    size: "sm",
    speed: 60,
  },
};

// Large size
export const LargeSize: Story = {
  args: {
    items: [
      { id: "btc", content: "Bitcoin: $67,234.56", change: "positive" },
      { id: "eth", content: "Ethereum: $3,456.78", change: "negative" },
      { id: "sol", content: "Solana: $178.90", change: "positive" },
    ],
    size: "lg",
    speed: 40,
  },
};

// Paused
export const Paused: Story = {
  args: {
    items: [
      { id: "btc", content: "BTC $67,234", change: "positive" },
      { id: "eth", content: "ETH $3,456", change: "negative" },
      { id: "sol", content: "SOL $178", change: "positive" },
    ],
    paused: true,
  },
};

// Glass variant in header
export const GlassInHeader: Story = {
  render: () => (
    <div className="bg-gradient-to-r from-green-coal-900 to-green-coal-800 p-0">
      <TickerTape
        variant="glass"
        items={[
          { id: "btc", content: "BTC $67,234 ↑2.3%", change: "positive" },
          { id: "eth", content: "ETH $3,456 ↓1.2%", change: "negative" },
          { id: "sol", content: "SOL $178 ↑5.6%", change: "positive" },
          { id: "bnb", content: "BNB $598 ↑0.8%", change: "positive" },
        ]}
        speed={50}
        pauseOnHover
      />
    </div>
  ),
};
