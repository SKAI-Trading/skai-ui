import type { Meta, StoryObj } from "@storybook/react";
import {
  AppFooter,
  FooterLinkGroup,
  FooterSocialLink,
} from "../components/layout/app-footer";
import {
  MessageCircle,
  Instagram,
  Bot,
  MessageSquare,
  Gamepad2,
  Wallet,
  Circle,
} from "lucide-react";

// X (Twitter) icon - custom SVG
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Discord icon - custom SVG
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const meta: Meta<typeof AppFooter> = {
  title: "Layout/AppFooter",
  component: AppFooter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Application footer component with slots for logo, links, social icons, and copyright. Supports multiple variants and sizes.",
      },
    },
    layout: "fullscreen",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "minimal", "dark", "glass"],
    },
    size: {
      control: "select",
      options: ["compact", "default", "large"],
    },
    maxWidth: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "full"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppFooter>;

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

// Figma Design: Social icons - Discord, Instagram, X (in that order)
const SocialLinks = () => (
  <div className="flex items-center gap-8">
    <FooterSocialLink
      platform="Discord"
      icon={<DiscordIcon className="h-4 w-4" />}
      href="#"
    />
    <FooterSocialLink
      platform="Instagram"
      icon={<Instagram className="h-4 w-4" />}
      href="#"
    />
    <FooterSocialLink
      platform="X"
      icon={<XIcon className="h-4 w-4" />}
      href="#"
    />
  </div>
);

// Figma Design: Nav items with icons - AI, Chat, Mini games, Wallet
const FooterNav = () => (
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-1.5 text-xs text-white">
      <Bot className="h-4 w-4" />
      <span>AI</span>
    </div>
    <div className="flex items-center gap-1.5 text-xs text-white">
      <MessageSquare className="h-4 w-4" />
      <span>Chat</span>
    </div>
    <div className="flex items-center gap-1.5 text-xs text-white">
      <Gamepad2 className="h-4 w-4" />
      <span>Mini games</span>
    </div>
    <div className="flex items-center gap-1.5 text-xs text-white">
      <Wallet className="h-4 w-4" />
      <span>Wallet</span>
    </div>
  </div>
);

// Figma Design: Connection status badge (green #17F9B4)
const ConnectionStatus = () => (
  <div className="flex items-center gap-1 rounded-full bg-[#17F9B4] px-2 py-0.5">
    <Circle className="h-2.5 w-2.5 fill-[#001615] text-[#001615]" />
    <span className="text-[11px] text-[#001615] tracking-tight">Connection is stable</span>
  </div>
);

// Figma Design: Footer links - Home, Docs, Privacy, Terms
const FooterLinks = () => (
  <div className="flex items-center gap-6 text-xs text-white tracking-tight">
    <a href="/" className="hover:text-[#56C7F3]">Home</a>
    <a href="/docs" className="hover:text-[#56C7F3]">Docs</a>
    <a href="/privacy" className="hover:text-[#56C7F3]">Privacy</a>
    <a href="/terms" className="hover:text-[#56C7F3]">Terms</a>
  </div>
);

export const Default: Story = {
  args: {
    logo: <Logo />,
    copyright: "© 2026 Skai.trade. All rights reserved.",
    social: <SocialLinks />,
  },
};

export const WithLinks: Story = {
  name: "With Link Sections",
  args: {
    logo: <Logo />,
    links: (
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <FooterLinkGroup
          title="Product"
          links={[
            { label: "AI", href: "/ai" },
            { label: "Trade", href: "/trade" },
            { label: "Predict", href: "/predict" },
            { label: "Play", href: "/play" },
          ]}
        />
        <FooterLinkGroup
          title="Social"
          links={[
            { label: "Live", href: "/streaming" },
            { label: "Discover", href: "/discover" },
            { label: "Trading Groups", href: "/trading-groups" },
          ]}
        />
        <FooterLinkGroup
          title="SKAI"
          links={[
            { label: "Earn", href: "/earn" },
            { label: "Governance", href: "/governance" },
          ]}
        />
        <FooterLinkGroup
          title="Legal"
          links={[
            { label: "Terms", href: "/terms" },
            { label: "Privacy", href: "/privacy" },
          ]}
        />
      </div>
    ),
    social: <SocialLinks />,
    copyright: "© 2026 Skai.trade. All rights reserved.",
  },
};

export const DarkVariant: Story = {
  name: "Dark Variant",
  args: {
    variant: "dark",
    logo: <Logo />,
    copyright: "© 2026 Skai.trade",
    social: <SocialLinks />,
  },
};

