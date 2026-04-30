import type { Meta, StoryObj } from "@storybook/react";
import { SkaiLogo } from "./skai-logo";

const meta: Meta<typeof SkaiLogo> = {
  title: "Branding/SkaiLogo",
  component: SkaiLogo,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "compact", "medium", "large"],
    },
    variant: { control: "select", options: ["white", "black"] },
    iconOnly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: "medium", variant: "white" },
};

export const IconOnly: Story = {
  args: { size: "medium", variant: "white", iconOnly: true },
};

export const BlackVariant: Story = {
  args: { size: "large", variant: "black" },
};
