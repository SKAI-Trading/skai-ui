import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../core/card";
import { Button } from "../core/button";
import { Input } from "../core/input";
import { Label } from "../core/label";
import { Badge } from "../core/badge";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible card component for grouping related content and actions.",
      },
    },
  },
  tags: ["autodocs", "stable"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content and body text</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const SimpleCard: Story = {
  render: () => (
    <Card className="w-[300px] p-6">
      <p className="text-sm text-muted-foreground">Simple card with just content</p>
    </Card>
  ),
};

// Trading-specific cards
export const TokenPriceCard: Story = {
  render: () => (
    <Card className="w-[280px]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
              B
            </div>
            <div>
              <CardTitle className="text-base">Bitcoin</CardTitle>
              <CardDescription>BTC</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-500">
            <TrendingUp className="mr-1 h-3 w-3" />
            +5.2%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$67,432.50</div>
        <p className="mt-1 text-xs text-muted-foreground">24h Volume: $32.5B</p>
      </CardContent>
    </Card>
  ),
};

export const PortfolioCard: Story = {
  render: () => (
    <Card className="w-[320px]">
      <CardHeader>
        <CardTitle className="text-lg">Portfolio Value</CardTitle>
        <CardDescription>Total balance across all assets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">$124,532.00</div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className="border-green-500/50 text-green-500">
            <TrendingUp className="mr-1 h-3 w-3" />
            +$2,430.00 (2.0%)
          </Badge>
          <span className="text-xs text-muted-foreground">24h</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm" className="flex-1">
          Deposit
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          Withdraw
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const StatsCard: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card className="w-[180px]">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Total Volume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$1.2M</div>
          <p className="text-xs text-green-500">+12% from last week</p>
        </CardContent>
      </Card>
      <Card className="w-[180px]">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Active Traders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,430</div>
          <p className="text-xs text-green-500">+8% from last week</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const FormCard: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your information to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="trader@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Sign Up</Button>
      </CardFooter>
    </Card>
  ),
};

export const LosingTradeCard: Story = {
  render: () => (
    <Card className="w-[280px] border-red-500/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
              E
            </div>
            <div>
              <CardTitle className="text-base">Ethereum</CardTitle>
              <CardDescription>ETH</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-red-500/20 text-red-500">
            <TrendingDown className="mr-1 h-3 w-3" />
            -3.1%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$3,245.80</div>
        <p className="mt-1 text-xs text-muted-foreground">24h Volume: $18.2B</p>
      </CardContent>
    </Card>
  ),
};
