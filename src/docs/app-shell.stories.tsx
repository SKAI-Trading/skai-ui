import type { Meta, StoryObj } from "@storybook/react";
import {
  AppShell,
  LAYOUT_HEIGHTS,
  FULL_HEIGHT_CLASS,
} from "../components/layout/app-shell";
import { AppHeader, AppHeaderNavItem } from "../components/layout/app-header";
import { AppFooter } from "../components/layout/app-footer";
import { Button } from "../components/core/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/core/card";
import { Home, LineChart, Gamepad2, Settings, Wallet, Bell } from "lucide-react";

const meta: Meta<typeof AppShell> = {
  title: "Layout/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Main application layout wrapper. Provides consistent layout structure with header, footer, sidebar, and bottom bar slots. Handles responsive behavior automatically.",
      },
    },
    layout: "fullscreen",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "trading", "dashboard", "centered"],
    },
    noPadding: {
      control: "boolean",
    },
    showBottomBar: {
      control: "boolean",
    },
    defaultSidebarOpen: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

const Logo = () => (
  <div className="flex items-center gap-2 font-bold">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      S
    </div>
    SKAI
  </div>
);

const Header = () => (
  <AppHeader
    logo={<Logo />}
    navigation={
      <nav className="flex items-center gap-1">
        <AppHeaderNavItem href="/" active>
          Home
        </AppHeaderNavItem>
        <AppHeaderNavItem href="/trade">Trade</AppHeaderNavItem>
        <AppHeaderNavItem href="/play">Play</AppHeaderNavItem>
      </nav>
    }
    actions={
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          Connect
        </Button>
      </div>
    }
  />
);

const Footer = () => (
  <AppFooter variant="minimal" size="compact" copyright="© 2026 SKAI Trading" />
);

const BottomBar = () => (
  <div className="flex h-12 items-center gap-4 border-t bg-background/95 px-4 backdrop-blur">
    <div className="flex items-center gap-4 overflow-hidden text-sm">
      <span className="text-muted-foreground">BTC</span>
      <span className="text-green-500">$43,521 +2.4%</span>
      <span className="text-muted-foreground">ETH</span>
      <span className="text-green-500">$2,250 +3.1%</span>
    </div>
    <div className="ml-auto flex items-center gap-2">
      <Button variant="ghost" size="sm">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const Sidebar = () => (
  <div className="w-64 space-y-2 border-r bg-muted/30 p-4">
    <Button variant="ghost" className="w-full justify-start">
      <Home className="mr-2 h-4 w-4" />
      Dashboard
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <LineChart className="mr-2 h-4 w-4" />
      Trade
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <Gamepad2 className="mr-2 h-4 w-4" />
      Play
    </Button>
    <Button variant="ghost" className="w-full justify-start">
      <Settings className="mr-2 h-4 w-4" />
      Settings
    </Button>
  </div>
);

export const Default: Story = {
  args: {
    header: <Header />,
    footer: <Footer />,
    children: (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Default Layout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Standard layout with header, content area, and footer. Content scrolls
              naturally.
            </p>
          </CardContent>
        </Card>
      </div>
    ),
  },
};

export const TradingVariant: Story = {
  name: "Trading Variant",
  args: {
    variant: "trading",
    header: <Header />,
    bottomBar: <BottomBar />,
    showBottomBar: true,
    noPadding: true,
    children: (
      <div className={`${FULL_HEIGHT_CLASS} grid grid-cols-3 gap-4 p-4`}>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Trading Chart</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="flex h-64 items-center justify-center rounded bg-muted text-muted-foreground">
              Chart Area
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-red-500">$43,520</span>
                  <span className="text-muted-foreground">1.234</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },
};

export const DashboardVariant: Story = {
  name: "Dashboard Variant",
  args: {
    variant: "dashboard",
    header: <Header />,
    sidebar: <Sidebar />,
    children: (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {["Portfolio Value", "24h P&L", "Open Positions"].map((title) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$12,345.67</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
};

export const CenteredVariant: Story = {
  name: "Centered Variant (Auth)",
  args: {
    variant: "centered",
    children: (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Welcome to SKAI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Connect your wallet to get started
          </p>
          <Button className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    ),
  },
};

export const WithBottomBar: Story = {
  name: "With Bottom Bar",
  args: {
    header: <Header />,
    bottomBar: <BottomBar />,
    showBottomBar: true,
    children: (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Layout with Bottom Bar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The bottom bar shows price ticker and quick actions. Content area adjusts
              automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    ),
  },
};

export const LayoutConstants: Story = {
  name: "Layout Height Constants",
  render: () => (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>LAYOUT_HEIGHTS Constants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use these constants for consistent viewport calculations:
          </p>
          <div className="grid grid-cols-2 gap-4 font-mono text-sm">
            <div>
              <p className="text-muted-foreground">Header</p>
              <p>{LAYOUT_HEIGHTS.header}px (h-14)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Bottom Bar</p>
              <p>{LAYOUT_HEIGHTS.bottomBar}px (h-12)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Mobile Nav</p>
              <p>{LAYOUT_HEIGHTS.mobileNav}px (h-16)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total (header + bottom)</p>
              <p>{LAYOUT_HEIGHTS.total}px</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="mb-2 text-muted-foreground">Full height class:</p>
            <code className="block rounded bg-muted p-2 text-sm">
              {FULL_HEIGHT_CLASS}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

export const FullExample: Story = {
  name: "Full Trading Platform",
  render: () => (
    <AppShell
      variant="trading"
      header={
        <AppHeader
          variant="glass"
          logo={<Logo />}
          navigation={
            <nav className="flex items-center gap-1">
              <AppHeaderNavItem href="/trade" active>
                <LineChart className="mr-1 h-4 w-4" />
                Trade
              </AppHeaderNavItem>
              <AppHeaderNavItem href="/play">
                <Gamepad2 className="mr-1 h-4 w-4" />
                Play
              </AppHeaderNavItem>
            </nav>
          }
          actions={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm">
                <Wallet className="mr-2 h-4 w-4" />
                0x7c3d...5f2a
              </Button>
            </div>
          }
        />
      }
      bottomBar={<BottomBar />}
      showBottomBar
      noPadding
    >
      <div className={`${FULL_HEIGHT_CLASS} p-4`}>
        <div className="flex h-full items-center justify-center rounded-lg bg-muted/30">
          <p className="text-muted-foreground">Trading Interface Content</p>
        </div>
      </div>
    </AppShell>
  ),
};
