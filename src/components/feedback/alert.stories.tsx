import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertDescription, AlertTitle } from "../feedback/alert";
import {
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { Button } from "../core/button";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "An alert component for displaying important messages and notifications.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        This is a default alert with some important information.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try again later.
      </AlertDescription>
    </Alert>
  ),
};

// Trading-specific alerts
export const SuccessAlert: Story = {
  render: () => (
    <Alert className="border-green-500/50 bg-green-500/10">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertTitle className="text-green-500">
        Transaction Successful!
      </AlertTitle>
      <AlertDescription>
        Your swap of 1,000 USDC → 0.0149 ETH has been confirmed.
      </AlertDescription>
    </Alert>
  ),
};

export const WarningAlert: Story = {
  render: () => (
    <Alert className="border-yellow-500/50 bg-yellow-500/10">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-500">High Slippage Warning</AlertTitle>
      <AlertDescription>
        Your trade may experience significant price impact. Consider reducing
        your trade size.
      </AlertDescription>
    </Alert>
  ),
};

export const ErrorAlert: Story = {
  render: () => (
    <Alert className="border-red-500/50 bg-red-500/10">
      <XCircle className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-500">Transaction Failed</AlertTitle>
      <AlertDescription>
        Your transaction was reverted. This may be due to insufficient gas or
        slippage settings.
      </AlertDescription>
    </Alert>
  ),
};

export const InfoAlert: Story = {
  render: () => (
    <Alert className="border-blue-500/50 bg-blue-500/10">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertTitle className="text-blue-500">New Feature</AlertTitle>
      <AlertDescription>
        Limit orders are now available! Set your price and we'll execute when
        the market reaches it.
      </AlertDescription>
    </Alert>
  ),
};

export const NetworkCongestionAlert: Story = {
  render: () => (
    <Alert className="border-orange-500/50 bg-orange-500/10">
      <Zap className="h-4 w-4 text-orange-500" />
      <AlertTitle className="text-orange-500">Network Congestion</AlertTitle>
      <AlertDescription>
        The network is experiencing high traffic. Transactions may take longer
        than usual to confirm.
      </AlertDescription>
    </Alert>
  ),
};

export const AlertWithAction: Story = {
  render: () => (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Wallet Not Connected</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Connect your wallet to start trading.</span>
        <Button size="sm" className="ml-4">
          Connect Wallet
        </Button>
      </AlertDescription>
    </Alert>
  ),
};

export const InsufficientBalanceAlert: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Insufficient Balance</AlertTitle>
      <AlertDescription>
        You don't have enough ETH to complete this transaction. You need at
        least 0.5 ETH but only have 0.234 ETH.
      </AlertDescription>
    </Alert>
  ),
};

export const AllAlertTypes: Story = {
  render: () => (
    <div className="space-y-4 max-w-xl">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default informational alert.
        </AlertDescription>
      </Alert>

      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-500">Success</AlertTitle>
        <AlertDescription>Operation completed successfully.</AlertDescription>
      </Alert>

      <Alert className="border-yellow-500/50 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertTitle className="text-yellow-500">Warning</AlertTitle>
        <AlertDescription>Please review before proceeding.</AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred during the operation.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
