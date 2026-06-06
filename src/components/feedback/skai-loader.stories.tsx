import type { Meta, StoryObj } from "@storybook/react";
import { SkaiLoader } from "./skai-loader";

const meta: Meta<typeof SkaiLoader> = {
  title: "Feedback/SkaiLoader",
  component: SkaiLoader,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SkaiLoader>;

// Default (content-area) mode needs a positioned, sized parent.
export const Default: Story = {
  render: () => (
    <div style={{ position: "relative", height: 480 }}>
      <SkaiLoader />
    </div>
  ),
};

export const WithMessage: Story = {
  render: () => (
    <div style={{ position: "relative", height: 480 }}>
      <SkaiLoader message="Loading markets" />
    </div>
  ),
};

export const MediumBolt: Story = {
  render: () => (
    <div style={{ position: "relative", height: 480 }}>
      <SkaiLoader size="md" />
    </div>
  ),
};

export const FullScreen: Story = {
  render: () => <SkaiLoader fullScreen />,
};
