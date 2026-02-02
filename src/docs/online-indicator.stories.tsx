import type { Meta, StoryObj } from "@storybook/react";
import { OnlineIndicator } from "../components/utility/online-indicator";

const meta: Meta<typeof OnlineIndicator> = {
  title: "Display/OnlineIndicator",
  component: OnlineIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A visual indicator showing online/offline status. Used in chat, social features, and user profiles.",
      },
    },
  },
  argTypes: {
    isOnline: {
      control: "boolean",
      description: "Whether the user/entity is online",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Size of the indicator dot",
    },
    absolute: {
      control: "boolean",
      description: "Position absolutely in corner of parent",
    },
    hideWhenOffline: {
      control: "boolean",
      description: "Hide when offline instead of showing gray dot",
    },
  },
};

export default meta;
type Story = StoryObj<typeof OnlineIndicator>;

/**
 * Online status (green dot)
 */
export const Online: Story = {
  args: {
    isOnline: true,
    size: "md",
  },
};

/**
 * Offline status (gray dot)
 */
export const Offline: Story = {
  args: {
    isOnline: false,
    size: "md",
  },
};

/**
 * Small size - for compact UI
 */
export const SmallSize: Story = {
  args: {
    isOnline: true,
    size: "sm",
  },
};

/**
 * Large size - for profile pages
 */
export const LargeSize: Story = {
  args: {
    isOnline: true,
    size: "lg",
  },
};

/**
 * Hide when offline
 */
export const HideWhenOffline: Story = {
  args: {
    isOnline: false,
    size: "md",
    hideWhenOffline: true,
  },
};

/**
 * In context - User avatar with status
 */
export const InContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-lg border">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400" />
          <div className="absolute -bottom-0.5 -right-0.5">
            <OnlineIndicator isOnline={true} size="sm" />
          </div>
        </div>
        <div>
          <p className="font-medium">Alice.eth</p>
          <p className="text-sm text-muted-foreground">Last seen now</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg border">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
          <div className="absolute -bottom-0.5 -right-0.5">
            <OnlineIndicator isOnline={false} size="sm" />
          </div>
        </div>
        <div>
          <p className="font-medium">Bob.eth</p>
          <p className="text-sm text-muted-foreground">Last seen 2h ago</p>
        </div>
      </div>
    </div>
  ),
};
