import type { Meta, StoryObj } from "@storybook/react";
import { PriceDisplay } from "./price-display";

const meta: Meta<typeof PriceDisplay> = {
  title: "Trading/PriceDisplay",
  component: PriceDisplay,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
    },
    trend: { control: "select", options: ["up", "down", "neutral"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 42850.12, currency: "$" },
};

export const WithChange: Story = {
  args: { value: 1.0234, currency: "$", change: 3.21, size: "lg" },
};

export const Compact: Story = {
  args: { value: 12_400_000, currency: "$", compact: true, size: "xl" },
};
