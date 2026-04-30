import type { Meta, StoryObj } from "@storybook/react";
import { H1, H2, H3, H4, P, Small, Price, Code } from "./typography";

const meta: Meta = {
  title: "Core/Typography",
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Headings: Story = {
  render: () => (
    <div className="space-y-2">
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <div className="space-y-2">
      <P>Standard paragraph text for body copy.</P>
      <Small>Smaller helper text or captions.</Small>
    </div>
  ),
};

export const TradingTypography: Story = {
  render: () => (
    <div className="space-y-2">
      <Price>$42,850.12</Price>
      <Code>0x1234...abcd</Code>
    </div>
  ),
};
