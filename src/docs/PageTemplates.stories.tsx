import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Input } from "../components/input";
import { Badge } from "../components/badge";
import { Separator } from "../components/separator";
import { Avatar, AvatarFallback } from "../components/avatar";
import {
  ArrowUpDown,
  BarChart3,
  Bell,
  ChevronDown,
  Home,
  LineChart,
  Menu,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

const meta: Meta = {
  title: "Templates/Pages",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

// Shared Components
const NavBar = ({ variant = "app" }: { variant?: "app" | "landing" }) => (
  <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-4 sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <Zap className="h-6 w-6 text-cyan-400" />
      <span
        className="font-bold text-lg"
        style={{
          background: "linear-gradient(135deg, #56C0F6, #2DEDAD)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        SKAI
      </span>
    </div>

    {variant === "app" ? (
      <>
        <nav className="hidden md:flex items-center gap-6 ml-8">
          <a href="#" className="text-sm font-medium text-primary">
            Trade
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Portfolio
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Play
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Earn
          </a>
        </nav>
        <div className="flex items-center gap-3 ml-auto">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
            <span className="font-mono text-sm">0x1234...5678</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </>
    ) : (
      <>
        <nav className="hidden md:flex items-center gap-6 ml-8">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Features
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            About
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Docs
          </a>
        </nav>
        <div className="flex items-center gap-3 ml-auto">
          <Button variant="ghost">Sign In</Button>
          <Button
            style={{
              background: "linear-gradient(135deg, #56C0F6, #2DEDAD)",
            }}
          >
            Get Started
          </Button>
        </div>
      </>
    )}

    <Button variant="ghost" size="icon" className="md:hidden ml-auto">
      <Menu className="h-5 w-5" />
    </Button>
  </header>
);

const Sidebar = () => (
  <aside className="w-64 border-r bg-card/50 p-4 hidden lg:block">
    <nav className="space-y-1">
      {[
        { icon: Home, label: "Dashboard", active: false },
        { icon: ArrowUpDown, label: "Swap", active: true },
        { icon: LineChart, label: "Trade", active: false },
        { icon: BarChart3, label: "Portfolio", active: false },
        { icon: Wallet, label: "Wallet", active: false },
        { icon: Settings, label: "Settings", active: false },
      ].map((item) => (
        <a
          key={item.label}
          href="#"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
            item.active
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </a>
      ))}
    </nav>
  </aside>
);

export const DashboardLayout: StoryObj = {
  name: "Dashboard Layout",
  render: () => (
    <div className="min-h-screen bg-[#020717]">
      <NavBar variant="app" />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Portfolio Value", value: "$12,345.67", change: "+2.34%" },
              { label: "24h P&L", value: "+$234.56", change: "+1.94%" },
              { label: "Open Positions", value: "5", change: "" },
              { label: "Win Rate", value: "68%", change: "+3%" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  {stat.change && (
                    <p className="text-sm text-green-500">{stat.change}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Chart Component</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Swap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">You pay</span>
                    <span className="text-muted-foreground">Balance: 2.5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="text-xl font-mono border-0 bg-transparent p-0" defaultValue="1.0" />
                    <Button variant="outline" size="sm">ETH</Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button variant="ghost" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">You receive</span>
                    <span className="text-muted-foreground">Balance: 5,000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="text-xl font-mono border-0 bg-transparent p-0" defaultValue="2,140" readOnly />
                    <Button variant="outline" size="sm">USDC</Button>
                  </div>
                </div>
                <Button className="w-full" style={{ background: "linear-gradient(135deg, #56C0F6, #2DEDAD)" }}>
                  Swap
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Holdings Table */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Holdings</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Token
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { token: "ETH", amount: "2.5", value: "$5,363", change: "+2.34%" },
                  { token: "USDC", amount: "5,000", value: "$5,000", change: "0.00%" },
                  { token: "SKAI", amount: "10,000", value: "$1,982", change: "+15.2%" },
                ].map((holding) => (
                  <div key={holding.token} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{holding.token[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{holding.token}</p>
                        <p className="text-sm text-muted-foreground">{holding.amount}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono">{holding.value}</p>
                      <p className={`text-sm ${holding.change.startsWith("+") ? "text-green-500" : "text-muted-foreground"}`}>
                        {holding.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  ),
};

export const LandingPageLayout: StoryObj = {
  name: "Landing Page Layout",
  render: () => (
    <div className="min-h-screen bg-[#020717]">
      <NavBar variant="landing" />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4" style={{ background: "linear-gradient(135deg, #56C0F6, #2DEDAD)" }}>
            Now Live on Base
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Trade Everything
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #56C0F6, #2DEDAD)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              In One Place
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            SKAI is the cross-chain super app that unifies trading, prediction markets, and gaming into one seamless experience.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              style={{ background: "linear-gradient(135deg, #56C0F6, #2DEDAD)" }}
            >
              Launch App
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Total Volume", value: "$2.5B+" },
              { label: "Active Users", value: "50K+" },
              { label: "Chains Supported", value: "10+" },
              { label: "Tokens Listed", value: "5,000+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-3xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, #56C0F6, #2DEDAD)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ArrowUpDown,
                title: "Swap & Trade",
                description: "Trade any token across multiple chains with the best rates.",
              },
              {
                icon: BarChart3,
                title: "Prediction Markets",
                description: "Bet on real-world events with decentralized prediction markets.",
              },
              {
                icon: Zap,
                title: "AI-Powered",
                description: "Get intelligent trading insights powered by advanced AI.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: "linear-gradient(135deg, #56C0F6, #2DEDAD)" }}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div
          className="max-w-4xl mx-auto rounded-2xl p-12 text-center"
          style={{
            background: "linear-gradient(135deg, #56C0F6 0%, #2DEDAD 100%)",
          }}
        >
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to Start Trading?
          </h2>
          <p className="text-white/80 mb-8">
            Join thousands of traders using SKAI to access the entire crypto market.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
            Launch App Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <span className="font-bold">SKAI</span>
            </div>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Docs</a>
              <a href="#">Twitter</a>
              <a href="#">Discord</a>
            </nav>
            <p className="text-sm text-muted-foreground">
              © 2026 SKAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  ),
};

export const AuthLayout: StoryObj = {
  name: "Auth Layout",
  render: () => (
    <div className="min-h-screen bg-[#020717] flex">
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{
          background: "linear-gradient(135deg, rgba(86, 192, 246, 0.1), rgba(45, 237, 173, 0.1))",
        }}
      >
        <div className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-cyan-400" />
          <span
            className="font-bold text-2xl"
            style={{
              background: "linear-gradient(135deg, #56C0F6, #2DEDAD)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SKAI
          </span>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">
            Trade Smarter,
            <br />
            Not Harder
          </h1>
          <p className="text-muted-foreground text-lg">
            Access every corner of the Web3 market in one unified platform.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {[1, 2, 3].map((i) => (
            <Avatar key={i}>
              <AvatarFallback>U{i}</AvatarFallback>
            </Avatar>
          ))}
          <p className="text-sm text-muted-foreground">
            Join 50,000+ traders
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
              <Zap className="h-6 w-6 text-cyan-400" />
              <span className="font-bold text-xl">SKAI</span>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full gap-2"
              variant="outline"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or continue with
              </span>
            </div>

            <div className="space-y-3">
              <Input type="email" placeholder="Email address" />
              <Input type="password" placeholder="Password" />
            </div>

            <Button
              className="w-full"
              style={{ background: "linear-gradient(135deg, #56C0F6, #2DEDAD)" }}
            >
              Sign In
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const MobileLayout: StoryObj = {
  name: "Mobile Layout",
  render: () => (
    <div className="max-w-sm mx-auto border rounded-3xl overflow-hidden bg-[#020717]" style={{ height: 700 }}>
      {/* Status Bar */}
      <div className="h-11 bg-black flex items-center justify-between px-6 text-xs">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-2 bg-white rounded-sm" />
          <div className="w-4 h-2 bg-white rounded-sm" />
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-full bg-green-500 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-cyan-400" />
          <span className="font-bold">SKAI</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 space-y-4 overflow-auto" style={{ height: "calc(100% - 11px - 56px - 64px)" }}>
        {/* Balance Card */}
        <Card>
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
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50"
            >
              <action.icon className="h-5 w-5 text-cyan-400" />
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Holdings */}
        <div>
          <h3 className="font-semibold mb-3">Holdings</h3>
          <div className="space-y-2">
            {[
              { token: "ETH", amount: "2.5", value: "$5,363", change: "+2.34%" },
              { token: "USDC", amount: "5,000", value: "$5,000", change: "0.00%" },
              { token: "SKAI", amount: "10,000", value: "$1,982", change: "+15.2%" },
            ].map((holding) => (
              <div key={holding.token} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{holding.token}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{holding.token}</p>
                    <p className="text-xs text-muted-foreground">{holding.amount}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">{holding.value}</p>
                  <p className={`text-xs ${holding.change.startsWith("+") ? "text-green-500" : "text-muted-foreground"}`}>
                    {holding.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="h-16 border-t flex items-center justify-around px-4">
        {[
          { icon: Home, label: "Home", active: true },
          { icon: ArrowUpDown, label: "Swap", active: false },
          { icon: BarChart3, label: "Trade", active: false },
          { icon: Wallet, label: "Wallet", active: false },
        ].map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1 ${
              item.active ? "text-cyan-400" : "text-muted-foreground"
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
