import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

/**
 * # Figma Design Reference
 *
 * This documentation shows the official SKAI design system components
 * as extracted from the Figma source file.
 *
 * **Figma File:** Skai Web App
 * **File Key:** `3sSzw1KewMtUbeLAv7uW0r`
 * **Last Synced:** February 1, 2026
 *
 * ## Color System (From Figma Variables)
 *
 * | Token | Value | Usage |
 * |-------|-------|-------|
 * | Primary/Sky Blue 300 | `#56C7F3` | CTAs, links, interactive elements |
 * | Primary/Green Coal 300 | `#001615` | Main background |
 * | Primary/Green Coal 200 | `#122524` | Card/modal backgrounds |
 * | Primary/Green Coal 100 | `#123F3C` | Borders, dividers |
 * | Primary/Printers Gold 300 | `#999966` | Premium accents |
 * | Accents/Sun Yellow 300 | `#FFFF16` | Warnings, highlights |
 * | App/Green 300 | `#17F9B4` | Success, profit, long |
 * | App/Red 300 | `#FF574A` | Error, loss, short |
 * | App/Ash 300 | `#95A09F` | Placeholder text |
 * | Accents/Gray 100 | `#E0E0E0` | Secondary text |
 * | Core/White | `#FFFFFF` | Primary text |
 * | Core/Black | `#000000` | Light mode text |
 *
 * ## Typography (From Figma)
 *
 * | Style | Font | Size | Weight | Line Height | Letter Spacing |
 * |-------|------|------|--------|-------------|----------------|
 * | Super-headline 4 | Manrope | 32px | 300 (Light) | 36px | -1.28px |
 * | Sub-headline 2 | Manrope | 18px | 400 (Regular) | 24px | -0.72px |
 * | Paragraph 1 | Manrope | 16px | 400 (Regular) | 22px | -0.64px |
 * | Paragraph 2 | Manrope | 14px | 400 (Regular) | 18px | -0.56px |
 */

const meta: Meta = {
  title: "Design System/Figma Reference",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Official SKAI design components extracted from Figma",
      },
    },
  },
};

export default meta;

// ============================================================================
// FIGMA COLOR TOKENS
// ============================================================================

const figmaColors = {
  primary: {
    skyBlue300: "#56C7F3",
  },
  greenCoal: {
    300: "#001615",
    200: "#122524",
    100: "#123F3C",
  },
  accent: {
    printersGold300: "#999966",
    sunYellow300: "#FFFF16",
  },
  app: {
    green300: "#17F9B4",
    greenO: "#17F9B4",
    red300: "#FF574A",
    redO: "#FB3324",
    ash300: "#95A09F",
  },
  accents: {
    gray100: "#E0E0E0",
  },
  core: {
    white: "#FFFFFF",
    black: "#000000",
  },
};

// ============================================================================
// COLOR PALETTE STORY
// ============================================================================

const ColorSwatch = ({
  name,
  value,
  description,
}: {
  name: string;
  value: string;
  description?: string;
}) => (
  <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50">
    <div
      className="w-16 h-16 rounded-lg border border-gray-700 shadow-inner"
      style={{ backgroundColor: value }}
    />
    <div className="flex-1">
      <div className="font-medium text-white">{name}</div>
      <div className="text-sm font-mono text-gray-400">{value}</div>
      {description && (
        <div className="text-xs text-gray-500 mt-1">{description}</div>
      )}
    </div>
  </div>
);

