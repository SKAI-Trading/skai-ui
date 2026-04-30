import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TagInput } from "./tag-input";

const meta: Meta<typeof TagInput> = {
  title: "Forms/TagInput",
  component: TagInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = (args: Partial<React.ComponentProps<typeof TagInput>>) => {
  const [tags, setTags] = useState<string[]>(args.value ?? []);
  return (
    <div className="w-96">
      <TagInput {...args} value={tags} onValueChange={setTags} />
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <Wrapper value={["btc", "eth"]} placeholder="Add a tag and press Enter" />
  ),
};

export const MaxTags: Story = {
  render: () => (
    <Wrapper value={["one", "two"]} maxTags={3} placeholder="Up to 3 tags" />
  ),
};

export const SecondaryVariant: Story = {
  render: () => (
    <Wrapper
      value={["alpha", "beta", "gamma"]}
      tagVariant="secondary"
      placeholder="Add tag..."
    />
  ),
};
