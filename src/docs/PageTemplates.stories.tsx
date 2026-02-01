import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Input } from "../components/input";
import { Badge } from "../components/badge";
import { Separator } from "../components/separator";
import { Avatar, AvatarFallback } from "../components/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/tabs";
import {
  ArrowDown,
  ArrowUpDown,
  BarChart3,
  Bell,
  Brain,
  ChevronDown,
  Gamepad2,
  Globe,
  Home,
  Menu,
  Plus,
  Search,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Trophy,
  User,
  Wallet,
  Zap,
} from "lucide-react";

/**
 * # SKAI Page Templates
 *
 * These templates document the **actual** page layouts used in the SKAI trading platform.
 * They are designed to help UI designers understand the real component structure.
 *
 * ## Key Layout Concepts:
 *
 * 1. **Layout Component** - Wraps all pages with Header, Footer, and main content area
 * 2. **No Sidebar** - SKAI uses a top header navigation, NOT a sidebar
 * 3. **Mobile Bottom Nav** - Mobile devices show a fixed bottom navigation bar
 * 4. **Glass Effects** - Heavy use of backdrop-blur and semi-transparent cards
 * 5. **Grid Background** - Global grid pattern applied via CSS at app level
 *
 * ## Source Files:
 * - Layout: `src/components/layout/Layout.tsx`
 * - Header: `src/components/layout/Header.tsx`
 * - MobileBottomNav: `src/components/layout/MobileBottomNav.tsx`
 * - Footer: `src/components/layout/Footer.tsx`
 */
const meta: Meta = {
  title: "Templates/Pages",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# SKAI Page Layout System

The SKAI app uses a consistent layout system across all pages:

## Layout Structure
\`\`\`
┌─────────────────────────────────────┐
│           HEADER (fixed)            │
├─────────────────────────────────────┤
│                                     │
│         MAIN CONTENT AREA           │
│   (flex-1 min-h-[calc(100vh-64px)]) │
│                                     │
├─────────────────────────────────────┤
│            FOOTER (optional)        │
└─────────────────────────────────────┘
│      MOBILE BOTTOM NAV (md:hidden)  │
└─────────────────────────────────────┘
\`\`\`

## Important Notes
- **No Sidebar**: SKAI does NOT use a sidebar layout
- **Header Navigation**: All nav is in the top header with dropdowns
- **Mobile**: Shows fixed bottom nav with 5 icons (Home, Swap, Predict, Leaders, Account)
- **Background**: Global grid pattern applied at app level, not per-page

## Real Component Imports
\`\`\`tsx
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
\`\`\`
        `,
      },
    },
  },
};

export default meta;

/**
 * Header Component
 *
 * The SKAI header contains:
 * - Logo (SKAI with lightning icon)
 * - Primary navigation (Trade dropdown, Play, Predict, etc.)
 * - Global search
 * - Notifications
 * - Wallet/Account dropdown
 *
 * Source: src/components/layout/Header.tsx (869 lines)
 */
