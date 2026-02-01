/**
 * Content Guidelines
 *
 * Voice, tone, microcopy, and formatting standards for SKAI.
 * Ensures consistent communication across all interfaces.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import {
  Check,
  X,
  MessageSquare,
  AlertCircle,
  DollarSign,
  Clock,
  Hash,
  Type,
} from "lucide-react";

const meta: Meta = {
  title: "Documentation/Content Guidelines",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# ✍️ Content Guidelines

Consistent voice, tone, and formatting across all SKAI interfaces.

## Voice Principles

1. **Confident** - We know Web3 and DeFi
2. **Clear** - No unnecessary jargon
3. **Helpful** - Guide users to success
4. **Human** - Approachable, not robotic

## Quick Reference

| Context | Tone |
|---------|------|
| Success | Celebratory, encouraging |
| Error | Helpful, solution-focused |
| Warning | Urgent but calm |
| Loading | Reassuring, informative |
        `,
      },
    },
  },
};

export default meta;

// ============================================================================
// VOICE & TONE
// ============================================================================

const voiceExamples = [
  {
    context: "Welcome/Onboarding",
    good: "Welcome to SKAI. Let's set up your wallet in under a minute.",
    bad: "Greetings, esteemed user. Please initiate the wallet configuration process.",
    tone: "Friendly, efficient",
  },
  {
    context: "Success Message",
    good: "Swap complete! You received 1,234.56 USDC",
    bad: "Transaction executed successfully. Tokens transferred.",
    tone: "Celebratory, specific",
  },
  {
    context: "Error Message",
    good: "Swap failed—insufficient ETH for gas. Add 0.001 ETH to continue.",
    bad: "Error: Transaction reverted. Code: INSUFFICIENT_GAS",
    tone: "Helpful, actionable",
  },
  {
    context: "Empty State",
    good: "No trades yet. Ready to make your first swap?",
    bad: "Empty. No data found.",
    tone: "Encouraging, suggestive",
  },
  {
    context: "Loading State",
    good: "Finding the best price across 50+ DEXs...",
    bad: "Please wait...",
    tone: "Informative, reassuring",
  },
  {
    context: "Warning",
    good: "High slippage detected (5%). You might receive fewer tokens.",
    bad: "WARNING: Slippage tolerance exceeded.",
    tone: "Clear, educational",
  },
  {
    context: "Confirmation",
    good: "Swap 1.5 ETH for ~3,456 USDC? This can't be undone.",
    bad: "Do you want to proceed?",
    tone: "Specific, cautionary",
  },
];

export const VoiceAndTone: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Voice & Tone</h2>
        <p className="text-muted-foreground mb-6">
          SKAI speaks with confidence and clarity. We guide users without
          talking down to them.
        </p>
      </div>

      {/* Voice Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Confident",
            description: "We're experts in Web3. We state facts, not doubts.",
            example:
              '"Your funds are secure" not "Your funds should be secure"',
          },
          {
            title: "Clear",
            description: "Plain language over jargon. Explain when needed.",
            example: '"Network fee" not "Gas price in gwei"',
          },
          {
            title: "Helpful",
            description: "Always offer next steps. Never dead ends.",
            example: '"Try again" not just "Failed"',
          },
          {
            title: "Human",
            description: "Warm and approachable. Celebrate wins.",
            example: '"Nice trade! 🎉" not "Transaction successful"',
          },
        ].map((pillar) => (
          <Card
            key={pillar.title}
            className="bg-gradient-to-br from-cyan-500/10 to-transparent"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{pillar.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {pillar.description}
              </p>
              <p className="text-xs italic text-cyan-400">{pillar.example}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Examples */}
      <div className="space-y-4">
        {voiceExamples.map((example, i) => (
          <Card key={i}>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{example.context}</Badge>
                <span className="text-xs text-muted-foreground">
                  Tone: {example.tone}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2 text-green-400">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-semibold">Do</span>
                  </div>
                  <p className="text-sm">{example.good}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2 text-red-400">
                    <X className="h-4 w-4" />
                    <span className="text-sm font-semibold">Don't</span>
                  </div>
                  <p className="text-sm">{example.bad}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  ),
};

// ============================================================================
// MICROCOPY
// ============================================================================

const microcopyPatterns = {
  Buttons: [
    {
      context: "Primary action",
      copy: "Swap Now",
      avoid: "Submit / Click Here",
    },
    { context: "Secondary action", copy: "View Details", avoid: "More" },
    {
      context: "Destructive",
      copy: "Disconnect Wallet",
      avoid: "Delete / Remove",
    },
    { context: "Loading", copy: "Swapping...", avoid: "Please wait" },
    { context: "Disabled", copy: "Enter amount", avoid: "Disabled" },
    { context: "Confirmation", copy: "Confirm Swap", avoid: "OK / Yes" },
  ],
  "Form Labels": [
    { context: "Amount input", copy: "You pay", avoid: "Amount" },
    { context: "Receive preview", copy: "You receive", avoid: "Output" },
    {
      context: "Address input",
      copy: "Wallet address",
      avoid: "Address field",
    },
    {
      context: "Slippage",
      copy: "Max slippage",
      avoid: "Slippage tolerance %",
    },
    { context: "Deadline", copy: "Transaction deadline", avoid: "TTL" },
  ],
  "Empty States": [
    {
      context: "No transactions",
      copy: "No trades yet. Start with a swap!",
      avoid: "No data",
    },
    {
      context: "No results",
      copy: "No tokens found. Try a different search.",
      avoid: "Empty results",
    },
    {
      context: "No notifications",
      copy: "You're all caught up!",
      avoid: "No notifications",
    },
    {
      context: "No balance",
      copy: "Add funds to start trading",
      avoid: "Balance: 0",
    },
  ],
  Tooltips: [
    {
      context: "Gas fee",
      copy: "Network fee paid to process your transaction",
      avoid: "Gas",
    },
    {
      context: "Slippage",
      copy: "Maximum price change you'll accept",
      avoid: "Slippage %",
    },
    {
      context: "Price impact",
      copy: "How much your trade affects the token price",
      avoid: "Impact",
    },
    {
      context: "APY",
      copy: "Projected yearly return based on current rates",
      avoid: "Annual Percentage Yield",
    },
  ],
};

export const Microcopy: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Microcopy Patterns</h2>
        <p className="text-muted-foreground mb-6">
          Short, purposeful text for UI elements. Every word should earn its
          place.
        </p>
      </div>

      {Object.entries(microcopyPatterns).map(([category, patterns]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {patterns.map((pattern, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-black/20 items-center"
                >
                  <span className="text-sm text-muted-foreground">
                    {pattern.context}
                  </span>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <code className="text-sm text-green-400">
                      {pattern.copy}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    <code className="text-sm text-red-400 line-through">
                      {pattern.avoid}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

const numberFormats = [
  {
    type: "Currency (USD)",
    examples: [
      { value: 1234.56, formatted: "$1,234.56", note: "Standard format" },
      {
        value: 0.001234,
        formatted: "$0.00123",
        note: "Show significant digits",
      },
      { value: 1234567.89, formatted: "$1.23M", note: "Abbreviate millions" },
      { value: 1234567890, formatted: "$1.23B", note: "Abbreviate billions" },
    ],
  },
  {
    type: "Crypto Amounts",
    examples: [
      {
        value: 1.23456789,
        formatted: "1.2346 ETH",
        note: "4 decimals for display",
      },
      {
        value: 0.00001234,
        formatted: "0.00001234 ETH",
        note: "Show all for small amounts",
      },
      {
        value: 1234.5,
        formatted: "1,234.50 USDC",
        note: "2 decimals for stablecoins",
      },
      {
        value: 1000000,
        formatted: "1M SKAI",
        note: "Abbreviate large amounts",
      },
    ],
  },
  {
    type: "Percentages",
    examples: [
      { value: 0.0534, formatted: "+5.34%", note: "2 decimals, show +/-" },
      { value: -0.12, formatted: "-12.00%", note: "Red for negative" },
      { value: 0.001, formatted: "+0.10%", note: "Min 2 decimals" },
      { value: 2.5, formatted: "+250%", note: "No decimals for large %" },
    ],
  },
  {
    type: "Gas/Network Fees",
    examples: [
      { value: 0.00015, formatted: "~$0.15", note: "Show as USD estimate" },
      { value: 0.005, formatted: "~$5.00", note: "Prefix with ~" },
      { value: 25, formatted: "25 gwei", note: "Gwei for advanced users" },
    ],
  },
];

export const NumberFormatting: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Number Formatting</h2>
        <p className="text-muted-foreground mb-6">
          Consistent number display across the platform. Always consider context
          and precision.
        </p>
      </div>

      {numberFormats.map((format) => (
        <Card key={format.type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {format.type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {format.examples.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/20"
                >
                  <div className="flex items-center gap-4">
                    <code className="text-sm text-muted-foreground w-32">
                      {ex.value}
                    </code>
                    <span className="text-xl font-mono">{ex.formatted}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {ex.note}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle>Formatting Utilities</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
// Format currency
export function formatCurrency(
  value: number, 
  options?: { compact?: boolean; decimals?: number }
): string {
  const { compact = false, decimals = 2 } = options ?? {};
  
  if (compact) {
    if (value >= 1e9) return \`$\${(value / 1e9).toFixed(2)}B\`;
    if (value >= 1e6) return \`$\${(value / 1e6).toFixed(2)}M\`;
    if (value >= 1e3) return \`$\${(value / 1e3).toFixed(2)}K\`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Format crypto amount
export function formatToken(
  amount: number,
  symbol: string,
  options?: { decimals?: number }
): string {
  const decimals = options?.decimals ?? (symbol === 'USDC' ? 2 : 4);
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
  return \`\${formatted} \${symbol}\`;
}

// Format percentage with color
export function formatPercent(value: number): { text: string; color: string } {
  const sign = value >= 0 ? '+' : '';
  const text = \`\${sign}\${(value * 100).toFixed(2)}%\`;
  const color = value >= 0 ? 'text-green-500' : 'text-red-500';
  return { text, color };
}
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// DATE & TIME
// ============================================================================

const dateFormats = [
  {
    type: "Relative Time",
    examples: [
      { case: "< 1 minute", format: "Just now" },
      { case: "< 1 hour", format: "5m ago, 45m ago" },
      { case: "< 24 hours", format: "2h ago, 23h ago" },
      { case: "< 7 days", format: "2d ago, 6d ago" },
      { case: "> 7 days", format: "Jan 15, 2025" },
    ],
  },
  {
    type: "Absolute Time",
    examples: [
      { case: "Date only", format: "Jan 15, 2025" },
      { case: "Date with time", format: "Jan 15, 2025 at 3:45 PM" },
      { case: "Time only (today)", format: "3:45 PM" },
      { case: "Countdown", format: "2h 15m remaining" },
      { case: "Duration", format: "Executed in 2.3s" },
    ],
  },
];

export const DateTimeFormatting: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Date & Time Formatting</h2>
        <p className="text-muted-foreground mb-6">
          Use relative time for recency, absolute time for precision.
        </p>
      </div>

      {dateFormats.map((format) => (
        <Card key={format.type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {format.type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {format.examples.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/20"
                >
                  <span className="text-sm text-muted-foreground">
                    {ex.case}
                  </span>
                  <code className="text-cyan-400">{ex.format}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle>Time Formatting Utilities</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
import { formatDistanceToNow, format, differenceInSeconds } from 'date-fns';

// Relative time (smart)
export function timeAgo(date: Date): string {
  const seconds = differenceInSeconds(new Date(), date);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return \`\${Math.floor(seconds / 60)}m ago\`;
  if (seconds < 86400) return \`\${Math.floor(seconds / 3600)}h ago\`;
  if (seconds < 604800) return \`\${Math.floor(seconds / 86400)}d ago\`;
  
  return format(date, 'MMM d, yyyy');
}

// Absolute date
export function formatDate(date: Date, includeTime = false): string {
  const pattern = includeTime ? 'MMM d, yyyy \'at\' h:mm a' : 'MMM d, yyyy';
  return format(date, pattern);
}

// Countdown
export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  if (h > 0) return \`\${h}h \${m}m remaining\`;
  if (m > 0) return \`\${m}m \${s}s remaining\`;
  return \`\${s}s remaining\`;
}
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// ADDRESSES & HASHES
// ============================================================================

export const AddressesAndHashes: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          Addresses & Transaction Hashes
        </h2>
        <p className="text-muted-foreground mb-6">
          Display blockchain data in a user-friendly way while maintaining
          accuracy.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Truncation Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {[
              {
                type: "Wallet Address",
                full: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE1a",
                short: "0x742d...fE1a",
                note: "6 chars + 4 chars",
              },
              {
                type: "ENS Name",
                full: "vitalik.eth",
                short: "vitalik.eth",
                note: "Show full ENS",
              },
              {
                type: "Transaction Hash",
                full: "0x8f2a9b7c4d3e1f0a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
                short: "0x8f2a9b...e7f8a",
                note: "8 chars + 5 chars",
              },
              {
                type: "Contract Address",
                full: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
                short: "UNI Token (0x1f98...F984)",
                note: "Include name if known",
              },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-black/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.type}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.note}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Full:</span>
                    <code className="block text-xs font-mono break-all text-muted-foreground">
                      {item.full}
                    </code>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Display:
                    </span>
                    <code className="block text-sm font-mono text-cyan-400">
                      {item.short}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Code */}
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
// Truncate address
export function truncateAddress(
  address: string, 
  startChars = 6, 
  endChars = 4
): string {
  if (address.length <= startChars + endChars) return address;
  return \`\${address.slice(0, startChars)}...\${address.slice(-endChars)}\`;
}

// Truncate with ENS fallback
export function displayAddress(
  address: string,
  ensName?: string
): string {
  if (ensName) return ensName;
  return truncateAddress(address);
}

// Copy address component
function CopyableAddress({ address, ensName }: Props) {
  const display = displayAddress(address, ensName);
  
  return (
    <button
      onClick={() => navigator.clipboard.writeText(address)}
      className="font-mono hover:text-cyan-400 transition-colors"
      title={\`Copy: \${address}\`}
    >
      {display}
    </button>
  );
}
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>

      {/* Link Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>External Link Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {[
              { type: "Transaction", url: "basescan.org/tx/0x...", icon: "↗" },
              { type: "Address", url: "basescan.org/address/0x...", icon: "↗" },
              { type: "Token", url: "basescan.org/token/0x...", icon: "↗" },
              {
                type: "Contract",
                url: "basescan.org/address/0x...#code",
                icon: "↗",
              },
            ].map((link) => (
              <div
                key={link.type}
                className="flex items-center justify-between p-3 rounded-lg bg-black/20"
              >
                <span>{link.type}</span>
                <code className="text-xs text-cyan-400">
                  View on Explorer {link.icon}
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

const errorPatterns = [
  {
    code: "INSUFFICIENT_BALANCE",
    bad: "Error: Insufficient funds",
    good: "Not enough ETH. You need 0.05 ETH more to complete this swap.",
    action: "Add funds",
  },
  {
    code: "SLIPPAGE_EXCEEDED",
    bad: "Transaction failed: slippage",
    good: "Price moved too much. Increase slippage or try a smaller amount.",
    action: "Adjust slippage",
  },
  {
    code: "NETWORK_ERROR",
    bad: "Network error occurred",
    good: "Connection lost. Check your internet and try again.",
    action: "Retry",
  },
  {
    code: "USER_REJECTED",
    bad: "Transaction rejected by user",
    good: "Transaction cancelled. No funds were moved.",
    action: null,
  },
  {
    code: "CONTRACT_ERROR",
    bad: "Execution reverted",
    good: "This swap couldn't complete. Try reducing the amount or contact support.",
    action: "Get help",
  },
  {
    code: "DEADLINE_EXCEEDED",
    bad: "Transaction expired",
    good: "Transaction took too long and expired. Try again with current prices.",
    action: "Retry swap",
  },
];

export const ErrorMessages: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Error Messages</h2>
        <p className="text-muted-foreground mb-6">
          Good error messages explain what happened, why, and how to fix it.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Error Message Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {errorPatterns.map((error, i) => (
              <div key={i} className="p-4 rounded-lg bg-black/20 space-y-3">
                <div className="flex items-center justify-between">
                  <code className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-400">
                    {error.code}
                  </code>
                  {error.action && (
                    <Badge
                      variant="outline"
                      className="text-cyan-400 border-cyan-400/50"
                    >
                      Suggest: {error.action}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-1 text-red-400 text-xs">
                      <X className="h-3 w-3" /> Don't
                    </div>
                    <p className="text-sm">{error.bad}</p>
                  </div>
                  <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-1 text-green-400 text-xs">
                      <Check className="h-3 w-3" /> Do
                    </div>
                    <p className="text-sm">{error.good}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Message Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Error Message Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { check: "Explains what happened", example: '"Swap failed"' },
              {
                check: "Explains why (if known)",
                example: '"...because price moved"',
              },
              {
                check: "Offers a solution",
                example: '"Increase slippage to fix"',
              },
              { check: "Uses human language", example: 'Not "Error 0x432f"' },
              {
                check: "Reassures when safe",
                example: '"No funds were moved"',
              },
              { check: "Provides escape hatch", example: '"Contact support"' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-black/20"
              >
                <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">{item.check}</span>
                  <p className="text-xs text-muted-foreground">
                    {item.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
