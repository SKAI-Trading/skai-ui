import type { Meta, StoryObj } from "@storybook/react";
import { SwapInput, SwapContainer } from "../components/swap-input";
import { type Token } from "../components/token-select";
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
];

const meta: Meta<typeof SwapInput> = {
  title: "Trading/SwapInput",
  component: SwapInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Combined amount input and token selector for DEX swap interfaces.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [amount, setAmount] = React.useState("");
    const [token, setToken] = React.useState<string | undefined>(
      sampleTokens[0].symbol,
    );

    return (
      <div className="w-[400px]">
        <SwapInput
          side="from"
          amount={amount}
          onAmountChange={setAmount}
          token={token}
          onTokenChange={setToken}
          tokens={sampleTokens}
          balance="1.5432"
        />
      </div>
    );
  },
};

export const WithUsdValue: Story = {
  render: function Render() {
    const [amount, setAmount] = React.useState("0.5");
    const [token, setToken] = React.useState<string | undefined>(
      sampleTokens[0].symbol,
    );

    return (
      <div className="w-[400px]">
        <SwapInput
          side="from"
          amount={amount}
          onAmountChange={setAmount}
          token={token}
          onTokenChange={setToken}
          tokens={sampleTokens}
          balance="1.5432"
          usdValue={1423.66}
        />
      </div>
    );
  },
};

export const FullSwapInterface: Story = {
  render: function Render() {
    const [fromAmount, setFromAmount] = React.useState("0.5");
    const [toAmount, setToAmount] = React.useState("1423.66");
    const [fromToken, setFromToken] = React.useState<string | undefined>(
      sampleTokens[0].symbol,
    );
    const [toToken, setToToken] = React.useState<string | undefined>(
      sampleTokens[1].symbol,
    );

    const handleFlip = () => {
      const tempToken = fromToken;
      const tempAmount = fromAmount;
      setFromToken(toToken);
      setToToken(tempToken);
      setFromAmount(toAmount.replace(/,/g, ""));
      setToAmount(tempAmount);
    };

    return (
      <div className="w-[400px]">
        <SwapContainer
          onFlip={handleFlip}
          fromInput={
            <SwapInput
              side="from"
              amount={fromAmount}
              onAmountChange={setFromAmount}
              token={fromToken}
              onTokenChange={setFromToken}
              tokens={sampleTokens}
              balance="1.5432"
              usdValue={1423.66}
            />
          }
          toInput={
            <SwapInput
              side="to"
              amount={toAmount}
              onAmountChange={setToAmount}
              token={toToken}
              onTokenChange={setToToken}
              tokens={sampleTokens}
              balance="2500.00"
              usdValue={1423.66}
            />
          }
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Complete swap interface with flip button using SwapContainer and two SwapInput components.",
      },
    },
  },
};

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="w-[400px]">
        <SwapInput
          side="from"
          amount="0.5"
          onAmountChange={() => {}}
          token={sampleTokens[0].symbol}
          onTokenChange={() => {}}
          tokens={sampleTokens}
          balance="1.5432"
          disabled
        />
      </div>
    );
  },
};

export const WithError: Story = {
  render: function Render() {
    const [amount, setAmount] = React.useState("10");
    const [token, setToken] = React.useState<string | undefined>(
      sampleTokens[0].symbol,
    );

    return (
      <div className="w-[400px]">
        <SwapInput
          side="from"
          amount={amount}
          onAmountChange={setAmount}
          token={token}
          onTokenChange={setToken}
          tokens={sampleTokens}
          balance="1.5432"
          error="Insufficient balance"
        />
      </div>
    );
  },
};
