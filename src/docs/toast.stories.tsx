import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/core/button";
import { Toaster } from "../components/toaster";
import { useToast } from "../hooks/use-toast";

const meta: Meta = {
  title: "Feedback/Toast",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Toast notifications for success, error, warning, and info messages. Auto-dismisses after a delay.",
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj;

/**
 * Default toast notification
 */
export const Default: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        onClick={() => {
          toast({
            title: "Notification",
            description: "This is a default toast message.",
          });
        }}
      >
        Show Toast
      </Button>
    );
  },
};

/**
 * Success toast for completed actions
 */
export const Success: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        variant="outline"
        className="border-green-500 text-green-500"
        onClick={() => {
          toast({
            variant: "success",
            title: "Transaction Confirmed",
            description: "Your swap of 1.5 ETH → 2,850 USDC was successful.",
          });
        }}
      >
        Show Success Toast
      </Button>
    );
  },
};

/**
 * Error toast for failures
 */
export const Destructive: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        variant="destructive"
        onClick={() => {
          toast({
            variant: "destructive",
            title: "Transaction Failed",
            description:
              "Insufficient balance. Please add funds and try again.",
          });
        }}
      >
        Show Error Toast
      </Button>
    );
  },
};

/**
 * Warning toast for important notices
 */
export const Warning: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        variant="outline"
        className="border-yellow-500 text-yellow-500"
        onClick={() => {
          toast({
            variant: "warning",
            title: "High Slippage Warning",
            description: "This trade has 5% slippage. Proceed with caution.",
          });
        }}
      >
        Show Warning Toast
      </Button>
    );
  },
};

/**
 * Toast with action button
 */
export const WithAction: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        onClick={() => {
          toast({
            title: "Copied to clipboard",
            description: "0x1234...5678",
            action: (
              <Button variant="outline" size="sm">
                View
              </Button>
            ),
          });
        }}
      >
        Toast with Action
      </Button>
    );
  },
};

/**
 * All toast variants
 */
export const AllVariants: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() =>
            toast({ title: "Default", description: "Default notification" })
          }
        >
          Default
        </Button>
        <Button
          variant="outline"
          className="border-green-500 text-green-500"
          onClick={() =>
            toast({
              variant: "success",
              title: "Success",
              description: "Action completed",
            })
          }
        >
          Success
        </Button>
        <Button
          variant="destructive"
          onClick={() =>
            toast({
              variant: "destructive",
              title: "Error",
              description: "Something went wrong",
            })
          }
        >
          Error
        </Button>
        <Button
          variant="outline"
          className="border-yellow-500 text-yellow-500"
          onClick={() =>
            toast({
              variant: "warning",
              title: "Warning",
              description: "Please review",
            })
          }
        >
          Warning
        </Button>
      </div>
    );
  },
};

/**
 * Trading-specific toasts
 */
export const TradingToasts: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <div className="flex flex-col gap-2">
        <Button
          className="bg-green-500 hover:bg-green-600"
          onClick={() =>
            toast({
              variant: "success",
              title: "Long Position Opened",
              description: "ETH/USD • 0.5 ETH @ $1,850 • 10x Leverage",
            })
          }
        >
          Open Long
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600"
          onClick={() =>
            toast({
              variant: "success",
              title: "Position Closed",
              description: "ETH/USD • +$125.50 profit (+6.8%)",
            })
          }
        >
          Close Position
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              variant: "warning",
              title: "Liquidation Warning",
              description:
                "Your ETH/USD position is approaching liquidation price.",
            })
          }
        >
          Liquidation Alert
        </Button>
      </div>
    );
  },
};
