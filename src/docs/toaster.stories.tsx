import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "../components/feedback/toaster";
import { Button } from "../components/core/button";
import { useToast } from "../hooks/use-toast";

const meta: Meta<typeof Toaster> = {
  title: "Feedback/Toaster",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Container for toast notifications. Place once at app root. Toasts are triggered via the useToast hook.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[400px] p-4">
        <Story />
        <Toaster />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Toast Demos</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Click the buttons below to trigger different toast notifications.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            toast({
              title: "Success!",
              description: "Your action was completed successfully.",
            });
          }}
        >
          Default Toast
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Swap Executed",
              description: "Successfully swapped 1 ETH for 2,250 USDC",
            });
          }}
        >
          Swap Toast
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Transaction failed. Please try again.",
            });
          }}
        >
          Error Toast
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            toast({
              title: "Wallet Connected",
              description: "Connected to 0x7c3d...5f2a",
            });
          }}
        >
          Connection Toast
        </Button>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <ToastDemo />,
};

const ActionToastDemo = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Toast with Action</h3>
      <Button
        onClick={() => {
          toast({
            title: "New Position Opened",
            description: "Long BTC/USD at $43,521",
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
    </div>
  );
};

export const WithAction: Story = {
  name: "With Action Button",
  render: () => <ActionToastDemo />,
};

const VariantsDemo = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Toast Variants</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            toast({
              title: "Default",
              description: "This is a default toast notification.",
            });
          }}
        >
          Default
        </Button>

        <Button
          variant="destructive"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Destructive",
              description: "This indicates an error or warning.",
            });
          }}
        >
          Destructive
        </Button>
      </div>
    </div>
  );
};

export const Variants: Story = {
  name: "Toast Variants",
  render: () => <VariantsDemo />,
};

const TradingToastsDemo = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Trading Notifications</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Common toast patterns for a trading application.
      </p>
      <div className="grid max-w-md grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Order Placed",
              description: "Buy 0.5 ETH at $2,250.00",
            });
          }}
        >
          Order Placed
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Order Filled",
              description: "Bought 0.5 ETH at $2,249.80",
            });
          }}
        >
          Order Filled
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Order Rejected",
              description: "Insufficient balance for this trade.",
            });
          }}
        >
          Order Rejected
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Position Closed",
              description: "Profit: +$124.50 (+5.2%)",
            });
          }}
        >
          Position Closed
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Price Alert",
              description: "ETH reached your target of $2,300",
              action: (
                <Button variant="outline" size="sm">
                  Trade
                </Button>
              ),
            });
          }}
        >
          Price Alert
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "⚠️ Liquidation Warning",
              description: "Position is 5% from liquidation.",
              action: (
                <Button variant="destructive" size="sm">
                  Add Margin
                </Button>
              ),
            });
          }}
        >
          Liquidation Warning
        </Button>
      </div>
    </div>
  );
};

export const TradingToasts: Story = {
  name: "Trading Application Toasts",
  render: () => <TradingToastsDemo />,
};

const MultipleToastsDemo = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Multiple Toasts</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Multiple toasts stack automatically.
      </p>
      <Button
        onClick={() => {
          toast({ title: "First toast" });
          setTimeout(() => {
            toast({ title: "Second toast" });
          }, 500);
          setTimeout(() => {
            toast({ title: "Third toast" });
          }, 1000);
        }}
      >
        Trigger Multiple Toasts
      </Button>
    </div>
  );
};

export const MultipleToasts: Story = {
  name: "Multiple Toasts",
  render: () => <MultipleToastsDemo />,
};

export const Usage: Story = {
  name: "Usage Example",
  render: () => (
    <div className="max-w-lg space-y-4">
      <h3 className="font-semibold">How to Use Toaster</h3>
      <div className="rounded-lg bg-muted p-4">
        <p className="mb-2 font-mono text-sm">1. Add Toaster to your app root:</p>
        <pre className="rounded bg-background p-2 text-xs">
          {`import { Toaster } from '@skai/ui';

function App() {
  return (
    <>
      <YourApp />
      <Toaster />
    </>
  );
}`}
        </pre>
      </div>
      <div className="rounded-lg bg-muted p-4">
        <p className="mb-2 font-mono text-sm">2. Use the useToast hook:</p>
        <pre className="rounded bg-background p-2 text-xs">
          {`import { useToast } from '@skai/ui';

function MyComponent() {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: "Success!",
      description: "Action completed.",
    });
  };
  
  return <Button onClick={handleClick}>Click</Button>;
}`}
        </pre>
      </div>
    </div>
  ),
};
