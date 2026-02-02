/**
 * SKAI Mock Data Library
 * Realistic data generators for all component types
 *
 * Use these in Storybook stories and development to have
 * consistent, production-like data across all mockups.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface MockUser {
  id: string;
  address: string;
  shortAddress: string;
  ensName?: string;
  avatar?: string;
  balance: number;
  level: number;
  points: number;
  joinedAt: Date;
}

export interface MockToken {
  symbol: string;
  name: string;
  icon: string;
  address: string;
  decimals: number;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  category: "major" | "defi" | "meme" | "stable";
}

export interface MockAsset {
  token: MockToken;
  balance: number;
  value: number;
  allocation: number;
}

export interface MockTrade {
  id: string;
  pair: string;
  type: "buy" | "sell";
  orderType: "market" | "limit" | "stop";
  price: number;
  amount: number;
  total: number;
  status: "open" | "filled" | "cancelled" | "partial";
  filledPercent: number;
  timestamp: Date;
}

export interface MockTransaction {
  id: string;
  type: "swap" | "send" | "receive" | "stake" | "unstake" | "bridge";
  status: "pending" | "confirmed" | "failed";
  from?: { token: string; amount: number };
  to?: { token: string; amount: number };
  hash: string;
  timestamp: Date;
  gasUsed?: number;
  gasFee?: number;
}

export interface MockNotification {
  id: string;
  type: "trade" | "price" | "system" | "social";
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

export interface MockOrderBookEntry {
  price: number;
  amount: number;
  total: number;
  depth: number;
}

export interface MockCandlestick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// =============================================================================
// GENERATORS
// =============================================================================

/**
 * Generate a random Ethereum address
 */
export const generateAddress = (): string => {
  const chars = "0123456789abcdef";
  let address = "0x";
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

/**
 * Shorten an address for display
 */
export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/**
 * Generate a random price change percentage
 */
export const generatePriceChange = (min = -10, max = 10): number => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

/**
 * Generate a random volume
 */
export const generateVolume = (min = 1000000, max = 10000000000): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Format large numbers (1B, 1M, 1K)
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

/**
 * Generate relative time string
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// =============================================================================
// STATIC DATA
// =============================================================================

/**
 * Major trading tokens
 */
export const mockTokens: MockToken[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "⟠",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    decimals: 18,
    price: 3456.78,
    change24h: 2.34,
    volume24h: 12500000000,
    marketCap: 415000000000,
    category: "major",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    icon: "₿",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    price: 42156.0,
    change24h: -0.87,
    volume24h: 24000000000,
    marketCap: 825000000000,
    category: "major",
  },
  {
    symbol: "SOL",
    name: "Solana",
    icon: "◎",
    address: "0x7dff46370e9ea5f0bad3c4e29711ad50062ea7a4",
    decimals: 9,
    price: 98.45,
    change24h: 5.67,
    volume24h: 4560000000,
    marketCap: 42000000000,
    category: "major",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    icon: "△",
    address: "0x93567d6b6553bde2b652fb7f9dff28e1a8e1f6a1",
    decimals: 18,
    price: 34.12,
    change24h: -2.34,
    volume24h: 567000000,
    marketCap: 12500000000,
    category: "major",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    icon: "⬡",
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    decimals: 18,
    price: 0.89,
    change24h: 1.23,
    volume24h: 345000000,
    marketCap: 8900000000,
    category: "major",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "$",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    decimals: 6,
    price: 1.0,
    change24h: 0.01,
    volume24h: 5600000000,
    marketCap: 32000000000,
    category: "stable",
  },
  {
    symbol: "USDT",
    name: "Tether",
    icon: "$",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
    price: 1.0,
    change24h: -0.01,
    volume24h: 45000000000,
    marketCap: 95000000000,
    category: "stable",
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    icon: "🦄",
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    decimals: 18,
    price: 7.23,
    change24h: 3.45,
    volume24h: 234000000,
    marketCap: 5400000000,
    category: "defi",
  },
  {
    symbol: "AAVE",
    name: "Aave",
    icon: "👻",
    address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
    decimals: 18,
    price: 89.45,
    change24h: -1.23,
    volume24h: 123000000,
    marketCap: 1300000000,
    category: "defi",
  },
  {
    symbol: "PEPE",
    name: "Pepe",
    icon: "🐸",
    address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    decimals: 18,
    price: 0.0000012,
    change24h: 15.67,
    volume24h: 890000000,
    marketCap: 5000000000,
    category: "meme",
  },
];

