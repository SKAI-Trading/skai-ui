import type { Meta, StoryObj } from "@storybook/react";
import { WalletAddress } from "../components/trading/wallet-address";

const meta: Meta<typeof WalletAddress> = {
  title: "Trading/WalletAddress",
  component: WalletAddress,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Display truncated wallet addresses with copy and explorer link functionality.",
      },
    },
  },
  argTypes: {
    address: {
      control: "text",
      description: "The wallet address to display",
    },
    startChars: {
      control: { type: "number", min: 4, max: 20 },
      description: "Characters to show at start",
    },
    endChars: {
      control: { type: "number", min: 4, max: 20 },
      description: "Characters to show at end",
    },
    showCopy: {
      control: "boolean",
      description: "Show copy button",
    },
    showExplorer: {
      control: "boolean",
      description: "Show explorer link",
    },
    chain: {
      control: "select",
      options: ["ethereum", "base", "arbitrum", "optimism", "polygon", "solana"],
    },
    variant: {
      control: "select",
      options: ["default", "badge", "inline"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof WalletAddress>;

const SAMPLE_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f1EaAb";

export const Default: Story = {
  args: {
    address: SAMPLE_ADDRESS,
  },
};

export const WithExplorer: Story = {
  args: {
    address: SAMPLE_ADDRESS,
    showExplorer: true,
    chain: "ethereum",
  },
};

export const BadgeVariant: Story = {
  args: {
    address: SAMPLE_ADDRESS,
    variant: "badge",
    showCopy: true,
  },
};

export const InlineVariant: Story = {
  args: {
    address: SAMPLE_ADDRESS,
    variant: "inline",
  },
};

export const DifferentChains: Story = {
  name: "Different Chains",
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-muted-foreground">Ethereum</span>
        <WalletAddress address={SAMPLE_ADDRESS} chain="ethereum" showExplorer />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-muted-foreground">Base</span>
        <WalletAddress address={SAMPLE_ADDRESS} chain="base" showExplorer />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-muted-foreground">Arbitrum</span>
        <WalletAddress address={SAMPLE_ADDRESS} chain="arbitrum" showExplorer />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-muted-foreground">Optimism</span>
        <WalletAddress address={SAMPLE_ADDRESS} chain="optimism" showExplorer />
      </div>
    </div>
  ),
};

export const TruncationOptions: Story = {
  name: "Truncation Options",
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Default (6...4)</p>
        <WalletAddress address={SAMPLE_ADDRESS} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">More chars (10...6)</p>
        <WalletAddress address={SAMPLE_ADDRESS} startChars={10} endChars={6} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">Minimal (4...4)</p>
        <WalletAddress address={SAMPLE_ADDRESS} startChars={4} endChars={4} />
      </div>
    </div>
  ),
};

export const InContext: Story = {
  name: "In Context",
  render: () => (
    <div className="p-4 bg-card rounded-lg border w-[350px]">
      <h3 className="font-semibold mb-3">Position Details</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Owner</span>
          <WalletAddress address={SAMPLE_ADDRESS} variant="inline" />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Contract</span>
          <WalletAddress 
            address="0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" 
            variant="inline"
            showExplorer
            chain="ethereum"
          />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Token</span>
          <WalletAddress 
            address="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" 
            variant="badge"
          />
        </div>
      </div>
    </div>
  ),
};
