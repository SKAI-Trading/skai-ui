import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PasswordInput } from "./password-input";

const meta: Meta<typeof PasswordInput> = {
  title: "Forms/PasswordInput",
  component: PasswordInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = (args: Partial<React.ComponentProps<typeof PasswordInput>>) => {
  const [v, setV] = useState("");
  return (
    <div className="w-72">
      <PasswordInput
        {...args}
        value={v}
        onChange={(e) => setV(e.target.value)}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Wrapper placeholder="Enter password" />,
};

export const WithStrength: Story = {
  render: () => (
    <Wrapper showStrength placeholder="Enter strong password" />
  ),
};

export const WithError: Story = {
  render: () => (
    <Wrapper error="Password must be at least 8 characters" placeholder="Password" />
  ),
};
