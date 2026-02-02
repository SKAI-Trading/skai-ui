import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "../components/card";
import { Button } from "../components/button";

/**
 * # Figma Integration Guide
 *
 * How to translate Figma designs into SKAI components.
 * A comprehensive guide for designers and developers working between Figma and code.
 */

const meta: Meta = {
  title: "Design System/Figma Integration",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Figma Integration Guide

A comprehensive guide for translating Figma designs into production-ready components.
This guide covers naming conventions, token mapping, and best practices.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// Section Component
const Section = ({
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
    <p className="text-slate-600 dark:text-slate-400 mb-6">{description}</p>
    {children}
  </div>
);

// Mapping Table
const MappingTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) => (
  <div className="overflow-x-auto">
    <table className="w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <thead className="bg-slate-50 dark:bg-slate-800">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="text-left px-4 py-3 text-sm font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 text-sm">
                {cell.startsWith("`") ? (
                  <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                    {cell.slice(1, -1)}
                  </code>
                ) : (
                  cell
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Overview: Story = {
  name: "🎨 Overview",
  render: () => (
    <div className="space-y-12">
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Figma → Code Workflow</h1>
        <p className="text-lg opacity-90">
          This guide helps UX/UI designers translate Figma designs into
          production-ready components.
        </p>
      </div>

      {/* Workflow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            step: 1,
            title: "Design in Figma",
            desc: "Use SKAI component library and design tokens",
            icon: "🎨",
          },
          {
            step: 2,
            title: "Export Specs",
            desc: "Note colors, spacing, typography values",
            icon: "📋",
          },
          {
            step: 3,
            title: "Map to Tokens",
            desc: "Find matching Tailwind classes",
            icon: "🔄",
          },
          {
            step: 4,
            title: "Compose Components",
            desc: "Build using existing SKAI components",
            icon: "🧱",
          },
        ].map((item) => (
          <Card key={item.step} className="p-4">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {item.step}
              </span>
              <h3 className="font-bold">{item.title}</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {item.desc}
            </p>
          </Card>
        ))}
      </div>

      {/* Quick Reference */}
      <Section
        title="Quick Reference"
        description="Most common Figma → Tailwind mappings"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="font-bold mb-3">Colors</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Primary/500</span>
                <code className="bg-slate-100 dark:bg-slate-800 px-2 rounded">
                  bg-primary
                </code>
              </div>
              <div className="flex justify-between">
                <span>Gray/100</span>
                <code className="bg-slate-100 dark:bg-slate-800 px-2 rounded">
                  bg-slate-100
                </code>
              </div>
              <div className="flex justify-between">
                <span>Success</span>
                <code className="bg-slate-100 dark:bg-slate-800 px-2 rounded">
                  text-green-500
                </code>
              </div>
              <div className="flex justify-between">
                <span>Error</span>
                <code className="bg-slate-100 dark:bg-slate-800 px-2 rounded">
                  text-red-500
                </code>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold mb-3">Spacing</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>4px</span>
                <code className="bg-slate-100 px-2 rounded">
                  p-1, m-1, gap-1
                </code>
              </div>
              <div className="flex justify-between">
                <span>8px</span>
                <code className="bg-slate-100 px-2 rounded">
                  p-2, m-2, gap-2
                </code>
              </div>
              <div className="flex justify-between">
                <span>16px</span>
                <code className="bg-slate-100 px-2 rounded">
                  p-4, m-4, gap-4
                </code>
              </div>
              <div className="flex justify-between">
                <span>24px</span>
                <code className="bg-slate-100 px-2 rounded">
                  p-6, m-6, gap-6
                </code>
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  ),
};

export const ColorMapping: Story = {
  name: "🎨 Color Mapping",
  render: () => (
    <Section
      title="Color Token Mapping"
      description="How to translate Figma color tokens to Tailwind classes"
    >
      <MappingTable
        headers={["Figma Token", "Hex Value", "Tailwind Class", "Usage"]}
        rows={[
          ["Primary/500", "#6366f1", "`bg-primary`", "Primary buttons, links"],
          ["Primary/600", "#4f46e5", "`bg-primary-dark`", "Hover states"],
          ["Primary/400", "#818cf8", "`bg-primary-light`", "Backgrounds"],
          ["Gray/50", "#f8fafc", "`bg-slate-50`", "Page backgrounds"],
          ["Gray/100", "#f1f5f9", "`bg-slate-100`", "Card backgrounds"],
          ["Gray/200", "#e2e8f0", "`border-slate-200`", "Borders"],
          ["Gray/500", "#64748b", "`text-slate-500`", "Secondary text"],
          ["Gray/900", "#0f172a", "`text-slate-900`", "Primary text"],
          ["Success/500", "#22c55e", "`text-green-500`", "Success states"],
          ["Error/500", "#ef4444", "`text-red-500`", "Error states"],
          ["Warning/500", "#f59e0b", "`text-amber-500`", "Warning states"],
        ]}
      />

      {/* Color Examples */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: "Primary", bg: "bg-primary", text: "text-white" },
          { name: "Success", bg: "bg-green-500", text: "text-white" },
          { name: "Warning", bg: "bg-amber-500", text: "text-white" },
          { name: "Error", bg: "bg-red-500", text: "text-white" },
        ].map((color) => (
          <div
            key={color.name}
            className={`${color.bg} ${color.text} rounded-lg p-4 text-center font-semibold`}
          >
            {color.name}
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const SpacingMapping: Story = {
  name: "📏 Spacing Mapping",
  render: () => (
    <Section
      title="Spacing Token Mapping"
      description="How to translate Figma spacing values to Tailwind classes"
    >
      <MappingTable
        headers={[
          "Figma Value",
          "Tailwind Value",
          "Class Examples",
          "Common Uses",
        ]}
        rows={[
          ["0", "0", "`p-0 m-0 gap-0`", "Reset spacing"],
          ["2px", "0.5", "`p-0.5 gap-0.5`", "Tight spacing"],
          ["4px", "1", "`p-1 m-1 gap-1`", "Icon padding"],
          ["8px", "2", "`p-2 m-2 gap-2`", "Compact layouts"],
          ["12px", "3", "`p-3 m-3 gap-3`", "List items"],
          ["16px", "4", "`p-4 m-4 gap-4`", "Card padding"],
          ["20px", "5", "`p-5 m-5 gap-5`", "Medium spacing"],
          ["24px", "6", "`p-6 m-6 gap-6`", "Section padding"],
          ["32px", "8", "`p-8 m-8 gap-8`", "Large sections"],
          ["48px", "12", "`p-12 m-12 gap-12`", "Page sections"],
        ]}
      />

      {/* Visual Spacing Reference */}
      <div className="mt-6 bg-slate-100 dark:bg-slate-800 rounded-lg p-6">
        <h3 className="font-bold mb-4">Visual Reference</h3>
        <div className="flex items-end gap-2">
          {[1, 2, 3, 4, 6, 8, 12].map((size) => (
            <div key={size} className="flex flex-col items-center">
              <div
                className="bg-primary rounded"
                style={{ width: "24px", height: `${size * 4}px` }}
              />
              <span className="text-xs mt-2 text-slate-500">{size * 4}px</span>
              <span className="text-xs text-slate-400">p-{size}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  ),
};

export const TypographyMapping: Story = {
  name: "🔤 Typography Mapping",
  render: () => (
    <Section
      title="Typography Token Mapping"
      description="How to translate Figma text styles to Tailwind classes"
    >
      <MappingTable
        headers={["Figma Style", "Size", "Tailwind Class", "Usage"]}
        rows={[
          ["Display/Large", "48px", "`text-5xl font-bold`", "Hero headlines"],
          ["Display/Medium", "36px", "`text-4xl font-bold`", "Page titles"],
          ["Heading/H1", "30px", "`text-3xl font-bold`", "Section titles"],
          ["Heading/H2", "24px", "`text-2xl font-semibold`", "Card titles"],
          ["Heading/H3", "20px", "`text-xl font-semibold`", "Sub-sections"],
          ["Body/Large", "18px", "`text-lg`", "Lead paragraphs"],
          ["Body/Default", "16px", "`text-base`", "Body text"],
          ["Body/Small", "14px", "`text-sm`", "Secondary text"],
          ["Caption", "12px", "`text-xs`", "Labels, hints"],
        ]}
      />

      {/* Typography Examples */}
      <div className="mt-6 space-y-4">
        <div>
          <span className="text-xs text-slate-500">
            Display/Large - text-5xl font-bold
          </span>
          <p className="text-5xl font-bold">Portfolio Overview</p>
        </div>
        <div>
          <span className="text-xs text-slate-500">
            Heading/H2 - text-2xl font-semibold
          </span>
          <p className="text-2xl font-semibold">Your Assets</p>
        </div>
        <div>
          <span className="text-xs text-slate-500">
            Body/Default - text-base
          </span>
          <p className="text-base">
            Track your portfolio performance across all connected wallets and
            exchanges.
          </p>
        </div>
        <div>
          <span className="text-xs text-slate-500">
            Caption - text-xs text-slate-500
          </span>
          <p className="text-xs text-slate-500">Last updated 5 minutes ago</p>
        </div>
      </div>
    </Section>
  ),
};

export const ComponentMapping: Story = {
  name: "🧱 Component Mapping",
  render: () => (
    <Section
      title="Figma to React Component Mapping"
      description="How Figma components translate to SKAI React components"
    >
      <MappingTable
        headers={["Figma Component", "React Component", "Import", "Notes"]}
        rows={[
          [
            "Button/Primary",
            "Button",
            '`import { Button } from "@skai/ui"`',
            "Default variant",
          ],
          [
            "Button/Secondary",
            'Button variant="secondary"',
            '`import { Button } from "@skai/ui"`',
            "Secondary variant",
          ],
          [
            "Button/Ghost",
            'Button variant="ghost"',
            '`import { Button } from "@skai/ui"`',
            "Ghost variant",
          ],
          [
            "Card",
            "Card",
            '`import { Card } from "@skai/ui"`',
            "Basic container",
          ],
          [
            "Badge/Default",
            "Badge",
            '`import { Badge } from "@skai/ui"`',
            "Status indicators",
          ],
          [
            "Input/Text",
            "Input",
            '`import { Input } from "@skai/ui"`',
            "Form input",
          ],
          [
            "Checkbox",
            "Checkbox",
            '`import { Checkbox } from "@skai/ui"`',
            "Toggle options",
          ],
          [
            "Select",
            "Select",
            '`import { Select } from "@skai/ui"`',
            "Dropdown",
          ],
          [
            "Dialog",
            "Dialog",
            '`import { Dialog } from "@skai/ui"`',
            "Modal dialogs",
          ],
          [
            "Tabs",
            "Tabs",
            '`import { Tabs } from "@skai/ui"`',
            "Tab navigation",
          ],
        ]}
      />

      {/* Component Examples */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-bold mb-3">Button Variants</h3>
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold mb-3">Button Sizes</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </Card>
      </div>
    </Section>
  ),
};

export const WorkflowTips: Story = {
  name: "💡 Workflow Tips",
  render: () => (
    <div className="space-y-8">
      <Section
        title="Best Practices"
        description="Tips for an efficient Figma to code workflow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: "✅",
              title: "Use Auto Layout",
              desc: "Figma Auto Layout maps directly to Flexbox in CSS. Use it consistently.",
            },
            {
              icon: "✅",
              title: "Name Layers Semantically",
              desc: "Use names like 'Header', 'Card', 'PriceDisplay' - not 'Frame 123'.",
            },
            {
              icon: "✅",
              title: "Use Design Tokens",
              desc: "Always use color styles, text styles, and effect styles from the library.",
            },
            {
              icon: "✅",
              title: "Document States",
              desc: "Show all interactive states: default, hover, active, disabled, error.",
            },
            {
              icon: "❌",
              title: "Avoid Magic Numbers",
              desc: "Don't use arbitrary values like '17px' - stick to the 4px grid (4, 8, 12, 16...).",
            },
            {
              icon: "❌",
              title: "Don't Flatten Components",
              desc: "Keep component structure intact so developers can understand the hierarchy.",
            },
          ].map((tip, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">{tip.icon}</span>
                <div>
                  <h4 className="font-bold">{tip.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {tip.desc}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Dev Mode Handoff */}
      <Section
        title="Using Figma Dev Mode"
        description="How to extract implementation details from Figma"
      >
        <div className="bg-slate-900 rounded-lg p-6 text-white">
          <h3 className="font-bold mb-4">In Figma Dev Mode, look for:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Layout</p>
              <ul className="text-sm space-y-1">
                <li>• Display (flex/grid)</li>
                <li>• Direction (row/column)</li>
                <li>• Gap values</li>
                <li>• Alignment</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Spacing</p>
              <ul className="text-sm space-y-1">
                <li>• Padding (all sides)</li>
                <li>• Margin (if any)</li>
                <li>• Gap between items</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Styling</p>
              <ul className="text-sm space-y-1">
                <li>• Fill colors</li>
                <li>• Border radius</li>
                <li>• Shadows</li>
                <li>• Typography</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </div>
  ),
};
