import type { Meta, StoryObj } from "@storybook/react";
import { SkaiIcon } from "./skai-icon";

const meta: Meta<typeof SkaiIcon> = {
  title: "Branding/SkaiIcon",
  component: SkaiIcon,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "home", size: "md" },
};

export const Large: Story = {
  args: { name: "chart-line", size: "lg" },
};

export const SmallTrading: Story = {
  args: { name: "chart-candle", size: "sm" },
};
