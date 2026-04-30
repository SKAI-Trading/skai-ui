import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState, NoResults, OfflineState } from "./empty-state";
import { Button } from "../core/button";

const meta: Meta<typeof EmptyState> = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "No items yet",
    description: "Your list is empty. Add some items to get started.",
  },
};

export const WithAction: Story = {
  args: {
    title: "No transactions",
    description: "You haven't made any trades yet.",
    action: <Button>Start Trading</Button>,
  },
};

export const NoResultsPreset: Story = {
  render: () => <NoResults />,
};

export const OfflinePreset: Story = {
  render: () => <OfflineState />,
};
