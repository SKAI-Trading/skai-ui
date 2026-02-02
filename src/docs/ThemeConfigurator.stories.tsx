import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { useState } from "react";
import {
  Copy,
  Check,
  Palette,
  Type,
  Ruler,
  Moon,
  Sun,
  RefreshCw,
} from "lucide-react";

// =============================================================================
// THEME CONFIGURATOR - Visual Design Token Editor
// =============================================================================

interface ColorToken {
  name: string;
  variable: string;
  value: string;
  category: string;
}

interface SpacingToken {
  name: string;
  value: string;
  pixels: number;
}

const defaultColors: ColorToken[] = [
  // Brand Colors
  {
    name: "SKAI Green",
    variable: "--skai-green",
    value: "#17F9B4",
    category: "brand",
  },
  {
    name: "Sky Blue",
    variable: "--sky-blue",
    value: "#56C7F3",
    category: "brand",
  },
  {
    name: "Printers Gold",
    variable: "--printers-gold",
    value: "#999966",
    category: "brand",
  },

  // Backgrounds
  {
    name: "Background",
    variable: "--background",
    value: "#001615",
    category: "background",
  },
  {
    name: "Card",
    variable: "--card",
    value: "#122524",
    category: "background",
  },
  {
    name: "Muted",
    variable: "--muted",
    value: "#123F3C",
    category: "background",
  },

  // Text
  {
    name: "Foreground",
    variable: "--foreground",
    value: "#FFFFFF",
    category: "text",
  },
  {
    name: "Muted Foreground",
    variable: "--muted-foreground",
    value: "#95A09F",
    category: "text",
  },

  // Semantic
  {
    name: "Success",
    variable: "--success",
    value: "#17F9B4",
    category: "semantic",
  },
  {
    name: "Destructive",
    variable: "--destructive",
    value: "#FF574A",
    category: "semantic",
  },
  {
    name: "Warning",
    variable: "--warning",
    value: "#FFFF16",
    category: "semantic",
  },

  // Border
  {
    name: "Border",
    variable: "--border",
    value: "#123F3C",
    category: "border",
  },
  { name: "Ring", variable: "--ring", value: "#17F9B4", category: "border" },
];

const spacingTokens: SpacingToken[] = [
  { name: "0", value: "0px", pixels: 0 },
  { name: "1", value: "4px", pixels: 4 },
  { name: "2", value: "8px", pixels: 8 },
  { name: "3", value: "12px", pixels: 12 },
  { name: "4", value: "16px", pixels: 16 },
  { name: "5", value: "20px", pixels: 20 },
  { name: "6", value: "24px", pixels: 24 },
  { name: "8", value: "32px", pixels: 32 },
  { name: "10", value: "40px", pixels: 40 },
  { name: "12", value: "48px", pixels: 48 },
  { name: "16", value: "64px", pixels: 64 },
  { name: "20", value: "80px", pixels: 80 },
  { name: "24", value: "96px", pixels: 96 },
];

const typographyTokens = [
  {
    name: "headline-2",
    size: "82px",
    lineHeight: "90px",
    weight: "300",
    font: "Cormorant Garamond",
  },
  {
    name: "headline-3",
    size: "54px",
    lineHeight: "60px",
    weight: "300",
    font: "Cormorant Garamond",
  },
  {
    name: "super-headline",
    size: "32px",
    lineHeight: "42px",
    weight: "500",
    font: "Manrope",
  },
  {
    name: "sub-headline-1",
    size: "24px",
    lineHeight: "32px",
    weight: "600",
    font: "Manrope",
  },
  {
    name: "sub-headline-2",
    size: "20px",
    lineHeight: "28px",
    weight: "600",
    font: "Manrope",
  },
  {
    name: "sub-headline-3",
    size: "18px",
    lineHeight: "26px",
    weight: "600",
    font: "Manrope",
  },
  {
    name: "paragraph-1",
    size: "16px",
    lineHeight: "24px",
    weight: "400",
    font: "Manrope",
  },
  {
    name: "paragraph-2",
    size: "14px",
    lineHeight: "20px",
    weight: "400",
    font: "Manrope",
  },
  {
    name: "label-1",
    size: "12px",
    lineHeight: "16px",
    weight: "500",
    font: "Mulish",
  },
  {
    name: "label-2",
    size: "10px",
    lineHeight: "14px",
    weight: "500",
    font: "Mulish",
  },
];

