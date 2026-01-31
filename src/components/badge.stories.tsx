import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";
import { TrendingUp, TrendingDown, Check, Clock, AlertCircle, Star } from "lucide-react";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A small badge component for displaying status, labels, or counts.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Error",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

// All variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

// Trading-specific badges
export const PriceChangeBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
        <TrendingUp className="mr-1 h-3 w-3" />
        +5.23%
      </Badge>
      <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">
        <TrendingDown className="mr-1 h-3 w-3" />
        -2.14%
      </Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge className="bg-green-500/20 text-green-500">
        <Check className="mr-1 h-3 w-3" />
        Completed
      </Badge>
      <Badge className="bg-yellow-500/20 text-yellow-500">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
      <Badge className="bg-red-500/20 text-red-500">
        <AlertCircle className="mr-1 h-3 w-3" />
        Failed
      </Badge>
    </div>
  ),
};

export const TierBadges: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="outline" className="border-gray-400 text-gray-400">Free</Badge>
      <Badge variant="outline" className="border-green-400 text-green-400">Bronze</Badge>
      <Badge variant="outline" className="border-gray-300 text-gray-300">Silver</Badge>
      <Badge variant="outline" className="border-yellow-400 text-yellow-400">
        <Star className="mr-1 h-3 w-3 fill-yellow-400" />
        Gold
      </Badge>
      <Badge variant="outline" className="border-blue-400 text-blue-400">Platinum</Badge>
      <Badge variant="outline" className="border-purple-400 text-purple-400">Diamond</Badge>
    </div>
  ),
};

export const NetworkBadges: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
        Base
      </Badge>
      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
        Ethereum
      </Badge>
      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
        Solana
      </Badge>
      <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
        Polygon
      </Badge>
    </div>
  ),
};

export const CountBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <span className="text-sm">Notifications</span>
        <Badge className="absolute -top-2 -right-6 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          3
        </Badge>
      </div>
      <div className="relative">
        <span className="text-sm">Messages</span>
        <Badge variant="destructive" className="absolute -top-2 -right-4 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          9
        </Badge>
      </div>
    </div>
  ),
};

export const TransactionTypeBadges: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="outline" className="border-green-500 text-green-500">Buy</Badge>
      <Badge variant="outline" className="border-red-500 text-red-500">Sell</Badge>
      <Badge variant="outline" className="border-blue-500 text-blue-500">Swap</Badge>
      <Badge variant="outline" className="border-purple-500 text-purple-500">Bridge</Badge>
      <Badge variant="outline" className="border-orange-500 text-orange-500">Stake</Badge>
    </div>
  ),
};