const SKAIHeader = () => (
  <header className="h-14 border-b border-border/30 bg-background/95 backdrop-blur-xl flex items-center px-4 sticky top-0 z-50">
    <div className="flex items-center gap-6 flex-1">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          SKAI
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {/* Trade Dropdown */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          Trade <ChevronDown className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          Play
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          Predict
        </Button>

        {/* Social Dropdown */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          Social <ChevronDown className="h-3 w-3" />
        </Button>

        {/* SKAI Dropdown */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          SKAI <ChevronDown className="h-3 w-3" />
        </Button>
      </nav>
    </div>

    {/* Right Side Actions */}
    <div className="flex items-center gap-2">
      {/* Global Search */}
      <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9">
        <Search className="h-4 w-4" />
      </Button>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="h-9 w-9 relative">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
      </Button>

      {/* Account Dropdown */}
      <Button variant="ghost" size="sm" className="gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-secondary text-white">
            SK
          </AvatarFallback>
        </Avatar>
        <span className="hidden md:inline text-sm">0x1234...5678</span>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {/* Mobile Menu */}
      <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  </header>
);

/**
 * Mobile Bottom Navigation
 *
 * Fixed bottom nav shown on mobile devices (md:hidden)
 * 5 items: Home, Swap, Predict, Leaders, Account
 *
 * Source: src/components/layout/MobileBottomNav.tsx
 */
const MobileBottomNav = () => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 backdrop-blur-xl bg-background/95 h-16">
    <div className="grid grid-cols-5 h-full">
      {[
        { icon: Home, label: "Home", active: true },
        { icon: Zap, label: "Swap", active: false },
        { icon: TrendingUp, label: "Predict", active: false },
        { icon: Trophy, label: "Leaders", active: false },
        { icon: User, label: "Account", active: false },
      ].map((item) => (
        <button
          key={item.label}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            item.active
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <item.icon className={`h-6 w-6 ${item.active ? "scale-110" : ""}`} />
          <span className="text-[11px] font-medium">{item.label}</span>
          {item.active && (
            <div className="absolute bottom-14 w-1 h-1 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  </nav>
);

/**
 * Dashboard / Home Page Layout
 *
 * The main home page (Index.tsx) features:
 * - Hero section with "Trade Smarter. Win Bigger." heading
 * - Terminal-style chat (TerminalChat component)
 * - Feature cards grid
 * - Stats ticker at bottom
 *
 * Source: src/pages/Index.tsx (376 lines)
 */
export const HomePage: StoryObj = {
  name: "Home Page (Index)",
  parameters: {
    docs: {
      description: {
        story: `
## Home Page Layout

The SKAI home page (\`src/pages/Index.tsx\`) uses:

- \`Layout\` wrapper component
- Hero section with gradient text
- Terminal-style AI chat interface
- Feature cards in a responsive grid
- Bottom ticker bar for live stats

**Key Components:**
- \`ParticleBackground\` - Animated particle effects
- \`TerminalChat\` - AI-powered command terminal
- \`FaucetClaimCompact\` - Testnet faucet claim

**Styling:**
- Uses \`--secondary\` (teal) for primary accent
- Gradient text using \`bg-clip-text\`
- Glass effects with \`backdrop-blur\`
        `,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-[#020717]">
      {/* Grid background - applied globally in App.tsx */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(86,192,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(86,192,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <SKAIHeader />

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-12">
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_0%,rgba(10,10,15,0.5)_100%)]" />

        {/* Decorative cyber lines */}
        <div className="absolute left-0 top-1/4 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
        <div className="absolute left-0 bottom-1/3 w-full h-px bg-gradient-to-r from-transparent via-secondary/10 to-transparent" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            <span className="block text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              Trade Smarter.
            </span>
            <span
              className="block drop-shadow-[0_0_15px_hsl(166,80%,55%,0.5)]"
              style={{ color: "hsl(166, 80%, 55%)" }}
            >
              Win Bigger.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8 font-mono">
            AI-powered perpetual trading, prediction markets, and provably fair
            games — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary text-white font-semibold"
            >
              <Zap className="h-4 w-4 mr-2" />
              Start Trading
            </Button>
            <Button size="lg" variant="outline" className="border-border/50">
              <TrendingUp className="h-4 w-4 mr-2" />
              Predict Markets
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Target,
              label: "Predict",
              desc: "Prediction markets",
              color: "primary",
            },
            {
              icon: Gamepad2,
              label: "Play",
              desc: "Provably fair games",
              color: "secondary",
            },
            {
              icon: Brain,
              label: "AI",
              desc: "AI trading signals",
              color: "primary",
            },
            {
              icon: Shield,
              label: "Secure",
              desc: "Non-custodial",
              color: "secondary",
            },
          ].map((feature) => (
            <Card
              key={feature.label}
              className="bg-glass/50 border-border/30 backdrop-blur-sm hover:border-primary/30 transition-colors cursor-pointer"
            >
              <CardContent className="p-4 text-center">
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{
                    background:
                      feature.color === "primary"
                        ? "linear-gradient(135deg, hsl(199, 90%, 65%), hsl(199, 90%, 55%))"
                        : "linear-gradient(135deg, hsl(166, 80%, 55%), hsl(166, 80%, 45%))",
                  }}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{feature.label}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <MobileBottomNav />
    </div>
  ),
};

/**
 * Swap Page Layout
 *
 * The swap page (SwapNew.tsx) features:
 * - Tabs: Swap | Limit | Buy | Sell
 * - Chain selector (Base, ETH, Solana, etc.)
 * - Token input/output panels
 * - Settings dialog (slippage, deadline)
 * - Transaction history
 *
 * Source: src/pages/trade/SwapNew.tsx (1505 lines)
 */
export const SwapPage: StoryObj = {
  name: "Swap Page",
  parameters: {
    docs: {
      description: {
        story: `
## Swap Page Layout

The SKAI swap interface (\`src/pages/trade/SwapNew.tsx\`) includes:

- **Tabs Component**: Swap | Limit | Buy | Sell
- **Chain Selector**: Switch between chains (Base default)
- **DEX Selector**: For chains with multiple DEX options
- **Token Selector**: From/To token selection
- **Settings Dialog**: Slippage tolerance, deadline
- **Price Chart**: Lazy-loaded SwapChart component

**Key Components:**
- \`ChainSelector\` - Chain switching
- \`TokenSelector\` - Token selection with search
- \`DexSelector\` - DEX selection (1inch, Uniswap, etc.)
- \`SwapChart\` - Price history (lazy-loaded)

**State Management:**
- Uses React hooks for local state
- \`useDirectSwap\` hook for swap execution
- Real-time prices via \`useRealtimePrices\`
        `,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-[#020717]">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(86,192,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(86,192,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <SKAIHeader />

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-lg">
        <Card className="bg-glass/30 border-border/30 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Tabs defaultValue="swap" className="w-full">
                <TabsList className="bg-muted/30 p-1">
                  <TabsTrigger value="swap" className="text-sm">
                    Swap
                  </TabsTrigger>
                  <TabsTrigger value="limit" className="text-sm">
                    Limit
                  </TabsTrigger>
                  <TabsTrigger value="buy" className="text-sm">
                    Buy
                  </TabsTrigger>
                  <TabsTrigger value="sell" className="text-sm">
                    Sell
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Chain Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network</span>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4 text-blue-400" />
                Base
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            {/* From Token */}
            <div className="p-4 bg-muted/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">You pay</span>
                <span className="text-muted-foreground">Balance: 2.5 ETH</span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  className="text-2xl font-mono bg-transparent border-0 p-0 h-auto focus-visible:ring-0"
                  placeholder="0.0"
                  defaultValue="1.0"
                />
                <Button variant="outline" className="gap-2 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-blue-500" />
                  ETH
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Swap Arrow */}
            <div className="flex justify-center -my-2 relative z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-background border-border/50"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="p-4 bg-muted/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">You receive</span>
                <span className="text-muted-foreground">
                  Balance: 5,000 USDC
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  className="text-2xl font-mono bg-transparent border-0 p-0 h-auto focus-visible:ring-0"
                  placeholder="0.0"
                  defaultValue="2,145.32"
                  readOnly
                />
                <Button variant="outline" className="gap-2 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-green-500" />
                  USDC
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Swap Details */}
            <div className="p-3 bg-muted/20 rounded-lg text-sm space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Rate</span>
                <span>1 ETH = 2,145.32 USDC</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Fee (0.30%)</span>
                <span>$6.44</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Slippage</span>
                <span>0.5%</span>
              </div>
            </div>

            {/* Swap Button */}
            <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary">
              Swap
            </Button>
          </CardContent>
        </Card>
      </main>

      <MobileBottomNav />
    </div>
  ),
};

/**
 * Prediction Markets Page
 *
 * The predict page shows:
 * - Category tabs (All, Crypto, Sports, Politics, etc.)
 * - Market cards with Yes/No probabilities
 * - Resolution status and deadlines
 *
 * Source: src/pages/defi/Predict.tsx
 */
export const PredictPage: StoryObj = {
  name: "Prediction Markets Page",
  parameters: {
    docs: {
      description: {
        story: `
## Prediction Markets Layout

The prediction markets page features:

- **Category Tabs**: All, Crypto, Sports, Politics, Entertainment
- **Market Cards**: Each market shows:
  - Question/Title
  - Yes/No probability bars
  - Total volume
  - Resolution deadline
  - Creator avatar

**Key Components:**
- \`MarketListPage\` - Main market listing
- \`MarketCard\` - Individual market display
- \`PredictionChart\` - Historical probability
        `,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-[#020717]">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(86,192,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(86,192,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <SKAIHeader />

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Prediction Markets</h1>
          <Button className="bg-gradient-to-r from-primary to-secondary">
            <Plus className="h-4 w-4 mr-2" />
            Create Market
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="politics">Politics</TabsTrigger>
            <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Markets Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              question: "Will BTC reach $100K by end of 2026?",
              yes: 67,
              volume: "$1.2M",
              deadline: "Dec 31, 2026",
            },
            {
              question: "Will ETH flip BTC in market cap?",
              yes: 23,
              volume: "$850K",
              deadline: "Dec 31, 2027",
            },
            {
              question: "Will Solana hit $500?",
              yes: 45,
              volume: "$420K",
              deadline: "Jun 30, 2026",
            },
          ].map((market, i) => (
            <Card
              key={i}
              className="bg-glass/30 border-border/30 backdrop-blur-sm hover:border-primary/30 transition-colors cursor-pointer"
            >
              <CardContent className="p-4">
                <p className="font-medium mb-4 line-clamp-2">
                  {market.question}
                </p>

                {/* Probability Bars */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-8 bg-muted/30 rounded overflow-hidden">
                      <div
                        className="h-full bg-green-500/80 flex items-center px-2"
                        style={{ width: `${market.yes}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          Yes {market.yes}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-8 bg-muted/30 rounded overflow-hidden">
                      <div
                        className="h-full bg-red-500/80 flex items-center px-2"
                        style={{ width: `${100 - market.yes}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          No {100 - market.yes}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Vol: {market.volume}</span>
                  <span>Ends: {market.deadline}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  ),
};

/**
 * Account / Portfolio Page
 *
 * The account page shows:
 * - User profile card with avatar, username, stats
 * - Holdings list with token balances
 * - Activity/Transaction history
 * - Settings access
 *
 * Source: src/pages/account/Account.tsx
 */
export const AccountPage: StoryObj = {
  name: "Account Page",
  parameters: {
    docs: {
      description: {
        story: `
## Account Page Layout

The account page includes:

- **Profile Card**: Avatar, username, tier badge, stats
- **Holdings**: Token balances with 24h change
- **Activity Tabs**: Trades, Predictions, Games
- **Settings**: Access to user settings

**Key Components:**
- \`AccountDropdown\` - Quick account access in header
- \`Portfolio\` - Detailed portfolio view
- \`ActivityFeed\` - Transaction history
        `,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-[#020717]">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(86,192,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(86,192,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <SKAIHeader />

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Card */}
        <Card className="bg-glass/30 border-border/30 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-secondary text-white">
                  SK
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">skai_trader</h2>
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
                    Diamond
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">0x1234...5678</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">$12,345</p>
                <p className="text-xs text-muted-foreground">Portfolio</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-secondary">156</p>
                <p className="text-xs text-muted-foreground">Trades</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">67%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Holdings */}
        <Card className="bg-glass/30 border-border/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Holdings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                token: "ETH",
                amount: "2.5",
                value: "$5,363",
                change: "+2.34%",
                positive: true,
              },
              {
                token: "USDC",
                amount: "5,000",
                value: "$5,000",
                change: "0.00%",
                positive: true,
              },
              {
                token: "SKAI",
                amount: "10,000",
                value: "$1,982",
                change: "+15.2%",
                positive: true,
              },
            ].map((holding) => (
              <div
                key={holding.token}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm bg-muted">
                      {holding.token.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{holding.token}</p>
                    <p className="text-sm text-muted-foreground">
                      {holding.amount}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono">{holding.value}</p>
                  <p
                    className={`text-sm ${holding.positive ? "text-green-500" : "text-red-500"}`}
                  >
                    {holding.change}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <MobileBottomNav />
    </div>
  ),
};

/**
 * Mobile Layout Demo
 *
 * Shows the mobile-specific UI patterns:
 * - Compact header
 * - Fixed bottom navigation
 * - Touch-friendly components
 */
export const MobileLayout: StoryObj = {
  name: "Mobile Layout",
  parameters: {
    docs: {
      description: {
        story: `
## Mobile Layout Pattern

SKAI is mobile-first with responsive breakpoints:

- **Mobile (< 768px)**: Bottom nav visible, hamburger menu in header
- **Desktop (≥ 768px)**: Full header nav, no bottom nav

**Mobile-Specific Features:**
- Touch targets min 44px × 44px
- Bottom nav with 5 primary actions
- Sheet-based modals instead of dropdowns
- Swipe gestures for certain actions

**CSS Breakpoints:**
\`\`\`css
md:hidden  /* Show only on mobile */
hidden md:flex  /* Show only on desktop */
\`\`\`
        `,
      },
    },
  },
  render: () => (
    <div
      className="max-w-sm mx-auto border border-border/30 rounded-3xl overflow-hidden bg-[#020717]"
      style={{ height: 700 }}
    >
      {/* Status Bar (simulated) */}
      <div className="h-11 bg-black flex items-center justify-between px-6 text-xs text-white">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-2 bg-white rounded-sm" />
          <div className="w-4 h-2 bg-white rounded-sm" />
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-full bg-green-500 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Compact Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold">SKAI</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main
        className="p-4 space-y-4 overflow-auto"
        style={{ height: "calc(100% - 56px - 64px - 44px)" }}
      >
        {/* Balance Card */}
        <Card className="bg-glass/30 border-border/30">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="text-3xl font-bold">$12,345.67</p>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500 text-sm">+$234.56 (1.94%)</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: ArrowUpDown, label: "Swap" },
            { icon: Plus, label: "Buy" },
            { icon: Wallet, label: "Send" },
            { icon: BarChart3, label: "Trade" },
          ].map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <action.icon className="h-5 w-5 text-primary" />
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Holdings */}
        <div>
          <h3 className="font-semibold mb-3">Holdings</h3>
          <div className="space-y-2">
            {[
              {
                token: "ETH",
                amount: "2.5",
                value: "$5,363",
                change: "+2.34%",
                positive: true,
              },
              {
                token: "USDC",
                amount: "5,000",
                value: "$5,000",
                change: "0.00%",
                positive: true,
              },
              {
                token: "SKAI",
                amount: "10,000",
                value: "$1,982",
                change: "+15.2%",
                positive: true,
              },
            ].map((holding) => (
              <div
                key={holding.token}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {holding.token}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{holding.token}</p>
                    <p className="text-xs text-muted-foreground">
                      {holding.amount}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">{holding.value}</p>
                  <p
                    className={`text-xs ${holding.positive ? "text-green-500" : "text-red-500"}`}
                  >
                    {holding.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="h-16 border-t border-border/30 flex items-center justify-around px-4 bg-background/95">
        {[
          { icon: Home, label: "Home", active: true },
          { icon: Zap, label: "Swap", active: false },
          { icon: TrendingUp, label: "Predict", active: false },
          { icon: Trophy, label: "Leaders", active: false },
          { icon: User, label: "Account", active: false },
        ].map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1 ${
              item.active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  ),
};
