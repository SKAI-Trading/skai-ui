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
  MessageSquare,
  Plus,
  Search,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Trophy,
  User,
  Vault,
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
 * The SKAI header is a two-row layout:
 * - Top row: Logo (wordmark), centered search bar, status pills (Points/Vault), ETH balance, notifications, account
 * - Bottom row: Navigation links (AI, Trade, Predict, Play, Social dropdown, SKAI dropdown)
 *
 * Source: src/components/layout/Header.tsx (869 lines)
 */
const SKAIHeader = () => (
  <header className="sticky top-0 z-50 backdrop-blur-xl bg-background border-b border-border/30 shadow-[0_1px_15px_rgba(44,236,173,0.02)]">
    <div className="container mx-auto px-4">
      {/* Top Row: Logo, Search, Status, Account */}
      <div className="flex items-center justify-between h-14 border-b border-border/30">
        {/* Logo - Wordmark (oversized and clipped like real app) */}
        <div className="flex items-center group min-h-[44px] min-w-[44px] shrink-0 overflow-hidden cursor-pointer">
          <div className="relative h-[168px] -my-[66px] flex items-center">
            <span className="text-4xl font-black tracking-tight bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              SKAI
            </span>
            <span className="text-4xl font-black tracking-tight text-muted-foreground/30">
              .trade
            </span>
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="hidden md:flex flex-1 justify-center px-8 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search markets, users, tokens..."
              className="w-full pl-10 bg-muted/50 border-border/50 h-9 text-sm"
            />
          </div>
        </div>

        {/* Right Side: Status Pills, Notifications, Account */}
        <div className="flex items-center gap-2">
          {/* Status Pills - Points & Vault (connected state) */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Points Pill */}
            <button className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-background/80 to-background/40 border border-border/40 hover:border-border/60 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
              <div className="relative">
                <Trophy className="w-4 h-4 text-yellow-500" />
              </div>
              <span className="text-xs font-bold text-yellow-400">12,450</span>
            </button>

            {/* Vault Pill */}
            <button className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-background/80 to-background/40 border border-border/40 hover:border-border/60 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
              <div className="relative">
                <Vault className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-xs font-bold text-secondary">$1,234</span>
            </button>
          </div>

          {/* ETH Balance */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-muted/50 border border-border/50">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
              Ξ
            </div>
            <span className="text-xs font-medium">0.42 ETH</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </Button>

          {/* Account Menu */}
          <Button variant="ghost" size="sm" className="gap-2 h-9 px-2">
            <Avatar className="h-7 w-7 ring-2 ring-secondary/30">
              <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-secondary text-white font-bold">
                SK
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-mono">
              0x1234...5678
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Row: Navigation Menu */}
      <nav className="hidden lg:flex items-center gap-1 h-10 overflow-x-auto">
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1.5 text-sm font-medium text-primary bg-primary/10"
        >
          AI
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          Trade
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          Predict
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          Play
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary gap-1"
        >
          Social <ChevronDown className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary gap-1"
        >
          SKAI <ChevronDown className="h-3 w-3" />
        </Button>
      </nav>
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
  <nav className="md:hidden fixed bottom-10 left-0 right-0 z-50 border-t border-border/30 backdrop-blur-xl bg-background/95 h-16">
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

// Brand Icons
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/**
 * Bottom Ticker Bar - Dock-style navigation with crypto ticker
 *
 * The BottomTickerBar is always visible at the bottom:
 * - Left: Social links (Discord, X)
 * - Center: Scrolling crypto price ticker with AI signals
 * - Right: Dock icons (AI, Games, Messages, Quests, Wallet)
 *
 * Source: src/components/layout/BottomTickerBar.tsx (1080 lines)
 */
const BottomTickerBar = () => {
  const tickerItems = [
    {
      symbol: "BTC",
      price: "$67,234",
      change: "+2.4%",
      isPositive: true,
      signal: "BUY",
    },
    {
      symbol: "ETH",
      price: "$3,456",
      change: "+1.8%",
      isPositive: true,
      signal: "HOLD",
    },
    {
      symbol: "SOL",
      price: "$142.50",
      change: "-0.5%",
      isPositive: false,
      signal: "SELL",
    },
    {
      symbol: "BNB",
      price: "$567.89",
      change: "+0.9%",
      isPositive: true,
      signal: null,
    },
    {
      symbol: "XRP",
      price: "$0.523",
      change: "+3.2%",
      isPositive: true,
      signal: "BUY",
    },
    {
      symbol: "ADA",
      price: "$0.456",
      change: "-1.2%",
      isPositive: false,
      signal: null,
    },
    {
      symbol: "DOGE",
      price: "$0.0891",
      change: "+5.6%",
      isPositive: true,
      signal: "BUY",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] h-10 bg-background/95 backdrop-blur-xl border-t border-border/50 flex items-center">
      {/* Social Links - Left */}
      <div className="flex items-center gap-1 px-2 border-r border-border/50">
        <button className="p-2 rounded-lg hover:bg-accent/50 transition-colors">
          <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
        </button>
        <button className="p-2 rounded-lg hover:bg-accent/50 transition-colors">
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Crypto Ticker - Center (scrolling) */}
      <div className="flex-1 overflow-hidden border-r border-border/50">
        <div className="flex items-center animate-ticker whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center mx-4 text-xs">
              <span className="mr-2 font-mono font-bold text-primary">
                {item.symbol}
              </span>
              <span className="text-muted-foreground mr-2">{item.price}</span>
              <span
                className={`font-medium ${item.isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {item.change}
              </span>
              {item.signal && (
                <span
                  className={`ml-1.5 text-[9px] font-bold px-1 py-0.5 rounded ${
                    item.signal === "BUY"
                      ? "text-green-400 bg-green-400/10"
                      : item.signal === "SELL"
                        ? "text-red-400 bg-red-400/10"
                        : "text-yellow-400 bg-yellow-400/10"
                  }`}
                >
                  {item.signal}
                </span>
              )}
              <span className="mx-4 text-border/30">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dock Icons - Right */}
      <div className="flex items-center gap-0.5 px-2">
        <button className="group relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all">
          <Brain className="w-4 h-4 text-primary" />
        </button>
        <button className="group relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-accent/50 transition-colors">
          <Gamepad2 className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
        </button>
        <button className="group relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-accent/50 transition-colors">
          <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center bg-destructive text-white text-[10px] font-bold rounded-full">
            3
          </span>
        </button>
        <button className="group relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-accent/50 transition-colors">
          <Target className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center bg-yellow-500 text-yellow-950 text-[10px] font-bold rounded-full">
            2
          </span>
        </button>
        <button className="group relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-accent/50 transition-colors">
          <Wallet className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
        </button>
      </div>
    </div>
  );
};

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
      <BottomTickerBar />
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
      <BottomTickerBar />
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
      <BottomTickerBar />
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
      <BottomTickerBar />
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
