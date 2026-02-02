import type { Meta, StoryObj } from "@storybook/react";
import {
  NetworkBadge,
  MultiChainBadge,
  NETWORK_CONFIGS,
} from "../components/trading/network-badge";

const meta: Meta<typeof NetworkBadge> = {
  title: "Trading/NetworkBadge",
  component: NetworkBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["default", "colored"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NetworkBadge>;

export const Default: Story = {
  args: {
    chainId: 8453,
  },
};

export const AllNetworks: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {Object.keys(NETWORK_CONFIGS).map((chainId) => (
        <NetworkBadge key={chainId} chainId={parseInt(chainId)} />
      ))}
    </div>
  ),
};

export const ShortNames: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {Object.keys(NETWORK_CONFIGS).map((chainId) => (
        <NetworkBadge key={chainId} chainId={parseInt(chainId)} shortName />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <NetworkBadge chainId={8453} size="xs" />
      <NetworkBadge chainId={8453} size="sm" />
      <NetworkBadge chainId={8453} size="md" />
      <NetworkBadge chainId={8453} size="lg" />
    </div>
  ),
};

export const NoIcon: Story = {
  args: {
    chainId: 1,
    showIcon: false,
  },
};

export const UnknownNetwork: Story = {
  args: {
    chainId: 999999,
  },
};

export const MultiChain: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <span className="text-sm text-muted-foreground block mb-2">
          2 networks:
        </span>
        <MultiChainBadge chainIds={[8453, 10]} />
      </div>
      <div>
        <span className="text-sm text-muted-foreground block mb-2">
          5 networks (max 3 visible):
        </span>
        <MultiChainBadge chainIds={[1, 8453, 10, 42161, 137]} maxVisible={3} />
      </div>
      <div>
        <span className="text-sm text-muted-foreground block mb-2">
          All visible:
        </span>
        <MultiChainBadge chainIds={[1, 8453, 10, 42161, 137]} maxVisible={10} />
      </div>
    </div>
  ),
};

export const DefaultVariant: Story = {
  args: {
    chainId: 8453,
    variant: "default",
  },
};
