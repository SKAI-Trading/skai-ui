import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { Input } from "../components/core/input";
import { Badge } from "../components/core/badge";
import { Avatar, AvatarFallback } from "../components/data-display/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/navigation/tabs";
import {
  ArrowUpDown,
  BarChart3,
  Bell,
  Bot,
  Brain,
  ChevronDown,
  Copy,
  CreditCard,
  Dice5,
  DollarSign,
  Filter,
  Flame,
  Gamepad2,
  Gift,
  Home,
  LineChart,
  MessageSquare,
  Mic,
  MoreHorizontal,
  PieChart,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  User,
  Users,
  Vault,
  Wallet,
  Zap,
} from "lucide-react";

/**
 * # SKAI Page Mockups
 *
 * Comprehensive mockups of all major pages in the SKAI trading platform.
 * These mockups show the actual UI patterns and component composition used.
 *
 * ## Page Categories:
 * 1. **Trading** - Trade, Swap, Exchange, Perps
 * 2. **Games** - Play, Casino, Mini-games
 * 3. **Social** - Messages, Profile, Groups
 * 4. **Account** - Settings, Portfolio, Wallet
 * 5. **AI** - AI Agent, Insights
 * 6. **Admin** - Admin Panel
 */
const meta: Meta = {
  title: "Templates/Page Mockups",
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "skai-dark",
      values: [{ name: "skai-dark", value: "#0a0a0f" }],
    },
  },
};

export default meta;

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

// Shared Components - Accurate to real app

/** Page wrapper with SKAI dark theme background */
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0a0a0f] text-white">
    <div className="fixed inset-0 bg-[linear-gradient(rgba(44,236,173,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(44,236,173,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
    {children}
  </div>
);

/**
 * Accurate Header component matching src/components/layout/Header.tsx
 * Features:
 * - SKAI wordmark logo (oversized, clipped)
 * - Global search bar (center)
 * - Status bar (Points + Vault) when connected
 * - Notifications bell
 * - Account dropdown
 * - Bottom nav row: AI, Trade, Predict, Play, Social, SKAI
 */
