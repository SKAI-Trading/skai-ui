import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Maximize2,
  Link2,
  Monitor,
  Smartphone,
  ArrowRight,
  MousePointer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Plus,
  X,
} from "lucide-react";
import { Button } from "../components/button";
import { Badge } from "../components/badge";

/**
 * # Prototype Mode
 *
 * Link screens together to create interactive prototypes.
 * Test user flows, present designs, and validate journeys.
 */

interface Screen {
  id: string;
  name: string;
  thumbnail: string;
  links: ScreenLink[];
  x: number;
  y: number;
}

interface ScreenLink {
  id: string;
  targetScreenId: string;
  hotspot: { x: number; y: number; width: number; height: number };
  animation: "instant" | "slide-left" | "slide-right" | "fade" | "push";
}

// Mock screen data
const mockScreens: Screen[] = [
  {
    id: "landing",
    name: "Landing Page",
    thumbnail: "linear-gradient(135deg, #0D1117 0%, #1a1f2e 100%)",
    links: [
      {
        id: "l1",
        targetScreenId: "connect",
        hotspot: { x: 70, y: 20, width: 20, height: 10 },
        animation: "fade",
      },
    ],
    x: 50,
    y: 100,
  },
  {
    id: "connect",
    name: "Connect Wallet",
    thumbnail: "linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)",
    links: [
      {
        id: "l2",
        targetScreenId: "dashboard",
        hotspot: { x: 30, y: 60, width: 40, height: 15 },
        animation: "slide-left",
      },
    ],
    x: 350,
    y: 50,
  },
  {
    id: "dashboard",
    name: "Dashboard",
    thumbnail: "linear-gradient(135deg, #1a2332 0%, #0f1419 100%)",
    links: [
      {
        id: "l3",
        targetScreenId: "trade",
        hotspot: { x: 10, y: 40, width: 25, height: 10 },
        animation: "slide-left",
      },
      {
        id: "l4",
        targetScreenId: "portfolio",
        hotspot: { x: 10, y: 55, width: 25, height: 10 },
        animation: "slide-left",
      },
    ],
    x: 650,
    y: 100,
  },
  {
    id: "trade",
    name: "Trade",
    thumbnail: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    links: [
      {
        id: "l5",
        targetScreenId: "confirm",
        hotspot: { x: 60, y: 70, width: 30, height: 12 },
        animation: "push",
      },
    ],
    x: 950,
    y: 50,
  },
  {
    id: "portfolio",
    name: "Portfolio",
    thumbnail: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
    links: [],
    x: 950,
    y: 200,
  },
  {
    id: "confirm",
    name: "Confirm Trade",
    thumbnail: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    links: [
      {
        id: "l6",
        targetScreenId: "success",
        hotspot: { x: 30, y: 75, width: 40, height: 12 },
        animation: "fade",
      },
    ],
    x: 1250,
    y: 50,
  },
  {
    id: "success",
    name: "Success",
    thumbnail: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    links: [
      {
        id: "l7",
        targetScreenId: "dashboard",
        hotspot: { x: 30, y: 80, width: 40, height: 10 },
        animation: "fade",
      },
    ],
    x: 1550,
    y: 100,
  },
];

// Mini screen preview
const ScreenPreview = ({
  screen,
  isActive,
  isSelected,
  onClick,
  onDragStart,
  scale,
}: {
  screen: Screen;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
  onDragStart: () => void;
  scale: number;
}) => (
  <div
    role="button"
    tabIndex={0}
    aria-pressed={isSelected}
    aria-label={`Screen: ${screen.name}`}
    className={`absolute cursor-pointer transition-all duration-200 ${
      isSelected ? "ring-2 ring-skai-green" : ""
    } ${isActive ? "ring-2 ring-sky-blue animate-pulse" : ""}`}
    style={{
      left: screen.x * scale,
      top: screen.y * scale,
      width: 200 * scale,
      height: 140 * scale,
    }}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
    onMouseDown={onDragStart}
  >
    <div
      className="w-full h-full rounded-lg shadow-lg overflow-hidden"
      style={{ background: screen.thumbnail }}
    >
      <div className="p-2 bg-black/40 text-white text-xs truncate">
        {screen.name}
      </div>
      {/* Hotspots visualization */}
      {screen.links.map((link) => (
        <div
          key={link.id}
          className="absolute bg-skai-green/30 border border-skai-green rounded"
          style={{
            left: `${link.hotspot.x}%`,
            top: `${link.hotspot.y + 15}%`,
            width: `${link.hotspot.width}%`,
            height: `${link.hotspot.height}%`,
          }}
        />
      ))}
    </div>
  </div>
);

