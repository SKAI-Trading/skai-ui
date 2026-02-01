import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../components/drawer";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";

const meta: Meta<typeof Drawer> = {
  title: "Overlay/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>
            This is a description of what this drawer does.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Drawer content goes here.</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const RightSide: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Right Drawer</Button>
      </DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Adjust your settings here.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email" />
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button>Save Changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const LeftSide: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Left Drawer</Button>
      </DrawerTrigger>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Trade
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Portfolio
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Settings
            </Button>
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const TopSide: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Top Drawer</Button>
      </DrawerTrigger>
      <DrawerContent side="top">
        <DrawerHeader>
          <DrawerTitle>Announcement</DrawerTitle>
          <DrawerDescription>
            Important message for all users.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 text-center">
          <p>New features have been released! Check them out.</p>
        </div>
        <DrawerFooter className="flex-row justify-center">
          <DrawerClose asChild>
            <Button variant="outline">Dismiss</Button>
          </DrawerClose>
          <Button>Learn More</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const BottomSheet: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Bottom Sheet</Button>
      </DrawerTrigger>
      <DrawerContent side="bottom">
        <DrawerHeader>
          <DrawerTitle>Select Token</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          {["ETH", "USDC", "WBTC", "DAI", "LINK"].map((token) => (
            <DrawerClose key={token} asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                {token}
              </Button>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithForm: Story = {
  render: function WithFormStory() {
    const [open, setOpen] = useState(false);

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>Create Wallet</Button>
        </DrawerTrigger>
        <DrawerContent side="right" className="w-96">
          <DrawerHeader>
            <DrawerTitle>Create New Wallet</DrawerTitle>
            <DrawerDescription>
              Set up a new wallet for your account.
            </DrawerDescription>
          </DrawerHeader>
          <form className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-name">Wallet Name</Label>
              <Input id="wallet-name" placeholder="My Trading Wallet" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallet-type">Wallet Type</Label>
              <select
                id="wallet-type"
                className="w-full h-10 px-3 rounded-md border bg-background"
              >
                <option value="hot">Hot Wallet</option>
                <option value="cold">Cold Wallet</option>
              </select>
            </div>
          </form>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button onClick={() => setOpen(false)}>Create</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};

export const NestedContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Transaction History</Button>
      </DrawerTrigger>
      <DrawerContent side="right" className="w-[400px]">
        <DrawerHeader>
          <DrawerTitle>Recent Transactions</DrawerTitle>
          <DrawerDescription>Your last 5 transactions</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-muted"
            >
              <div>
                <p className="font-medium">Swap #{i}</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-500">+0.5 ETH</p>
                <p className="text-sm text-muted-foreground">$1,250</p>
              </div>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <Button variant="outline" className="w-full">
            View All
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
