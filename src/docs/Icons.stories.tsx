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
import { Input } from "../components/input";

const meta: Meta = {
  title: "Design Tokens/Icons",
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
      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors cursor-pointer"
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
      const matchesSearch = icon.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === "all" || icon.category === category;
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="p-8 bg-background min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Icons</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Click any icon to copy its import statement. We use{" "}
            <a
              href="https://lucide.dev/icons"
              target="_blank"
              className="text-primary hover:underline"
            >
              Lucide React
            </a>
            .
          </p>

          <div className="flex gap-4 mb-8 flex-wrap">
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
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

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {filtered.map(({ name, icon: Icon }) => (
              <IconCard key={name} name={name} Icon={Icon} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No icons found matching "{search}"
            </p>
          )}

          <div className="mt-12 p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Usage</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
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
    <div className="p-8 bg-background">
      <h1 className="text-3xl font-bold mb-8">Icon Sizes</h1>
      <div className="flex items-end gap-8 flex-wrap">
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
    <div className="p-8 bg-background">
      <h1 className="text-3xl font-bold mb-8">Trading Icon Examples</h1>
      <div className="grid gap-6 max-w-2xl">
        <div className="p-4 bg-card rounded-lg border flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="font-medium">Price Up</p>
            <p className="text-sm text-muted-foreground">
              Green background + icon
            </p>
          </div>
        </div>

        <div className="p-4 bg-card rounded-lg border flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-medium">Price Down</p>
            <p className="text-sm text-muted-foreground">
              Red background + icon
            </p>
          </div>
        </div>

        <div className="p-4 bg-card rounded-lg border flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Repeat className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Swap</p>
            <p className="text-sm text-muted-foreground">
              Primary color for actions
            </p>
          </div>
        </div>

        <div className="p-4 bg-card rounded-lg border flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="font-medium">Warning</p>
            <p className="text-sm text-muted-foreground">
              High slippage, price impact
            </p>
          </div>
        </div>

        <div className="p-4 bg-card rounded-lg border flex items-center gap-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <div>
            <p className="font-medium">Loading State</p>
            <p className="text-sm text-muted-foreground">
              Spinner with animate-spin
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
