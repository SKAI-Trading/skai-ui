import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { GasEstimate, GasSpeedSelector } from "../components/gas-estimate";

const meta: Meta<typeof GasEstimate> = {
  title: "Trading/GasEstimate",
  component: GasEstimate,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof GasEstimate>;

export const Default: Story = {
  args: {
    gasPrice: 25,
    estimatedCost: 1.25,
  },
};

export const LowGas: Story = {
  args: {
    gasPrice: 15,
    estimatedCost: 0.75,
    estimatedTime: 30,
  },
};

export const MediumGas: Story = {
  args: {
    gasPrice: 50,
    estimatedCost: 2.5,
    estimatedTime: 15,
  },
};

export const HighGas: Story = {
  args: {
    gasPrice: 150,
    estimatedCost: 7.5,
    estimatedTime: 5,
  },
};

export const WithGasLimit: Story = {
  args: {
    gasPrice: 35,
    estimatedCost: 1.75,
    gasLimit: 150000,
    estimatedTime: 20,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <GasEstimate gasPrice={30} estimatedCost={1.5} size="xs" />
      <GasEstimate gasPrice={30} estimatedCost={1.5} size="sm" />
      <GasEstimate gasPrice={30} estimatedCost={1.5} size="md" />
    </div>
  ),
};

export const NoIcon: Story = {
  args: {
    gasPrice: 25,
    estimatedCost: 1.25,
    showIcon: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Error: Story = {
  args: {
    error: "Failed to estimate gas",
  },
};

export const NoTooltip: Story = {
  args: {
    gasPrice: 25,
    estimatedCost: 1.25,
    showTooltip: false,
  },
};

// Gas Speed Selector stories
export const SpeedSelector: Story = {
  render: function SpeedSelectorStory() {
    const [selected, setSelected] = useState(1);
    const options = [
      { label: "Slow", gasPrice: 20, estimatedTime: 300 },
      { label: "Standard", gasPrice: 35, estimatedTime: 60 },
      { label: "Fast", gasPrice: 60, estimatedTime: 15 },
    ];
    const costs = [0.5, 0.87, 1.5];

    return (
      <div className="w-80">
        <GasSpeedSelector
          options={options}
          selected={selected}
          onChange={setSelected}
          estimatedCosts={costs}
        />
      </div>
    );
  },
};

export const SpeedSelectorWithDetails: Story = {
  render: function SpeedSelectorWithDetailsStory() {
    const [selected, setSelected] = useState(1);
    const options = [
      { label: "🐢 Slow", gasPrice: 20, estimatedTime: 300 },
      { label: "⚡ Standard", gasPrice: 35, estimatedTime: 60 },
      { label: "🚀 Fast", gasPrice: 60, estimatedTime: 15 },
      { label: "⚡⚡ Instant", gasPrice: 100, estimatedTime: 5 },
    ];
    const costs = [0.5, 0.87, 1.5, 2.5];

    return (
      <div className="w-96 space-y-4">
        <GasSpeedSelector
          options={options}
          selected={selected}
          onChange={setSelected}
          estimatedCosts={costs}
        />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Selected:</span>
          <GasEstimate
            gasPrice={options[selected].gasPrice}
            estimatedCost={costs[selected]}
            estimatedTime={options[selected].estimatedTime}
          />
        </div>
      </div>
    );
  },
};
