/**
 * Design Token Exports Documentation
 *
 * Downloadable design tokens in various formats for external tools
 * including Figma, Tailwind, CSS, and JSON.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import {
  Download,
  Copy,
  Check,
  FileCode,
  FileJson,
  Palette,
  Type,
  Box,
  Layers,
} from "lucide-react";
import { useState } from "react";

const meta: Meta = {
  title: "Documentation/Design Token Exports",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# 📦 Design Token Exports

Export SKAI design tokens for use in external tools and codebases.

## Available Formats

- **JSON** - Universal format for any tool
- **CSS Variables** - Drop-in stylesheet
- **Tailwind Config** - Extend your Tailwind setup
- **Figma Tokens** - Import to Figma variables

## Token Categories

1. Colors (brand, semantic, UI)
2. Typography (fonts, sizes, weights)
3. Spacing (consistent spacing scale)
4. Shadows & Effects (elevation system)
        `,
      },
    },
  },
};

export default meta;

// ============================================================================
// TOKEN DATA
// ============================================================================

const colorTokens = {
  brand: {
    background: "#001615",
    primary: "#56C0F6",
    secondary: "#2DEDAD",
    accent: "#26C99A",
  },
  semantic: {
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
  ui: {
    card: "rgba(0, 0, 0, 0.4)",
    border: "rgba(255, 255, 255, 0.1)",
    muted: "#6b7280",
    foreground: "#f4f4f5",
  },
};

const typographyTokens = {
  fontFamily: {
    heading: "'Cormorant Garamond', Georgia, serif",
    subheading: "'Manrope', system-ui, sans-serif", 
    body: "'Mulish', system-ui, sans-serif",
    mono: "'JetBrains Mono', Menlo, monospace",
    display: "'Cormorant Garamond', Georgia, serif",
    sans: "'Manrope', system-ui, sans-serif",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

const spacingTokens = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
};

const shadowTokens = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  glow: "0 0 40px rgba(86, 192, 246, 0.3)",
  "glow-teal": "0 0 30px rgba(45, 237, 173, 0.25)",
};

const borderRadiusTokens = {
  none: "0",
  sm: "0.25rem",
  base: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  full: "9999px",
};

// ============================================================================
// EXPORT GENERATORS
// ============================================================================

const generateJSONExport = () => {
  return JSON.stringify(
    {
      colors: colorTokens,
      typography: typographyTokens,
      spacing: spacingTokens,
      shadows: shadowTokens,
      borderRadius: borderRadiusTokens,
    },
    null,
    2,
  );
};

const generateCSSExport = () => {
  return `:root {
  /* Brand Colors */
  --color-background: ${colorTokens.brand.background};
  --color-primary: ${colorTokens.brand.primary};
  --color-secondary: ${colorTokens.brand.secondary};
  --color-accent: ${colorTokens.brand.accent};
  
  /* Semantic Colors */
  --color-success: ${colorTokens.semantic.success};
  --color-warning: ${colorTokens.semantic.warning};
  --color-error: ${colorTokens.semantic.error};
  --color-info: ${colorTokens.semantic.info};
  
  /* UI Colors */
  --color-card: ${colorTokens.ui.card};
  --color-border: ${colorTokens.ui.border};
  --color-muted: ${colorTokens.ui.muted};
  --color-foreground: ${colorTokens.ui.foreground};
  
  /* Typography */
  --font-heading: ${typographyTokens.fontFamily.heading};
  --font-subheading: ${typographyTokens.fontFamily.subheading};
  --font-body: ${typographyTokens.fontFamily.body};
  --font-mono: ${typographyTokens.fontFamily.mono};
  --font-display: ${typographyTokens.fontFamily.display};
  --font-sans: ${typographyTokens.fontFamily.sans};
  
  /* Font Sizes */
  --text-xs: ${typographyTokens.fontSize.xs};
  --text-sm: ${typographyTokens.fontSize.sm};
  --text-base: ${typographyTokens.fontSize.base};
  --text-lg: ${typographyTokens.fontSize.lg};
  --text-xl: ${typographyTokens.fontSize.xl};
  --text-2xl: ${typographyTokens.fontSize["2xl"]};
  --text-3xl: ${typographyTokens.fontSize["3xl"]};
  --text-4xl: ${typographyTokens.fontSize["4xl"]};
  
  /* Spacing */
  --space-1: ${spacingTokens[1]};
  --space-2: ${spacingTokens[2]};
  --space-3: ${spacingTokens[3]};
  --space-4: ${spacingTokens[4]};
  --space-6: ${spacingTokens[6]};
  --space-8: ${spacingTokens[8]};
  --space-12: ${spacingTokens[12]};
  --space-16: ${spacingTokens[16]};
  
  /* Border Radius */
  --radius-sm: ${borderRadiusTokens.sm};
  --radius-md: ${borderRadiusTokens.md};
  --radius-lg: ${borderRadiusTokens.lg};
  --radius-xl: ${borderRadiusTokens.xl};
  --radius-2xl: ${borderRadiusTokens["2xl"]};
  --radius-full: ${borderRadiusTokens.full};
  
  /* Shadows */
  --shadow-sm: ${shadowTokens.sm};
  --shadow-base: ${shadowTokens.base};
  --shadow-md: ${shadowTokens.md};
  --shadow-lg: ${shadowTokens.lg};
  --shadow-glow: ${shadowTokens.glow};
}`;
};

const generateTailwindExport = () => {
  return `// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          background: "${colorTokens.brand.background}",
          primary: "${colorTokens.brand.primary}",
          secondary: "${colorTokens.brand.secondary}",
          accent: "${colorTokens.brand.accent}",
        },
        success: "${colorTokens.semantic.success}",
        warning: "${colorTokens.semantic.warning}",
        error: "${colorTokens.semantic.error}",
        info: "${colorTokens.semantic.info}",
      },
      fontFamily: {
        heading: ["Cormorant Garamond", "Georgia", "serif"],
        subheading: ["Manrope", "system-ui", "sans-serif"],
        body: ["Mulish", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "${shadowTokens.glow}",
        "glow-teal": "${shadowTokens["glow-teal"]}",
      },
      borderRadius: {
        "2xl": "${borderRadiusTokens["2xl"]}",
      },
    },
  },
} satisfies Config;`;
};

const generateFigmaExport = () => {
  return JSON.stringify(
    {
      $themes: [],
      $metadata: {
        tokenSetOrder: ["skai"],
      },
      skai: {
        colors: {
          brand: {
            background: { value: colorTokens.brand.background, type: "color" },
            primary: { value: colorTokens.brand.primary, type: "color" },
            secondary: { value: colorTokens.brand.secondary, type: "color" },
            accent: { value: colorTokens.brand.accent, type: "color" },
          },
          semantic: {
            success: { value: colorTokens.semantic.success, type: "color" },
            warning: { value: colorTokens.semantic.warning, type: "color" },
            error: { value: colorTokens.semantic.error, type: "color" },
            info: { value: colorTokens.semantic.info, type: "color" },
          },
        },
        typography: {
          fontFamily: {
            heading: { value: "Cormorant Garamond", type: "fontFamilies" },
            subheading: { value: "Manrope", type: "fontFamilies" },
            body: { value: "Mulish", type: "fontFamilies" },
            mono: { value: "JetBrains Mono", type: "fontFamilies" },
            display: { value: "Cormorant Garamond", type: "fontFamilies" },
            sans: { value: "Manrope", type: "fontFamilies" },
          },
          fontSize: {
            xs: { value: "12", type: "fontSizes" },
            sm: { value: "14", type: "fontSizes" },
            base: { value: "16", type: "fontSizes" },
            lg: { value: "18", type: "fontSizes" },
            xl: { value: "20", type: "fontSizes" },
            "2xl": { value: "24", type: "fontSizes" },
            "3xl": { value: "30", type: "fontSizes" },
            "4xl": { value: "36", type: "fontSizes" },
          },
        },
        spacing: {
          "1": { value: "4", type: "spacing" },
          "2": { value: "8", type: "spacing" },
          "3": { value: "12", type: "spacing" },
          "4": { value: "16", type: "spacing" },
          "6": { value: "24", type: "spacing" },
          "8": { value: "32", type: "spacing" },
          "12": { value: "48", type: "spacing" },
          "16": { value: "64", type: "spacing" },
        },
      },
    },
    null,
    2,
  );
};

// ============================================================================
// MAIN EXPORT UI
// ============================================================================

export const TokenExports: StoryObj = {
  render: () => {
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    const copyToClipboard = (format: string, content: string) => {
      navigator.clipboard.writeText(content);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    };

    const downloadFile = (filename: string, content: string) => {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    };

    const exportFormats = [
      {
        name: "JSON",
        icon: FileJson,
        filename: "skai-tokens.json",
        description: "Universal format for any tool",
        content: generateJSONExport(),
      },
      {
        name: "CSS Variables",
        icon: FileCode,
        filename: "skai-tokens.css",
        description: "Drop-in CSS custom properties",
        content: generateCSSExport(),
      },
      {
        name: "Tailwind Config",
        icon: Palette,
        filename: "tailwind.config.ts",
        description: "Extend your Tailwind setup",
        content: generateTailwindExport(),
      },
      {
        name: "Figma Tokens",
        icon: Layers,
        filename: "figma-tokens.json",
        description: "Import to Figma Token Studio",
        content: generateFigmaExport(),
      },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Export Design Tokens</h2>
          <p className="text-muted-foreground mb-6">
            Download SKAI design tokens in your preferred format for use in
            external tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportFormats.map((format) => (
            <Card
              key={format.name}
              className="hover:border-cyan-500/30 transition-colors"
            >
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <format.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{format.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {format.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          downloadFile(format.filename, format.content)
                        }
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(format.name, format.content)
                        }
                      >
                        {copiedFormat === format.name ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  },
};

// ============================================================================
// JSON PREVIEW
// ============================================================================

export const JSONPreview: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">JSON Token Structure</h2>
        <p className="text-muted-foreground mb-6">
          Complete JSON export preview with all token categories.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              skai-tokens.json
            </CardTitle>
            <Badge variant="outline">4.2 KB</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto max-h-96">
            <code className="text-cyan-400">{generateJSONExport()}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// CSS PREVIEW
// ============================================================================

export const CSSPreview: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">CSS Variables Export</h2>
        <p className="text-muted-foreground mb-6">
          Ready-to-use CSS custom properties for your stylesheets.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              skai-tokens.css
            </CardTitle>
            <Badge variant="outline">2.1 KB</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto max-h-96">
            <code className="text-cyan-400">{generateCSSExport()}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
/* Import the tokens */
@import url('skai-tokens.css');

/* Use in your CSS */
.my-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  font-family: var(--font-sans);
}

.my-button {
  background: var(--color-primary);
  color: var(--color-background);
  box-shadow: var(--shadow-glow);
}

.price-up {
  color: var(--color-success);
}

.price-down {
  color: var(--color-error);
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
// TAILWIND PREVIEW
// ============================================================================

export const TailwindPreview: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tailwind Configuration</h2>
        <p className="text-muted-foreground mb-6">
          Extend your Tailwind CSS configuration with SKAI design tokens.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              tailwind.config.ts
            </CardTitle>
            <Badge variant="outline">TypeScript</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto max-h-96">
            <code className="text-cyan-400">{generateTailwindExport()}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage with Tailwind Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
{/* Background */}
<div className="bg-brand-background" />

{/* Primary text */}
<span className="text-brand-primary" />

{/* Accent gradient */}
<div className="bg-gradient-to-r from-brand-primary to-brand-secondary" />

{/* Success/Error states */}
<span className="text-success">+$123</span>
<span className="text-error">-$45</span>

{/* Shadow glow effect */}
<button className="shadow-glow hover:shadow-glow-teal" />

{/* Custom border radius */}
<div className="rounded-2xl" />
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// TOKEN CATEGORIES
// ============================================================================

export const TokenCategories: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Token Categories</h2>
        <p className="text-muted-foreground mb-6">
          Overview of all design token categories included in exports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-cyan-400" />
              Colors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">Brand</span>
                <div className="flex gap-2 mt-1">
                  {Object.values(colorTokens.brand).map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Semantic</span>
                <div className="flex gap-2 mt-1">
                  {Object.values(colorTokens.semantic).map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="mt-4">
              12 tokens
            </Badge>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Type className="h-5 w-5 text-cyan-400" />
              Typography
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Heading</span>
                <span className="font-heading">Cormorant</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Body</span>
                <span className="font-body">Mulish</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Mono</span>
                <span className="font-mono">JetBrains</span>
              </div>
              <div className="flex gap-1 mt-2">
                {["xs", "sm", "base", "lg", "xl"].map((size) => (
                  <span
                    key={size}
                    className="px-2 py-1 rounded bg-white/5 text-xs"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <Badge variant="outline" className="mt-4">
              26 tokens
            </Badge>
          </CardContent>
        </Card>

        {/* Spacing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Box className="h-5 w-5 text-cyan-400" />
              Spacing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-20">
              {[1, 2, 3, 4, 6, 8, 12].map((space) => (
                <div
                  key={space}
                  className="bg-cyan-500/30 rounded-sm"
                  style={{
                    width: `${space * 4}px`,
                    height: `${space * 6}px`,
                  }}
                />
              ))}
            </div>
            <Badge variant="outline" className="mt-4">
              12 tokens
            </Badge>
          </CardContent>
        </Card>

        {/* Shadows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5 text-cyan-400" />
              Shadows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {["sm", "base", "lg"].map((shadow) => (
                <div
                  key={shadow}
                  className="w-12 h-12 rounded-lg bg-white/10"
                  style={{
                    boxShadow:
                      shadowTokens[shadow as keyof typeof shadowTokens],
                  }}
                />
              ))}
              <div
                className="w-12 h-12 rounded-lg bg-cyan-500/20"
                style={{ boxShadow: shadowTokens.glow }}
              />
            </div>
            <Badge variant="outline" className="mt-4">
              7 tokens
            </Badge>
          </CardContent>
        </Card>

        {/* Border Radius */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Box className="h-5 w-5 text-cyan-400" />
              Border Radius
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {["sm", "md", "lg", "xl", "2xl", "full"].map((radius) => (
                <div
                  key={radius}
                  className="w-10 h-10 bg-cyan-500/30 border border-cyan-500/50"
                  style={{
                    borderRadius:
                      borderRadiusTokens[
                        radius as keyof typeof borderRadiusTokens
                      ],
                  }}
                />
              ))}
            </div>
            <Badge variant="outline" className="mt-4">
              8 tokens
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};
