import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Input } from "../components/input";
import { Badge } from "../components/badge";
import { Separator } from "../components/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import {
  ArrowDown,
  ArrowUpDown,
  ChevronDown,
  Copy,
  ExternalLink,
  Settings,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

const meta: Meta = {
  title: "Patterns/Common",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const TokenCard: StoryObj = {
  name: "Token Card",
  render: () => (
    <Card className="w-80">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            E
          </div>
          <div className="flex-1">
            <p className="font-semibold">Ethereum</p>
            <p className="text-sm text-muted-foreground">ETH</p>
          </div>
          <div className="text-right">
            <p className="font-mono font-semibold">$2,145.32</p>
            <p className="text-sm text-green-500 flex items-center justify-end gap-1">
              <TrendingUp className="h-3 w-3" />
              +2.34%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const TokenCardWithBalance: StoryObj = {
  name: "Token Card (With Balance)",
  render: () => (
    <Card className="w-80">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            E
          </div>
          <div className="flex-1">
            <p className="font-semibold">Ethereum</p>
            <p className="text-sm text-muted-foreground">ETH</p>
          </div>
          <Badge variant="secondary">Native</Badge>
        </div>
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Balance</span>
          <span className="font-mono">2.5000 ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Value</span>
          <span className="font-mono">$5,363.30</span>
        </div>
      </CardContent>
    </Card>
  ),
};

export const SwapForm: StoryObj = {
  name: "Swap Form",
  render: () => (
    <Card className="w-[400px]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Swap</CardTitle>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Token */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">You pay</span>
            <span className="text-muted-foreground">Balance: 2.5 ETH</span>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="0.0"
              className="border-0 bg-transparent text-2xl font-mono p-0 h-auto focus-visible:ring-0"
              defaultValue="1.0"
            />
            <Button variant="outline" className="shrink-0">
              <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                E
              </div>
              ETH
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">≈ $2,145.32</p>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-2 relative z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 bg-background"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">You receive</span>
            <span className="text-muted-foreground">Balance: 5,000 USDC</span>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="0.0"
              className="border-0 bg-transparent text-2xl font-mono p-0 h-auto focus-visible:ring-0"
              defaultValue="2,140.52"
              readOnly
            />
            <Button variant="outline" className="shrink-0">
              <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2">
                U
              </div>
              USDC
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">≈ $2,140.52</p>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rate</span>
            <span className="font-mono">1 ETH = 2,140.52 USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price Impact</span>
            <span className="text-green-500">{"<0.01%"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network Fee</span>
            <span className="font-mono">~$0.50</span>
          </div>
        </div>

        <Button className="w-full" size="lg">
          Swap
        </Button>
      </CardContent>
    </Card>
  ),
};

export const WalletButton: StoryObj = {
  name: "Wallet Button",
  render: () => (
    <div className="space-y-4">
      {/* Disconnected */}
      <Button>
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>

      {/* Connected */}
      <Button variant="outline" className="gap-2">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
        <span className="font-mono">0x1234...5678</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* With balance */}
      <Button variant="outline" className="gap-3">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
        <div className="text-left">
          <p className="text-xs text-muted-foreground">Balance</p>
          <p className="font-mono text-sm">$12,345.67</p>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const TransactionRow: StoryObj = {
  name: "Transaction Row",
  render: () => (
    <div className="w-[500px] space-y-2">
      {/* Swap */}
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <ArrowUpDown className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium">Swap</p>
          <p className="text-sm text-muted-foreground">1.5 ETH → 3,217 USDC</p>
        </div>
        <div className="text-right">
          <Badge
            variant="outline"
            className="text-green-500 border-green-500/30"
          >
            Success
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">2 min ago</p>
        </div>
      </div>

      {/* Send */}
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
        <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
          <ArrowDown className="h-5 w-5 text-red-500 rotate-45" />
        </div>
        <div className="flex-1">
          <p className="font-medium">Send</p>
          <p className="text-sm text-muted-foreground">
            0.5 ETH to 0xabcd...efgh
          </p>
        </div>
        <div className="text-right">
          <Badge
            variant="outline"
            className="text-yellow-500 border-yellow-500/30"
          >
            Pending
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">Just now</p>
        </div>
      </div>
    </div>
  ),
};

export const PriceChange: StoryObj = {
  name: "Price Change Displays",
  render: () => (
    <div className="space-y-4">
      {/* Positive */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-green-500" />
        <span className="text-green-500 font-mono">+$234.56 (+2.34%)</span>
      </div>

      {/* Negative */}
      <div className="flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-red-500" />
        <span className="text-red-500 font-mono">-$123.45 (-1.23%)</span>
      </div>

      {/* Badge style */}
      <div className="flex gap-2">
        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
          <TrendingUp className="h-3 w-3 mr-1" />
          +5.67%
        </Badge>
        <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
          <TrendingDown className="h-3 w-3 mr-1" />
          -2.34%
        </Badge>
      </div>
    </div>
  ),
};

export const AddressDisplay: StoryObj = {
  name: "Address Display",
  render: () => (
    <div className="space-y-4">
      {/* Simple */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">
          0x1234567890abcdef1234567890abcdef12345678
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Copy className="h-3 w-3" />
        </Button>
      </div>

      {/* Truncated */}
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
        <span className="font-mono">0x1234...5678</span>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Copy className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      {/* With ENS */}
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>VB</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">vitalik.eth</p>
          <p className="text-xs text-muted-foreground font-mono">
            0xd8dA...6045
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  ),
};

export const PortfolioSummary: StoryObj = {
  name: "Portfolio Summary",
  render: () => (
    <Card className="w-80">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">Total Balance</p>
        <p className="text-4xl font-bold mt-1">$12,345.67</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-green-500/10 text-green-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            +$234.56
          </Badge>
          <span className="text-sm text-green-500">+1.94% today</span>
        </div>
        <Separator className="my-4" />
        <div className="space-y-3">
          {[
            {
              token: "ETH",
              amount: "2.5",
              value: "$5,363.30",
              change: "+2.34%",
            },
            {
              token: "USDC",
              amount: "5,000",
              value: "$5,000.00",
              change: "0.00%",
            },
            {
              token: "SKAI",
              amount: "10,000",
              value: "$1,982.37",
              change: "+15.2%",
            },
          ].map((item) => (
            <div key={item.token} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                  {item.token[0]}
                </div>
                <span className="font-medium">{item.token}</span>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm">{item.value}</p>
                <p
                  className={`text-xs ${
                    item.change.startsWith("+")
                      ? "text-green-500"
                      : item.change === "0.00%"
                        ? "text-muted-foreground"
                        : "text-red-500"
                  }`}
                >
                  {item.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
};
