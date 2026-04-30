import type { Meta, StoryObj } from "@storybook/react";
import { Spinner, LoadingOverlay } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "Feedback/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: {
      control: "select",
      options: ["default", "muted", "white", "success", "warning", "error"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: "md" },
};

export const AllSizes: Story = {
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

export const Overlay: Story = {
  render: () => (
    <div className="relative h-40 w-72 rounded border bg-muted/30 p-4">
      <p>Loading content...</p>
      <LoadingOverlay />
    </div>
  ),
};
