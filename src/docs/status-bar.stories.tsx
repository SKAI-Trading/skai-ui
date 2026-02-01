import type { Meta, StoryObj } from "@storybook/react";
import { StatusBar } from "../components/status-bar";
import { Wallet, Zap, Trophy, Clock, Flame } from "lucide-react";

const meta: Meta<typeof StatusBar> = {
  title: "Layout/StatusBar",
  component: StatusBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Header status bar displaying user stats like points, vault balance, streaks, and other key metrics.",
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
  },
};

export default meta;
type Story = StoryObj<typeof StatusBar>;

// Basic example
export const Default: Story = {
  args: {
    items: [
      {
        id: "points",
        label: "Points",
        value: "12,450",
        icon: <Zap className="h-4 w-4" />,
      },
      {
        id: "vault",
        label: "Vault",
        value: "$1,234.56",
        icon: <Wallet className="h-4 w-4" />,
      },
      {
        id: "streak",
        label: "Streak",
        value: "5 days",
        icon: <Flame className="h-4 w-4" />,
      },
    ],
  },
};

// With tooltips
export const WithTooltips: Story = {
  args: {
    items: [
      {
        id: "points",
        label: "SKAI Points",
        value: "12,450",
        icon: <Zap className="h-4 w-4" />,
        tooltip: "Earn points by trading and playing games",
      },
      {
        id: "vault",
        label: "Vault Balance",
        value: "$1,234.56",
        icon: <Wallet className="h-4 w-4" />,
        tooltip: "Your total vault balance",
      },
      {
        id: "tier",
        label: "Tier",
        value: "Gold",
        icon: <Trophy className="h-4 w-4" />,
        tooltip: "Current fee tier based on 30-day volume",
      },
    ],
  },
};

// With highlights
export const WithHighlights: Story = {
  args: {
    items: [
      {
        id: "pnl",
        label: "Today P&L",
        value: "+$234.56",
        highlight: "positive",
      },
      {
        id: "change",
        label: "24h Change",
        value: "-2.3%",
        highlight: "negative",
      },
      {
        id: "volume",
        label: "Volume",
        value: "$50,000",
      },
    ],
  },
};

// Loading state
export const Loading: Story = {
  args: {
    items: [
      {
        id: "points",
        label: "Points",
        value: "...",
        icon: <Zap className="h-4 w-4" />,
        loading: true,
      },
      {
        id: "vault",
        label: "Vault",
        value: "...",
        icon: <Wallet className="h-4 w-4" />,
        loading: true,
      },
      {
        id: "streak",
        label: "Streak",
        value: "...",
        icon: <Flame className="h-4 w-4" />,
        loading: true,
      },
    ],
  },
};

// Clickable items
export const Clickable: Story = {
  args: {
    items: [
      {
        id: "points",
        label: "Points",
        value: "12,450",
        icon: <Zap className="h-4 w-4" />,
        onClick: () => alert("View points history"),
      },
      {
        id: "vault",
        label: "Vault",
        value: "$1,234.56",
        icon: <Wallet className="h-4 w-4" />,
        onClick: () => alert("Open vault"),
      },
    ],
  },
};

// Muted variant
export const MutedVariant: Story = {
  args: {
    variant: "muted",
    items: [
      {
        id: "points",
        label: "Points",
        value: "12,450",
        icon: <Zap className="h-4 w-4" />,
      },
      {
        id: "vault",
        label: "Vault",
        value: "$1,234.56",
        icon: <Wallet className="h-4 w-4" />,
      },
    ],
  },
};

// Bordered variant
export const BorderedVariant: Story = {
  args: {
    variant: "bordered",
    items: [
      {
        id: "points",
        label: "Points",
        value: "12,450",
        icon: <Zap className="h-4 w-4" />,
      },
      {
        id: "vault",
        label: "Vault",
        value: "$1,234.56",
        icon: <Wallet className="h-4 w-4" />,
      },
    ],
  },
};

// Glass variant
export const GlassVariant: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-skai-green to-green-coal-800 rounded-lg">
      <StatusBar
        variant="glass"
        items={[
          {
            id: "points",
            label: "Points",
            value: "12,450",
            icon: <Zap className="h-4 w-4" />,
          },
          {
            id: "vault",
            label: "Vault",
            value: "$1,234.56",
            icon: <Wallet className="h-4 w-4" />,
          },
          {
            id: "streak",
            label: "Streak",
            value: "5 days",
            icon: <Flame className="h-4 w-4" />,
          },
        ]}
      />
    </div>
  ),
};

// Small size
export const SmallSize: Story = {
  args: {
    size: "sm",
    items: [
      { id: "points", value: "12,450", icon: <Zap className="h-3 w-3" /> },
      { id: "vault", value: "$1,234", icon: <Wallet className="h-3 w-3" /> },
      { id: "time", value: "2:45:30", icon: <Clock className="h-3 w-3" /> },
    ],
  },
};

// Large size
export const LargeSize: Story = {
  args: {
    size: "lg",
    items: [
      {
        id: "points",
        label: "SKAI Points",
        value: "12,450",
        icon: <Zap className="h-5 w-5" />,
      },
      {
        id: "vault",
        label: "Vault Balance",
        value: "$1,234.56",
        icon: <Wallet className="h-5 w-5" />,
      },
    ],
  },
};

// In header context
export const HeaderContext: Story = {
  render: () => (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
      <div className="font-bold text-lg">SKAI Trading</div>
      <StatusBar
        variant="muted"
        size="sm"
        items={[
          {
            id: "points",
            value: "12,450",
            icon: <Zap className="h-3 w-3" />,
            tooltip: "SKAI Points",
          },
          {
            id: "vault",
            value: "$1,234",
            icon: <Wallet className="h-3 w-3" />,
            tooltip: "Vault Balance",
          },
          {
            id: "streak",
            value: "5",
            icon: <Flame className="h-3 w-3" />,
            highlight: "positive",
            tooltip: "Day Streak",
          },
        ]}
      />
    </div>
  ),
};
