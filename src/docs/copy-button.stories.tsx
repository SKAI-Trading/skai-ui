import type { Meta, StoryObj } from "@storybook/react";
import { CopyButton } from "../components/utility/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";

const meta: Meta<typeof CopyButton> = {
  title: "Utility/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A button that copies text to the clipboard with visual feedback.",
      },
    },
  },
  argTypes: {
    value: {
      description: "The text to copy to clipboard",
      control: "text",
    },
    showLabel: {
      description: "Show text label alongside icon",
      control: "boolean",
    },
    successDuration: {
      description: "How long to show success state (ms)",
      control: { type: "number", min: 500, max: 5000, step: 500 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    value: "Hello, World!",
  },
};

export const WithLabel: Story = {
  args: {
    value: "0x1234567890abcdef1234567890abcdef12345678",
    showLabel: true,
  },
};

export const CustomLabels: Story = {
  args: {
    value: "custom text",
    showLabel: true,
    labels: {
      copy: "Copy Address",
      copied: "Address Copied!",
    },
  },
};

export const WalletAddress: Story = {
  name: "Wallet Address Example",
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Wallet Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 rounded-md bg-muted p-2">
          <code className="flex-1 truncate text-sm">
            0x1234567890abcdef1234567890abcdef12345678
          </code>
          <CopyButton
            value="0x1234567890abcdef1234567890abcdef12345678"
            onCopySuccess={() => console.log("Address copied!")}
          />
        </div>
      </CardContent>
    </Card>
  ),
};

export const MultipleItems: Story = {
  name: "Multiple Copyable Items",
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-md bg-muted p-2">
          <div>
            <p className="text-xs text-muted-foreground">Public Key</p>
            <code className="text-sm">pk_live_abc123xyz</code>
          </div>
          <CopyButton value="pk_live_abc123xyz" />
        </div>
        <div className="flex items-center justify-between rounded-md bg-muted p-2">
          <div>
            <p className="text-xs text-muted-foreground">Secret Key</p>
            <code className="text-sm">sk_live_***********</code>
          </div>
          <CopyButton value="sk_live_secretkey123" />
        </div>
      </CardContent>
    </Card>
  ),
};

export const CodeBlock: Story = {
  name: "Code Block with Copy",
  render: () => (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-zinc-100">
        <code>{`import { Button } from "@skai/ui";

export function MyComponent() {
  return <Button>Click me</Button>;
}`}</code>
      </pre>
      <div className="absolute right-2 top-2">
        <CopyButton
          value={`import { Button } from "@skai/ui";

export function MyComponent() {
  return <Button>Click me</Button>;
}`}
          className="text-zinc-400 hover:text-zinc-100"
        />
      </div>
    </div>
  ),
};

export const WithCallback: Story = {
  name: "With Success Callback",
  render: () => (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Check the console when you copy</p>
      <CopyButton
        value="Callback test"
        showLabel
        onCopySuccess={(value) => console.log(`Copied: ${value}`)}
        onCopyError={(error) => console.error(`Error: ${error.message}`)}
      />
    </div>
  ),
};

export const DifferentSizes: Story = {
  name: "Different Sizes",
  render: () => (
    <div className="flex items-center gap-4">
      <CopyButton value="small" size="sm" />
      <CopyButton value="default" size="default" />
      <CopyButton value="large" size="lg" />
    </div>
  ),
};

export const DifferentVariants: Story = {
  name: "Different Variants",
  render: () => (
    <div className="flex items-center gap-4">
      <CopyButton value="ghost" variant="ghost" showLabel />
      <CopyButton value="outline" variant="outline" showLabel />
      <CopyButton value="secondary" variant="secondary" showLabel />
    </div>
  ),
};
