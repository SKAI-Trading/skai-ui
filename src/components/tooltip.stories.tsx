import type { Meta, StoryObj } from "@storybook/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Button } from "./button";
import {
  Info,
  HelpCircle,
  Copy,
  Settings,
  AlertCircle,
  Eye,
} from "lucide-react";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A tooltip component for displaying additional information on hover.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span>Slippage Tolerance</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p>The maximum price movement you're willing to accept</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex gap-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Top
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Right
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Bottom
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Left
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Trading-specific tooltips
export const GasFeeTooltip: Story = {
  render: () => (
    <div className="flex items-center justify-between w-[300px] p-3 bg-muted rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm">Network Fee</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[250px]">
            <p>
              Network fees are paid to validators to process your transaction.
              Fees vary based on network congestion.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <span className="text-sm font-medium">~$2.50</span>
    </div>
  ),
};

export const CopyAddressTooltip: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Copy className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy to clipboard</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const IconButtonTooltips: Story = {
  render: () => (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View details</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy address</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const WarningTooltip: Story = {
  render: () => (
    <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertCircle className="h-5 w-5 text-yellow-500 cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px]">
          <p className="font-medium text-yellow-500 mb-1">
            High Slippage Warning
          </p>
          <p className="text-sm">
            Your trade may experience significant price impact due to low
            liquidity. Consider reducing your trade size.
          </p>
        </TooltipContent>
      </Tooltip>
      <span className="text-sm text-yellow-500">Price impact: 4.5%</span>
    </div>
  ),
};

export const TokenInfoTooltip: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
        B
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Bitcoin</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <div className="space-y-2">
                <p className="font-medium">Bitcoin (BTC)</p>
                <p className="text-sm text-muted-foreground">
                  The first and most widely recognized cryptocurrency, created
                  by Satoshi Nakamoto in 2009.
                </p>
                <div className="text-xs text-muted-foreground">
                  <p>Market Cap: $1.32T</p>
                  <p>24h Volume: $32.5B</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="text-sm text-muted-foreground">BTC</span>
      </div>
    </div>
  ),
};
