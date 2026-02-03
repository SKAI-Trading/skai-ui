import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { LandingHeader } from "./landing-header";

/**
 * LandingHeader - Simple header for landing/marketing pages
 *
 * A minimal header component designed for the SKAI landing pages.
 * Features Terms/Privacy links on the left and social icons (Discord, Instagram, X) on the right.
 *
 * ## Figma Reference
 * - Design: Skai-Design > Landing > Header Navigation
 *
 * ## Usage
 * ```tsx
 * <LandingHeader
 *   isBlurred={scrollY > 50}
 *   termsUrl="/terms"
 *   privacyUrl="/privacy"
 *   discordUrl="https://discord.gg/skai"
 *   instagramUrl="https://instagram.com/skai.trade"
 *   twitterUrl="https://x.com/SkaiTrade"
 * />
 * ```
 */
const meta: Meta<typeof LandingHeader> = {
  title: "Layout/LandingHeader",
  component: LandingHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#001615" },
        { name: "navy", value: "#020717" },
      ],
    },
  },
  argTypes: {
    isBlurred: {
      control: "boolean",
      description: "Whether to show blur background (for scrolled state)",
    },
    termsUrl: {
      control: "text",
      description: "Terms page URL",
    },
    privacyUrl: {
      control: "text",
      description: "Privacy page URL",
    },
    discordUrl: {
      control: "text",
      description: "Discord URL",
    },
    instagramUrl: {
      control: "text",
      description: "Instagram URL",
    },
    twitterUrl: {
      control: "text",
      description: "Twitter/X URL",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LandingHeader>;

// Wrapper with scrollable content to demonstrate blur effect
const ScrollableWrapper = ({ isBlurred = false }: { isBlurred?: boolean }) => {
  const [scrolled, setScrolled] = useState(isBlurred);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "200vh", background: "#001615" }}>
      <LandingHeader
        isBlurred={scrolled}
        termsUrl="/terms"
        privacyUrl="/privacy"
        discordUrl="https://discord.gg/skai"
        instagramUrl="https://instagram.com/skai.trade"
        twitterUrl="https://x.com/SkaiTrade"
      />

      <div
        style={{
          paddingTop: "200px",
          textAlign: "center",
          color: "#E0E0E0",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        <h1 style={{ color: "#FFFFFF", fontSize: "32px", marginBottom: "16px" }}>
          Scroll down to see blur effect
        </h1>
        <p>The header will show a blur background when scrolled past 50px</p>

        <div style={{ marginTop: "400px" }}>
          <p>Keep scrolling...</p>
        </div>

        <div style={{ marginTop: "400px" }}>
          <p>Almost there...</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Default state - no blur
 */
export const Default: Story = {
  args: {
    isBlurred: false,
    termsUrl: "/terms",
    privacyUrl: "/privacy",
    discordUrl: "https://discord.gg/skai",
    instagramUrl: "https://instagram.com/skai.trade",
    twitterUrl: "https://x.com/SkaiTrade",
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", background: "#001615" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Blurred state - header with backdrop blur
 */
export const Blurred: Story = {
  args: {
    isBlurred: true,
    termsUrl: "/terms",
    privacyUrl: "/privacy",
    discordUrl: "https://discord.gg/skai",
    instagramUrl: "https://instagram.com/skai.trade",
    twitterUrl: "https://x.com/SkaiTrade",
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", background: "#001615" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Interactive scroll demo
 */
export const ScrollDemo: Story = {
  render: () => <ScrollableWrapper />,
  parameters: {
    layout: "fullscreen",
  },
};

/**
 * Without social links
 */
export const NoSocialLinks: Story = {
  args: {
    isBlurred: false,
    termsUrl: "/terms",
    privacyUrl: "/privacy",
    discordUrl: "",
    instagramUrl: "",
    twitterUrl: "",
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", background: "#001615" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  args: {
    isBlurred: false,
    termsUrl: "/terms",
    privacyUrl: "/privacy",
    discordUrl: "https://discord.gg/skai",
    instagramUrl: "https://instagram.com/skai.trade",
    twitterUrl: "https://x.com/SkaiTrade",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", background: "#001615" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  args: {
    isBlurred: false,
    termsUrl: "/terms",
    privacyUrl: "/privacy",
    discordUrl: "https://discord.gg/skai",
    instagramUrl: "https://instagram.com/skai.trade",
    twitterUrl: "https://x.com/SkaiTrade",
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", background: "#001615" }}>
        <Story />
      </div>
    ),
  ],
};
