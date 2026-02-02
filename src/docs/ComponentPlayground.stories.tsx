import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Copy, Check, Code2, Eye, Sliders, RotateCcw } from "lucide-react";
import { Button } from "../components/core/button";
import { Card } from "../components/core/card";
import { Badge } from "../components/core/badge";
import { Input } from "../components/core/input";

/**
 * # Component Playground
 *
 * Interactive sandbox for experimenting with components in real-time.
 * Tweak every prop and see changes instantly.
 */

// Prop configurator types
type PropType = "string" | "number" | "boolean" | "select" | "color";

interface PropConfig {
  name: string;
  type: PropType;
  defaultValue: unknown;
  options?: string[];
  description?: string;
}

// Code generator
const generateCode = (
  component: string,
  props: Record<string, unknown>,
): string => {
  const propsString = Object.entries(props)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => {
      if (typeof value === "boolean") {
        return value ? key : "";
      }
      if (typeof value === "string") {
        return `${key}="${value}"`;
      }
      return `${key}={${JSON.stringify(value)}}`;
    })
    .filter(Boolean)
    .join(" ");

  return `<${component}${propsString ? " " + propsString : ""}>Click me</${component}>`;
};

// Prop editor component
const PropEditor = ({
  config,
  value,
  onChange,
}: {
  config: PropConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}) => {
  switch (config.type) {
    case "boolean":
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded accent-skai-green"
          />
          <span className="text-sm">{config.name}</span>
        </label>
      );

    case "select":
      return (
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">{config.name}</label>
          <select
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-muted rounded-lg border border-border text-sm"
          >
            {config.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "color":
      return (
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">{config.name}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 bg-muted rounded-lg border border-border text-sm font-mono"
            />
          </div>
        </div>
      );

    case "number":
      return (
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">{config.name}</label>
          <input
            type="number"
            value={value as number}
            onChange={(e) => {
              const raw = e.target.value;
              const parsed = raw === "" ? 0 : Number(raw);
              onChange(Number.isNaN(parsed) ? 0 : parsed);
            }}
            className="w-full px-3 py-2 bg-muted rounded-lg border border-border text-sm"
          />
        </div>
      );

    default:
      return (
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">{config.name}</label>
          <input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-muted rounded-lg border border-border text-sm"
          />
        </div>
      );
  }
};

// Button playground config
const buttonPropConfigs: PropConfig[] = [
  {
    name: "variant",
    type: "select",
    defaultValue: "default",
    options: [
      "default",
      "secondary",
      "outline",
      "ghost",
      "destructive",
      "link",
    ],
    description: "Visual style of the button",
  },
  {
    name: "size",
    type: "select",
    defaultValue: "default",
    options: ["sm", "default", "lg", "icon"],
    description: "Size of the button",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: false,
    description: "Whether the button is disabled",
  },
];

// Main playground component
const PlaygroundComponent = () => {
  const [props, setProps] = useState<Record<string, unknown>>({
    variant: "default",
    size: "default",
    disabled: false,
  });
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  const updateProp = (name: string, value: unknown) => {
    setProps((prev) => ({ ...prev, [name]: value }));
  };

  const resetProps = () => {
    const defaults: Record<string, unknown> = {};
    buttonPropConfigs.forEach((config) => {
      defaults[config.name] = config.defaultValue;
    });
    setProps(defaults);
  };

  const code = generateCode("Button", props);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Component Playground</h1>
          <p className="text-muted-foreground">
            Experiment with components in real-time. Adjust props and see
            instant results.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Props Panel */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Props
              </h2>
              <button
                onClick={resetProps}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Reset to defaults"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {buttonPropConfigs.map((config) => (
                <PropEditor
                  key={config.name}
                  config={config}
                  value={props[config.name]}
                  onChange={(value) => updateProp(config.name, value)}
                />
              ))}
            </div>
          </Card>

          {/* Preview Panel */}
          <Card className="lg:col-span-2 p-6">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === "preview"
                      ? "bg-card text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode("code")}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === "code"
                      ? "bg-card text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code2 className="w-4 h-4 inline mr-1" />
                  Code
                </button>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>

            {viewMode === "preview" ? (
              <div className="min-h-[200px] flex items-center justify-center bg-muted/30 rounded-lg border border-border border-dashed">
                <Button
                  variant={
                    props.variant as
                      | "default"
                      | "secondary"
                      | "outline"
                      | "ghost"
                      | "destructive"
                      | "link"
                  }
                  size={props.size as "sm" | "default" | "lg" | "icon"}
                  disabled={props.disabled as boolean}
                >
                  Click me
                </Button>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-green-400 font-mono">
                  {`import { Button } from "@skai/ui";\n\n${code}`}
                </pre>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Reference */}
        <Card className="mt-6 p-6">
          <h3 className="font-semibold mb-4">All Variants at a Glance</h3>
          <div className="flex flex-wrap gap-3">
            {[
              "default",
              "secondary",
              "outline",
              "ghost",
              "destructive",
              "link",
            ].map((variant) => (
              <Button
                key={variant}
                variant={
                  variant as
                    | "default"
                    | "secondary"
                    | "outline"
                    | "ghost"
                    | "destructive"
                    | "link"
                }
                onClick={() => updateProp("variant", variant)}
              >
                {variant}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Component Playground",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Interactive Component Playground

A sandbox environment for experimenting with components:
- **Real-time preview** - See changes instantly
- **Prop editing** - Adjust every prop visually
- **Code generation** - Get copy-paste ready code
- **All variants** - Quick access to see all options
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const ButtonPlayground: Story = {
  name: "🎮 Button Playground",
  render: () => <PlaygroundComponent />,
};

// Badge Playground
const BadgePlayground = () => {
  const [variant, setVariant] = useState("default");
  const [text, setText] = useState("Badge");

  const variants = ["default", "secondary", "outline", "destructive"];

  return (
    <div className="p-8 bg-background min-h-[400px]">
      <h2 className="text-xl font-bold mb-6">Badge Playground</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Controls</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Text</label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Variant</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`px-3 py-1 rounded text-sm ${
                      variant === v
                        ? "bg-skai-green text-black"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-center">
          <Badge
            variant={
              variant as "default" | "secondary" | "outline" | "destructive"
            }
          >
            {text}
          </Badge>
        </Card>
      </div>
    </div>
  );
};

export const BadgePlaygroundStory: Story = {
  name: "🏷️ Badge Playground",
  render: () => <BadgePlayground />,
};

// Input Playground
const InputPlayground = () => {
  const [placeholder, setPlaceholder] = useState("Enter text...");
  const [disabled, setDisabled] = useState(false);
  const [type, setType] = useState("text");

  return (
    <div className="p-8 bg-background min-h-[400px]">
      <h2 className="text-xl font-bold mb-6">Input Playground</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Controls</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">
                Placeholder
              </label>
              <Input
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-muted rounded-lg border border-border"
              >
                <option value="text">text</option>
                <option value="password">password</option>
                <option value="email">email</option>
                <option value="number">number</option>
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
                className="accent-skai-green"
              />
              <span className="text-sm">Disabled</span>
            </label>
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-center">
          <Input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className="max-w-[300px]"
          />
        </Card>
      </div>
    </div>
  );
};

export const InputPlaygroundStory: Story = {
  name: "📝 Input Playground",
  render: () => <InputPlayground />,
};
