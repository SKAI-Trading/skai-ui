import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../core/textarea";
import { Label } from "../core/label";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the textarea is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here.",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5 max-w-sm">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled textarea",
    disabled: true,
  },
};

export const WithText: Story = {
  render: () => (
    <div className="grid w-full gap-1.5 max-w-sm">
      <Label htmlFor="message-2">Your Message</Label>
      <Textarea placeholder="Type your message here." id="message-2" />
      <p className="text-sm text-muted-foreground">
        Your message will be copied to the support team.
      </p>
    </div>
  ),
};

// Trading-specific examples
export const TokenDescription: Story = {
  name: "Token Description",
  render: () => (
    <div className="grid w-full gap-1.5 max-w-md">
      <Label htmlFor="description">Token Description</Label>
      <Textarea
        id="description"
        placeholder="Describe your token project..."
        className="min-h-[120px]"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Markdown supported</span>
        <span>0 / 500</span>
      </div>
    </div>
  ),
};

export const TradeNotes: Story = {
  name: "Trade Notes",
  render: () => (
    <div className="p-4 border rounded-lg max-w-md space-y-4">
      <h3 className="font-semibold">Add Trade Note</h3>
      <div className="grid gap-1.5">
        <Textarea
          placeholder="Why are you making this trade? Record your strategy..."
          className="min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground">
          Notes are private and help you track your trading decisions
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 text-sm border rounded hover:bg-muted">
          Cancel
        </button>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded">
          Save Note
        </button>
      </div>
    </div>
  ),
};

export const SupportTicket: Story = {
  name: "Support Ticket",
  render: () => (
    <div className="p-4 border rounded-lg max-w-md space-y-4">
      <h3 className="font-semibold">Contact Support</h3>
      <div className="space-y-4">
        <div className="grid gap-1.5">
          <Label htmlFor="subject">Subject</Label>
          <input
            id="subject"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Brief description of your issue"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="details">Details</Label>
          <Textarea
            id="details"
            placeholder="Please describe your issue in detail. Include transaction hashes if applicable..."
            className="min-h-[150px]"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="tx-hash">Transaction Hash (optional)</Label>
          <input
            id="tx-hash"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            placeholder="0x..."
          />
        </div>
      </div>
      <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded">
        Submit Ticket
      </button>
    </div>
  ),
};

export const BioEditor: Story = {
  name: "Profile Bio",
  render: () => (
    <div className="p-4 border rounded-lg max-w-md space-y-4">
      <h3 className="font-semibold">Edit Profile</h3>
      <div className="grid gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          defaultValue="Crypto enthusiast | DeFi degen | Building the future of finance 🚀"
          className="min-h-[80px]"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Visible on your public profile</span>
          <span>65 / 160</span>
        </div>
      </div>
    </div>
  ),
};
