import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchInput } from "./search-input";

const meta: Meta<typeof SearchInput> = {
  title: "Forms/SearchInput",
  component: SearchInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "default", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = (args: Partial<React.ComponentProps<typeof SearchInput>>) => {
  const [v, setV] = useState("");
  return (
    <div className="w-72">
      <SearchInput
        {...args}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onClear={() => setV("")}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Wrapper placeholder="Search tokens..." />,
};

export const Loading: Story = {
  render: () => <Wrapper isLoading placeholder="Searching..." />,
};

export const Large: Story = {
  render: () => <Wrapper size="lg" placeholder="Search markets" />,
};
