import type { Meta, StoryObj } from "@storybook/react";
import { PriceChange, PercentageChange, USDChange } from "./price-change";

const meta: Meta<typeof PriceChange> = {
  title: "Trading/PriceChange",
  component: PriceChange,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 5.23, isPercentage: true },
};

export const Negative: Story = {
  args: { value: -2.14, isPercentage: true, size: "md" },
};

export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <PercentageChange value={4.2} />
      <PercentageChange value={-1.5} />
      <USDChange value={1234.56} />
      <USDChange value={-89.32} />
    </div>
  ),
};
