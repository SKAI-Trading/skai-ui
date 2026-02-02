import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

/**
 * # Design Token Documentation
 *
 * Complete visual reference for all design tokens in the SKAI design system.
 * Click any value to copy to clipboard. All tokens are available in CSS variables,
 * Tailwind classes, and raw values.
 */

// Token Copy Component
const TokenValue = ({
  name,
  value,
  preview,
  cssVar,
  tailwind,
}: {
  name: string;
  value: string;
  preview?: React.ReactNode;
  cssVar: string;
  tailwind?: string;
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
      setCopied("error");
      setTimeout(() => setCopied(null), 1500);
    }
  };

  return (
    <div className="group flex items-center gap-4 py-3 px-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      {/* Preview */}
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        {preview}
      </div>

      {/* Name */}
      <div className="w-40 shrink-0">
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-xs text-slate-500">{value}</div>
      </div>

      {/* Copy Buttons */}
      <div className="flex gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => copy(cssVar, "css")}
          className={`px-2 py-1 text-xs rounded ${
            copied === "css"
              ? "bg-green-500 text-white"
              : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          {copied === "css" ? "✓ Copied" : "CSS"}
        </button>
        {tailwind && (
          <button
            onClick={() => copy(tailwind, "tw")}
            className={`px-2 py-1 text-xs rounded ${
              copied === "tw"
                ? "bg-green-500 text-white"
                : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            {copied === "tw" ? "✓ Copied" : "Tailwind"}
          </button>
        )}
        <button
          onClick={() => copy(value, "val")}
          className={`px-2 py-1 text-xs rounded ${
            copied === "val"
              ? "bg-green-500 text-white"
              : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          {copied === "val" ? "✓ Copied" : "Value"}
        </button>
      </div>
    </div>
  );
};

// Token Section
const TokenSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="mb-12">
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p className="text-slate-600 dark:text-slate-400 mb-4">{description}</p>
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {children}
    </div>
  </div>
);

const meta: Meta = {
  title: "Design System/Design Tokens",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Design Token Documentation

All design tokens used in the SKAI design system. Click any token to copy its value.

## Available Formats
- **CSS Variables**: \`var(--color-primary)\`
- **Tailwind Classes**: \`bg-primary\`, \`text-primary\`
- **Raw Values**: \`#6366f1\`, \`16px\`
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// =============================================================================
// COLORS
// =============================================================================

const brandColors = [
  { name: "Primary", value: "#6366f1", css: "--color-primary", tw: "primary" },
  {
    name: "Primary Light",
    value: "#818cf8",
    css: "--color-primary-light",
    tw: "primary-light",
  },
  {
    name: "Primary Dark",
    value: "#4f46e5",
    css: "--color-primary-dark",
    tw: "primary-dark",
  },
  {
    name: "Secondary",
    value: "#8b5cf6",
    css: "--color-secondary",
    tw: "secondary",
  },
  { name: "Accent", value: "#f59e0b", css: "--color-accent", tw: "accent" },
];

const semanticColors = [
  {
    name: "Success",
    value: "#22c55e",
    css: "--color-success",
    tw: "green-500",
  },
  {
    name: "Success Light",
    value: "#86efac",
    css: "--color-success-light",
    tw: "green-300",
  },
  {
    name: "Warning",
    value: "#f59e0b",
    css: "--color-warning",
    tw: "amber-500",
  },
  {
    name: "Warning Light",
    value: "#fcd34d",
    css: "--color-warning-light",
    tw: "amber-300",
  },
  { name: "Error", value: "#ef4444", css: "--color-error", tw: "red-500" },
  {
    name: "Error Light",
    value: "#fca5a5",
    css: "--color-error-light",
    tw: "red-300",
  },
  { name: "Info", value: "#3b82f6", css: "--color-info", tw: "blue-500" },
];

const tradingColors = [
  { name: "Buy / Long", value: "#22c55e", css: "--color-buy", tw: "green-500" },
  {
    name: "Sell / Short",
    value: "#ef4444",
    css: "--color-sell",
    tw: "red-500",
  },
  { name: "Profit", value: "#22c55e", css: "--color-profit", tw: "green-500" },
  { name: "Loss", value: "#ef4444", css: "--color-loss", tw: "red-500" },
  {
    name: "Neutral",
    value: "#64748b",
    css: "--color-neutral",
    tw: "slate-500",
  },
];

const surfaceColors = [
  {
    name: "Background",
    value: "#ffffff",
    css: "--color-background",
    tw: "white",
  },
  {
    name: "Background Alt",
    value: "#f8fafc",
    css: "--color-background-alt",
    tw: "slate-50",
  },
  { name: "Surface", value: "#ffffff", css: "--color-surface", tw: "white" },
  {
    name: "Surface Elevated",
    value: "#f1f5f9",
    css: "--color-surface-elevated",
    tw: "slate-100",
  },
  { name: "Border", value: "#e2e8f0", css: "--color-border", tw: "slate-200" },
  {
    name: "Border Strong",
    value: "#cbd5e1",
    css: "--color-border-strong",
    tw: "slate-300",
  },
];

const textColors = [
  {
    name: "Text Primary",
    value: "#0f172a",
    css: "--color-text-primary",
    tw: "slate-900",
  },
  {
    name: "Text Secondary",
    value: "#475569",
    css: "--color-text-secondary",
    tw: "slate-600",
  },
  {
    name: "Text Muted",
    value: "#94a3b8",
    css: "--color-text-muted",
    tw: "slate-400",
  },
  {
    name: "Text Disabled",
    value: "#cbd5e1",
    css: "--color-text-disabled",
    tw: "slate-300",
  },
  {
    name: "Text Inverse",
    value: "#ffffff",
    css: "--color-text-inverse",
    tw: "white",
  },
];

export const Colors: Story = {
  name: "🎨 Colors",
  render: () => (
    <div className="space-y-8">
      <TokenSection
        title="Brand Colors"
        description="Primary brand colors used across the application"
      >
        {brandColors.map((color) => (
          <TokenValue
            key={color.name}
            name={color.name}
            value={color.value}
            cssVar={`var(${color.css})`}
            tailwind={color.tw}
            preview={
              <div
                className="w-10 h-10 rounded-lg shadow-inner"
                style={{ backgroundColor: color.value }}
              />
            }
          />
        ))}
      </TokenSection>

      <TokenSection
        title="Semantic Colors"
        description="Colors for feedback, status, and alerts"
      >
        {semanticColors.map((color) => (
          <TokenValue
            key={color.name}
            name={color.name}
            value={color.value}
            cssVar={`var(${color.css})`}
            tailwind={color.tw}
            preview={
              <div
                className="w-10 h-10 rounded-lg shadow-inner"
                style={{ backgroundColor: color.value }}
              />
            }
          />
        ))}
      </TokenSection>

      <TokenSection
        title="Trading Colors"
        description="Specialized colors for trading interfaces"
      >
        {tradingColors.map((color) => (
          <TokenValue
            key={color.name}
            name={color.name}
            value={color.value}
            cssVar={`var(${color.css})`}
            tailwind={color.tw}
            preview={
              <div
                className="w-10 h-10 rounded-lg shadow-inner"
                style={{ backgroundColor: color.value }}
              />
            }
          />
        ))}
      </TokenSection>

      <TokenSection
        title="Surface Colors"
        description="Background and surface colors"
      >
        {surfaceColors.map((color) => (
          <TokenValue
            key={color.name}
            name={color.name}
            value={color.value}
            cssVar={`var(${color.css})`}
            tailwind={color.tw}
            preview={
              <div
                className="w-10 h-10 rounded-lg border border-slate-200"
                style={{ backgroundColor: color.value }}
              />
            }
          />
        ))}
      </TokenSection>

      <TokenSection
        title="Text Colors"
        description="Typography colors for different hierarchies"
      >
        {textColors.map((color) => (
          <TokenValue
            key={color.name}
            name={color.name}
            value={color.value}
            cssVar={`var(${color.css})`}
            tailwind={`text-${color.tw}`}
            preview={
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                style={{
                  color: color.value,
                  backgroundColor:
                    color.value === "#ffffff" ? "#0f172a" : "#f8fafc",
                }}
              >
                Aa
              </div>
            }
          />
        ))}
      </TokenSection>
    </div>
  ),
};

// =============================================================================
// TYPOGRAPHY
// =============================================================================

const fontSizes = [
  {
    name: "xs",
    value: "0.75rem / 12px",
    css: "--font-size-xs",
    tw: "text-xs",
    size: "12px",
  },
  {
    name: "sm",
    value: "0.875rem / 14px",
    css: "--font-size-sm",
    tw: "text-sm",
    size: "14px",
  },
  {
    name: "base",
    value: "1rem / 16px",
    css: "--font-size-base",
    tw: "text-base",
    size: "16px",
  },
  {
    name: "lg",
    value: "1.125rem / 18px",
    css: "--font-size-lg",
    tw: "text-lg",
    size: "18px",
  },
  {
    name: "xl",
    value: "1.25rem / 20px",
    css: "--font-size-xl",
    tw: "text-xl",
    size: "20px",
  },
  {
    name: "2xl",
    value: "1.5rem / 24px",
    css: "--font-size-2xl",
    tw: "text-2xl",
    size: "24px",
  },
  {
    name: "3xl",
    value: "1.875rem / 30px",
    css: "--font-size-3xl",
    tw: "text-3xl",
    size: "30px",
  },
  {
    name: "4xl",
    value: "2.25rem / 36px",
    css: "--font-size-4xl",
    tw: "text-4xl",
    size: "36px",
  },
  {
    name: "5xl",
    value: "3rem / 48px",
    css: "--font-size-5xl",
    tw: "text-5xl",
    size: "48px",
  },
];

const fontWeights = [
  { name: "Light", value: "300", css: "--font-weight-light", tw: "font-light" },
  {
    name: "Normal",
    value: "400",
    css: "--font-weight-normal",
    tw: "font-normal",
  },
  {
    name: "Medium",
    value: "500",
    css: "--font-weight-medium",
    tw: "font-medium",
  },
  {
    name: "Semibold",
    value: "600",
    css: "--font-weight-semibold",
    tw: "font-semibold",
  },
  { name: "Bold", value: "700", css: "--font-weight-bold", tw: "font-bold" },
];

const lineHeights = [
  { name: "None", value: "1", css: "--line-height-none", tw: "leading-none" },
  {
    name: "Tight",
    value: "1.25",
    css: "--line-height-tight",
    tw: "leading-tight",
  },
  {
    name: "Snug",
    value: "1.375",
    css: "--line-height-snug",
    tw: "leading-snug",
  },
  {
    name: "Normal",
    value: "1.5",
    css: "--line-height-normal",
    tw: "leading-normal",
  },
  {
    name: "Relaxed",
    value: "1.625",
    css: "--line-height-relaxed",
    tw: "leading-relaxed",
  },
  {
    name: "Loose",
    value: "2",
    css: "--line-height-loose",
    tw: "leading-loose",
  },
];

export const Typography: Story = {
  name: "🔤 Typography",
  render: () => (
    <div className="space-y-8">
      <TokenSection
        title="Font Sizes"
        description="Text size scale from xs to 5xl"
      >
        {fontSizes.map((size) => (
          <TokenValue
            key={size.name}
            name={size.name}
            value={size.value}
            cssVar={`var(${size.css})`}
            tailwind={size.tw}
            preview={
              <span style={{ fontSize: size.size }} className="font-semibold">
                Aa
              </span>
            }
          />
        ))}
      </TokenSection>

      <TokenSection
        title="Font Weights"
        description="Weight variations from light to bold"
      >
        {fontWeights.map((weight) => (
          <TokenValue
            key={weight.name}
            name={weight.name}
            value={weight.value}
            cssVar={`var(${weight.css})`}
            tailwind={weight.tw}
            preview={
              <span style={{ fontWeight: weight.value }} className="text-lg">
                Aa
              </span>
            }
          />
        ))}
      </TokenSection>

      <TokenSection
        title="Line Heights"
        description="Line height scale for different text densities"
      >
        {lineHeights.map((lh) => (
          <TokenValue
            key={lh.name}
            name={lh.name}
            value={lh.value}
            cssVar={`var(${lh.css})`}
            tailwind={lh.tw}
            preview={
              <div
                className="w-12 text-[10px] leading-[1]"
                style={{ lineHeight: lh.value }}
              >
                Line
                <br />
                Height
              </div>
            }
          />
        ))}
      </TokenSection>
    </div>
  ),
};

// =============================================================================
// SPACING
// =============================================================================

const spacingScale = [
  { name: "0", value: "0px", css: "--spacing-0", tw: "p-0 m-0" },
  { name: "0.5", value: "0.125rem / 2px", css: "--spacing-0.5", tw: "p-0.5" },
  { name: "1", value: "0.25rem / 4px", css: "--spacing-1", tw: "p-1" },
  { name: "2", value: "0.5rem / 8px", css: "--spacing-2", tw: "p-2" },
  { name: "3", value: "0.75rem / 12px", css: "--spacing-3", tw: "p-3" },
  { name: "4", value: "1rem / 16px", css: "--spacing-4", tw: "p-4" },
  { name: "5", value: "1.25rem / 20px", css: "--spacing-5", tw: "p-5" },
  { name: "6", value: "1.5rem / 24px", css: "--spacing-6", tw: "p-6" },
  { name: "8", value: "2rem / 32px", css: "--spacing-8", tw: "p-8" },
  { name: "10", value: "2.5rem / 40px", css: "--spacing-10", tw: "p-10" },
  { name: "12", value: "3rem / 48px", css: "--spacing-12", tw: "p-12" },
  { name: "16", value: "4rem / 64px", css: "--spacing-16", tw: "p-16" },
  { name: "20", value: "5rem / 80px", css: "--spacing-20", tw: "p-20" },
  { name: "24", value: "6rem / 96px", css: "--spacing-24", tw: "p-24" },
];

export const Spacing: Story = {
  name: "📏 Spacing",
  render: () => (
    <div className="space-y-8">
      <TokenSection
        title="Spacing Scale"
        description="Consistent spacing values for margins, padding, and gaps"
      >
        {spacingScale.map((space) => (
          <TokenValue
            key={space.name}
            name={space.name}
            value={space.value}
            cssVar={`var(${space.css})`}
            tailwind={space.tw}
            preview={
              <div className="h-10 flex items-center">
                <div
                  className="h-4 bg-primary rounded"
                  style={{
                    width: space.value.includes("px")
                      ? space.value.split("/")[1]?.trim() || space.value
                      : "0px",
                  }}
                />
              </div>
            }
          />
        ))}
      </TokenSection>

      {/* Visual Spacing Guide */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-bold mb-4">Visual Spacing Reference</h3>
        <div className="flex items-end gap-2">
          {[1, 2, 3, 4, 6, 8, 12, 16].map((size) => (
            <div key={size} className="flex flex-col items-center">
              <div
                className="bg-primary rounded w-8"
                style={{ height: `${size * 4}px` }}
              />
              <span className="text-xs mt-2 text-slate-500">{size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// BORDERS & RADIUS
// =============================================================================

const borderRadius = [
  { name: "none", value: "0px", css: "--radius-none", tw: "rounded-none" },
  { name: "sm", value: "0.125rem / 2px", css: "--radius-sm", tw: "rounded-sm" },
  { name: "default", value: "0.25rem / 4px", css: "--radius", tw: "rounded" },
  { name: "md", value: "0.375rem / 6px", css: "--radius-md", tw: "rounded-md" },
  { name: "lg", value: "0.5rem / 8px", css: "--radius-lg", tw: "rounded-lg" },
  { name: "xl", value: "0.75rem / 12px", css: "--radius-xl", tw: "rounded-xl" },
  { name: "2xl", value: "1rem / 16px", css: "--radius-2xl", tw: "rounded-2xl" },
  {
    name: "3xl",
    value: "1.5rem / 24px",
    css: "--radius-3xl",
    tw: "rounded-3xl",
  },
  { name: "full", value: "9999px", css: "--radius-full", tw: "rounded-full" },
];

const borderWidths = [
  { name: "0", value: "0px", css: "--border-0", tw: "border-0" },
  { name: "default", value: "1px", css: "--border", tw: "border" },
  { name: "2", value: "2px", css: "--border-2", tw: "border-2" },
  { name: "4", value: "4px", css: "--border-4", tw: "border-4" },
  { name: "8", value: "8px", css: "--border-8", tw: "border-8" },
];

export const Borders: Story = {
  name: "🔲 Borders & Radius",
  render: () => (
    <div className="space-y-8">
      <TokenSection
        title="Border Radius"
        description="Corner radius values from sharp to fully rounded"
      >
        {borderRadius.map((radius) => (
          <TokenValue
            key={radius.name}
            name={radius.name}
            value={radius.value}
            cssVar={`var(${radius.css})`}
            tailwind={radius.tw}
            preview={
              <div
                className="w-10 h-10 bg-primary"
                style={{
                  borderRadius: radius.value.includes("px")
                    ? radius.value.split("/")[1]?.trim() || radius.value
                    : "0px",
                }}
              />
            }
          />
        ))}
      </TokenSection>

      <TokenSection title="Border Widths" description="Border thickness values">
        {borderWidths.map((width) => (
          <TokenValue
            key={width.name}
            name={width.name}
            value={width.value}
            cssVar={`var(${width.css})`}
            tailwind={width.tw}
            preview={
              <div
                className="w-10 h-10 rounded-lg border-primary"
                style={{
                  borderWidth: width.value,
                  borderStyle: "solid",
                  borderColor: "#6366f1",
                }}
              />
            }
          />
        ))}
      </TokenSection>
    </div>
  ),
};

// =============================================================================
// SHADOWS
// =============================================================================

const shadows = [
  {
    name: "sm",
    value: "0 1px 2px rgba(0,0,0,0.05)",
    css: "--shadow-sm",
    tw: "shadow-sm",
  },
  {
    name: "default",
    value: "0 1px 3px rgba(0,0,0,0.1)",
    css: "--shadow",
    tw: "shadow",
  },
  {
    name: "md",
    value: "0 4px 6px rgba(0,0,0,0.1)",
    css: "--shadow-md",
    tw: "shadow-md",
  },
  {
    name: "lg",
    value: "0 10px 15px rgba(0,0,0,0.1)",
    css: "--shadow-lg",
    tw: "shadow-lg",
  },
  {
    name: "xl",
    value: "0 20px 25px rgba(0,0,0,0.1)",
    css: "--shadow-xl",
    tw: "shadow-xl",
  },
  {
    name: "2xl",
    value: "0 25px 50px rgba(0,0,0,0.25)",
    css: "--shadow-2xl",
    tw: "shadow-2xl",
  },
  {
    name: "inner",
    value: "inset 0 2px 4px rgba(0,0,0,0.06)",
    css: "--shadow-inner",
    tw: "shadow-inner",
  },
  { name: "none", value: "none", css: "--shadow-none", tw: "shadow-none" },
];

export const Shadows: Story = {
  name: "🌑 Shadows",
  render: () => (
    <div className="space-y-8">
      <TokenSection
        title="Box Shadows"
        description="Elevation and depth through shadow effects"
      >
        {shadows.map((shadow) => (
          <TokenValue
            key={shadow.name}
            name={shadow.name}
            value={shadow.value}
            cssVar={`var(${shadow.css})`}
            tailwind={shadow.tw}
            preview={
              <div
                className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg"
                style={{ boxShadow: shadow.value }}
              />
            }
          />
        ))}
      </TokenSection>

      {/* Shadow Comparison */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-8">
        <h3 className="font-bold mb-6">Shadow Comparison</h3>
        <div className="flex justify-around items-center">
          {["sm", "md", "lg", "xl", "2xl"].map((size) => {
            const shadow = shadows.find((s) => s.name === size);
            return (
              <div key={size} className="text-center">
                <div
                  className="w-20 h-20 bg-white dark:bg-slate-700 rounded-lg mb-2"
                  style={{ boxShadow: shadow?.value }}
                />
                <span className="text-xs text-slate-500">{size}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// Z-INDEX
// =============================================================================

const zIndexScale = [
  { name: "auto", value: "auto", css: "--z-auto", tw: "z-auto" },
  { name: "0", value: "0", css: "--z-0", tw: "z-0" },
  { name: "10", value: "10", css: "--z-10", tw: "z-10" },
  { name: "20", value: "20", css: "--z-20", tw: "z-20" },
  { name: "30", value: "30", css: "--z-30", tw: "z-30" },
  { name: "40", value: "40", css: "--z-40", tw: "z-40" },
  { name: "50", value: "50", css: "--z-50", tw: "z-50" },
  { name: "dropdown", value: "1000", css: "--z-dropdown", tw: "z-[1000]" },
  { name: "modal", value: "1100", css: "--z-modal", tw: "z-[1100]" },
  { name: "popover", value: "1200", css: "--z-popover", tw: "z-[1200]" },
  { name: "tooltip", value: "1300", css: "--z-tooltip", tw: "z-[1300]" },
  { name: "toast", value: "1400", css: "--z-toast", tw: "z-[1400]" },
];

export const ZIndex: Story = {
  name: "📚 Z-Index",
  render: () => (
    <div className="space-y-8">
      <TokenSection
        title="Z-Index Scale"
        description="Stacking order values for layered UI elements"
      >
        {zIndexScale.map((z) => (
          <TokenValue
            key={z.name}
            name={z.name}
            value={z.value}
            cssVar={`var(${z.css})`}
            tailwind={z.tw}
            preview={
              <div className="w-10 h-10 flex items-center justify-center text-xs font-mono font-bold text-slate-500">
                {z.value}
              </div>
            }
          />
        ))}
      </TokenSection>

      {/* Z-Index Visual Stack */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold mb-4">Layer Stack Visualization</h3>
        <div className="relative h-48" style={{ perspective: "500px" }}>
          {[
            "Base (0)",
            "Dropdown (1000)",
            "Modal (1100)",
            "Tooltip (1300)",
            "Toast (1400)",
          ].map((layer, i) => (
            <div
              key={layer}
              className="absolute inset-x-0 h-8 bg-primary text-white text-sm flex items-center justify-center rounded"
              style={{
                bottom: `${i * 40}px`,
                opacity: 0.5 + i * 0.1,
                transform: `translateZ(${i * 20}px)`,
              }}
            >
              {layer}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
