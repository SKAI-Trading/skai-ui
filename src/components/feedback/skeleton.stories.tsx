import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../feedback/skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[250px]" />,
};

export const Circle: Story = {
  render: () => <Skeleton className="h-12 w-12 rounded-full" />,
};

export const Card: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

// Trading-specific examples
export const TokenCardSkeleton: Story = {
  name: "Token Card Loading",
  render: () => (
    <div className="p-4 border rounded-lg max-w-sm space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16 ml-auto" />
        </div>
      </div>
    </div>
  ),
};

export const PortfolioSkeleton: Story = {
  name: "Portfolio Loading",
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="p-6 border rounded-lg space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 border rounded-lg"
          >
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-14 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const SwapFormSkeleton: Story = {
  name: "Swap Form Loading",
  render: () => (
    <div className="p-4 border rounded-lg max-w-sm space-y-4">
      <Skeleton className="h-6 w-24" />
      <div className="p-4 bg-muted/50 rounded-lg space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="p-4 bg-muted/50 rounded-lg space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  ),
};

export const TableSkeleton: Story = {
  name: "Table Loading",
  render: () => (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20 ml-auto" />
        </div>
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 border-b">
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const ChartSkeleton: Story = {
  name: "Chart Loading",
  render: () => (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
      <Skeleton className="h-[300px] w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  ),
};
