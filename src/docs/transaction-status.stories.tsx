import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  TransactionStatusBadge,
  TransactionProgress,
} from "../components/trading/transaction-status";
import { Button } from "../components/core/button";

const meta: Meta<typeof TransactionStatusBadge> = {
  title: "Trading/TransactionStatus",
  component: TransactionStatusBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["pending", "confirmed", "failed", "cancelled"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionStatusBadge>;

export const Pending: Story = {
  args: {
    status: "pending",
  },
};

export const Confirmed: Story = {
  args: {
    status: "confirmed",
  },
};

export const Failed: Story = {
  args: {
    status: "failed",
  },
};

export const Cancelled: Story = {
  args: {
    status: "cancelled",
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <TransactionStatusBadge status="pending" />
      <TransactionStatusBadge status="confirmed" />
      <TransactionStatusBadge status="failed" />
      <TransactionStatusBadge status="cancelled" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <TransactionStatusBadge status="confirmed" size="sm" />
      <TransactionStatusBadge status="confirmed" size="md" />
      <TransactionStatusBadge status="confirmed" size="lg" />
    </div>
  ),
};

export const WithExplorerLink: Story = {
  args: {
    status: "confirmed",
    txHash:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    explorerUrl: "https://basescan.org",
  },
};

export const CustomLabel: Story = {
  args: {
    status: "pending",
    label: "Waiting for confirmation...",
  },
};

// Transaction Progress stories
export const ProgressStep1: Story = {
  render: () => (
    <div className="w-80">
      <TransactionProgress
        currentStep={1}
        steps={["Approve Token", "Confirm Swap", "Complete"]}
      />
    </div>
  ),
};

export const ProgressStep2: Story = {
  render: () => (
    <div className="w-80">
      <TransactionProgress
        currentStep={2}
        steps={["Approve Token", "Confirm Swap", "Complete"]}
      />
    </div>
  ),
};

export const ProgressComplete: Story = {
  render: () => (
    <div className="w-80">
      <TransactionProgress
        currentStep={4}
        steps={["Approve Token", "Confirm Swap", "Complete"]}
      />
    </div>
  ),
};

export const ProgressFailed: Story = {
  render: () => (
    <div className="w-80">
      <TransactionProgress
        currentStep={2}
        steps={["Approve Token", "Confirm Swap", "Complete"]}
        failedStep={2}
      />
    </div>
  ),
};

export const InteractiveProgress: Story = {
  render: function InteractiveProgressStory() {
    const [step, setStep] = useState(1);
    const [failed, setFailed] = useState<number | undefined>(undefined);

    return (
      <div className="w-80 space-y-4">
        <TransactionProgress
          currentStep={step}
          steps={["Approve", "Sign", "Confirm", "Complete"]}
          failedStep={failed}
        />
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={() => {
              setStep(Math.min(step + 1, 5));
              setFailed(undefined);
            }}
          >
            Next Step
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setStep(Math.max(step - 1, 1))}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setFailed(step)}
          >
            Fail Current
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setStep(1);
              setFailed(undefined);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  },
};
