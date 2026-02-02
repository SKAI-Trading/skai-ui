import type { Meta, StoryObj } from "@storybook/react";
import { SonnerToaster, sonnerToast } from "../components/feedback/sonner";
import { Button } from "../components/core/button";

const meta: Meta<typeof SonnerToaster> = {
  title: "Components/Sonner",
  component: SonnerToaster,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Modern toast notifications with promise support, built on Sonner. Provides success, error, warning, info variants and promise states.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <Story />
        <SonnerToaster position="bottom-right" />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SonnerToaster>;

export const Default: Story = {
  render: () => (
    <Button onClick={() => sonnerToast("Event has been created")}>
      Show Toast
    </Button>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Button
      onClick={() =>
        sonnerToast("Trade Executed", {
          description: "Bought 0.5 ETH at $3,200.45",
        })
      }
    >
      Show with Description
    </Button>
  ),
};

export const Success: Story = {
  render: () => (
    <Button
      variant="default"
      onClick={() => sonnerToast.success("Transaction confirmed!")}
    >
      Success Toast
    </Button>
  ),
};

export const Error: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() => sonnerToast.error("Transaction failed")}
    >
      Error Toast
    </Button>
  ),
};

export const Warning: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => sonnerToast.warning("High slippage detected")}
    >
      Warning Toast
    </Button>
  ),
};

export const Info: Story = {
  render: () => (
    <Button
      variant="secondary"
      onClick={() => sonnerToast.info("New price update available")}
    >
      Info Toast
    </Button>
  ),
};

export const PromiseToast: Story = {
  render: () => (
    <Button
      onClick={() => {
        const promise = new globalThis.Promise<void>((resolve) =>
          setTimeout(resolve, 2000),
        );
        sonnerToast.promise(promise, {
          loading: "Submitting transaction...",
          success: "Transaction confirmed!",
          error: "Transaction failed",
        });
      }}
    >
      Promise Toast
    </Button>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        sonnerToast("Trade executed", {
          description: "Bought 1 ETH at $3,200",
          action: {
            label: "Undo",
            onClick: () => sonnerToast("Trade cancelled"),
          },
        })
      }
    >
      Toast with Action
    </Button>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => sonnerToast("Default message")}>Default</Button>
      <Button onClick={() => sonnerToast.success("Success!")}>Success</Button>
      <Button onClick={() => sonnerToast.error("Error!")}>Error</Button>
      <Button onClick={() => sonnerToast.warning("Warning!")}>Warning</Button>
      <Button onClick={() => sonnerToast.info("Info!")}>Info</Button>
    </div>
  ),
};
