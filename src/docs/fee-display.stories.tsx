import type { Meta, StoryObj } from "@storybook/react";
import { FeeDisplay, HouseEdgeDisplay } from "../components/trading/fee-display";

const meta: Meta<typeof FeeDisplay> = {
  title: "Trading/FeeDisplay",
  component: FeeDisplay,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays trading fees with breakdown. Shows platform fee calculation based on amount and fee percentage.",
      },
    },
  },
  argTypes: {
    amount: {
      control: { type: "number", min: 0, step: 10 },
      description: "Input amount for fee calculation",
    },
    feePercent: {
      control: { type: "number", min: 0, max: 10, step: 0.01 },
      description: "Fee percentage (e.g., 0.3 for 0.3%)",
    },
    tokenSymbol: {
      control: "text",
      description: "Token symbol to display",
    },
    showBreakdown: {
      control: "boolean",
      description: "Show detailed fee breakdown",
    },
    variant: {
      control: "select",
      options: ["default", "compact", "inline"],
      description: "Display variant",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeeDisplay>;

/**
 * Default fee display showing standard trading fee
 */
export const Default: Story = {
  args: {
    amount: 1000,
    feePercent: 0.3,
    tokenSymbol: "USDC",
    showBreakdown: true,
  },
};

/**
 * Low fee for high-volume traders
 */
export const LowFee: Story = {
  args: {
    amount: 10000,
    feePercent: 0.05,
    tokenSymbol: "USDC",
    showBreakdown: true,
  },
};

/**
 * Compact variant for inline display
 */
export const CompactVariant: Story = {
  args: {
    amount: 500,
    feePercent: 0.25,
    variant: "compact",
    tokenSymbol: "ETH",
  },
};

/**
 * Inline variant for tight spaces
 */
export const InlineVariant: Story = {
  args: {
    amount: 100,
    feePercent: 0.3,
    variant: "inline",
  },
};

/**
 * House edge display for gaming features
 */
export const HouseEdge: Story = {
  render: () => <HouseEdgeDisplay houseEdge={2.5} />,
};

/**
 * House edge with low advantage
 */
export const LowHouseEdge: Story = {
  render: () => <HouseEdgeDisplay houseEdge={1.0} />,
};

/**
 * Multiple fee displays in a comparison list
 */
export const FeeComparison: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Free Tier (0.30%)</p>
        <FeeDisplay amount={1000} feePercent={0.3} tokenSymbol="USDC" />
      </div>
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">
          Bronze Tier (0.25%)
        </p>
        <FeeDisplay amount={1000} feePercent={0.25} tokenSymbol="USDC" />
      </div>
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Gold Tier (0.15%)</p>
        <FeeDisplay amount={1000} feePercent={0.15} tokenSymbol="USDC" />
      </div>
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">
          Diamond Tier (0.05%)
        </p>
        <FeeDisplay amount={1000} feePercent={0.05} tokenSymbol="USDC" />
      </div>
    </div>
  ),
};
