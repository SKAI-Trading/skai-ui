import type { Meta, StoryObj } from "@storybook/react";
import { SwapPageTemplate } from "./swap-page";

const meta: Meta<typeof SwapPageTemplate> = {
  title: "Templates/Swap",
  component: SwapPageTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["stable"],
};

export default meta;
type Story = StoryObj<typeof SwapPageTemplate>;

export const Default: Story = {
  args: {
    fromToken: { symbol: "ETH", name: "Ethereum", balance: "2.45" },
    toToken: { symbol: "USDC", name: "USD Coin", balance: "5,000.00" },
    fromAmount: "1.0",
    toAmount: "3,456.78",
    exchangeRate: "1 ETH = 3,456.78 USDC",
    gasEstimate: "~$2.50",
    slippage: 0.5,
    buttonText: "Swap",
  },
};
