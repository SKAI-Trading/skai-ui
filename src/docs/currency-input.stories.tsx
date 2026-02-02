import type { Meta, StoryObj } from "@storybook/react";
import { CurrencyInput } from "../components/currency-input";
import { useState } from "react";

const meta: Meta<typeof CurrencyInput> = {
  title: "Forms/CurrencyInput",
  component: CurrencyInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The CurrencyInput component provides formatted currency input with locale support.

## Features
- Automatic currency formatting
- Multiple currency symbols
- Locale-aware number formatting
- Min/max constraints
- Decimal precision control
- Error states
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CurrencyInput>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(undefined);
    return (
      <div className="w-[250px]">
        <CurrencyInput
          value={value}
          onValueChange={(v) => setValue(v)}
          placeholder="0.00"
        />
      </div>
    );
  },
};

export const WithCurrencySymbol: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(1234.56);
    return (
      <div className="w-[250px]">
        <CurrencyInput
          value={value}
          onValueChange={(v) => setValue(v)}
          currency="USD"
        />
      </div>
    );
  },
};

export const EuroCurrency: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(9999.99);
    return (
      <div className="w-[250px]">
        <CurrencyInput
          value={value}
          onValueChange={(v) => setValue(v)}
          currency="EUR"
        />
      </div>
    );
  },
};

export const CryptoCurrency: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(0.12345678);
    return (
      <div className="w-[250px]">
        <CurrencyInput
          value={value}
          onValueChange={(v) => setValue(v)}
          currency="BTC"
          decimals={8}
        />
      </div>
    );
  },
};

export const WithMinMax: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(undefined);
    return (
      <div className="space-y-2 w-[250px]">
        <p className="text-sm text-muted-foreground">Min: $10, Max: $1000</p>
        <CurrencyInput
          value={value}
          onValueChange={(v) => setValue(v)}
          currency="USD"
          min={10}
          max={1000}
        />
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [v1, setV1] = useState<number | undefined>(100);
    const [v2, setV2] = useState<number | undefined>(100);
    const [v3, setV3] = useState<number | undefined>(100);

    return (
      <div className="space-y-4 w-[250px]">
        <CurrencyInput
          value={v1}
          onValueChange={(v) => setV1(v)}
          currency="USD"
        />
        <CurrencyInput
          value={v2}
          onValueChange={(v) => setV2(v)}
          currency="USD"
        />
        <CurrencyInput
          value={v3}
          onValueChange={(v) => setV3(v)}
          currency="USD"
        />
      </div>
    );
  },
};

export const ErrorState: Story = {
  args: {
    value: 0,
    currency: "USD",
  },
};

export const Disabled: Story = {
  args: {
    value: 500.0,
    currency: "USD",
    disabled: true,
  },
};
