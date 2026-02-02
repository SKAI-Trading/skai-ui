import type { Meta, StoryObj } from "@storybook/react";
import { BalanceDisplay, BalanceChange } from "../components/trading/balance-display";
import { Wallet, Zap, CircleDollarSign, Bitcoin, Coins } from "lucide-react";

const meta: Meta<typeof BalanceDisplay> = {
  title: "Layout/BalanceDisplay",
  component: BalanceDisplay,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Token/currency balance display with formatting, loading states, and privacy mode.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "muted", "success", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
    },
    symbolPosition: {
      control: "select",
      options: ["prefix", "suffix"],
    },
    iconPosition: {
      control: "select",
      options: ["left", "right"],
    },
    decimals: {
      control: { type: "range", min: 0, max: 8, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BalanceDisplay>;

// Basic examples
export const Default: Story = {
  args: {
    balance: 1234.56,
    symbol: "ETH",
  },
};

export const WithIcon: Story = {
  args: {
    balance: 1234.56,
    symbol: "ETH",
    icon: <Wallet className="h-4 w-4" />,
  },
};

export const PrefixSymbol: Story = {
  args: {
    balance: 1234.56,
    symbol: "$",
    symbolPosition: "prefix",
  },
};

export const WithIconAndSymbol: Story = {
  args: {
    balance: 12450,
    symbol: "SKAI",
    icon: <Zap className="h-4 w-4 text-skai-green" />,
  },
};

// Compact notation
export const CompactNotation: Story = {
  args: {
    balance: 1234567.89,
    compact: true,
    symbol: "USD",
  },
};

export const CompactMillions: Story = {
  args: {
    balance: 45_678_901,
    compact: true,
    symbol: "$",
    symbolPosition: "prefix",
  },
};

// Loading state
export const Loading: Story = {
  args: {
    balance: 0,
    loading: true,
    symbol: "ETH",
  },
};

export const LoadingWithIcon: Story = {
  args: {
    balance: 0,
    loading: true,
    symbol: "ETH",
    icon: <Wallet className="h-4 w-4" />,
  },
};

// Hidden value (privacy)
export const HiddenValue: Story = {
  args: {
    balance: 1234.56,
    hideValue: true,
    symbol: "ETH",
    icon: <Wallet className="h-4 w-4" />,
  },
};

// Sizes
export const ExtraSmall: Story = {
  args: {
    balance: 1234.56,
    symbol: "ETH",
    size: "xs",
  },
};

export const Small: Story = {
  args: {
    balance: 1234.56,
    symbol: "ETH",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    balance: 1234.56,
    symbol: "ETH",
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    balance: 1234.56,
    symbol: "ETH",
    size: "xl",
  },
};

export const DoubleExtraLarge: Story = {
  args: {
    balance: 1234.56,
    symbol: "ETH",
    size: "2xl",
    icon: <Wallet className="h-7 w-7" />,
  },
};

// Variants
export const Success: Story = {
  args: {
    balance: 1234.56,
    symbol: "ETH",
    variant: "success",
    icon: <Wallet className="h-4 w-4" />,
  },
};

export const Warning: Story = {
  args: {
    balance: 1234.56,
    symbol: "ETH",
    variant: "warning",
    icon: <Wallet className="h-4 w-4" />,
  },
};

export const Danger: Story = {
  args: {
    balance: 1234.56,
    symbol: "ETH",
    variant: "danger",
    icon: <Wallet className="h-4 w-4" />,
  },
};

// Decimal places
export const NoDecimals: Story = {
  args: {
    balance: 1234.56789,
    symbol: "SKAI",
    decimals: 0,
  },
};

export const FourDecimals: Story = {
  args: {
    balance: 0.12345678,
    symbol: "BTC",
    decimals: 4,
    icon: <Bitcoin className="h-4 w-4 text-orange-500" />,
  },
};

export const EightDecimals: Story = {
  args: {
    balance: 0.00012345,
    symbol: "BTC",
    decimals: 8,
    icon: <Bitcoin className="h-4 w-4 text-orange-500" />,
  },
};

// Icon position
export const IconRight: Story = {
  args: {
    balance: 1234.56,
    symbol: "USDC",
    icon: <CircleDollarSign className="h-4 w-4 text-blue-500" />,
    iconPosition: "right",
  },
};

// All sizes comparison
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <BalanceDisplay balance={1234.56} symbol="ETH" size="xs" />
      <BalanceDisplay balance={1234.56} symbol="ETH" size="sm" />
      <BalanceDisplay balance={1234.56} symbol="ETH" size="md" />
      <BalanceDisplay balance={1234.56} symbol="ETH" size="lg" />
      <BalanceDisplay balance={1234.56} symbol="ETH" size="xl" />
      <BalanceDisplay balance={1234.56} symbol="ETH" size="2xl" />
    </div>
  ),
};

