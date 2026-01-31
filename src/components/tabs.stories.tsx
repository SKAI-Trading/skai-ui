import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A tab component for organizing content into different views.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="SKAI Trader" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

// Trading-specific tabs
export const TradeTabs: Story = {
  render: () => (
    <Tabs defaultValue="swap" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="swap">Swap</TabsTrigger>
        <TabsTrigger value="limit">Limit</TabsTrigger>
        <TabsTrigger value="buy">Buy</TabsTrigger>
        <TabsTrigger value="sell">Sell</TabsTrigger>
      </TabsList>
      <TabsContent value="swap" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>You Pay</Label>
          <div className="flex gap-2">
            <Input type="number" placeholder="0.00" className="flex-1" />
            <Button variant="outline" className="w-24">
              USDC
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>You Receive</Label>
          <div className="flex gap-2">
            <Input type="number" placeholder="0.00" className="flex-1" />
            <Button variant="outline" className="w-24">
              ETH
            </Button>
          </div>
        </div>
        <Button className="w-full">Swap</Button>
      </TabsContent>
      <TabsContent value="limit" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Limit Price</Label>
          <Input type="number" placeholder="Enter price..." />
        </div>
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input type="number" placeholder="0.00" />
        </div>
        <Button className="w-full">Place Limit Order</Button>
      </TabsContent>
      <TabsContent value="buy" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Amount (USD)</Label>
          <Input type="number" placeholder="0.00" />
        </div>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          Buy ETH
        </Button>
      </TabsContent>
      <TabsContent value="sell" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Amount (ETH)</Label>
          <Input type="number" placeholder="0.00" />
        </div>
        <Button className="w-full bg-red-600 hover:bg-red-700">Sell ETH</Button>
      </TabsContent>
    </Tabs>
  ),
};

export const PortfolioTabs: Story = {
  render: () => (
    <Tabs defaultValue="tokens" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="tokens">
          Tokens
          <Badge
            variant="secondary"
            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            5
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="nfts">
          NFTs
          <Badge
            variant="secondary"
            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="tokens" className="pt-4">
        <div className="space-y-2">
          {[
            {
              name: "Ethereum",
              symbol: "ETH",
              balance: "2.4532",
              value: "$8,234.50",
            },
            {
              name: "USDC",
              symbol: "USDC",
              balance: "5,432.00",
              value: "$5,432.00",
            },
            {
              name: "Bitcoin",
              symbol: "BTC",
              balance: "0.1234",
              value: "$8,321.00",
            },
          ].map((token) => (
            <div
              key={token.symbol}
              className="flex justify-between items-center p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20" />
                <div>
                  <p className="font-medium">{token.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {token.balance} {token.symbol}
                  </p>
                </div>
              </div>
              <p className="font-medium">{token.value}</p>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="nfts" className="pt-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-muted rounded-lg" />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="activity" className="pt-4">
        <p className="text-sm text-muted-foreground text-center py-8">
          No recent activity
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const GameTabs: Story = {
  render: () => (
    <Tabs defaultValue="hilo" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="hilo">Hi-Lo</TabsTrigger>
        <TabsTrigger value="slots">Slots</TabsTrigger>
        <TabsTrigger value="crash">Crash</TabsTrigger>
      </TabsList>
      <TabsContent value="hilo" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Hi-Lo Game</CardTitle>
            <CardDescription>
              Predict if the next number is higher or lower
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              Higher
            </Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700">
              Lower
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="slots" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Slot Machine</CardTitle>
            <CardDescription>Spin to win big!</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Spin</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="crash" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Crash Game</CardTitle>
            <CardDescription>Cash out before the crash!</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Place Bet</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const VerticalTabs: Story = {
  render: () => (
    <Tabs
      defaultValue="general"
      orientation="vertical"
      className="flex w-[500px]"
    >
      <TabsList className="flex flex-col h-auto w-48 bg-transparent">
        <TabsTrigger value="general" className="w-full justify-start">
          General
        </TabsTrigger>
        <TabsTrigger value="security" className="w-full justify-start">
          Security
        </TabsTrigger>
        <TabsTrigger value="notifications" className="w-full justify-start">
          Notifications
        </TabsTrigger>
        <TabsTrigger value="advanced" className="w-full justify-start">
          Advanced
        </TabsTrigger>
      </TabsList>
      <div className="flex-1 pl-4">
        <TabsContent value="general" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input id="display-name" defaultValue="SKAI Trader" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your security options</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Enable 2FA</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications to receive
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="advanced" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Advanced configuration options</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  ),
};
