import type { Meta, StoryObj } from "@storybook/react";
import {
  FundingRateDisplay,
  FundingRateBadge,
} from "../components/trading/funding-rate";

const meta: Meta<typeof FundingRateDisplay> = {
  title: "Trading/FundingRateDisplay",
  component: FundingRateDisplay,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays perpetual futures funding rate with countdown timer to next funding. Shows whether longs or shorts are paying.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FundingRateDisplay>;

export const PositiveRate: Story = {
  args: {
    rate: 0.0001, // 0.01%
    nextFundingIn: 3600, // 1 hour
  },
};

export const NegativeRate: Story = {
  args: {
    rate: -0.0003, // -0.03%
    nextFundingIn: 7200, // 2 hours
  },
};

export const HighPositiveRate: Story = {
  args: {
    rate: 0.001, // 0.1%
    nextFundingIn: 1800, // 30 minutes
  },
};

export const WithAnnualized: Story = {
  args: {
    rate: 0.0001,
    nextFundingIn: 3600,
    showAnnualized: true,
  },
};

export const Compact: Story = {
  args: {
    rate: 0.0001,
    nextFundingIn: 3600,
    compact: true,
  },
};

export const CompactNegative: Story = {
  args: {
    rate: -0.0002,
    nextFundingIn: 5400,
    compact: true,
  },
};

export const NoCountdown: Story = {
  args: {
    rate: 0.00015,
    nextFundingIn: 3600,
    showCountdown: false,
  },
};

export const FourHourInterval: Story = {
  args: {
    rate: 0.0002,
    nextFundingIn: 7200,
    intervalHours: 4,
    showAnnualized: true,
  },
};

export const Badge: Story = {
  render: () => (
    <div className="flex gap-4">
      <FundingRateBadge rate={0.0001} />
      <FundingRateBadge rate={-0.0002} />
      <FundingRateBadge rate={0.0005} showSign={false} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <div>
        <h4 className="text-sm font-medium mb-2">Full Display - Positive</h4>
        <FundingRateDisplay rate={0.0001} nextFundingIn={3600} />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Full Display - Negative</h4>
        <FundingRateDisplay rate={-0.0002} nextFundingIn={5400} />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">With Annualized APR</h4>
        <FundingRateDisplay rate={0.0001} nextFundingIn={3600} showAnnualized />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Compact Variants</h4>
        <div className="flex gap-4">
          <FundingRateDisplay rate={0.0001} nextFundingIn={3600} compact />
          <FundingRateDisplay rate={-0.0002} nextFundingIn={5400} compact />
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Badge Variants</h4>
        <div className="flex gap-2">
          <FundingRateBadge rate={0.0001} />
          <FundingRateBadge rate={-0.0002} />
          <FundingRateBadge rate={0.0005} />
        </div>
      </div>
    </div>
  ),
};

export const TradingPanel: Story = {
  render: () => (
    <div className="p-4 bg-card border rounded-lg w-80 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">ETH-PERP</h3>
        <FundingRateBadge rate={0.0001} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Mark Price</span>
          <p className="font-medium">$3,245.67</p>
        </div>
        <div>
          <span className="text-muted-foreground">Index Price</span>
          <p className="font-medium">$3,244.12</p>
        </div>
      </div>
      <FundingRateDisplay rate={0.0001} nextFundingIn={3600} showAnnualized />
    </div>
  ),
};
