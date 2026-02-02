import type { Meta, StoryObj } from "@storybook/react";
import { Autocomplete, AutocompleteOption } from "../components/forms/autocomplete";
import { useState } from "react";

const meta: Meta<typeof Autocomplete> = {
  title: "Components/Autocomplete",
  component: Autocomplete,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The Autocomplete component provides a searchable dropdown with suggestions.
Also exported as \`Combobox\` for semantic clarity.

## Features
- Search/filter options
- Single and multi-select modes
- Grouped options
- Async loading support
- Custom rendering
- Clearable
- Keyboard navigation
        `,
      },
    },
  },
  tags: ["autodocs", "beta"],
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

const tokens: AutocompleteOption[] = [
  { value: "btc", label: "Bitcoin", group: "Popular" },
  { value: "eth", label: "Ethereum", group: "Popular" },
  { value: "usdc", label: "USD Coin", group: "Stablecoins" },
  { value: "usdt", label: "Tether", group: "Stablecoins" },
  { value: "sol", label: "Solana", group: "Layer 1" },
  { value: "avax", label: "Avalanche", group: "Layer 1" },
  { value: "matic", label: "Polygon", group: "Layer 2" },
  { value: "arb", label: "Arbitrum", group: "Layer 2" },
  { value: "op", label: "Optimism", group: "Layer 2" },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | string[]>("");
    return (
      <div className="w-[300px]">
        <Autocomplete
          options={tokens}
          value={value}
          onValueChange={setValue}
          placeholder="Select a token..."
        />
      </div>
    );
  },
};

export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState<string | string[]>("");
    return (
      <div className="w-[300px]">
        <Autocomplete
          options={tokens}
          value={value}
          onValueChange={setValue}
          placeholder="Search tokens..."
        />
      </div>
    );
  },
};

export const MultiSelect: Story = {
  render: () => {
    const [values, setValues] = useState<string | string[]>([]);
    return (
      <div className="w-[300px]">
        <Autocomplete
          options={tokens}
          value={values}
          onValueChange={setValues}
          placeholder="Select tokens..."
          multiple={true}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Selected: {Array.isArray(values) ? values.join(", ") : values || "None"}
        </p>
      </div>
    );
  },
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState<string | string[]>("eth");
    return (
      <div className="w-[300px]">
        <Autocomplete
          options={tokens}
          value={value}
          onValueChange={setValue}
          clearable={true}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => {
    const [value, setValue] = useState<string | string[]>("");
    return (
      <div className="w-[300px]">
        <Autocomplete
          options={[]}
          value={value}
          onValueChange={setValue}
          loading={true}
          placeholder="Loading tokens..."
        />
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [v1, setV1] = useState<string | string[]>("");
    const [v2, setV2] = useState<string | string[]>("");
    const [v3, setV3] = useState<string | string[]>("");

    return (
      <div className="w-[300px] space-y-4">
        <Autocomplete
          options={tokens}
          value={v1}
          onValueChange={setV1}
          placeholder="Small"
        />
        <Autocomplete
          options={tokens}
          value={v2}
          onValueChange={setV2}
          placeholder="Default"
        />
        <Autocomplete
          options={tokens}
          value={v3}
          onValueChange={setV3}
          placeholder="Large"
        />
      </div>
    );
  },
};

export const CustomRender: Story = {
  render: () => {
    const [value, setValue] = useState<string | string[]>("");

    const tokensWithIcons = tokens.map((t) => ({
      ...t,
      icon: `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/icon/${t.value}.png`,
    }));

    return (
      <div className="w-[300px]">
        <Autocomplete
          options={tokensWithIcons}
          value={value}
          onValueChange={setValue}
          placeholder="Select token..."
          renderOption={(option) => (
            <div className="flex items-center gap-2">
              <img
                src={option.icon as string}
                alt=""
                className="h-5 w-5 rounded-full"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <span>{option.label}</span>
            </div>
          )}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    options: tokens,
    value: "eth",
    disabled: true,
    placeholder: "Disabled",
  },
};

export const AsyncSearch: Story = {
  render: () => {
    const [value, setValue] = useState<string | string[]>("");
    const [options, setOptions] = useState<AutocompleteOption[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (query: string) => {
      if (!query) {
        setOptions([]);
        return;
      }

      setLoading(true);
      // Simulate API call
      await new Promise((r) => setTimeout(r, 500));
      setOptions(
        tokens.filter((t) => t.label.toLowerCase().includes(query.toLowerCase()))
      );
      setLoading(false);
    };

    return (
      <div className="w-[300px]">
        <Autocomplete
          options={options}
          value={value}
          onValueChange={setValue}
          onSearchChange={handleSearch}
          loading={loading}
          placeholder="Search tokens..."
        />
      </div>
    );
  },
};
