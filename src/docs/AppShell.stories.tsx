import type { Meta, StoryObj } from "@storybook/react";
import {
  AppShell,
  AppShellContent,
  LAYOUT_HEIGHTS,
} from "../components/app-shell";
import {
  AppHeader,
  AppHeaderNavItem,
  AppHeaderActions,
} from "../components/app-header";
import {
  AppFooter,
  FooterLinkGroup,
  FooterSocialLink,
} from "../components/app-footer";
import { MobileNav, type MobileNavItem } from "../components/mobile-nav";
import { DockBar, DockBarIcon, DockBarSeparator } from "../components/dock-bar";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { SkaiLogo } from "../components/skai-logo";
import {
  Home,
  TrendingUp,
  Gamepad2,
  User,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Wallet,
  Twitter,
  Github,
} from "lucide-react";

const meta: Meta<typeof AppShell> = {
  title: "Layout/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# App Shell System

The layout system provides a consistent structure for all SKAI applications.

## Components

- **AppShell** - Main application wrapper
- **AppHeader** - Top navigation header
- **AppFooter** - Site footer
- **MobileNav** - Bottom navigation for mobile
- **DockBar** - Bottom dock with ticker and actions

## Constants

\`\`\`tsx
import { LAYOUT_HEIGHTS } from "@skai/ui";

// Standard heights
LAYOUT_HEIGHTS.header    // 56px (h-14)
LAYOUT_HEIGHTS.bottomBar // 48px (h-12)
LAYOUT_HEIGHTS.mobileNav // 64px (h-16)
LAYOUT_HEIGHTS.total     // 104px
\`\`\`

## Usage

\`\`\`tsx
import { AppShell, AppHeader, DockBar } from "@skai/ui";

function App() {
  return (
    <AppShell
      header={<AppHeader logo={<Logo />} />}
      bottomBar={<DockBar ticker={<Ticker />} />}
    >
      <PageContent />
    </AppShell>
  );
}
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppShell>;

// Sample navigation items
const navItems: MobileNavItem[] = [
  { id: "home", label: "Home", icon: <Home className="w-5 h-5" />, href: "/" },
  {
    id: "trade",
    label: "Trade",
    icon: <TrendingUp className="w-5 h-5" />,
    href: "/trade",
  },
  {
    id: "play",
    label: "Play",
    icon: <Gamepad2 className="w-5 h-5" />,
    href: "/play",
    badge: "3",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <User className="w-5 h-5" />,
    href: "/profile",
  },
];

// Sample ticker items
const tickerItems = [
  { symbol: "BTC", price: "$97,234.50", change: "+2.34%" },
  { symbol: "ETH", price: "$3,456.78", change: "+1.89%" },
  { symbol: "SOL", price: "$142.50", change: "-0.45%" },
];

// Simple mock ticker component
const MockTicker = () => (
  <div className="flex items-center gap-4 px-4 text-xs animate-marquee">
    {tickerItems.map((item) => (
      <span
        key={item.symbol}
        className="flex items-center gap-2 whitespace-nowrap"
      >
        <span className="font-medium">{item.symbol}</span>
        <span className="text-muted-foreground">{item.price}</span>
        <span
          className={
            item.change.startsWith("+") ? "text-green-500" : "text-red-500"
          }
        >
          {item.change}
        </span>
      </span>
    ))}
  </div>
);

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  render: () => (
    <AppShell
      header={
        <AppHeader
          variant="glass"
          logo={<SkaiLogo size="sm" variant="full" />}
          navigation={
            <>
              <AppHeaderNavItem href="/trade" active>
                Trade
              </AppHeaderNavItem>
              <AppHeaderNavItem href="/play">Play</AppHeaderNavItem>
              <AppHeaderNavItem href="/earn">Earn</AppHeaderNavItem>
            </>
          }
          actions={
            <AppHeaderActions>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="sm">
                <Wallet className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </AppHeaderActions>
          }
        />
      }
      bottomBar={
        <DockBar
          variant="glass"
          ticker={<MockTicker />}
          dock={
            <>
              <DockBarIcon
                icon={<MessageSquare className="w-5 h-5" />}
                label="Chat"
                badge={3}
                badgeVariant="primary"
              />
              <DockBarSeparator />
              <DockBarIcon
                icon={<Settings className="w-5 h-5" />}
                label="Settings"
              />
            </>
          }
        />
      }
    >
      <AppShellContent maxWidth="xl" centered className="py-8 px-4">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">Welcome to SKAI</h1>
          <p className="text-muted-foreground">
            This is the default AppShell layout with header, content, and bottom
            dock bar.
          </p>
          <div className="h-[400px] rounded-xl bg-muted/20 border border-border flex items-center justify-center">
            <span className="text-muted-foreground">Page Content</span>
          </div>
        </div>
      </AppShellContent>
    </AppShell>
  ),
};

export const TradingLayout: Story = {
  render: () => (
    <AppShell
      variant="trading"
      noPadding
      header={
        <AppHeader
          variant="glass"
          logo={<SkaiLogo size="sm" variant="full" />}
          navigation={
            <>
              <AppHeaderNavItem href="/trade" active>
                Trade
              </AppHeaderNavItem>
              <AppHeaderNavItem href="/play">Play</AppHeaderNavItem>
            </>
          }
          actions={
            <Button variant="outline" size="sm">
              <Wallet className="w-4 h-4 mr-2" />
              Connect
            </Button>
          }
        />
      }
      bottomBar={
        <DockBar
          variant="glass"
          ticker={<MockTicker />}
          dock={
            <DockBarIcon
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
            />
          }
        />
      }
    >
      <div
        className="flex flex-col bg-[#020717]"
        style={{ height: `calc(100vh - ${LAYOUT_HEIGHTS.total}px)` }}
      >
        <div className="flex-1 flex gap-2 p-2">
          {/* Left panel */}
          <div className="w-64 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Order Book</span>
          </div>
          {/* Center panel */}
          <div className="flex-1 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Chart</span>
          </div>
          {/* Right panel */}
          <div className="w-80 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Trade Panel</span>
          </div>
        </div>
        {/* Bottom panel */}
        <div className="h-48 mx-2 mb-2 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Positions</span>
        </div>
      </div>
    </AppShell>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <AppShell
      header={
        <AppHeader
          logo={<SkaiLogo size="sm" variant="full" />}
          navigation={
            <>
              <AppHeaderNavItem href="/">Home</AppHeaderNavItem>
              <AppHeaderNavItem href="/about">About</AppHeaderNavItem>
              <AppHeaderNavItem href="/docs">Docs</AppHeaderNavItem>
            </>
          }
        />
      }
      footer={
        <AppFooter
          variant="dark"
          logo={
            <div className="space-y-4">
              <SkaiLogo size="sm" variant="full" />
              <p className="text-sm text-muted-foreground max-w-xs">
                AI-powered trading platform for the next generation of traders.
              </p>
            </div>
          }
          links={
            <>
              <FooterLinkGroup
                title="Product"
                links={[
                  { label: "Trade", href: "/trade" },
                  { label: "Play", href: "/play", badge: "New" },
                  { label: "Earn", href: "/earn" },
                ]}
              />
              <FooterLinkGroup
                title="Resources"
                links={[
                  { label: "Documentation", href: "/docs" },
                  { label: "API", href: "/api", external: true },
                  { label: "Support", href: "/support" },
                ]}
              />
              <FooterLinkGroup
                title="Legal"
                links={[
                  { label: "Privacy", href: "/privacy" },
                  { label: "Terms", href: "/terms" },
                ]}
              />
            </>
          }
          social={
            <>
              <FooterSocialLink
                platform="Twitter"
                icon={<Twitter className="w-5 h-5" />}
                href="https://twitter.com/skai"
              />
              <FooterSocialLink
                platform="GitHub"
                icon={<Github className="w-5 h-5" />}
                href="https://github.com/skai"
              />
            </>
          }
          copyright="© 2026 SKAI Trading. All rights reserved."
        />
      }
      showBottomBar={false}
    >
      <AppShellContent maxWidth="xl" centered className="py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Landing Page</h1>
        <p className="text-xl text-muted-foreground">
          Example with full footer and no bottom dock bar.
        </p>
      </AppShellContent>
    </AppShell>
  ),
};

export const MobileNavExample: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: () => (
    <div className="min-h-screen bg-background">
      <AppHeader
        variant="glass"
        logo={<SkaiLogo size="sm" variant="icon" />}
        mobileMenuTrigger={
          <Button variant="ghost" size="icon">
            <span className="sr-only">Menu</span>≡
          </Button>
        }
        actions={
          <Button variant="outline" size="sm">
            Connect
          </Button>
        }
      />
      <main className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">Mobile View</h1>
        <p className="text-muted-foreground">
          On mobile, the bottom navigation replaces the dock bar.
        </p>
      </main>
      <MobileNav items={navItems} activeItem="trade" variant="glass" />
    </div>
  ),
};

export const HeaderVariants: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-[#020717] min-h-screen">
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">Default</span>
        <AppHeader
          logo={<span className="font-bold">SKAI</span>}
          navigation={
            <>
              <AppHeaderNavItem href="#">Trade</AppHeaderNavItem>
              <AppHeaderNavItem href="#">Play</AppHeaderNavItem>
            </>
          }
        />
      </div>
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">Glass</span>
        <AppHeader
          variant="glass"
          logo={<span className="font-bold text-[#2cecad]">SKAI</span>}
          navigation={
            <>
              <AppHeaderNavItem href="#" active>
                Trade
              </AppHeaderNavItem>
              <AppHeaderNavItem href="#">Play</AppHeaderNavItem>
            </>
          }
        />
      </div>
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">Transparent</span>
        <AppHeader
          variant="transparent"
          logo={<span className="font-bold">SKAI</span>}
          navigation={
            <>
              <AppHeaderNavItem href="#">Trade</AppHeaderNavItem>
              <AppHeaderNavItem href="#">Play</AppHeaderNavItem>
            </>
          }
        />
      </div>
    </div>
  ),
};

export const DockBarVariants: Story = {
  render: () => (
    <div className="space-y-20 p-4 bg-[#020717] min-h-[400px]">
      <div className="relative h-12">
        <span className="text-xs text-muted-foreground absolute -top-6">
          Default
        </span>
        <DockBar
          className="relative"
          ticker={<MockTicker />}
          dock={
            <>
              <DockBarIcon
                icon={<MessageSquare className="w-5 h-5" />}
                label="Chat"
                badge={5}
              />
              <DockBarIcon
                icon={<Settings className="w-5 h-5" />}
                label="Settings"
              />
            </>
          }
        />
      </div>
      <div className="relative h-12">
        <span className="text-xs text-muted-foreground absolute -top-6">
          Glass
        </span>
        <DockBar
          variant="glass"
          className="relative"
          ticker={<MockTicker />}
          dock={
            <>
              <DockBarIcon
                icon={<MessageSquare className="w-5 h-5" />}
                label="Chat"
                badge={5}
                badgeVariant="primary"
              />
              <DockBarSeparator />
              <DockBarIcon
                icon={<Settings className="w-5 h-5" />}
                label="Settings"
                active
              />
            </>
          }
        />
      </div>
    </div>
  ),
};
