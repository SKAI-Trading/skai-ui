import * as React from "react";
import { cn } from "../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { TokenIcon } from "./token-icon";
import { Input } from "./input";
import { Search } from "lucide-react";

export interface Token {
  symbol: string;
  name: string;
  address?: string;
  decimals?: number;
  logoUrl?: string;
  balance?: string | number;
}

export interface TokenSelectProps {
  /** Currently selected token */
  value?: string;
  /** Callback when token changes */
  onValueChange: (symbol: string) => void;
  /** List of available tokens */
  tokens: Token[];
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Show token balance */
  showBalance?: boolean;
  /** Show search input */
  searchable?: boolean;
  /** Custom class name */
  className?: string;
  /** Size variant */
  size?: "sm" | "default" | "lg";
}

const TokenSelect = React.forwardRef<HTMLButtonElement, TokenSelectProps>(
  (
    {
      value,
      onValueChange,
      tokens,
      placeholder = "Select token",
      disabled = false,
      showBalance = true,
      searchable = true,
      className,
      size = "default",
    },
    ref,
  ) => {
    const [search, setSearch] = React.useState("");

    const filteredTokens = React.useMemo(() => {
      if (!search) return tokens;
      const query = search.toLowerCase();
      return tokens.filter(
        (t) =>
          t.symbol.toLowerCase().includes(query) ||
          t.name.toLowerCase().includes(query),
      );
    }, [tokens, search]);

    const selectedToken = tokens.find((t) => t.symbol === value);

    const sizeStyles = {
      sm: "h-9 text-sm",
      default: "h-10",
      lg: "h-12 text-lg",
    };

    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          ref={ref}
          className={cn(sizeStyles[size], "min-w-[140px]", className)}
        >
          <SelectValue placeholder={placeholder}>
            {selectedToken && (
              <div className="flex items-center gap-2">
                <TokenIcon
                  symbol={selectedToken.symbol}
                  src={selectedToken.logoUrl}
                  size={size === "lg" ? "md" : "sm"}
                />
                <span className="font-medium">{selectedToken.symbol}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {searchable && tokens.length > 5 && (
            <div className="px-2 pb-2 sticky top-0 bg-popover">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tokens..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>
            </div>
          )}
          {filteredTokens.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No tokens found
            </div>
          ) : (
            filteredTokens.map((token) => (
              <SelectItem
                key={token.symbol}
                value={token.symbol}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full gap-4">
                  <div className="flex items-center gap-2">
                    <TokenIcon
                      symbol={token.symbol}
                      src={token.logoUrl}
                      size="sm"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-xs text-muted-foreground">
                        {token.name}
                      </span>
                    </div>
                  </div>
                  {showBalance && token.balance !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      {parseFloat(String(token.balance)).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 4 },
                      )}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    );
  },
);

TokenSelect.displayName = "TokenSelect";

export { TokenSelect };
