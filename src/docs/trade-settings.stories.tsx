import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  SlippageSelector,
  DeadlineSelector,
} from "../components/trading/trade-settings";
import { Card } from "../components/core/card";

const meta: Meta<typeof SlippageSelector> = {
  title: "Trading/TradeSettings",
  component: SlippageSelector,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SlippageSelector>;

export const DefaultSlippage: Story = {
  render: function DefaultSlippageStory() {
    const [slippage, setSlippage] = useState(0.5);
    return (
      <div className="w-72">
        <SlippageSelector value={slippage} onChange={setSlippage} />
      </div>
    );
  },
};

export const HighSlippage: Story = {
  render: function HighSlippageStory() {
    const [slippage, setSlippage] = useState(3);
    return (
      <div className="w-72">
        <SlippageSelector value={slippage} onChange={setSlippage} />
      </div>
    );
  },
};

export const VeryHighSlippage: Story = {
  render: function VeryHighSlippageStory() {
    const [slippage, setSlippage] = useState(10);
    return (
      <div className="w-72">
        <SlippageSelector value={slippage} onChange={setSlippage} />
      </div>
    );
  },
};

export const CompactSlippage: Story = {
  render: function CompactSlippageStory() {
    const [slippage, setSlippage] = useState(0.5);
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">Slippage:</span>
        <SlippageSelector value={slippage} onChange={setSlippage} compact />
      </div>
    );
  },
};

export const CustomPresets: Story = {
  render: function CustomPresetsStory() {
    const [slippage, setSlippage] = useState(0.5);
    return (
      <div className="w-72">
        <SlippageSelector
          value={slippage}
          onChange={setSlippage}
          presets={[0.1, 0.3, 0.5, 1.0, 2.0]}
        />
      </div>
    );
  },
};

// Deadline Selector stories
export const DefaultDeadline: Story = {
  render: function DefaultDeadlineStory() {
    const [deadline, setDeadline] = useState(20);
    return (
      <div className="w-72">
        <DeadlineSelector value={deadline} onChange={setDeadline} />
      </div>
    );
  },
};

export const CompactDeadline: Story = {
  render: function CompactDeadlineStory() {
    const [deadline, setDeadline] = useState(30);
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">Deadline:</span>
        <DeadlineSelector value={deadline} onChange={setDeadline} compact />
      </div>
    );
  },
};

// Combined settings
export const CombinedSettings: Story = {
  render: function CombinedSettingsStory() {
    const [slippage, setSlippage] = useState(0.5);
    const [deadline, setDeadline] = useState(20);

    return (
      <Card className="w-80 p-4 space-y-6">
        <h3 className="font-semibold">Transaction Settings</h3>
        <SlippageSelector value={slippage} onChange={setSlippage} />
        <DeadlineSelector value={deadline} onChange={setDeadline} />
      </Card>
    );
  },
};

export const CompactHeader: Story = {
  render: function CompactHeaderStory() {
    const [slippage, setSlippage] = useState(0.5);
    const [deadline, setDeadline] = useState(20);

    return (
      <div className="flex items-center justify-end gap-1 text-muted-foreground">
        <SlippageSelector value={slippage} onChange={setSlippage} compact />
        <span className="text-xs">•</span>
        <DeadlineSelector value={deadline} onChange={setDeadline} compact />
      </div>
    );
  },
};
