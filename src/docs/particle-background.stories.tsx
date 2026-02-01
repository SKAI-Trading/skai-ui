import type { Meta, StoryObj } from "@storybook/react";
import { ParticleBackground } from "../components/particle-background";

const meta: Meta<typeof ParticleBackground> = {
  title: "Decorative/ParticleBackground",
  component: ParticleBackground,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Animated particle background for hero sections and landing pages. Creates a subtle, tech-focused atmosphere.",
      },
    },
  },
  argTypes: {
    particleCount: {
      control: { type: "number", min: 10, max: 200 },
      description: "Number of particles to render (default: 50)",
    },
    color: {
      control: "text",
      description: "RGB color for particles (e.g., '100, 200, 255')",
    },
    speed: {
      control: { type: "number", min: 0.1, max: 3, step: 0.1 },
      description: "Animation speed multiplier (default: 1)",
    },
    enabled: {
      control: "boolean",
      description: "Whether the animation is enabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ParticleBackground>;

/**
 * Default particle background with SKAI brand colors
 */
export const Default: Story = {
  args: {
    particleCount: 50,
    color: "100, 200, 255",
    speed: 1,
    enabled: true,
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-background">
        <Story />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Hero Section</h1>
        </div>
      </div>
    ),
  ],
};

/**
 * Dense particles for dramatic effect
 */
export const Dense: Story = {
  args: {
    particleCount: 150,
    color: "100, 200, 255",
    speed: 0.5,
    enabled: true,
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-background">
        <Story />
      </div>
    ),
  ],
};

/**
 * Sparse particles for subtle background
 */
export const Sparse: Story = {
  args: {
    particleCount: 20,
    color: "100, 200, 255",
    speed: 0.8,
    enabled: true,
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-background">
        <Story />
      </div>
    ),
  ],
};

/**
 * Purple theme for gaming pages
 */
export const GamingTheme: Story = {
  args: {
    particleCount: 60,
    color: "147, 51, 234",
    speed: 1.2,
    enabled: true,
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-background">
        <Story />
      </div>
    ),
  ],
};

/**
 * Teal theme for trading pages
 */
export const TradingTheme: Story = {
  args: {
    particleCount: 40,
    color: "45, 212, 191",
    speed: 1,
    enabled: true,
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-background">
        <Story />
      </div>
    ),
  ],
};
