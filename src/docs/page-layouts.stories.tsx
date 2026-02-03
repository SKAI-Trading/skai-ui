import type { Meta, StoryObj } from "@storybook/react";
import {
  PageHeader,
  TradingPage,
  DashboardPage,
  AuthPage,
  ContentPage,
} from "../components/layout/page-layouts";
import { Button } from "../components/core/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/core/card";
import { Settings, Filter, Download, Plus, Wallet } from "lucide-react";

const meta: Meta = {
  title: "Layout/PageLayouts",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Pre-built page layouts for common SKAI application patterns. These layouts enforce consistent structure, spacing, and typography.",
      },
    },
    layout: "fullscreen",
  },
};

export default meta;

// =============================================================================
// PAGE HEADER STORIES
// =============================================================================

export const PageHeaderDefault: StoryObj<typeof PageHeader> = {
  name: "PageHeader - Default",
  render: () => (
    <div className="p-4">
      <PageHeader
        title="Trade"
        subtitle="Swap tokens and execute trades on Base network"
      />
    </div>
  ),
};

export const PageHeaderWithActions: StoryObj<typeof PageHeader> = {
  name: "PageHeader - With Actions",
  render: () => (
    <div className="p-4">
      <PageHeader
        title="Portfolio"
        subtitle="Track your holdings and performance"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Position
            </Button>
          </>
        }
      />
    </div>
  ),
};

export const PageHeaderWithBreadcrumb: StoryObj<typeof PageHeader> = {
  name: "PageHeader - With Breadcrumb",
  render: () => (
    <div className="p-4">
      <PageHeader
        title="ETH/USDC"
        subtitle="Swap Ethereum for USD Coin"
        breadcrumb={
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Trade
            </a>
            <span>/</span>
            <a href="#" className="hover:text-foreground">
              Swap
            </a>
            <span>/</span>
            <span className="text-foreground">ETH/USDC</span>
          </nav>
        }
        actions={
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        }
      />
    </div>
  ),
};

// =============================================================================
// TRADING PAGE LAYOUT
// =============================================================================

export const TradingPageLayout: StoryObj<typeof TradingPage> = {
  name: "TradingPage Layout",
  render: () => (
    <div className="h-[600px] overflow-hidden rounded-lg border">
      <TradingPage
        tradingPanel={
          <div className="flex h-full flex-col rounded-lg bg-muted/30 p-4">
            <h3 className="mb-4 font-semibold">Trading Chart</h3>
            <div className="flex flex-1 items-center justify-center rounded bg-muted text-muted-foreground">
              TradingView Chart
            </div>
          </div>
        }
        sidebar={
          <div className="h-full space-y-4 rounded-lg bg-muted/30 p-4">
            <h3 className="font-semibold">Order Book</h3>
            <div className="space-y-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-red-500">$43,{520 - i * 10}</span>
                  <span className="text-muted-foreground">
                    {(1.234 * i).toFixed(3)}
                  </span>
                </div>
              ))}
              <div className="py-2 text-center font-semibold">$43,521</div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-green-500">$43,{530 + i * 10}</span>
                  <span className="text-muted-foreground">
                    {(0.987 * i).toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        }
        bottomPanel={
          <div className="h-32 rounded-lg bg-muted/30 p-4">
            <h3 className="mb-2 font-semibold">Open Positions</h3>
            <p className="text-sm text-muted-foreground">No open positions</p>
          </div>
        }
        sidebarWidth="md"
      />
    </div>
  ),
};

export const TradingPageLeftSidebar: StoryObj<typeof TradingPage> = {
  name: "TradingPage - Left Sidebar",
  render: () => (
    <div className="h-[500px] overflow-hidden rounded-lg border">
      <TradingPage
        sidebarPosition="left"
        sidebarWidth="sm"
        tradingPanel={
          <div className="flex h-full items-center justify-center rounded-lg bg-muted/30 p-4">
            Main Trading Area
          </div>
        }
        sidebar={
          <div className="h-full rounded-lg bg-muted/30 p-4">
            <h3 className="font-semibold">Token List</h3>
          </div>
        }
      />
    </div>
  ),
};

// =============================================================================
// DASHBOARD PAGE LAYOUT
// =============================================================================