/**
 * Trading pairs
 */
export const mockTradingPairs = [
  { base: "ETH", quote: "USDT", price: 3456.78, change: 2.34, volume: "1.2B" },
  { base: "BTC", quote: "USDT", price: 42156.0, change: -0.87, volume: "2.4B" },
  { base: "SOL", quote: "USDT", price: 98.45, change: 5.67, volume: "456M" },
  { base: "AVAX", quote: "USDT", price: 34.12, change: -2.34, volume: "234M" },
  { base: "MATIC", quote: "USDT", price: 0.89, change: 1.23, volume: "123M" },
  { base: "ETH", quote: "BTC", price: 0.082, change: 3.21, volume: "45M" },
];

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Generate a mock user
 */
export const createMockUser = (overrides?: Partial<MockUser>): MockUser => {
  const address = generateAddress();
  return {
    id: Math.random().toString(36).slice(2, 11),
    address,
    shortAddress: shortenAddress(address),
    balance: Math.random() * 100000 + 1000,
    level: Math.floor(Math.random() * 50) + 1,
    points: Math.floor(Math.random() * 50000),
    joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    ...overrides,
  };
};

/**
 * Generate mock portfolio assets
 */
export const createMockPortfolio = (tokenCount = 5): MockAsset[] => {
  const selectedTokens = [...mockTokens]
    .sort(() => Math.random() - 0.5)
    .slice(0, tokenCount);

  let totalValue = 0;
  const assets = selectedTokens.map((token) => {
    const balance =
      token.category === "stable" ? Math.random() * 10000 : Math.random() * 100;
    const value = balance * token.price;
    totalValue += value;
    return { token, balance, value, allocation: 0 };
  });

  // Calculate allocation percentages
  return assets.map((asset) => ({
    ...asset,
    allocation: Number(((asset.value / totalValue) * 100).toFixed(2)),
  }));
};

/**
 * Generate mock trade history
 */
export const createMockTrades = (count = 10): MockTrade[] => {
  return Array.from({ length: count }, (_, i) => {
    const pair =
      mockTradingPairs[Math.floor(Math.random() * mockTradingPairs.length)];
    const type = Math.random() > 0.5 ? "buy" : "sell";
    const orderType = ["market", "limit", "stop"][
      Math.floor(Math.random() * 3)
    ] as MockTrade["orderType"];
    const amount = Number((Math.random() * 10).toFixed(4));
    const price = pair.price * (1 + (Math.random() - 0.5) * 0.02);

    return {
      id: `trade-${i}-${Date.now()}`,
      pair: `${pair.base}/${pair.quote}`,
      type,
      orderType,
      price,
      amount,
      total: price * amount,
      status: ["open", "filled", "cancelled", "partial"][
        Math.floor(Math.random() * 4)
      ] as MockTrade["status"],
      filledPercent:
        Math.random() > 0.3 ? 100 : Math.floor(Math.random() * 100),
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    };
  });
};

/**
 * Generate mock transactions
 */
export const createMockTransactions = (count = 10): MockTransaction[] => {
  const types: MockTransaction["type"][] = [
    "swap",
    "send",
    "receive",
    "stake",
    "unstake",
    "bridge",
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const token1 = mockTokens[Math.floor(Math.random() * mockTokens.length)];
    const token2 = mockTokens[Math.floor(Math.random() * mockTokens.length)];

    return {
      id: `tx-${i}-${Date.now()}`,
      type,
      status: ["pending", "confirmed", "failed"][
        Math.floor(Math.random() * 3)
      ] as MockTransaction["status"],
      from:
        type === "swap" || type === "send"
          ? { token: token1.symbol, amount: Math.random() * 10 }
          : undefined,
      to:
        type === "swap" || type === "receive"
          ? { token: token2.symbol, amount: Math.random() * 10 }
          : undefined,
      hash: `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("")}`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      gasUsed: Math.floor(Math.random() * 200000) + 21000,
      gasFee: Math.random() * 0.01,
    };
  });
};

/**
 * Generate mock order book
 */
