import type { Meta, StoryObj } from "@storybook/react";
import { PercentageBar, SegmentedBar } from "../components/percentage-bar";

const meta: Meta<typeof PercentageBar> = {
  title: "Data Display/PercentageBar",
  component: PercentageBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "gradient"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PercentageBar>;

export const Default: Story = {
  args: {
    value: 65,
  },
};

export const Values: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <PercentageBar value={0} showValue />
      <PercentageBar value={25} showValue />
      <PercentageBar value={50} showValue />
      <PercentageBar value={75} showValue />
      <PercentageBar value={100} showValue />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <PercentageBar value={60} variant="default" showValue />
      <PercentageBar value={60} variant="success" showValue />
      <PercentageBar value={60} variant="warning" showValue />
      <PercentageBar value={60} variant="error" showValue />
      <PercentageBar value={60} variant="gradient" showValue />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div>
        <span className="text-xs text-muted-foreground">xs</span>
        <PercentageBar value={60} size="xs" />
      </div>
      <div>
        <span className="text-xs text-muted-foreground">sm</span>
        <PercentageBar value={60} size="sm" />
      </div>
      <div>
        <span className="text-xs text-muted-foreground">md</span>
        <PercentageBar value={60} size="md" />
      </div>
      <div>
        <span className="text-xs text-muted-foreground">lg</span>
        <PercentageBar value={60} size="lg" />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    value: 75,
    showValue: true,
    label: "Progress",
  },
};

export const Animated: Story = {
  args: {
    value: 80,
    animated: true,
    showValue: true,
  },
};

export const Striped: Story = {
  args: {
    value: 65,
    striped: true,
    animated: true,
    variant: "gradient",
  },
};

// Segmented Bar stories
export const SegmentedDefault: Story = {
  render: () => (
    <div className="w-64">
      <SegmentedBar
        segments={[
          { value: 40, color: "bg-green-500", label: "Complete" },
          { value: 35, color: "bg-yellow-500", label: "In Progress" },
          { value: 25, color: "bg-red-500", label: "Failed" },
        ]}
        showLegend
      />
    </div>
  ),
};

export const BuyVsSell: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      <p className="text-sm font-medium">Buy vs Sell Pressure</p>
      <SegmentedBar
        segments={[
          { value: 65, color: "bg-green-500", label: "Buy" },
          { value: 35, color: "bg-red-500", label: "Sell" },
        ]}
        showLegend
      />
    </div>
  ),
};

export const MultipleSegments: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <p className="text-sm font-medium">Portfolio Allocation</p>
      <SegmentedBar
        segments={[
          { value: 35, color: "bg-blue-500", label: "BTC" },
          { value: 25, color: "bg-purple-500", label: "ETH" },
          { value: 15, color: "bg-orange-500", label: "SOL" },
          { value: 15, color: "bg-green-500", label: "USDC" },
          { value: 10, color: "bg-gray-500", label: "Other" },
        ]}
        showLegend
        size="md"
      />
    </div>
  ),
};

export const CompactSegmented: Story = {
  render: () => (
    <div className="w-48">
      <SegmentedBar
        segments={[
          { value: 60, color: "bg-green-500" },
          { value: 40, color: "bg-red-500" },
        ]}
        size="xs"
      />
    </div>
  ),
};

export const SegmentedSizes: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <SegmentedBar
        segments={[
          { value: 60, color: "bg-blue-500" },
          { value: 40, color: "bg-orange-500" },
        ]}
        size="xs"
      />
      <SegmentedBar
        segments={[
          { value: 60, color: "bg-blue-500" },
          { value: 40, color: "bg-orange-500" },
        ]}
        size="sm"
      />
      <SegmentedBar
        segments={[
          { value: 60, color: "bg-blue-500" },
          { value: 40, color: "bg-orange-500" },
        ]}
        size="md"
      />
      <SegmentedBar
        segments={[
          { value: 60, color: "bg-blue-500" },
          { value: 40, color: "bg-orange-500" },
        ]}
        size="lg"
      />
    </div>
  ),
};
