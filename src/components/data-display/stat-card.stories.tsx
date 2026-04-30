import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./stat-card";
import { DollarSign, Users } from "lucide-react";

const meta: Meta<typeof StatCard> = {
  title: "Data Display/StatCard",
  component: StatCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-72">
      <StatCard
        title="Total Volume"
        value="$12.4M"
        change={5.23}
        changePeriod="24h"
      />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="w-72">
      <StatCard
        title="Active Users"
        value="1,284"
        icon={<Users className="h-4 w-4" />}
        change={-2.1}
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="w-72">
      <StatCard
        title="TVL"
        value="$8.2M"
        icon={<DollarSign className="h-4 w-4" />}
        change={1.7}
        compact
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="w-72">
      <StatCard title="Loading" value="—" loading />
    </div>
  ),
};
