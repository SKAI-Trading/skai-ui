import type { Meta, StoryObj } from "@storybook/react";
import { Input, SkaiInput } from "../core/input";
import { Label } from "../core/label";
import { Button } from "../core/button";
import { Search, Mail, Eye, EyeOff, DollarSign, Percent } from "lucide-react";
import { useState } from "react";

/**
 * Input Component - ShadCN Base + SKAI Branded Variants
 *
 * This component provides both standard ShadCN input and SKAI-branded
 * input variants that follow the Figma design system exactly.
 *
 * ## Figma Reference (Skai-Design - TyX8YAtNDEIvsnSLQ3IXId)
 * - Input Section: 801:1386
 *   - States: 976:871 (Active), 976:872 (Focus)
 *   - Dark Mode: #001615 background
 *   - Light Mode: #FFFFFF background
 *
 * ## SKAI Input Specifications
 * | Size   | Min Height | Padding | Border Radius |
 * |--------|------------|---------|---------------|
 * | Large  | 132px      | 20px    | 16px          |
 * | Medium | 98px       | 16px    | 12px          |
 * | Small  | 88px       | 12px    | 12px          |
 *
 * ## States
 * - Normal: transparent border
 * - Active/Focus: #17F9B4 (Alien Green) or #56C7F3 (Sky Blue) border
 * - Completed: #17F9B4 border
 * - Error: #FF574A border
 */
const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible input component for text, numbers, and other data entry. Includes SKAI branded variant.\n\n" +
          "**Figma Reference:** Skai-Design (TyX8YAtNDEIvsnSLQ3IXId) - Input Section 801:1386",
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

// =============================================================================
// SKAI BRANDED INPUT STORIES
// =============================================================================

/**
 * SKAI Input - All Sizes
 * Uses SKAI design tokens: Large (132px), Medium (98px), Small (88px)
 */
export const SkaiAllSizes: Story = {
  name: "SKAI: All Sizes",
  render: () => (
    <div className="bg-[#122524] p-8 rounded-3xl border border-[#123F3C] space-y-6">
      <h3 className="text-white text-lg font-semibold mb-4">SKAI Input Sizes (Figma Design System)</h3>
      <div className="space-y-4">
        <SkaiInput
          label="Large Input (132px)"
          skaiSize="large"
          placeholder="Enter amount..."
        />
        <SkaiInput
          label="Medium Input (98px)"
          skaiSize="medium"
          placeholder="Enter amount..."
        />
        <SkaiInput
          label="Small Input (88px)"
          skaiSize="small"
          placeholder="Enter amount..."
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI Input with all 3 sizes from Figma design system: Large (132px), Medium (98px), Small (88px).",
      },
    },
  },
};

/**
 * SKAI Input - States
 * Shows Normal, Active, Focus, Completed, and Error states
 */
export const SkaiStates: Story = {
  name: "SKAI: Input States",
  render: () => (
    <div className="bg-[#122524] p-8 rounded-3xl border border-[#123F3C] space-y-6 w-[450px]">
      <h3 className="text-white text-lg font-semibold mb-4">SKAI Input States</h3>
      <div className="space-y-4">
        <SkaiInput
          label="Normal"
          state="normal"
          placeholder="Transparent border"
        />
        <SkaiInput
          label="Active"
          state="active"
          placeholder="Alien Green border"
          defaultValue="0.5 ETH"
        />
        <SkaiInput
          label="Focus"
          state="focus"
          placeholder="Sky Blue border with shadow"
          defaultValue="Typing..."
        />
        <SkaiInput
          label="Completed"
          state="completed"
          placeholder="Alien Green border"
          defaultValue="1.0 ETH"
        />
        <SkaiInput
          label="Error"
          error="Insufficient balance"
          defaultValue="999 ETH"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI Input showing all 5 states: Normal, Active, Focus, Completed, and Error.",
      },
    },
  },
};

/**
 * SKAI Input - Dark vs Light Mode
 * Shows the input in both color modes
 */
export const SkaiModes: Story = {
  name: "SKAI: Dark vs Light Mode",
  render: () => (
    <div className="flex gap-6">
      <div className="bg-[#122524] p-6 rounded-3xl border border-[#123F3C] w-[300px]">
        <h3 className="text-white text-sm font-semibold mb-4">Dark Mode</h3>
        <SkaiInput
          label="Amount"
          mode="dark"
          placeholder="0.00"
          helperAction={<button className="text-xs">Max</button>}
          secondaryValue="≈ $0.00"
        />
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-200 w-[300px]">
        <h3 className="text-[#001615] text-sm font-semibold mb-4">Light Mode</h3>
        <SkaiInput
          label="Amount"
          mode="light"
          placeholder="0.00"
          helperAction={<button className="text-xs">Max</button>}
          secondaryValue="≈ $0.00"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "SKAI Input in Dark Mode (#001615 bg) and Light Mode (#FFFFFF bg).",
      },
    },
  },
};

/**
 * SKAI Input - Trading Interface Example
 * Real-world usage in a swap interface
 */
export const SkaiTradingExample: Story = {
  name: "SKAI: Trading Interface",
  render: () => (
    <div className="bg-[#122524] p-6 rounded-3xl border border-[#123F3C] w-[420px]">
      <h3 className="text-white text-lg font-semibold mb-4">Swap</h3>
      <div className="space-y-3">
        <SkaiInput
          label="You pay"
          skaiSize="large"
          placeholder="0.00"
          helperAction={<button className="text-xs font-medium">Max</button>}
          secondaryValue="Balance: 2.5 ETH"
        />
        <div className="flex justify-center">
          <div className="bg-[#001615] p-2 rounded-full border border-[#123F3C]">
            <svg className="w-4 h-4 text-[#56C7F3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
        <SkaiInput
          label="You receive"
          skaiSize="large"
          placeholder="0.00"
          secondaryValue="≈ $0.00"
          state="completed"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world example of SKAI Input in a swap/trading interface using the Green Coal card design.",
      },
    },
  },
};
