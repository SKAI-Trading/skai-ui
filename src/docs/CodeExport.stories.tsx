import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../components/core/button";
import { Card } from "../components/core/card";
import { Badge } from "../components/core/badge";

/**
 * # Code Export System
 *
 * One-click copy of production-ready code snippets for any component or pattern.
 * Perfect for designers and developers who need quick access to working code.
 */

// Code Block with Copy
const CodeBlock = ({
  title,
  language,
  code,
  description,
}: {
  title: string;
  language: string;
  code: string;
  description?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm">{title}</h4>
          <Badge variant="outline" className="text-xs">
            {language}
          </Badge>
        </div>
        <Button
          size="sm"
          variant={copied ? "default" : "outline"}
          onClick={handleCopy}
        >
          {copied ? "✓ Copied!" : "Copy Code"}
        </Button>
      </div>
      {description && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
          {description}
        </div>
      )}
      <div className="p-4 bg-slate-900 overflow-x-auto">
        <pre className="text-sm text-green-400 font-mono whitespace-pre">
          {code}
        </pre>
      </div>
    </Card>
  );
};

// Pattern Section
const PatternSection = ({
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
    <div className="space-y-6">{children}</div>
  </div>
);

const meta: Meta = {
  title: "Design System/Code Export",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Code Export System

Ready-to-use code snippets for all SKAI components and patterns.
Just click "Copy Code" and paste into your project.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const ButtonSnippets: Story = {
  name: "🔘 Button Snippets",
  render: () => (
    <PatternSection
      title="Button Components"
      description="All button variants with proper imports and usage"
    >
      <CodeBlock
        title="Basic Import"
        language="tsx"
        code={`import { Button } from "@skai/ui";`}
      />

      <CodeBlock
        title="Button Variants"
        language="tsx"
        code={`// Primary (default)
<Button>Click Me</Button>

// Secondary
<Button variant="secondary">Secondary</Button>

// Outline
<Button variant="outline">Outline</Button>

// Ghost
<Button variant="ghost">Ghost</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Link style
<Button variant="link">Learn more</Button>`}
      />

      <CodeBlock
        title="Button Sizes"
        language="tsx"
        code={`// Small
<Button size="sm">Small</Button>

// Default
<Button>Default</Button>

// Large
<Button size="lg">Large</Button>

// Icon only
<Button size="icon"><IconHeart /></Button>`}
      />

      <CodeBlock
        title="Button with Icon"
        language="tsx"
        code={`import { Button } from "@skai/ui";
import { ArrowRight, Loader2 } from "lucide-react";

// Icon on right
<Button>
  Continue <ArrowRight className="ml-2 h-4 w-4" />
</Button>

// Loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Please wait
</Button>`}
      />
    </PatternSection>
  ),
};

export const CardSnippets: Story = {
  name: "📦 Card Snippets",
  render: () => (
    <PatternSection
      title="Card Components"
      description="Card patterns for content containers and data display"
    >
      <CodeBlock
        title="Basic Card"
        language="tsx"
        code={`import { Card } from "@skai/ui";

<Card className="p-6">
  <h3 className="font-semibold">Card Title</h3>
  <p className="text-slate-600 text-sm mt-1">Card content here</p>
</Card>`}
      />

      <CodeBlock
        title="Card with Header & Actions"
        language="tsx"
        code={`import { Card } from "@skai/ui";
import { Button } from "@skai/ui";

<Card>
  <div className="flex items-center justify-between p-4 border-b">
    <div>
      <h3 className="font-semibold">Portfolio</h3>
      <p className="text-slate-500 text-sm">Your assets</p>
    </div>
    <Button size="sm" variant="outline">View All</Button>
  </div>
  <div className="p-4">
    <p className="text-2xl font-bold">$124,567.89</p>
    <p className="text-green-500 text-sm">+2.34% today</p>
  </div>
</Card>`}
      />

      <CodeBlock
        title="Stat Card"
        language="tsx"
        code={`import { Card } from "@skai/ui";

const StatCard = ({ label, value, change }) => (
  <Card className="p-4">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
    {change && (
      <p className={\`text-sm \${change >= 0 ? 'text-green-500' : 'text-red-500'}\`}>
        {change >= 0 ? '+' : ''}{change}%
      </p>
    )}
  </Card>
);

// Usage
<StatCard label="Total Balance" value="$124,567" change={2.34} />`}
      />
    </PatternSection>
  ),
};

export const FormSnippets: Story = {
  name: "📝 Form Snippets",
  render: () => (
    <PatternSection
      title="Form Patterns"
      description="Input fields, validation, and form layouts"
    >
      <CodeBlock
        title="Basic Input with Label"
        language="tsx"
        code={`import { Input } from "@skai/ui";
import { Label } from "@skai/ui";

<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
  />
</div>`}
      />

      <CodeBlock
        title="Input with Error State"
        language="tsx"
        code={`import { Input } from "@skai/ui";
import { Label } from "@skai/ui";

<div className="space-y-2">
  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type="password"
    className="border-red-500 focus:ring-red-500"
    aria-invalid="true"
    aria-describedby="password-error"
  />
  <p id="password-error" className="text-sm text-red-500">
    Password must be at least 8 characters
  </p>
</div>`}
      />

      <CodeBlock
        title="Checkbox with Label"
        language="tsx"
        code={`import { Checkbox } from "@skai/ui";
import { Label } from "@skai/ui";

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms" className="text-sm">
    I agree to the <a href="#" className="text-primary hover:underline">terms and conditions</a>
  </Label>
</div>`}
      />
    </PatternSection>
  ),
};

export const TradingSnippets: Story = {
  name: "📈 Trading Snippets",
  render: () => (
    <PatternSection
      title="Trading UI Patterns"
      description="Specialized components for trading interfaces"
    >
      <CodeBlock
        title="Token Amount Input"
        language="tsx"
        code={`const TokenInput = ({ token, balance, value, onChange }) => (
  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
    <div className="flex justify-between text-sm text-slate-500 mb-2">
      <span>You pay</span>
      <span>Balance: {balance} {token.symbol}</span>
    </div>
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.0"
        className="flex-1 bg-transparent text-2xl font-mono outline-none"
      />
      <button className="flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-2 rounded-lg">
        <span className="text-lg">{token.icon}</span>
        <span className="font-semibold">{token.symbol}</span>
        <span>▼</span>
      </button>
    </div>
  </div>
);`}
      />

      <CodeBlock
        title="Price Display"
        language="tsx"
        code={`const PriceDisplay = ({ price, change24h }) => (
  <div className="text-center">
    <div className="text-3xl font-bold font-mono">
      \${price.toLocaleString()}
    </div>
    <div className={\`text-sm font-medium \${
      change24h >= 0 ? 'text-green-500' : 'text-red-500'
    }\`}>
      {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
    </div>
  </div>
);

// Usage
<PriceDisplay price={3456.78} change24h={2.34} />`}
      />

      <CodeBlock
        title="Order Book Row"
        language="tsx"
        code={`const OrderBookRow = ({ price, amount, total, type, depth }) => (
  <div className="relative px-4 py-1">
    {/* Depth bar */}
    <div
      className={\`absolute inset-y-0 \${
        type === 'bid' ? 'left-0 bg-green-500/10' : 'right-0 bg-red-500/10'
      }\`}
      style={{ width: \`\${depth}%\` }}
    />
    {/* Content */}
    <div className="relative flex justify-between text-xs font-mono">
      <span className={type === 'bid' ? 'text-green-500' : 'text-red-500'}>
        {price.toFixed(2)}
      </span>
      <span className="text-slate-600">{amount.toFixed(4)}</span>
      <span className="text-slate-400">{total.toFixed(2)}</span>
    </div>
  </div>
);`}
      />
    </PatternSection>
  ),
};

export const LayoutSnippets: Story = {
  name: "📐 Layout Snippets",
  render: () => (
    <PatternSection
      title="Layout Patterns"
      description="Page structures, grids, and responsive layouts"
    >
      <CodeBlock
        title="Dashboard Grid"
        language="tsx"
        code={`// Responsive stat grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard label="Total Balance" value="$124,567" />
  <StatCard label="24h Change" value="+2.34%" />
  <StatCard label="Assets" value="5" />
  <StatCard label="Open Orders" value="3" />
</div>`}
      />

      <CodeBlock
        title="Split Layout (Trading)"
        language="tsx"
        code={`// Trading page with sidebar
<div className="flex min-h-screen">
  {/* Main content */}
  <div className="flex-1 p-6">
    <ChartComponent />
    <OrderBook />
  </div>
  
  {/* Sidebar */}
  <div className="w-80 border-l p-4">
    <TradeForm />
    <OpenOrders />
  </div>
</div>`}
      />

      <CodeBlock
        title="Responsive Navigation"
        language="tsx"
        code={`const Navigation = () => (
  <header className="bg-white border-b">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="font-bold text-xl">SKAI</div>
        
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium">Dashboard</a>
          <a href="#" className="text-sm font-medium">Trade</a>
          <a href="#" className="text-sm font-medium">Wallet</a>
        </nav>
        
        {/* Mobile menu button */}
        <button className="md:hidden">
          <MenuIcon />
        </button>
        
        {/* Connect button */}
        <Button className="hidden md:flex">Connect Wallet</Button>
      </div>
    </div>
  </header>
);`}
      />
    </PatternSection>
  ),
};

export const CompletePages: Story = {
  name: "📄 Complete Pages",
  render: () => (
    <PatternSection
      title="Full Page Templates"
      description="Copy-paste complete page structures"
    >
      <CodeBlock
        title="Dashboard Page"
        language="tsx"
        description="Complete dashboard page with header, stats, and asset list"
        code={`import { Card, Button, Badge } from "@skai/ui";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <Button>Connect Wallet</Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-slate-500">Total Balance</p>
            <p className="text-2xl font-bold">$124,567.89</p>
            <p className="text-green-500 text-sm">+2.34%</p>
          </Card>
          {/* More stat cards... */}
        </div>

        {/* Assets */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="font-semibold">Your Assets</h2>
          </div>
          <div className="divide-y">
            {assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div>
                    <p className="font-medium">{asset.symbol}</p>
                    <p className="text-sm text-slate-500">{asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono">{asset.value}</p>
                  <p className="text-sm text-slate-500">{asset.balance}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}`}
      />
    </PatternSection>
  ),
};
