import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/card";
import { Input } from "../components/input";
import { Badge } from "../components/badge";
import { Progress } from "../components/progress";
import { Separator } from "../components/separator";
import { Avatar, AvatarFallback } from "../components/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/tabs";
import {
  ArrowRight,
  ArrowUpDown,
  Bell,
  Book,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Coins,
  DollarSign,
  Eye,
  Gift,
  HelpCircle,
  Home,
  Key,
  Link,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Rocket,
  Search,
  Share2,
  Shield,
  TrendingDown,
  TrendingUp,
  Trophy,
  Upload,
  User,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

/**
 * # SKAI Page Mockups - Part 2
 *
 * Additional comprehensive mockups for:
 * - Bridge (Cross-chain)
 * - Lending/Borrowing
 * - Governance
 * - Profile
 * - Settings
 * - Learn/Education
 */
const meta: Meta = {
  title: "Templates/Page Mockups Extended",
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "skai-dark",
      values: [{ name: "skai-dark", value: "#020717" }],
    },
  },
};

export default meta;

// Shared Components
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#020717] text-white">
    <div className="fixed inset-0 bg-[linear-gradient(rgba(86,192,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(86,192,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
    {children}
  </div>
);

const Header = () => (
  <header className="h-14 border-b border-white/10 bg-[#020717]/95 backdrop-blur-xl flex items-center px-4 sticky top-0 z-50">
    <div className="flex items-center gap-6 flex-1">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#56C0F6] to-[#2DEDAD] flex items-center justify-center">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-lg bg-gradient-to-r from-[#56C0F6] to-[#2DEDAD] bg-clip-text text-transparent">
          SKAI
        </span>
      </div>
      <nav className="hidden md:flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-gray-400 hover:text-white"
        >
          Trade <ChevronDown className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          Play
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          Predict
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-gray-400 hover:text-white"
        >
          Social <ChevronDown className="h-3 w-3" />
        </Button>
      </nav>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9 relative">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </Button>
      <Button variant="ghost" size="sm" className="gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs bg-gradient-to-br from-[#56C0F6] to-[#2DEDAD] text-white">
            SK
          </AvatarFallback>
        </Avatar>
        <span className="hidden md:inline text-sm">0x1234...5678</span>
      </Button>
    </div>
  </header>
);

