import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactNode } from "react";
import { Button } from "../components/button";
import { Card } from "../components/card";

/**
 * # Responsive Preview System
 *
 * Preview components and pages at all breakpoints with device frames.
 * Essential for ensuring designs work across all screen sizes.
 */

// Device Frame Component
const DeviceFrame = ({
  device,
  width,
  height,
  children,
  scale = 1,
}: {
  device: string;
  width: number;
  height: number;
  children: ReactNode;
  scale?: number;
}) => (
  <div className="flex flex-col items-center">
    <div
      className="bg-slate-900 rounded-[2rem] p-2 shadow-2xl"
      style={{
        width: width * scale + 16,
        maxWidth: "100%",
      }}
    >
      {/* Notch for mobile */}
      {device.includes("iPhone") && (
        <div className="w-24 h-6 bg-slate-900 rounded-full mx-auto -mb-4 relative z-10" />
      )}
      <div
        className="bg-white rounded-[1.5rem] overflow-hidden"
        style={{
          width: width * scale,
          height: height * scale,
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            width: width,
            height: height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
    <div className="mt-4 text-center">
      <p className="font-semibold">{device}</p>
      <p className="text-sm text-slate-500">
        {width} × {height}
      </p>
    </div>
  </div>
);

// Sample Page Content
const SamplePage = () => (
  <div className="min-h-full bg-slate-50">
    {/* Header */}
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="font-bold text-primary">SKAI</div>
      <nav className="hidden md:flex gap-4 text-sm">
        <a href="#" className="text-slate-600">
          Dashboard
        </a>
        <a href="#" className="text-slate-600">
          Trade
        </a>
        <a href="#" className="text-slate-600">
          Wallet
        </a>
      </nav>
      <Button size="sm">Connect</Button>
    </header>

    {/* Content */}
    <main className="p-4 md:p-6">
      <h1 className="text-lg md:text-2xl font-bold mb-4">Portfolio</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: "Balance", value: "$124,567" },
          { label: "24h Change", value: "+2.34%" },
          { label: "Assets", value: "5" },
          { label: "Trades", value: "142" },
        ].map((stat) => (
          <Card key={stat.label} className="p-3 md:p-4">
            <p className="text-xs md:text-sm text-slate-500">{stat.label}</p>
            <p className="text-sm md:text-xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Asset List */}
      <Card>
        <div className="p-3 md:p-4 border-b">
          <h2 className="font-semibold text-sm md:text-base">Assets</h2>
        </div>
        <div className="divide-y">
          {[
            {
              symbol: "ETH",
              name: "Ethereum",
              balance: "2.5",
              value: "$8,642",
            },
            {
              symbol: "BTC",
              name: "Bitcoin",
              balance: "0.15",
              value: "$6,323",
            },
            {
              symbol: "USDC",
              name: "USD Coin",
              balance: "5,000",
              value: "$5,000",
            },
          ].map((asset) => (
            <div
              key={asset.symbol}
              className="flex items-center justify-between p-3 md:p-4"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs md:text-sm font-bold">
                  {asset.symbol[0]}
                </div>
                <div>
                  <p className="font-medium text-sm md:text-base">
                    {asset.symbol}
                  </p>
                  <p className="text-xs text-slate-500 hidden md:block">
                    {asset.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm md:text-base">{asset.value}</p>
                <p className="text-xs text-slate-500">{asset.balance}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </main>
  </div>
);

const meta: Meta = {
  title: "Design System/Responsive Preview",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Responsive Preview System

Preview your designs at all breakpoints with realistic device frames.

## Breakpoints
- **Mobile**: 375px (iPhone SE/Mini)
- **Mobile Large**: 428px (iPhone Pro Max)
- **Tablet**: 768px (iPad Mini)
- **Desktop**: 1280px
- **Desktop Large**: 1440px
- **Ultrawide**: 1920px
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const AllDevices: Story = {
  name: "📱 All Devices Overview",
  render: () => (
    <div className="bg-slate-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Responsive Preview</h1>
        <p className="text-slate-600 mb-8">
          See how your design adapts across all device sizes
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DeviceFrame device="iPhone SE" width={375} height={667} scale={0.6}>
            <SamplePage />
          </DeviceFrame>

          <DeviceFrame
            device="iPhone 14 Pro"
            width={393}
            height={852}
            scale={0.55}
          >
            <SamplePage />
          </DeviceFrame>

          <DeviceFrame device="iPad Mini" width={768} height={1024} scale={0.4}>
            <SamplePage />
          </DeviceFrame>
        </div>
      </div>
    </div>
  ),
};

export const MobilePortrait: Story = {
  name: "📱 Mobile Portrait",
  render: () => (
    <div className="bg-slate-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Mobile Portrait Views</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <DeviceFrame
            device="iPhone SE (375px)"
            width={375}
            height={667}
            scale={0.7}
          >
            <SamplePage />
          </DeviceFrame>
          <DeviceFrame
            device="iPhone 14 (390px)"
            width={390}
            height={844}
            scale={0.65}
          >
            <SamplePage />
          </DeviceFrame>
          <DeviceFrame
            device="iPhone 14 Pro Max (430px)"
            width={430}
            height={932}
            scale={0.6}
          >
            <SamplePage />
          </DeviceFrame>
        </div>
      </div>
    </div>
  ),
};

export const Tablet: Story = {
  name: "📱 Tablet",
  render: () => (
    <div className="bg-slate-100 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Tablet Views</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <DeviceFrame
            device="iPad Mini (768px)"
            width={768}
            height={1024}
            scale={0.5}
          >
            <SamplePage />
          </DeviceFrame>
          <DeviceFrame
            device='iPad Pro 11" (834px)'
            width={834}
            height={1194}
            scale={0.45}
          >
            <SamplePage />
          </DeviceFrame>
        </div>
      </div>
    </div>
  ),
};

export const BreakpointComparison: Story = {
  name: "🔄 Breakpoint Comparison",
  render: () => {
    const [activeBreakpoint, setActiveBreakpoint] = useState(0);

    const breakpoints = [
      { name: "Mobile", width: 375, icon: "📱" },
      { name: "Tablet", width: 768, icon: "📱" },
      { name: "Desktop", width: 1280, icon: "💻" },
      { name: "Wide", width: 1440, icon: "🖥️" },
    ];

    return (
      <div className="bg-slate-900 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            Breakpoint Comparison
          </h2>

          {/* Breakpoint Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {breakpoints.map((bp, i) => (
              <button
                key={bp.name}
                onClick={() => setActiveBreakpoint(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  activeBreakpoint === i
                    ? "bg-primary text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>{bp.icon}</span>
                <span>{bp.name}</span>
                <span className="text-xs opacity-70">{bp.width}px</span>
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-slate-800 rounded-xl p-4 overflow-auto">
            <div
              className="bg-white rounded-lg overflow-hidden mx-auto transition-all duration-300"
              style={{
                width: breakpoints[activeBreakpoint].width,
                maxWidth: "100%",
              }}
            >
              <div style={{ height: 600, overflow: "auto" }}>
                <SamplePage />
              </div>
            </div>
          </div>

          {/* Width Indicator */}
          <div className="mt-4 text-center text-slate-400">
            Current width:{" "}
            <span className="text-white font-mono">
              {breakpoints[activeBreakpoint].width}px
            </span>
          </div>
        </div>
      </div>
    );
  },
};

export const ResponsiveRuler: Story = {
  name: "📏 Responsive Ruler",
  render: () => {
    const breakpoints = [
      { name: "xs", min: 0, max: 640, color: "bg-red-500" },
      { name: "sm", min: 640, max: 768, color: "bg-orange-500" },
      { name: "md", min: 768, max: 1024, color: "bg-yellow-500" },
      { name: "lg", min: 1024, max: 1280, color: "bg-green-500" },
      { name: "xl", min: 1280, max: 1536, color: "bg-blue-500" },
      { name: "2xl", min: 1536, max: 1920, color: "bg-purple-500" },
    ];

    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">
          Tailwind Breakpoint Reference
        </h2>

        {/* Ruler */}
        <div className="bg-slate-100 rounded-xl p-6 mb-8">
          <div className="flex h-12 rounded-lg overflow-hidden">
            {breakpoints.map((bp) => (
              <div
                key={bp.name}
                className={`${bp.color} flex items-center justify-center text-white font-bold`}
                style={{
                  width: `${((bp.max - bp.min) / 1920) * 100}%`,
                }}
              >
                {bp.name}
              </div>
            ))}
          </div>
          <div className="flex mt-2 text-xs text-slate-500">
            {breakpoints.map((bp) => (
              <div
                key={bp.name}
                className="text-center"
                style={{
                  width: `${((bp.max - bp.min) / 1920) * 100}%`,
                }}
              >
                {bp.min}px
              </div>
            ))}
            <div className="text-right">1920px</div>
          </div>
        </div>

        {/* Breakpoint Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {breakpoints.map((bp) => (
            <Card key={bp.name} className="p-4">
              <div className={`w-8 h-8 ${bp.color} rounded-lg mb-2`} />
              <p className="font-bold">{bp.name}</p>
              <p className="text-sm text-slate-500">
                {bp.min}px - {bp.max}px
              </p>
              <code className="text-xs bg-slate-100 px-2 py-1 rounded mt-2 block">
                {bp.name === "xs" ? "default" : `${bp.name}:`}
              </code>
            </Card>
          ))}
        </div>

        {/* Usage Examples */}
        <div className="mt-8">
          <h3 className="font-bold mb-4">Usage Examples</h3>
          <div className="bg-slate-900 rounded-lg p-4 overflow-auto">
            <pre className="text-green-400 text-sm">{`// Responsive padding
<div className="p-4 md:p-6 lg:p-8">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// Responsive text
<h1 className="text-2xl md:text-4xl lg:text-5xl">

// Show/hide elements
<nav className="hidden md:flex">  {/* Hidden on mobile */}
<nav className="md:hidden">       {/* Only on mobile */}

// Responsive flex direction
<div className="flex flex-col md:flex-row">`}</pre>
          </div>
        </div>
      </div>
    );
  },
};
