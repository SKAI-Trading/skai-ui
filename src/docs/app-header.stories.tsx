import type { Meta, StoryObj } from "@storybook/react";
import {
  AppHeader,
  AppHeaderActions,
  AppHeaderNavItem,
} from "../components/layout/app-header";
import { Button } from "../components/core/button";
import { Input } from "../components/core/input";
import {
  Bell,
  Menu,
  Search,
  Settings,
  Wallet,
  User,
  LineChart,
  Gamepad2,
  Bot,
} from "lucide-react";

const meta: Meta<typeof AppHeader> = {
  title: "Layout/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Application header component with slots for logo, navigation, search, and actions. Fully responsive with mobile menu support.",
      },
    },
    layout: "fullscreen",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "transparent", "solid", "glass"],
    },
    size: {
      control: "select",
      options: ["default", "compact", "large"],
    },
    centerNav: {
      control: "boolean",
    },
    maxWidth: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "full"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppHeader>;

const Logo = () => (
  <div className="flex items-center gap-2 text-lg font-bold">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      S
    </div>
    SKAI
  </div>
);

const Nav = () => (
  <nav className="flex items-center gap-1">
    <AppHeaderNavItem href="/trade" active>
      Trade
    </AppHeaderNavItem>
    <AppHeaderNavItem href="/play">Play</AppHeaderNavItem>
    <AppHeaderNavItem href="/ai">AI</AppHeaderNavItem>
    <AppHeaderNavItem href="/portfolio">Portfolio</AppHeaderNavItem>
  </nav>
);

const Actions = () => (
  <AppHeaderActions>
    <Button variant="ghost" size="icon">
      <Bell className="h-5 w-5" />
    </Button>
    <Button variant="outline">
      <Wallet className="mr-2 h-4 w-4" />
      Connect
    </Button>
  </AppHeaderActions>
);

export const Default: Story = {
  args: {
    logo: <Logo />,
    navigation: <Nav />,
    actions: <Actions />,
  },
};

export const GlassVariant: Story = {
  name: "Glass Variant (SKAI Style)",
  args: {
    variant: "glass",
    logo: <Logo />,
    navigation: <Nav />,
    actions: <Actions />,
  },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] bg-gradient-to-b from-primary/10 to-background">
        <Story />
      </div>
    ),
  ],
};

export const TransparentVariant: Story = {
  name: "Transparent (Hero Section)",
  args: {
    variant: "transparent",
    logo: <Logo />,
    navigation: <Nav />,
    actions: <Actions />,
  },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <Story />
      </div>
    ),
  ],
};

export const WithSearch: Story = {
  name: "With Search Input",
  args: {
    logo: <Logo />,
    navigation: <Nav />,
    search: (
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search tokens..." className="pl-9" />
      </div>
    ),
    actions: <Actions />,
  },
};

export const CenteredNav: Story = {
  name: "Centered Navigation",
  args: {
    logo: <Logo />,
    navigation: <Nav />,
    actions: <Actions />,
    centerNav: true,
  },
};

export const CompactSize: Story = {
  name: "Compact Size",
  args: {
    size: "compact",
    logo: <Logo />,
    navigation: <Nav />,
    actions: <Actions />,
  },
};

export const LargeSize: Story = {
  name: "Large Size",
  args: {
    size: "large",
    logo: <Logo />,
    navigation: <Nav />,
    actions: <Actions />,
  },
};

export const WithMobileMenu: Story = {
  name: "With Mobile Menu Trigger",
  args: {
    logo: <Logo />,
    mobileMenuTrigger: (
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
    ),
    actions: <Actions />,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const TradingPlatform: Story = {
  name: "Trading Platform Example",
  render: () => (
    <AppHeader
      variant="glass"
      logo={
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 font-bold text-white">
            S
          </div>
          <span className="hidden text-lg font-bold sm:block">SKAI Trading</span>
        </div>
      }
      navigation={
        <nav className="flex items-center gap-1">
          <AppHeaderNavItem href="/trade" active>
            <LineChart className="mr-1.5 h-4 w-4" />
            Trade
          </AppHeaderNavItem>
          <AppHeaderNavItem href="/play">
            <Gamepad2 className="mr-1.5 h-4 w-4" />
            Play
          </AppHeaderNavItem>
          <AppHeaderNavItem href="/ai">
            <Bot className="mr-1.5 h-4 w-4" />
            AI
          </AppHeaderNavItem>
        </nav>
      }
      actions={
        <AppHeaderActions>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              3
            </span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
            <Wallet className="mr-2 h-4 w-4" />
            0x7c3d...5f2a
          </Button>
        </AppHeaderActions>
      }
    />
  ),
};

export const MinimalHeader: Story = {
  name: "Minimal Header",
  args: {
    variant: "solid",
    logo: <Logo />,
    actions: (
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
      </Button>
    ),
  },
};