const MobileNav = () => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 backdrop-blur-xl bg-[#020717]/95 h-16 pb-safe">
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
            item.active ? "text-[#56C0F6]" : "text-gray-500"
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
 * Bridge Page - Cross-chain Token Bridge
 *
 * Bridge interface with:
 * - Source/destination chain selectors
 * - Token input
 * - Route preview
 * - Transaction history
 *
 * Source: src/pages/Bridge.tsx
 */
export const BridgePage: StoryObj = {
  name: "Bridge",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Bridge</h1>

        <Card className="bg-white/5 border-white/10 mb-4">
          <CardContent className="p-4 space-y-4">
            {/* From Chain */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">From</label>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/5 gap-2 shrink-0">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs">
                    Ξ
                  </div>
                  Ethereum
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pr-20 bg-white/5 border-white/10 text-lg h-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8"
                  >
                    ETH
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Balance: 5.234 ETH</p>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/5 border-white/10"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To Chain */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">To</label>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/5 gap-2 shrink-0">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-bold">
                    B
                  </div>
                  Base
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value="1.0"
                    readOnly
                    className="pr-20 bg-white/5 border-white/10 text-lg h-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8"
                  >
                    ETH
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Info */}
        <Card className="bg-white/5 border-white/10 mb-4">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Route</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400">
                  Best Price
                </Badge>
                <span>Via Across</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Estimated Time</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> ~2 min
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Bridge Fee</span>
              <span>0.001 ETH (~$2.15)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Gas Fee</span>
              <span>~$3.50</span>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between font-medium">
              <span>You'll Receive</span>
              <span className="text-lg">0.999 ETH</span>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full h-12 bg-gradient-to-r from-[#56C0F6] to-[#2DEDAD] text-lg font-semibold">
          Bridge Tokens
        </Button>

        {/* Recent Bridges */}
        <Card className="bg-white/5 border-white/10 mt-6">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Recent Bridges</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {[
              {
                from: "Ethereum",
                to: "Base",
                amount: "2.5 ETH",
                status: "Completed",
                time: "5 min ago",
              },
              {
                from: "Arbitrum",
                to: "Ethereum",
                amount: "1,000 USDC",
                status: "Completed",
                time: "2h ago",
              },
            ].map((tx, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs z-10">
                      Ξ
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-500 mx-1" />
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-bold">
                      B
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      {tx.from} → {tx.to}
                    </div>
                    <div className="text-xs text-gray-400">{tx.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{tx.amount}</div>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Lending Page - Borrow & Supply
 *
 * DeFi lending interface with:
 * - Supply markets
 * - Borrow markets
 * - Position overview
 * - Health factor
 *
 * Source: src/pages/Lending.tsx
 */
export const LendingPage: StoryObj = {
  name: "Lending",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Lending</h1>
            <p className="text-gray-400">Supply & borrow crypto assets</p>
          </div>
          <Button className="bg-[#56C0F6]">
            <Plus className="h-4 w-4 mr-2" /> New Position
          </Button>
        </div>

        {/* Position Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm mb-1">Total Supplied</p>
              <p className="text-2xl font-bold">$12,345.67</p>
              <p className="text-sm text-green-400">+$234.56 APY</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm mb-1">Total Borrowed</p>
              <p className="text-2xl font-bold">$5,678.90</p>
              <p className="text-sm text-yellow-400">-$89.12 Interest</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm mb-1">Net APY</p>
              <p className="text-2xl font-bold text-green-400">+4.23%</p>
              <p className="text-sm text-gray-400">Annualized</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm mb-1">Health Factor</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-green-400">2.34</p>
                <Shield className="h-5 w-5 text-green-400" />
              </div>
              <Progress value={78} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Markets */}
        <Tabs defaultValue="supply" className="space-y-4">
          <TabsList className="bg-white/5">
            <TabsTrigger value="supply">Supply Markets</TabsTrigger>
            <TabsTrigger value="borrow">Borrow Markets</TabsTrigger>
          </TabsList>

          <TabsContent value="supply">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-0">
                <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 p-4 border-b border-white/10 text-sm text-gray-400">
                  <span>Asset</span>
                  <span className="text-right">Supply APY</span>
                  <span className="text-right hidden md:block">
                    Total Supplied
                  </span>
                  <span className="text-right">Your Supply</span>
                  <span></span>
                </div>
                {[
                  {
                    name: "ETH",
                    symbol: "Ξ",
                    apy: "3.24%",
                    total: "$45.6M",
                    your: "$5,234.56",
                    color: "bg-blue-500",
                  },
                  {
                    name: "USDC",
                    symbol: "$",
                    apy: "5.67%",
                    total: "$123.4M",
                    your: "$2,000.00",
                    color: "bg-green-500",
                  },
                  {
                    name: "WBTC",
                    symbol: "₿",
                    apy: "1.89%",
                    total: "$34.5M",
                    your: "$0.00",
                    color: "bg-orange-500",
                  },
                  {
                    name: "DAI",
                    symbol: "◈",
                    apy: "4.56%",
                    total: "$67.8M",
                    your: "$0.00",
                    color: "bg-yellow-500",
                  },
                ].map((asset) => (
                  <div
                    key={asset.name}
                    className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 p-4 items-center hover:bg-white/5 border-b border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${asset.color} flex items-center justify-center font-bold`}
                      >
                        {asset.symbol}
                      </div>
                      <span className="font-medium">{asset.name}</span>
                    </div>
                    <span className="text-right text-green-400">
                      {asset.apy}
                    </span>
                    <span className="text-right hidden md:block text-gray-400">
                      {asset.total}
                    </span>
                    <span className="text-right">{asset.your}</span>
                    <Button variant="outline" size="sm" className="bg-white/5">
                      Supply
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="borrow">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-0">
                <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 p-4 border-b border-white/10 text-sm text-gray-400">
                  <span>Asset</span>
                  <span className="text-right">Borrow APY</span>
                  <span className="text-right hidden md:block">Available</span>
                  <span className="text-right">Your Borrow</span>
                  <span></span>
                </div>
                {[
                  {
                    name: "USDC",
                    symbol: "$",
                    apy: "7.89%",
                    available: "$45.6M",
                    your: "$3,000.00",
                    color: "bg-green-500",
                  },
                  {
                    name: "ETH",
                    symbol: "Ξ",
                    apy: "5.12%",
                    available: "$12.3M",
                    your: "$0.00",
                    color: "bg-blue-500",
                  },
                  {
                    name: "DAI",
                    symbol: "◈",
                    apy: "6.78%",
                    available: "$23.4M",
                    your: "$0.00",
                    color: "bg-yellow-500",
                  },
                ].map((asset) => (
                  <div
                    key={asset.name}
                    className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 p-4 items-center hover:bg-white/5 border-b border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${asset.color} flex items-center justify-center font-bold`}
                      >
                        {asset.symbol}
                      </div>
                      <span className="font-medium">{asset.name}</span>
                    </div>
                    <span className="text-right text-yellow-400">
                      {asset.apy}
                    </span>
                    <span className="text-right hidden md:block text-gray-400">
                      {asset.available}
                    </span>
                    <span className="text-right">{asset.your}</span>
                    <Button variant="outline" size="sm" className="bg-white/5">
                      Borrow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Governance Page - DAO Voting
 *
 * Governance interface with:
 * - Active proposals
 * - Voting power
 * - Delegation
 *
 * Source: src/pages/Governance.tsx
 */
export const GovernancePage: StoryObj = {
  name: "Governance",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Governance</h1>
            <p className="text-gray-400">Vote on protocol proposals</p>
          </div>
          <Button className="bg-[#56C0F6]">
            <Plus className="h-4 w-4 mr-2" /> Create Proposal
          </Button>
        </div>

        {/* Voting Power */}
        <Card className="bg-gradient-to-r from-[#56C0F6]/20 to-[#2DEDAD]/20 border-[#56C0F6]/30 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-1">Your Voting Power</p>
                <p className="text-3xl font-bold">12,345.67 SKAI</p>
                <p className="text-sm text-gray-400 mt-1">
                  0.12% of total supply
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/10">
                  <Users className="h-4 w-4 mr-2" /> Delegate
                </Button>
                <Button className="bg-[#56C0F6]">
                  <Coins className="h-4 w-4 mr-2" /> Get More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proposals */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="bg-white/5">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="passed">Passed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {[
              {
                id: "SIP-12",
                title: "Reduce Trading Fees for High Volume Users",
                description:
                  "Implement a tiered fee structure based on 30-day trading volume",
                forVotes: 2345678,
                againstVotes: 456789,
                status: "Active",
                endsIn: "2 days",
              },
              {
                id: "SIP-11",
                title: "Add SOL/USDC Trading Pair",
                description:
                  "Enable trading for Solana against USDC on the platform",
                forVotes: 1890234,
                againstVotes: 234567,
                status: "Active",
                endsIn: "5 days",
              },
            ].map((proposal) => {
              const total = proposal.forVotes + proposal.againstVotes;
              const forPct = Math.round((proposal.forVotes / total) * 100);
              return (
                <Card
                  key={proposal.id}
                  className="bg-white/5 border-white/10 hover:border-[#56C0F6]/50 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {proposal.id}
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-400">
                            {proposal.status}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold">
                          {proposal.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {proposal.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Ends in</p>
                        <p className="font-medium">{proposal.endsIn}</p>
                      </div>
                    </div>

                    {/* Vote Progress */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">For ({forPct}%)</span>
                        <span className="text-red-400">
                          Against ({100 - forPct}%)
                        </span>
                      </div>
                      <div className="h-3 bg-red-500/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${forPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>
                          {(proposal.forVotes / 1000000).toFixed(2)}M SKAI
                        </span>
                        <span>
                          {(proposal.againstVotes / 1000000).toFixed(2)}M SKAI
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        <Check className="h-4 w-4 mr-2" /> Vote For
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                      >
                        Vote Against
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </main>
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * User Profile Page - Public Profile
 *
 * Profile interface with:
 * - Avatar & bio
 * - Stats & achievements
 * - Activity feed
 * - Social links
 *
 * Source: src/pages/UserProfile.tsx
 */
export const UserProfilePage: StoryObj = {
  name: "User Profile",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="bg-white/5 border-white/10 mb-6 overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-[#56C0F6]/30 to-[#2DEDAD]/30" />
          <CardContent className="p-6 -mt-12">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <Avatar className="h-24 w-24 border-4 border-[#020717] shrink-0">
                <AvatarFallback className="text-2xl bg-gradient-to-br from-[#56C0F6] to-[#2DEDAD]">
                  WH
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">whale.eth</h1>
                  <Badge className="bg-[#56C0F6]/20 text-[#56C0F6]">
                    <Check className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                </div>
                <p className="font-mono text-sm text-gray-400 mb-2">
                  0x1234...5678
                </p>
                <p className="text-gray-300 mb-3">
                  Full-time degen. Riding the waves of crypto since 2017. 🌊
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    🐋 Whale
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    🏆 Top 10 Trader
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ⭐ Early Adopter
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" className="bg-white/5">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button className="bg-[#56C0F6]">
                  <Users className="h-4 w-4 mr-2" /> Follow
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total P&L", value: "+$567,890", trend: "+124.5%" },
            { label: "Win Rate", value: "78%", trend: "+5.2%" },
            { label: "Followers", value: "12,345", trend: "+234" },
            { label: "Trades", value: "2,456", trend: "All-time" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-xs text-green-400 mt-1">{stat.trend}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity */}
        <Tabs defaultValue="trades" className="space-y-4">
          <TabsList className="bg-white/5">
            <TabsTrigger value="trades">Recent Trades</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
          </TabsList>

          <TabsContent value="trades">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-0">
                {[
                  {
                    pair: "ETH/USDC",
                    type: "LONG",
                    entry: "$2,089",
                    exit: "$2,234",
                    pnl: "+$1,234",
                    pct: "+6.9%",
                    time: "2h ago",
                  },
                  {
                    pair: "BTC/USDC",
                    type: "SHORT",
                    entry: "$45,678",
                    exit: "$44,123",
                    pnl: "+$567",
                    pct: "+3.4%",
                    time: "5h ago",
                  },
                  {
                    pair: "SOL/USDC",
                    type: "LONG",
                    entry: "$95.50",
                    exit: "$92.30",
                    pnl: "-$234",
                    pct: "-3.3%",
                    time: "1d ago",
                  },
                ].map((trade, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          trade.type === "LONG"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }
                      >
                        {trade.type}
                      </Badge>
                      <div>
                        <div className="font-medium">{trade.pair}</div>
                        <div className="text-xs text-gray-400">
                          {trade.entry} → {trade.exit}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={
                          trade.pnl.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {trade.pnl} ({trade.pct})
                      </div>
                      <div className="text-xs text-gray-400">{trade.time}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Settings Page - Account Settings
 *
 * Settings interface with:
 * - Profile settings
 * - Security
 * - Notifications
 * - Connected apps
 *
 * Source: src/pages/settings/Settings.tsx
 */
export const SettingsPage: StoryObj = {
  name: "Settings",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-48 shrink-0">
            <nav className="space-y-1">
              {[
                { icon: User, label: "Profile", active: true },
                { icon: Shield, label: "Security" },
                { icon: Bell, label: "Notifications" },
                { icon: Link, label: "Connections" },
                { icon: Eye, label: "Privacy" },
                { icon: DollarSign, label: "Billing" },
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={`w-full justify-start ${item.active ? "bg-white/10 text-white" : "text-gray-400"}`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {/* Profile Section */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your public profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-xl bg-gradient-to-br from-[#56C0F6] to-[#2DEDAD]">
                      SK
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="bg-white/5">
                      <Upload className="h-4 w-4 mr-2" /> Upload Photo
                    </Button>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG. Max 5MB
                    </p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Display Name
                    </label>
                    <Input
                      defaultValue="whale.eth"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Bio
                    </label>
                    <Input
                      defaultValue="Full-time degen 🌊"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Email
                    </label>
                    <Input
                      defaultValue="whale@crypto.io"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <Button className="bg-[#56C0F6]">Save Changes</Button>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Secure your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="font-medium">
                        Two-Factor Authentication
                      </div>
                      <div className="text-sm text-gray-400">
                        Add extra security to your account
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-yellow-400" />
                    <div>
                      <div className="font-medium">Hardware Wallet</div>
                      <div className="text-sm text-gray-400">
                        Connect a hardware wallet for signing
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white/5">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Learn Page - Educational Content
 *
 * Education interface with:
 * - Course cards
 * - Progress tracking
 * - Tutorials
 *
 * Source: src/pages/Learn.tsx
 */
export const LearnPage: StoryObj = {
  name: "Learn",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Learn</h1>
            <p className="text-gray-400">Master crypto trading & DeFi</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">1,234 XP earned</span>
          </div>
        </div>

        {/* Progress Banner */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold">Your Learning Progress</h2>
                <p className="text-sm text-gray-400">
                  3 of 8 courses completed
                </p>
              </div>
              <Badge className="bg-purple-500/30 text-purple-300">
                Level 5
              </Badge>
            </div>
            <Progress value={37.5} className="h-2" />
          </CardContent>
        </Card>

        {/* Course Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            "All",
            "Beginner",
            "Trading",
            "DeFi",
            "NFTs",
            "Technical Analysis",
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

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Crypto Basics",
              lessons: 12,
              duration: "2h",
              level: "Beginner",
              progress: 100,
              icon: "📚",
            },
            {
              title: "Trading Fundamentals",
              lessons: 15,
              duration: "3h",
              level: "Beginner",
              progress: 100,
              icon: "📈",
            },
            {
              title: "Technical Analysis",
              lessons: 20,
              duration: "4h",
              level: "Intermediate",
              progress: 65,
              icon: "📊",
            },
            {
              title: "DeFi Deep Dive",
              lessons: 18,
              duration: "3.5h",
              level: "Intermediate",
              progress: 0,
              icon: "🏦",
            },
            {
              title: "Advanced Trading",
              lessons: 25,
              duration: "5h",
              level: "Advanced",
              progress: 0,
              icon: "🎯",
            },
            {
              title: "Risk Management",
              lessons: 10,
              duration: "2h",
              level: "Intermediate",
              progress: 0,
              icon: "🛡️",
            },
          ].map((course) => (
            <Card
              key={course.title}
              className="bg-white/5 border-white/10 hover:border-[#56C0F6]/50 transition-colors cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{course.icon}</div>
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-1">{course.title}</h3>
                <p className="text-sm text-gray-400 mb-3">
                  {course.lessons} lessons • {course.duration}
                </p>
                {course.progress > 0 ? (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span
                        className={
                          course.progress === 100
                            ? "text-green-400"
                            : "text-[#56C0F6]"
                        }
                      >
                        {course.progress}%
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-1" />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-white/5"
                  >
                    Start Course
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Notifications Page - Alert Center
 *
 * Notifications interface with:
 * - Notification list
 * - Filters
 * - Settings
 *
 * Source: src/pages/Notifications.tsx
 */
export const NotificationsPage: StoryObj = {
  name: "Notifications",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button variant="ghost" size="sm" className="text-[#56C0F6]">
            Mark all read
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {["All", "Trades", "Social", "System"].map((filter, i) => (
            <Button
              key={filter}
              variant={i === 0 ? "default" : "outline"}
              size="sm"
              className={i === 0 ? "bg-[#56C0F6]" : "bg-white/5"}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-0">
            {[
              {
                icon: TrendingUp,
                title: "Position Closed",
                desc: "Your ETH/USDC long was closed at +12.3%",
                time: "2m ago",
                unread: true,
                type: "success",
              },
              {
                icon: Users,
                title: "New Follower",
                desc: "degen.eth started following you",
                time: "15m ago",
                unread: true,
                type: "social",
              },
              {
                icon: Bell,
                title: "Price Alert",
                desc: "BTC crossed above $45,000",
                time: "1h ago",
                unread: false,
                type: "alert",
              },
              {
                icon: Gift,
                title: "Reward Claimed",
                desc: "You earned 100 XP from trading",
                time: "3h ago",
                unread: false,
                type: "reward",
              },
              {
                icon: MessageCircle,
                title: "New Message",
                desc: "You have 3 unread messages",
                time: "5h ago",
                unread: false,
                type: "social",
              },
              {
                icon: Shield,
                title: "Security Alert",
                desc: "New login from Chrome on Windows",
                time: "1d ago",
                unread: false,
                type: "warning",
              },
            ].map((notif, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-4 hover:bg-white/5 border-b border-white/5 ${notif.unread ? "bg-white/5" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    notif.type === "success"
                      ? "bg-green-500/20 text-green-400"
                      : notif.type === "social"
                        ? "bg-blue-500/20 text-blue-400"
                        : notif.type === "alert"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : notif.type === "reward"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-red-500/20 text-red-400"
                  }`}
                >
                  <notif.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{notif.title}</span>
                    {notif.unread && (
                      <span className="w-2 h-2 bg-[#56C0F6] rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">{notif.desc}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      <MobileNav />
    </PageWrapper>
  ),
};

/**
 * Help Center Page - Support & FAQ
 *
 * Help interface with:
 * - Search
 * - FAQ categories
 * - Contact support
 *
 * Source: src/pages/HelpCenter.tsx
 */
export const HelpCenterPage: StoryObj = {
  name: "Help Center",
  render: () => (
    <PageWrapper>
      <Header />
      <main className="p-4 pb-20 md:pb-4 max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">How can we help?</h1>
          <p className="text-gray-400 mb-6">
            Search our knowledge base or browse categories
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for help..."
              className="pl-10 bg-white/5 border-white/10 h-12"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Rocket, title: "Getting Started", count: 12 },
            { icon: TrendingUp, title: "Trading", count: 24 },
            { icon: Wallet, title: "Wallet & Deposits", count: 18 },
            { icon: Shield, title: "Security", count: 15 },
            { icon: DollarSign, title: "Fees & Payments", count: 10 },
            { icon: HelpCircle, title: "Account Issues", count: 8 },
          ].map((cat) => (
            <Card
              key={cat.title}
              className="bg-white/5 border-white/10 hover:border-[#56C0F6]/50 transition-colors cursor-pointer"
            >
              <CardContent className="p-4 text-center">
                <cat.icon className="h-8 w-8 mx-auto mb-2 text-[#56C0F6]" />
                <h3 className="font-medium">{cat.title}</h3>
                <p className="text-sm text-gray-400">{cat.count} articles</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Articles */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              "How to connect your wallet",
              "Understanding trading fees",
              "How to withdraw funds",
              "Setting up 2FA security",
              "Using leverage on perpetuals",
            ].map((article, i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-between text-left h-auto py-3"
              >
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-gray-400" />
                  <span>{article}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-gradient-to-r from-[#56C0F6]/20 to-[#2DEDAD]/20 border-[#56C0F6]/30">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-10 w-10 mx-auto mb-3 text-[#56C0F6]" />
            <h3 className="text-lg font-semibold mb-1">Still need help?</h3>
            <p className="text-gray-400 mb-4">
              Our support team is available 24/7
            </p>
            <Button className="bg-[#56C0F6]">
              <Mail className="h-4 w-4 mr-2" /> Contact Support
            </Button>
          </CardContent>
        </Card>
      </main>
      <MobileNav />
    </PageWrapper>
  ),
};
