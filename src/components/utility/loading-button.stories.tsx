import type { Meta, StoryObj } from "@storybook/react";
import { LoadingButton } from "./loading-button";

const meta: Meta<typeof LoadingButton> = {
  title: "Utility/LoadingButton",
  component: LoadingButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    spinnerPosition: { control: "select", options: ["left", "right"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Submit" },
};

export const Loading: Story = {
  args: { children: "Submit", loading: true, loadingText: "Submitting..." },
};

export const SpinnerRight: Story = {
  args: {
    children: "Continue",
    loading: true,
    spinnerPosition: "right",
    variant: "outline",
  },
};
