import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Notification, NotificationStack } from "../components/notification";
import { Button } from "../components/button";

const meta: Meta<typeof Notification> = {
  title: "Feedback/Notification",
  component: Notification,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Default: Story = {
  args: {
    title: "Notification",
    description: "This is a default notification message.",
    onClose: () => {},
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success!",
    description: "Your transaction has been confirmed.",
    onClose: () => {},
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    description: "Your session will expire in 5 minutes.",
    onClose: () => {},
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    description: "Failed to complete the transaction. Please try again.",
    onClose: () => {},
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "Info",
    description: "A new version is available.",
    onClose: () => {},
  },
};

export const WithAction: Story = {
  args: {
    variant: "info",
    title: "Update Available",
    description: "A new version of the app is ready.",
    action: (
      <Button size="sm" variant="outline">
        Update Now
      </Button>
    ),
    onClose: () => {},
  },
};

export const TitleOnly: Story = {
  args: {
    title: "File uploaded successfully",
    variant: "success",
    onClose: () => {},
  },
};

export const NoClose: Story = {
  args: {
    title: "Important Notice",
    description: "This notification cannot be dismissed.",
    variant: "warning",
  },
};

export const LongContent: Story = {
  args: {
    title: "Transaction Details",
    description:
      "Your swap of 100 USDC for 0.0542 ETH has been confirmed. Transaction hash: 0x1234...abcd. Gas used: 150,000 gwei.",
    variant: "success",
    onClose: () => {},
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <Notification
        title="Default"
        description="Default notification"
        onClose={() => {}}
      />
      <Notification
        variant="success"
        title="Success"
        description="Success notification"
        onClose={() => {}}
      />
      <Notification
        variant="warning"
        title="Warning"
        description="Warning notification"
        onClose={() => {}}
      />
      <Notification
        variant="error"
        title="Error"
        description="Error notification"
        onClose={() => {}}
      />
      <Notification
        variant="info"
        title="Info"
        description="Info notification"
        onClose={() => {}}
      />
    </div>
  ),
};

// NotificationStack stories
export const StackedNotifications: Story = {
  render: function StackedNotificationsStory() {
    const [notifications, setNotifications] = useState([
      {
        id: "1",
        variant: "success" as const,
        title: "Success",
        description: "Transaction confirmed",
      },
      {
        id: "2",
        variant: "warning" as const,
        title: "Warning",
        description: "Low balance",
      },
      {
        id: "3",
        variant: "info" as const,
        title: "Info",
        description: "New feature available",
      },
    ]);

    const removeNotification = (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const addNotification = () => {
      const variants = ["success", "warning", "error", "info"] as const;
      const variant = variants[Math.floor(Math.random() * variants.length)];
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          variant,
          title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} #${prev.length + 1}`,
          description: "New notification added",
        },
      ]);
    };

    return (
      <div className="relative h-96 w-96 bg-background border rounded-lg overflow-hidden">
        <div className="p-4">
          <Button onClick={addNotification}>Add Notification</Button>
        </div>
        <NotificationStack position="top-right">
          {notifications.map((n) => (
            <Notification
              key={n.id}
              {...n}
              onClose={() => removeNotification(n.id)}
            />
          ))}
        </NotificationStack>
      </div>
    );
  },
};

export const StackPositions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="relative h-48 w-48 bg-muted rounded-lg">
        <NotificationStack
          position="top-left"
          className="scale-50 origin-top-left"
        >
          <Notification variant="info" title="Top Left" onClose={() => {}} />
        </NotificationStack>
      </div>
      <div className="relative h-48 w-48 bg-muted rounded-lg">
        <NotificationStack
          position="top-right"
          className="scale-50 origin-top-right"
        >
          <Notification variant="info" title="Top Right" onClose={() => {}} />
        </NotificationStack>
      </div>
      <div className="relative h-48 w-48 bg-muted rounded-lg">
        <NotificationStack
          position="bottom-left"
          className="scale-50 origin-bottom-left"
        >
          <Notification variant="info" title="Bottom Left" onClose={() => {}} />
        </NotificationStack>
      </div>
      <div className="relative h-48 w-48 bg-muted rounded-lg">
        <NotificationStack
          position="bottom-right"
          className="scale-50 origin-bottom-right"
        >
          <Notification
            variant="info"
            title="Bottom Right"
            onClose={() => {}}
          />
        </NotificationStack>
      </div>
    </div>
  ),
};
