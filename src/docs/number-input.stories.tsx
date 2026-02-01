import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NumberInput } from "../components/number-input";

const meta: Meta<typeof NumberInput> = {
  title: "Form/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = useState(10);
    return (
      <div className="w-48">
        <NumberInput value={value} onChange={setValue} />
      </div>
    );
  },
};

export const WithMinMax: Story = {
  render: function WithMinMaxStory() {
    const [value, setValue] = useState(5);
    return (
      <div className="w-48">
        <NumberInput value={value} onChange={setValue} min={0} max={10} />
        <p className="text-sm text-muted-foreground mt-2">Range: 0-10</p>
      </div>
    );
  },
};

export const CustomStep: Story = {
  render: function CustomStepStory() {
    const [value, setValue] = useState(0);
    return (
      <div className="w-48">
        <NumberInput value={value} onChange={setValue} step={0.5} />
        <p className="text-sm text-muted-foreground mt-2">Step: 0.5</p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: function SizesStory() {
    const [v1, setV1] = useState(5);
    const [v2, setV2] = useState(10);
    const [v3, setV3] = useState(15);
    return (
      <div className="flex flex-col gap-4">
        <NumberInput value={v1} onChange={setV1} size="sm" />
        <NumberInput value={v2} onChange={setV2} size="md" />
        <NumberInput value={v3} onChange={setV3} size="lg" />
      </div>
    );
  },
};

export const NoControls: Story = {
  render: function NoControlsStory() {
    const [value, setValue] = useState(10);
    return (
      <div className="w-32">
        <NumberInput value={value} onChange={setValue} showControls={false} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <div className="w-48">
        <NumberInput value={25} onChange={() => {}} disabled />
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: function WithLabelStory() {
    const [value, setValue] = useState(3);
    return (
      <div className="w-48 space-y-2">
        <label className="text-sm font-medium">Quantity</label>
        <NumberInput value={value} onChange={setValue} min={1} max={99} />
      </div>
    );
  },
};

export const Currency: Story = {
  render: function CurrencyStory() {
    const [value, setValue] = useState(100);
    return (
      <div className="w-48">
        <NumberInput
          value={value}
          onChange={setValue}
          min={0}
          step={10}
          prefix="$"
        />
      </div>
    );
  },
};

export const WithSuffix: Story = {
  render: function WithSuffixStory() {
    const [value, setValue] = useState(50);
    return (
      <div className="w-48">
        <NumberInput
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          suffix="%"
        />
      </div>
    );
  },
};

export const Decimals: Story = {
  render: function DecimalsStory() {
    const [value, setValue] = useState(1.25);
    return (
      <div className="w-48">
        <NumberInput
          value={value}
          onChange={setValue}
          step={0.01}
          decimals={2}
        />
      </div>
    );
  },
};
