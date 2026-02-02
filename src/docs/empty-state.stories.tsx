import type { Meta, StoryObj } from "@storybook/react";
import {
  EmptyState,
  NoResults,
  NoData,
  OfflineState,
} from "../components/feedback/empty-state";
import { Button } from "../components/core/button";
import { PlusIcon, RefreshCwIcon } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs", "stable"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    icon: {
      control: "select",
      options: ["default", "search", "file", "error", "offline"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "No items found",
    description: "Get started by creating your first item",
  },
};

export const WithAction: Story = {
  args: {
    title: "No items yet",
    description: "Create your first item to get started",
    action: (
      <Button size="sm">
        <PlusIcon className="h-4 w-4 mr-1" />
        Add Item
      </Button>
    ),
  },
};

export const SearchEmpty: Story = {
  render: () => (
    <NoResults
      description="Try adjusting your search or filters"
      action={
        <Button variant="outline" size="sm">
          Clear filters
        </Button>
      }
    />
  ),
};

export const NoDataState: Story = {
  render: () => (
    <NoData
      description="There's no data to display at the moment"
      action={
        <Button variant="outline" size="sm">
          <RefreshCwIcon className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      }
    />
  ),
};

export const Offline: Story = {
  render: () => (
    <OfflineState
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      }
    />
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <EmptyState size="sm" title="Small" description="Compact empty state" />
      <EmptyState size="md" title="Medium" description="Default size" />
      <EmptyState size="lg" title="Large" description="For full-page states" />
    </div>
  ),
};

export const NoIcon: Story = {
  args: {
    title: "All done!",
    description: "You've completed all your tasks",
    hideIcon: true,
  },
};
