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
} from "../components/data-display/table";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { ArrowUpDown, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";

const meta: Meta<typeof Table> = {
  title: "Patterns/Data Tables",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Table patterns for trading data including positions, transactions, and sortable data with pagination.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data
const invoices = [
  { id: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { id: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { id: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
  { id: "INV004", status: "Paid", method: "Credit Card", amount: "$450.00" },
  { id: "INV005", status: "Paid", method: "PayPal", amount: "$550.00" },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
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

export const WithFooter: Story = {
  name: "With Footer",
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
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$1,750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// Trading data
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

// Transaction history
const transactions = [
  {
    hash: "0x1a2b...3c4d",
    type: "Swap",
    from: "ETH",
    to: "USDC",
    amount: "1.5 ETH",
    value: "$5,185.17",
    time: "2 min ago",
    status: "Confirmed",
  },
  {
    hash: "0x5e6f...7g8h",
    type: "Transfer",
    from: "USDC",
    to: "-",
    amount: "2,500 USDC",
    value: "$2,500.00",
    time: "15 min ago",
    status: "Confirmed",
  },
  {
    hash: "0x9i0j...1k2l",
    type: "Swap",
    from: "BTC",
    to: "ETH",
    amount: "0.1 BTC",
    value: "$6,489.00",
    time: "1 hr ago",
    status: "Pending",
  },
];

export const TransactionHistory: Story = {
  name: "Transaction History",
  render: () => (
    <Table>
      <TableCaption>Recent transactions on Base network</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" size="sm" className="-ml-3 h-8">
              Hash
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Type</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.hash}>
            <TableCell className="cursor-pointer font-mono text-primary hover:underline">
              {tx.hash}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{tx.type}</Badge>
            </TableCell>
            <TableCell>{tx.from}</TableCell>
            <TableCell>{tx.to || "-"}</TableCell>
            <TableCell className="text-right font-mono">{tx.amount}</TableCell>
            <TableCell className="text-right text-muted-foreground">
              {tx.value}
            </TableCell>
            <TableCell>
              <Badge variant={tx.status === "Confirmed" ? "default" : "secondary"}>
                {tx.status}
              </Badge>
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
