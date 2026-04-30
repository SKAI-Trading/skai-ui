import type { Meta, StoryObj } from "@storybook/react";
import { CircularProgress } from "./circular-progress";

const meta: Meta<typeof CircularProgress> = {
  title: "Feedback/CircularProgress",
  component: CircularProgress,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    size: { control: { type: "number", min: 24, max: 200 } },
    strokeWidth: { control: { type: "number", min: 1, max: 16 } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 65 },
};

export const NoLabel: Story = {
  args: { value: 80, showLabel: false, size: 96, strokeWidth: 8 },
};

export const Small: Story = {
  args: { value: 35, size: 32, strokeWidth: 3 },
};
