import type { Meta, StoryObj } from "@storybook/react";
import {
  AppFooter,
  FooterLinkGroup,
  FooterSocialLink,
} from "../components/layout/app-footer";
import { Twitter, Github, MessageCircle, Mail } from "lucide-react";

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

const SocialLinks = () => (
  <div className="flex items-center gap-4">
    <FooterSocialLink
      platform="Twitter"
      icon={<Twitter className="h-5 w-5" />}
      href="#"
    />
    <FooterSocialLink
      platform="Discord"
      icon={<MessageCircle className="h-5 w-5" />}
      href="#"
    />
    <FooterSocialLink
      platform="GitHub"
      icon={<Github className="h-5 w-5" />}
      href="#"
    />
    <FooterSocialLink platform="Email" icon={<Mail className="h-5 w-5" />} href="#" />
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
