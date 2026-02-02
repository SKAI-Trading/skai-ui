import type { Meta, StoryObj } from "@storybook/react";
import { PercentageBar, SegmentedBar } from "../components/data-display/percentage-bar";

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
      options: ["sm", "md", "lg", "xl"],
    },
    color: {
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
      <PercentageBar value={0} showLabel />
      <PercentageBar value={25} showLabel />
      <PercentageBar value={50} showLabel />
      <PercentageBar value={75} showLabel />
      <PercentageBar value={100} showLabel />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <PercentageBar value={60} color="default" showLabel />
      <PercentageBar value={60} color="success" showLabel />
      <PercentageBar value={60} color="warning" showLabel />
      <PercentageBar value={60} color="error" showLabel />
      <PercentageBar value={60} color="gradient" showLabel />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="w-64 space-y-4">
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
      <div>
        <span className="text-xs text-muted-foreground">xl</span>
        <PercentageBar value={60} size="xl" />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    value: 75,
    showLabel: true,
  },
};

export const Animated: Story = {
  args: {
    value: 80,
    animated: true,
    showLabel: true,
  },
};

export const GradientAnimated: Story = {
  args: {
    value: 65,
    animated: true,
    color: "gradient",
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
        showTooltips
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
        showTooltips
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
        showTooltips
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
        size="sm"
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
      <SegmentedBar
        segments={[
          { value: 60, color: "bg-blue-500" },
          { value: 40, color: "bg-orange-500" },
        ]}
        size="xl"
      />
    </div>
  ),
};
