import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "../components/forms/password-input";
import { useState } from "react";

const meta: Meta<typeof PasswordInput> = {
  title: "Forms/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Password input with visibility toggle and optional strength indicator. Includes built-in password strength calculation.",
      },
    },
  },
  argTypes: {
    showStrength: {
      control: "boolean",
      description: "Show password strength indicator",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: {
    placeholder: "Enter password",
  },
};

export const WithStrengthIndicator: Story = {
  name: "With Strength Indicator",
  args: {
    placeholder: "Enter a strong password",
    showStrength: true,
  },
};

export const WithError: Story = {
  name: "With Error",
  args: {
    placeholder: "Enter password",
    error: "Password must be at least 8 characters",
  },
};

export const WithErrorAndStrength: Story = {
  name: "With Error and Strength",
  args: {
    placeholder: "Enter password",
    showStrength: true,
    error: "Password is too weak",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Enter password",
    disabled: true,
    value: "disabled-password",
  },
};

export const PasswordStrengthLevels: Story = {
  name: "Password Strength Levels",
  render: () => {
    const StrengthDemo = () => {
      const [password, setPassword] = useState("");

      return (
        <div className="max-w-sm space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Try different password strengths:
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type to see strength..."
              showStrength
            />
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Weak:</strong> "abc" (short, simple)
            </p>
            <p>
              <strong>Fair:</strong> "password" (longer but common)
            </p>
            <p>
              <strong>Good:</strong> "Password1" (mixed case + number)
            </p>
            <p>
              <strong>Strong:</strong> "MyP@ssw0rd!2024" (all types, long)
            </p>
          </div>
        </div>
      );
    };

    return <StrengthDemo />;
  },
};

export const LoginForm: Story = {
  name: "Login Form Example",
  render: () => (
    <div className="max-w-sm space-y-4 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Sign In</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <PasswordInput placeholder="Enter your password" />
      </div>
      <button className="h-10 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
        Sign In
      </button>
    </div>
  ),
};

export const RegistrationForm: Story = {
  name: "Registration Form Example",
  render: () => (
    <div className="max-w-sm space-y-4 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Create Account</h3>
      <p className="text-sm text-muted-foreground">
        Join SKAI Trading and start your journey
      </p>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <PasswordInput placeholder="Create a strong password" showStrength />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm Password</label>
          <PasswordInput placeholder="Confirm your password" />
        </div>
      </div>
      <ul className="space-y-1 text-xs text-muted-foreground">
        <li>• At least 8 characters</li>
        <li>• Include uppercase and lowercase</li>
        <li>• Include at least one number</li>
        <li>• Include a special character (!@#$...)</li>
      </ul>
      <button className="h-10 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
        Create Account
      </button>
    </div>
  ),
};

export const WalletSecurity: Story = {
  name: "Wallet Security Setup",
  render: () => (
    <div className="max-w-sm space-y-4 rounded-lg border p-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          🔐
        </div>
        <div>
          <h3 className="text-lg font-semibold">Secure Your Wallet</h3>
          <p className="text-xs text-muted-foreground">
            Add an extra layer of protection
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Trading Password</label>
          <PasswordInput placeholder="Password for trades" showStrength />
          <p className="text-xs text-muted-foreground">
            Required for trades over $10,000
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Withdrawal Password</label>
          <PasswordInput placeholder="Password for withdrawals" showStrength />
          <p className="text-xs text-muted-foreground">Required for all withdrawals</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="h-10 flex-1 rounded-md border px-4 py-2 font-medium hover:bg-muted">
          Skip
        </button>
        <button className="h-10 flex-1 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
          Enable
        </button>
      </div>
    </div>
  ),
};
