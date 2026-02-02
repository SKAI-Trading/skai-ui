import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../core/input";
import { Label } from "../core/label";
import { Button } from "../core/button";
import { Search, Mail, Eye, EyeOff, DollarSign, Percent } from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible input component for text, numbers, and other data entry.",
      },
    },
  },
  tags: ["autodocs", "stable"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "trader@skai.trade",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "••••••••",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "0.00",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" type="email" placeholder="trader@skai.trade" />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="relative w-[300px]">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder="Search tokens..." className="pl-10" />
    </div>
  ),
};

export const WithRightIcon: Story = {
  render: () => (
    <div className="relative w-[300px]">
      <Input placeholder="Email" className="pr-10" />
      <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  ),
};

// Password with toggle
export const PasswordWithToggle: Story = {
  render: function Render() {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="w-[300px] space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  },
};

// Trading-specific inputs
export const AmountInput: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label>Amount (USD)</Label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="number" placeholder="0.00" className="pl-10" />
      </div>
    </div>
  ),
};

export const SlippageInput: Story = {
  render: () => (
    <div className="w-[200px] space-y-2">
      <Label>Slippage Tolerance</Label>
      <div className="relative">
        <Input type="number" placeholder="0.5" className="pr-8" step="0.1" />
        <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  ),
};

export const TokenAmountInput: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <div className="flex justify-between">
        <Label>You Pay</Label>
        <span className="text-xs text-muted-foreground">Balance: 1,234.56 USDC</span>
      </div>
      <div className="flex gap-2">
        <Input type="number" placeholder="0.00" className="flex-1" />
        <Button variant="outline" className="w-24">
          USDC
        </Button>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>≈ $1,234.56</span>
        <button className="text-primary hover:underline">MAX</button>
      </div>
    </div>
  ),
};

export const SearchTokens: Story = {
  render: () => (
    <div className="w-[350px] space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or paste address" className="pl-10" />
      </div>
      <div className="text-xs text-muted-foreground">Popular: BTC, ETH, SOL, USDC</div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="w-[350px] space-y-4">
      <div className="space-y-2">
        <Label htmlFor="wallet">Wallet Address</Label>
        <Input id="wallet" placeholder="0x..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" placeholder="0.00" />
      </div>
      <Button type="submit" className="w-full">
        Confirm Transfer
      </Button>
    </form>
  ),
};
