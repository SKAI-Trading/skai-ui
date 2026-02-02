import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  SkaiCard,
  SkaiCardContent,
  SkaiCardDescription,
  SkaiCardFooter,
  SkaiCardHeader,
  SkaiCardTitle,
} from "../core/card";
import { Button, SkaiButton } from "../core/button";
import { Input } from "../core/input";
import { Label } from "../core/label";
import { Badge } from "../core/badge";
import { TrendingUp, TrendingDown, DollarSign, Activity, ArrowRight, Wallet, ArrowDownUp } from "lucide-react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible card component for grouping related content and actions. Includes both ShadCN-compatible Card and SKAI-branded SkaiCard variants.",
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

// =============================================================================
// SKAI BRANDED CARD STORIES
// =============================================================================

/**
 * SKAI Card - Default
 * Uses Green Coal colors from Figma design system:
 * - Background: #122524 (greenCoal.200)
 * - Border: #123F3C (greenCoal.100)
 * - Border radius: 24px
 * - Shadow: 8px blur
 */
export const SkaiDefault: Story = {
  render: () => (
    <SkaiCard className="w-[350px]">
      <SkaiCardHeader>
        <SkaiCardTitle>SKAI Card</SkaiCardTitle>
        <SkaiCardDescription>Green Coal themed card from Figma</SkaiCardDescription>
      </SkaiCardHeader>
      <SkaiCardContent>
        <p className="text-white/80">Card content with SKAI design tokens</p>
      </SkaiCardContent>
      <SkaiCardFooter>
        <SkaiButton skaiType="primary" skaiSize="medium">
          Action
        </SkaiButton>
      </SkaiCardFooter>
    </SkaiCard>
  ),
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "SKAI-branded card using Green Coal color palette from Figma design system.",
      },
    },
  },
};

/**
 * SKAI Card - Swap Interface
 */
export const SkaiSwapCard: Story = {
  render: () => (
    <SkaiCard className="w-[420px]">
      <SkaiCardHeader>
        <SkaiCardTitle className="flex items-center gap-2">
          <ArrowDownUp className="h-5 w-5 text-[#56C7F3]" />
          Swap
        </SkaiCardTitle>
        <SkaiCardDescription>Trade tokens instantly</SkaiCardDescription>
      </SkaiCardHeader>
      <SkaiCardContent className="space-y-4">
        {/* From Token */}
        <div className="bg-[#001615] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">You pay</span>
            <span className="text-sm text-gray-500">Balance: 2.5 ETH</span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value="1.0"
              className="bg-transparent text-2xl text-white font-mono w-1/2 outline-none"
              readOnly
            />
            <div className="flex items-center gap-2 bg-[#122524] px-3 py-2 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">E</div>
              <span className="text-white font-medium">ETH</span>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-1">≈ $3,500.00</div>
        </div>

        {/* Swap Direction */}
        <div className="flex justify-center -my-2">
          <div className="w-10 h-10 rounded-full bg-[#123F3C] border border-[#17F9B4]/30 flex items-center justify-center">
            <ArrowDownUp className="h-4 w-4 text-[#17F9B4]" />
          </div>
        </div>

        {/* To Token */}
        <div className="bg-[#001615] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">You receive</span>
            <span className="text-sm text-gray-500">Balance: 1,250 USDC</span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value="3,456.78"
              className="bg-transparent text-2xl text-white font-mono w-1/2 outline-none"
              readOnly
            />
            <div className="flex items-center gap-2 bg-[#122524] px-3 py-2 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">U</div>
              <span className="text-white font-medium">USDC</span>
            </div>
          </div>
          <div className="text-sm text-[#17F9B4] mt-1">Best rate via Uniswap V3</div>
        </div>

        {/* Rate Info */}
        <div className="flex justify-between text-sm text-gray-400 px-1">
          <span>Rate</span>
          <span className="text-white">1 ETH = 3,456.78 USDC</span>
        </div>
      </SkaiCardContent>
      <SkaiCardFooter className="flex-col gap-2">
        <SkaiButton skaiType="primary" skaiSize="large" className="w-full">
          Swap Now <ArrowRight />
        </SkaiButton>
      </SkaiCardFooter>
    </SkaiCard>
  ),
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "SKAI swap interface card matching the Figma design for token trading.",
      },
    },
  },
};

