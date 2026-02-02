import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Download,
  Copy,
  Check,
  FileJson,
  FileCode,
  Palette,
} from "lucide-react";
import { Card } from "../components/core/card";
import { Button } from "../components/core/button";

/**
 * # Design Token Exports
 *
 * Export design tokens in multiple formats for use in different tools and platforms.
 */

// All design tokens
const designTokens = {
  colors: {
    brand: {
      "skai-green": "#17F9B4",
      "sky-blue": "#56C7F3",
      "printers-gold": "#999966",
    },
    background: {
      background: "#001615",
      card: "#122524",
      muted: "#123F3C",
      popover: "#122524",
    },
    text: {
      foreground: "#FFFFFF",
      "muted-foreground": "#95A09F",
      "card-foreground": "#FFFFFF",
    },
    semantic: {
      success: "#17F9B4",
      destructive: "#FF574A",
      warning: "#F9A817",
      info: "#56C7F3",
    },
    trading: {
      "profit-green": "#17F9B4",
      "loss-red": "#FF574A",
      "bid-green": "#17F9B4",
      "ask-red": "#FF574A",
    },
    border: {
      border: "#1E4745",
      input: "#1E4745",
      ring: "#17F9B4",
    },
  },
  spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
  },
  borderRadius: {
    none: "0px",
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    "2xl": "16px",
    full: "9999px",
  },
  typography: {
    fontFamily: {
      sans: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, monospace",
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.3)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.3)",
    glow: "0 0 20px rgba(23, 249, 180, 0.3)",
  },
  animation: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },
};

// Format converters
const formatters = {
  css: (tokens: typeof designTokens): string => {
    let output = ":root {\n";

    const flattenObject = (obj: Record<string, unknown>, prefix = ""): void => {
      Object.entries(obj).forEach(([key, value]) => {
        const varName = prefix ? `${prefix}-${key}` : key;
        if (typeof value === "object" && value !== null) {
          flattenObject(value as Record<string, unknown>, varName);
        } else {
          output += `  --${varName}: ${value};\n`;
        }
      });
    };

    flattenObject(tokens);
    output += "}";
    return output;
  },

  scss: (tokens: typeof designTokens): string => {
    let output = "// SKAI Design System Tokens\n\n";

    const flattenObject = (obj: Record<string, unknown>, prefix = ""): void => {
      Object.entries(obj).forEach(([key, value]) => {
        const varName = prefix ? `${prefix}-${key}` : key;
        if (typeof value === "object" && value !== null) {
          output += `// ${varName}\n`;
          flattenObject(value as Record<string, unknown>, varName);
          output += "\n";
        } else {
          output += `$${varName}: ${value};\n`;
        }
      });
    };

    flattenObject(tokens);
    return output;
  },

  json: (tokens: typeof designTokens): string => {
    return JSON.stringify(tokens, null, 2);
  },

  tailwind: (tokens: typeof designTokens): string => {
    const config = {
      theme: {
        extend: {
          colors: {
            skai: tokens.colors.brand,
            background: tokens.colors.background.background,
            card: tokens.colors.background.card,
            muted: tokens.colors.background.muted,
            foreground: tokens.colors.text.foreground,
            "muted-foreground": tokens.colors.text["muted-foreground"],
            success: tokens.colors.semantic.success,
            destructive: tokens.colors.semantic.destructive,
            warning: tokens.colors.semantic.warning,
            border: tokens.colors.border.border,
          },
          spacing: tokens.spacing,
          borderRadius: tokens.borderRadius,
          fontFamily: tokens.typography.fontFamily,
          fontSize: tokens.typography.fontSize,
          fontWeight: tokens.typography.fontWeight,
          boxShadow: tokens.shadows,
        },
      },
    };
    return `// tailwind.config.js\nmodule.exports = ${JSON.stringify(config, null, 2)}`;
  },

  figma: (tokens: typeof designTokens): string => {
    const figmaTokens: Record<string, unknown> = {
      global: {
        colors: {},
        spacing: {},
        borderRadius: {},
        typography: {},
      },
    };

    // Flatten colors for Figma
    Object.entries(tokens.colors).forEach(([category, colors]) => {
      Object.entries(colors).forEach(([name, value]) => {
        (figmaTokens.global as Record<string, unknown>).colors = {
          ...((figmaTokens.global as Record<string, unknown>).colors as Record<
            string,
            unknown
          >),
          [`${category}/${name}`]: { value, type: "color" },
        };
      });
    });

    return JSON.stringify(figmaTokens, null, 2);
  },

  styleDict: (tokens: typeof designTokens): string => {
    const output: Record<string, unknown> = {};

    const processCategory = (
      obj: Record<string, unknown>,
      path: string[] = [],
    ): Record<string, unknown> => {
      const result: Record<string, unknown> = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          result[key] = processCategory(value as Record<string, unknown>, [
            ...path,
            key,
          ]);
        } else {
          result[key] = { value };
        }
      });
      return result;
    };

    Object.entries(tokens).forEach(([category, values]) => {
      output[category] = processCategory(values as Record<string, unknown>);
    });

    return JSON.stringify(output, null, 2);
  },
};

