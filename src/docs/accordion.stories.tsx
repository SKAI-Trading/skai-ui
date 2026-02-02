import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/layout/accordion";

const meta: Meta<typeof Accordion> = {
  title: "Layout/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A vertically stacked set of interactive headings that each reveal a section of content.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is SKAI?</AccordionTrigger>
        <AccordionContent>
          SKAI is a comprehensive trading platform with AI-powered insights.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I get started?</AccordionTrigger>
        <AccordionContent>
          Connect your wallet and start trading in minutes.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What chains are supported?</AccordionTrigger>
        <AccordionContent>
          We support Ethereum, Base, Arbitrum, Polygon, and Optimism.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const FAQ: Story = {
  name: "FAQ Example",
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="fees">
          <AccordionTrigger>What are the trading fees?</AccordionTrigger>
          <AccordionContent>
            <p>Our fee structure is tiered based on your 30-day trading volume:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Free tier: 0.30%</li>
              <li>Bronze: 0.25%</li>
              <li>Silver: 0.20%</li>
              <li>Gold: 0.15%</li>
              <li>Platinum: 0.10%</li>
              <li>Diamond: 0.05%</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="security">
          <AccordionTrigger>How secure is my wallet?</AccordionTrigger>
          <AccordionContent>
            Your wallet keys never leave your device. We use industry-standard security
            practices and regular audits to ensure your assets are protected.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="support">
          <AccordionTrigger>How do I contact support?</AccordionTrigger>
          <AccordionContent>
            You can reach our support team through the in-app chat, Discord, or email at
            support@skai.trade.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
