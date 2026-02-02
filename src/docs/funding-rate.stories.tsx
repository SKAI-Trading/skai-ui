import type { Meta, StoryObj } from "@storybook/react";
import { FundingRateDisplay } from "../components/trading/funding-rate";

const meta: Meta<typeof FundingRateDisplay> = {
  title: "Trading/FundingRateDisplay",
  component: FundingRateDisplay,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Shows perpetual futures funding rate with countdown timer. Displays whether longs pay shorts or vice versa.",
      },
    },
  },
  argTypes: {
    rate: {
      control: { type: "number", step: 0.0001 },
      description: "Current funding rate as decimal (e.g., 0.0001 for 0.01%)",
    },
    nextFundingIn: {
      control: { type: "number" },
      description: "Time until next funding in seconds",
    },
    intervalHours: {
      control: { type: "number" },
      description: "Funding interval in hours",
    },
    showCountdown: {
      control: "boolean",
    },
    showAnnualized: {
      control: "boolean",
    },
    compact: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FundingRateDisplay>;

export const PositiveRate: Story = {
  name: "Positive Rate (Longs Pay)",
  args: {
    rate: 0.0001, // 0.01%
    nextFundingIn: 3600, // 1 hour
    showCountdown: true,
  },
};

export const NegativeRate: Story = {
  name: "Negative Rate (Shorts Pay)",
  args: {
    rate: -0.0002, // -0.02%
    nextFundingIn: 7200, // 2 hours
    showCountdown: true,
  },
};

export const HighRate: Story = {
  name: "High Funding Rate",
  args: {
    rate: 0.001, // 0.1%
    nextFundingIn: 1800, // 30 min
    showCountdown: true,
  },
};

export const Compact: Story = {
  name: "Compact Mode",
  args: {
    rate: 0.0001,
    nextFundingIn: 5400,
    compact: true,
  },
};

export const WithAnnualized: Story = {
  name: "With Annualized Rate",
  args: {
    rate: 0.0001, // 0.01% per 8h = ~10.95% annualized
    nextFundingIn: 3600,
    showAnnualized: true,
    intervalHours: 8,
  },
};

export const NoCountdown: Story = {
  name: "Without Countdown",
  args: {
    rate: 0.00005,
    nextFundingIn: 7200,
    showCountdown: false,
  },
};

export const TradingInterface: Story = {
  name: "In Trading Interface",
  render: () => (
    <div className="max-w-md space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">BTC-PERP</h3>
        <span className="text-sm text-muted-foreground">Perpetual</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Mark Price</p>
          <p className="font-mono text-lg">$43,521.50</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Index Price</p>
          <p className="font-mono text-lg">$43,518.20</p>
        </div>
      </div>

      <div className="border-t pt-2">
        <p className="mb-2 text-sm text-muted-foreground">Funding Rate</p>
        <FundingRateDisplay
          rate={0.0001}
          nextFundingIn={3600}
          showCountdown
          intervalHours={8}
        />
      </div>

      <div className="text-xs text-muted-foreground">
        <p>Funding occurs every 8 hours at 00:00, 08:00, 16:00 UTC</p>
      </div>
    </div>
  ),
};

export const MultipleMarkets: Story = {
  name: "Multiple Markets Comparison",
  render: () => (
    <div className="max-w-sm space-y-3">
      <h3 className="font-semibold">Funding Rates</h3>

      <div className="space-y-2">
        {[
          { symbol: "BTC-PERP", rate: 0.0001, time: 3600 },
          { symbol: "ETH-PERP", rate: 0.00015, time: 3600 },
          { symbol: "SOL-PERP", rate: -0.0001, time: 3600 },
          { symbol: "AVAX-PERP", rate: 0.0002, time: 3600 },
        ].map((market) => (
          <div
            key={market.symbol}
            className="flex items-center justify-between rounded border p-2"
          >
            <span className="font-medium">{market.symbol}</span>
            <FundingRateDisplay
              rate={market.rate}
              nextFundingIn={market.time}
              compact
            />
          </div>
        ))}
      </div>
    </div>
  ),
};
