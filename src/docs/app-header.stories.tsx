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
  <div className="flex items-center gap-2">
    <img
      src="/assets/logo/skai-logo-mark.svg"
      alt="Skai"
      className="h-8 w-8"
    />
    <span className="text-lg font-medium tracking-tight">
      <span className="text-[#56C7F3]">Skai</span>
      <span className="text-muted-foreground">.trade</span>
    </span>
  </div>
);

const Nav = () => (
  <nav className="flex items-center gap-1">
    <AppHeaderNavItem href="/ai">AI</AppHeaderNavItem>
    <AppHeaderNavItem href="/trade" active>
      Trade
    </AppHeaderNavItem>
    <AppHeaderNavItem href="/predict">Predict</AppHeaderNavItem>
    <AppHeaderNavItem href="/play">Play</AppHeaderNavItem>
    <AppHeaderNavItem href="/social">Social</AppHeaderNavItem>
    <AppHeaderNavItem href="/skai">SKAI</AppHeaderNavItem>
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
          <img
            src="/assets/logo/skai-logo-mark.svg"
            alt="Skai"
            className="h-8 w-8"
          />
          <span className="hidden text-lg font-medium tracking-tight sm:block">
            <span className="text-[#56C7F3]">Skai</span>
            <span className="text-muted-foreground">.trade</span>
          </span>
        </div>
      }
      navigation={
        <nav className="flex items-center gap-1">
          <AppHeaderNavItem href="/ai">
            <Bot className="mr-1.5 h-4 w-4" />
            AI
          </AppHeaderNavItem>
          <AppHeaderNavItem href="/trade" active>
            <LineChart className="mr-1.5 h-4 w-4" />
            Trade
          </AppHeaderNavItem>
          <AppHeaderNavItem href="/predict">Predict</AppHeaderNavItem>
          <AppHeaderNavItem href="/play">
            <Gamepad2 className="mr-1.5 h-4 w-4" />
            Play
          </AppHeaderNavItem>
          <AppHeaderNavItem href="/social">Social</AppHeaderNavItem>
          <AppHeaderNavItem href="/skai">SKAI</AppHeaderNavItem>
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
          <Button className="bg-[#56C7F3] hover:bg-[#4ab8e4] text-[#001615]">
            <Wallet className="mr-2 h-4 w-4" />
            Connect wallet
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