// Connection line between screens
const ConnectionLine = ({
  from,
  to,
  scale,
}: {
  from: Screen;
  to: Screen;
  scale: number;
}) => {
  const fromX = (from.x + 200) * scale;
  const fromY = (from.y + 70) * scale;
  const toX = to.x * scale;
  const toY = (to.y + 70) * scale;

  const midX = (fromX + toX) / 2;

  return (
    <svg className="absolute inset-0 pointer-events-none overflow-visible">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#00E5A0" />
        </marker>
      </defs>
      <path
        d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
        fill="none"
        stroke="#00E5A0"
        strokeWidth="2"
        strokeDasharray="5,5"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
};

const PrototypeMode = () => {
  const [screens, _setScreens] = useState(mockScreens);
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  const [activeScreen, setActiveScreen] = useState<string>("landing");
  const [isPlaying, setIsPlaying] = useState(false);
  const [scale, setScale] = useState(0.8);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [history, setHistory] = useState<string[]>(["landing"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const historyRef = useRef(history);
  historyRef.current = history;

  const navigateToScreen = useCallback((screenId: string) => {
    setActiveScreen(screenId);
    setHistoryIndex((prevIndex) => {
      setHistory((prevHistory) => [
        ...prevHistory.slice(0, prevIndex + 1),
        screenId,
      ]);
      return prevIndex + 1;
    });
  }, []);

  const goBack = useCallback(() => {
    setHistoryIndex((prevIndex) => {
      if (prevIndex > 0) {
        const newIndex = prevIndex - 1;
        setActiveScreen(historyRef.current[newIndex]);
        return newIndex;
      }
      return prevIndex;
    });
  }, []);

  const goForward = useCallback(() => {
    setHistoryIndex((prevIndex) => {
      if (prevIndex < historyRef.current.length - 1) {
        const newIndex = prevIndex + 1;
        setActiveScreen(historyRef.current[newIndex]);
        return newIndex;
      }
      return prevIndex;
    });
  }, []);

  const resetFlow = useCallback(() => {
    setActiveScreen("landing");
    setHistory(["landing"]);
    setHistoryIndex(0);
    setIsPlaying(false);
  }, []);

  const currentScreen = screens.find((s) => s.id === activeScreen);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-skai-green" />
            <span className="font-semibold">Prototype Mode</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode("edit")}
              className={`px-3 py-1.5 rounded-l text-sm ${
                viewMode === "edit"
                  ? "bg-skai-green text-black"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Move className="w-4 h-4 inline mr-1" />
              Edit
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-r text-sm ${
                viewMode === "preview"
                  ? "bg-skai-green text-black"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <MousePointer className="w-4 h-4 inline mr-1" />
              Preview
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDevice("desktop")}
            className={device === "desktop" ? "ring-2 ring-skai-green" : ""}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDevice("mobile")}
            className={device === "mobile" ? "ring-2 ring-skai-green" : ""}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-2" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale((s) => Math.max(0.3, s - 0.1))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">{screens.length} screens</Badge>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Screen
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 relative overflow-auto bg-muted/30">
          {viewMode === "edit" ? (
            <div className="relative min-w-[2000px] min-h-[600px] p-8">
              {/* Connection lines */}
              {screens.map((screen) =>
                screen.links.map((link) => {
                  const targetScreen = screens.find(
                    (s) => s.id === link.targetScreenId,
                  );
                  if (!targetScreen) return null;
                  return (
                    <ConnectionLine
                      key={link.id}
                      from={screen}
                      to={targetScreen}
                      scale={scale}
                    />
                  );
                }),
              )}

              {/* Screens */}
              {screens.map((screen) => (
                <ScreenPreview
                  key={screen.id}
                  screen={screen}
                  isActive={screen.id === activeScreen}
                  isSelected={screen.id === selectedScreen}
                  onClick={() => setSelectedScreen(screen.id)}
                  onDragStart={() => {}}
                  scale={scale}
                />
              ))}
            </div>
          ) : (
            /* Preview Mode */
            <div className="flex items-center justify-center h-full">
              <div
                className={`relative bg-card rounded-lg shadow-2xl overflow-hidden transition-all ${
                  device === "mobile"
                    ? "w-[375px] h-[812px]"
                    : "w-[1024px] h-[768px]"
                }`}
              >
                {/* Device frame */}
                <div className="h-8 bg-black/20 flex items-center justify-center">
                  <div className="w-20 h-1 bg-muted rounded-full" />
                </div>

                {/* Screen content */}
                <div
                  className="w-full flex-1 relative"
                  style={{
                    background: currentScreen?.thumbnail,
                    height:
                      device === "mobile"
                        ? "calc(100% - 32px)"
                        : "calc(100% - 32px)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/80 text-center">
                      <h2 className="text-2xl font-bold mb-2">
                        {currentScreen?.name}
                      </h2>
                      <p className="text-sm opacity-60">
                        Click hotspots to navigate
                      </p>
                    </div>
                  </div>

                  {/* Interactive hotspots */}
                  {currentScreen?.links.map((link) => (
                    <button
                      key={link.id}
                      className="absolute bg-skai-green/20 hover:bg-skai-green/40 border-2 border-skai-green border-dashed rounded-lg transition-all flex items-center justify-center group"
                      style={{
                        left: `${link.hotspot.x}%`,
                        top: `${link.hotspot.y}%`,
                        width: `${link.hotspot.width}%`,
                        height: `${link.hotspot.height}%`,
                      }}
                      onClick={() => navigateToScreen(link.targetScreenId)}
                    >
                      <ArrowRight className="w-6 h-6 text-skai-green opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Screen Details */}
        {viewMode === "edit" && selectedScreen && (
          <div className="w-80 border-l border-border p-4 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Screen Details</h3>
              <button
                onClick={() => setSelectedScreen(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(() => {
              const screen = screens.find((s) => s.id === selectedScreen);
              if (!screen) return null;

              return (
                <>
                  <div className="mb-4">
                    <label className="text-xs text-muted-foreground">
                      Name
                    </label>
                    <input
                      type="text"
                      value={screen.name}
                      className="w-full px-3 py-2 bg-muted rounded-lg border border-border mt-1"
                      readOnly
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-xs text-muted-foreground">
                      Links ({screen.links.length})
                    </label>
                    <div className="space-y-2 mt-2">
                      {screen.links.map((link) => {
                        const target = screens.find(
                          (s) => s.id === link.targetScreenId,
                        );
                        return (
                          <div
                            key={link.id}
                            className="flex items-center gap-2 p-2 bg-muted rounded"
                          >
                            <Link2 className="w-4 h-4 text-skai-green" />
                            <span className="flex-1 text-sm">
                              {target?.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {link.animation}
                            </Badge>
                          </div>
                        );
                      })}
                      {screen.links.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No links yet
                        </p>
                      )}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Hotspot Link
                  </Button>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar (Preview Mode) */}
      {viewMode === "preview" && (
        <div className="h-14 border-t border-border flex items-center justify-center gap-4 bg-card">
          <Button variant="outline" size="sm" onClick={resetFlow}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <div className="h-6 w-px bg-border" />
          <Button
            variant="outline"
            size="sm"
            onClick={goBack}
            disabled={historyIndex === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className={isPlaying ? "bg-red-500 hover:bg-red-600" : ""}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Path:</span>
            {history.slice(0, historyIndex + 1).map((screenId, i) => {
              const screen = screens.find((s) => s.id === screenId);
              return (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span
                    className={
                      i === historyIndex ? "text-skai-green font-medium" : ""
                    }
                  >
                    {screen?.name}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
          <div className="h-6 w-px bg-border" />
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4 mr-1" />
            Fullscreen
          </Button>
        </div>
      )}
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Prototype Mode",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Prototype Mode

Create interactive prototypes by linking screens:
- **Flow Editor** - Visual canvas with drag-and-drop screens
- **Hotspot Links** - Define clickable areas with transitions
- **Preview Mode** - Navigate through prototype like a user
- **Device Preview** - Test on desktop and mobile sizes
- **History Navigation** - Go back/forward through flow

Perfect for:
- User flow validation
- Stakeholder presentations
- Usability testing
- Design handoff
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const FlowEditor: Story = {
  name: "🔗 Prototype Flow",
  render: () => <PrototypeMode />,
};
