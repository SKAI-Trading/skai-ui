import type { Meta, StoryObj } from "@storybook/react";
import { TokenIcon } from "../components/token-icon";

const meta: Meta<typeof TokenIcon> = {
  title: "Trading/TokenIcon",
  component: TokenIcon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays a token logo with automatic fallback to a colored initial. Uses CoinGecko for token images.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    symbol: {
      control: "text",
      description: "Token symbol (e.g., ETH, USDC)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Icon size",
    },
    src: {
      control: "text",
      description: "Custom image URL (overrides auto-generated URL)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    symbol: "ETH",
    size: "md",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <TokenIcon symbol="ETH" size="sm" />
      <TokenIcon symbol="ETH" size="md" />
      <TokenIcon symbol="ETH" size="lg" />
      <TokenIcon symbol="ETH" size="xl" />
    </div>
  ),
};

export const CommonTokens: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <TokenIcon symbol="ETH" size="lg" />
      <TokenIcon symbol="BTC" size="lg" />
      <TokenIcon symbol="USDC" size="lg" />
      <TokenIcon symbol="USDT" size="lg" />
      <TokenIcon symbol="DAI" size="lg" />
    </div>
  ),
};

export const WithFallback: Story = {
  args: {
    symbol: "SKAI",
    size: "lg",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Unknown tokens show a colored circle with the first letter. Color is generated from the symbol.",
      },
    },
  },
};

export const CustomImage: Story = {
  args: {
    symbol: "CUSTOM",
    size: "lg",
    src: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  },
};
