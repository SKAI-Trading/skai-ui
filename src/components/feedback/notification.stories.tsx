import type { Meta, StoryObj } from "@storybook/react";
import { Notification } from "./notification";

const meta: Meta<typeof Notification> = {
  title: "Feedback/Notification",
  component: Notification,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Notification
        title="Heads up"
        message="Something happened that you should know about."
      />
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div className="w-96">
      <Notification
        title="Trade executed"
        message="Swapped 1.5 ETH for 4,250 USDC."
        variant="success"
      />
    </div>
  ),
};

export const ErrorVariant: Story = {
  render: () => (
    <div className="w-96">
      <Notification
        title="Transaction failed"
        message="Insufficient gas to complete the transaction."
        variant="error"
      />
    </div>
  ),
};
