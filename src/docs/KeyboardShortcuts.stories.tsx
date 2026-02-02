import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { Command, Keyboard, Search, Play, Eye } from "lucide-react";
import { Card } from "../components/core/card";

/**
 * # Keyboard Shortcuts
 *
 * Power user features for navigating the design system quickly.
 * Press `?` anywhere to see available shortcuts.
 */

interface Shortcut {
  keys: string[];
  description: string;
  action: () => void;
  category: string;
}

const ShortcutDisplay = ({ keys }: { keys: string[] }) => (
  <div className="flex gap-1">
    {keys.map((key, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span className="text-muted-foreground">+</span>}
        <kbd className="px-2 py-1 bg-muted rounded border border-border text-xs font-mono font-medium">
          {key}
        </kbd>
      </React.Fragment>
    ))}
  </div>
);

const KeyboardShortcutsGuide = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "?") setIsOpen(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Display open state for demo purposes (toggle with ? and Escape keys)
  const openStateDisplay = isOpen
    ? "Open (press Escape to close)"
    : "Closed (press ? to open)";

  const shortcuts: Shortcut[] = [
    // Navigation
    {
      keys: ["⌘", "K"],
      description: "Open command palette",
      action: () => setLastAction("Command palette"),
      category: "Navigation",
    },
    {
      keys: ["⌘", "/"],
      description: "Search components",
      action: () => setLastAction("Search"),
      category: "Navigation",
    },
    {
      keys: ["⌘", "B"],
      description: "Toggle sidebar",
      action: () => setLastAction("Toggle sidebar"),
      category: "Navigation",
    },
    {
      keys: ["←", "→"],
      description: "Navigate between stories",
      action: () => setLastAction("Navigate stories"),
      category: "Navigation",
    },

    // View
    {
      keys: ["⌘", "Shift", "F"],
      description: "Toggle fullscreen",
      action: () => setLastAction("Fullscreen"),
      category: "View",
    },
    {
      keys: ["⌘", "Shift", "D"],
      description: "Toggle dark mode",
      action: () => setLastAction("Dark mode"),
      category: "View",
    },
    {
      keys: ["⌘", "Shift", "G"],
      description: "Toggle grid overlay",
      action: () => setLastAction("Grid overlay"),
      category: "View",
    },
    {
      keys: ["⌘", "+"],
      description: "Zoom in",
      action: () => setLastAction("Zoom in"),
      category: "View",
    },
    {
      keys: ["⌘", "-"],
      description: "Zoom out",
      action: () => setLastAction("Zoom out"),
      category: "View",
    },
    {
      keys: ["⌘", "0"],
      description: "Reset zoom",
      action: () => setLastAction("Reset zoom"),
      category: "View",
    },

    // Actions
    {
      keys: ["⌘", "C"],
      description: "Copy component code",
      action: () => setLastAction("Copy code"),
      category: "Actions",
    },
    {
      keys: ["⌘", "Shift", "C"],
      description: "Copy as JSX",
      action: () => setLastAction("Copy JSX"),
      category: "Actions",
    },
    {
      keys: ["⌘", "R"],
      description: "Refresh preview",
      action: () => setLastAction("Refresh"),
      category: "Actions",
    },
    {
      keys: ["⌘", "S"],
      description: "Save changes",
      action: () => setLastAction("Save"),
      category: "Actions",
    },

    // Help
    {
      keys: ["?"],
      description: "Show keyboard shortcuts",
      action: () => setIsOpen(true),
      category: "Help",
    },
    {
      keys: ["Escape"],
      description: "Close dialog/modal",
      action: () => setIsOpen(false),
      category: "Help",
    },
  ];

  const categories = [...new Set(shortcuts.map((s) => s.category))];

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setLastAction(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Clear last action after delay
  useEffect(() => {
    if (lastAction) {
      const timer = setTimeout(() => setLastAction(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Keyboard className="w-8 h-8 text-skai-green" />
            <h1 className="text-3xl font-bold">Keyboard Shortcuts</h1>
          </div>
          <p className="text-muted-foreground">
            Power through the design system like a pro. Press{" "}
            <kbd className="px-2 py-0.5 bg-muted rounded border border-border text-sm font-mono">
              ?
            </kbd>{" "}
            anywhere to see this guide.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Guide state: {openStateDisplay}
          </p>
        </div>

        {/* Action Feedback */}
        {lastAction && (
          <div className="fixed top-4 right-4 bg-skai-green text-black px-4 py-2 rounded-lg shadow-lg animate-pulse">
            Action: {lastAction}
          </div>
        )}

        {/* Shortcut Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category} className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {category === "Navigation" && <Search className="w-5 h-5" />}
                {category === "View" && <Eye className="w-5 h-5" />}
                {category === "Actions" && <Play className="w-5 h-5" />}
                {category === "Help" && <Command className="w-5 h-5" />}
                {category}
              </h2>
              <div className="grid gap-3">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, i) => (
                    <button
                      key={i}
                      onClick={shortcut.action}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <ShortcutDisplay keys={shortcut.keys} />
                    </button>
                  ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Reference Card */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-skai-green/10 to-sky-blue/10">
          <h3 className="font-semibold mb-4">Most Used Shortcuts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { keys: ["⌘", "K"], label: "Command" },
              { keys: ["⌘", "C"], label: "Copy" },
              { keys: ["⌘", "Shift", "D"], label: "Dark Mode" },
              { keys: ["?"], label: "Help" },
            ].map((item, i) => (
              <div key={i} className="text-center p-3 bg-card rounded-lg">
                <ShortcutDisplay keys={item.keys} />
                <p className="text-xs text-muted-foreground mt-2">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Platform Note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          <span className="inline-flex items-center gap-1">
            <Command className="w-3 h-3" />= Command (Mac) / Ctrl (Windows)
          </span>
        </p>
      </div>
    </div>
  );
};

// Interactive Shortcut Tester
const ShortcutTester = () => {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys: string[] = [];
      if (e.metaKey || e.ctrlKey) keys.push("⌘");
      if (e.shiftKey) keys.push("Shift");
      if (e.altKey) keys.push("Alt");
      if (!["Meta", "Control", "Shift", "Alt"].includes(e.key)) {
        keys.push(e.key.toUpperCase());
      }

      if (keys.length > 0) {
        setPressedKeys(keys);
        setHistory((prev) => [...prev.slice(-4), keys]);
      }
    };

    const handleKeyUp = () => {
      setPressedKeys([]);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="min-h-[400px] bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Shortcut Tester</h2>
        <p className="text-muted-foreground mb-8">
          Press any key combination to see it displayed below.
        </p>

        {/* Current Keys */}
        <div className="min-h-[100px] flex items-center justify-center mb-8">
          {pressedKeys.length > 0 ? (
            <div className="flex gap-2">
              {pressedKeys.map((key, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span className="text-3xl text-muted-foreground">+</span>
                  )}
                  <kbd className="px-6 py-4 bg-skai-green text-black text-2xl font-bold rounded-lg shadow-lg">
                    {key}
                  </kbd>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Press any keys...</p>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm text-muted-foreground mb-3">
              Recent combinations
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {history.map((combo, i) => (
                <div key={i} className="flex gap-1 opacity-75">
                  {combo.map((key, j) => (
                    <React.Fragment key={j}>
                      {j > 0 && (
                        <span className="text-muted-foreground">+</span>
                      )}
                      <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                        {key}
                      </kbd>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Keyboard Shortcuts",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Keyboard Shortcuts

Navigate the design system efficiently:
- **⌘K** - Command palette
- **⌘/** - Quick search
- **⌘Shift+D** - Toggle dark mode
- **?** - Show shortcuts guide

All shortcuts work with Ctrl on Windows.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Guide: Story = {
  name: "⌨️ Shortcuts Guide",
  render: () => <KeyboardShortcutsGuide />,
};

export const Tester: Story = {
  name: "🧪 Shortcut Tester",
  render: () => <ShortcutTester />,
};
