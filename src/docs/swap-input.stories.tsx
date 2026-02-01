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
    const [token, setToken] = React.useState<Token | undefined>(
      sampleTokens[0],
    );

    return (
      <div className="w-[400px]">
        <SwapInput
          label="You pay"
          amount={amount}
          onAmountChange={setAmount}
          selectedToken={token}
          onTokenSelect={setToken}
          tokens={sampleTokens}
          balance="1.5432"
          showMax
        />
      </div>
    );
  },
};

export const WithUsdValue: Story = {
  render: function Render() {
    const [amount, setAmount] = React.useState("0.5");
    const [token, setToken] = React.useState<Token | undefined>(
      sampleTokens[0],
    );

    return (
      <div className="w-[400px]">
        <SwapInput
          label="You pay"
          amount={amount}
          onAmountChange={setAmount}
          selectedToken={token}
          onTokenSelect={setToken}
          tokens={sampleTokens}
          balance="1.5432"
          usdValue="$1,423.66"
          showMax
        />
      </div>
    );
  },
};

export const FullSwapInterface: Story = {
  render: function Render() {
    const [fromAmount, setFromAmount] = React.useState("0.5");
    const [toAmount, setToAmount] = React.useState("1,423.66");
    const [fromToken, setFromToken] = React.useState<Token | undefined>(
      sampleTokens[0],
    );
    const [toToken, setToToken] = React.useState<Token | undefined>(
      sampleTokens[1],
    );

    const handleFlip = () => {
      const tempToken = fromToken;
      const tempAmount = fromAmount;
      setFromToken(toToken);
      setToToken(tempToken);
      setFromAmount(toAmount.replace(",", ""));
      setToAmount(tempAmount);
    };

    return (
      <div className="w-[400px]">
        <SwapContainer onFlip={handleFlip}>
          <SwapInput
            label="You pay"
            amount={fromAmount}
            onAmountChange={setFromAmount}
            selectedToken={fromToken}
            onTokenSelect={setFromToken}
            tokens={sampleTokens}
            balance="1.5432"
            usdValue="$1,423.66"
            showMax
          />
          <SwapInput
            label="You receive"
            amount={toAmount}
            onAmountChange={setToAmount}
            selectedToken={toToken}
            onTokenSelect={setToToken}
            tokens={sampleTokens}
            balance="2,500.00"
            usdValue="$1,423.66"
          />
        </SwapContainer>
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
          label="You pay"
          amount="0.5"
          onAmountChange={() => {}}
          selectedToken={sampleTokens[0]}
          onTokenSelect={() => {}}
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
    const [token, setToken] = React.useState<Token | undefined>(
      sampleTokens[0],
    );

    return (
      <div className="w-[400px]">
        <SwapInput
          label="You pay"
          amount={amount}
          onAmountChange={setAmount}
          selectedToken={token}
          onTokenSelect={setToken}
          tokens={sampleTokens}
          balance="1.5432"
          error="Insufficient balance"
          showMax
        />
      </div>
    );
  },
};
