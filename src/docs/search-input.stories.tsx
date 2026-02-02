import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "../components/forms/search-input";
import { useState } from "react";

const meta: Meta<typeof SearchInput> = {
  title: "Forms/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Search input with built-in search icon, clear button, loading state, and optional debouncing. Supports size variants.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    isLoading: {
      control: "boolean",
    },
    debounceMs: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    placeholder: "Search...",
  },
};

export const WithValue: Story = {
  name: "With Value",
  args: {
    placeholder: "Search...",
    value: "ethereum",
  },
};

export const Loading: Story = {
  args: {
    placeholder: "Search...",
    value: "searching...",
    isLoading: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Small</label>
        <SearchInput size="sm" placeholder="Small search..." />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Default</label>
        <SearchInput size="default" placeholder="Default search..." />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Large</label>
        <SearchInput size="lg" placeholder="Large search..." />
      </div>
    </div>
  ),
};

export const WithDebounce: Story = {
  name: "With Debounce",
  render: () => {
    const DebouncedSearch = () => {
      const [value, setValue] = useState("");
      const [debouncedValue, setDebouncedValue] = useState("");
      const [searchCount, setSearchCount] = useState(0);

      return (
        <div className="max-w-sm space-y-4">
          <SearchInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onDebouncedChange={(val) => {
              setDebouncedValue(val);
              setSearchCount((c) => c + 1);
            }}
            debounceMs={500}
            placeholder="Type to search (500ms debounce)..."
          />
          <div className="space-y-1 text-sm">
            <p>
              <strong>Current input:</strong> {value || "(empty)"}
            </p>
            <p>
              <strong>Debounced value:</strong> {debouncedValue || "(empty)"}
            </p>
            <p>
              <strong>Search triggered:</strong> {searchCount} times
            </p>
          </div>
        </div>
      );
    };

    return <DebouncedSearch />;
  },
};

export const TokenSearch: Story = {
  name: "Token Search Example",
  render: () => {
    const tokens = [
      { symbol: "ETH", name: "Ethereum", price: "$2,250.00" },
      { symbol: "BTC", name: "Bitcoin", price: "$43,500.00" },
      { symbol: "USDC", name: "USD Coin", price: "$1.00" },
      { symbol: "SKAI", name: "SKAI Token", price: "$0.50" },
    ];

    const TokenSearchDemo = () => {
      const [query, setQuery] = useState("");
      const filtered = tokens.filter(
        (t) =>
          t.symbol.toLowerCase().includes(query.toLowerCase()) ||
          t.name.toLowerCase().includes(query.toLowerCase())
      );

      return (
        <div className="max-w-sm space-y-4">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
            placeholder="Search tokens..."
          />
          <div className="divide-y rounded-lg border">
            {filtered.map((token) => (
              <div
                key={token.symbol}
                className="flex cursor-pointer items-center justify-between p-3 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{token.symbol}</p>
                    <p className="text-sm text-muted-foreground">{token.name}</p>
                  </div>
                </div>
                <p className="font-mono">{token.price}</p>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">
                No tokens found for "{query}"
              </div>
            )}
          </div>
        </div>
      );
    };

    return <TokenSearchDemo />;
  },
};

export const TradeHistorySearch: Story = {
  name: "Trade History Search",
  render: () => (
    <div className="max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Trade History</h3>
        <SearchInput size="sm" placeholder="Search trades..." className="w-48" />
      </div>
      <div className="divide-y rounded-lg border">
        {[
          { pair: "ETH/USDC", type: "Buy", amount: "+0.5 ETH", time: "2 min ago" },
          { pair: "BTC/USDC", type: "Sell", amount: "-0.02 BTC", time: "15 min ago" },
          { pair: "SKAI/ETH", type: "Buy", amount: "+1000 SKAI", time: "1 hr ago" },
        ].map((trade, i) => (
          <div key={i} className="flex items-center justify-between p-3">
            <div>
              <p className="font-medium">{trade.pair}</p>
              <p className="text-sm text-muted-foreground">
                {trade.type} • {trade.time}
              </p>
            </div>
            <p
              className={`font-mono ${
                trade.type === "Buy" ? "text-green-500" : "text-red-500"
              }`}
            >
              {trade.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const GlobalSearch: Story = {
  name: "Global Search (Command-K Style)",
  render: () => (
    <div className="max-w-lg rounded-lg border p-4 shadow-lg">
      <SearchInput
        size="lg"
        placeholder="Search tokens, transactions, addresses..."
        className="mb-4"
      />
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">TOKENS</p>
          <div className="space-y-1">
            {["Ethereum (ETH)", "Bitcoin (BTC)", "Solana (SOL)"].map((t) => (
              <div
                key={t}
                className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-muted"
              >
                <span className="text-muted-foreground">🪙</span>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            RECENT SEARCHES
          </p>
          <div className="space-y-1">
            {["0x742d...3b5f", "Swap ETH → USDC", "My portfolio"].map((s) => (
              <div
                key={s}
                className="flex cursor-pointer items-center gap-2 rounded p-2 text-muted-foreground hover:bg-muted"
              >
                <span>🕐</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>↑↓ to navigate</span>
        <span>↵ to select</span>
        <span>esc to close</span>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "Search disabled...",
    disabled: true,
  },
};
