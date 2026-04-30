import type { Meta, StoryObj } from "@storybook/react";
import { CopyButton } from "./copy-button";

const meta: Meta<typeof CopyButton> = {
  title: "Utility/CopyButton",
  component: CopyButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: "0x1234567890abcdef" },
};

export const WithLabel: Story = {
  args: {
    value: "https://skai.trade/share/abc123",
    showLabel: true,
    variant: "outline",
    size: "sm",
  },
};

export const CustomLabels: Story = {
  args: {
    value: "secret-api-key",
    showLabel: true,
    labels: { copy: "Copy key", copied: "Copied to clipboard" },
    variant: "outline",
  },
};
