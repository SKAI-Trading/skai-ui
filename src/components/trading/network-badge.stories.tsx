import type { Meta, StoryObj } from "@storybook/react";
import { NetworkBadge } from "./network-badge";

const meta: Meta<typeof NetworkBadge> = {
  title: "Trading/NetworkBadge",
  component: NetworkBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    variant: { control: "select", options: ["default", "colored"] },
    shortName: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { chainId: 1 },
};

export const AllNetworks: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <NetworkBadge chainId={1} />
      <NetworkBadge chainId={8453} />
      <NetworkBadge chainId={10} />
      <NetworkBadge chainId={42161} />
      <NetworkBadge chainId={137} />
      <NetworkBadge chainId={56} />
    </div>
  ),
};

export const ShortNames: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <NetworkBadge chainId={1} shortName />
      <NetworkBadge chainId={8453} shortName />
      <NetworkBadge chainId={42161} shortName />
    </div>
  ),
};
