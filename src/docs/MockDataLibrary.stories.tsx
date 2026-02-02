import type { Meta, StoryObj } from "@storybook/react";
import mockData, {
  mockTokens,
  mockTradingPairs,
  createMockUser,
  createMockPortfolio,
  createMockTrades,
  createMockOrderBook,
  createMockCandlesticks,
  formatLargeNumber,
  formatRelativeTime,
} from "../lib/mock-data";

/**
 * # Mock Data Library
 *
 * A comprehensive library of realistic mock data for prototyping and testing.
 * All data generators create production-like data that can be used across
 * all components and pages in the design system.
 *
 * ## Usage in Stories
 * ```tsx
 * import mockData, { createMockTrades } from '../lib/mock-data';
 *
 * // Use preset data
 * const trades = mockData.trading.tradeHistory;
 *
 * // Or generate fresh data
 * const freshTrades = createMockTrades(10);
 * ```
 */

// Wrapper component for displaying data
const DataPreview = ({
  title,
  data,
  code,
}: {
  title: string;
  data: unknown;
  code: string;
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <button
          onClick={() => copyToClipboard(code)}
          className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500"
        >
          Copy Import
        </button>
      </div>
      <div className="p-4">
        <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 border-t border-slate-200 dark:border-slate-700">
        <code className="text-xs text-slate-600 dark:text-slate-400">
          {code}
        </code>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Mock Data Library",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Mock Data Library

A comprehensive collection of mock data generators for creating realistic, production-like data 
for all SKAI components and pages.

## Features

- **Static Data**: Pre-defined tokens, trading pairs, and user data
- **Generators**: Functions to create randomized but realistic data
- **Preset Datasets**: Complete data packages for Dashboard, Trading, Wallet pages
- **Utilities**: Formatting helpers for numbers, addresses, and dates

## Import Patterns

\`\`\`tsx
// Import everything
import mockData from '../lib/mock-data';

// Import specific generators
import { createMockTrades, createMockPortfolio } from '../lib/mock-data';

// Import static data
import { mockTokens, mockTradingPairs } from '../lib/mock-data';
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// =============================================================================
// STATIC DATA STORIES
// =============================================================================

export const TokensData: Story = {
  name: "🪙 Tokens",
  render: () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Token Data</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Pre-defined token data for major cryptocurrencies, stablecoins, DeFi
          tokens, and meme coins.
        </p>
      </div>

      {/* Visual Token Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {mockTokens.map((token) => (
          <div
            key={token.symbol}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{token.icon}</span>
              <div>
                <div className="font-bold">{token.symbol}</div>
                <div className="text-xs text-slate-500">{token.name}</div>
              </div>
            </div>
            <div className="text-lg font-mono">
              ${token.price.toLocaleString()}
            </div>
            <div
              className={`text-sm ${
                token.change24h >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {token.change24h >= 0 ? "+" : ""}
              {token.change24h}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Vol: {formatLargeNumber(token.volume24h)}
            </div>
          </div>
        ))}
      </div>

      <DataPreview
        title="mockTokens"
        data={mockTokens}
        code={`import { mockTokens } from '../lib/mock-data';`}
      />
    </div>
  ),
};

