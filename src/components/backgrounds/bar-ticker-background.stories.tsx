import type { Meta, StoryObj } from "@storybook/react";
import { BarTickerBackground } from "./bar-ticker-background";
import "../../styles/backgrounds.css";

/**
 * BarTickerBackground - Animated vertical bar background matching Figma design
 *
 * Bar heights are extracted directly from Figma node 2005:4515 (320 vectors
 * per layer). The pattern is mirrored (left half = reversed right half).
 *
 * Features two layers:
 * - BACK layer: Taller bars with stepped heights (volume-chart style)
 * - FRONT layer: Shorter bars with occasional spikes (candlestick wicks)
 *
 * Requires `backgrounds.css` to be imported for animations and bar styling.
 */
const meta: Meta<typeof BarTickerBackground> = {
  title: "Components/BarTickerBackground",
  component: BarTickerBackground,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs", "stable"],
  argTypes: {
    isBlurred: {
      control: "boolean",
      description: "Whether to blur the background (e.g., when a modal is open)",
    },
    showShimmer: {
      control: "boolean",
      description: "Show the shimmer sweep effect (disabled by default to prevent flicker)",
    },
    showDepthBlur: {
      control: "boolean",
      description: "Show the depth blur overlay",
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
type Story = StoryObj<typeof BarTickerBackground>;

export const Default: Story = {
  args: {
    isBlurred: false,
    showShimmer: false,
    showDepthBlur: true,
  },
};

export const WithShimmer: Story = {
  args: {
    isBlurred: false,
    showShimmer: true,
    showDepthBlur: true,
  },
};

export const Blurred: Story = {
  args: {
    isBlurred: true,
    showShimmer: false,
    showDepthBlur: true,
  },
};

export const NoDepthBlur: Story = {
  args: {
    isBlurred: false,
    showShimmer: false,
    showDepthBlur: false,
  },
};

export const AllEffects: Story = {
  args: {
    isBlurred: false,
    showShimmer: true,
    showDepthBlur: true,
  },
};