const radiusTokens = [
  { name: "none", value: "0px" },
  { name: "sm", value: "4px" },
  { name: "md", value: "6px" },
  { name: "lg", value: "8px" },
  { name: "xl", value: "12px" },
  { name: "2xl", value: "16px" },
  { name: "full", value: "9999px" },
];

// =============================================================================
// COLOR PICKER COMPONENT
// =============================================================================

const ColorPicker = ({
  token,
  onChange,
}: {
  token: ColorToken;
  onChange: (value: string) => void;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:border-skai-green/50 transition-colors">
      <div className="relative">
        <input
          type="color"
          value={token.value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer border-2 border-border"
          style={{ backgroundColor: token.value }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-foreground">{token.name}</div>
        <div className="text-xs text-muted-foreground font-mono">
          {token.variable}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
          {token.value}
        </code>
        <button
          onClick={() => copyToClipboard(token.value)}
          className="p-1.5 hover:bg-muted rounded transition-colors"
          title="Copy value"
        >
          {copied ? (
            <Check className="w-4 h-4 text-skai-green" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// THEME CONFIGURATOR COMPONENT
// =============================================================================

const ThemeConfigurator = () => {
  const [colors, setColors] = useState<ColorToken[]>(defaultColors);
  const [activeTab, setActiveTab] = useState<
    "colors" | "typography" | "spacing" | "radius"
  >("colors");
  const [isDark, setIsDark] = useState(true);
  const [exportFormat, setExportFormat] = useState<"css" | "tailwind" | "json">(
    "css",
  );

  // Apply theme when isDark changes
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const updateColor = (variable: string, value: string) => {
    setColors((prev) =>
      prev.map((c) => (c.variable === variable ? { ...c, value } : c)),
    );
    // Apply to document for live preview
    document.documentElement.style.setProperty(variable, value);
  };

  const resetColors = () => {
    setColors(defaultColors);
    defaultColors.forEach((c) => {
      document.documentElement.style.removeProperty(c.variable);
    });
  };

  const exportTheme = () => {
    let output = "";

    if (exportFormat === "css") {
      output = `:root {\n${colors.map((c) => `  ${c.variable}: ${c.value};`).join("\n")}\n}`;
    } else if (exportFormat === "tailwind") {
      output = `// tailwind.config.ts\ncolors: {\n${colors
        .map((c) => `  "${c.variable.replace("--", "")}": "${c.value}",`)
        .join("\n")}\n}`;
    } else {
      output = JSON.stringify(
        colors.reduce((acc, c) => ({ ...acc, [c.variable]: c.value }), {}),
        null,
        2,
      );
    }

    navigator.clipboard.writeText(output);
    alert("Theme exported to clipboard!");
  };

  const groupedColors = colors.reduce(
    (acc, color) => {
      if (!acc[color.category]) acc[color.category] = [];
      acc[color.category].push(color);
      return acc;
    },
    {} as Record<string, ColorToken[]>,
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Palette className="w-6 h-6 text-skai-green" />
            Theme Configurator
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize design tokens and export for production
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
            title="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={resetColors}
            className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
            title="Reset to defaults"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <select
            value={exportFormat}
            onChange={(e) =>
              setExportFormat(e.target.value as "css" | "tailwind" | "json")
            }
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
          >
            <option value="css">CSS Variables</option>
            <option value="tailwind">Tailwind Config</option>
            <option value="json">JSON</option>
          </select>
          <button
            onClick={exportTheme}
            className="px-4 py-2 bg-skai-green text-black rounded-lg font-medium text-sm hover:bg-skai-green/90 transition-colors"
          >
            Export Theme
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-card rounded-lg w-fit">
        {[
          { id: "colors", label: "Colors", icon: Palette },
          { id: "typography", label: "Typography", icon: Type },
          { id: "spacing", label: "Spacing", icon: Ruler },
          { id: "radius", label: "Radius", icon: Ruler },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-skai-green text-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeTab === "colors" && (
          <>
            {Object.entries(groupedColors).map(([category, categoryColors]) => (
              <div key={category}>
                <h2 className="text-lg font-semibold capitalize mb-4">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryColors.map((color) => (
                    <ColorPicker
                      key={color.variable}
                      token={color}
                      onChange={(value) => updateColor(color.variable, value)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === "typography" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Typography Scale</h2>
            <div className="space-y-3">
              {typographyTokens.map((type) => (
                <div
                  key={type.name}
                  className="p-4 bg-card rounded-lg border border-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div
                        className="text-foreground mb-2"
                        style={{
                          fontSize: type.size,
                          lineHeight: type.lineHeight,
                          fontWeight: type.weight,
                          fontFamily: type.font,
                        }}
                      >
                        The quick brown fox
                      </div>
                      <code className="text-xs text-skai-green font-mono">
                        text-{type.name}
                      </code>
                    </div>
                    <div className="text-right text-xs text-muted-foreground font-mono shrink-0">
                      <div>
                        {type.size} / {type.lineHeight}
                      </div>
                      <div>
                        {type.weight} • {type.font}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "spacing" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Spacing Scale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {spacingTokens.map((space) => (
                <div
                  key={space.name}
                  className="flex items-center gap-4 p-3 bg-card rounded-lg border border-border"
                >
                  <div
                    className="bg-skai-green/30 border border-skai-green rounded"
                    style={{ width: space.pixels, height: 32, minWidth: 4 }}
                  />
                  <div className="flex-1">
                    <code className="text-sm font-mono text-foreground">
                      spacing-{space.name}
                    </code>
                  </div>
                  <code className="text-xs text-muted-foreground font-mono">
                    {space.value}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "radius" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Border Radius</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {radiusTokens.map((radius) => (
                <div
                  key={radius.name}
                  className="flex flex-col items-center gap-3 p-4 bg-card rounded-lg border border-border"
                >
                  <div
                    className="w-16 h-16 bg-skai-green/30 border-2 border-skai-green"
                    style={{ borderRadius: radius.value }}
                  />
                  <div className="text-center">
                    <code className="text-sm font-mono text-foreground block">
                      rounded-{radius.name}
                    </code>
                    <code className="text-xs text-muted-foreground font-mono">
                      {radius.value}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Preview */}
      <div className="mt-12 p-6 bg-card rounded-xl border border-border">
        <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-2 bg-skai-green text-black rounded-lg font-medium">
            Primary Button
          </button>
          <button className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium border border-border">
            Secondary Button
          </button>
          <button className="px-4 py-2 bg-destructive text-white rounded-lg font-medium">
            Destructive Button
          </button>
          <div className="col-span-full p-4 bg-muted rounded-lg">
            <div className="text-foreground font-medium">Card Title</div>
            <div className="text-muted-foreground text-sm mt-1">
              This is how your components will look with the current theme.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// STORYBOOK CONFIG
// =============================================================================

const meta: Meta = {
  title: "Design System/Theme Configurator",
  component: ThemeConfigurator,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Theme Configurator

Visual editor for customizing all design tokens in the SKAI design system.

## Features
- **Live Color Editing** - Pick colors and see changes in real-time
- **Typography Preview** - See all type scales with actual fonts
- **Spacing Visualization** - Visual representation of spacing scale
- **Export Options** - Export as CSS, Tailwind config, or JSON
- **Reset Capability** - Return to default SKAI theme

## Usage
1. Click on any color to open the color picker
2. Adjust values and see live preview
3. Export your customizations in your preferred format
4. Copy the output into your project's theme configuration

## For Designers
Use this tool to experiment with color variations before implementing in Figma.
All tokens here match exactly what's available in production.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ThemeConfigurator />,
};
