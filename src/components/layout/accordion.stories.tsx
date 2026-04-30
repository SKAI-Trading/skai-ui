import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";

const meta: Meta = {
  title: "Layout/Accordion",
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is SKAI?</AccordionTrigger>
        <AccordionContent>
          SKAI is a sovereign L1 chain built for trading and prediction markets.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do fees work?</AccordionTrigger>
        <AccordionContent>
          Maker/taker fees scale by tier; higher tiers get larger discounts.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is the source code open?</AccordionTrigger>
        <AccordionContent>
          Yes — the chain, UI, and core contracts are all in public submodules.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-96">
      <AccordionItem value="a">
        <AccordionTrigger>First section</AccordionTrigger>
        <AccordionContent>Multiple sections can stay open at once.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second section</AccordionTrigger>
        <AccordionContent>Try opening both panels simultaneously.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
