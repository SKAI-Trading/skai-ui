import type { Meta, StoryObj } from "@storybook/react";
import { LoadingButton } from "../components/utility/loading-button";

const meta: Meta<typeof LoadingButton> = {
  title: "Components/LoadingButton",
  component: LoadingButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A button with integrated loading spinner. Automatically disables and shows spinner when loading.",
      },
    },
  },
  tags: ["autodocs", "stable"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Whether the button is in loading state",
    },
    loadingText: {
      control: "text",
      description: "Text to show while loading (optional)",
    },
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "Button variant",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "Button size",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Submit",
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    children: "Submit",
    loading: true,
  },
};

export const WithLoadingText: Story = {
  args: {
    children: "Swap Tokens",
    loading: true,
    loadingText: "Swapping...",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <LoadingButton variant="default" loading>
        Default
      </LoadingButton>
      <LoadingButton variant="destructive" loading>
        Destructive
      </LoadingButton>
      <LoadingButton variant="outline" loading>
        Outline
      </LoadingButton>
      <LoadingButton variant="secondary" loading>
        Secondary
      </LoadingButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <LoadingButton size="sm" loading>
        Small
      </LoadingButton>
      <LoadingButton size="default" loading>
        Default
      </LoadingButton>
      <LoadingButton size="lg" loading>
        Large
      </LoadingButton>
    </div>
  ),
};

export const InteractiveDemo: Story = {
  render: function Render() {
    const [loading, setLoading] = React.useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <LoadingButton
        loading={loading}
        loadingText="Processing..."
        onClick={handleClick}
      >
        Click to Load
      </LoadingButton>
    );
  },
};

import * as React from "react";
