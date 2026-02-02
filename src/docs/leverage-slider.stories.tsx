import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { LeverageSlider } from "../components/trading/leverage-slider";

const meta: Meta<typeof LeverageSlider> = {
  title: "Trading/LeverageSlider",
  component: LeverageSlider,
  tags: ["autodocs", "beta"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof LeverageSlider>;

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = useState(10);
    return (
      <div className="w-80">
        <LeverageSlider value={value} onChange={setValue} />
      </div>
    );
  },
};

export const LowLeverage: Story = {
  render: function LowLeverageStory() {
    const [value, setValue] = useState(2);
    return (
      <div className="w-80">
        <LeverageSlider value={value} onChange={setValue} />
      </div>
    );
  },
};

export const HighLeverage: Story = {
  render: function HighLeverageStory() {
    const [value, setValue] = useState(75);
    return (
      <div className="w-80">
        <LeverageSlider value={value} onChange={setValue} />
      </div>
    );
  },
};

export const MaxLeverage: Story = {
  render: function MaxLeverageStory() {
    const [value, setValue] = useState(100);
    return (
      <div className="w-80">
        <LeverageSlider value={value} onChange={setValue} />
      </div>
    );
  },
};

export const CustomRange: Story = {
  render: function CustomRangeStory() {
    const [value, setValue] = useState(3);
    return (
      <div className="w-80">
        <LeverageSlider
          value={value}
          onChange={setValue}
          min={1}
          max={20}
          quickSelectValues={[1, 3, 5, 10, 15, 20]}
        />
      </div>
    );
  },
};

export const NoQuickSelect: Story = {
  render: function NoQuickSelectStory() {
    const [value, setValue] = useState(10);
    return (
      <div className="w-80">
        <LeverageSlider
          value={value}
          onChange={setValue}
          showQuickSelect={false}
        />
      </div>
    );
  },
};

export const NoInput: Story = {
  render: function NoInputStory() {
    const [value, setValue] = useState(25);
    return (
      <div className="w-80">
        <LeverageSlider value={value} onChange={setValue} showInput={false} />
      </div>
    );
  },
};

export const NoRiskIndicator: Story = {
  render: function NoRiskIndicatorStory() {
    const [value, setValue] = useState(50);
    return (
      <div className="w-80">
        <LeverageSlider
          value={value}
          onChange={setValue}
          showRiskIndicator={false}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function DisabledStory() {
    const [value, setValue] = useState(10);
    return (
      <div className="w-80">
        <LeverageSlider value={value} onChange={setValue} disabled />
      </div>
    );
  },
};

export const FractionalStep: Story = {
  render: function FractionalStepStory() {
    const [value, setValue] = useState(1.5);
    return (
      <div className="w-80">
        <LeverageSlider
          value={value}
          onChange={setValue}
          min={1}
          max={10}
          step={0.5}
          quickSelectValues={[1, 2, 3, 5, 7.5, 10]}
        />
      </div>
    );
  },
};
