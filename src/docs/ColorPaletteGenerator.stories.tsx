import React, { useState, useMemo } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Palette,
  Copy,
  Check,
  Eye,
  Lock,
  Unlock,
  Pipette,
  Shuffle,
  Sparkles,
} from "lucide-react";

const meta: Meta = {
  title: "Tools/Color Palette Generator",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Generate harmonious color palettes from a base color with various harmony rules.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Color conversion utilities
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Validate hex format
  const validHex = /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#000000";
  const r = parseInt(validHex.slice(1, 3), 16) / 255;
  const g = parseInt(validHex.slice(3, 5), 16) / 255;
  const b = parseInt(validHex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

type HarmonyType =
  | "complementary"
  | "analogous"
  | "triadic"
  | "split-complementary"
  | "tetradic"
  | "monochromatic";

interface ColorSwatch {
  hex: string;
  name: string;
  locked: boolean;
}

const harmonyRules: Record<
  HarmonyType,
  { name: string; description: string; offsets: number[] }
> = {
  complementary: {
    name: "Complementary",
    description: "Colors opposite on the color wheel",
    offsets: [0, 180],
  },
  analogous: {
    name: "Analogous",
    description: "Colors next to each other",
    offsets: [0, 30, 60, 330, 300],
  },
  triadic: {
    name: "Triadic",
    description: "Three colors equally spaced",
    offsets: [0, 120, 240],
  },
  "split-complementary": {
    name: "Split Complementary",
    description: "Base + two adjacent to complement",
    offsets: [0, 150, 210],
  },
  tetradic: {
    name: "Tetradic",
    description: "Four colors, two complementary pairs",
    offsets: [0, 90, 180, 270],
  },
  monochromatic: {
    name: "Monochromatic",
    description: "Different shades of one color",
    offsets: [0],
  },
};

export const Generator: Story = {
  render: () => {
    const [baseColor, setBaseColor] = useState("#3B82F6");
    const [harmony, setHarmony] = useState<HarmonyType>("analogous");
    const [colors, setColors] = useState<ColorSwatch[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [showAccessibility, setShowAccessibility] = useState(false);

    // Generate palette based on harmony rule
    const generatePalette = useMemo(() => {
      const hsl = hexToHSL(baseColor);
      const rule = harmonyRules[harmony];

      if (harmony === "monochromatic") {
        // Generate shades for monochromatic
        return [10, 30, 50, 70, 90].map((lightness, i) => ({
          hex: hslToHex(hsl.h, hsl.s, lightness),
          name: `Shade ${i + 1}`,
          locked: colors[i]?.locked || false,
        }));
      }

      return rule.offsets.map((offset, i) => {
        if (colors[i]?.locked) {
          return colors[i];
        }
        const newHue = (hsl.h + offset) % 360;
        return {
          hex: hslToHex(newHue, hsl.s, hsl.l),
          name: `Color ${i + 1}`,
          locked: false,
        };
      });
      // Note: 'colors' is intentionally excluded to prevent infinite loop
      // colors.locked state is captured at render time
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseColor, harmony]);

    React.useEffect(() => {
      setColors(generatePalette);
    }, [generatePalette]);

    const toggleLock = (index: number) => {
      setColors(
        colors.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c)),
      );
    };

    const copyColor = async (hex: string, index: number) => {
      try {
        await navigator.clipboard.writeText(hex);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
      } catch {
        // Clipboard API may fail in some contexts
        console.warn("Clipboard write failed");
      }
    };

    const randomize = () => {
      const randomHex =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
      setBaseColor(randomHex);
    };

    const getContrastRatio = (fg: string, bg: string): number => {
      const getLuminance = (hex: string) => {
        const rgb = [
          parseInt(hex.slice(1, 3), 16) / 255,
          parseInt(hex.slice(3, 5), 16) / 255,
          parseInt(hex.slice(5, 7), 16) / 255,
        ].map((v) =>
          v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
        );
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      };
      const l1 = getLuminance(fg);
      const l2 = getLuminance(bg);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    };

    const exportPalette = (format: "css" | "scss" | "json" | "tailwind") => {
      let output = "";
      switch (format) {
        case "css":
          output = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n")}\n}`;
          break;
        case "scss":
          output = colors
            .map((c, i) => `$color-${i + 1}: ${c.hex};`)
            .join("\n");
          break;
        case "json":
          output = JSON.stringify(
            colors.reduce(
              (acc, c, i) => ({ ...acc, [`color${i + 1}`]: c.hex }),
              {},
            ),
            null,
            2,
          );
          break;
        case "tailwind":
          output = `colors: {\n${colors.map((c, i) => `  'custom-${i + 1}': '${c.hex}',`).join("\n")}\n}`;
          break;
      }
      navigator.clipboard.writeText(output);
    };

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Color Palette Generator</h1>
                <p className="text-muted-foreground">
                  Create harmonious color palettes for your designs
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center gap-6">
              {/* Base Color Picker */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  Base Color
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <Pipette className="absolute bottom-1 right-1 w-3 h-3 text-white pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-24 px-3 py-2 bg-muted rounded-lg text-sm font-mono uppercase"
                  />
                </div>
              </div>

              {/* Harmony Selector */}
              <div className="flex-1">
                <label className="text-sm font-medium block mb-2">
                  Harmony Rule
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(harmonyRules).map(([key, rule]) => (
                    <button
                      key={key}
                      onClick={() => setHarmony(key as HarmonyType)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        harmony === key
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {rule.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {harmonyRules[harmony].description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={randomize}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80"
                  title="Random base color"
                >
                  <Shuffle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowAccessibility(!showAccessibility)}
                  className={`p-2 rounded-lg ${showAccessibility ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                  title="Toggle accessibility view"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Color Palette Display */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {colors.map((color, index) => (
              <div key={index} className="relative group">
                <div
                  className="aspect-square rounded-xl shadow-lg transition-transform group-hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyColor(color.hex, index)}
                      className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleLock(index)}
                      className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70"
                    >
                      {color.locked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Unlock className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                {color.locked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-4 h-4 text-white drop-shadow-lg" />
                  </div>
                )}
                <div className="mt-2 text-center">
                  <p className="font-mono text-sm uppercase">{color.hex}</p>
                  <p className="text-xs text-muted-foreground">{color.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Accessibility Matrix */}
          {showAccessibility && (
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Accessibility Contrast Matrix
              </h3>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-left">FG / BG</th>
                      {colors.map((c, i) => (
                        <th key={i} className="p-2">
                          <div
                            className="w-6 h-6 rounded mx-auto"
                            style={{ backgroundColor: c.hex }}
                          />
                        </th>
                      ))}
                      <th className="p-2">White</th>
                      <th className="p-2">Black</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colors.map((fg, fgIndex) => (
                      <tr key={fgIndex}>
                        <td className="p-2">
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: fg.hex }}
                          />
                        </td>
                        {colors.map((bg, bgIndex) => {
                          const ratio = getContrastRatio(fg.hex, bg.hex);
                          const passes = ratio >= 4.5;
                          const passesLarge = ratio >= 3;
                          return (
                            <td key={bgIndex} className="p-2 text-center">
                              <span
                                className={`text-xs font-mono ${
                                  passes
                                    ? "text-green-500"
                                    : passesLarge
                                      ? "text-yellow-500"
                                      : "text-red-500"
                                }`}
                              >
                                {ratio.toFixed(1)}
                              </span>
                            </td>
                          );
                        })}
                        <td className="p-2 text-center">
                          <span
                            className={`text-xs font-mono ${
                              getContrastRatio(fg.hex, "#ffffff") >= 4.5
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {getContrastRatio(fg.hex, "#ffffff").toFixed(1)}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <span
                            className={`text-xs font-mono ${
                              getContrastRatio(fg.hex, "#000000") >= 4.5
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {getContrastRatio(fg.hex, "#000000").toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-green-500" /> ≥ 4.5:1 (AA
                  Normal)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-yellow-500" /> ≥ 3:1 (AA
                  Large)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-red-500" /> &lt; 3:1
                  (Fail)
                </span>
              </div>
            </div>
          )}

          {/* Preview and Export */}
          <div className="grid grid-cols-2 gap-6">
            {/* Preview Cards */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-medium mb-4">Preview</h3>
              <div className="space-y-3">
                {/* UI Preview */}
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors[0]?.hex || "#3B82F6" }}
                >
                  <h4
                    className="font-bold mb-2"
                    style={{ color: colors[colors.length - 1]?.hex || "#fff" }}
                  >
                    Sample Heading
                  </h4>
                  <p
                    className="text-sm mb-3 opacity-80"
                    style={{ color: colors[colors.length - 1]?.hex || "#fff" }}
                  >
                    This is how your palette might look in a real interface.
                  </p>
                  <div className="flex gap-2">
                    {colors.slice(1, 4).map((c, i) => (
                      <div
                        key={i}
                        className="px-3 py-1.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: c.hex,
                          color:
                            getContrastRatio(c.hex, "#ffffff") >
                            getContrastRatio(c.hex, "#000000")
                              ? "#fff"
                              : "#000",
                        }}
                      >
                        Button {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gradient Preview */}
                <div
                  className="h-16 rounded-lg"
                  style={{
                    background: `linear-gradient(90deg, ${colors.map((c) => c.hex).join(", ")})`,
                  }}
                />
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-medium mb-4">Export</h3>
              <div className="grid grid-cols-2 gap-2">
                {(["css", "scss", "json", "tailwind"] as const).map(
                  (format) => (
                    <button
                      key={format}
                      onClick={() => exportPalette(format)}
                      className="p-3 rounded-lg bg-muted hover:bg-muted/80 text-left"
                    >
                      <div className="font-medium text-sm uppercase">
                        {format}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format === "css" && "CSS Custom Properties"}
                        {format === "scss" && "SCSS Variables"}
                        {format === "json" && "JSON Object"}
                        {format === "tailwind" && "Tailwind Config"}
                      </div>
                    </button>
                  ),
                )}
              </div>

              {/* Code Preview */}
              <div className="mt-4">
                <pre className="p-3 bg-muted/50 rounded-lg text-xs font-mono overflow-auto">
                  {`:root {
${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n")}
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* SKAI Brand Colors */}
          <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="font-medium text-cyan-500">
                SKAI Brand Presets
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "SKAI Cyan", hex: "#00D9FF" },
                { name: "SKAI Blue", hex: "#3B82F6" },
                { name: "SKAI Purple", hex: "#8B5CF6" },
                { name: "SKAI Green", hex: "#10B981" },
                { name: "SKAI Orange", hex: "#F59E0B" },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setBaseColor(preset.hex)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card hover:bg-muted transition-colors"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span className="text-sm">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};