/**
 * SKAI Card - Portfolio Stats
 */
export const SkaiPortfolioCard: Story = {
  render: () => (
    <SkaiCard className="w-[380px]">
      <SkaiCardHeader>
        <SkaiCardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-[#56C7F3]" />
          Portfolio
        </SkaiCardTitle>
        <SkaiCardDescription>Your total holdings</SkaiCardDescription>
      </SkaiCardHeader>
      <SkaiCardContent>
        <div className="text-4xl font-bold text-white mb-2">$45,231.89</div>
        <div className="flex items-center gap-2 mb-6">
          <Badge className="bg-[#17F9B4]/20 text-[#17F9B4] border-0">
            <TrendingUp className="mr-1 h-3 w-3" />
            +12.5%
          </Badge>
          <span className="text-sm text-gray-400">24h change</span>
        </div>

        {/* Holdings List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#001615] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">B</div>
              <div>
                <div className="text-white font-medium">Bitcoin</div>
                <div className="text-xs text-gray-400">0.52 BTC</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">$35,128.50</div>
              <div className="text-xs text-[#17F9B4]">+8.2%</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#001615] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">E</div>
              <div>
                <div className="text-white font-medium">Ethereum</div>
                <div className="text-xs text-gray-400">2.8 ETH</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">$10,103.39</div>
              <div className="text-xs text-[#FF574A]">-2.1%</div>
            </div>
          </div>
        </div>
      </SkaiCardContent>
      <SkaiCardFooter className="flex gap-2">
        <SkaiButton skaiType="primary" skaiSize="medium" className="flex-1">
          Deposit
        </SkaiButton>
        <SkaiButton skaiType="secondary" skaiSize="medium" className="flex-1">
          Withdraw
        </SkaiButton>
      </SkaiCardFooter>
    </SkaiCard>
  ),
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "SKAI portfolio card showing user holdings with Green Coal theme.",
      },
    },
  },
};

/**
 * SKAI Card - Token Price
 */
export const SkaiTokenCard: Story = {
  render: () => (
    <div className="flex gap-4">
      <SkaiCard className="w-[200px]">
        <SkaiCardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">B</div>
            <div>
              <div className="text-white font-semibold">Bitcoin</div>
              <div className="text-xs text-gray-400">BTC</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">$67,432</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-[#17F9B4]" />
            <span className="text-sm text-[#17F9B4]">+5.2%</span>
          </div>
        </SkaiCardContent>
      </SkaiCard>

      <SkaiCard className="w-[200px]">
        <SkaiCardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">E</div>
            <div>
              <div className="text-white font-semibold">Ethereum</div>
              <div className="text-xs text-gray-400">ETH</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">$3,608</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="h-3 w-3 text-[#FF574A]" />
            <span className="text-sm text-[#FF574A]">-1.8%</span>
          </div>
        </SkaiCardContent>
      </SkaiCard>
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "SKAI token price cards with profit/loss indicators.",
      },
    },
  },
};

/**
 * SKAI Card - All Variations
 */
export const SkaiCardVariations: Story = {
  render: () => (
    <div className="space-y-6 p-8 bg-[#001615] rounded-2xl">
      <h3 className="text-white text-xl font-semibold mb-4">SKAI Card Design Tokens</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Card Background</h4>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#122524] border border-[#123F3C]"></div>
            <code className="text-xs text-[#17F9B4]">#122524</code>
          </div>
        </div>
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Card Border</h4>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#123F3C]"></div>
            <code className="text-xs text-[#17F9B4]">#123F3C</code>
          </div>
        </div>
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Inner Background</h4>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#001615] border border-[#123F3C]"></div>
            <code className="text-xs text-[#17F9B4]">#001615</code>
          </div>
        </div>
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Border Radius</h4>
          <div className="flex items-center gap-2">
            <code className="text-xs text-[#17F9B4]">24px</code>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#123F3C]">
        <h4 className="text-sm text-gray-400 mb-3">Shadow</h4>
        <code className="text-xs text-[#56C7F3] block">0px 8px 24px rgba(0, 0, 0, 0.16)</code>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "SKAI Card design tokens reference showing all color values from Figma.",
      },
    },
  },
};
