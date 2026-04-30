import type { Meta, StoryObj } from "@storybook/react";
import { Countdown } from "./countdown";

const meta: Meta<typeof Countdown> = {
  title: "Data Display/Countdown",
  component: Countdown,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    format: {
      control: "select",
      options: ["full", "short", "minimal", "boxes"],
    },
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    variant: {
      control: "select",
      options: ["default", "muted", "urgent", "success"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const inOneHour = () => new Date(Date.now() + 60 * 60 * 1000);

export const Default: Story = {
  args: { target: inOneHour(), format: "short" },
};

export const BoxesFormat: Story = {
  args: { target: inOneHour(), format: "boxes", size: "lg" },
};

export const Urgent: Story = {
  args: {
    target: new Date(Date.now() + 30 * 1000),
    format: "minimal",
    size: "xl",
    urgentThreshold: 60,
  },
};
