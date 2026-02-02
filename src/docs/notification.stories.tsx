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
    message: "This is a default notification message.",
    dismissible: true,
    onDismiss: () => {},
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success!",
    message: "Your transaction has been confirmed.",
    dismissible: true,
    onDismiss: () => {},
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    message: "Your session will expire in 5 minutes.",
    dismissible: true,
    onDismiss: () => {},
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    message: "Failed to complete the transaction. Please try again.",
    dismissible: true,
    onDismiss: () => {},
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "Info",
    message: "A new version is available.",
    dismissible: true,
    onDismiss: () => {},
  },
};

export const WithAction: Story = {
  args: {
    variant: "info",
    title: "Update Available",
    message: "A new version of the app is ready.",
    action: (
      <Button size="sm" variant="outline">
        Update Now
      </Button>
    ),
    dismissible: true,
    onDismiss: () => {},
  },
};

export const TitleOnly: Story = {
  args: {
    title: "File uploaded successfully",
    variant: "success",
    dismissible: true,
    onDismiss: () => {},
  },
};

export const NoClose: Story = {
  args: {
    title: "Important Notice",
    message: "This notification cannot be dismissed.",
    variant: "warning",
  },
};

export const LongContent: Story = {
  args: {
    title: "Transaction Details",
    message:
      "Your swap of 100 USDC for 0.0542 ETH has been confirmed. Transaction hash: 0x1234...abcd. Gas used: 150,000 gwei.",
    variant: "success",
    dismissible: true,
    onDismiss: () => {},
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <Notification
        title="Default"
        message="Default notification"
        dismissible
        onDismiss={() => {}}
      />
      <Notification
        variant="success"
        title="Success"
        message="Success notification"
        dismissible
        onDismiss={() => {}}
      />
      <Notification
        variant="warning"
        title="Warning"
        message="Warning notification"
        dismissible
        onDismiss={() => {}}
      />
      <Notification
        variant="error"
        title="Error"
        message="Error notification"
        dismissible
        onDismiss={() => {}}
      />
      <Notification
        variant="info"
        title="Info"
        message="Info notification"
        dismissible
        onDismiss={() => {}}
      />
    </div>
  ),
};

// NotificationStack stories
export const StackedNotifications: Story = {
  render: function StackedNotificationsStory() {
    const [notifications, setNotifications] = useState<
      Array<{
        id: string;
        variant: "success" | "warning" | "info" | "error";
        title: string;
        message: string;
      }>
    >([
      {
        id: "1",
        variant: "success",
        title: "Success",
        message: "Transaction confirmed",
      },
      {
        id: "2",
        variant: "warning",
        title: "Warning",
        message: "Low balance",
      },
      {
        id: "3",
        variant: "info",
        title: "Info",
        message: "New feature available",
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
          message: "New notification added",
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
              dismissible
              onDismiss={() => removeNotification(n.id)}
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
          <Notification
            variant="info"
            title="Top Left"
            dismissible
            onDismiss={() => {}}
          />
        </NotificationStack>
      </div>
      <div className="relative h-48 w-48 bg-muted rounded-lg">
        <NotificationStack
          position="top-right"
          className="scale-50 origin-top-right"
        >
          <Notification
            variant="info"
            title="Top Right"
            dismissible
            onDismiss={() => {}}
          />
        </NotificationStack>
      </div>
      <div className="relative h-48 w-48 bg-muted rounded-lg">
        <NotificationStack
          position="bottom-left"
          className="scale-50 origin-bottom-left"
        >
          <Notification
            variant="info"
            title="Bottom Left"
            dismissible
            onDismiss={() => {}}
          />
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
            dismissible
            onDismiss={() => {}}
          />
        </NotificationStack>
      </div>
    </div>
  ),
};