export const TradingPairsData: Story = {
  name: "📊 Trading Pairs",
  render: () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Trading Pairs</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Common trading pairs with prices and 24h changes.
        </p>
      </div>

      {/* Visual Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Pair</th>
              <th className="text-right px-4 py-3 font-semibold">Price</th>
              <th className="text-right px-4 py-3 font-semibold">24h Change</th>
              <th className="text-right px-4 py-3 font-semibold">Volume</th>
            </tr>
          </thead>
          <tbody>
            {mockTradingPairs.map((pair, i) => (
              <tr
                key={i}
                className="border-t border-slate-200 dark:border-slate-700"
              >
                <td className="px-4 py-3 font-mono font-semibold">
                  {pair.base}/{pair.quote}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  ${pair.price.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono ${
                    pair.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {pair.change >= 0 ? "+" : ""}
                  {pair.change}%
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">
                  {pair.volume}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DataPreview
        title="mockTradingPairs"
        data={mockTradingPairs}
        code={`import { mockTradingPairs } from '../lib/mock-data';`}
      />
    </div>
  ),
};

// =============================================================================
// GENERATOR STORIES
// =============================================================================

export const UserGenerator: Story = {
  name: "👤 User Generator",
  render: () => {
    const users = [
      createMockUser(),
      createMockUser({ ensName: "whale.eth" }),
      createMockUser({ level: 100, points: 99999 }),
    ];

    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">User Generator</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Generate mock user profiles with wallet addresses, balances, and
            levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {users.map((user, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {user.level}
                </div>
                <div>
                  <div className="font-bold">
                    {user.ensName || user.shortAddress}
                  </div>
                  <div className="text-xs text-slate-500">
                    {user.shortAddress}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Balance</span>
                  <span className="font-mono">
                    $
                    {user.balance.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Points</span>
                  <span className="font-mono">
                    {user.points.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Joined</span>
                  <span>{formatRelativeTime(user.joinedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DataPreview
          title="createMockUser()"
          data={users[0]}
          code={`import { createMockUser } from '../lib/mock-data';

const user = createMockUser();
const namedUser = createMockUser({ ensName: 'trader.eth' });`}
        />
      </div>
    );
  },
};

export const PortfolioGenerator: Story = {
  name: "💼 Portfolio Generator",
  render: () => {
    const portfolio = createMockPortfolio(5);
    const totalValue = portfolio.reduce((sum, a) => sum + a.value, 0);

    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Portfolio Generator</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Generate mock portfolios with token allocations and values.
          </p>
        </div>

        {/* Portfolio Visualization */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="text-center mb-6">
            <div className="text-sm text-slate-500">Total Value</div>
            <div className="text-3xl font-bold">
              $
              {totalValue.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          {/* Allocation Bar */}
          <div className="h-8 rounded-lg overflow-hidden flex mb-4">
            {portfolio.map((asset, i) => {
              const colors = [
                "bg-blue-500",
                "bg-purple-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-red-500",
              ];
              return (
                <div
                  key={i}
                  className={`${colors[i % colors.length]} flex items-center justify-center text-white text-xs font-bold`}
                  style={{ width: `${asset.allocation}%` }}
                >
                  {asset.allocation > 10 ? asset.token.symbol : ""}
                </div>
              );
            })}
          </div>

          {/* Asset List */}
          <div className="space-y-2">
            {portfolio.map((asset, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{asset.token.icon}</span>
                  <div>
                    <div className="font-semibold">{asset.token.symbol}</div>
                    <div className="text-xs text-slate-500">
                      {asset.balance.toFixed(4)} tokens
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">
                    $
                    {asset.value.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-xs text-slate-500">
                    {asset.allocation}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DataPreview
          title="createMockPortfolio(5)"
          data={portfolio}
          code={`import { createMockPortfolio } from '../lib/mock-data';

const portfolio = createMockPortfolio(5); // 5 random tokens`}
        />
      </div>
    );
  },
};

export const TradesGenerator: Story = {
  name: "📈 Trades Generator",
  render: () => {
    const trades = createMockTrades(5);

    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Trades Generator</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Generate mock trade records with various order types and statuses.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left px-4 py-3">Pair</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-t border-slate-200 dark:border-slate-700"
                >
                  <td className="px-4 py-3 font-mono font-semibold">
                    {trade.pair}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        trade.type === "buy"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    $
                    {trade.price.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {trade.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        trade.status === "filled"
                          ? "bg-green-100 text-green-700"
                          : trade.status === "open"
                            ? "bg-blue-100 text-blue-700"
                            : trade.status === "cancelled"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {trade.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {formatRelativeTime(trade.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DataPreview
          title="createMockTrades(5)"
          data={trades}
          code={`import { createMockTrades } from '../lib/mock-data';

const trades = createMockTrades(5); // 5 random trades`}
        />
      </div>
    );
  },
};

export const OrderBookGenerator: Story = {
  name: "📕 Order Book Generator",
  render: () => {
    const orderBook = createMockOrderBook(3456.78);

    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Order Book Generator</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Generate realistic order books with bid/ask levels and depth
            visualization.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Bids */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 font-semibold text-green-700 dark:text-green-400">
              Bids (Buy Orders)
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {orderBook.bids.map((bid, i) => (
                <div key={i} className="relative px-4 py-2">
                  <div
                    className="absolute inset-y-0 left-0 bg-green-100 dark:bg-green-900/30"
                    style={{ width: `${bid.depth}%` }}
                  />
                  <div className="relative flex justify-between text-sm font-mono">
                    <span className="text-green-600">
                      ${bid.price.toFixed(2)}
                    </span>
                    <span>{bid.amount.toFixed(4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asks */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 font-semibold text-red-700 dark:text-red-400">
              Asks (Sell Orders)
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {orderBook.asks.map((ask, i) => (
                <div key={i} className="relative px-4 py-2">
                  <div
                    className="absolute inset-y-0 right-0 bg-red-100 dark:bg-red-900/30"
                    style={{ width: `${ask.depth}%` }}
                  />
                  <div className="relative flex justify-between text-sm font-mono">
                    <span className="text-red-600">
                      ${ask.price.toFixed(2)}
                    </span>
                    <span>{ask.amount.toFixed(4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DataPreview
          title="createMockOrderBook(3456.78)"
          data={orderBook}
          code={`import { createMockOrderBook } from '../lib/mock-data';

const orderBook = createMockOrderBook(3456.78); // mid price
// Returns: { bids: [...], asks: [...] }`}
        />
      </div>
    );
  },
};

export const CandlestickGenerator: Story = {
  name: "🕯️ Candlestick Generator",
  render: () => {
    const candles = createMockCandlesticks(3400, 20, 60);

    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Candlestick Generator</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Generate OHLCV candlestick data for charts.
          </p>
        </div>

        {/* Simple Candle Visualization */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-end gap-1 h-48">
            {candles.map((candle, i) => {
              const isGreen = candle.close >= candle.open;
              const height = Math.abs(candle.close - candle.open) / 10 + 10;
              return (
                <div
                  key={i}
                  className={`flex-1 ${isGreen ? "bg-green-500" : "bg-red-500"} rounded-sm`}
                  style={{ height: `${height}px` }}
                  title={`O: ${candle.open} H: ${candle.high} L: ${candle.low} C: ${candle.close}`}
                />
              );
            })}
          </div>
          <div className="text-center text-sm text-slate-500 mt-4">
            Simplified candlestick visualization (hover for OHLC)
          </div>
        </div>

        <DataPreview
          title="createMockCandlesticks(3400, 20, 60)"
          data={candles.slice(0, 5)}
          code={`import { createMockCandlesticks } from '../lib/mock-data';

const candles = createMockCandlesticks(
  3400,  // starting price
  100,   // number of candles
  60     // interval in minutes
);`}
        />
      </div>
    );
  },
};

// =============================================================================
// PRESET DATA STORIES
// =============================================================================

export const DashboardPreset: Story = {
  name: "📊 Dashboard Data Preset",
  render: () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Dashboard Data Preset</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Complete data package for the Dashboard page including user,
          portfolio, trades, and notifications.
        </p>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg mb-6">
        <code className="text-sm text-purple-600 dark:text-purple-400">
          import mockData from '../lib/mock-data';
          <br />
          const dashboard = mockData.dashboard;
        </code>
      </div>

      <DataPreview
        title="mockData.dashboard"
        data={mockData.dashboard}
        code={`import mockData from '../lib/mock-data';

const { user, portfolio, trades, notifications } = mockData.dashboard;`}
      />
    </div>
  ),
};

export const TradingPreset: Story = {
  name: "📈 Trading Data Preset",
  render: () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Trading Data Preset</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Complete data package for the Trading page including order book,
          candlesticks, and open orders.
        </p>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg mb-6">
        <code className="text-sm text-purple-600 dark:text-purple-400">
          import mockData from '../lib/mock-data';
          <br />
          const trading = mockData.trading;
        </code>
      </div>

      <DataPreview
        title="mockData.trading"
        data={{
          ...mockData.trading,
          orderBook: {
            bids: mockData.trading.orderBook.bids.slice(0, 3),
            asks: mockData.trading.orderBook.asks.slice(0, 3),
          },
          candlesticks: `[${mockData.trading.candlesticks.length} candles...]`,
        }}
        code={`import mockData from '../lib/mock-data';

const { pair, price, orderBook, candlesticks, openOrders } = mockData.trading;`}
      />
    </div>
  ),
};
