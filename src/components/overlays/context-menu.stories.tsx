import type { Meta, StoryObj } from "@storybook/react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuCheckboxItem,
  ContextMenuShortcut,
} from "../overlays/context-menu";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Save As...
          <ContextMenuShortcut>⌘S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>Print...</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

// Trading-specific examples
export const TokenContextMenu: Story = {
  name: "Token Row Actions",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex items-center gap-3 p-4 rounded-lg border cursor-context-menu">
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          E
        </div>
        <div className="flex-1">
          <p className="font-medium">Ethereum</p>
          <p className="text-sm text-muted-foreground">ETH</p>
        </div>
        <div className="text-right">
          <p className="font-mono">$2,145.32</p>
          <p className="text-sm text-green-500">+2.34%</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          💱 Swap ETH
          <ContextMenuShortcut>S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          📤 Send ETH
          <ContextMenuShortcut>T</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>⭐ Add to Favorites</ContextMenuItem>
        <ContextMenuItem>🔔 Set Price Alert</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>📊 View Chart</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>1 Hour</ContextMenuItem>
            <ContextMenuItem>24 Hours</ContextMenuItem>
            <ContextMenuItem>7 Days</ContextMenuItem>
            <ContextMenuItem>30 Days</ContextMenuItem>
            <ContextMenuItem>All Time</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>
          📋 Copy Address
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>🔗 View on Explorer</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const TransactionContextMenu: Story = {
  name: "Transaction Actions",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex items-center gap-3 p-4 rounded-lg border cursor-context-menu">
        <div className="h-8 w-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
          ↔
        </div>
        <div className="flex-1">
          <p className="font-medium">Swap</p>
          <p className="text-sm text-muted-foreground">1.5 ETH → 3,217 USDC</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-green-500">✓ Success</p>
          <p className="text-xs text-muted-foreground">2 min ago</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>🔗 View on Explorer</ContextMenuItem>
        <ContextMenuItem>
          📋 Copy Transaction Hash
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>🔄 Repeat Trade</ContextMenuItem>
        <ContextMenuItem>↩️ Reverse Trade</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>📤 Share</ContextMenuItem>
        <ContextMenuItem>📥 Export Details</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const PortfolioContextMenu: Story = {
  name: "Portfolio Asset Actions",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="p-4 rounded-lg border cursor-context-menu max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Total Balance</span>
          <span className="text-xs px-2 py-0.5 bg-muted rounded">
            👁 Visible
          </span>
        </div>
        <p className="text-3xl font-bold">$12,345.67</p>
        <p className="text-sm text-green-500">+$234.56 (1.94%)</p>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuCheckboxItem checked>
          👁 Show Balance
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>💵 Show in USD</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuItem>📊 View Analytics</ContextMenuItem>
        <ContextMenuItem>📈 Performance Report</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>📤 Export</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>CSV</ContextMenuItem>
            <ContextMenuItem>PDF Report</ContextMenuItem>
            <ContextMenuItem>Tax Report</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>
          🔄 Refresh
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WalletContextMenu: Story = {
  name: "Wallet Actions",
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-context-menu">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
        <span className="font-mono text-sm">0x1234...5678</span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          📋 Copy Address
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>🔗 View on Explorer</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>📤 Send</ContextMenuItem>
        <ContextMenuItem>📥 Receive</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>🌐 Switch Network</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuCheckboxItem checked>Ethereum</ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>Base</ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>Arbitrum</ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>Polygon</ContextMenuCheckboxItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive">
          🔌 Disconnect Wallet
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
