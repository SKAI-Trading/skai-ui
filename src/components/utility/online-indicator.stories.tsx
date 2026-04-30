import type { Meta, StoryObj } from "@storybook/react";
import { OnlineIndicator } from "./online-indicator";

const meta: Meta<typeof OnlineIndicator> = {
  title: "Utility/OnlineIndicator",
  component: OnlineIndicator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    isOnline: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Online: Story = {
  args: { isOnline: true, size: "md" },
};

export const Offline: Story = {
  args: { isOnline: false, size: "md" },
};

export const OnAvatar: Story = {
  render: () => (
    <div className="relative inline-block">
      <div className="h-10 w-10 rounded-full bg-muted" aria-label="avatar" />
      <OnlineIndicator isOnline absolute />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <OnlineIndicator isOnline size="sm" />
      <OnlineIndicator isOnline size="md" />
      <OnlineIndicator isOnline size="lg" />
    </div>
  ),
};
