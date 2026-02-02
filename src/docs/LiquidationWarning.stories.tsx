import type { Meta, StoryObj } from "@storybook/react";
import {
  LiquidationWarning,
  LiquidationIndicator,
} from "../components/trading/liquidation-warning";

const meta: Meta<typeof LiquidationWarning> = {
  title: "Trading/LiquidationWarning",
  component: LiquidationWarning,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Visual alert component showing proximity to liquidation price. Displays risk level with color-coded warnings and progress indicator.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LiquidationWarning>;

export const Safe: Story = {
  args: {
    currentPrice: 3200,
    liquidationPrice: 2500,
    entryPrice: 3000,
    side: "long",
    leverage: 5,
  },
};

export const Warning: Story = {
  args: {
    currentPrice: 3200,
    liquidationPrice: 2900,
    entryPrice: 3000,
    side: "long",
    leverage: 10,
  },
};

export const Danger: Story = {
  args: {
    currentPrice: 3200,
    liquidationPrice: 3050,
    entryPrice: 3100,
    side: "long",
    leverage: 20,
  },
};

export const Critical: Story = {
  args: {
    currentPrice: 3200,
    liquidationPrice: 3150,
    entryPrice: 3180,
    side: "long",
    leverage: 50,
  },
};

export const ShortPosition: Story = {
  args: {
    currentPrice: 3200,
    liquidationPrice: 3400,
    entryPrice: 3300,
    side: "short",
    leverage: 10,
  },
};

export const ShortCritical: Story = {
  args: {
    currentPrice: 3200,
    liquidationPrice: 3250,
    entryPrice: 3150,
    side: "short",
    leverage: 25,
  },
};

export const Compact: Story = {
  args: {
    currentPrice: 3200,
    liquidationPrice: 3050,
    entryPrice: 3100,
    side: "long",
    leverage: 20,
    compact: true,
  },
};

export const CompactSafe: Story = {
  args: {
    currentPrice: 3200,
    liquidationPrice: 2500,
    entryPrice: 3000,
    side: "long",
    leverage: 5,
    compact: true,
  },
};

export const CompactCritical: Story = {
  args: {
    currentPrice: 3200,
    liquidationPrice: 3150,
    entryPrice: 3180,
    side: "long",
    leverage: 50,
    compact: true,
  },
};

export const NoAnimation: Story = {
  args: {
    currentPrice: 3200,
    liquidationPrice: 3150,
    entryPrice: 3180,
    side: "long",
    leverage: 50,
    animate: false,
  },
};

export const Indicator: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span>Safe:</span>
        <LiquidationIndicator distancePercent={0.25} />
      </div>
      <div className="flex items-center gap-4">
        <span>Warning:</span>
        <LiquidationIndicator distancePercent={0.15} />
      </div>
      <div className="flex items-center gap-4">
        <span>Danger:</span>
        <LiquidationIndicator distancePercent={0.08} />
      </div>
      <div className="flex items-center gap-4">
        <span>Critical:</span>
        <LiquidationIndicator distancePercent={0.03} />
      </div>
    </div>
  ),
};

export const AllRiskLevels: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <div>
        <h4 className="text-sm font-medium mb-2">Safe ({">"} 20% from liq)</h4>
        <LiquidationWarning
          currentPrice={3200}
          liquidationPrice={2500}
          entryPrice={3000}
          side="long"
          leverage={5}
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Warning (10-20% from liq)</h4>
        <LiquidationWarning
          currentPrice={3200}
          liquidationPrice={2900}
          entryPrice={3000}
          side="long"
          leverage={10}
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Danger (5-10% from liq)</h4>
        <LiquidationWarning
          currentPrice={3200}
          liquidationPrice={3050}
          entryPrice={3100}
          side="long"
          leverage={20}
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">
          Critical ({"<"} 5% from liq)
        </h4>
        <LiquidationWarning
          currentPrice={3200}
          liquidationPrice={3150}
          entryPrice={3180}
          side="long"
          leverage={50}
        />
      </div>
    </div>
  ),
};

export const PositionCard: Story = {
  render: () => (
    <div className="p-4 bg-card border rounded-lg w-96 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">ETH-PERP</h3>
          <span className="text-xs text-green-500">LONG 10x</span>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-500">+$245.67</p>
          <p className="text-xs text-muted-foreground">+7.5%</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Entry</span>
          <p className="font-medium">$3,000</p>
        </div>
        <div>
          <span className="text-muted-foreground">Mark</span>
          <p className="font-medium">$3,200</p>
        </div>
        <div>
          <span className="text-muted-foreground">Size</span>
          <p className="font-medium">0.5 ETH</p>
        </div>
      </div>

      <LiquidationWarning
        currentPrice={3200}
        liquidationPrice={2900}
        entryPrice={3000}
        side="long"
        leverage={10}
      />
    </div>
  ),
};