// Multiple balances
export const MultipleBalances: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-8">
        <span className="text-muted-foreground text-sm">ETH</span>
        <BalanceDisplay
          balance={2.45678}
          symbol="ETH"
          decimals={4}
          icon={<Wallet className="h-4 w-4" />}
        />
      </div>
      <div className="flex items-center justify-between gap-8">
        <span className="text-muted-foreground text-sm">SKAI</span>
        <BalanceDisplay
          balance={12450}
          symbol="SKAI"
          decimals={0}
          icon={<Zap className="h-4 w-4 text-skai-green" />}
        />
      </div>
      <div className="flex items-center justify-between gap-8">
        <span className="text-muted-foreground text-sm">USD</span>
        <BalanceDisplay
          balance={5678.9}
          symbol="$"
          symbolPosition="prefix"
          icon={<CircleDollarSign className="h-4 w-4 text-green-500" />}
        />
      </div>
    </div>
  ),
};

// BalanceChange component
export const PositiveChange: Story = {
  render: () => <BalanceChange balance={5.23} asPercentage />,
};

export const NegativeChange: Story = {
  render: () => <BalanceChange balance={-2.15} asPercentage />,
};

export const ZeroChange: Story = {
  render: () => <BalanceChange balance={0} asPercentage />,
};

export const ChangeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground w-20">Positive:</span>
        <BalanceChange balance={12.45} asPercentage size="lg" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground w-20">Negative:</span>
        <BalanceChange balance={-8.32} asPercentage size="lg" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground w-20">Neutral:</span>
        <BalanceChange balance={0} asPercentage size="lg" />
      </div>
    </div>
  ),
};

// Header context
export const HeaderContext: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-4 bg-card rounded-lg border">
      <BalanceDisplay
        balance={2.45}
        symbol="ETH"
        decimals={2}
        size="sm"
        icon={<Wallet className="h-3.5 w-3.5" />}
      />
      <div className="h-4 w-px bg-border" />
      <BalanceDisplay
        balance={12450}
        symbol="SKAI"
        decimals={0}
        size="sm"
        icon={<Zap className="h-3.5 w-3.5 text-skai-green" />}
      />
      <div className="h-4 w-px bg-border" />
      <BalanceChange balance={5.23} asPercentage size="sm" />
    </div>
  ),
};

// Wallet card context
export const WalletCard: Story = {
  render: () => (
    <div className="w-80 p-6 bg-gradient-to-br from-green-coal-800 to-green-coal-900 rounded-xl border border-green-coal-700">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-5 w-5 text-skai-green" />
        <span className="text-sm text-muted-foreground">Total Balance</span>
      </div>
      <BalanceDisplay
        balance={45678.9}
        symbol="$"
        symbolPosition="prefix"
        size="2xl"
        decimals={2}
        className="mb-2"
      />
      <BalanceChange balance={12.45} asPercentage size="sm" />
    </div>
  ),
};
