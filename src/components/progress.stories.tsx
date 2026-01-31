import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A progress bar component for displaying completion status.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 60,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Progress {...args} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-[400px]">
      <Progress value={0} />
    </div>
  ),
};

export const Complete: Story = {
  render: () => (
    <div className="w-[400px]">
      <Progress value={100} />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <div className="flex justify-between text-sm">
        <span>Upload Progress</span>
        <span>60%</span>
      </div>
      <Progress value={60} />
    </div>
  ),
};

// Trading-specific progress
export const SwapProgress: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Confirming transaction...</span>
          <span className="text-muted-foreground">Step 2 of 3</span>
        </div>
        <Progress value={66} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="text-green-500">✓ Approved</span>
        <span className="text-primary font-medium">Processing...</span>
        <span>Complete</span>
      </div>
    </div>
  ),
};

export const VolumeProgress: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Monthly Volume</CardTitle>
          <Badge variant="outline">Silver Tier</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">$45,000 / $100,000</span>
          <span className="font-medium">45%</span>
        </div>
        <Progress value={45} />
        <p className="text-xs text-muted-foreground">
          Trade $55,000 more to reach Gold tier
        </p>
      </CardContent>
    </Card>
  ),
};

export const StakingProgress: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Staking Unlock</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">15 days remaining</span>
          <span className="font-medium">50%</span>
        </div>
        <Progress value={50} />
        <p className="text-xs text-muted-foreground">
          Your 1,000 SKAI tokens will unlock on March 15, 2025
        </p>
      </CardContent>
    </Card>
  ),
};

export const QuestProgress: Story = {
  render: () => (
    <div className="w-[350px] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Daily Quests</h3>
        <Badge>3/5 Complete</Badge>
      </div>
      <Progress value={60} className="h-3" />
      <p className="text-sm text-muted-foreground">
        Complete 2 more quests to claim your daily reward
      </p>
    </div>
  ),
};

export const TierProgressBars: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      {[
        { tier: "Free", color: "bg-gray-500", progress: 100, volume: "$1,234" },
        { tier: "Bronze", color: "bg-green-500", progress: 80, volume: "$8,000" },
        { tier: "Silver", color: "bg-gray-300", progress: 45, volume: "$45,000" },
        { tier: "Gold", color: "bg-yellow-500", progress: 0, volume: "$0" },
        { tier: "Platinum", color: "bg-blue-400", progress: 0, volume: "$0" },
        { tier: "Diamond", color: "bg-purple-500", progress: 0, volume: "$0" },
      ].map((item) => (
        <div key={item.tier} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className={item.progress > 0 ? "" : "text-muted-foreground"}>{item.tier}</span>
            <span className="text-muted-foreground">{item.volume}</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full ${item.color} rounded-full transition-all`}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const TransactionSteps: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div className="text-center">
        <h3 className="font-medium mb-2">Transaction in Progress</h3>
        <Progress value={66} className="h-2" />
      </div>
      <div className="flex justify-between">
        {[
          { step: "Approve", status: "complete" },
          { step: "Confirm", status: "active" },
          { step: "Complete", status: "pending" },
        ].map((item, index) => (
          <div key={item.step} className="flex flex-col items-center gap-2">
            <div 
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                item.status === "complete" ? "bg-green-500 text-white" :
                item.status === "active" ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              }`}
            >
              {item.status === "complete" ? "✓" : index + 1}
            </div>
            <span className={`text-xs ${
              item.status === "pending" ? "text-muted-foreground" : ""
            }`}>
              {item.step}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
