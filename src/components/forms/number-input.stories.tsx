import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NumberInput } from "./number-input";

const meta: Meta<typeof NumberInput> = {
  title: "Forms/NumberInput",
  component: NumberInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = (args: Partial<React.ComponentProps<typeof NumberInput>>) => {
  const [v, setV] = useState(args.value ?? 0);
  return (
    <div className="w-72">
      <NumberInput {...args} value={v} onChange={setV} />
    </div>
  );
};

export const Default: Story = {
  render: () => <Wrapper value={5} step={1} min={0} max={100} />,
};

export const RightButtons: Story = {
  render: () => (
    <Wrapper value={10} step={5} min={0} max={1000} buttonPosition="right" />
  ),
};

export const NoButtons: Story = {
  render: () => <Wrapper value={42} showButtons={false} />,
};
