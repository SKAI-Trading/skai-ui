import type { Meta, StoryObj } from "@storybook/react";
import { BouncingDots } from "./bouncing-dots";

const meta: Meta<typeof BouncingDots> = {
  title: "Feedback/BouncingDots",
  component: BouncingDots,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: "md" },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <BouncingDots size="sm" />
      <BouncingDots size="md" />
      <BouncingDots size="lg" />
    </div>
  ),
};
