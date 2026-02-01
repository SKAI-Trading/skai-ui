import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "../components/stat-card";
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
    changeLabel: {
      control: "text",
      description: "Label for change (e.g., 'vs last week')",
    },
    variant: {
      control: "select",
      options: ["default", "compact"],
      description: "Card variant",
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
    changeLabel: "from last month",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Active Users",
    value: "2,350",
    change: 12.5,
    changeLabel: "from last week",
    icon: Users,
  },
};

export const NegativeChange: Story = {
  args: {
    title: "Bounce Rate",
    value: "42.3%",
    change: -5.2,
    changeLabel: "from last month",
    icon: Activity,
  },
};

export const CompactVariant: Story = {
  args: {
    title: "Balance",
    value: "$12,450",
    change: 3.2,
    variant: "compact",
    icon: Wallet,
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
        changeLabel="from last month"
        icon={TrendingUp}
      />
      <StatCard
        title="Active Users"
        value="2,350"
        change={12.5}
        changeLabel="from last week"
        icon={Users}
      />
      <StatCard
        title="Portfolio Value"
        value="$128,430.00"
        change={-2.3}
        changeLabel="24h change"
        icon={Wallet}
      />
      <StatCard
        title="Transactions"
        value="1,429"
        change={8.7}
        changeLabel="this week"
        icon={Activity}
      />
    </div>
  ),
};

export const CompactGrid: Story = {
  render: () => (
    <div className="flex gap-4">
      <StatCard title="ETH" value="$2,847.32" change={5.2} variant="compact" />
      <StatCard
        title="BTC"
        value="$67,432.10"
        change={-1.8}
        variant="compact"
      />
      <StatCard title="SOL" value="$142.56" change={12.3} variant="compact" />
    </div>
  ),
};
