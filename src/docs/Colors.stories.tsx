import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta: Meta = {
  title: "Design Tokens/Colors",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

const ColorSwatch = ({
  name,
  value,
  cssVar,
  textColor = "white",
}: {
  name: string;
  value: string;
  cssVar: string;
  textColor?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="rounded-lg overflow-hidden border border-border cursor-pointer transition-transform hover:scale-105"
      onClick={() => copyToClipboard(cssVar)}
    >
      <div
        className="h-20 flex items-end p-3"
        style={{ backgroundColor: value }}
      >
        <span className="text-xs font-mono" style={{ color: textColor }}>
          {copied ? "✓ Copied!" : value}
        </span>
      </div>
      <div className="p-3 bg-card">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{cssVar}</p>
      </div>
    </div>
  );
};

const ColorSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    {description && <p className="text-muted-foreground mb-6">{description}</p>}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {children}
    </div>
  </div>
);

export const AllColors: StoryObj = {
  name: "All Colors",
  render: () => (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Color System</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Click any color to copy its CSS variable. All colors support dark
          mode.
        </p>

        <ColorSection
          title="Brand Colors"
          description="Primary brand colors used throughout the app"
        >
          <ColorSwatch
            name="Primary"
            value="hsl(217.2 91.2% 59.8%)"
            cssVar="hsl(var(--primary))"
          />
          <ColorSwatch
            name="Primary Foreground"
            value="hsl(222 47% 7%)"
            cssVar="hsl(var(--primary-foreground))"
            textColor="white"
          />
          <ColorSwatch
            name="Secondary"
            value="hsl(217.2 32.6% 17.5%)"
            cssVar="hsl(var(--secondary))"
          />
          <ColorSwatch
            name="Accent"
            value="hsl(217.2 32.6% 17.5%)"
            cssVar="hsl(var(--accent))"
          />
        </ColorSection>

        <ColorSection
          title="Background Colors"
          description="Surface and background colors"
        >
          <ColorSwatch
            name="Background"
            value="hsl(222 47% 7%)"
            cssVar="hsl(var(--background))"
          />
          <ColorSwatch
            name="Foreground"
            value="hsl(210 40% 98%)"
            cssVar="hsl(var(--foreground))"
            textColor="black"
          />
          <ColorSwatch
            name="Card"
            value="hsl(222 47% 9%)"
            cssVar="hsl(var(--card))"
          />
          <ColorSwatch
            name="Popover"
            value="hsl(222 47% 9%)"
            cssVar="hsl(var(--popover))"
          />
          <ColorSwatch
            name="Muted"
            value="hsl(217.2 32.6% 17.5%)"
            cssVar="hsl(var(--muted))"
          />
          <ColorSwatch
            name="Muted Foreground"
            value="hsl(215 20.2% 65.1%)"
            cssVar="hsl(var(--muted-foreground))"
            textColor="black"
          />
        </ColorSection>

        <ColorSection
          title="Trading Colors"
          description="Colors for buy/sell, profit/loss, and price movements"
        >
          <ColorSwatch
            name="Buy / Profit"
            value="hsl(142 76% 36%)"
            cssVar="--skai-buy"
          />
          <ColorSwatch
            name="Buy Light"
            value="hsl(142 76% 45%)"
            cssVar="--skai-success-light"
          />
          <ColorSwatch
            name="Sell / Loss"
            value="hsl(0 84% 60%)"
            cssVar="--skai-sell"
          />
          <ColorSwatch
            name="Sell Light"
            value="hsl(0 84% 70%)"
            cssVar="--skai-error-light"
          />
          <ColorSwatch
            name="Warning"
            value="hsl(38 92% 50%)"
            cssVar="--skai-warning"
          />
          <ColorSwatch
            name="Info"
            value="hsl(217 91% 60%)"
            cssVar="--skai-info"
          />
        </ColorSection>

        <ColorSection
          title="Semantic Colors"
          description="Colors for feedback and status"
        >
          <ColorSwatch
            name="Destructive"
            value="hsl(0 84% 60%)"
            cssVar="hsl(var(--destructive))"
          />
          <ColorSwatch
            name="Success"
            value="hsl(142 76% 36%)"
            cssVar="--skai-success"
          />
          <ColorSwatch
            name="Warning"
            value="hsl(38 92% 50%)"
            cssVar="--skai-warning"
          />
          <ColorSwatch
            name="Info"
            value="hsl(217 91% 60%)"
            cssVar="--skai-info"
          />
        </ColorSection>

        <ColorSection
          title="Border & Ring"
          description="Border and focus ring colors"
        >
          <ColorSwatch
            name="Border"
            value="hsl(217.2 32.6% 17.5%)"
            cssVar="hsl(var(--border))"
          />
          <ColorSwatch
            name="Input"
            value="hsl(217.2 32.6% 17.5%)"
            cssVar="hsl(var(--input))"
          />
          <ColorSwatch
            name="Ring"
            value="hsl(224.3 76.3% 48%)"
            cssVar="hsl(var(--ring))"
          />
        </ColorSection>

        <div className="mt-12 p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            {`// Using Tailwind classes (recommended)
<div className="bg-primary text-primary-foreground">
  Primary button
</div>

<span className="text-green-500">+$123.45</span>
<span className="text-red-500">-$67.89</span>

// Using CSS variables
<div style={{ backgroundColor: 'hsl(var(--card))' }}>
  Card content
</div>`}
          </pre>
        </div>
      </div>
    </div>
  ),
};

export const TradingColors: StoryObj = {
  name: "Trading Colors",
  render: () => (
    <div className="p-8 bg-background">
      <h1 className="text-3xl font-bold mb-6">Trading Color Guide</h1>

      <div className="grid gap-6 max-w-4xl">
        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Price Changes</h2>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-mono text-green-500">+12.34%</p>
              <p className="text-sm text-muted-foreground mt-1">
                Price increase
              </p>
            </div>
            <div>
              <p className="text-3xl font-mono text-red-500">-5.67%</p>
              <p className="text-sm text-muted-foreground mt-1">
                Price decrease
              </p>
            </div>
            <div>
              <p className="text-3xl font-mono text-muted-foreground">0.00%</p>
              <p className="text-sm text-muted-foreground mt-1">No change</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Buy / Sell Actions</h2>
          <div className="flex gap-4">
            <button className="flex-1 py-3 px-6 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors">
              Buy
            </button>
            <button className="flex-1 py-3 px-6 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
              Sell
            </button>
          </div>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Order Book</h2>
          <div className="space-y-1 font-mono text-sm">
            <div
              className="flex justify-between p-2 rounded"
              style={{ backgroundColor: "hsl(0 84% 60% / 0.15)" }}
            >
              <span className="text-red-500">2,150.00</span>
              <span>1.234</span>
            </div>
            <div
              className="flex justify-between p-2 rounded"
              style={{ backgroundColor: "hsl(0 84% 60% / 0.1)" }}
            >
              <span className="text-red-500">2,149.50</span>
              <span>0.567</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded text-center">
              <span className="w-full font-semibold">$2,148.75</span>
            </div>
            <div
              className="flex justify-between p-2 rounded"
              style={{ backgroundColor: "hsl(142 76% 36% / 0.1)" }}
            >
              <span className="text-green-500">2,148.00</span>
              <span>2.345</span>
            </div>
            <div
              className="flex justify-between p-2 rounded"
              style={{ backgroundColor: "hsl(142 76% 36% / 0.15)" }}
            >
              <span className="text-green-500">2,147.50</span>
              <span>0.891</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Status Indicators</h2>
          <div className="flex gap-4 flex-wrap">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500">
              ● Connected
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-500">
              ● Pending
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-500">
              ● Failed
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500">
              ● Processing
            </span>
          </div>
        </div>
      </div>
    </div>
  ),
};
