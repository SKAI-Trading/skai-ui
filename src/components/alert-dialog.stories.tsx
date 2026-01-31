import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";

const meta: Meta<typeof AlertDialog> = {
  title: "Components/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// Trading-specific examples
export const DisconnectWallet: Story = {
  name: "Disconnect Wallet",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Disconnect Wallet</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disconnect Wallet?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to reconnect your wallet to access your portfolio and
            make trades. Any pending transactions will continue to process.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Disconnect
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const HighSlippageWarning: Story = {
  name: "High Slippage Warning",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Swap with 5% Slippage</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-yellow-500">
            ⚠️ High Slippage Warning
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are about to execute a trade with <strong>5% slippage</strong>
              . This is significantly higher than the recommended 0.5%.
            </p>
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-sm">
                <strong>Risk:</strong> You may receive significantly fewer
                tokens than expected due to price movement.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Adjust Slippage</AlertDialogCancel>
          <AlertDialogAction className="bg-yellow-500 text-yellow-950 hover:bg-yellow-400">
            Proceed Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const PriceImpactWarning: Story = {
  name: "Price Impact Warning",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Execute Large Trade</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            🚨 Significant Price Impact
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              This trade has a price impact of <strong>12.5%</strong>. You will
              receive significantly fewer tokens than the market rate.
            </p>
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Expected output:</span>
                <span className="font-mono">10,000 SKAI</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Minimum received:</span>
                <span className="font-mono text-destructive">8,750 SKAI</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Lost to impact:</span>
                <span className="font-mono text-destructive">-1,250 SKAI</span>
              </div>
            </div>
            <p className="text-sm">
              Consider splitting this trade into smaller amounts.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel Trade</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
            Execute Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const CancelOrder: Story = {
  name: "Cancel Limit Order",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Cancel Order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Limit Order?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>You are about to cancel the following limit order:</p>
            <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="text-green-500 font-medium">Buy</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-mono">1.5 ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-mono">$2,000 USDC</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-mono">$3,000 USDC</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your locked USDC will be returned to your wallet.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Order</AlertDialogCancel>
          <AlertDialogAction>Cancel Order</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const ExpertModeWarning: Story = {
  name: "Enable Expert Mode",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Enable Expert Mode</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ⚠️ Enable Expert Mode?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Expert mode turns off the confirmation dialog for all trades and
              enables high-slippage trades.
            </p>
            <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm font-medium text-destructive">
                Only use this mode if you are an experienced trader who
                understands the risks.
              </p>
            </div>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Trades execute without confirmation</li>
              <li>High slippage trades are allowed</li>
              <li>Price impact warnings can be bypassed</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
            Enable Expert Mode
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
