import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "../data-display/avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs", "stable"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://invalid-url.com/image.png" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-xs">S</AvatarFallback>
      </Avatar>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-sm">M</AvatarFallback>
      </Avatar>
      <Avatar className="h-10 w-10">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarFallback className="text-lg">XL</AvatarFallback>
      </Avatar>
      <Avatar className="h-20 w-20">
        <AvatarFallback className="text-2xl">2X</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// Trading-specific examples
export const TokenAvatars: Story = {
  name: "Token Icons",
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Avatar className="h-10 w-10 border-2 border-primary">
          <AvatarImage src="https://cryptologos.cc/logos/ethereum-eth-logo.png" />
          <AvatarFallback className="bg-blue-500 text-white">ETH</AvatarFallback>
        </Avatar>
        <span className="text-xs">ETH</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar className="h-10 w-10 border-2">
          <AvatarImage src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" />
          <AvatarFallback className="bg-orange-500 text-white">BTC</AvatarFallback>
        </Avatar>
        <span className="text-xs">BTC</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar className="h-10 w-10 border-2">
          <AvatarImage src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" />
          <AvatarFallback className="bg-blue-600 text-white">USDC</AvatarFallback>
        </Avatar>
        <span className="text-xs">USDC</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar className="h-10 w-10 border-2">
          <AvatarFallback className="bg-purple-500 text-white">SKAI</AvatarFallback>
        </Avatar>
        <span className="text-xs">SKAI</span>
      </div>
    </div>
  ),
};

export const UserProfile: Story = {
  name: "User Profile",
  render: () => (
    <div className="flex max-w-sm items-center gap-3 rounded-lg border p-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>SK</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium">skai_trader.eth</p>
        <p className="font-mono text-sm text-muted-foreground">0x1234...5678</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-green-500">+$1,234.56</p>
        <p className="text-xs text-muted-foreground">Today</p>
      </div>
    </div>
  ),
};

export const Leaderboard: Story = {
  name: "Leaderboard Avatars",
  render: () => (
    <div className="max-w-sm space-y-2">
      {[
        {
          rank: 1,
          name: "whale.eth",
          profit: "+$125,432",
          color: "bg-yellow-500",
        },
        { rank: 2, name: "trader99", profit: "+$89,234", color: "bg-gray-400" },
        {
          rank: 3,
          name: "defi_king",
          profit: "+$67,891",
          color: "bg-amber-600",
        },
        { rank: 4, name: "anon123", profit: "+$45,678", color: "bg-muted" },
        { rank: 5, name: "skai_user", profit: "+$34,567", color: "bg-muted" },
      ].map((user) => (
        <div key={user.rank} className="flex items-center gap-3 rounded-lg border p-3">
          <span className="w-6 text-center font-bold text-muted-foreground">
            #{user.rank}
          </span>
          <Avatar className="h-8 w-8">
            <AvatarFallback className={user.color}>
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="flex-1 font-medium">{user.name}</span>
          <span className="font-mono text-green-500">{user.profit}</span>
        </div>
      ))}
    </div>
  ),
};

export const AvatarStack: Story = {
  name: "Token Pair Stack",
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback className="bg-blue-500 text-xs text-white">
              ETH
            </AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback className="bg-blue-600 text-xs text-white">
              USDC
            </AvatarFallback>
          </Avatar>
        </div>
        <span className="font-medium">ETH/USDC</span>
        <span className="text-sm text-green-500">+2.34%</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback className="bg-orange-500 text-xs text-white">
              BTC
            </AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback className="bg-green-500 text-xs text-white">
              USDT
            </AvatarFallback>
          </Avatar>
        </div>
        <span className="font-medium">BTC/USDT</span>
        <span className="text-sm text-red-500">-0.87%</span>
      </div>
    </div>
  ),
};
