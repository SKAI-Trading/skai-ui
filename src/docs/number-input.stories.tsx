import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NumberInput } from "../components/forms/number-input";

const meta: Meta<typeof NumberInput> = {
  title: "Components/NumberInput",
  component: NumberInput,
  tags: ["autodocs", "beta"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    showButtons: {
      control: "boolean",
    },
    buttonPosition: {
      control: "select",
      options: ["sides", "right"],
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

export const ButtonPositions: Story = {
  render: function ButtonPositionsStory() {
    const [v1, setV1] = useState(5);
    const [v2, setV2] = useState(10);
    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Sides (default)</p>
          <NumberInput value={v1} onChange={setV1} buttonPosition="sides" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Right</p>
          <NumberInput value={v2} onChange={setV2} buttonPosition="right" />
        </div>
      </div>
    );
  },
};

export const NoButtons: Story = {
  render: function NoButtonsStory() {
    const [value, setValue] = useState(10);
    return (
      <div className="w-32">
        <NumberInput value={value} onChange={setValue} showButtons={false} />
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
          formatValue={(v) => `$${v.toFixed(2)}`}
        />
      </div>
    );
  },
};

export const WithPercentage: Story = {
  render: function WithPercentageStory() {
    const [value, setValue] = useState(50);
    return (
      <div className="w-48">
        <NumberInput
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          formatValue={(v) => `${v}%`}
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
          formatValue={(v) => v.toFixed(2)}
        />
      </div>
    );
  },
};
