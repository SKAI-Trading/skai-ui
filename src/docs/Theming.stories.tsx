/**
 * Theming Documentation
 *
 * Complete guide to SKAI design tokens, CSS variables,
 * and theme customization based on the MAIN APP design system (src/index.css).
 *
 * ⚠️ SOURCE OF TRUTH: src/index.css in Skai-Trading repo
 * All values here MUST match the main app's CSS exactly.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Button } from "../components/button";
import { Badge } from "../components/badge";
import {
  Copy,
  Check,
  Moon,
  Sun,
  Palette,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";

const meta: Meta = {
  title: "Documentation/Theming",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# 🎨 SKAI Design System

CSS variable-based theming system from \`src/index.css\`.

## Key Characteristics
- **HSL Color Format** - All colors use HSL for easy manipulation
- **Dark-first design** - Background: \`hsl(225 80% 4%)\` (#020717)
- **Trading colors** - Green (long) and Red (short) with glow variants
- **Glass morphism** - Frosted glass panels with blur effects

## CSS Variables (Actual)

\`\`\`css
:root {
  --background: 225 80% 4%;      /* #020717 - Deep navy */
  --foreground: 0 0% 100%;       /* #FFFFFF */
  --primary: 199 90% 65%;        /* #56C0F6 - SKAI Cyan */
  --secondary: 166 80% 55%;      /* #2DEDAD - SKAI Teal */
  --long: 142 76% 36%;           /* Trading green */
  --short: 0 84% 60%;            /* Trading red */
  --glass: 225 50% 12%;          /* Glass panel bg */
  --radius: 0.75rem;             /* 12px */
}
\`\`\`
        `,
      },
    },
  },
};

export default meta;

// ============================================================================
// CSS VARIABLES REFERENCE - EXACT VALUES FROM src/index.css
// ============================================================================

const cssVariables = {
  "Core Colors (HSL Format)": [
    {
      name: "--background",
      value: "225 80% 4%",
      hex: "#020717",
      description: "Deep navy background (main app)",
    },
    {
      name: "--foreground",
      value: "0 0% 100%",
      hex: "#FFFFFF",
      description: "Primary text color",
    },
    {
      name: "--primary",
      value: "199 90% 65%",
      hex: "#56C0F6",
      description: "SKAI Cyan - primary brand color",
    },
    {
      name: "--primary-glow",
      value: "199 90% 75%",
      hex: "#7DD1F9",
      description: "Lighter primary for glow effects",
    },
    {
      name: "--secondary",
      value: "166 80% 55%",
      hex: "#2DEDAD",
      description: "SKAI Teal - secondary brand color",
    },
    {
      name: "--secondary-glow",
      value: "166 80% 65%",
      hex: "#5EF4C7",
      description: "Lighter secondary for glow effects",
    },
    {
      name: "--accent",
      value: "199 90% 65%",
      hex: "#56C0F6",
      description: "Accent color (same as primary)",
    },
    {
      name: "--muted",
      value: "225 30% 15%",
      hex: "#1B2236",
      description: "Muted backgrounds",
    },
    {
      name: "--muted-foreground",
      value: "225 20% 60%",
      hex: "#8B92A8",
      description: "Muted text",
    },
  ],
  "Trading Colors": [
    {
      name: "--long",
      value: "142 76% 36%",
      hex: "#16A34A",
      description: "Long/Buy position (green)",
    },
    {
      name: "--long-glow",
      value: "142 76% 46%",
      hex: "#22C55E",
      description: "Long glow effect",
    },
    {
      name: "--short",
      value: "0 84% 60%",
      hex: "#EF4444",
      description: "Short/Sell position (red)",
    },
    {
      name: "--short-glow",
      value: "0 84% 70%",
      hex: "#F87171",
      description: "Short glow effect",
    },
    {
      name: "--destructive",
      value: "0 84% 60%",
      hex: "#EF4444",
      description: "Error/destructive actions",
    },
  ],
  "Card & Glass Effects": [
    {
      name: "--card",
      value: "225 60% 8%",
      hex: "#0D1424",
      description: "Card background",
    },
    {
      name: "--card-foreground",
      value: "0 0% 100%",
      hex: "#FFFFFF",
      description: "Card text",
    },
    {
      name: "--glass",
      value: "225 50% 12%",
      hex: "#15213B",
      description: "Glass panel background",
    },
    {
      name: "--popover",
      value: "225 60% 6%",
      hex: "#0A1120",
      description: "Popover/dropdown background",
    },
    {
      name: "--popover-foreground",
      value: "0 0% 100%",
      hex: "#FFFFFF",
      description: "Popover text",
    },
  ],
  "Borders & Inputs": [
    {
      name: "--border",
      value: "225 30% 20%",
      hex: "#2D3A54",
      description: "Default border color",
    },
    {
      name: "--input",
      value: "225 30% 15%",
      hex: "#1B2236",
      description: "Input background",
    },
    {
      name: "--ring",
      value: "199 90% 65%",
      hex: "#56C0F6",
      description: "Focus ring color",
    },
  ],
  "Shadows (CSS Values)": [
    {
      name: "--shadow-glow",
      value: "0 0 30px hsl(var(--primary) / 0.3)",
      hex: "N/A",
      description: "Primary glow shadow",
    },
    {
      name: "--shadow-strong",
      value: "0 10px 40px hsl(var(--primary) / 0.4)",
      hex: "N/A",
      description: "Strong elevation shadow",
    },
    {
      name: "--shadow-card",
      value: "0 8px 32px rgba(0, 0, 0, 0.4)",
      hex: "N/A",
      description: "Card elevation shadow",
    },
  ],
  "Radius & Transitions": [
    {
      name: "--radius",
      value: "0.75rem",
      hex: "12px",
      description: "Default border radius",
    },
    {
      name: "--transition-smooth",
      value: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      hex: "N/A",
      description: "Smooth transition preset",
    },
  ],
  "Typography (Tailwind Config)": [
    {
      name: "fontFamily.heading",
      value: "'Poppins', sans-serif",
      hex: "N/A",
      description: "Heading font family",
    },
    {
      name: "fontFamily.body",
      value: "'Poppins', sans-serif",
      hex: "N/A",
      description: "Body font family",
    },
    {
      name: "fontFamily.sans",
      value: "'Poppins', sans-serif",
      hex: "N/A",
      description: "Default sans-serif",
    },
  ],
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-white/10 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-400" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  );
}

