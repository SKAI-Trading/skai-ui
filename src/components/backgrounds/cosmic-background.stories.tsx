import type { Meta, StoryObj } from "@storybook/react";
import { CosmicBackground } from "./cosmic-background";

/**
 * CosmicBackground - An animated cosmic/space background
 *
 * Features animated stars, floating orbs, aurora waves, rising particles,
 * and a subtle glowing grid. Perfect for immersive landing pages and
 * celebration screens.
 *
 * Each visual layer can be independently toggled on or off.
 */
const meta: Meta<typeof CosmicBackground> = {
  title: "Components/CosmicBackground",
  component: CosmicBackground,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs", "stable"],
  argTypes: {
    showStars: {
      control: "boolean",
      description: "Whether to show the animated stars layers",
    },
    showOrbs: {
      control: "boolean",
      description: "Whether to show the floating gradient orbs",
    },
    showAurora: {
      control: "boolean",
      description: "Whether to show the aurora wave effect",
    },
    showParticles: {
      control: "boolean",
      description: "Whether to show rising particles",
    },
    particleCount: {
      control: { type: "range", min: 0, max: 50, step: 1 },
      description: "Number of particles to render",
    },
    showGrid: {
      control: "boolean",
      description: "Whether to show the glowing grid",
    },
    isBlurred: {
      control: "boolean",
      description: "Whether the background is blurred (e.g., when a modal is open)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the container",
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[400px] relative bg-[#001615] overflow-hidden">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CosmicBackground>;

export const Default: Story = {
  args: {
    showStars: true,
    showOrbs: true,
    showAurora: true,
    showParticles: true,
    particleCount: 10,
    showGrid: true,
    isBlurred: false,
  },
};

export const StarsOnly: Story = {
  args: {
    showStars: true,
    showOrbs: false,
    showAurora: false,
    showParticles: false,
    showGrid: false,
    isBlurred: false,
  },
};

export const OrbsAndAurora: Story = {
  args: {
    showStars: false,
    showOrbs: true,
    showAurora: true,
    showParticles: false,
    showGrid: false,
    isBlurred: false,
  },
};

export const ParticleHeavy: Story = {
  args: {
    showStars: true,
    showOrbs: false,
    showAurora: false,
    showParticles: true,
    particleCount: 40,
    showGrid: false,
    isBlurred: false,
  },
};

export const Blurred: Story = {
  args: {
    showStars: true,
    showOrbs: true,
    showAurora: true,
    showParticles: true,
    particleCount: 10,
    showGrid: true,
    isBlurred: true,
  },
};

export const Minimal: Story = {
  args: {
    showStars: true,
    showOrbs: false,
    showAurora: false,
    showParticles: false,
    showGrid: true,
    isBlurred: false,
  },
};
