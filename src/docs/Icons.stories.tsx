import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Flame,
  Gift,
  Globe,
  Heart,
  HelpCircle,
  History,
  Home,
  Image,
  Info,
  Layers,
  LineChart,
  Link,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Menu,
  Minus,
  Moon,
  MoreHorizontal,
  MoreVertical,
  PieChart,
  Plus,
  RefreshCw,
  Repeat,
  Search,
  Send,
  Settings,
  Share,
  Shield,
  Star,
  Sun,
  TrendingDown,
  TrendingUp,
  Trophy,
  Unlock,
  Upload,
  User,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { Input } from "../components/core/input";

const meta: Meta = {
  title: "Brand/Icon Library",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

const allIcons = [
  // Navigation
  { name: "Home", icon: Home, category: "Navigation" },
  { name: "Menu", icon: Menu, category: "Navigation" },
  { name: "Search", icon: Search, category: "Navigation" },
  { name: "Settings", icon: Settings, category: "Navigation" },
  { name: "LogOut", icon: LogOut, category: "Navigation" },
  { name: "ExternalLink", icon: ExternalLink, category: "Navigation" },
  { name: "Link", icon: Link, category: "Navigation" },

  // Arrows
  { name: "ArrowUp", icon: ArrowUp, category: "Arrows" },
  { name: "ArrowDown", icon: ArrowDown, category: "Arrows" },
  { name: "ArrowLeft", icon: ArrowLeft, category: "Arrows" },
  { name: "ArrowRight", icon: ArrowRight, category: "Arrows" },
  { name: "ArrowUpDown", icon: ArrowUpDown, category: "Arrows" },
  { name: "ChevronUp", icon: ChevronUp, category: "Arrows" },
  { name: "ChevronDown", icon: ChevronDown, category: "Arrows" },
  { name: "ChevronLeft", icon: ChevronLeft, category: "Arrows" },
  { name: "ChevronRight", icon: ChevronRight, category: "Arrows" },

  // Trading
  { name: "TrendingUp", icon: TrendingUp, category: "Trading" },
  { name: "TrendingDown", icon: TrendingDown, category: "Trading" },
  { name: "DollarSign", icon: DollarSign, category: "Trading" },
  { name: "BarChart3", icon: BarChart3, category: "Trading" },
  { name: "LineChart", icon: LineChart, category: "Trading" },
  { name: "PieChart", icon: PieChart, category: "Trading" },
  { name: "Repeat", icon: Repeat, category: "Trading" },
  { name: "Wallet", icon: Wallet, category: "Trading" },
  { name: "CreditCard", icon: CreditCard, category: "Trading" },
  { name: "Zap", icon: Zap, category: "Trading" },
  { name: "Flame", icon: Flame, category: "Trading" },

  // Actions
  { name: "Plus", icon: Plus, category: "Actions" },
  { name: "Minus", icon: Minus, category: "Actions" },
  { name: "X", icon: X, category: "Actions" },
  { name: "Check", icon: Check, category: "Actions" },
  { name: "Copy", icon: Copy, category: "Actions" },
  { name: "Edit", icon: Edit, category: "Actions" },
  { name: "Download", icon: Download, category: "Actions" },
  { name: "Upload", icon: Upload, category: "Actions" },
  { name: "Share", icon: Share, category: "Actions" },
  { name: "Send", icon: Send, category: "Actions" },
  { name: "RefreshCw", icon: RefreshCw, category: "Actions" },
  { name: "Filter", icon: Filter, category: "Actions" },

  // Status
  { name: "AlertCircle", icon: AlertCircle, category: "Status" },
  { name: "AlertTriangle", icon: AlertTriangle, category: "Status" },
  { name: "Info", icon: Info, category: "Status" },
  { name: "HelpCircle", icon: HelpCircle, category: "Status" },
  { name: "Check", icon: Check, category: "Status" },
  { name: "Loader2", icon: Loader2, category: "Status" },
  { name: "Circle", icon: Circle, category: "Status" },

  // User
  { name: "User", icon: User, category: "User" },
  { name: "Users", icon: Users, category: "User" },
  { name: "Mail", icon: Mail, category: "User" },
  { name: "Bell", icon: Bell, category: "User" },
  { name: "Heart", icon: Heart, category: "User" },
  { name: "Star", icon: Star, category: "User" },
  { name: "Trophy", icon: Trophy, category: "User" },
  { name: "Gift", icon: Gift, category: "User" },

  // Security
  { name: "Lock", icon: Lock, category: "Security" },
  { name: "Unlock", icon: Unlock, category: "Security" },
  { name: "Shield", icon: Shield, category: "Security" },
  { name: "Eye", icon: Eye, category: "Security" },
  { name: "EyeOff", icon: EyeOff, category: "Security" },

  // UI
  { name: "MoreHorizontal", icon: MoreHorizontal, category: "UI" },
  { name: "MoreVertical", icon: MoreVertical, category: "UI" },
  { name: "Sun", icon: Sun, category: "UI" },
  { name: "Moon", icon: Moon, category: "UI" },
  { name: "Globe", icon: Globe, category: "UI" },
  { name: "Image", icon: Image, category: "UI" },
  { name: "Calendar", icon: Calendar, category: "UI" },
  { name: "Clock", icon: Clock, category: "UI" },
  { name: "History", icon: History, category: "UI" },
  { name: "Layers", icon: Layers, category: "UI" },
  { name: "BookOpen", icon: BookOpen, category: "UI" },
];

const IconCard = ({
  name,
  Icon,
}: {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
}) => {
  const [copied, setCopied] = useState(false);

  const copyImport = () => {
    navigator.clipboard.writeText(`import { ${name} } from "lucide-react";`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copyImport}
      className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs text-muted-foreground">
        {copied ? "✓ Copied!" : name}
      </span>
    </button>
  );
};

export const AllIcons: StoryObj = {
  name: "All Icons",
  render: () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    const categories = ["all", ...new Set(allIcons.map((i) => i.category))];

    const filtered = allIcons.filter((icon) => {
      const matchesSearch = icon.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || icon.category === category;
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-4xl font-bold">Icons</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Click any icon to copy its import statement. We use{" "}
            <a
              href="https://lucide.dev/icons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Lucide React
            </a>
            .
          </p>

          <div className="mb-8 flex flex-wrap gap-4">
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {filtered.map(({ name, icon: Icon }) => (
              <IconCard key={name} name={name} Icon={Icon} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              No icons found matching "{search}"
            </p>
          )}

          <div className="mt-12 rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Usage</h3>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              {`import { Wallet, TrendingUp, Copy } from "lucide-react";

// Default size (24px)
<Wallet />

// Custom size
<TrendingUp className="h-8 w-8" />

// With color
<Copy className="h-4 w-4 text-muted-foreground" />

// In a button
<Button>
  <Wallet className="mr-2 h-4 w-4" />
  Connect Wallet
</Button>`}
            </pre>
          </div>
        </div>
      </div>
    );
  },
};

export const IconSizes: StoryObj = {
  name: "Icon Sizes",
  render: () => (
    <div className="bg-background p-8">
      <h1 className="mb-8 text-3xl font-bold">Icon Sizes</h1>
      <div className="flex flex-wrap items-end gap-8">
        {[
          { size: "h-3 w-3", label: "12px (xs)" },
          { size: "h-4 w-4", label: "16px (sm)" },
          { size: "h-5 w-5", label: "20px (md)" },
          { size: "h-6 w-6", label: "24px (default)" },
          { size: "h-8 w-8", label: "32px (lg)" },
          { size: "h-10 w-10", label: "40px (xl)" },
          { size: "h-12 w-12", label: "48px (2xl)" },
        ].map(({ size, label }) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Wallet className={size} />
            <span className="text-xs text-muted-foreground">{label}</span>
            <code className="text-xs text-muted-foreground">{size}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const TradingIcons: StoryObj = {
  name: "Trading Icons",
  render: () => (
    <div className="bg-background p-8">
      <h1 className="mb-8 text-3xl font-bold">Trading Icon Examples</h1>
      <div className="grid max-w-2xl gap-6">
        <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="font-medium">Price Up</p>
            <p className="text-sm text-muted-foreground">Green background + icon</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-medium">Price Down</p>
            <p className="text-sm text-muted-foreground">Red background + icon</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Repeat className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Swap</p>
            <p className="text-sm text-muted-foreground">Primary color for actions</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="font-medium">Warning</p>
            <p className="text-sm text-muted-foreground">High slippage, price impact</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <div>
            <p className="font-medium">Loading State</p>
            <p className="text-sm text-muted-foreground">Spinner with animate-spin</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// SKAI CUSTOM ICONS
// =============================================================================
import { SkaiIcon, SkaiIconName } from "../components/branding/skai-icon";

const skaiIconCategories: Record<string, SkaiIconName[]> = {
  Navigation: [
    "home",
    "menu",
    "close",
    "back",
    "forward",
    "enter",
    "arrow-up",
    "arrow-down",
    "arrow-left",
    "arrow-right",
    "chevron-up",
    "chevron-down",
    "chevron-left",
    "chevron-right",
    "external-link",
    "refresh",
  ],
  Actions: [
    "plus",
    "minus",
    "check",
    "check-enclosed",
    "copy",
    "edit",
    "delete",
    "trash",
    "download",
    "upload",
    "share",
    "save",
    "filter",
    "sort",
    "expand",
    "collapse",
  ],
  Trading: [
    "chart",
    "chart-line",
    "chart-bar",
    "chart-candle",
    "swap",
    "order",
    "limit",
    "market",
    "trending-up",
    "trending-down",
    "percentage",
  ],
  Crypto: [
    "wallet",
    "blockchain",
    "gas",
    "bridge",
    "stake",
    "unstake",
    "token",
    "nft",
    "airdrop",
  ],
  Social: [
    "user",
    "users",
    "message",
    "notification",
    "bell",
    "heart",
    "heart-filled",
    "star",
    "star-filled",
    "bookmark",
    "bookmark-filled",
  ],
  System: [
    "settings",
    "search",
    "lock",
    "unlock",
    "eye",
    "eye-off",
    "info",
    "warning",
    "error",
    "success",
    "help",
    "dot",
    "loading",
    "spinner",
  ],
  Misc: [
    "hot",
    "fire",
    "lightning",
    "clock",
    "calendar",
    "link",
    "qr-code",
    "moon",
    "sun",
    "globe",
    "code",
  ],
  Wallets: ["metamask", "coinbase", "phantom", "walletconnect", "rainbow"],
  Tiers: [
    "tier-free",
    "tier-bronze",
    "tier-silver",
    "tier-gold",
    "tier-platinum",
    "tier-diamond",
  ],
};

export const SkaiCustomIcons: StoryObj = {
  name: "SKAI Custom Icons",
  render: () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

    const categories = ["all", ...Object.keys(skaiIconCategories)];

    const handleCopy = (iconName: string) => {
      navigator.clipboard.writeText(`<SkaiIcon name="${iconName}" />`);
      setCopiedIcon(iconName);
      setTimeout(() => setCopiedIcon(null), 1500);
    };

    const getFilteredIcons = () => {
      let icons: SkaiIconName[] = [];

      if (category === "all") {
        icons = Object.values(skaiIconCategories).flat();
      } else {
        icons = skaiIconCategories[category] || [];
      }

      if (search) {
        icons = icons.filter((icon) =>
          icon.toLowerCase().includes(search.toLowerCase())
        );
      }

      return icons;
    };

    const filteredIcons = getFilteredIcons();

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-4xl font-bold">SKAI Custom Icons</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Custom icons designed for the SKAI ecosystem. Click any icon to copy usage
            code.
          </p>

          <div className="mb-8 flex flex-wrap gap-4">
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {filteredIcons.map((iconName) => (
              <button
                key={iconName}
                onClick={() => handleCopy(iconName)}
                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
              >
                <SkaiIcon name={iconName} size="md" />
                <span className="text-center text-xs text-muted-foreground">
                  {copiedIcon === iconName ? "✓ Copied!" : iconName}
                </span>
              </button>
            ))}
          </div>

          {filteredIcons.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              No icons found matching "{search}"
            </p>
          )}

          <div className="mt-12 rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Usage</h3>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              {`import { SkaiIcon } from "@skai/ui";

// Default size (sm = 16px)
<SkaiIcon name="wallet" />

// Different sizes: xs (10px), sm (16px), md (24px), lg (48px)
<SkaiIcon name="swap" size="md" />
<SkaiIcon name="chart" size="lg" />

// Custom color
<SkaiIcon name="trending-up" color="#10B981" />

// With className for additional styling
<SkaiIcon name="loading" className="animate-spin text-primary" />

// Wallet provider icons (full color)
<SkaiIcon name="metamask" size="md" />

// Tier icons (with gradients)
<SkaiIcon name="tier-gold" size="lg" />`}
            </pre>
          </div>

          <div className="mt-8 rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Icon Counts</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(skaiIconCategories).map(([cat, icons]) => (
                <div key={cat} className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{icons.length}</p>
                  <p className="text-xs text-muted-foreground">{cat}</p>
                </div>
              ))}
              <div className="rounded-lg bg-primary/10 p-3 text-center">
                <p className="text-2xl font-bold text-primary">
                  {Object.values(skaiIconCategories).flat().length}
                </p>
                <p className="text-xs text-muted-foreground">Total Icons</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const SkaiIconSizes: StoryObj = {
  name: "SKAI Icon Sizes",
  render: () => (
    <div className="bg-background p-8">
      <h1 className="mb-8 text-3xl font-bold">SKAI Icon Sizes</h1>
      <div className="flex flex-wrap items-end gap-8">
        {[
          { size: "xs" as const, label: "10px", px: "xs" },
          { size: "sm" as const, label: "16px", px: "sm" },
          { size: "md" as const, label: "24px", px: "md" },
          { size: "lg" as const, label: "48px", px: "lg" },
        ].map(({ size, label, px }) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <SkaiIcon name="wallet" size={size} />
            <span className="text-xs text-muted-foreground">{label}</span>
            <code className="text-xs text-muted-foreground">size="{px}"</code>
          </div>
        ))}
      </div>

      <h2 className="mb-6 mt-12 text-2xl font-bold">Tier Icons</h2>
      <div className="flex flex-wrap items-end gap-6">
        {(
          [
            "tier-free",
            "tier-bronze",
            "tier-silver",
            "tier-gold",
            "tier-platinum",
            "tier-diamond",
          ] as const
        ).map((tier) => (
          <div key={tier} className="flex flex-col items-center gap-2">
            <SkaiIcon name={tier} size="lg" />
            <span className="text-xs capitalize text-muted-foreground">
              {tier.replace("tier-", "")}
            </span>
          </div>
        ))}
      </div>

      <h2 className="mb-6 mt-12 text-2xl font-bold">Wallet Provider Icons</h2>
      <div className="flex flex-wrap items-end gap-6">
        {(["metamask", "coinbase", "phantom", "walletconnect", "rainbow"] as const).map(
          (wallet) => (
            <div key={wallet} className="flex flex-col items-center gap-2">
              <SkaiIcon name={wallet} size="lg" />
              <span className="text-xs capitalize text-muted-foreground">{wallet}</span>
            </div>
          )
        )}
      </div>
    </div>
  ),
};
