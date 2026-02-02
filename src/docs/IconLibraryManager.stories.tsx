import { useState, useMemo } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as LucideIcons from "lucide-react";
import {
  Search,
  Copy,
  Check,
  Grid,
  List,
  Star,
  Package,
  Code,
} from "lucide-react";

const meta: Meta = {
  title: "Tools/Icon Library Manager",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Browse, search, and customize icons from the Lucide icon library.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Get all Lucide icon names
const allIconNames = Object.keys(LucideIcons).filter(
  (key) =>
    key !== "default" &&
    key !== "createLucideIcon" &&
    typeof (LucideIcons as Record<string, unknown>)[key] === "function",
);

// Icon categories
const iconCategories: Record<string, string[]> = {
  Arrows: [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUpRight",
    "ChevronUp",
    "ChevronDown",
    "ChevronLeft",
    "ChevronRight",
    "MoveUp",
    "MoveDown",
  ],
  Actions: [
    "Plus",
    "Minus",
    "X",
    "Check",
    "Copy",
    "Download",
    "Upload",
    "Trash2",
    "Edit",
    "Settings",
    "Search",
    "Filter",
    "RefreshCw",
  ],
  Media: [
    "Play",
    "Pause",
    "Stop",
    "SkipBack",
    "SkipForward",
    "Volume2",
    "VolumeX",
    "Mic",
    "Camera",
    "Image",
    "Video",
  ],
  Communication: [
    "Mail",
    "MessageSquare",
    "MessageCircle",
    "Bell",
    "Phone",
    "Send",
    "Share",
    "AtSign",
  ],
  Files: [
    "File",
    "FileText",
    "Folder",
    "FolderOpen",
    "FileCode",
    "FileJson",
    "FilePlus",
    "Archive",
  ],
  UI: [
    "Menu",
    "MoreHorizontal",
    "MoreVertical",
    "Grip",
    "GripVertical",
    "Maximize",
    "Minimize",
    "Eye",
    "EyeOff",
  ],
  Social: [
    "Heart",
    "ThumbsUp",
    "ThumbsDown",
    "Star",
    "Users",
    "User",
    "UserPlus",
    "Share2",
  ],
  Finance: [
    "DollarSign",
    "CreditCard",
    "Wallet",
    "TrendingUp",
    "TrendingDown",
    "BarChart",
    "PieChart",
    "Activity",
  ],
  Web3: ["Coins", "Gem", "Shield", "Lock", "Unlock", "Key", "Link", "Globe"],
  Status: [
    "AlertCircle",
    "AlertTriangle",
    "CheckCircle",
    "XCircle",
    "Info",
    "HelpCircle",
    "Clock",
    "Loader2",
  ],
};

interface IconConfig {
  size: number;
  strokeWidth: number;
  color: string;
  fill: string;
  rotation: number;
}

export const Manager: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null,
    );
    const [selectedIcon, setSelectedIcon] = useState<string | null>("Activity");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [favorites, setFavorites] = useState<string[]>([
      "Activity",
      "TrendingUp",
      "Wallet",
      "Shield",
    ]);
    const [copied, setCopied] = useState<string | null>(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [config, setConfig] = useState<IconConfig>({
      size: 24,
      strokeWidth: 2,
      color: "#ffffff",
      fill: "none",
      rotation: 0,
    });

    // Filter icons
    const filteredIcons = useMemo(() => {
      let icons = allIconNames;

      // Filter by search
      if (searchQuery) {
        icons = icons.filter((name) =>
          name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      // Filter by category
      if (selectedCategory) {
        const categoryIcons = iconCategories[selectedCategory] || [];
        icons = icons.filter((name) => categoryIcons.includes(name));
      }

      // Filter by favorites
      if (showFavoritesOnly) {
        icons = icons.filter((name) => favorites.includes(name));
      }

      return icons;
    }, [searchQuery, selectedCategory, showFavoritesOnly, favorites]);

    const toggleFavorite = (iconName: string) => {
      setFavorites((prev) =>
        prev.includes(iconName)
          ? prev.filter((f) => f !== iconName)
          : [...prev, iconName],
      );
    };

    const copyToClipboard = async (text: string, type: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 1500);
      } catch {
        // Clipboard API may fail in some contexts
        console.warn("Clipboard write failed");
      }
    };

    const getReactCode = () => {
      if (!selectedIcon) return "";
      return `import { ${selectedIcon} } from 'lucide-react';

<${selectedIcon}
  size={${config.size}}
  strokeWidth={${config.strokeWidth}}
  color="${config.color}"
  ${config.fill !== "none" ? `fill="${config.fill}"` : ""}
  ${config.rotation !== 0 ? `style={{ transform: 'rotate(${config.rotation}deg)' }}` : ""}
/>`;
    };

    const getSVGCode = () => {
      if (!selectedIcon) return "";
      return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${config.size}"
  height="${config.size}"
  viewBox="0 0 24 24"
  fill="${config.fill}"
  stroke="${config.color}"
  stroke-width="${config.strokeWidth}"
  stroke-linecap="round"
  stroke-linejoin="round"
  ${config.rotation !== 0 ? `transform="rotate(${config.rotation})"` : ""}
>
  <!-- ${selectedIcon} icon paths -->
</svg>`;
    };

    const renderIcon = (
      iconName: string,
      size = 24,
      customConfig?: Partial<IconConfig>,
    ) => {
      const IconComponent = (
        LucideIcons as unknown as Record<
          string,
          React.ComponentType<{
            size?: number;
            strokeWidth?: number;
            color?: string;
            fill?: string;
            style?: React.CSSProperties;
          }>
        >
      )[iconName];
      if (!IconComponent) return null;

      const cfg = { ...config, ...customConfig };
      return (
        <IconComponent
          size={size}
          strokeWidth={cfg.strokeWidth}
          color={cfg.color}
          fill={cfg.fill}
          style={
            cfg.rotation !== 0
              ? { transform: `rotate(${cfg.rotation}deg)` }
              : undefined
          }
        />
      );
    };

    return (
      <div className="min-h-screen bg-background flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Icon Library Manager</h1>
                  <p className="text-sm text-muted-foreground">
                    {allIconNames.length} Lucide icons available
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                    showFavoritesOnly
                      ? "bg-amber-500/20 text-amber-500"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Favorites ({favorites.length})
                </button>
                <div className="flex rounded-lg overflow-hidden border border-border">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search icons..."
                  className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-3 py-2 bg-muted rounded-lg text-sm"
              >
                <option value="">All Categories</option>
                {Object.keys(iconCategories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.keys(iconCategories).map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat ? null : cat)
                  }
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  {cat} ({iconCategories[cat].length})
                </button>
              ))}
            </div>
          </div>

          {/* Icon Grid */}
          <div className="flex-1 overflow-auto p-4">
            <p className="text-sm text-muted-foreground mb-4">
              {filteredIcons.length} icons
            </p>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-8 gap-2">
                {filteredIcons.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => setSelectedIcon(iconName)}
                    className={`relative group aspect-square flex flex-col items-center justify-center p-2 rounded-lg transition-all hover:scale-105 ${
                      selectedIcon === iconName
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-card border border-border hover:border-primary/50"
                    }`}
                  >
                    {renderIcon(iconName, 24, {
                      color: "currentColor",
                      fill: "none",
                      rotation: 0,
                    })}
                    <span className="text-[10px] text-muted-foreground mt-1 truncate w-full text-center">
                      {iconName}
                    </span>
                    {/* Favorite star */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(iconName);
                      }}
                      className={`absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                        favorites.includes(iconName) ? "opacity-100" : ""
                      }`}
                    >
                      <Star
                        className={`w-3 h-3 ${favorites.includes(iconName) ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                      />
                    </button>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredIcons.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => setSelectedIcon(iconName)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      selectedIcon === iconName
                        ? "bg-primary/20 border border-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {renderIcon(iconName, 20, {
                      color: "currentColor",
                      fill: "none",
                      rotation: 0,
                    })}
                    <span className="text-sm">{iconName}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {Object.entries(iconCategories).find(([, icons]) =>
                        icons.includes(iconName),
                      )?.[0] || "Other"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(iconName);
                      }}
                    >
                      <Star
                        className={`w-4 h-4 ${favorites.includes(iconName) ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                      />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Icon Details */}
        {selectedIcon && (
          <div className="w-80 border-l border-border bg-card flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">{selectedIcon}</h2>
              <p className="text-xs text-muted-foreground">
                Category:{" "}
                {Object.entries(iconCategories).find(([, icons]) =>
                  icons.includes(selectedIcon),
                )?.[0] || "Other"}
              </p>
            </div>

            {/* Preview */}
            <div className="p-6 border-b border-border">
              <div
                className="aspect-square rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor:
                    config.color === "#ffffff" ? "#1a1a2e" : "#f5f5f5",
                }}
              >
                {renderIcon(selectedIcon, Math.min(config.size * 3, 120))}
              </div>
            </div>

            {/* Customization */}
            <div className="p-4 space-y-4 flex-1 overflow-auto">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Size
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={12}
                    max={64}
                    value={config.size}
                    onChange={(e) =>
                      setConfig({ ...config, size: Number(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-8">{config.size}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Stroke Width
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0.5}
                    max={4}
                    step={0.5}
                    value={config.strokeWidth}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        strokeWidth: Number(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-8">
                    {config.strokeWidth}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Rotation
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={config.rotation}
                    onChange={(e) =>
                      setConfig({ ...config, rotation: Number(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-8">
                    {config.rotation}°
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Stroke Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.color}
                      onChange={(e) =>
                        setConfig({ ...config, color: e.target.value })
                      }
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.color}
                      onChange={(e) =>
                        setConfig({ ...config, color: e.target.value })
                      }
                      className="flex-1 px-2 py-1 bg-muted rounded text-xs font-mono uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Fill Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.fill === "none" ? "#000000" : config.fill}
                      onChange={(e) =>
                        setConfig({ ...config, fill: e.target.value })
                      }
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => setConfig({ ...config, fill: "none" })}
                      className={`flex-1 px-2 py-1 text-xs rounded ${
                        config.fill === "none"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      None
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="text-xs text-muted-foreground block mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      name: "Default",
                      config: {
                        size: 24,
                        strokeWidth: 2,
                        color: "#ffffff",
                        fill: "none",
                        rotation: 0,
                      },
                    },
                    {
                      name: "Large",
                      config: {
                        size: 48,
                        strokeWidth: 1.5,
                        color: "#ffffff",
                        fill: "none",
                        rotation: 0,
                      },
                    },
                    {
                      name: "Filled",
                      config: {
                        size: 24,
                        strokeWidth: 2,
                        color: "#3B82F6",
                        fill: "#3B82F6",
                        rotation: 0,
                      },
                    },
                    {
                      name: "Thin",
                      config: {
                        size: 24,
                        strokeWidth: 1,
                        color: "#ffffff",
                        fill: "none",
                        rotation: 0,
                      },
                    },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setConfig(preset.config)}
                      className="px-2 py-1 bg-muted rounded text-xs hover:bg-muted/80"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Export */}
            <div className="p-4 border-t border-border space-y-2">
              <button
                onClick={() => copyToClipboard(getReactCode(), "react")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                {copied === "react" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copy React Code
              </button>
              <button
                onClick={() => copyToClipboard(getSVGCode(), "svg")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80"
              >
                {copied === "svg" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Code className="w-4 h-4" />
                )}
                Copy SVG
              </button>
              <button
                onClick={() => copyToClipboard(selectedIcon, "name")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 text-sm"
              >
                {copied === "name" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copy Name
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
};