export const createMockOrderBook = (
  midPrice: number,
  levels = 10,
): { bids: MockOrderBookEntry[]; asks: MockOrderBookEntry[] } => {
  const spread = midPrice * 0.001; // 0.1% spread

  const bids: MockOrderBookEntry[] = [];
  const asks: MockOrderBookEntry[] = [];

  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 0; i < levels; i++) {
    const bidPrice = midPrice - spread - i * midPrice * 0.001;
    const askPrice = midPrice + spread + i * midPrice * 0.001;

    const bidAmount = Math.random() * 50 + 1;
    const askAmount = Math.random() * 50 + 1;

    bidTotal += bidAmount;
    askTotal += askAmount;

    bids.push({
      price: Number(bidPrice.toFixed(2)),
      amount: Number(bidAmount.toFixed(4)),
      total: Number((bidPrice * bidAmount).toFixed(2)),
      depth: 0,
    });

    asks.push({
      price: Number(askPrice.toFixed(2)),
      amount: Number(askAmount.toFixed(4)),
      total: Number((askPrice * askAmount).toFixed(2)),
      depth: 0,
    });
  }

  // Calculate depth percentages
  const maxTotal = Math.max(bidTotal, askTotal);
  bids.forEach((bid, i) => {
    const cumulative = bids
      .slice(0, i + 1)
      .reduce((sum, b) => sum + b.amount, 0);
    bid.depth = (cumulative / maxTotal) * 100;
  });
  asks.forEach((ask, i) => {
    const cumulative = asks
      .slice(0, i + 1)
      .reduce((sum, a) => sum + a.amount, 0);
    ask.depth = (cumulative / maxTotal) * 100;
  });

  return { bids, asks };
};

/**
 * Generate mock candlestick data
 */
export const createMockCandlesticks = (
  startPrice: number,
  count = 100,
  intervalMinutes = 60,
): MockCandlestick[] => {
  let price = startPrice;
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const volatility = 0.02; // 2% volatility
    const change = (Math.random() - 0.5) * 2 * volatility;

    const open = price;
    const close = price * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);

    price = close;

    return {
      time: now - (count - i) * intervalMinutes * 60 * 1000,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
    };
  });
};

/**
 * Generate mock notifications
 */
export const createMockNotifications = (count = 5): MockNotification[] => {
  const templates = [
    {
      type: "trade" as const,
      title: "Order Filled",
      message: "Your buy order for 1.5 ETH has been filled at $3,456.78",
    },
    {
      type: "price" as const,
      title: "Price Alert",
      message: "ETH has reached your target price of $3,500",
    },
    {
      type: "system" as const,
      title: "Security Update",
      message: "New login detected from Chrome on Windows",
    },
    {
      type: "social" as const,
      title: "New Follower",
      message: "0x1234...5678 started following your portfolio",
    },
  ];

  return Array.from({ length: count }, (_, i) => {
    const template = templates[Math.floor(Math.random() * templates.length)];
    return {
      id: `notif-${i}-${Date.now()}`,
      ...template,
      read: Math.random() > 0.5,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    };
  });
};

// =============================================================================
// PRESET DATA SETS
// =============================================================================

/**
 * Complete mock dashboard data
 */
export const mockDashboardData = {
  user: createMockUser({ ensName: "trader.eth", level: 42, points: 12450 }),
  portfolio: createMockPortfolio(5),
  totalBalance: 124567.89,
  change24h: 2345.67,
  changePercent: 1.92,
  trades: createMockTrades(5),
  transactions: createMockTransactions(5),
  notifications: createMockNotifications(3),
};

/**
 * Complete mock trading data
 */
export const mockTradingData = {
  pair: { base: "ETH", quote: "USDT" },
  price: 3456.78,
  change24h: 2.34,
  high24h: 3500,
  low24h: 3400,
  volume24h: 1200000000,
  orderBook: createMockOrderBook(3456.78),
  candlesticks: createMockCandlesticks(3400, 100),
  openOrders: createMockTrades(3).filter((t) => t.status === "open"),
  tradeHistory: createMockTrades(10),
};

export default {
  tokens: mockTokens,
  tradingPairs: mockTradingPairs,
  dashboard: mockDashboardData,
  trading: mockTradingData,
  createMockUser,
  createMockPortfolio,
  createMockTrades,
  createMockTransactions,
  createMockOrderBook,
  createMockCandlesticks,
  createMockNotifications,
};
