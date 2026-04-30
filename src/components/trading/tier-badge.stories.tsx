import type { Meta, StoryObj } from "@storybook/react";
import { TierBadge } from "./tier-badge";

const meta: Meta<typeof TierBadge> = {
  title: "Trading/TierBadge",
  component: TierBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    tier: {
      control: "select",
      options: [
        "free",
        "bronze",
        "silver",
        "gold",
        "platinum",
        "diamond",
        "legend",
      ],
    },
    variant: {
      control: "select",
      options: ["default", "compact", "detailed", "icon-only"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tier: "gold" },
};

export const AllTiers: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <TierBadge tier="free" />
      <TierBadge tier="bronze" />
      <TierBadge tier="silver" />
      <TierBadge tier="gold" />
      <TierBadge tier="platinum" />
      <TierBadge tier="diamond" />
      <TierBadge tier="legend" />
    </div>
  ),
};

export const Detailed: Story = {
  args: {
    tier: "platinum",
    variant: "detailed",
    showFee: true,
    showPoints: true,
  },
};
