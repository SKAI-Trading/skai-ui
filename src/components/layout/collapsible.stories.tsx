import type { Meta, StoryObj } from "@storybook/react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./collapsible";
import { Button } from "../core/button";

const meta: Meta = {
  title: "Layout/Collapsible",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-72 space-y-2">
      <div className="flex items-center justify-between rounded border p-3">
        <span className="text-sm font-semibold">Advanced settings</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            Toggle
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 rounded border p-3 text-sm">
        <div>Slippage tolerance: 0.5%</div>
        <div>Transaction deadline: 20 min</div>
        <div>Expert mode: off</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-72 space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          Show details
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded border p-3 text-sm">
        These details start expanded by default.
      </CollapsibleContent>
    </Collapsible>
  ),
};
