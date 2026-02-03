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
  ChevronDown,
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

// Figma Design Navigation: Trade (dropdown), Skai, Predict, Play, Social, Earn (dropdown), Coming soon (dropdown)
const Nav = () => (
  <nav className="flex items-center gap-6">
    <AppHeaderNavItem href="/trade" active>
      Trade
      <ChevronDown className="ml-1 h-4 w-4" />
    </AppHeaderNavItem>
    <AppHeaderNavItem href="/skai">Skai</AppHeaderNavItem>
    <AppHeaderNavItem href="/predict">Predict</AppHeaderNavItem>
    <AppHeaderNavItem href="/play">Play</AppHeaderNavItem>
    <AppHeaderNavItem href="/social">Social</AppHeaderNavItem>
    <AppHeaderNavItem href="/earn">
      Earn
      <ChevronDown className="ml-1 h-4 w-4" />
    </AppHeaderNavItem>
    <AppHeaderNavItem href="/coming-soon">
      Coming soon
      <ChevronDown className="ml-1 h-4 w-4" />
    </AppHeaderNavItem>
  </nav>
);

// Figma Design Search Bar
const SearchBar = () => (
  <div className="flex items-center gap-2 rounded-lg border border-[#123F3C] bg-[#001615] px-4 py-2 w-[236px]">
    <Search className="h-4 w-4 text-[#95A09F]" />
    <span className="text-sm text-[#95A09F] tracking-tight">Search anything...</span>
  </div>
);

// Figma Design Actions: Connect wallet button (sky blue) + user avatar
const Actions = () => (
  <AppHeaderActions>
    <Button className="bg-[#56C7F3] hover:bg-[#4ab8e4] text-[#001615] px-10 py-5 rounded-2xl font-normal tracking-tight">
      Connect wallet
    </Button>
    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#56C7F3] to-[#17F9B4] flex items-center justify-center">
      <User className="h-5 w-5 text-[#001615]" />
    </div>
  </AppHeaderActions>
);

export const Default: Story = {
  args: {
    logo: <Logo />,
    navigation: <Nav />,
    search: <SearchBar />,
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

// Figma Design Exact Header: bg-[#001615], border-[#123F3C]
export const TradingPlatform: Story = {
  name: "Figma Design (Exact Match)",
  render: () => (
    <AppHeader
      variant="solid"
      logo={
        <div className="flex items-center gap-2">
          <img
            src="/assets/logo/skai-logo-mark.svg"
            alt="Skai"
            className="h-8 w-8"
          />
          <span className="hidden text-lg font-medium tracking-tight sm:block">
            <span className="text-[#56C7F3]">Skai</span>
            <span className="text-white">.trade</span>
          </span>
        </div>
      }
      navigation={
        <nav className="flex items-center gap-9">
          <AppHeaderNavItem href="/trade" active>
            Trade
            <ChevronDown className="ml-1 h-4 w-4" />
          </AppHeaderNavItem>
          <AppHeaderNavItem href="/skai">Skai</AppHeaderNavItem>
          <AppHeaderNavItem href="/predict">Predict</AppHeaderNavItem>
          <AppHeaderNavItem href="/play">Play</AppHeaderNavItem>
          <AppHeaderNavItem href="/social">Social</AppHeaderNavItem>
          <AppHeaderNavItem href="/earn">
            Earn
            <ChevronDown className="ml-1 h-4 w-4" />
          </AppHeaderNavItem>
          <AppHeaderNavItem href="/coming-soon">
            Coming soon
            <ChevronDown className="ml-1 h-4 w-4" />
          </AppHeaderNavItem>
        </nav>
      }
      search={
        <div className="flex items-center gap-2.5 rounded-lg border border-[#123F3C] bg-[#001615] px-4 py-2 w-[236px]">
          <Search className="h-4 w-4 text-[#95A09F]" />
          <span className="text-sm text-[#95A09F] tracking-tight opacity-75">Search anything...</span>
        </div>
      }
      actions={
        <AppHeaderActions className="gap-4">
          <Button className="bg-[#56C7F3] hover:bg-[#4ab8e4] text-[#001615] px-10 py-5 rounded-2xl font-normal tracking-tight text-base">
            Connect wallet
          </Button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#56C7F3] to-[#17F9B4] flex items-center justify-center overflow-hidden">
            <User className="h-5 w-5 text-[#001615]" />
          </div>
        </AppHeaderActions>
      }
    />
  ),
  decorators: [
    (Story) => (
      <div className="bg-[#001615]">
        <Story />
      </div>
    ),
  ],
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
