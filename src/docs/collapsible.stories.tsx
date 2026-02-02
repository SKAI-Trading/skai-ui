import type { Meta, StoryObj } from "@storybook/react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../components/layout/collapsible";
import { Button } from "../components/core/button";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof Collapsible> = {
  title: "Layout/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An interactive component which expands/collapses a panel. Built on Radix UI Collapsible primitive.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-[350px] space-y-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">@skai/ui has 88 components</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          Button, Card, Input
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            Dialog, Sheet, Popover
          </div>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            Tabs, Accordion, Sidebar
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const DefaultOpen: Story = {
  name: "Default Open",
  render: () => (
    <Collapsible defaultOpen className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">Advanced Options</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 text-sm">
          <p className="font-medium">Slippage Tolerance</p>
          <p className="text-muted-foreground">0.5%</p>
        </div>
        <div className="rounded-md border px-4 py-3 text-sm">
          <p className="font-medium">Transaction Deadline</p>
          <p className="text-muted-foreground">30 minutes</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const SwapSettings: Story = {
  name: "Swap Settings Example",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="max-w-sm rounded-lg border p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Swap</h3>
            <span className="text-sm text-muted-foreground">ETH → USDC</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">You pay</span>
              <span>1.0 ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">You receive</span>
              <span>~2,247.50 USDC</span>
            </div>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                <span>Advanced Settings</span>
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slippage</span>
                <span>0.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price Impact</span>
                <span className="text-green-500">{"<"}0.01%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Network Fee</span>
                <span>~$2.50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Route</span>
                <span>Direct</span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button className="w-full">Confirm Swap</Button>
        </div>
      </div>
    );
  },
};

export const TokenDetails: Story = {
  name: "Token Details Collapsible",
  render: () => (
    <div className="max-w-sm">
      <Collapsible className="rounded-lg border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold">
              ETH
            </div>
            <div>
              <p className="font-semibold">Ethereum</p>
              <p className="text-sm text-muted-foreground">$2,250.00</p>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="space-y-3 border-t bg-muted/30 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">24h Change</span>
              <span className="text-green-500">+5.2%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">24h Volume</span>
              <span>$12.5B</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Market Cap</span>
              <span>$270.4B</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Circulating Supply</span>
              <span>120.2M ETH</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

export const FAQ: Story = {
  name: "FAQ Section",
  render: () => {
    const faqs = [
      {
        q: "What is SKAI Trading?",
        a: "SKAI Trading is a next-generation trading platform that combines DeFi swaps, prediction markets, and gamified trading experiences.",
      },
      {
        q: "How do I connect my wallet?",
        a: "Click the 'Connect Wallet' button and select your preferred wallet provider. We support MetaMask, WalletConnect, Coinbase Wallet, and more.",
      },
      {
        q: "What are trading fees?",
        a: "Trading fees range from 0.05% to 0.30% depending on your 30-day trading volume tier. Higher volume = lower fees.",
      },
    ];

    return (
      <div className="max-w-md space-y-2">
        <h3 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h3>
        {faqs.map((faq, i) => (
          <Collapsible key={i} className="rounded-lg border">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted/50">
              {faq.q}
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 text-sm text-muted-foreground">
              {faq.a}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    );
  },
};
