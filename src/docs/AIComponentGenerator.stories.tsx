import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  Code,
  Eye,
  Wand2,
  Zap,
  Layout,
  Box,
  Type,
  Palette,
  Layers,
  Settings,
} from "lucide-react";

const meta: Meta = {
  title: "Tools/AI Component Generator",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Generate UI components from natural language descriptions using AI.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface GeneratedComponent {
  name: string;
  description: string;
  code: string;
  props: { name: string; type: string; required: boolean; default?: string }[];
  preview: React.ReactNode;
}

interface Template {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  prompt: string;
}

const templates: Template[] = [
  {
    id: "button",
    name: "Button",
    icon: <Box className="w-4 h-4" />,
    description: "Interactive button component",
    prompt:
      "Create a button component with variants: primary, secondary, ghost",
  },
  {
    id: "card",
    name: "Card",
    icon: <Layout className="w-4 h-4" />,
    description: "Content container card",
    prompt: "Create a card component with header, body, and footer sections",
  },
  {
    id: "input",
    name: "Input",
    icon: <Type className="w-4 h-4" />,
    description: "Form input field",
    prompt:
      "Create an input component with label, error state, and helper text",
  },
  {
    id: "badge",
    name: "Badge",
    icon: <Palette className="w-4 h-4" />,
    description: "Status indicator badge",
    prompt:
      "Create a badge component with success, warning, error, and info variants",
  },
  {
    id: "modal",
    name: "Modal",
    icon: <Layers className="w-4 h-4" />,
    description: "Dialog overlay",
    prompt: "Create a modal dialog with title, content, and action buttons",
  },
];

const generatedExamples: GeneratedComponent[] = [
  {
    name: "PriceTag",
    description: "Displays a price with optional discount styling",
    code: `import { cn } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceTag = ({
  price,
  originalPrice,
  currency = '$',
  size = 'md',
}: PriceTagProps) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discount = hasDiscount 
    ? Math.round((1 - price / originalPrice) * 100) 
    : 0;

  return (
    <div className="flex items-center gap-2">
      <span className={cn(
        "font-bold text-foreground",
        size === 'sm' && "text-sm",
        size === 'md' && "text-lg",
        size === 'lg' && "text-2xl",
      )}>
        {currency}{price.toFixed(2)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-muted-foreground line-through text-sm">
            {currency}{originalPrice.toFixed(2)}
          </span>
          <span className="text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
};`,
    props: [
      { name: "price", type: "number", required: true },
      { name: "originalPrice", type: "number", required: false },
      { name: "currency", type: "string", required: false, default: '"$"' },
      {
        name: "size",
        type: "'sm' | 'md' | 'lg'",
        required: false,
        default: '"md"',
      },
    ],
    preview: (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">$29.99</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">$29.99</span>
          <span className="text-muted-foreground line-through text-sm">
            $49.99
          </span>
          <span className="text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded">
            -40%
          </span>
        </div>
      </div>
    ),
  },
  {
    name: "StatusDot",
    description: "Animated status indicator with label",
    code: `import { cn } from '@/lib/utils';

type Status = 'online' | 'offline' | 'busy' | 'away';

interface StatusDotProps {
  status: Status;
  label?: string;
  showPulse?: boolean;
}

export const StatusDot = ({ 
  status, 
  label, 
  showPulse = true 
}: StatusDotProps) => {
  const colors: Record<Status, string> = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={cn(
          "w-2.5 h-2.5 rounded-full",
          colors[status]
        )} />
        {showPulse && status === 'online' && (
          <div className={cn(
            "absolute inset-0 rounded-full animate-ping",
            colors[status],
            "opacity-75"
          )} />
        )}
      </div>
      {label && (
        <span className="text-sm text-muted-foreground capitalize">
          {label}
        </span>
      )}
    </div>
  );
};`,
    props: [
      {
        name: "status",
        type: "'online' | 'offline' | 'busy' | 'away'",
        required: true,
      },
      { name: "label", type: "string", required: false },
      { name: "showPulse", type: "boolean", required: false, default: "true" },
    ],
    preview: (
      <div className="flex flex-col gap-3">
        {["online", "busy", "away", "offline"].map((status) => (
          <div key={status} className="flex items-center gap-2">
            <div className="relative">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  status === "online"
                    ? "bg-green-500"
                    : status === "busy"
                      ? "bg-red-500"
                      : status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                }`}
              />
              {status === "online" && (
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
              )}
            </div>
            <span className="text-sm text-muted-foreground capitalize">
              {status}
            </span>
          </div>
        ))}
      </div>
    ),
  },
];

export const Generator: Story = {
  render: () => {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generated, setGenerated] = useState<GeneratedComponent | null>(null);
    const [view, setView] = useState<"preview" | "code">("preview");
    const [copied, setCopied] = useState(false);
    const [history, setHistory] =
      useState<GeneratedComponent[]>(generatedExamples);

    const handleGenerate = () => {
      if (!prompt.trim()) return;

      setIsGenerating(true);
      // Simulate AI generation
      setTimeout(() => {
        const newComponent: GeneratedComponent = {
          name: "CustomComponent",
          description: prompt,
          code: `// Generated component based on: "${prompt}"
import { cn } from '@/lib/utils';

interface CustomComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export const CustomComponent = ({ 
  children, 
  className 
}: CustomComponentProps) => {
  return (
    <div className={cn(
      "p-4 rounded-lg border border-border bg-card",
      className
    )}>
      {children}
    </div>
  );
};`,
          props: [
            { name: "children", type: "React.ReactNode", required: false },
            { name: "className", type: "string", required: false },
          ],
          preview: (
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-sm text-muted-foreground">Generated preview</p>
            </div>
          ),
        };
        setGenerated(newComponent);
        // Use functional update to avoid stale closure
        setHistory((prevHistory) => [newComponent, ...prevHistory]);
        setIsGenerating(false);
      }, 2000);
    };

    const copyCode = async () => {
      if (generated) {
        try {
          await navigator.clipboard.writeText(generated.code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          console.warn("Clipboard write failed");
        }
      }
    };

    const selectTemplate = (template: Template) => {
      setPrompt(template.prompt);
    };

    const selectFromHistory = (component: GeneratedComponent) => {
      setGenerated(component);
      setView("preview");
    };

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Component Generator</h1>
                <p className="text-muted-foreground">
                  Generate React components from natural language
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Main Panel */}
            <div className="col-span-8 space-y-6">
              {/* Input */}
              <div className="bg-card border border-border rounded-lg p-4">
                <label className="text-sm font-medium mb-2 block">
                  Describe your component
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., Create a notification badge that shows unread count with a pulse animation..."
                    className="w-full h-32 bg-muted/50 rounded-lg p-4 pr-12 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Templates */}
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    Quick templates
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => selectTemplate(template)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted text-xs transition-colors"
                      >
                        {template.icon}
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generation Result */}
              {isGenerating && (
                <div className="bg-card border border-border rounded-lg p-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                      <Wand2 className="w-8 h-8 text-violet-500 animate-pulse" />
                    </div>
                    <p className="font-medium">Generating component...</p>
                    <p className="text-sm text-muted-foreground">
                      Analyzing prompt and creating code
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <div
                        className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {generated && !isGenerating && (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  {/* Result Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div>
                      <h3 className="font-semibold">{generated.name}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {generated.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex rounded-lg overflow-hidden border border-border">
                        <button
                          onClick={() => setView("preview")}
                          className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${
                            view === "preview"
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </button>
                        <button
                          onClick={() => setView("code")}
                          className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${
                            view === "code"
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          <Code className="w-3.5 h-3.5" />
                          Code
                        </button>
                      </div>
                      <button
                        onClick={copyCode}
                        className="p-2 rounded-lg hover:bg-muted"
                        title="Copy code"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {view === "preview" ? (
                      <div className="space-y-4">
                        <div className="p-8 bg-muted/30 rounded-lg flex items-center justify-center min-h-[200px]">
                          {generated.preview}
                        </div>

                        {/* Props Table */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Props</h4>
                          <div className="border border-border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-muted/50">
                                <tr>
                                  <th className="text-left p-2 font-medium">
                                    Name
                                  </th>
                                  <th className="text-left p-2 font-medium">
                                    Type
                                  </th>
                                  <th className="text-left p-2 font-medium">
                                    Required
                                  </th>
                                  <th className="text-left p-2 font-medium">
                                    Default
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {generated.props.map((prop) => (
                                  <tr
                                    key={prop.name}
                                    className="border-t border-border"
                                  >
                                    <td className="p-2 font-mono text-xs">
                                      {prop.name}
                                    </td>
                                    <td className="p-2 font-mono text-xs text-violet-500">
                                      {prop.type}
                                    </td>
                                    <td className="p-2">
                                      {prop.required ? (
                                        <span className="text-xs bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded">
                                          Yes
                                        </span>
                                      ) : (
                                        <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                          No
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-2 font-mono text-xs text-muted-foreground">
                                      {prop.default || "-"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <pre className="p-4 bg-muted/50 rounded-lg overflow-auto max-h-[500px] text-sm font-mono">
                        <code>{generated.code}</code>
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-span-4 space-y-4">
              {/* Tips */}
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-violet-500" />
                  <span className="font-medium text-violet-500">
                    Tips for better results
                  </span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific about variants and states</li>
                  <li>• Mention styling preferences</li>
                  <li>• Include accessibility requirements</li>
                  <li>• Describe animations if needed</li>
                </ul>
              </div>

              {/* History */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Generation History
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-auto">
                  {history.map((component, i) => (
                    <button
                      key={`${component.name}-${component.description.slice(0, 20)}-${i}`}
                      onClick={() => selectFromHistory(component)}
                      className={`w-full text-left p-3 rounded-lg hover:bg-muted transition-colors ${
                        generated?.name === component.name &&
                        generated?.description === component.description
                          ? "bg-muted border border-primary/50"
                          : ""
                      }`}
                    >
                      <p className="font-medium text-sm">{component.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {component.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm">
                    <RefreshCw className="w-4 h-4" />
                    Regenerate with variations
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm">
                    <Code className="w-4 h-4" />
                    Export as Storybook story
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-sm">
                    <Copy className="w-4 h-4" />
                    Add to component library
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
