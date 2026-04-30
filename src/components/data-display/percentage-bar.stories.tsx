import type { Meta, StoryObj } from "@storybook/react";
import { PercentageBar } from "./percentage-bar";

const meta: Meta<typeof PercentageBar> = {
  title: "Data Display/PercentageBar",
  component: PercentageBar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    color: {
      control: "select",
      options: ["default", "success", "warning", "error", "gradient"],
    },
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-72">
      <PercentageBar value={65} showLabel />
    </div>
  ),
};

export const Gradient: Story = {
  render: () => (
    <div className="w-72">
      <PercentageBar value={80} color="gradient" size="lg" showLabel />
    </div>
  ),
};

export const WarningStates: Story = {
  render: () => (
    <div className="w-72 space-y-3">
      <PercentageBar value={20} color="error" showLabel />
      <PercentageBar value={50} color="warning" showLabel />
      <PercentageBar value={90} color="success" showLabel />
    </div>
  ),
};
