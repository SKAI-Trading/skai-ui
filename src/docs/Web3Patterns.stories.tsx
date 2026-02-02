/**
 * Web3 Patterns Documentation
 *
 * Wallet connection flows, transaction states, network handling,
 * and blockchain-specific UI patterns using Thirdweb integration.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import {
  Wallet,
  Check,
  X,
  Loader2,
  ExternalLink,
  Copy,
  ChevronDown,
  AlertTriangle,
  Shield,
  Zap,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const meta: Meta = {
  title: "Documentation/Web3 Patterns",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# 🔗 Web3 UI Patterns

Wallet connection, transaction states, and blockchain UI patterns.

## Tech Stack

- **Thirdweb SDK** - Wallet connection and smart accounts
- **Base L2** - Primary chain (Chain ID: 8453)
- **Gasless Transactions** - EIP-7702/4337 smart accounts

## Key Patterns

1. **Wallet Connection** - Multi-option connect modal
2. **Transaction States** - Pending → Confirmed → Failed
3. **Network Handling** - Chain switching, wrong network
4. **Address Display** - Truncation, ENS, copy
        `,
      },
    },
  },
};

export default meta;

// ============================================================================
// WALLET CONNECT FLOW
// ============================================================================

const walletOptions = [
  {
    name: "Email",
    icon: "📧",
    description: "Sign in with email",
    recommended: true,
  },
  {
    name: "Google",
    icon: "🔵",
    description: "Continue with Google",
  },
  {
    name: "Apple",
    icon: "🍎",
    description: "Continue with Apple",
  },
  {
    name: "MetaMask",
    icon: "🦊",
    description: "Browser extension",
    tag: "Popular",
  },
  {
    name: "Coinbase",
    icon: "🔵",
    description: "Coinbase Wallet",
  },
  {
    name: "WalletConnect",
    icon: "🔗",
    description: "Scan with mobile wallet",
  },
];

export const WalletConnectFlow: StoryObj = {
  render: () => {
    const [step, setStep] = useState<"options" | "connecting" | "connected">(
      "options",
    );
    const [selectedWallet, setSelectedWallet] = useState("");

    const handleConnect = (wallet: string) => {
      setSelectedWallet(wallet);
      setStep("connecting");
      setTimeout(() => setStep("connected"), 2000);
    };

    const handleReset = () => {
      setStep("options");
      setSelectedWallet("");
    };

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Wallet Connect Flow</h2>
          <p className="text-muted-foreground mb-6">
            Multi-step wallet connection with social login options (Thirdweb
            inAppWallet).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: Options */}
          <Card className={step === "options" ? "ring-2 ring-cyan-500" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">1. Choose Method</CardTitle>
                <Badge variant="outline">Current</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleConnect(wallet.name)}
                  disabled={step !== "options"}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors text-left disabled:opacity-50"
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{wallet.name}</span>
                      {wallet.recommended && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                          Recommended
                        </Badge>
                      )}
                      {wallet.tag && (
                        <Badge variant="outline" className="text-xs">
                          {wallet.tag}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {wallet.description}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 rotate-[-90deg] text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Step 2: Connecting */}
          <Card className={step === "connecting" ? "ring-2 ring-cyan-500" : ""}>
            <CardHeader>
              <CardTitle className="text-lg">2. Connecting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                {step === "connecting" ? (
                  <>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Wallet className="h-8 w-8 text-cyan-400" />
                      </div>
                      <div className="absolute inset-0 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Connecting to {selectedWallet}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Approve the connection in your wallet
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a wallet to connect
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Connected */}
          <Card className={step === "connected" ? "ring-2 ring-green-500" : ""}>
            <CardHeader>
              <CardTitle className="text-lg">3. Connected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                {step === "connected" ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-400" />
                    </div>
                    <p className="text-sm font-semibold">Connected!</p>
                    <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg">
                      <code className="text-sm text-cyan-400">
                        0x742d...fE1a
                      </code>
                      <button className="p-1 hover:bg-white/10 rounded">
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Complete connection first
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gasless Badge */}
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-green-400">
                  Gasless Transactions
                </h4>
                <p className="text-sm text-muted-foreground">
                  All transactions are sponsored by SKAI. Users never pay gas
                  fees.
                </p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 ml-auto">
                EIP-7702 / EIP-4337
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// TRANSACTION STATES
// ============================================================================

const txStates = [
  {
    state: "preparing",
    title: "Preparing Transaction",
    description: "Building the transaction...",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    icon: Loader2,
    spin: true,
  },
  {
    state: "pending",
    title: "Confirming",
    description: "Waiting for network confirmation...",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    icon: RefreshCw,
    spin: true,
  },
  {
    state: "confirmed",
    title: "Confirmed",
    description: "Transaction successful!",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    icon: Check,
    spin: false,
  },
  {
    state: "failed",
    title: "Failed",
    description: "Transaction reverted",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    icon: X,
    spin: false,
  },
];

export const TransactionStates: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Transaction States</h2>
        <p className="text-muted-foreground mb-6">
          Visual feedback for blockchain transaction lifecycle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {txStates.map((tx) => (
          <Card key={tx.state} className={tx.bgColor}>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${tx.bgColor} flex items-center justify-center`}
                >
                  <tx.icon
                    className={`h-6 w-6 ${tx.color} ${tx.spin ? "animate-spin" : ""}`}
                  />
                </div>
                <div>
                  <h3 className={`font-semibold ${tx.color}`}>{tx.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tx.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Transaction Modal */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Progress Modal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-black/40 border border-white/10 space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-amber-400 animate-spin" />
              </div>
              <h3 className="text-xl font-bold">Swapping Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Waiting for confirmation...
              </p>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3 p-4 rounded-xl bg-black/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">From</span>
                <span className="font-mono">1.5 ETH</span>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">To</span>
                <span className="font-mono">~3,456 USDC</span>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-2">
              {[
                { label: "Transaction submitted", done: true },
                {
                  label: "Waiting for confirmation",
                  done: false,
                  current: true,
                },
                { label: "Complete", done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.done
                        ? "bg-green-500/20"
                        : step.current
                          ? "bg-amber-500/20"
                          : "bg-white/10"
                    }`}
                  >
                    {step.done ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : step.current ? (
                      <Loader2 className="h-3 w-3 text-amber-400 animate-spin" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/30" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${step.done ? "text-green-400" : step.current ? "text-amber-400" : "text-muted-foreground"}`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Explorer Link */}
            <a
              href="#"
              className="flex items-center justify-center gap-2 text-sm text-cyan-400 hover:underline"
            >
              View on BaseScan
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// NETWORK HANDLING
// ============================================================================

const networks = [
  {
    name: "Base",
    chainId: 8453,
    icon: "🔵",
    status: "active",
    color: "#0052FF",
  },
  {
    name: "Ethereum",
    chainId: 1,
    icon: "⟠",
    status: "available",
    color: "#627EEA",
  },
  {
    name: "Arbitrum",
    chainId: 42161,
    icon: "🔷",
    status: "available",
    color: "#28A0F0",
  },
  {
    name: "Optimism",
    chainId: 10,
    icon: "🔴",
    status: "available",
    color: "#FF0420",
  },
];

export const NetworkHandling: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Network Handling</h2>
        <p className="text-muted-foreground mb-6">
          Chain switching, wrong network detection, and multi-chain support.
        </p>
      </div>

      {/* Network Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Network Selector</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {networks.map((network) => (
              <button
                key={network.chainId}
                className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${
                  network.status === "active"
                    ? "bg-cyan-500/10 border border-cyan-500/30"
                    : "bg-black/20 hover:bg-black/30"
                }`}
              >
                <span className="text-2xl">{network.icon}</span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{network.name}</span>
                    {network.status === "active" && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        Connected
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Chain ID: {network.chainId}
                  </span>
                </div>
                {network.status === "active" && (
                  <Check className="h-5 w-5 text-green-400" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wrong Network Banner */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-400">Wrong Network</h4>
              <p className="text-sm text-muted-foreground">
                Please switch to Base network to use SKAI
              </p>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black">
              Switch to Base
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle>Network Switching Logic</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
// Check and prompt network switch
import { useSwitchChain, useAccount } from 'wagmi';
import { base } from 'viem/chains';

function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { chain } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  
  const isWrongNetwork = chain && chain.id !== base.id;
  
  if (isWrongNetwork) {
    return (
      <div className="p-4 bg-amber-500/10 rounded-lg">
        <p>Please switch to Base network</p>
        <Button 
          onClick={() => switchChain({ chainId: base.id })}
          disabled={isPending}
        >
          {isPending ? 'Switching...' : 'Switch Network'}
        </Button>
      </div>
    );
  }
  
  return children;
}

// Auto-switch on connect
const { connector } = useAccount();

useEffect(() => {
  if (connector && chain?.id !== base.id) {
    switchChain({ chainId: base.id });
  }
}, [connector, chain]);
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// ADDRESS DISPLAY
// ============================================================================

export const AddressDisplay: StoryObj = {
  render: () => {
    const [copied, setCopied] = useState(false);
    const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE1a";

    const handleCopy = () => {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Address Display Patterns</h2>
          <p className="text-muted-foreground mb-6">
            Displaying wallet addresses with truncation, ENS support, and copy
            functionality.
          </p>
        </div>

        {/* Display Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Address Display Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {/* Full Address */}
              <div className="p-4 rounded-lg bg-black/20">
                <span className="text-xs text-muted-foreground block mb-2">
                  Full Address
                </span>
                <code className="text-sm font-mono break-all">{address}</code>
              </div>

              {/* Truncated */}
              <div className="p-4 rounded-lg bg-black/20">
                <span className="text-xs text-muted-foreground block mb-2">
                  Truncated (default)
                </span>
                <code className="text-sm font-mono text-cyan-400">
                  0x742d...fE1a
                </code>
              </div>

              {/* With Copy Button */}
              <div className="p-4 rounded-lg bg-black/20">
                <span className="text-xs text-muted-foreground block mb-2">
                  With Copy Button
                </span>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-cyan-400">
                    0x742d...fE1a
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* ENS Name */}
              <div className="p-4 rounded-lg bg-black/20">
                <span className="text-xs text-muted-foreground block mb-2">
                  ENS Name
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-cyan-400">
                    vitalik.eth
                  </span>
                  <Badge variant="outline" className="text-xs">
                    ENS
                  </Badge>
                </div>
              </div>

              {/* With Avatar */}
              <div className="p-4 rounded-lg bg-black/20">
                <span className="text-xs text-muted-foreground block mb-2">
                  With Avatar
                </span>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://effigy.im/a/0x742d35Cc6634C0532925a3b844Bc9e7595f8fE1a.png" />
                    <AvatarFallback>0x</AvatarFallback>
                  </Avatar>
                  <code className="text-sm font-mono text-cyan-400">
                    0x742d...fE1a
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connected Wallet Badge */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Wallet Badge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {/* Compact */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 hover:border-cyan-500/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <code className="text-sm font-mono">0x742d...fE1a</code>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* With Balance */}
              <button className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-white/10 hover:border-cyan-500/50 transition-colors">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://effigy.im/a/0x742d35Cc6634C0532925a3b844Bc9e7595f8fE1a.png" />
                  <AvatarFallback>0x</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-semibold">0x742d...fE1a</div>
                  <div className="text-xs text-muted-foreground">1.234 ETH</div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* With Username */}
              <button className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-white/10 hover:border-cyan-500/50 transition-colors">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://effigy.im/a/0x742d35Cc6634C0532925a3b844Bc9e7595f8fE1a.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="font-semibold">johndoe</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Code */}
        <Card>
          <CardHeader>
            <CardTitle>Address Utilities</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
              <code className="text-cyan-400">
                {`
// Truncate address
export function truncateAddress(
  address: string,
  startChars = 6,
  endChars = 4
): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return \`\${address.slice(0, startChars)}...\${address.slice(-endChars)}\`;
}

// Copyable address component
interface CopyableAddressProps {
  address: string;
  ensName?: string;
}

export function CopyableAddress({ address, ensName }: CopyableAddressProps) {
  const [copied, setCopied] = useState(false);
  const display = ensName || truncateAddress(address);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 font-mono hover:text-cyan-400 transition-colors"
      title={address}
    >
      <span>{display}</span>
      {copied ? (
        <Check className="h-4 w-4 text-green-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}

// Get avatar URL
export function getAvatarUrl(address: string, ensAvatar?: string): string {
  if (ensAvatar) return ensAvatar;
  return \`https://effigy.im/a/\${address}.png\`;
}
              `.trim()}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// SIGNATURE REQUESTS
// ============================================================================

export const SignatureRequests: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Signature Requests</h2>
        <p className="text-muted-foreground mb-6">
          UI patterns for wallet signature requests (sign-in, messages,
          permits).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sign-In Request */}
        <Card>
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Shield className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Sign in to SKAI</h3>
                <p className="text-sm text-muted-foreground">
                  Sign the message in your wallet to verify ownership
                </p>
              </div>
              <div className="p-3 rounded-lg bg-black/30 text-left">
                <p className="text-xs text-muted-foreground mb-1">
                  Message to sign:
                </p>
                <code className="text-xs text-cyan-400">
                  Sign in to SKAI Trading
                  <br />
                  Timestamp: 1706000000
                  <br />
                  Nonce: abc123
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                This is gasless and doesn't send a transaction
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Token Approval */}
        <Card>
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Approve USDC</h3>
                <p className="text-sm text-muted-foreground">
                  Allow SKAI to spend your USDC for swaps
                </p>
              </div>
              <div className="p-3 rounded-lg bg-black/30 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Token</span>
                  <span>USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span>Unlimited</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spender</span>
                  <code className="text-cyan-400">0x1234...5678</code>
                </div>
              </div>
              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Approve (Gasless)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Show clear context",
                desc: "Always explain what the user is signing and why",
              },
              {
                title: "Display full message",
                desc: "Let users see exactly what they're signing",
              },
              {
                title: "Distinguish tx vs sign",
                desc: "Make clear which actions cost gas",
              },
              {
                title: "Show spender address",
                desc: "For approvals, show the contract being approved",
              },
            ].map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-black/20"
              >
                <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">{tip.title}</span>
                  <p className="text-xs text-muted-foreground">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
