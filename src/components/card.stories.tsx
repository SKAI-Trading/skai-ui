import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle } from "lucide-react";

const meta: Meta<typeof Card> = {
  title: "⚡ Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Card Component

A flexible card component for grouping related content and actions.

## 🎯 Usage Status: HIGH PRIORITY FOR MIGRATION

This component is **partially used** in the main app but many areas still use custom card implementations.

### Current Usage
- ✅ \`src/components/copytrading/TraderCard.tsx\` - Uses Card from @skai/ui
- ✅ \`src/components/trading-groups/TradingGroupCard.tsx\` - Uses Card component

### Migration Opportunities  
- ❌ Dashboard cards still using custom \`bg-card\` classes
- ❌ Trading interface cards using inline styling
- ❌ Settings panels using custom card layouts
- ❌ Portfolio displays using legacy card components

## Migration Benefits
- **Consistent styling** across all card layouts
- **Built-in accessibility** features (proper focus management)
- **Responsive design** out of the box
- **Theme support** (light/dark mode)
- **Reduced bundle size** by removing custom card code

## Recommended Migration
1. Replace all \`className="bg-card...\` with Card component
2. Update dashboard components to use CardHeader/CardContent pattern
3. Migrate trading interface cards to design system
4. Use CardFooter for consistent action button placement

This migration is **Week 1 priority** in the 4-week plan.
        `,
      },
    },
  },
  tags: ["autodocs"],
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
      <p className="text-sm text-muted-foreground">
        Simple card with just content
      </p>
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
            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
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
        <p className="text-xs text-muted-foreground mt-1">24h Volume: $32.5B</p>
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
        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant="outline"
            className="text-green-500 border-green-500/50"
          >
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
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
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
        <p className="text-xs text-muted-foreground mt-1">24h Volume: $18.2B</p>
      </CardContent>
    </Card>
  ),
};

// Migration Examples
export const MigrationExample: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-yellow-500 mb-2">🎯 Migration Example</h3>
        <p className="text-sm text-muted-foreground">
          Transform legacy custom cards to design system components
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Before - Legacy Implementation */}
        <div className="space-y-4">
          <div className="text-center">
            <Badge variant="destructive" className="mb-2">❌ BEFORE (Legacy)</Badge>
            <h4 className="font-semibold">Custom Implementation</h4>
          </div>
          
          <div className="relative w-full max-w-md bg-gradient-to-br from-card via-card to-yellow-500/5 rounded-xl border border-yellow-500/30 shadow-2xl p-6">
            <div className="absolute inset-0 bg-card/50 border-border/50 rounded-xl" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-400">Portfolio Value</span>
                <span className="text-xs bg-yellow-500/20 px-2 py-1 rounded">24H</span>
              </div>
              <div className="text-2xl font-bold text-white">$125,430.50</div>
              <div className="text-sm text-green-400">+$3,421.30 (+2.8%)</div>
              <button className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg py-2 text-yellow-400 text-sm font-medium transition-colors">
                View Details
              </button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Issues with legacy approach:</div>
            <div>• Custom styling not reusable</div>
            <div>• No consistent spacing</div>
            <div>• Manual responsive design</div>
            <div>• No accessibility features</div>
          </div>
        </div>

        {/* After - Design System */}
        <div className="space-y-4">
          <div className="text-center">
            <Badge className="bg-green-500 mb-2">✅ AFTER (Design System)</Badge>
            <h4 className="font-semibold">Card Component</h4>
          </div>
          
          <Card className="w-full max-w-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-yellow-400">Portfolio Value</CardDescription>
                <Badge variant="outline" className="text-xs">24H</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <CardTitle className="text-2xl">$125,430.50</CardTitle>
              <div className="text-sm text-green-400">+$3,421.30 (+2.8%)</div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Benefits of design system:</div>
            <div>• ✅ Consistent design tokens</div>
            <div>• ✅ Built-in responsive behavior</div>
            <div>• ✅ Accessibility included</div>
            <div>• ✅ Theme support (dark/light)</div>
            <div>• ✅ Semantic HTML structure</div>
          </div>
        </div>
      </div>

      <Card className="p-6 border-blue-500/30 bg-blue-500/5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-400" />
            <span className="font-semibold text-blue-400">Migration Code Example</span>
          </div>
          <div className="text-sm space-y-2">
            <div className="font-medium">Replace this pattern:</div>
            <pre className="bg-black/50 p-3 rounded text-xs overflow-x-auto">
{`<div className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors rounded-xl p-6">
  <div className="text-yellow-400 text-sm mb-2">Portfolio Value</div>
  <div className="text-2xl font-bold">$125,430.50</div>
  <button className="w-full bg-yellow-500/20 ...">View Details</button>
</div>`}
            </pre>
            <div className="font-medium">With this:</div>
            <pre className="bg-black/50 p-3 rounded text-xs overflow-x-auto">
{`<Card>
  <CardHeader>
    <CardDescription>Portfolio Value</CardDescription>
  </CardHeader>
  <CardContent>
    <CardTitle>$125,430.50</CardTitle>
  </CardContent>
  <CardFooter>
    <Button variant="outline">View Details</Button>
  </CardFooter>
</Card>`}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  ),
};
