import type { Meta, StoryObj } from "@storybook/react";
import { LiquidationWarning } from "../components/trading/liquidation-warning";

const meta: Meta<typeof LiquidationWarning> = {
  title: "Trading/LiquidationWarning",
  component: LiquidationWarning,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Visual alert when position is near liquidation. Shows risk level, distance to liquidation price, and provides warnings at configurable thresholds.",
      },
    },
  },
  argTypes: {
    side: {
      control: "radio",
      options: ["long", "short"],
    },
    leverage: {
      control: { type: "number", min: 1, max: 100 },
    },
    compact: {
      control: "boolean",
    },
    showPercentage: {
      control: "boolean",
    },
    showPrice: {
      control: "boolean",
    },
    animate: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LiquidationWarning>;

export const SafePosition: Story = {
  name: "Safe (>20% from liquidation)",
  args: {
    currentPrice: 50000,
    liquidationPrice: 38000,
    entryPrice: 48000,
    side: "long",
    leverage: 10,
  },
};

export const WarningLevel: Story = {
  name: "Warning (10-20% from liquidation)",
  args: {
    currentPrice: 50000,
    liquidationPrice: 42500,
    entryPrice: 52000,
    side: "long",
    leverage: 10,
  },
};

export const DangerLevel: Story = {
  name: "Danger (5-10% from liquidation)",
  args: {
    currentPrice: 50000,
    liquidationPrice: 46000,
    entryPrice: 52000,
    side: "long",
    leverage: 20,
  },
};

export const CriticalLevel: Story = {
  name: "Critical (<5% from liquidation)",
  args: {
    currentPrice: 50000,
    liquidationPrice: 48500,
    entryPrice: 52000,
    side: "long",
    leverage: 50,
  },
};

export const ShortPosition: Story = {
  name: "Short Position - Critical",
  args: {
    currentPrice: 50000,
    liquidationPrice: 52000,
    entryPrice: 48000,
    side: "short",
    leverage: 25,
  },
};

export const Compact: Story = {
  name: "Compact Mode",
  args: {
    currentPrice: 50000,
    liquidationPrice: 46000,
    entryPrice: 52000,
    side: "long",
    leverage: 20,
    compact: true,
  },
};

export const CustomThresholds: Story = {
  name: "Custom Risk Thresholds",
  args: {
    currentPrice: 50000,
    liquidationPrice: 47000,
    entryPrice: 52000,
    side: "long",
    leverage: 15,
    thresholds: {
      safe: 0.15, // 15%
      warning: 0.08, // 8%
      danger: 0.03, // 3%
    },
  },
};

export const PositionCard: Story = {
  name: "In Position Card",
  render: () => (
    <div className="max-w-sm space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">BTC-PERP Long</h3>
          <p className="text-sm text-muted-foreground">10x Leverage</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg text-green-500">+$1,234.56</p>
          <p className="text-sm text-muted-foreground">+5.2%</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground">Entry</p>
          <p className="font-mono">$48,000</p>
        </div>
        <div>
          <p className="text-muted-foreground">Mark</p>
          <p className="font-mono">$50,500</p>
        </div>
        <div>
          <p className="text-muted-foreground">Size</p>
          <p className="font-mono">0.5 BTC</p>
        </div>
      </div>

      <LiquidationWarning
        currentPrice={50500}
        liquidationPrice={46000}
        entryPrice={48000}
        side="long"
        leverage={10}
      />
    </div>
  ),
};

export const MultiplePositions: Story = {
  name: "Multiple Positions",
  render: () => (
    <div className="max-w-md space-y-3">
      <h3 className="font-semibold">Active Positions</h3>

      {[
        {
          symbol: "BTC-PERP",
          side: "long" as const,
          currentPrice: 50000,
          liquidationPrice: 38000,
          entryPrice: 48000,
          leverage: 5,
          pnl: "+$234.50",
        },
        {
          symbol: "ETH-PERP",
          side: "short" as const,
          currentPrice: 2250,
          liquidationPrice: 2400,
          entryPrice: 2300,
          leverage: 20,
          pnl: "+$45.20",
        },
        {
          symbol: "SOL-PERP",
          side: "long" as const,
          currentPrice: 98,
          liquidationPrice: 94,
          entryPrice: 95,
          leverage: 25,
          pnl: "-$12.30",
        },
      ].map((pos) => (
        <div key={pos.symbol} className="space-y-2 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{pos.symbol}</span>
              <span
                className={`ml-2 text-xs ${pos.side === "long" ? "text-green-500" : "text-red-500"}`}
              >
                {pos.side.toUpperCase()} {pos.leverage}x
              </span>
            </div>
            <span
              className={pos.pnl.startsWith("+") ? "text-green-500" : "text-red-500"}
            >
              {pos.pnl}
            </span>
          </div>
          <LiquidationWarning
            currentPrice={pos.currentPrice}
            liquidationPrice={pos.liquidationPrice}
            entryPrice={pos.entryPrice}
            side={pos.side}
            leverage={pos.leverage}
            compact
          />
        </div>
      ))}
    </div>
  ),
};

export const WithCallback: Story = {
  name: "With Risk Level Callback",
  args: {
    currentPrice: 50000,
    liquidationPrice: 47000,
    entryPrice: 52000,
    side: "long",
    leverage: 15,
    onRiskLevelChange: (level) => console.log(`Risk level changed to: ${level}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the onRiskLevelChange callback to trigger alerts or actions when risk level changes.",
      },
    },
  },
};
