import type { Meta, StoryObj } from "@storybook/react";
import { Spinner, LoadingOverlay } from "../components/feedback/spinner";
import { Button } from "../components/core/button";

const meta: Meta<typeof Spinner> = {
  title: "Feedback/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["default", "muted", "white", "success", "warning", "error"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {},
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner variant="default" />
      <Spinner variant="muted" />
      <div className="bg-primary p-2 rounded">
        <Spinner variant="white" />
      </div>
      <Spinner variant="success" />
      <Spinner variant="warning" />
      <Spinner variant="error" />
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    label: "Processing your request...",
    size: "lg",
  },
};

// LoadingOverlay stories
export const Overlay: Story = {
  render: () => (
    <LoadingOverlay loading text="Loading content...">
      <div className="w-64 h-32 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Content behind overlay</p>
      </div>
    </LoadingOverlay>
  ),
};

export const OverlayNotLoading: Story = {
  render: () => (
    <LoadingOverlay loading={false}>
      <div className="w-64 h-32 bg-muted rounded-lg flex items-center justify-center">
        <p>Visible content</p>
      </div>
    </LoadingOverlay>
  ),
};

export const InButton: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button disabled>
        <Spinner size="xs" variant="white" className="mr-2" />
        Loading...
      </Button>
      <Button variant="outline" disabled>
        <Spinner size="xs" className="mr-2" />
        Processing
      </Button>
    </div>
  ),
};
