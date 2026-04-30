import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CurrencyInput } from "./currency-input";

const meta: Meta<typeof CurrencyInput> = {
  title: "Forms/CurrencyInput",
  component: CurrencyInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapper = (args: Partial<React.ComponentProps<typeof CurrencyInput>>) => {
  const [v, setV] = useState<number | undefined>(
    typeof args.value === "number" ? args.value : 0,
  );
  return (
    <div className="w-72">
      <CurrencyInput {...args} value={v} onValueChange={(val) => setV(val)} />
    </div>
  );
};

export const Default: Story = {
  render: () => <Wrapper value={1234.56} currency="$" />,
};

export const Euro: Story = {
  render: () => <Wrapper value={9999.99} currency="€" currencyPosition="suffix" />,
};

export const NoSymbol: Story = {
  render: () => <Wrapper value={500} showCurrencySymbol={false} />,
};
