import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "../components/data-display/stat-card";
import { Activity, TrendingUp, Users, Wallet } from "lucide-react";

const meta: Meta<typeof StatCard> = {
  title: "Composites/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Card for displaying statistics with title, value, trend indicators, and optional icon.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Stat label",
    },
    value: {
      control: "text",
      description: "Main value to display",
    },
    change: {
      control: "number",
      description: "Change percentage (positive or negative)",
    },
    changePeriod: {
      control: "text",
      description: "Period for the change (e.g., '24h', '7d')",
    },
    compact: {
      control: "boolean",
      description: "Compact variant",
    },
    loading: {
      control: "boolean",
      description: "Show loading skeleton",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Total Revenue",
    value: "$45,231.89",
    change: 20.1,
    changePeriod: "last month",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Active Users",
    value: "2,350",
    change: 12.5,
    changePeriod: "last week",
    icon: <Users className="h-4 w-4" />,
  },
};

export const NegativeChange: Story = {
  args: {
    title: "Bounce Rate",
    value: "42.3%",
    change: -5.2,
    changePeriod: "last month",
    icon: <Activity className="h-4 w-4" />,
  },
};

export const CompactVariant: Story = {
  args: {
    title: "Balance",
    value: "$12,450",
    change: 3.2,
    compact: true,
    icon: <Wallet className="h-4 w-4" />,
  },
};

export const Loading: Story = {
  args: {
    title: "Total Revenue",
    value: "$45,231.89",
    loading: true,
  },
};

export const StatGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[600px]">
      <StatCard
        title="Total Revenue"
        value="$45,231.89"
        change={20.1}
        changePeriod="last month"
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <StatCard
        title="Active Users"
        value="2,350"
        change={12.5}
        changePeriod="last week"
        icon={<Users className="h-4 w-4" />}
      />
      <StatCard
        title="Portfolio Value"
        value="$128,430.00"
        change={-2.3}
        changePeriod="24h"
        icon={<Wallet className="h-4 w-4" />}
      />
      <StatCard
        title="Transactions"
        value="1,429"
        change={8.7}
        changePeriod="this week"
        icon={<Activity className="h-4 w-4" />}
      />
    </div>
  ),
};

export const CompactGrid: Story = {
  render: () => (
    <div className="flex gap-4">
      <StatCard title="ETH" value="$2,847.32" change={5.2} compact />
      <StatCard title="BTC" value="$67,432.10" change={-1.8} compact />
      <StatCard title="SOL" value="$142.56" change={12.3} compact />
    </div>
  ),
};