type FormatType = keyof typeof formatters;

const TokenExporter = () => {
  const [format, setFormat] = useState<FormatType>("css");
  const [copied, setCopied] = useState(false);
  const [_copyError, setCopyError] = useState(false);

  const output = formatters[format](designTokens);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  };

  const downloadFile = () => {
    const extensions: Record<FormatType, string> = {
      css: "css",
      scss: "scss",
      json: "json",
      tailwind: "js",
      figma: "json",
      styleDict: "json",
    };

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skai-tokens.${extensions[format]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formats: {
    id: FormatType;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: "css",
      label: "CSS Variables",
      icon: <FileCode className="w-4 h-4" />,
      description: "Native CSS custom properties",
    },
    {
      id: "scss",
      label: "SCSS Variables",
      icon: <FileCode className="w-4 h-4" />,
      description: "Sass/SCSS variable format",
    },
    {
      id: "json",
      label: "JSON",
      icon: <FileJson className="w-4 h-4" />,
      description: "Raw JSON structure",
    },
    {
      id: "tailwind",
      label: "Tailwind Config",
      icon: <Palette className="w-4 h-4" />,
      description: "Tailwind CSS configuration",
    },
    {
      id: "figma",
      label: "Figma Tokens",
      icon: <Palette className="w-4 h-4" />,
      description: "Figma Tokens plugin format",
    },
    {
      id: "styleDict",
      label: "Style Dictionary",
      icon: <FileJson className="w-4 h-4" />,
      description: "Style Dictionary format",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Design Token Exports</h1>
        <p className="text-muted-foreground mb-8">
          Export SKAI design tokens in multiple formats for any tool or
          platform.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Format Selector */}
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Export Format</h2>
            <div className="space-y-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    format === f.id
                      ? "bg-skai-green/20 border border-skai-green"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {f.icon}
                    <span className="font-medium text-sm">{f.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {f.description}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* Output Preview */}
          <Card className="lg:col-span-3 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Output Preview</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  {copied ? (
                    <Check className="w-4 h-4 mr-1" />
                  ) : (
                    <Copy className="w-4 h-4 mr-1" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button size="sm" onClick={downloadFile}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 max-h-[500px] overflow-auto">
              <pre className="text-sm text-green-400 font-mono whitespace-pre">
                {output}
              </pre>
            </div>
          </Card>
        </div>

        {/* Token Summary */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Colors",
              count: Object.keys(designTokens.colors).reduce(
                (acc, key) =>
                  acc +
                  Object.keys(
                    designTokens.colors[
                      key as keyof typeof designTokens.colors
                    ],
                  ).length,
                0,
              ),
            },
            {
              label: "Spacing",
              count: Object.keys(designTokens.spacing).length,
            },
            {
              label: "Typography",
              count: Object.keys(designTokens.typography.fontSize).length,
            },
            {
              label: "Shadows",
              count: Object.keys(designTokens.shadows).length,
            },
          ].map((stat) => (
            <Card key={stat.label} className="p-4 text-center">
              <div className="text-2xl font-bold text-skai-green">
                {stat.count}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Token Exports",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Design Token Exports

Export your design tokens in multiple formats:
- **CSS Variables** - For native CSS projects
- **SCSS Variables** - For Sass/SCSS projects
- **JSON** - For any tooling that needs raw data
- **Tailwind Config** - Ready-to-use Tailwind configuration
- **Figma Tokens** - For Figma Tokens plugin
- **Style Dictionary** - For cross-platform design systems
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Exporter: Story = {
  name: "📦 Token Exporter",
  render: () => <TokenExporter />,
};