const Header = () => (
  <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0f] border-b border-white/5 shadow-[0_1px_15px_rgba(44,236,173,0.02)]">
    <div className="container mx-auto px-4">
      {/* Top Row: Logo, Search, Wallet */}
      <div className="flex items-center justify-between h-14 border-b border-white/5">
        {/* Logo - Wordmark (oversized and clipped like real app) */}
        <div className="flex items-center group min-h-[44px] min-w-[44px] shrink-0 overflow-hidden cursor-pointer">
          <div className="relative h-[168px] -my-[66px] flex items-center">
            <span className="text-4xl font-black tracking-tight bg-gradient-to-r from-[#2DEDAD] to-[#56C0F6] bg-clip-text text-transparent">
              SKAI
            </span>
            <span className="text-4xl font-black tracking-tight text-white/20">
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
              className="w-full pl-10 bg-white/5 border-white/10 h-9 text-sm"
            />
          </div>
        </div>

        {/* Right Side: Status Bar, Notifications, Account */}
        <div className="flex items-center gap-2">
          {/* Status Pills - Points & Vault */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Points Pill */}
            <button className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-background/80 to-background/40 border border-border/40 hover:border-border/60 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
              <div className="relative">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <div className="absolute inset-0 blur-md bg-yellow-500/30 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-yellow-400">12,450</span>
            </button>

            {/* Vault Pill */}
            <button className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-background/80 to-background/40 border border-border/40 hover:border-border/60 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
              <div className="relative">
                <Vault className="w-4 h-4 text-[#2DEDAD]" />
                <div className="absolute inset-0 blur-md bg-[#2DEDAD]/30 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-[#2DEDAD]">$1,234</span>
            </button>
          </div>

          {/* ETH Balance */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold">
              Ξ
            </div>
            <span className="text-xs font-medium">0.42 ETH</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </Button>

          {/* Account Menu */}
          <Button variant="ghost" size="sm" className="gap-2 h-9 px-2">
            <Avatar className="h-7 w-7 ring-2 ring-[#2DEDAD]/30">
              <AvatarFallback className="text-xs bg-gradient-to-br from-[#56C0F6] to-[#2DEDAD] text-white font-bold">
                SK
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-mono">
              0x1234...5678
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
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
 * Bottom Ticker Bar - Dock-style navigation with crypto ticker
 * Matches src/components/layout/BottomTickerBar.tsx
 * Features:
 * - Scrolling crypto price ticker with AI signals
 * - Dock icons: AI, Games, Messages, Quests, Wallet
 * - Discord & X social links
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
    <div className="fixed bottom-0 left-0 right-0 z-[100] h-10 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-border/50 flex items-center">
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
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
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
 * Footer - Simple terms/privacy footer
 * Matches src/components/layout/Footer.tsx
 * Currently commented out - available for future use
 */
// const Footer = () => (
//   <footer className="border-t border-border/50 bg-background/50 backdrop-blur-xl mt-12 mb-10">
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//         <div className="flex items-center gap-6 text-sm text-muted-foreground">
//           <button className="hover:text-primary transition-colors">
//             Terms
//           </button>
//           <button className="hover:text-primary transition-colors">
//             Privacy
//           </button>
//         </div>
//         <p className="text-sm text-muted-foreground">© 2026 SKAI</p>
//       </div>
//     </div>
//   </footer>
// );

/** Mobile bottom navigation (shows on mobile only) */
const MobileNav = () => (
  <nav className="md:hidden fixed bottom-10 left-0 right-0 z-50 border-t border-white/10 backdrop-blur-xl bg-[#0a0a0f]/95 h-16">
    <div className="grid grid-cols-5 h-full">
      {[
        { icon: Home, label: "Home", active: false },
        { icon: Zap, label: "Swap", active: false },
        { icon: TrendingUp, label: "Predict", active: false },
        { icon: Trophy, label: "Leaders", active: false },
        { icon: User, label: "Account", active: true },
      ].map((item) => (
        <button
          key={item.label}
          className={`flex flex-col items-center justify-center gap-1 ${
            item.active ? "text-[#2DEDAD]" : "text-gray-500"
          }`}
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px]">{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

/**
 * Trade Page - Perpetuals Trading Interface
 *
 * Main trading interface with:
 * - TradingView chart
 * - Order book
 * - Trade panel (Long/Short)
 * - Positions table
 *
 * Source: src/pages/trade/Trade.tsx
 */
export const TradePage: StoryObj = {
  name: "Trade (Perpetuals)",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="flex flex-col lg:flex-row gap-4 p-4 pb-20 md:pb-4">
        {/* Left: Chart + Order Book */}
        <div className="flex-1 space-y-4">
          {/* Token Selector */}
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2 bg-white/5">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">
                Ξ
              </div>
              ETH/USDC
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">$2,145.67</span>
              <Badge className="bg-green-500/20 text-green-400">+2.34%</Badge>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-400 ml-auto">
              <span>24h High: $2,189.00</span>
              <span>24h Low: $2,098.50</span>
              <span>24h Vol: $1.2B</span>
            </div>
          </div>

          {/* Chart Area */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <div className="h-[400px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <LineChart className="h-16 w-16 mx-auto mb-2 opacity-30" />
                  <p>TradingView Chart</p>
                  <p className="text-xs">Advanced charting with indicators</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Book */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Order Book</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                  >
                    Both
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-green-400"
                  >
                    Bids
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-red-400"
                  >
                    Asks
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 pt-0">
              {/* Bids */}
              <div className="space-y-1">
                {[
                  { price: 2145.5, amount: "3.421" },
                  { price: 2145.25, amount: "5.832" },
                  { price: 2145.0, amount: "2.156" },
                  { price: 2144.75, amount: "8.745" },
                  { price: 2144.5, amount: "1.298" },
                ].map((order, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs font-mono"
                  >
                    <span className="text-green-400">
                      {order.price.toFixed(2)}
                    </span>
                    <span className="text-gray-400">{order.amount}</span>
                  </div>
                ))}
              </div>
              {/* Asks */}
              <div className="space-y-1">
                {[
                  { price: 2146.0, amount: "4.127" },
                  { price: 2146.25, amount: "6.543" },
                  { price: 2146.5, amount: "2.891" },
                  { price: 2146.75, amount: "7.234" },
                  { price: 2147.0, amount: "3.678" },
                ].map((order, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs font-mono"
                  >
                    <span className="text-red-400">
                      {order.price.toFixed(2)}
                    </span>
                    <span className="text-gray-400">{order.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Trade Panel */}
        <div className="w-full lg:w-[380px] space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              {/* Long/Short Tabs */}
              <Tabs defaultValue="long" className="w-full">
                <TabsList className="w-full bg-white/5 p-1">
                  <TabsTrigger
                    value="long"
                    className="flex-1 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
                  >
                    Long
                  </TabsTrigger>
                  <TabsTrigger
                    value="short"
                    className="flex-1 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
                  >
                    Short
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="long" className="mt-4 space-y-4">
                  {/* Leverage */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Leverage</span>
                      <span className="text-[#56C0F6] font-medium">25x</span>
                    </div>
                    <div className="flex gap-2">
                      {[5, 10, 25, 50, 100].map((lev) => (
                        <Button
                          key={lev}
                          variant={lev === 25 ? "default" : "outline"}
                          size="sm"
                          className={`flex-1 h-8 ${lev === 25 ? "bg-[#56C0F6]" : "bg-white/5"}`}
                        >
                          {lev}x
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Size Input */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Size</span>
                      <span className="text-gray-400">
                        Balance: 1,234.56 USDC
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pr-16 bg-white/5 border-white/10 text-lg h-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        USDC
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[25, 50, 75, 100].map((pct) => (
                        <Button
                          key={pct}
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7 text-xs bg-white/5"
                        >
                          {pct}%
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entry Price</span>
                      <span>$2,145.67</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Liquidation Price</span>
                      <span className="text-red-400">$1,716.54</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fee</span>
                      <span>0.05%</span>
                    </div>
                  </div>

                  <Button className="w-full h-12 bg-green-500 hover:bg-green-600 text-lg font-semibold">
                    Open Long Position
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Positions */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Open Positions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5 border border-green-500/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500/20 text-green-400">
                          LONG
                        </Badge>
                        <span className="font-medium">ETH/USDC</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        25x Leverage
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">+$234.56</div>
                      <div className="text-xs text-green-400">+12.34%</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Size: $5,000</span>
                    <span>Entry: $2,089.00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomTickerBar />
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Play Page - Casino & Games Hub
 *
 * Gaming interface with:
 * - Featured games carousel
 * - Game categories
 * - Recent wins ticker
 * - Game cards grid
 *
 * Source: src/pages/play/Play.tsx
 */
export const PlayPage: StoryObj = {
  name: "Play (Games Hub)",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-7xl mx-auto">
        {/* Hero Banner */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 mb-6 overflow-hidden">
          <CardContent className="p-6 md:p-8 flex items-center justify-between">
            <div>
              <Badge className="bg-purple-500/30 text-purple-300 mb-3">
                🎰 Featured
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Crypto Slots
              </h1>
              <p className="text-gray-400 mb-4">
                Spin to win up to 1000x your bet!
              </p>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <Play className="h-4 w-4 mr-2" /> Play Now
              </Button>
            </div>
            <div className="hidden md:block">
              <Dice5 className="h-32 w-32 text-purple-400/30" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Wins Ticker */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardContent className="py-3 flex items-center gap-4 overflow-hidden">
            <Badge variant="outline" className="shrink-0">
              🔥 Live Wins
            </Badge>
            <div className="flex gap-4 animate-marquee">
              {[
                "0x1234 won $12,345 on Slots",
                "0x5678 won $5,678 on HiLo",
                "0x9abc won $2,345 on Crash",
              ].map((win, i) => (
                <span
                  key={i}
                  className="text-sm text-gray-400 whitespace-nowrap"
                >
                  {win}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            "All Games",
            "Slots",
            "Table Games",
            "Crash",
            "Dice",
            "Originals",
          ].map((cat, i) => (
            <Button
              key={cat}
              variant={i === 0 ? "default" : "outline"}
              size="sm"
              className={i === 0 ? "bg-[#56C0F6]" : "bg-white/5"}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: "Crypto Slots", icon: "🎰", players: 1234, hot: true },
            { name: "HiLo", icon: "🃏", players: 567, hot: false },
            { name: "Crash", icon: "📈", players: 890, hot: true },
            { name: "Plinko", icon: "🔴", players: 234, hot: false },
            { name: "Dice", icon: "🎲", players: 456, hot: false },
            { name: "Roulette", icon: "🎡", players: 678, hot: true },
            { name: "Blackjack", icon: "♠️", players: 345, hot: false },
            { name: "Mines", icon: "💣", players: 123, hot: false },
          ].map((game) => (
            <Card
              key={game.name}
              className="bg-white/5 border-white/10 hover:border-[#56C0F6]/50 transition-colors cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-4xl mb-3 group-hover:scale-105 transition-transform">
                  {game.icon}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{game.name}</h3>
                    <p className="text-xs text-gray-400">
                      {game.players} playing
                    </p>
                  </div>
                  {game.hot && <Flame className="h-5 w-5 text-orange-400" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <BottomTickerBar />
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * AI Agent Page - AI Trading Assistant
 *
 * AI interface with:
 * - Chat interface
 * - Voice input
 * - Trading signals
 * - AI insights
 *
 * Source: src/pages/ai/AIAgent.tsx
 */
export const AIAgentPage: StoryObj = {
  name: "AI Agent",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="flex flex-col lg:flex-row gap-4 p-4 pb-20 md:pb-4 max-w-7xl mx-auto">
        {/* Chat Area */}
        <div className="flex-1">
          <Card className="bg-white/5 border-white/10 h-[600px] flex flex-col">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#56C0F6] to-[#2DEDAD] flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      SKAI AI Assistant
                    </CardTitle>
                    <p className="text-xs text-green-400">● Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* AI Message */}
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-[#56C0F6] to-[#2DEDAD] text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-white/10 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                    <p className="text-sm">
                      Hey! I'm your SKAI trading assistant. I can help you with:
                    </p>
                    <ul className="text-sm text-gray-400 mt-2 space-y-1">
                      <li>• Market analysis & signals</li>
                      <li>• Trade recommendations</li>
                      <li>• Portfolio management</li>
                      <li>• Price alerts</li>
                    </ul>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">2:34 PM</span>
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-3 justify-end">
                <div className="flex-1 flex flex-col items-end">
                  <div className="bg-[#56C0F6]/20 rounded-lg rounded-tr-none p-3 max-w-[80%]">
                    <p className="text-sm">
                      What's the current market sentiment for ETH?
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">2:35 PM</span>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-500/30 text-xs">
                    ME
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* AI Analysis Response */}
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-[#56C0F6] to-[#2DEDAD] text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-white/10 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                    <p className="text-sm mb-3">Here's my analysis on ETH:</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <span className="text-xs text-gray-400">Sentiment</span>
                        <Badge className="bg-green-500/20 text-green-400">
                          Bullish
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <span className="text-xs text-gray-400">
                          24h Change
                        </span>
                        <span className="text-green-400 text-sm">+3.24%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <span className="text-xs text-gray-400">Support</span>
                        <span className="text-sm">$2,050</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <span className="text-xs text-gray-400">
                          Resistance
                        </span>
                        <span className="text-sm">$2,250</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">2:35 PM</span>
                </div>
              </div>
            </CardContent>
            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/5 shrink-0"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Ask SKAI anything..."
                  className="bg-white/5 border-white/10"
                />
                <Button className="bg-[#56C0F6] shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar: Signals & Insights */}
        <div className="w-full lg:w-[320px] space-y-4">
          {/* Quick Actions */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 justify-start"
              >
                <TrendingUp className="h-4 w-4 mr-2 text-green-400" /> Long ETH
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 justify-start"
              >
                <TrendingDown className="h-4 w-4 mr-2 text-red-400" /> Short BTC
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 justify-start"
              >
                <BarChart3 className="h-4 w-4 mr-2" /> Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 justify-start"
              >
                <Bell className="h-4 w-4 mr-2" /> Set Alert
              </Button>
            </CardContent>
          </Card>

          {/* Active Signals */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">AI Signals</CardTitle>
                <Badge variant="outline" className="text-xs">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {[
                {
                  token: "ETH",
                  signal: "BUY",
                  confidence: 85,
                  price: "$2,145",
                },
                {
                  token: "BTC",
                  signal: "HOLD",
                  confidence: 72,
                  price: "$43,567",
                },
                {
                  token: "SOL",
                  signal: "SELL",
                  confidence: 68,
                  price: "$98.45",
                },
              ].map((sig) => (
                <div
                  key={sig.token}
                  className="p-3 rounded-lg bg-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                      {sig.token.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{sig.token}</div>
                      <div className="text-xs text-gray-400">{sig.price}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`${
                        sig.signal === "BUY"
                          ? "bg-green-500/20 text-green-400"
                          : sig.signal === "SELL"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {sig.signal}
                    </Badge>
                    <div className="text-xs text-gray-400 mt-1">
                      {sig.confidence}% conf
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomTickerBar />
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Portfolio Page - User Holdings & Performance
 *
 * Portfolio interface with:
 * - Total balance card
 * - Performance chart
 * - Holdings list
 * - Transaction history
 *
 * Source: src/pages/Portfolio.tsx
 */
export const PortfolioPage: StoryObj = {
  name: "Portfolio",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-6xl mx-auto">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-[#56C0F6]/20 to-[#2DEDAD]/20 border-[#56C0F6]/30 mb-6">
          <CardContent className="p-6">
            <p className="text-gray-400 text-sm mb-1">Total Portfolio Value</p>
            <div className="flex items-end gap-3 mb-4">
              <h1 className="text-4xl font-bold">$24,567.89</h1>
              <Badge className="bg-green-500/20 text-green-400 mb-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.34%
              </Badge>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-gray-400">24h Change: </span>
                <span className="text-green-400">+$1,234.56</span>
              </div>
              <div>
                <span className="text-gray-400">Total P&L: </span>
                <span className="text-green-400">+$4,567.89</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Holdings */}
          <div className="md:col-span-2">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Holdings</CardTitle>
                  <Button variant="outline" size="sm" className="bg-white/5">
                    <Plus className="h-4 w-4 mr-1" /> Add Token
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    name: "Ethereum",
                    symbol: "ETH",
                    amount: "5.234",
                    value: "$11,234.56",
                    change: "+5.67%",
                    positive: true,
                  },
                  {
                    name: "Bitcoin",
                    symbol: "BTC",
                    amount: "0.234",
                    value: "$10,198.45",
                    change: "+2.34%",
                    positive: true,
                  },
                  {
                    name: "USDC",
                    symbol: "USDC",
                    amount: "2,134.89",
                    value: "$2,134.89",
                    change: "0.00%",
                    positive: true,
                  },
                  {
                    name: "Solana",
                    symbol: "SOL",
                    amount: "10.5",
                    value: "$999.99",
                    change: "-1.23%",
                    positive: false,
                  },
                ].map((token) => (
                  <div
                    key={token.symbol}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center font-bold text-sm">
                        {token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-sm text-gray-400">
                          {token.amount} {token.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{token.value}</div>
                      <div
                        className={
                          token.positive
                            ? "text-green-400 text-sm"
                            : "text-red-400 text-sm"
                        }
                      >
                        {token.change}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Allocation</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="aspect-square rounded-full bg-gradient-to-br from-[#56C0F6] to-[#2DEDAD] p-4 mb-4">
                  <div className="w-full h-full rounded-full bg-[#020717] flex items-center justify-center">
                    <PieChart className="h-12 w-12 text-gray-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "ETH", pct: 46, color: "bg-blue-500" },
                    { name: "BTC", pct: 42, color: "bg-orange-500" },
                    { name: "USDC", pct: 8, color: "bg-green-500" },
                    { name: "SOL", pct: 4, color: "bg-purple-500" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="flex-1">{item.name}</span>
                      <span className="text-gray-400">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-white/5 justify-start"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" /> Swap Tokens
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white/5 justify-start"
                >
                  <Send className="h-4 w-4 mr-2" /> Send
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white/5 justify-start"
                >
                  <CreditCard className="h-4 w-4 mr-2" /> Buy Crypto
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <BottomTickerBar />
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Messages Page - Social Messaging
 *
 * Messaging interface with:
 * - Conversation list
 * - Chat view
 * - Group chats
 *
 * Source: src/pages/Messages.tsx
 */
export const MessagesPage: StoryObj = {
  name: "Messages",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="flex h-[calc(100vh-56px)] max-w-6xl mx-auto">
        {/* Conversation List */}
        <div className="w-full md:w-80 border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <Input
              placeholder="Search messages..."
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {[
              {
                name: "Trading Group",
                msg: "Great call on ETH! 🚀",
                time: "2m",
                unread: 3,
                group: true,
              },
              {
                name: "whale.eth",
                msg: "Thanks for the tip",
                time: "1h",
                unread: 0,
                group: false,
              },
              {
                name: "Degen Squad",
                msg: "New alpha incoming...",
                time: "3h",
                unread: 12,
                group: true,
              },
              {
                name: "alice.base",
                msg: "Check out this chart",
                time: "1d",
                unread: 0,
                group: false,
              },
            ].map((conv, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 ${i === 0 ? "bg-white/5" : ""}`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback
                    className={
                      conv.group ? "bg-purple-500/30" : "bg-blue-500/30"
                    }
                  >
                    {conv.group ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      conv.name.slice(0, 2).toUpperCase()
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate">{conv.name}</span>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{conv.msg}</p>
                </div>
                {conv.unread > 0 && (
                  <Badge className="bg-[#56C0F6] text-white h-5 min-w-[20px] justify-center">
                    {conv.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-purple-500/30">
                  <Users className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Trading Group</h3>
                <p className="text-xs text-gray-400">24 members • 8 online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {[
              {
                sender: "whale.eth",
                msg: "ETH breaking out of the range!",
                time: "2:30 PM",
                me: false,
              },
              {
                sender: "You",
                msg: "Nice catch! I'm long from $2,100",
                time: "2:31 PM",
                me: true,
              },
              {
                sender: "degen.base",
                msg: "Target $2,400? 🎯",
                time: "2:32 PM",
                me: false,
              },
              {
                sender: "alice.eth",
                msg: "Great call on ETH! 🚀",
                time: "2:34 PM",
                me: false,
              },
            ].map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.me ? "justify-end" : ""}`}
              >
                {!msg.me && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-blue-500/30">
                      {msg.sender.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[70%] ${msg.me ? "items-end" : ""}`}>
                  {!msg.me && (
                    <span className="text-xs text-gray-400 mb-1 block">
                      {msg.sender}
                    </span>
                  )}
                  <div
                    className={`rounded-lg p-3 ${msg.me ? "bg-[#56C0F6]/20 rounded-tr-none" : "bg-white/10 rounded-tl-none"}`}
                  >
                    <p className="text-sm">{msg.msg}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                className="bg-white/5 border-white/10"
              />
              <Button className="bg-[#56C0F6]">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  ),
};

/**
 * Leaderboard Page - Top Traders
 *
 * Leaderboard with:
 * - Time filters
 * - Trader rankings
 * - Performance metrics
 *
 * Source: src/pages/Leaderboard.tsx
 */
export const LeaderboardPage: StoryObj = {
  name: "Leaderboard",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-gray-400">Top performing traders</p>
          </div>
          <div className="flex gap-2">
            {["24h", "7d", "30d", "All"].map((period, i) => (
              <Button
                key={period}
                variant={i === 1 ? "default" : "outline"}
                size="sm"
                className={i === 1 ? "bg-[#56C0F6]" : "bg-white/5"}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              rank: 2,
              name: "degen.eth",
              pnl: "+$234,567",
              pct: "+89.2%",
              avatar: "🥈",
            },
            {
              rank: 1,
              name: "whale.base",
              pnl: "+$567,890",
              pct: "+124.5%",
              avatar: "🥇",
            },
            {
              rank: 3,
              name: "alpha.sol",
              pnl: "+$123,456",
              pct: "+67.8%",
              avatar: "🥉",
            },
          ].map((trader) => (
            <Card
              key={trader.rank}
              className={`bg-white/5 border-white/10 ${trader.rank === 1 ? "md:-mt-4 border-yellow-500/30" : ""}`}
            >
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{trader.avatar}</div>
                <h3 className="font-medium truncate">{trader.name}</h3>
                <div className="text-green-400 font-bold text-lg">
                  {trader.pnl}
                </div>
                <div className="text-gray-400 text-sm">{trader.pct}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Rankings */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-0">
            <div className="grid grid-cols-[auto,1fr,auto,auto,auto] gap-4 p-4 border-b border-white/10 text-sm text-gray-400">
              <span>Rank</span>
              <span>Trader</span>
              <span className="text-right">P&L</span>
              <span className="text-right hidden md:block">Win Rate</span>
              <span className="text-right hidden md:block">Trades</span>
            </div>
            {[
              {
                rank: 4,
                name: "moon.eth",
                pnl: "+$98,765",
                pct: "+56.3%",
                winRate: "72%",
                trades: 234,
              },
              {
                rank: 5,
                name: "trader.base",
                pnl: "+$87,654",
                pct: "+49.1%",
                winRate: "68%",
                trades: 189,
              },
              {
                rank: 6,
                name: "crypto.sol",
                pnl: "+$76,543",
                pct: "+42.8%",
                winRate: "71%",
                trades: 156,
              },
              {
                rank: 7,
                name: "bull.eth",
                pnl: "+$65,432",
                pct: "+38.4%",
                winRate: "65%",
                trades: 201,
              },
              {
                rank: 8,
                name: "dex.base",
                pnl: "+$54,321",
                pct: "+31.2%",
                winRate: "69%",
                trades: 178,
              },
            ].map((trader) => (
              <div
                key={trader.rank}
                className="grid grid-cols-[auto,1fr,auto,auto,auto] gap-4 p-4 items-center hover:bg-white/5 border-b border-white/5"
              >
                <span className="text-gray-400 w-8">{trader.rank}</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500/30 to-purple-500/30">
                      {trader.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate">{trader.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">{trader.pnl}</div>
                  <div className="text-gray-400 text-xs">{trader.pct}</div>
                </div>
                <span className="text-right hidden md:block">
                  {trader.winRate}
                </span>
                <span className="text-right text-gray-400 hidden md:block">
                  {trader.trades}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      <BottomTickerBar />
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Admin Panel Page - Platform Administration
 *
 * Admin interface with:
 * - Stats overview
 * - User management
 * - System settings
 *
 * Source: src/pages/admin/AdminPanel.tsx
 */
export const AdminPanelPage: StoryObj = {
  name: "Admin Panel",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-gray-400">Platform administration</p>
          </div>
          <Badge className="bg-red-500/20 text-red-400">
            <Shield className="h-3 w-3 mr-1" /> Admin Access
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Users",
              value: "124,567",
              change: "+12.3%",
              icon: Users,
            },
            {
              label: "24h Volume",
              value: "$45.6M",
              change: "+8.7%",
              icon: BarChart3,
            },
            {
              label: "Active Trades",
              value: "3,456",
              change: "+5.2%",
              icon: TrendingUp,
            },
            {
              label: "Revenue",
              value: "$234K",
              change: "+15.4%",
              icon: DollarSign,
            },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-[#56C0F6]" />
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-white/5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search users..."
                      className="w-64 bg-white/5 border-white/10"
                    />
                    <Button variant="outline" className="bg-white/5">
                      <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    {
                      address: "0x1234...5678",
                      email: "user@example.com",
                      status: "Active",
                      volume: "$45,678",
                    },
                    {
                      address: "0x5678...9abc",
                      email: "trader@crypto.io",
                      status: "Active",
                      volume: "$123,456",
                    },
                    {
                      address: "0x9abc...def0",
                      email: "whale@defi.com",
                      status: "Flagged",
                      volume: "$567,890",
                    },
                  ].map((user, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user.address.slice(2, 4)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-mono text-sm">
                            {user.address}
                          </div>
                          <div className="text-xs text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          className={
                            user.status === "Active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }
                        >
                          {user.status}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {user.volume}
                        </span>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <BottomTickerBar />
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Copy Trading Page - Follow Top Traders
 *
 * Copy trading interface with:
 * - Top traders to copy
 * - Active copies
 * - Performance stats
 *
 * Source: src/pages/CopyTrading.tsx
 */
export const CopyTradingPage: StoryObj = {
  name: "Copy Trading",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Copy Trading</h1>
            <p className="text-gray-400">Follow top traders automatically</p>
          </div>
          <Button className="bg-[#56C0F6]">
            <Plus className="h-4 w-4 mr-2" /> Become a Leader
          </Button>
        </div>

        {/* Active Copies */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-base">Your Active Copies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-green-500/30">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500/30 to-purple-500/30">
                    WH
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">whale.base</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                      Top 10
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">Copying with $5,000</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold">+$1,234.56</div>
                <div className="text-sm text-gray-400">+24.7% all-time</div>
              </div>
              <Button variant="outline" size="sm" className="bg-white/5">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Traders */}
        <h2 className="text-lg font-semibold mb-4">Top Traders to Copy</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "alpha.eth",
              pnl: "+$234,567",
              pct: "+124%",
              winRate: "78%",
              copiers: 1234,
              risk: "Medium",
            },
            {
              name: "degen.sol",
              pnl: "+$189,012",
              pct: "+98%",
              winRate: "72%",
              copiers: 890,
              risk: "High",
            },
            {
              name: "steady.base",
              pnl: "+$145,678",
              pct: "+67%",
              winRate: "85%",
              copiers: 567,
              risk: "Low",
            },
          ].map((trader) => (
            <Card
              key={trader.name}
              className="bg-white/5 border-white/10 hover:border-[#56C0F6]/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-[#56C0F6]/30 to-[#2DEDAD]/30">
                      {trader.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{trader.name}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="h-3 w-3" /> {trader.copiers} copiers
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <div className="text-gray-400">Total P&L</div>
                    <div className="text-green-400 font-medium">
                      {trader.pnl}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">ROI</div>
                    <div className="text-green-400 font-medium">
                      {trader.pct}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Win Rate</div>
                    <div>{trader.winRate}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Risk</div>
                    <Badge
                      className={
                        trader.risk === "Low"
                          ? "bg-green-500/20 text-green-400"
                          : trader.risk === "High"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {trader.risk}
                    </Badge>
                  </div>
                </div>
                <Button className="w-full bg-[#56C0F6]">
                  <Copy className="h-4 w-4 mr-2" /> Start Copying
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <BottomTickerBar />
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Referral Page - Invite & Earn
 *
 * Referral interface with:
 * - Referral link
 * - Earnings stats
 * - Referral list
 *
 * Source: src/pages/Referral.tsx
 */
export const ReferralPage: StoryObj = {
  name: "Referral Program",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-4xl mx-auto">
        {/* Hero */}
        <Card className="bg-gradient-to-r from-[#56C0F6]/20 to-[#2DEDAD]/20 border-[#56C0F6]/30 mb-6">
          <CardContent className="p-6 text-center">
            <Gift className="h-12 w-12 mx-auto mb-4 text-[#56C0F6]" />
            <h1 className="text-2xl font-bold mb-2">
              Invite Friends, Earn Rewards
            </h1>
            <p className="text-gray-400 mb-6">
              Get 20% of your referrals' trading fees forever!
            </p>
            <div className="flex items-center gap-2 max-w-md mx-auto">
              <Input
                value="https://app.skai.trade/ref/USER123"
                readOnly
                className="bg-white/10 border-white/20 text-center"
              />
              <Button className="bg-[#56C0F6] shrink-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Referrals", value: "47" },
            { label: "Total Earned", value: "$2,345.67" },
            { label: "Pending", value: "$123.45" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#56C0F6]">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Referral List */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              {
                address: "0x1234...5678",
                date: "Jan 15, 2026",
                earned: "$456.78",
                volume: "$12,345",
              },
              {
                address: "0x5678...9abc",
                date: "Jan 10, 2026",
                earned: "$234.56",
                volume: "$8,901",
              },
              {
                address: "0x9abc...def0",
                date: "Jan 5, 2026",
                earned: "$123.45",
                volume: "$5,678",
              },
            ].map((ref, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {ref.address.slice(2, 4)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-mono text-sm">{ref.address}</div>
                    <div className="text-xs text-gray-400">
                      Joined {ref.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">{ref.earned}</div>
                  <div className="text-xs text-gray-400">Vol: {ref.volume}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      <BottomTickerBar />
      <MobileNav />
    </PageWrapper>
  ),
};