// Helper to convert HSL to displayable color
function hslToStyle(hsl: string): string {
  if (
    hsl.startsWith("0 0 ") ||
    hsl.includes("rgba") ||
    hsl.includes("linear") ||
    hsl === "N/A"
  ) {
    return hsl;
  }
  return `hsl(${hsl})`;
}

export const CSSVariablesReference: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">CSS Variables Reference</h2>
        <p className="text-muted-foreground mb-4">
          <strong>⚠️ Source of Truth:</strong> All values from{" "}
          <code className="text-cyan-400">src/index.css</code> in the main
          Skai-Trading repo.
        </p>
        <p className="text-muted-foreground mb-6">
          SKAI uses HSL format for all colors. Usage:{" "}
          <code className="text-cyan-400">hsl(var(--primary))</code> or{" "}
          <code className="text-cyan-400">bg-primary</code> in Tailwind.
        </p>
      </div>

      {Object.entries(cssVariables).map(([category, variables]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {variables.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {/* Color preview for color variables */}
                    {v.hex && v.hex !== "N/A" && v.hex !== "12px" && (
                      <div
                        className="w-8 h-8 rounded-md border border-white/10 flex-shrink-0"
                        style={{ background: v.hex }}
                      />
                    )}
                    <div>
                      <code className="text-sm font-mono text-cyan-400">
                        {v.name}
                      </code>
                      <p className="text-xs text-muted-foreground">
                        {v.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <code className="text-xs font-mono text-muted-foreground bg-black/30 px-2 py-1 rounded block">
                        {v.value}
                      </code>
                      {v.hex && v.hex !== "N/A" && (
                        <code className="text-xs font-mono text-white/50 mt-1 block">
                          {v.hex}
                        </code>
                      )}
                    </div>
                    <CopyButton
                      text={
                        v.name.startsWith("--")
                          ? `hsl(var(${v.name}))`
                          : v.value
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Trading Colors Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <TrendingDown className="h-5 w-5 text-red-500" />
            Trading UI Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div
              className="flex-1 p-4 rounded-lg"
              style={{
                background: "hsl(142 76% 36%)",
                boxShadow: "0 0 20px hsl(142 76% 46% / 0.4)",
              }}
            >
              <div className="text-white font-bold">LONG</div>
              <div className="text-white/70 text-sm">--long: 142 76% 36%</div>
            </div>
            <div
              className="flex-1 p-4 rounded-lg"
              style={{
                background: "hsl(0 84% 60%)",
                boxShadow: "0 0 20px hsl(0 84% 70% / 0.4)",
              }}
            >
              <div className="text-white font-bold">SHORT</div>
              <div className="text-white/70 text-sm">--short: 0 84% 60%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// GLASS CARD STYLES - FROM src/index.css
// ============================================================================

const glassVariants = [
  {
    name: "Glass Panel (--glass)",
    className: "glass-panel",
    css: `
/* Main app glass panel - uses --glass variable */
.glass-panel {
  background: hsl(var(--glass));           /* 225 50% 12% */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border));    /* 225 30% 20% */
  border-radius: var(--radius);            /* 0.75rem */
  box-shadow: var(--shadow-card);          /* 0 8px 32px rgba(0,0,0,0.4) */
}`,
  },
  {
    name: "Card Component",
    className: "card",
    css: `
/* shadcn/ui Card component styling */
.card {
  background: hsl(var(--card));            /* 225 60% 8% */
  border: 1px solid hsl(var(--border));    /* 225 30% 20% */
  border-radius: calc(var(--radius) + 4px);
  color: hsl(var(--card-foreground));
}`,
  },
  {
    name: "Glow Card (Hover)",
    className: "glow-card",
    css: `
/* Card with glow effect on hover */
.glow-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  transition: var(--transition-smooth);
}

.glow-card:hover {
  border-color: hsl(var(--primary) / 0.3);
  box-shadow: var(--shadow-glow);          /* 0 0 30px hsl(primary/0.3) */
  transform: translateY(-2px);
}`,
  },
  {
    name: "Input Field",
    className: "input",
    css: `
/* Form input styling */
.input {
  background: hsl(var(--input));           /* 225 30% 15% */
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  color: hsl(var(--foreground));
  transition: var(--transition-smooth);
}

.input:focus {
  border-color: hsl(var(--ring));          /* 199 90% 65% - primary */
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
  outline: none;
}`,
  },
];

export const GlassMorphism: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Glass Morphism Styles</h2>
        <p className="text-muted-foreground mb-6">
          Glass panel styles using CSS variables from{" "}
          <code className="text-cyan-400">src/index.css</code>. All colors
          reference the HSL variables for consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {glassVariants.map((variant) => (
          <div key={variant.name} className="space-y-4">
            {/* Preview */}
            <div
              className="p-6 rounded-xl transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: variant.name.includes("Glass Panel")
                  ? "hsl(225 50% 12%)" /* --glass */
                  : variant.name.includes("Input")
                    ? "hsl(225 30% 15%)" /* --input */
                    : "hsl(225 60% 8%)" /* --card */,
                backdropFilter: "blur(12px)",
                border: "1px solid hsl(225 30% 20%)" /* --border */,
                boxShadow: variant.name.includes("Glow")
                  ? "0 0 30px hsl(199 90% 65% / 0.3)"
                  : "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <h3 className="font-semibold mb-2">{variant.name}</h3>
              <p className="text-sm text-muted-foreground">
                Uses actual CSS variables from src/index.css
              </p>
            </div>

            {/* Code */}
            <div className="relative">
              <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
                <code className="text-cyan-400">{variant.css.trim()}</code>
              </pre>
              <div className="absolute top-2 right-2">
                <CopyButton text={variant.css.trim()} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

// ============================================================================
// GRADIENTS, GLOWS, AND ANIMATIONS - FROM src/index.css & tailwind.config.ts
// ============================================================================

export const GradientsAndGlows: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gradients & Glow Effects</h2>
        <p className="text-muted-foreground mb-6">
          Gradient and glow patterns from the SKAI design system. Uses HSL
          variables for consistency.
        </p>
      </div>

      {/* Primary Gradient Text */}
      <Card>
        <CardHeader>
          <CardTitle>Gradient Text (Primary → Secondary)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="text-4xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, hsl(199 90% 65%), hsl(166 80% 55%))",
              backgroundSize: "200% auto",
              animation: "gradient-shift 4s ease-in-out infinite",
            }}
          >
            SKAI Gradient Text
          </div>

          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
/* Using CSS variables */
.gradient-text {
  background: linear-gradient(
    135deg, 
    hsl(var(--primary)),      /* 199 90% 65% - Cyan */
    hsl(var(--secondary))     /* 166 80% 55% - Teal */
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 4s ease-in-out infinite;
}

/* Or with Tailwind */
.gradient-text {
  @apply bg-gradient-to-r from-primary to-secondary 
         bg-clip-text text-transparent;
}

@keyframes gradient-shift {
  0% { background-position: 0% center; }
  50% { background-position: 100% center; }
  100% { background-position: 0% center; }
}
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>

      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Button Glow Effects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            {/* Primary Button */}
            <button
              className="relative px-8 py-3 rounded-xl font-semibold text-white"
              style={{
                background: "hsl(199 90% 65%)",
                boxShadow: "0 0 30px hsl(199 90% 65% / 0.3)",
              }}
            >
              Primary
            </button>

            {/* Secondary Button */}
            <button
              className="relative px-8 py-3 rounded-xl font-semibold text-white"
              style={{
                background: "hsl(166 80% 55%)",
                boxShadow: "0 0 30px hsl(166 80% 55% / 0.3)",
              }}
            >
              Secondary
            </button>

            {/* Long (Buy) Button */}
            <button
              className="relative px-8 py-3 rounded-xl font-semibold text-white"
              style={{
                background: "hsl(142 76% 36%)",
                boxShadow: "0 0 20px hsl(142 76% 46% / 0.4)",
              }}
            >
              Buy / Long
            </button>

            {/* Short (Sell) Button */}
            <button
              className="relative px-8 py-3 rounded-xl font-semibold text-white"
              style={{
                background: "hsl(0 84% 60%)",
                boxShadow: "0 0 20px hsl(0 84% 70% / 0.4)",
              }}
            >
              Sell / Short
            </button>

            {/* Outline */}
            <button
              className="relative px-8 py-3 rounded-xl font-semibold"
              style={{
                background: "transparent",
                border: "1px solid hsl(199 90% 65%)",
                color: "hsl(199 90% 65%)",
              }}
            >
              Outline
            </button>
          </div>

          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
/* Primary button with glow */
.btn-primary {
  background: hsl(var(--primary));
  box-shadow: var(--shadow-glow);
  transition: var(--transition-smooth);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-strong);
}

/* Trading buttons */
.btn-long {
  background: hsl(var(--long));
  box-shadow: 0 0 20px hsl(var(--long-glow) / 0.4);
}

.btn-short {
  background: hsl(var(--short));
  box-shadow: 0 0 20px hsl(var(--short-glow) / 0.4);
}
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>

      {/* Glow Orbs */}
      <Card>
        <CardHeader>
          <CardTitle>Background Glow Orbs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="relative h-48 rounded-xl overflow-hidden"
            style={{ background: "hsl(225 80% 4%)" }} /* --background */
          >
            {/* Primary glow */}
            <div
              className="absolute w-64 h-64 -top-16 -left-16"
              style={{
                background:
                  "radial-gradient(circle, hsl(199 90% 65% / 0.2) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />
            {/* Secondary glow */}
            <div
              className="absolute w-64 h-64 -bottom-16 -right-16"
              style={{
                background:
                  "radial-gradient(circle, hsl(166 80% 55% / 0.15) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />
            <div className="relative z-10 flex items-center justify-center h-full">
              <span className="text-2xl font-bold">
                Content with Glow Background
              </span>
            </div>
          </div>

          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
.glow-orb-primary {
  background: radial-gradient(
    circle,
    hsl(var(--primary) / 0.2) 0%,
    transparent 70%
  );
  filter: blur(60px);
  pointer-events: none;
}

.glow-orb-secondary {
  background: radial-gradient(
    circle,
    hsl(var(--secondary) / 0.15) 0%,
    transparent 70%
  );
  filter: blur(60px);
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
// THEME CUSTOMIZATION - ACTUAL VARIABLE OVERRIDES
// ============================================================================

const themePresets = [
  {
    name: "SKAI Default (Main App)",
    description: "Production theme from src/index.css",
    colors: {
      background: "225 80% 4%", // #020717
      primary: "199 90% 65%", // #56C0F6
      secondary: "166 80% 55%", // #2DEDAD
      long: "142 76% 36%", // #16A34A
      short: "0 84% 60%", // #EF4444
    },
    hex: {
      background: "#020717",
      primary: "#56C0F6",
      secondary: "#2DEDAD",
      long: "#16A34A",
      short: "#EF4444",
    },
  },
  {
    name: "SKAI Landing (Green Coal)",
    description: "Landing page variant",
    colors: {
      background: "175 100% 4%", // #001615
      primary: "199 90% 65%",
      secondary: "160 90% 55%",
      long: "142 76% 36%",
      short: "0 84% 60%",
    },
    hex: {
      background: "#001615",
      primary: "#56C0F6",
      secondary: "#17F9B4",
      long: "#16A34A",
      short: "#EF4444",
    },
  },
  {
    name: "Ocean Depths",
    description: "Deeper blue variant",
    colors: {
      background: "220 60% 8%",
      primary: "210 100% 60%",
      secondary: "190 100% 50%",
      long: "142 76% 36%",
      short: "0 84% 60%",
    },
    hex: {
      background: "#0A1628",
      primary: "#3B82F6",
      secondary: "#00C4D4",
      long: "#16A34A",
      short: "#EF4444",
    },
  },
  {
    name: "Purple Neon",
    description: "Purple accent theme",
    colors: {
      background: "280 60% 6%",
      primary: "280 90% 65%",
      secondary: "300 80% 60%",
      long: "142 76% 36%",
      short: "0 84% 60%",
    },
    hex: {
      background: "#1A0A28",
      primary: "#A855F7",
      secondary: "#E879F9",
      long: "#16A34A",
      short: "#EF4444",
    },
  },
];

export const ThemeCustomization: StoryObj = {
  render: () => {
    const [activeTheme, setActiveTheme] = useState(themePresets[0]);

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Theme Customization</h2>
          <p className="text-muted-foreground mb-6">
            Override CSS variables to create custom themes. All colors use HSL
            format for easy manipulation.
          </p>
        </div>

        {/* Theme Selector */}
        <div className="flex flex-wrap gap-3">
          {themePresets.map((theme) => (
            <button
              key={theme.name}
              onClick={() => setActiveTheme(theme)}
              className={`
                px-4 py-3 rounded-lg border transition-all text-left
                ${
                  activeTheme.name === theme.name
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-white/10 hover:border-white/30"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: theme.hex.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: theme.hex.secondary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: theme.hex.long }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: theme.hex.short }}
                  />
                </div>
                <div>
                  <span className="text-sm font-medium block">
                    {theme.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {theme.description}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Preview */}
        <div
          className="p-8 rounded-2xl"
          style={{ background: `hsl(${activeTheme.colors.background})` }}
        >
          <div className="space-y-6">
            <h3
              className="text-3xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, hsl(${activeTheme.colors.primary}), hsl(${activeTheme.colors.secondary}))`,
              }}
            >
              {activeTheme.name}
            </h3>

            <div
              className="p-6 rounded-xl"
              style={{
                background: "hsl(225 50% 12% / 0.8)",
                backdropFilter: "blur(12px)",
                border: `1px solid hsl(${activeTheme.colors.primary} / 0.3)`,
              }}
            >
              <p className="text-white/70 mb-4">
                Glass panel preview with selected theme colors.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  className="px-6 py-2 rounded-lg font-semibold text-white"
                  style={{
                    background: `hsl(${activeTheme.colors.primary})`,
                    boxShadow: `0 0 20px hsl(${activeTheme.colors.primary} / 0.4)`,
                  }}
                >
                  Primary
                </button>
                <button
                  className="px-6 py-2 rounded-lg font-semibold text-white"
                  style={{
                    background: `hsl(${activeTheme.colors.secondary})`,
                    boxShadow: `0 0 20px hsl(${activeTheme.colors.secondary} / 0.4)`,
                  }}
                >
                  Secondary
                </button>
                <button
                  className="px-6 py-2 rounded-lg font-semibold text-white"
                  style={{
                    background: `hsl(${activeTheme.colors.long})`,
                    boxShadow: `0 0 15px hsl(${activeTheme.colors.long} / 0.4)`,
                  }}
                >
                  Long
                </button>
                <button
                  className="px-6 py-2 rounded-lg font-semibold text-white"
                  style={{
                    background: `hsl(${activeTheme.colors.short})`,
                    boxShadow: `0 0 15px hsl(${activeTheme.colors.short} / 0.4)`,
                  }}
                >
                  Short
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Generated CSS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated CSS Variables</span>
              <CopyButton
                text={`
:root {
  --background: ${activeTheme.colors.background};
  --primary: ${activeTheme.colors.primary};
  --secondary: ${activeTheme.colors.secondary};
  --long: ${activeTheme.colors.long};
  --short: ${activeTheme.colors.short};
}`.trim()}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-black/40 p-4 rounded-lg overflow-x-auto">
              <code className="text-cyan-400">
                {`
/* Theme: ${activeTheme.name} */
:root {
  /* Core colors (HSL format) */
  --background: ${activeTheme.colors.background};   /* ${activeTheme.hex.background} */
  --primary: ${activeTheme.colors.primary};         /* ${activeTheme.hex.primary} */
  --secondary: ${activeTheme.colors.secondary};     /* ${activeTheme.hex.secondary} */
  
  /* Trading colors */
  --long: ${activeTheme.colors.long};               /* ${activeTheme.hex.long} */
  --short: ${activeTheme.colors.short};             /* ${activeTheme.hex.short} */
  
  /* Derived glow colors */
  --primary-glow: ${activeTheme.colors.primary.replace(/\d+%$/, (m) => parseInt(m) + 10 + "%")};
  --secondary-glow: ${activeTheme.colors.secondary.replace(/\d+%$/, (m) => parseInt(m) + 10 + "%")};
  --long-glow: ${activeTheme.colors.long.replace(/\d+%$/, (m) => parseInt(m) + 10 + "%")};
  --short-glow: ${activeTheme.colors.short.replace(/\d+%$/, (m) => parseInt(m) + 10 + "%")};
  
  /* Shadows using theme colors */
  --shadow-glow: 0 0 30px hsl(var(--primary) / 0.3);
  --shadow-strong: 0 10px 40px hsl(var(--primary) / 0.4);
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
// DARK/LIGHT MODE - FROM src/index.css
// ============================================================================

export const DarkLightMode: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dark/Light Mode</h2>
        <p className="text-muted-foreground mb-6">
          SKAI is dark-first. The main app includes a light mode via the{" "}
          <code className="text-cyan-400">.light</code> class. Values from{" "}
          <code className="text-cyan-400">src/index.css</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dark Mode */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            <h3 className="font-semibold">Dark Mode (Default)</h3>
          </div>
          <div
            className="p-6 rounded-xl"
            style={{
              background: "hsl(225 80% 4%)" /* --background */,
              border: "1px solid hsl(225 30% 20%)" /* --border */,
            }}
          >
            <p className="text-white mb-2">--background: 225 80% 4%</p>
            <p className="text-white/60 mb-4 text-sm">Optimized for trading</p>
            <Badge>Production Default</Badge>
          </div>
        </div>

        {/* Light Mode */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            <h3 className="font-semibold">Light Mode (.light)</h3>
          </div>
          <div
            className="p-6 rounded-xl"
            style={{
              background: "hsl(0 0% 100%)" /* .light --background */,
              border: "1px solid hsl(220 13% 91%)",
              color: "hsl(224 71% 4%)",
            }}
          >
            <p className="mb-2">--background: 0 0% 100%</p>
            <p className="opacity-60 mb-4 text-sm">For documentation/print</p>
            <Badge
              variant="outline"
              style={{
                borderColor: "hsl(224 71% 4%)",
                color: "hsl(224 71% 4%)",
              }}
            >
              Optional
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actual Values from src/index.css</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
/* Dark mode (default) - from src/index.css :root */
:root {
  --background: 225 80% 4%;           /* #020717 */
  --foreground: 0 0% 100%;            /* #FFFFFF */
  --card: 225 60% 8%;                 /* #0D1424 */
  --card-foreground: 0 0% 100%;
  --popover: 225 60% 6%;
  --popover-foreground: 0 0% 100%;
  --primary: 199 90% 65%;             /* #56C0F6 */
  --primary-foreground: 0 0% 100%;
  --secondary: 166 80% 55%;           /* #2DEDAD */
  --secondary-foreground: 0 0% 100%;
  --muted: 225 30% 15%;
  --muted-foreground: 225 20% 60%;
  --accent: 199 90% 65%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;           /* #EF4444 */
  --destructive-foreground: 0 0% 100%;
  --border: 225 30% 20%;
  --input: 225 30% 15%;
  --ring: 199 90% 65%;
}

/* Light mode - from src/index.css .light class */
.light {
  --background: 0 0% 100%;            /* #FFFFFF */
  --foreground: 224 71% 4%;           /* #020817 */
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --popover: 0 0% 100%;
  --popover-foreground: 224 71% 4%;
  --primary: 199 90% 50%;             /* Slightly darker for contrast */
  --primary-foreground: 0 0% 100%;
  --secondary: 166 80% 45%;
  --secondary-foreground: 0 0% 100%;
  --muted: 220 14% 96%;
  --muted-foreground: 220 9% 46%;
  --accent: 220 14% 96%;
  --accent-foreground: 224 71% 4%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 199 90% 50%;
}
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  ),
};

// Add keyframes style
const style = document.createElement("style");
style.textContent = `
@keyframes gradient-shift {
  0% { background-position: 0% center; }
  50% { background-position: 100% center; }
  100% { background-position: 0% center; }
}
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}
