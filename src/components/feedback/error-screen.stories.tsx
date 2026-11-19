import type { Meta, StoryObj } from "@storybook/react";
import { ErrorScreen } from "./error-screen";

const meta: Meta<typeof ErrorScreen> = {
  title: "Feedback/ErrorScreen",
  component: ErrorScreen,
  parameters: { layout: "fullscreen" },
  args: { autoFocus: false },
};
export default meta;

type Story = StoryObj<typeof ErrorScreen>;

export const Crash: Story = {
  args: { variant: "crash", detail: "Cannot read properties of undefined (reading 'map')" },
};

export const NotFound: Story = { args: { variant: "not-found", detail: "/tarde" } };

export const Wallet: Story = {
  args: {
    variant: "wallet",
    primaryAction: { label: "Try again" },
    secondaryAction: { label: "Reload" },
  },
};

export const Offline: Story = { args: { variant: "offline" } };

export const Reload: Story = { args: { variant: "reload" } };

// Inside a shell: the header stays up and the screen fills the content slot.
export const Inline: Story = {
  render: (args) => (
    <div style={{ background: "#001615", minHeight: 640 }}>
      <ErrorScreen {...args} layout="inline" />
    </div>
  ),
};
