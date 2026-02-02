import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmDialog } from "../components/overlays/confirm-dialog";
import { Button } from "../components/core/button";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Components/ConfirmDialog",
  component: ConfirmDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Pre-styled confirmation dialog for destructive actions, approvals, or important decisions.",
      },
    },
  },
  tags: ["autodocs", "stable"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "warning"],
      description: "Dialog variant affecting colors and icon",
    },
    title: {
      control: "text",
      description: "Dialog title",
    },
    description: {
      control: "text",
      description: "Dialog description",
    },
    confirmText: {
      control: "text",
      description: "Confirm button text",
    },
    cancelText: {
      control: "text",
      description: "Cancel button text",
    },
    loading: {
      control: "boolean",
      description: "Show loading state on confirm button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Confirm Action"
          description="Are you sure you want to proceed with this action?"
          onConfirm={() => {
            console.log("Confirmed");
            setOpen(false);
          }}
        />
      </>
    );
  },
};

export const Destructive: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Account
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          variant="destructive"
          title="Delete Account"
          description="This action cannot be undone. All your data will be permanently deleted."
          confirmText="Delete"
          onConfirm={() => {
            console.log("Deleted");
            setOpen(false);
          }}
        />
      </>
    );
  },
};

export const Warning: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Reset Settings
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          variant="destructive"
          title="Reset Settings"
          description="This will reset all settings to their default values. Your saved preferences will be lost."
          confirmText="Reset"
          onConfirm={() => {
            console.log("Reset");
            setOpen(false);
          }}
        />
      </>
    );
  },
};

export const WithLoading: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleConfirm = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      setOpen(false);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>Process Transaction</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Confirm Transaction"
          description="You are about to swap 1 ETH for 2,847 USDC. This action cannot be undone."
          confirmText="Swap"
          loading={loading}
          onConfirm={handleConfirm}
        />
      </>
    );
  },
};

export const CustomIcon: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Approve Contract</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Approve Token Spending"
          description="You are allowing this contract to spend your USDC tokens. Only approve contracts you trust."
          confirmText="Approve"
          icon={
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          }
          onConfirm={() => {
            console.log("Approved");
            setOpen(false);
          }}
        />
      </>
    );
  },
};
