import type { Meta, StoryObj } from "@storybook/react";
import { TokenSelect, type Token } from "../components/trading/token-select";
import * as React from "react";

const sampleTokens: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "1.5432",
    address: "0x0000000000000000000000000000000000000000",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "2,500.00",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  {
    symbol: "USDT",
    name: "Tether",
    balance: "1,000.00",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    balance: "500.00",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    balance: "0.0234",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  },
];

const meta: Meta<typeof TokenSelect> = {
  title: "Trading/TokenSelect",
  component: TokenSelect,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Dropdown for selecting tokens with search, balance display, and token icons.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    tokens: {
      description: "Array of available tokens",
    },
    value: {
      description: "Currently selected token symbol",
    },
    showBalance: {
      control: "boolean",
      description: "Show balance in dropdown",
    },
    disabled: {
      control: "boolean",
      description: "Disable the select",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [selected, setSelected] = React.useState<string | undefined>();
    return (
      <div className="w-48">
        <TokenSelect
          tokens={sampleTokens}
          value={selected}
          onValueChange={setSelected}
        />
      </div>
    );
  },
};

export const WithSelectedToken: Story = {
  render: function Render() {
    const [selected, setSelected] = React.useState<string | undefined>(
      sampleTokens[0].symbol,
    );
    return (
      <div className="w-48">
        <TokenSelect
          tokens={sampleTokens}
          value={selected}
          onValueChange={setSelected}
        />
      </div>
    );
  },
};

export const WithBalances: Story = {
  render: function Render() {
    const [selected, setSelected] = React.useState<string | undefined>();
    return (
      <div className="w-64">
        <TokenSelect
          tokens={sampleTokens}
          value={selected}
          onValueChange={setSelected}
          showBalance
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    tokens: sampleTokens,
    value: sampleTokens[0].symbol,
    disabled: true,
    onValueChange: () => {},
  },
};

export const CustomPlaceholder: Story = {
  render: function Render() {
    const [selected, setSelected] = React.useState<string | undefined>();
    return (
      <div className="w-48">
        <TokenSelect
          tokens={sampleTokens}
          value={selected}
          onValueChange={setSelected}
          placeholder="Choose token..."
        />
      </div>
    );
  },
};
