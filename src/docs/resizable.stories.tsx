import type { Meta, StoryObj } from "@storybook/react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../components/resizable";

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "Layout/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Draggable panels for customizable layouts. Based on react-resizable-panels library.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

/**
 * Horizontal resizable panels
 */
export const Horizontal: Story = {
  render: () => (
    <div className="h-[400px] w-full border rounded-lg overflow-hidden">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="flex h-full items-center justify-center p-6 bg-muted/30">
            <span className="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Main Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Vertical resizable panels
 */
export const Vertical: Story = {
  render: () => (
    <div className="h-[400px] w-full border rounded-lg overflow-hidden">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize={30} minSize={10}>
          <div className="flex h-full items-center justify-center p-6 bg-muted/30">
            <span className="font-semibold">Header</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Complex nested layout
 */
export const NestedLayout: Story = {
  render: () => (
    <div className="h-[500px] w-full border rounded-lg overflow-hidden">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="flex h-full items-center justify-center p-4 bg-muted/30">
            <span className="font-semibold text-sm">Navigation</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={70}>
              <div className="flex h-full items-center justify-center p-4">
                <span className="font-semibold">Main Content</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} minSize={15}>
              <div className="flex h-full items-center justify-center p-4 bg-muted/20">
                <span className="font-semibold text-sm">Terminal</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="flex h-full items-center justify-center p-4 bg-muted/30">
            <span className="font-semibold text-sm">Properties</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Trading layout example
 */
export const TradingLayout: Story = {
  render: () => (
    <div className="h-[500px] w-full border rounded-lg overflow-hidden bg-background">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={65} minSize={40}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={70}>
              <div className="flex h-full items-center justify-center p-4 border-b border-r">
                <div className="text-center">
                  <span className="font-semibold text-lg">📈 Chart</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Price chart goes here
                  </p>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="flex h-full items-center justify-center p-4 border-r">
                <div className="text-center">
                  <span className="font-semibold">📋 Order Book</span>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center">
              <span className="font-semibold text-lg">💱 Trade Panel</span>
              <p className="text-sm text-muted-foreground mt-2">
                Buy/Sell interface
              </p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