export const DashboardPageLayout: StoryObj<typeof DashboardPage> = {
  name: "DashboardPage Layout",
  render: () => (
    <div className="min-h-[600px] overflow-hidden rounded-lg border">
      <DashboardPage
        header={
          <PageHeader
            title="Dashboard"
            subtitle="Overview of your trading activity"
            actions={
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            }
          />
        }
      >
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$12,345.67</p>
              <p className="text-sm text-green-500">+$234.56 (1.9%)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                24h Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$5,678.90</p>
              <p className="text-sm text-muted-foreground">12 trades</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Open Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">$8,234 value</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>
      </DashboardPage>
    </div>
  ),
};

// =============================================================================
// AUTH PAGE LAYOUT
// =============================================================================

export const AuthPageLayout: StoryObj<typeof AuthPage> = {
  name: "AuthPage Layout",
  render: () => (
    <div className="h-[500px] overflow-hidden rounded-lg border bg-gradient-to-br from-primary/10 to-background">
      <AuthPage
        logo={
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground">
              S
            </div>
          </div>
        }
        title="Welcome to SKAI"
        subtitle="Connect your wallet to get started"
      >
        <div className="space-y-4">
          <Button className="w-full" size="lg">
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            By connecting, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </AuthPage>
    </div>
  ),
};

export const AuthPageWithBackground: StoryObj<typeof AuthPage> = {
  name: "AuthPage - With Background",
  render: () => (
    <div className="h-[500px] overflow-hidden rounded-lg border">
      <AuthPage
        logo={
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 font-bold text-white">
            S
          </div>
        }
        title="Sign In"
        subtitle="Access your SKAI Trading account"
        showPattern={true}
      >
        <div className="space-y-4">
          <Button className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            MetaMask
          </Button>
          <Button variant="outline" className="w-full">
            WalletConnect
          </Button>
          <Button variant="outline" className="w-full">
            Coinbase Wallet
          </Button>
        </div>
      </AuthPage>
    </div>
  ),
};

// =============================================================================
// CONTENT PAGE LAYOUT
// =============================================================================

export const ContentPageLayout: StoryObj<typeof ContentPage> = {
  name: "ContentPage Layout",
  render: () => (
    <div className="min-h-[500px] overflow-hidden rounded-lg border">
      <ContentPage
        header={
          <PageHeader
            title="Documentation"
            subtitle="Learn how to use SKAI Trading"
            breadcrumb={
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground">
                  Home
                </a>
                <span>/</span>
                <span className="text-foreground">Docs</span>
              </nav>
            }
          />
        }
      >
        <div className="grid md:grid-cols-[200px_1fr_180px] gap-8">
          {/* Sidebar */}
          <nav className="space-y-2 hidden md:block">
            <h3 className="mb-3 font-semibold">Getting Started</h3>
            <a href="#" className="block text-sm text-primary hover:underline">
              Introduction
            </a>
            <a
              href="#"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Quick Start
            </a>
            <a
              href="#"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Installation
            </a>
            <h3 className="mb-3 mt-6 font-semibold">Features</h3>
            <a
              href="#"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Trading
            </a>
            <a
              href="#"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Gaming
            </a>
            <a
              href="#"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              AI Agent
            </a>
          </nav>
          
          {/* Main Content */}
          <article className="prose dark:prose-invert max-w-none">
            <h2>Introduction</h2>
            <p>
              SKAI Trading is a next-generation trading platform combining DeFi swaps,
              prediction markets, and gamified trading experiences.
            </p>
            <h3>Features</h3>
            <ul>
              <li>Token Swaps - Execute trades on Base network</li>
              <li>Prediction Markets - Bet on market outcomes</li>
              <li>Gaming - Play HiLo, Mines, and more</li>
              <li>AI Agent - Get intelligent trading insights</li>
            </ul>
          </article>
          
          {/* Table of Contents */}
          <nav className="space-y-2 hidden lg:block">
            <h3 className="mb-3 font-semibold">On this page</h3>
            <a
              href="#"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Overview
            </a>
            <a
              href="#"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Prerequisites
            </a>
            <a
              href="#"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Installation
            </a>
            <a
              href="#"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Configuration
            </a>
          </nav>
        </div>
      </ContentPage>
    </div>
  ),
};
