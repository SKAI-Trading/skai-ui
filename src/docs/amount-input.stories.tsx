import type { Meta, StoryObj } from "@storybook/react";
import { AmountInput } from "../components/amount-input";
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
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Current input value",
    },
    balance: {
      control: "text",
      description: "Available balance to display",
    },
    symbol: {
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
    showMax: {
      control: "boolean",
      description: "Show MAX button",
    },
    showHalf: {
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
    symbol: "ETH",
    showMax: true,
  },
};

export const WithMaxAndHalf: Story = {
  args: {
    value: "500",
    onChange: () => {},
    balance: "1,000.00",
    symbol: "USDC",
    showMax: true,
    showHalf: true,
  },
};

export const WithError: Story = {
  args: {
    value: "999999",
    onChange: () => {},
    balance: "100.00",
    symbol: "ETH",
    error: "Insufficient balance",
    showMax: true,
  },
};

export const Disabled: Story = {
  args: {
    value: "100.00",
    onChange: () => {},
    disabled: true,
    balance: "500.00",
    symbol: "DAI",
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
          symbol="ETH"
          showMax
          showHalf
          onMax={() => setValue(balance)}
          onHalf={() => setValue((parseFloat(balance) / 2).toString())}
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