export const ColorPalette: StoryObj = {
  render: () => (
    <div
      className="space-y-8 p-6"
      style={{ backgroundColor: figmaColors.greenCoal[300] }}
    >
      {/* Primary Colors */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          Primary Brand Colors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorSwatch
            name="Sky Blue 300"
            value={figmaColors.primary.skyBlue300}
            description="Primary CTA, links, interactive elements"
          />
          <ColorSwatch
            name="Printers Gold 300"
            value={figmaColors.accent.printersGold300}
            description="Premium accents, tier badges"
          />
        </div>
      </section>

      {/* Background Colors */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          Background Colors (Green Coal)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorSwatch
            name="Green Coal 300"
            value={figmaColors.greenCoal[300]}
            description="Main app background"
          />
          <ColorSwatch
            name="Green Coal 200"
            value={figmaColors.greenCoal[200]}
            description="Card/modal backgrounds"
          />
          <ColorSwatch
            name="Green Coal 100"
            value={figmaColors.greenCoal[100]}
            description="Borders, dividers"
          />
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          Semantic Colors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorSwatch
            name="App Green 300"
            value={figmaColors.app.green300}
            description="Success, profit, long positions"
          />
          <ColorSwatch
            name="App Red 300"
            value={figmaColors.app.red300}
            description="Error, loss, short positions"
          />
          <ColorSwatch
            name="Sun Yellow 300"
            value={figmaColors.accent.sunYellow300}
            description="Warnings, highlights"
          />
          <ColorSwatch
            name="Ash 300"
            value={figmaColors.app.ash300}
            description="Placeholder text, muted"
          />
        </div>
      </section>

      {/* Core Colors */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Core Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorSwatch
            name="White"
            value={figmaColors.core.white}
            description="Primary text on dark"
          />
          <ColorSwatch
            name="Gray 100"
            value={figmaColors.accents.gray100}
            description="Secondary text"
          />
          <ColorSwatch
            name="Black"
            value={figmaColors.core.black}
            description="Text on light"
          />
        </div>
      </section>
    </div>
  ),
};

// ============================================================================
// CTA BUTTON (FROM FIGMA)
// ============================================================================

/**
 * CTA Button component as designed in Figma
 * - Background: Sky Blue 300 (#56C7F3)
 * - Text: Green Coal 300 (#001615)
 * - Padding: 40px horizontal, 22px vertical
 * - Border Radius: 16px
 */
const FigmaCTAButton = ({
  children = "Get early access",
}: {
  children?: React.ReactNode;
}) => (
  <button
    className="font-['Manrope',sans-serif] font-normal leading-[22px] text-[16px] text-center tracking-[-0.64px] transition-all hover:brightness-110 active:scale-[0.98]"
    style={{
      backgroundColor: figmaColors.primary.skyBlue300,
      color: figmaColors.greenCoal[300],
      padding: "22px 40px",
      borderRadius: "16px",
    }}
  >
    {children}
  </button>
);

export const CTAButton: StoryObj = {
  render: () => (
    <div
      className="p-8 space-y-6"
      style={{ backgroundColor: figmaColors.greenCoal[300] }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        CTA Button (From Figma)
      </h2>
      <div className="flex flex-wrap gap-4">
        <FigmaCTAButton>Get early access</FigmaCTAButton>
        <FigmaCTAButton>Connect Wallet</FigmaCTAButton>
        <FigmaCTAButton>Start Trading</FigmaCTAButton>
      </div>

      <div
        className="mt-8 p-4 rounded-lg"
        style={{ backgroundColor: figmaColors.greenCoal[200] }}
      >
        <h3 className="text-white font-medium mb-2">Figma Specs:</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>
            • Background: <code className="text-cyan-400">#56C7F3</code> (Sky
            Blue 300)
          </li>
          <li>
            • Text: <code className="text-cyan-400">#001615</code> (Green Coal
            300)
          </li>
          <li>• Font: Manrope, 16px, Regular</li>
          <li>• Padding: 22px vertical, 40px horizontal</li>
          <li>• Border Radius: 16px</li>
          <li>• Letter Spacing: -0.64px</li>
        </ul>
      </div>
    </div>
  ),
};

// ============================================================================
// MODAL COMPONENT (FROM FIGMA)
// ============================================================================

/**
 * Modal component as designed in Figma
 * - Background: Green Coal 200 (#122524)
 * - Border: Green Coal 100 (#123F3C)
 * - Shadow: 0px 10px 80px rgba(0,0,0,0.25)
 * - Border Radius: 24px
 */
const FigmaModal = () => (
  <div
    className="flex flex-col gap-6 p-8 pb-12 rounded-[24px] border overflow-hidden max-w-md"
    style={{
      backgroundColor: figmaColors.greenCoal[200],
      borderColor: figmaColors.greenCoal[100],
      boxShadow: "0px 10px 80px 0px rgba(0,0,0,0.25)",
    }}
  >
    {/* Close button */}
    <div className="flex justify-end">
      <button className="w-4 h-4 text-gray-400 hover:text-white transition-colors">
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
        </svg>
      </button>
    </div>

    {/* Content */}
    <div className="flex flex-col gap-4 text-center">
      <h2
        className="font-['Manrope',sans-serif] font-light text-[32px] leading-[36px] tracking-[-1.28px]"
        style={{ color: figmaColors.core.white }}
      >
        Get early access to Skai
      </h2>
      <p
        className="font-['Manrope',sans-serif] font-normal text-[18px] leading-[24px] tracking-[-0.72px]"
        style={{ color: figmaColors.accents.gray100 }}
      >
        Enter your email to get access to join the Skai waitlist.
      </p>
    </div>

    {/* Email Input */}
    <div className="flex flex-col gap-2">
      <label
        className="px-[22px] font-['Manrope',sans-serif] text-[14px] leading-[18px] tracking-[-0.56px]"
        style={{ color: figmaColors.core.white }}
      >
        Email address
      </label>
      <div
        className="flex items-center justify-between p-[22px] rounded-[16px] border"
        style={{
          backgroundColor: figmaColors.greenCoal[300],
          borderColor: figmaColors.greenCoal[100],
        }}
      >
        <input
          type="email"
          placeholder="example@provider.com"
          className="bg-transparent outline-none font-['Manrope',sans-serif] text-[16px] leading-[22px] tracking-[-0.64px] flex-1"
          style={{ color: figmaColors.core.white }}
        />
        <span
          className="font-['Manrope',sans-serif] text-[16px] tracking-[-0.64px] uppercase cursor-pointer hover:brightness-110"
          style={{ color: figmaColors.primary.skyBlue300 }}
        >
          ENTER
        </span>
      </div>
    </div>

    {/* OAuth Buttons */}
    <div className="flex gap-2">
      <button
        className="flex-1 flex items-center justify-center gap-2 p-5 rounded-[16px] border font-['Manrope',sans-serif] text-[16px] leading-[22px] tracking-[-0.64px] hover:brightness-110 transition-all"
        style={{
          backgroundColor: figmaColors.greenCoal[300],
          borderColor: figmaColors.greenCoal[100],
          color: figmaColors.core.white,
        }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </button>
      <button
        className="flex-1 flex items-center justify-center gap-2 p-5 rounded-[16px] border font-['Manrope',sans-serif] text-[16px] leading-[22px] tracking-[-0.64px] hover:brightness-110 transition-all"
        style={{
          backgroundColor: figmaColors.greenCoal[300],
          borderColor: figmaColors.greenCoal[100],
          color: figmaColors.core.white,
        }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        Apple
      </button>
    </div>
  </div>
);

export const SignupModal: StoryObj = {
  render: () => (
    <div
      className="min-h-[600px] p-8 flex items-center justify-center"
      style={{ backgroundColor: figmaColors.greenCoal[300] }}
    >
      <FigmaModal />
    </div>
  ),
};

// ============================================================================
// INPUT COMPONENT (FROM FIGMA)
// ============================================================================

const FigmaInput = ({
  label,
  placeholder,
  actionText,
}: {
  label: string;
  placeholder: string;
  actionText?: string;
}) => (
  <div className="flex flex-col gap-2 w-full max-w-md">
    <label
      className="px-[22px] font-['Manrope',sans-serif] text-[14px] leading-[18px] tracking-[-0.56px]"
      style={{ color: figmaColors.core.white }}
    >
      {label}
    </label>
    <div
      className="flex items-center justify-between p-[22px] rounded-[16px] border"
      style={{
        backgroundColor: figmaColors.greenCoal[300],
        borderColor: figmaColors.greenCoal[100],
      }}
    >
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent outline-none font-['Manrope',sans-serif] text-[16px] leading-[22px] tracking-[-0.64px] flex-1"
        style={{ color: figmaColors.core.white }}
      />
      {actionText && (
        <span
          className="font-['Manrope',sans-serif] text-[16px] tracking-[-0.64px] uppercase cursor-pointer hover:brightness-110 ml-4"
          style={{ color: figmaColors.primary.skyBlue300 }}
        >
          {actionText}
        </span>
      )}
    </div>
  </div>
);

export const InputFields: StoryObj = {
  render: () => (
    <div
      className="p-8 space-y-6"
      style={{ backgroundColor: figmaColors.greenCoal[300] }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        Input Components (From Figma)
      </h2>

      <FigmaInput
        label="Email address"
        placeholder="example@provider.com"
        actionText="ENTER"
      />

      <FigmaInput label="Amount" placeholder="0.00" actionText="MAX" />

      <FigmaInput label="Token address" placeholder="0x..." />

      <div
        className="mt-8 p-4 rounded-lg"
        style={{ backgroundColor: figmaColors.greenCoal[200] }}
      >
        <h3 className="text-white font-medium mb-2">Figma Specs:</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>
            • Background: <code className="text-cyan-400">#001615</code> (Green
            Coal 300)
          </li>
          <li>
            • Border: <code className="text-cyan-400">#123F3C</code> (Green Coal
            100)
          </li>
          <li>• Border Radius: 16px</li>
          <li>• Padding: 22px</li>
          <li>• Label: 14px, -0.56px tracking</li>
          <li>• Input: 16px, -0.64px tracking</li>
          <li>• Action text: Sky Blue 300, uppercase</li>
        </ul>
      </div>
    </div>
  ),
};

// ============================================================================
// TYPOGRAPHY SHOWCASE
// ============================================================================

export const Typography: StoryObj = {
  render: () => (
    <div
      className="p-8 space-y-8"
      style={{ backgroundColor: figmaColors.greenCoal[300] }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        Typography (From Figma)
      </h2>

      <div className="space-y-6">
        {/* Super-headline 4 */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Super-headline 4 (Light 300)
          </div>
          <p
            className="font-['Manrope',sans-serif] font-light text-[32px] leading-[36px] tracking-[-1.28px]"
            style={{ color: figmaColors.core.white }}
          >
            Get early access to Skai
          </p>
        </div>

        {/* Sub-headline 2 */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Sub-headline 2 (Regular 400)
          </div>
          <p
            className="font-['Manrope',sans-serif] font-normal text-[18px] leading-[24px] tracking-[-0.72px]"
            style={{ color: figmaColors.accents.gray100 }}
          >
            Enter your email to get access to join the Skai waitlist.
          </p>
        </div>

        {/* Paragraph 1 */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Paragraph 1 (Regular 400)
          </div>
          <p
            className="font-['Manrope',sans-serif] font-normal text-[16px] leading-[22px] tracking-[-0.64px]"
            style={{ color: figmaColors.core.white }}
          >
            Trade perpetual futures with up to 100x leverage
          </p>
        </div>

        {/* Paragraph 2 */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Paragraph 2 (Regular 400)
          </div>
          <p
            className="font-['Manrope',sans-serif] font-normal text-[14px] leading-[18px] tracking-[-0.56px]"
            style={{ color: figmaColors.core.white }}
          >
            Email address
          </p>
        </div>
      </div>

      <div
        className="mt-8 p-4 rounded-lg"
        style={{ backgroundColor: figmaColors.greenCoal[200] }}
      >
        <h3 className="text-white font-medium mb-2">Typography Scale:</h3>
        <table className="text-sm text-gray-400 w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="pb-2">Style</th>
              <th className="pb-2">Size</th>
              <th className="pb-2">Line Height</th>
              <th className="pb-2">Tracking</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            <tr>
              <td className="py-1">Super-headline 4</td>
              <td>32px</td>
              <td>36px</td>
              <td>-1.28px</td>
            </tr>
            <tr>
              <td className="py-1">Sub-headline 2</td>
              <td>18px</td>
              <td>24px</td>
              <td>-0.72px</td>
            </tr>
            <tr>
              <td className="py-1">Paragraph 1</td>
              <td>16px</td>
              <td>22px</td>
              <td>-0.64px</td>
            </tr>
            <tr>
              <td className="py-1">Paragraph 2</td>
              <td>14px</td>
              <td>18px</td>
              <td>-0.56px</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
};

// ============================================================================
// TRADING UI PATTERNS
// ============================================================================

export const TradingPatterns: StoryObj = {
  render: () => (
    <div
      className="p-8 space-y-8"
      style={{ backgroundColor: figmaColors.greenCoal[300] }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        Trading UI Patterns (From Figma)
      </h2>

      {/* Long/Short Toggle */}
      <div className="space-y-4">
        <h3 className="text-white font-medium">Position Toggle</h3>
        <div
          className="flex rounded-lg overflow-hidden max-w-xs"
          style={{ backgroundColor: figmaColors.greenCoal[200] }}
        >
          <button
            className="flex-1 py-3 px-6 font-['Manrope',sans-serif] text-sm font-medium transition-all"
            style={{
              backgroundColor: figmaColors.app.green300,
              color: figmaColors.greenCoal[300],
            }}
          >
            Long
          </button>
          <button
            className="flex-1 py-3 px-6 font-['Manrope',sans-serif] text-sm font-medium transition-all"
            style={{ color: figmaColors.app.ash300 }}
          >
            Short
          </button>
        </div>
      </div>

      {/* Order Type Toggle */}
      <div className="space-y-4">
        <h3 className="text-white font-medium">Order Type</h3>
        <div className="flex gap-2">
          <button
            className="py-2 px-4 rounded-lg font-['Manrope',sans-serif] text-sm transition-all"
            style={{
              backgroundColor: figmaColors.greenCoal[100],
              color: figmaColors.core.white,
            }}
          >
            Market
          </button>
          <button
            className="py-2 px-4 rounded-lg font-['Manrope',sans-serif] text-sm transition-all"
            style={{ color: figmaColors.app.ash300 }}
          >
            Limit
          </button>
        </div>
      </div>

      {/* Leverage Slider */}
      <div className="space-y-4 max-w-md">
        <h3 className="text-white font-medium">Leverage</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: figmaColors.app.ash300 }}>1x</span>
            <span
              className="font-medium"
              style={{ color: figmaColors.primary.skyBlue300 }}
            >
              20x
            </span>
            <span style={{ color: figmaColors.app.ash300 }}>100x</span>
          </div>
          <div
            className="h-2 rounded-full relative"
            style={{ backgroundColor: figmaColors.greenCoal[100] }}
          >
            <div
              className="h-full rounded-full w-[20%]"
              style={{ backgroundColor: figmaColors.primary.skyBlue300 }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2"
              style={{
                left: "20%",
                transform: "translate(-50%, -50%)",
                backgroundColor: figmaColors.core.white,
                borderColor: figmaColors.primary.skyBlue300,
              }}
            />
          </div>
        </div>
      </div>

      {/* Price Display */}
      <div className="space-y-4">
        <h3 className="text-white font-medium">Price Display</h3>
        <div className="flex items-baseline gap-2">
          <span
            className="font-['Manrope',sans-serif] text-3xl font-light"
            style={{ color: figmaColors.core.white }}
          >
            $101,289.50
          </span>
          <span className="text-sm" style={{ color: figmaColors.app.green300 }}>
            +2.45%
          </span>
        </div>
      </div>

      {/* Order Book Sample */}
      <div className="space-y-4 max-w-sm">
        <h3 className="text-white font-medium">Order Book</h3>
        <div
          className="rounded-lg p-4 space-y-2"
          style={{ backgroundColor: figmaColors.greenCoal[200] }}
        >
          {/* Asks (Sell orders) */}
          {[
            { price: "101,295.00", amount: "0.234", total: "23,703" },
            { price: "101,292.50", amount: "0.156", total: "15,802" },
            { price: "101,290.00", amount: "0.089", total: "9,015" },
          ].map((order, i) => (
            <div key={i} className="flex justify-between font-mono text-sm">
              <span style={{ color: figmaColors.app.red300 }}>
                {order.price}
              </span>
              <span style={{ color: figmaColors.core.white }}>
                {order.amount}
              </span>
              <span style={{ color: figmaColors.app.ash300 }}>
                {order.total}
              </span>
            </div>
          ))}

          {/* Spread */}
          <div
            className="py-2 text-center font-mono"
            style={{ color: figmaColors.primary.skyBlue300 }}
          >
            101,289.50
          </div>

          {/* Bids (Buy orders) */}
          {[
            { price: "101,287.00", amount: "0.312", total: "31,601" },
            { price: "101,284.50", amount: "0.189", total: "19,143" },
            { price: "101,282.00", amount: "0.267", total: "27,042" },
          ].map((order, i) => (
            <div key={i} className="flex justify-between font-mono text-sm">
              <span style={{ color: figmaColors.app.green300 }}>
                {order.price}
              </span>
              <span style={{ color: figmaColors.core.white }}>
                {order.amount}
              </span>
              <span style={{ color: figmaColors.app.ash300 }}>
                {order.total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ============================================================================
// FIGMA DESIGN SPEC CARD
// ============================================================================

export const DesignSpecReference: StoryObj = {
  render: () => (
    <div
      className="p-8 space-y-6"
      style={{ backgroundColor: figmaColors.greenCoal[300] }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        Design Spec Quick Reference
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Border Radius */}
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: figmaColors.greenCoal[200] }}
        >
          <h3 className="text-white font-medium mb-3">Border Radius</h3>
          <ul className="text-sm space-y-2 font-mono">
            <li className="flex justify-between">
              <span style={{ color: figmaColors.app.ash300 }}>Buttons</span>
              <span className="text-cyan-400">16px</span>
            </li>
            <li className="flex justify-between">
              <span style={{ color: figmaColors.app.ash300 }}>Inputs</span>
              <span className="text-cyan-400">16px</span>
            </li>
            <li className="flex justify-between">
              <span style={{ color: figmaColors.app.ash300 }}>
                Cards/Modals
              </span>
              <span className="text-cyan-400">24px</span>
            </li>
          </ul>
        </div>

        {/* Shadows */}
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: figmaColors.greenCoal[200] }}
        >
          <h3 className="text-white font-medium mb-3">Shadows</h3>
          <ul className="text-sm space-y-2 font-mono">
            <li className="flex justify-between">
              <span style={{ color: figmaColors.app.ash300 }}>Modal</span>
              <span className="text-cyan-400">
                0 10px 80px rgba(0,0,0,0.25)
              </span>
            </li>
          </ul>
        </div>

        {/* Spacing */}
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: figmaColors.greenCoal[200] }}
        >
          <h3 className="text-white font-medium mb-3">Common Spacing</h3>
          <ul className="text-sm space-y-2 font-mono">
            <li className="flex justify-between">
              <span style={{ color: figmaColors.app.ash300 }}>
                Input padding
              </span>
              <span className="text-cyan-400">22px</span>
            </li>
            <li className="flex justify-between">
              <span style={{ color: figmaColors.app.ash300 }}>
                Button padding (h)
              </span>
              <span className="text-cyan-400">40px</span>
            </li>
            <li className="flex justify-between">
              <span style={{ color: figmaColors.app.ash300 }}>
                Button padding (v)
              </span>
              <span className="text-cyan-400">22px</span>
            </li>
            <li className="flex justify-between">
              <span style={{ color: figmaColors.app.ash300 }}>
                Modal padding
              </span>
              <span className="text-cyan-400">32px / 48px</span>
            </li>
            <li className="flex justify-between">
              <span style={{ color: figmaColors.app.ash300 }}>Section gap</span>
              <span className="text-cyan-400">24px</span>
            </li>
          </ul>
        </div>

        {/* Fonts */}
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: figmaColors.greenCoal[200] }}
        >
          <h3 className="text-white font-medium mb-3">Font Families</h3>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between">
              <span style={{ color: figmaColors.app.ash300 }}>Primary</span>
              <span
                className="font-['Manrope',sans-serif]"
                style={{ color: figmaColors.core.white }}
              >
                Manrope
              </span>
            </li>
            <li className="flex justify-between">
              <span style={{ color: figmaColors.app.ash300 }}>Display</span>
              <span
                className="font-['Cormorant_Garamond',serif]"
                style={{ color: figmaColors.core.white }}
              >
                Cormorant Garamond
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Figma Link */}
      <div
        className="mt-8 p-4 rounded-lg border text-center"
        style={{
          backgroundColor: figmaColors.greenCoal[200],
          borderColor: figmaColors.greenCoal[100],
        }}
      >
        <p className="text-sm" style={{ color: figmaColors.app.ash300 }}>
          View the source Figma file:
        </p>
        <a
          href="https://www.figma.com/file/3sSzw1KewMtUbeLAv7uW0r/Skai-Web-App"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline"
          style={{ color: figmaColors.primary.skyBlue300 }}
        >
          Skai Web App Design System →
        </a>
      </div>
    </div>
  ),
};
