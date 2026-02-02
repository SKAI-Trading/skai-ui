import type { Meta, StoryObj } from "@storybook/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "../overlays/sheet";
import { Button } from "../core/button";
import { Input } from "../core/input";
import { Label } from "../core/label";

const meta: Meta<typeof Sheet> = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="John Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@johndoe" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex gap-2">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>{side} Sheet</SheetTitle>
              <SheetDescription>
                This sheet opens from the {side}.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};

// Trading-specific examples
export const WalletSheet: Story = {
  name: "Wallet Details",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>View Wallet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Wallet</SheetTitle>
          <SheetDescription>0x1234...5678</SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="text-3xl font-bold">$12,345.67</p>
            <p className="text-sm text-green-500">+$234.56 (1.94%)</p>
          </div>

          <div className="space-y-2">
            {[
              { symbol: "ETH", amount: "2.5", value: "$5,363.30" },
              { symbol: "USDC", amount: "5,000", value: "$5,000.00" },
              { symbol: "SKAI", amount: "10,000", value: "$234.00" },
            ].map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-3 rounded-lg bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <span className="font-medium">{token.symbol}</span>
                </div>
                <div className="text-right">
                  <p className="font-mono">{token.amount}</p>
                  <p className="text-xs text-muted-foreground">{token.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">Send</Button>
            <Button className="flex-1" variant="outline">
              Receive
            </Button>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive" className="w-full">
              Disconnect Wallet
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const SettingsSheet: Story = {
  name: "Settings Panel",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">⚙️ Settings</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Trading Settings</SheetTitle>
          <SheetDescription>
            Configure your trading preferences
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <Label>Slippage Tolerance</Label>
            <div className="flex gap-2">
              {["0.1%", "0.5%", "1.0%"].map((v) => (
                <Button
                  key={v}
                  variant={v === "0.5%" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  {v}
                </Button>
              ))}
              <Input placeholder="Custom" className="w-20" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Transaction Deadline</Label>
            <div className="flex items-center gap-2">
              <Input defaultValue="30" className="w-20" />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Expert Mode</Label>
              <Button variant="outline" size="sm">
                Off
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Multi-hop Trades</Label>
              <Button variant="default" size="sm">
                On
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button className="w-full">Save Settings</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const MobileMenu: Story = {
  name: "Mobile Navigation",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          ☰
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>SKAI Trading</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-2">
          {[
            { icon: "📊", label: "Dashboard" },
            { icon: "💱", label: "Swap" },
            { icon: "📈", label: "Trade" },
            { icon: "💼", label: "Portfolio" },
            { icon: "🎮", label: "Games" },
            { icon: "🏆", label: "Leaderboard" },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <Button className="w-full">Connect Wallet</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};
