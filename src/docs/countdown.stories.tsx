import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Countdown } from "../components/countdown";
import { Button } from "../components/button";
import { Card } from "../components/card";

const meta: Meta<typeof Countdown> = {
  title: "Data Display/Countdown",
  component: Countdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["default", "muted", "urgent", "success"],
    },
    format: {
      control: "select",
      options: ["full", "short", "minimal", "boxes"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Countdown>;

export const Default: Story = {
  args: {
    target: 3661, // 1 hour, 1 minute, 1 second
  },
};

export const ShortFormat: Story = {
  args: {
    target: 3661,
    format: "short",
  },
};

export const MinimalFormat: Story = {
  args: {
    target: 125, // 2 minutes 5 seconds
    format: "minimal",
  },
};

export const BoxFormat: Story = {
  args: {
    target: 90061, // 1 day + 1 hour + 1 second
    format: "boxes",
  },
};

export const WithLabel: Story = {
  args: {
    target: 600,
    label: "Sale ends in:",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <Countdown target={3600} size="sm" />
      <Countdown target={3600} size="md" />
      <Countdown target={3600} size="lg" />
      <Countdown target={3600} size="xl" />
    </div>
  ),
};

export const UrgentThreshold: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <span className="text-sm text-muted-foreground">
        Normal (2 minutes left)
      </span>
      <Countdown target={120} />
      <span className="text-sm text-muted-foreground">
        Urgent (30 seconds left)
      </span>
      <Countdown target={30} />
    </div>
  ),
};

export const Completed: Story = {
  args: {
    target: 0,
    completeText: "Time's up!",
  },
};

export const CustomCompleteText: Story = {
  args: {
    target: 0,
    completeText: "🎉 Launch Complete!",
  },
};

export const DateTarget: Story = {
  args: {
    target: new Date(Date.now() + 86400000), // Tomorrow
    format: "full",
    label: "Event starts in:",
  },
};

export const BoxFormatSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Countdown target={90061} format="boxes" size="sm" />
      <Countdown target={90061} format="boxes" size="md" />
      <Countdown target={90061} format="boxes" size="lg" />
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <Card className="p-6 text-center space-y-4">
      <h3 className="text-lg font-semibold">Flash Sale</h3>
      <Countdown target={7261} format="boxes" size="lg" />
      <p className="text-sm text-muted-foreground">Don't miss out!</p>
      <Button className="w-full">Shop Now</Button>
    </Card>
  ),
};

export const Interactive: Story = {
  render: function InteractiveCountdown() {
    const [key, setKey] = useState(0);
    const [seconds, setSeconds] = useState(60);

    return (
      <div className="space-y-4 text-center">
        <Countdown
          key={key}
          target={seconds}
          format="boxes"
          onComplete={() => alert("Countdown complete!")}
        />
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSeconds(60);
              setKey((k) => k + 1);
            }}
          >
            1 min
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSeconds(300);
              setKey((k) => k + 1);
            }}
          >
            5 min
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSeconds(3600);
              setKey((k) => k + 1);
            }}
          >
            1 hour
          </Button>
        </div>
      </div>
    );
  },
};
