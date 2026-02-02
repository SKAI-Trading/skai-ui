import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../overlays/dialog";
import { Button } from "../core/button";
import { Input } from "../core/input";
import { Label } from "../core/label";
import { Badge } from "../core/badge";
import { AlertCircle, Check, Settings, Send } from "lucide-react";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A modal dialog component for important interactions and confirmations.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description that provides more context about the dialog.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Dialog content goes here.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="SKAI Trader"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@skaitrader"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Trading-specific dialogs
export const ConfirmSwapDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Swap Tokens</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Swap</DialogTitle>
          <DialogDescription>
            Review the swap details before confirming
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">You pay</p>
              <p className="text-xl font-bold">1,000 USDC</p>
            </div>
            <Badge>USDC</Badge>
          </div>
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              ↓
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">You receive</p>
              <p className="text-xl font-bold">0.0149 ETH</p>
            </div>
            <Badge>ETH</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate</span>
              <span>1 ETH = 67,114.09 USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slippage</span>
              <span>0.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network Fee</span>
              <span>~$2.50</span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button className="flex-1">Confirm Swap</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const SendTokenDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Tokens</DialogTitle>
          <DialogDescription>
            Transfer tokens to another wallet address
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input id="recipient" placeholder="0x..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="flex-1"
              />
              <Button variant="outline" className="w-24">
                ETH
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Balance: 2.4532 ETH</p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const SettingsDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Swap Settings</DialogTitle>
          <DialogDescription>Configure your swap preferences</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Slippage Tolerance</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                0.1%
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                0.5%
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                1.0%
              </Button>
              <Input className="w-20" placeholder="Custom" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Transaction Deadline</Label>
            <div className="flex items-center gap-2">
              <Input type="number" defaultValue="30" className="w-20" />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full">Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const SuccessDialog: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent className="sm:max-w-[400px]">
        <div className="flex flex-col items-center text-center py-4">
          <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <DialogTitle className="text-xl mb-2">Swap Successful!</DialogTitle>
          <DialogDescription>
            Your swap has been completed successfully. You received 0.0149 ETH.
          </DialogDescription>
        </div>
        <DialogFooter>
          <Button className="w-full">View Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
