import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { Download, Copy, Check, Zap } from "lucide-react";

const meta: Meta = {
  title: "Brand/Assets",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

// SKAI Logo Component
const SkaiLogo = ({
  variant = "gradient",
  size = "md",
  showText = true,
}: {
  variant?: "gradient" | "white" | "black";
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}) => {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
    xl: { icon: 64, text: "text-5xl" },
  };

  const colors = {
    gradient: "url(#skai-gradient)",
    white: "#FFFFFF",
    black: "#000000",
  };

  return (
    <div className="flex items-center gap-2">
      <svg
        width={sizes[size].icon}
        height={sizes[size].icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="skai-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#56C0F6" />
            <stop offset="100%" stopColor="#2DEDAD" />
          </linearGradient>
        </defs>
        <path
          d="M32 4L8 32l12 4-4 24 24-28-12-4 4-24z"
          fill={colors[variant]}
        />
      </svg>
      {showText && (
        <span
          className={`font-bold ${sizes[size].text}`}
          style={{
            background:
              variant === "gradient"
                ? "linear-gradient(135deg, #56C0F6, #2DEDAD)"
                : undefined,
            WebkitBackgroundClip: variant === "gradient" ? "text" : undefined,
            WebkitTextFillColor:
              variant === "gradient" ? "transparent" : colors[variant],
            color: variant !== "gradient" ? colors[variant] : undefined,
          }}
        >
          SKAI
        </span>
      )}
    </div>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="ghost" size="sm" onClick={copy}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
};

export const LogoVariants: StoryObj = {
  name: "Logo Variants",
  render: () => (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Logo & Brand Assets</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Official SKAI brand assets for use across all platforms.
        </p>

        {/* Primary Logo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Primary Logo</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Gradient (Primary)</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-32 bg-[#020717] rounded-lg">
                <SkaiLogo variant="gradient" size="lg" />
              </CardContent>
              <div className="p-4 pt-2">
                <Badge variant="outline">Dark backgrounds</Badge>
              </div>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">White</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-32 bg-[#020717] rounded-lg">
                <SkaiLogo variant="white" size="lg" />
              </CardContent>
              <div className="p-4 pt-2">
                <Badge variant="outline">Dark backgrounds</Badge>
              </div>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Black</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-32 bg-white rounded-lg">
                <SkaiLogo variant="black" size="lg" />
              </CardContent>
              <div className="p-4 pt-2">
                <Badge variant="outline">Light backgrounds</Badge>
              </div>
            </Card>
          </div>
        </section>

        {/* Icon Only */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Icon Only</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(["sm", "md", "lg", "xl"] as const).map((size) => (
              <Card key={size}>
                <CardContent className="flex flex-col items-center justify-center h-32 gap-2">
                  <SkaiLogo variant="gradient" size={size} showText={false} />
                  <span className="text-xs text-muted-foreground">
                    {size === "sm" && "24px"}
                    {size === "md" && "32px"}
                    {size === "lg" && "48px"}
                    {size === "xl" && "64px"}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Brand Colors */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Brand Colors</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-0">
                <div
                  className="h-24 rounded-t-lg"
                  style={{ background: "#56C0F6" }}
                />
                <div className="p-4">
                  <p className="font-semibold">Primary Cyan</p>
                  <div className="flex items-center justify-between mt-2">
                    <code className="text-sm text-muted-foreground">
                      #56C0F6
                    </code>
                    <CopyButton text="#56C0F6" />
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-muted-foreground">
                      hsl(199 90% 65%)
                    </code>
                    <CopyButton text="199 90% 65%" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div
                  className="h-24 rounded-t-lg"
                  style={{ background: "#2DEDAD" }}
                />
                <div className="p-4">
                  <p className="font-semibold">Secondary Teal</p>
                  <div className="flex items-center justify-between mt-2">
                    <code className="text-sm text-muted-foreground">
                      #2DEDAD
                    </code>
                    <CopyButton text="#2DEDAD" />
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-muted-foreground">
                      hsl(166 80% 55%)
                    </code>
                    <CopyButton text="166 80% 55%" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div
                  className="h-24 rounded-t-lg"
                  style={{ background: "#020717" }}
                />
                <div className="p-4">
                  <p className="font-semibold">Background Navy</p>
                  <div className="flex items-center justify-between mt-2">
                    <code className="text-sm text-muted-foreground">
                      #020717
                    </code>
                    <CopyButton text="#020717" />
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-muted-foreground">
                      hsl(225 80% 4%)
                    </code>
                    <CopyButton text="225 80% 4%" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Gradient */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Primary Gradient</h2>
          <Card>
            <CardContent className="p-0">
              <div
                className="h-32 rounded-t-lg"
                style={{
                  background: "linear-gradient(135deg, #56C0F6, #2DEDAD)",
                }}
              />
              <div className="p-4">
                <p className="font-semibold mb-2">Cyan to Teal</p>
                <div className="bg-muted p-3 rounded-lg">
                  <code className="text-sm">
                    background: linear-gradient(135deg, #56C0F6, #2DEDAD);
                  </code>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Use for: Primary CTAs, hero highlights, logo, branding
                  elements
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Favicon - Actual */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Favicon</h2>
          <p className="text-muted-foreground mb-6">
            The official SKAI favicon used across all pages. Features the bolt
            icon with cyan-to-teal gradient.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Dark Background</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-32 bg-[#020717] rounded-lg">
                <img
                  src="https://app.skai.trade/favicon.png"
                  alt="SKAI Favicon"
                  className="w-16 h-16"
                />
              </CardContent>
              <div className="p-4 pt-2 flex items-center justify-between">
                <Badge variant="outline">favicon.png</Badge>
                <code className="text-xs text-muted-foreground">32×32</code>
              </div>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Light Background</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-32 bg-white rounded-lg">
                <img
                  src="https://app.skai.trade/favicon.png"
                  alt="SKAI Favicon"
                  className="w-16 h-16"
                />
              </CardContent>
              <div className="p-4 pt-2 flex items-center justify-between">
                <Badge variant="outline">Works on both</Badge>
              </div>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Apple Touch Icon</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-32 bg-[#020717] rounded-lg">
                <img
                  src="https://app.skai.trade/apple-touch-icon.png"
                  alt="Apple Touch Icon"
                  className="w-16 h-16 rounded-xl"
                />
              </CardContent>
              <div className="p-4 pt-2 flex items-center justify-between">
                <Badge variant="outline">apple-touch-icon.png</Badge>
                <code className="text-xs text-muted-foreground">180×180</code>
              </div>
            </Card>
          </div>
        </section>

        {/* PWA Icon Sizes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">PWA Icon Sizes</h2>
          <p className="text-muted-foreground mb-6">
            Progressive Web App icons for various device contexts.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { size: 72, use: "iOS/Android", file: "icon-72x72.png" },
              { size: 96, use: "Google TV", file: "icon-96x96.png" },
              { size: 128, use: "Chrome Web Store", file: "icon-128x128.png" },
              { size: 144, use: "Windows 8 tile", file: "icon-144x144.png" },
              { size: 152, use: "iPad touch", file: "icon-152x152.png" },
              { size: 192, use: "Android Chrome", file: "icon-192x192.png" },
              { size: 384, use: "PWA splash", file: "icon-384x384.png" },
              { size: 512, use: "PWA icon", file: "icon-512x512.png" },
            ].map(({ size, use, file }) => (
              <Card key={size}>
                <CardContent className="p-4 text-center">
                  <div
                    className="mx-auto mb-2 rounded-lg flex items-center justify-center bg-[#020717]"
                    style={{
                      width: Math.min(size, 64),
                      height: Math.min(size, 64),
                    }}
                  >
                    <img
                      src={`https://app.skai.trade/icons/${file}`}
                      alt={`${size}px icon`}
                      style={{
                        width: Math.min(size, 64),
                        height: Math.min(size, 64),
                      }}
                      className="rounded"
                    />
                  </div>
                  <p className="font-mono text-sm">
                    {size}×{size}
                  </p>
                  <p className="text-xs text-muted-foreground">{use}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Download Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Downloads</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <Button disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Logo Pack (SVG + PNG)
                </Button>
                <Button variant="outline" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Favicon Pack
                </Button>
                <Button variant="outline" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Brand Guidelines PDF
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Contact the design team for full asset packages.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  ),
};

export const UsageGuidelines: StoryObj = {
  name: "Usage Guidelines",
  render: () => (
    <div className="p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Logo Usage Guidelines</h1>

        <div className="space-y-8">
          {/* Do's */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-500">✓ Do</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-24 h-16 bg-[#020717] rounded flex items-center justify-center shrink-0">
                  <SkaiLogo variant="gradient" size="sm" />
                </div>
                <p>Use the gradient logo on dark backgrounds (#020717)</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-16 bg-[#020717] rounded flex items-center justify-center shrink-0">
                  <SkaiLogo variant="white" size="sm" />
                </div>
                <p>Use the white logo when gradient isn't possible</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-16 bg-white rounded flex items-center justify-center shrink-0">
                  <SkaiLogo variant="black" size="sm" />
                </div>
                <p>Use the black logo on light backgrounds only</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-16 bg-[#020717] rounded flex items-center justify-center shrink-0 p-2">
                  <SkaiLogo variant="gradient" size="sm" showText={false} />
                </div>
                <p>Maintain clear space around the logo (minimum 8px)</p>
              </div>
            </CardContent>
          </Card>

          {/* Don'ts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">✗ Don't</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-24 h-16 bg-gray-400 rounded flex items-center justify-center shrink-0">
                  <SkaiLogo variant="gradient" size="sm" />
                </div>
                <p>Don't place the gradient logo on mid-tone backgrounds</p>
              </div>
              <div className="flex gap-4 items-start">
                <div
                  className="w-24 h-16 rounded flex items-center justify-center shrink-0"
                  style={{ transform: "skewX(-10deg)", background: "#020717" }}
                >
                  <SkaiLogo variant="gradient" size="sm" />
                </div>
                <p>Don't distort, stretch, or rotate the logo</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-16 bg-[#020717] rounded flex items-center justify-center shrink-0 opacity-50">
                  <SkaiLogo variant="gradient" size="sm" />
                </div>
                <p>Don't reduce opacity or add effects to the logo</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-16 bg-red-500 rounded flex items-center justify-center shrink-0">
                  <SkaiLogo variant="white" size="sm" />
                </div>
                <p>Don't place the logo on unapproved colored backgrounds</p>
              </div>
            </CardContent>
          </Card>

          {/* Minimum Size */}
          <Card>
            <CardHeader>
              <CardTitle>Minimum Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#020717] rounded flex items-center justify-center mb-2">
                    <SkaiLogo variant="gradient" size="sm" showText={false} />
                  </div>
                  <p className="text-sm font-medium">24px</p>
                  <p className="text-xs text-muted-foreground">Icon only</p>
                </div>
                <div className="text-center">
                  <div className="h-16 px-4 bg-[#020717] rounded flex items-center justify-center mb-2">
                    <SkaiLogo variant="gradient" size="sm" />
                  </div>
                  <p className="text-sm font-medium">80px wide</p>
                  <p className="text-xs text-muted-foreground">With wordmark</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};
