import type { Meta, StoryObj } from "@storybook/react";
import { AmountInput } from "../components/trading/amount-input";
import * as React from "react";

const meta: Meta<typeof AmountInput> = {
  title: "Trading/AmountInput",
  component: AmountInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Input field for token amounts with MAX button, balance display, and validation.",
      },
    },
  },
  tags: ["autodocs", "stable"],
  argTypes: {
    value: {
      control: "text",
      description: "Current input value",
    },
    balance: {
      control: "text",
      description: "Available balance to display",
    },
    token: {
      control: "text",
      description: "Token symbol",
    },
    disabled: {
      control: "boolean",
      description: "Whether input is disabled",
    },
    error: {
      control: "text",
      description: "Error message",
    },
    showMaxButton: {
      control: "boolean",
      description: "Show MAX button",
    },
    showHalfButton: {
      control: "boolean",
      description: "Show 50% button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "",
    onChange: () => {},
    placeholder: "0.00",
  },
};

export const WithBalance: Story = {
  args: {
    value: "",
    onChange: () => {},
    balance: "1,234.56",
    token: "ETH",
    showMaxButton: true,
  },
};

export const WithMaxAndHalf: Story = {
  args: {
    value: "500",
    onChange: () => {},
    balance: "1,000.00",
    token: "USDC",
    showMaxButton: true,
    showHalfButton: true,
  },
};

export const WithError: Story = {
  args: {
    value: "999999",
    onChange: () => {},
    balance: "100.00",
    token: "ETH",
    error: "Insufficient balance",
    showMaxButton: true,
  },
};

export const Disabled: Story = {
  args: {
    value: "100.00",
    onChange: () => {},
    disabled: true,
    balance: "500.00",
    token: "DAI",
  },
};

export const InteractiveDemo: Story = {
  render: function Render() {
    const [value, setValue] = React.useState("");
    const balance = "1000.00";

    return (
      <div className="w-80">
        <AmountInput
          value={value}
          onChange={setValue}
          balance={balance}
          token="ETH"
          showMaxButton
          showHalfButton
          onMaxClick={() => setValue(balance)}
          error={
            parseFloat(value) > parseFloat(balance)
              ? "Insufficient balance"
              : undefined
          }
        />
      </div>
    );
  },
};