export const GlassVariant: Story = {
  name: "Glass Variant",
  args: {
    variant: "glass",
    logo: <Logo />,
    copyright: "© 2026 Skai.trade",
    social: <SocialLinks />,
  },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] bg-gradient-to-t from-primary/10 to-background">
        <Story />
      </div>
    ),
  ],
};

export const MinimalVariant: Story = {
  name: "Minimal Variant",
  args: {
    variant: "minimal",
    size: "compact",
    copyright: "© 2026 Skai.trade",
    bottomContent: (
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground">
          Privacy
        </a>
        <a href="#" className="hover:text-foreground">
          Terms
        </a>
        <a href="#" className="hover:text-foreground">
          Cookies
        </a>
      </div>
    ),
  },
};

export const CompactSize: Story = {
  name: "Compact Size",
  args: {
    size: "compact",
    logo: <Logo />,
    copyright: "© 2026 Skai.trade",
    social: <SocialLinks />,
  },
};

export const LargeSize: Story = {
  name: "Large Size",
  args: {
    size: "large",
    logo: <Logo />,
    links: (
      <div className="grid grid-cols-3 gap-12">
        <FooterLinkGroup
          title="Product"
          links={[
            { label: "Trade", href: "/trade" },
            { label: "Play", href: "/play" },
            { label: "AI Agent", href: "/ai" },
          ]}
        />
        <FooterLinkGroup
          title="Resources"
          links={[
            { label: "Documentation", href: "/docs" },
            { label: "API Reference", href: "/api" },
            { label: "Support", href: "/support" },
          ]}
        />
        <FooterLinkGroup
          title="Legal"
          links={[
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Security", href: "/security" },
          ]}
        />
      </div>
    ),
    social: <SocialLinks />,
    copyright: "© 2026 Skai.trade. All rights reserved.",
    bottomContent: (
      <p className="text-xs text-muted-foreground">
        Trading involves risk. Please trade responsibly.
      </p>
    ),
  },
};

export const TradingPlatform: Story = {
  name: "Trading Platform Example",
  render: () => (
    <AppFooter
      variant="dark"
      logo={
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img
              src="/assets/logo/skai-logo-mark.svg"
              alt="Skai"
              className="h-10 w-10"
            />
            <div>
              <p className="text-lg font-medium tracking-tight">
                <span className="text-[#56C7F3]">Skai</span>
                <span className="text-muted-foreground">.trade</span>
              </p>
              <p className="text-xs text-muted-foreground">Trade. Predict. Play.</p>
            </div>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            The next generation trading platform combining DeFi swaps, prediction
            markets, and gamified trading experiences.
          </p>
        </div>
      }
      links={
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          <FooterLinkGroup
            title="Trading"
            links={[
              { label: "Swap", href: "/swap" },
              { label: "Limit Orders", href: "/limit" },
              { label: "Perpetuals", href: "/perps" },
              { label: "Liquidity", href: "/pools" },
            ]}
          />
          <FooterLinkGroup
            title="Gaming"
            links={[
              { label: "HiLo", href: "/play/hilo" },
              { label: "Prize Wheel", href: "/play/wheel" },
              { label: "Mines", href: "/play/mines" },
              { label: "Leaderboard", href: "/leaderboard" },
            ]}
          />
          <FooterLinkGroup
            title="Support"
            links={[
              { label: "Docs", href: "/docs" },
              { label: "FAQ", href: "/faq" },
              { label: "Discord", href: "/discord" },
              { label: "Status", href: "/status" },
            ]}
          />
        </div>
      }
      social={<SocialLinks />}
      copyright="© 2026 Skai.trade. All rights reserved."
      bottomContent={
        <div className="flex flex-col items-center gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>Trading cryptocurrency involves substantial risk of loss.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Cookies
            </a>
          </div>
        </div>
      }
    />
  ),
};

// Figma Design Exact Footer: bg-[#001615], border-[#123F3C]
// Layout: Social icons | Nav items (AI, Chat, Mini games, Wallet) | Connection status | Links (Home, Docs, Privacy, Terms)
export const FigmaDesign: Story = {
  name: "Figma Design (Exact Match)",
  render: () => (
    <div className="w-full bg-[#001615] border border-[#123F3C] px-4 py-1.5">
      <div className="flex items-center justify-between">
        {/* Social Icons */}
        <SocialLinks />

        {/* Nav Items with Icons */}
        <FooterNav />

        {/* Connection Status Badge */}
        <ConnectionStatus />

        {/* Footer Links */}
        <FooterLinks />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="bg-[#001615] p-4">
        <Story />
      </div>
    ),
  ],
};
