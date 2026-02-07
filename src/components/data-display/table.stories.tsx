import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../data-display/table";
import { Badge } from "../core/badge";
import { Button } from "../core/button";
import { TrendingUp, TrendingDown, MoreHorizontal, ArrowUpDown } from "lucide-react";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "A responsive table component for displaying tabular data.",
      },
    },
  },
  tags: ["autodocs", "stable"],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// Trading-specific tables
export const TokenPricesTable: Story = {
  render: () => {
    const tokens = [
      {
        name: "Bitcoin",
        symbol: "BTC",
        price: "$67,432.50",
        change: "+5.23",
        volume: "$32.5B",
        marketCap: "$1.32T",
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        price: "$3,245.80",
        change: "-2.14",
        volume: "$18.2B",
        marketCap: "$390B",
      },
      {
        name: "Solana",
        symbol: "SOL",
        price: "$147.25",
        change: "+8.67",
        volume: "$4.2B",
        marketCap: "$68B",
      },
      {
        name: "USDC",
        symbol: "USDC",
        price: "$1.00",
        change: "+0.01",
        volume: "$8.1B",
        marketCap: "$34B",
      },
      {
        name: "Base",
        symbol: "BASE",
        price: "$2.34",
        change: "+12.45",
        volume: "$1.2B",
        marketCap: "$5.6B",
      },
    ];

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Token</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h Change</TableHead>
            <TableHead className="text-right">24h Volume</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => (
            <TableRow key={token.symbol}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold">
                    {token.symbol[0]}
                  </div>
                  <div>
                    <div className="font-medium">{token.name}</div>
                    <div className="text-xs text-muted-foreground">{token.symbol}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">{token.price}</TableCell>
              <TableCell className="text-right">
                <span
                  className={`flex items-center justify-end gap-1 ${
                    parseFloat(token.change) >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {parseFloat(token.change) >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {token.change}%
                </span>
              </TableCell>
              <TableCell className="text-right">{token.volume}</TableCell>
              <TableCell className="text-right">{token.marketCap}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const TransactionHistoryTable: Story = {
  render: () => {
    const transactions = [
      {
        id: "0x1234...5678",
        type: "Swap",
        from: "1,000 USDC",
        to: "0.0149 ETH",
        time: "2 min ago",
        status: "completed",
      },
      {
        id: "0x2345...6789",
        type: "Send",
        from: "0.5 ETH",
        to: "0x9876...5432",
        time: "1 hour ago",
        status: "completed",
      },
      {
        id: "0x3456...7890",
        type: "Swap",
        from: "500 USDC",
        to: "0.00745 BTC",
        time: "3 hours ago",
        status: "pending",
      },
      {
        id: "0x4567...8901",
        type: "Bridge",
        from: "1 ETH",
        to: "1 ETH (Base)",
        time: "1 day ago",
        status: "completed",
      },
      {
        id: "0x5678...9012",
        type: "Swap",
        from: "2,000 USDC",
        to: "13.6 SOL",
        time: "2 days ago",
        status: "failed",
      },
    ];

    const getStatusBadge = (status: string) => {
      switch (status) {
        case "completed":
          return <Badge className="bg-green-500/20 text-green-500">Completed</Badge>;
        case "pending":
          return <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
        case "failed":
          return <Badge className="bg-red-500/20 text-red-500">Failed</Badge>;
        default:
          return <Badge>{status}</Badge>;
      }
    };

    return (
      <Table>
        <TableCaption>Your recent transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Transaction ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono text-sm">{tx.id}</TableCell>
              <TableCell>
                <Badge variant="outline">{tx.type}</Badge>
              </TableCell>
              <TableCell>{tx.from}</TableCell>
              <TableCell>{tx.to}</TableCell>
              <TableCell className="text-muted-foreground">{tx.time}</TableCell>
              <TableCell className="text-right">{getStatusBadge(tx.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const PortfolioTable: Story = {
  render: () => {
    const holdings = [
      {
        asset: "Ethereum",
        symbol: "ETH",
        amount: "2.4532",
        avgCost: "$2,850",
        currentPrice: "$3,245.80",
        pnl: "+$970.25",
        pnlPercent: "+13.9%",
      },
      {
        asset: "USDC",
        symbol: "USDC",
        amount: "5,432.00",
        avgCost: "$1.00",
        currentPrice: "$1.00",
        pnl: "$0.00",
        pnlPercent: "0%",
      },
      {
        asset: "Bitcoin",
        symbol: "BTC",
        amount: "0.1234",
        avgCost: "$58,000",
        currentPrice: "$67,432.50",
        pnl: "+$1,165.36",
        pnlPercent: "+16.3%",
      },
      {
        asset: "Solana",
        symbol: "SOL",
        amount: "25.5",
        avgCost: "$120.00",
        currentPrice: "$147.25",
        pnl: "+$694.88",
        pnlPercent: "+22.7%",
      },
    ];

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Asset</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Avg Cost</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">P&L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding) => (
            <TableRow key={holding.symbol}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold">
                    {holding.symbol[0]}
                  </div>
                  <div>
                    <div className="font-medium">{holding.asset}</div>
                    <div className="text-xs text-muted-foreground">
                      {holding.symbol}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono">{holding.amount}</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {holding.avgCost}
              </TableCell>
              <TableCell className="text-right">{holding.currentPrice}</TableCell>
              <TableCell className="text-right">
                <div
                  className={
                    parseFloat(holding.pnl.replace(/[$,+]/g, "")) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  <div className="font-medium">{holding.pnl}</div>
                  <div className="text-xs">{holding.pnlPercent}</div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Portfolio Value</TableCell>
            <TableCell className="text-right font-bold">$21,987.58</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  },
};

export const LeaderboardTable: Story = {
  render: () => {
    const traders = [
      {
        rank: 1,
        name: "CryptoWhale",
        address: "0x1234...5678",
        pnl: "+$125,432",
        winRate: "78%",
        trades: 342,
      },
      {
        rank: 2,
        name: "DeFiKing",
        address: "0x2345...6789",
        pnl: "+$98,765",
        winRate: "72%",
        trades: 256,
      },
      {
        rank: 3,
        name: "BaseChad",
        address: "0x3456...7890",
        pnl: "+$76,543",
        winRate: "69%",
        trades: 198,
      },
      {
        rank: 4,
        name: "DiamondHands",
        address: "0x4567...8901",
        pnl: "+$54,321",
        winRate: "65%",
        trades: 421,
      },
      {
        rank: 5,
        name: "MoonBoi",
        address: "0x5678...9012",
        pnl: "+$43,210",
        winRate: "61%",
        trades: 156,
      },
    ];

    const getRankBadge = (rank: number) => {
      switch (rank) {
        case 1:
          return <Badge className="bg-yellow-500/20 text-yellow-500">🥇 1st</Badge>;
        case 2:
          return <Badge className="bg-gray-300/20 text-gray-300">🥈 2nd</Badge>;
        case 3:
          return <Badge className="bg-orange-500/20 text-orange-500">🥉 3rd</Badge>;
        default:
          return <Badge variant="outline">#{rank}</Badge>;
      }
    };

    return (
      <Table>
        <TableCaption>Top traders this month</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Trader</TableHead>
            <TableHead className="text-right">P&L</TableHead>
            <TableHead className="text-right">Win Rate</TableHead>
            <TableHead className="text-right">Trades</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {traders.map((trader) => (
            <TableRow key={trader.address}>
              <TableCell>{getRankBadge(trader.rank)}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{trader.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {trader.address}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-green-500">
                {trader.pnl}
              </TableCell>
              <TableCell className="text-right">{trader.winRate}</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {trader.trades}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

// Trading positions with PnL
const positions = [
  {
    symbol: "ETH/USD",
    side: "Long",
    size: "2.5 ETH",
    entry: "$3,245.00",
    current: "$3,456.78",
    pnl: "+$529.45",
    pnlPercent: "+6.5%",
  },
  {
    symbol: "BTC/USD",
    side: "Short",
    size: "0.15 BTC",
    entry: "$65,420.00",
    current: "$64,890.00",
    pnl: "+$79.50",
    pnlPercent: "+0.8%",
  },
  {
    symbol: "SOL/USD",
    side: "Long",
    size: "45 SOL",
    entry: "$142.50",
    current: "$138.20",
    pnl: "-$193.50",
    pnlPercent: "-3.0%",
  },
];

export const TradingPositions: Story = {
  name: "Trading Positions",
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Side</TableHead>
          <TableHead>Size</TableHead>
          <TableHead className="text-right">Entry</TableHead>
          <TableHead className="text-right">Current</TableHead>
          <TableHead className="text-right">PnL</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => (
          <TableRow key={position.symbol}>
            <TableCell className="font-medium">{position.symbol}</TableCell>
            <TableCell>
              <Badge variant={position.side === "Long" ? "default" : "secondary"}>
                {position.side}
              </Badge>
            </TableCell>
            <TableCell>{position.size}</TableCell>
            <TableCell className="text-right font-mono">{position.entry}</TableCell>
            <TableCell className="text-right font-mono">{position.current}</TableCell>
            <TableCell className="text-right">
              <div
                className={`flex items-center justify-end gap-1 ${position.pnl.startsWith("+") ? "text-green-500" : "text-red-500"}`}
              >
                {position.pnl.startsWith("+") ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-mono">{position.pnl}</span>
                <span className="text-xs">({position.pnlPercent})</span>
              </div>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  name: "Empty State",
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Side</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">PnL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
            No open positions
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

const invoices = [
  { id: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { id: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { id: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
  { id: "INV004", status: "Paid", method: "Credit Card", amount: "$450.00" },
  { id: "INV005", status: "Paid", method: "PayPal", amount: "$550.00" },
];

export const Striped: Story = {
  name: "Striped Rows",
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice, i) => (
          <TableRow key={invoice.id} className={i % 2 === 0 ? "bg-muted/50" : ""}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
