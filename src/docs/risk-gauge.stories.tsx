import type { Meta, StoryObj } from "@storybook/react";
import { RiskGauge, RiskBar, RiskMeter, RiskScoreCard } from "../components/trading/risk-gauge";

const meta: Meta<typeof RiskGauge> = {
  title: "Trading/RiskGauge",
  component: RiskGauge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Visual risk indicator with multiple display styles. Shows risk score from 0-100 with color-coded levels.",
      },
    },
  },
  argTypes: {
    score: {
      control: { type: "range", min: 0, max: 100 },
      description: "Risk score from 0-100",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["arc", "bar", "circle"],
    },
    showScore: {
      control: "boolean",
      description: "Show numeric score",
    },
    showLabel: {
      control: "boolean",
      description: "Show risk label",
    },
    animated: {
      control: "boolean",
      description: "Animate on mount",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RiskGauge>;

export const LowRisk: Story = {
  args: {
    score: 20,
    showScore: true,
    showLabel: true,
  },
};

export const MediumRisk: Story = {
  args: {
    score: 45,
    showScore: true,
    showLabel: true,
  },
};

export const HighRisk: Story = {
  args: {
    score: 70,
    showScore: true,
    showLabel: true,
  },
};

export const CriticalRisk: Story = {
  args: {
    score: 90,
    showScore: true,
    showLabel: true,
  },
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex items-end gap-6">
      <RiskGauge score={65} size="sm" showScore showLabel />
      <RiskGauge score={65} size="md" showScore showLabel />
      <RiskGauge score={65} size="lg" showScore showLabel />
      <RiskGauge score={65} size="xl" showScore showLabel />
    </div>
  ),
};

export const BarVariant: Story = {
  name: "Bar Variant",
  render: () => (
    <div className="space-y-6 w-[300px]">
      <RiskBar score={15} showLabel />
      <RiskBar score={40} showLabel />
      <RiskBar score={65} showLabel />
      <RiskBar score={88} showLabel />
    </div>
  ),
};

export const MeterVariant: Story = {
  name: "Meter Variant",
  render: () => (
    <div className="flex gap-6">
      <RiskMeter score={25} label="Position Risk" />
      <RiskMeter score={55} label="Portfolio Risk" />
      <RiskMeter score={80} label="Leverage Risk" />
    </div>
  ),
};

export const ScoreCards: Story = {
  name: "Score Cards",
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[400px]">
      <RiskScoreCard
        title="Liquidation Risk"
        score={25}
        description="Your position is well-collateralized"
      />
      <RiskScoreCard
        title="Exposure Risk"
        score={65}
        description="High concentration in single asset"
      />
      <RiskScoreCard
        title="Volatility Risk"
        score={45}
        description="Moderate price movement expected"
      />
      <RiskScoreCard
        title="Smart Contract Risk"
        score={15}
        description="Protocol is audited and battle-tested"
      />
    </div>
  ),
};

export const TradingContext: Story = {
  name: "Trading Context",
  render: () => (
    <div className="p-4 bg-card rounded-lg border w-[350px]">
      <h3 className="font-semibold mb-4">Position Health</h3>
      <div className="flex items-center gap-6">
        <RiskGauge score={35} size="lg" animated />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Health Factor</span>
            <span className="font-medium text-green-500">1.85</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Liq. Price</span>
            <span className="font-medium">$2,145.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Price</span>
            <span className="font-medium">$3,456.78</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
