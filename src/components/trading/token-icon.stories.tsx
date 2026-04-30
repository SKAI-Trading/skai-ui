import type { Meta, StoryObj } from "@storybook/react";
import { TokenIcon } from "./token-icon";

const meta: Meta<typeof TokenIcon> = {
  title: "Trading/TokenIcon",
  component: TokenIcon,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    showBorder: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { symbol: "ETH", size: "md" },
};

export const Pair: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <TokenIcon symbol="ETH" size="lg" showBorder />
      <TokenIcon symbol="USDC" size="lg" showBorder />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <TokenIcon symbol="BTC" size="xs" />
      <TokenIcon symbol="BTC" size="sm" />
      <TokenIcon symbol="BTC" size="md" />
      <TokenIcon symbol="BTC" size="lg" />
      <TokenIcon symbol="BTC" size="xl" />
    </div>
  ),
};

export const Unknown: Story = {
  args: { symbol: "ZZZ", size: "lg", fallbackColor: "#6366f1" },
};
