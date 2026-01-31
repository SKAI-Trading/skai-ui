import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Design Tokens/Typography",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const TypeScale: StoryObj = {
  name: "Type Scale",
  render: () => (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Typography</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Font sizes, weights, and styles used in the design system.
        </p>

        <div className="space-y-12">
          {/* Font Family */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Font Families</h2>
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-lg border">
                <p className="text-sm text-muted-foreground mb-2">
                  Sans (Default)
                </p>
                <p className="text-2xl font-sans">
                  Inter - The quick brown fox jumps over the lazy dog
                </p>
                <code className="text-xs text-muted-foreground mt-2 block">
                  font-family: 'Inter', sans-serif
                </code>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="text-sm text-muted-foreground mb-2">
                  Mono (Numbers, Code, Addresses)
                </p>
                <p className="text-2xl font-mono">
                  0x1234...5678 • $2,145.32 • +12.34%
                </p>
                <code className="text-xs text-muted-foreground mt-2 block">
                  font-family: 'JetBrains Mono', monospace
                </code>
              </div>
            </div>
          </section>

          {/* Size Scale */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Size Scale</h2>
            <div className="space-y-4">
              {[
                { name: "text-xs", size: "12px", class: "text-xs" },
                { name: "text-sm", size: "14px", class: "text-sm" },
                { name: "text-base", size: "16px", class: "text-base" },
                { name: "text-lg", size: "18px", class: "text-lg" },
                { name: "text-xl", size: "20px", class: "text-xl" },
                { name: "text-2xl", size: "24px", class: "text-2xl" },
                { name: "text-3xl", size: "30px", class: "text-3xl" },
                { name: "text-4xl", size: "36px", class: "text-4xl" },
                { name: "text-5xl", size: "48px", class: "text-5xl" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-baseline gap-4 p-4 bg-card rounded-lg border"
                >
                  <span className="w-24 text-sm text-muted-foreground shrink-0">
                    {item.name}
                  </span>
                  <span className="w-16 text-xs text-muted-foreground shrink-0 font-mono">
                    {item.size}
                  </span>
                  <span className={item.class}>The quick brown fox</span>
                </div>
              ))}
            </div>
          </section>

          {/* Font Weights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Font Weights</h2>
            <div className="space-y-4">
              {[
                { name: "font-normal", weight: "400", class: "font-normal" },
                { name: "font-medium", weight: "500", class: "font-medium" },
                {
                  name: "font-semibold",
                  weight: "600",
                  class: "font-semibold",
                },
                { name: "font-bold", weight: "700", class: "font-bold" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border"
                >
                  <span className="w-32 text-sm text-muted-foreground shrink-0">
                    {item.name}
                  </span>
                  <span className="w-12 text-xs text-muted-foreground shrink-0 font-mono">
                    {item.weight}
                  </span>
                  <span className={`text-xl ${item.class}`}>
                    The quick brown fox jumps over the lazy dog
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Trading Typography */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Trading Typography</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-6 bg-card rounded-lg border">
                <p className="text-sm text-muted-foreground mb-3">
                  Token Price
                </p>
                <p className="text-4xl font-bold font-mono">$2,145.32</p>
                <p className="text-lg text-green-500 font-mono">
                  +$45.67 (+2.18%)
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border">
                <p className="text-sm text-muted-foreground mb-3">
                  Wallet Balance
                </p>
                <p className="text-3xl font-bold">$12,345.67</p>
                <p className="text-sm text-muted-foreground">≈ 5.75 ETH</p>
              </div>
              <div className="p-6 bg-card rounded-lg border">
                <p className="text-sm text-muted-foreground mb-3">
                  Transaction Hash
                </p>
                <p className="font-mono text-sm break-all">
                  0x1234567890abcdef1234567890abcdef12345678
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border">
                <p className="text-sm text-muted-foreground mb-3">
                  Table Numbers
                </p>
                <div className="space-y-1 font-mono text-sm">
                  <div className="flex justify-between">
                    <span>ETH</span>
                    <span>2.5000</span>
                    <span className="text-green-500">+5.23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>USDC</span>
                    <span>5,000.00</span>
                    <span className="text-muted-foreground">0.00%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Text Colors */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Text Colors</h2>
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-lg border">
                <p className="text-foreground text-lg">
                  text-foreground — Primary text color
                </p>
                <code className="text-xs text-muted-foreground">
                  className="text-foreground"
                </code>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="text-muted-foreground text-lg">
                  text-muted-foreground — Secondary text color
                </p>
                <code className="text-xs text-muted-foreground">
                  className="text-muted-foreground"
                </code>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="text-primary text-lg">
                  text-primary — Links and emphasis
                </p>
                <code className="text-xs text-muted-foreground">
                  className="text-primary"
                </code>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="text-destructive text-lg">
                  text-destructive — Errors and warnings
                </p>
                <code className="text-xs text-muted-foreground">
                  className="text-destructive"
                </code>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  ),
};

export const HeadingStyles: StoryObj = {
  name: "Heading Styles",
  render: () => (
    <div className="p-8 bg-background">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">Page Title</h1>
          <code className="text-xs text-muted-foreground">
            text-5xl font-bold tracking-tight
          </code>
        </div>
        <div>
          <h2 className="text-4xl font-bold">Section Heading</h2>
          <code className="text-xs text-muted-foreground">
            text-4xl font-bold
          </code>
        </div>
        <div>
          <h3 className="text-3xl font-semibold">Subsection Heading</h3>
          <code className="text-xs text-muted-foreground">
            text-3xl font-semibold
          </code>
        </div>
        <div>
          <h4 className="text-2xl font-semibold">Card Title</h4>
          <code className="text-xs text-muted-foreground">
            text-2xl font-semibold
          </code>
        </div>
        <div>
          <h5 className="text-xl font-medium">Component Title</h5>
          <code className="text-xs text-muted-foreground">
            text-xl font-medium
          </code>
        </div>
        <div>
          <h6 className="text-lg font-medium">Label / Small Title</h6>
          <code className="text-xs text-muted-foreground">
            text-lg font-medium
          </code>
        </div>
        <div>
          <p className="text-base">
            Body text — The quick brown fox jumps over the lazy dog. This is the
            default paragraph size used throughout the application.
          </p>
          <code className="text-xs text-muted-foreground">text-base</code>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Small text — Used for captions, labels, and secondary information.
          </p>
          <code className="text-xs text-muted-foreground">
            text-sm text-muted-foreground
          </code>
        </div>
      </div>
    </div>
  ),
};
