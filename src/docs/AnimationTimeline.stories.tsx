import { useState, useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  ChevronDown,
  Clock,
  Zap,
  Code,
  Eye,
} from "lucide-react";

const meta: Meta = {
  title: "Tools/Animation Timeline Editor",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Visual keyframe editor for creating and editing CSS animations.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface Keyframe {
  id: string;
  time: number; // percentage 0-100
  properties: Record<string, string | number>;
}

interface Animation {
  id: string;
  name: string;
  duration: number; // ms
  easing: string;
  iterations: number | "infinite";
  direction: "normal" | "reverse" | "alternate" | "alternate-reverse";
  keyframes: Keyframe[];
  expanded: boolean;
}

const easingOptions = [
  "linear",
  "ease",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "cubic-bezier(0.4, 0, 0.2, 1)",
  "cubic-bezier(0.4, 0, 1, 1)",
  "cubic-bezier(0, 0, 0.2, 1)",
];

const propertyPresets: Record<
  string,
  { label: string; defaultValue: string | number }[]
> = {
  transform: [
    { label: "translateX", defaultValue: "0px" },
    { label: "translateY", defaultValue: "0px" },
    { label: "scale", defaultValue: 1 },
    { label: "rotate", defaultValue: "0deg" },
  ],
  opacity: [{ label: "opacity", defaultValue: 1 }],
  colors: [
    { label: "backgroundColor", defaultValue: "#3B82F6" },
    { label: "borderColor", defaultValue: "#3B82F6" },
    { label: "color", defaultValue: "#ffffff" },
  ],
  dimensions: [
    { label: "width", defaultValue: "100px" },
    { label: "height", defaultValue: "100px" },
  ],
};

const presetAnimations: Animation[] = [
  {
    id: "fade-in",
    name: "Fade In",
    duration: 300,
    easing: "ease-out",
    iterations: 1,
    direction: "normal",
    expanded: false,
    keyframes: [
      { id: "k1", time: 0, properties: { opacity: 0 } },
      { id: "k2", time: 100, properties: { opacity: 1 } },
    ],
  },
  {
    id: "slide-up",
    name: "Slide Up",
    duration: 400,
    easing: "cubic-bezier(0, 0, 0.2, 1)",
    iterations: 1,
    direction: "normal",
    expanded: false,
    keyframes: [
      {
        id: "k1",
        time: 0,
        properties: { opacity: 0, transform: "translateY(20px)" },
      },
      {
        id: "k2",
        time: 100,
        properties: { opacity: 1, transform: "translateY(0)" },
      },
    ],
  },
  {
    id: "pulse",
    name: "Pulse",
    duration: 1000,
    easing: "ease-in-out",
    iterations: "infinite",
    direction: "alternate",
    expanded: false,
    keyframes: [
      { id: "k1", time: 0, properties: { transform: "scale(1)" } },
      { id: "k2", time: 100, properties: { transform: "scale(1.05)" } },
    ],
  },
  {
    id: "bounce",
    name: "Bounce",
    duration: 600,
    easing: "ease",
    iterations: 1,
    direction: "normal",
    expanded: false,
    keyframes: [
      { id: "k1", time: 0, properties: { transform: "translateY(0)" } },
      { id: "k2", time: 40, properties: { transform: "translateY(-30px)" } },
      { id: "k3", time: 60, properties: { transform: "translateY(-15px)" } },
      { id: "k4", time: 80, properties: { transform: "translateY(-5px)" } },
      { id: "k5", time: 100, properties: { transform: "translateY(0)" } },
    ],
  },
];

export const Editor: Story = {
  render: () => {
    const [animations, setAnimations] = useState<Animation[]>(presetAnimations);
    const [selectedAnimation, setSelectedAnimation] = useState<string>(
      animations[0].id,
    );
    const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(
      null,
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [playProgress, setPlayProgress] = useState(0);
    const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    const currentAnimation = animations.find((a) => a.id === selectedAnimation);
    const currentKeyframe = currentAnimation?.keyframes.find(
      (k) => k.id === selectedKeyframe,
    );

    // Play animation - use selectedAnimation as dependency (string) instead of currentAnimation object
    useEffect(() => {
      const animation = animations.find((a) => a.id === selectedAnimation);
      if (!isPlaying || !animation) return;

      const duration = animation.duration;
      startTimeRef.current = performance.now();

      const animate = (time: number) => {
        const elapsed = time - startTimeRef.current;
        const progress = (elapsed / duration) * 100;

        if (progress >= 100) {
          if (
            animation.iterations === "infinite" ||
            (typeof animation.iterations === "number" &&
              animation.iterations > 1)
          ) {
            startTimeRef.current = time;
            setPlayProgress(0);
          } else {
            setIsPlaying(false);
            setPlayProgress(100);
            return;
          }
        } else {
          setPlayProgress(progress);
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [isPlaying, selectedAnimation, animations]);

    const togglePlay = () => {
      if (isPlaying) {
        setIsPlaying(false);
      } else {
        if (playProgress >= 100) setPlayProgress(0);
        setIsPlaying(true);
      }
    };

    const reset = () => {
      setIsPlaying(false);
      setPlayProgress(0);
    };

    const addKeyframe = (animationId: string) => {
      setAnimations(
        animations.map((a) => {
          if (a.id !== animationId) return a;
          const lastKeyframe = a.keyframes[a.keyframes.length - 1];
          const newTime = Math.min((lastKeyframe?.time || 0) + 25, 100);
          return {
            ...a,
            keyframes: [
              ...a.keyframes,
              {
                id: `k${Date.now()}`,
                time: newTime,
                properties: lastKeyframe?.properties
                  ? { ...lastKeyframe.properties }
                  : {},
              },
            ].sort((a, b) => a.time - b.time),
          };
        }),
      );
    };

    const updateKeyframe = (
      animationId: string,
      keyframeId: string,
      updates: Partial<Keyframe>,
    ) => {
      setAnimations(
        animations.map((a) => {
          if (a.id !== animationId) return a;
          return {
            ...a,
            keyframes: a.keyframes
              .map((k) => (k.id === keyframeId ? { ...k, ...updates } : k))
              .sort((a, b) => a.time - b.time),
          };
        }),
      );
    };

    const deleteKeyframe = (animationId: string, keyframeId: string) => {
      setAnimations(
        animations.map((a) => {
          if (a.id !== animationId) return a;
          return {
            ...a,
            keyframes: a.keyframes.filter((k) => k.id !== keyframeId),
          };
        }),
      );
      if (selectedKeyframe === keyframeId) setSelectedKeyframe(null);
    };

    const updateAnimation = (
      animationId: string,
      updates: Partial<Animation>,
    ) => {
      setAnimations(
        animations.map((a) =>
          a.id === animationId ? { ...a, ...updates } : a,
        ),
      );
    };

    const addAnimation = () => {
      const newAnim: Animation = {
        id: `anim-${Date.now()}`,
        name: "New Animation",
        duration: 300,
        easing: "ease",
        iterations: 1,
        direction: "normal",
        expanded: true,
        keyframes: [
          { id: "k1", time: 0, properties: { opacity: 0 } },
          { id: "k2", time: 100, properties: { opacity: 1 } },
        ],
      };
      setAnimations([...animations, newAnim]);
      setSelectedAnimation(newAnim.id);
    };

    const generateCSS = (): string => {
      if (!currentAnimation) return "";

      const keyframesCSS = currentAnimation.keyframes
        .map(
          (kf) =>
            `  ${kf.time}% {\n${Object.entries(kf.properties)
              .map(
                ([prop, val]) =>
                  `    ${prop.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${val};`,
              )
              .join("\n")}\n  }`,
        )
        .join("\n");

      return `@keyframes ${currentAnimation.name.toLowerCase().replace(/\s+/g, "-")} {
${keyframesCSS}
}

.${currentAnimation.name.toLowerCase().replace(/\s+/g, "-")} {
  animation: ${currentAnimation.name.toLowerCase().replace(/\s+/g, "-")} ${currentAnimation.duration}ms ${currentAnimation.easing} ${currentAnimation.iterations === "infinite" ? "infinite" : currentAnimation.iterations} ${currentAnimation.direction};
}`;
    };

    // Calculate interpolated style at current progress
    const getInterpolatedStyle = (): React.CSSProperties => {
      if (!currentAnimation || currentAnimation.keyframes.length < 2) return {};

      const sortedKeyframes = [...currentAnimation.keyframes].sort(
        (a, b) => a.time - b.time,
      );
      let prevKf = sortedKeyframes[0];
      let nextKf = sortedKeyframes[sortedKeyframes.length - 1];

      for (let i = 0; i < sortedKeyframes.length - 1; i++) {
        if (
          playProgress >= sortedKeyframes[i].time &&
          playProgress <= sortedKeyframes[i + 1].time
        ) {
          prevKf = sortedKeyframes[i];
          nextKf = sortedKeyframes[i + 1];
          break;
        }
      }

      // Simple linear interpolation for opacity
      const t = (playProgress - prevKf.time) / (nextKf.time - prevKf.time || 1);
      const style: React.CSSProperties = {};

      // Copy transform and other properties from the nearest keyframe
      const nearestKf = t < 0.5 ? prevKf : nextKf;
      Object.entries(nearestKf.properties).forEach(([key, value]) => {
        if (key === "opacity") {
          const prevOpacity = Number(prevKf.properties.opacity ?? 1);
          const nextOpacity = Number(nextKf.properties.opacity ?? 1);
          (style as Record<string, unknown>)[key] =
            prevOpacity + (nextOpacity - prevOpacity) * t;
        } else {
          (style as Record<string, unknown>)[key] = value;
        }
      });

      return style;
    };

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Animation Timeline Editor</h1>
                <p className="text-sm text-muted-foreground">
                  Create and edit CSS keyframe animations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg overflow-hidden border border-border">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${
                    viewMode === "preview"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode("code")}
                  className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${
                    viewMode === "code"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  Code
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Animation List Sidebar */}
          <div className="w-64 border-r border-border p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">Animations</h2>
              <button
                onClick={addAnimation}
                className="p-1.5 rounded hover:bg-muted"
                title="Add animation"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {animations.map((anim) => (
                <button
                  key={anim.id}
                  onClick={() => {
                    setSelectedAnimation(anim.id);
                    setSelectedKeyframe(null);
                    reset();
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    selectedAnimation === anim.id
                      ? "bg-primary/10 border border-primary/50"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{anim.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {anim.duration}ms
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {anim.keyframes.length} keyframes · {anim.easing}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Preview / Code Area */}
            <div className="flex-1 p-6 bg-muted/30">
              {viewMode === "preview" ? (
                <div className="h-full flex items-center justify-center">
                  <div className="relative">
                    {/* Preview Element */}
                    <div
                      className="w-32 h-32 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl"
                      style={getInterpolatedStyle()}
                    />
                    {/* Playback indicator */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                      {Math.round(playProgress)}%
                    </div>
                  </div>
                </div>
              ) : (
                <pre className="h-full p-4 bg-card border border-border rounded-lg overflow-auto text-sm font-mono">
                  {generateCSS()}
                </pre>
              )}
            </div>

            {/* Timeline */}
            <div className="border-t border-border p-4">
              {/* Playback Controls */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause animation" : "Play animation"}
                  className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={reset}
                  aria-label="Reset animation"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={playProgress}
                    onChange={(e) => {
                      setIsPlaying(false);
                      setPlayProgress(Number(e.target.value));
                    }}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={currentAnimation?.duration || 300}
                    onChange={(e) =>
                      updateAnimation(selectedAnimation, {
                        duration: Number(e.target.value),
                      })
                    }
                    className="w-20 px-2 py-1 bg-muted rounded text-center"
                  />
                  <span className="text-muted-foreground">ms</span>
                </div>
              </div>

              {/* Keyframe Timeline */}
              <div className="relative h-16 bg-muted/50 rounded-lg overflow-hidden">
                {/* Timeline markers */}
                <div className="absolute inset-0 flex">
                  {[0, 25, 50, 75, 100].map((mark) => (
                    <div
                      key={mark}
                      className="flex-1 border-l border-border/50 first:border-l-0"
                    >
                      <span className="text-[10px] text-muted-foreground ml-1">
                        {mark}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                  style={{ left: `${playProgress}%` }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
                </div>

                {/* Keyframes */}
                {currentAnimation?.keyframes.map((kf) => (
                  <button
                    key={kf.id}
                    onClick={() => setSelectedKeyframe(kf.id)}
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-transform hover:scale-125 ${
                      selectedKeyframe === kf.id
                        ? "bg-primary border-primary-foreground"
                        : "bg-card border-primary"
                    }`}
                    style={{ left: `calc(${kf.time}% - 8px)` }}
                  />
                ))}
              </div>

              {/* Add Keyframe */}
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => addKeyframe(selectedAnimation)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-3 h-3" />
                  Add Keyframe
                </button>
                <select
                  value={currentAnimation?.easing || "ease"}
                  onChange={(e) =>
                    updateAnimation(selectedAnimation, {
                      easing: e.target.value,
                    })
                  }
                  className="text-xs bg-muted px-2 py-1 rounded"
                >
                  {easingOptions.map((easing) => (
                    <option key={easing} value={easing}>
                      {easing}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Keyframe Properties */}
            {selectedKeyframe && currentKeyframe && (
              <div className="border-t border-border p-4 bg-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm">
                    Keyframe at {currentKeyframe.time}%
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={currentKeyframe.time}
                      onChange={(e) =>
                        updateKeyframe(selectedAnimation, selectedKeyframe, {
                          time: Number(e.target.value),
                        })
                      }
                      className="w-16 px-2 py-1 bg-muted rounded text-sm text-center"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                    <button
                      onClick={() =>
                        deleteKeyframe(selectedAnimation, selectedKeyframe)
                      }
                      className="p-1 rounded hover:bg-destructive/20 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(currentKeyframe.properties).map(
                    ([prop, value]) => (
                      <div key={prop} className="flex items-center gap-2">
                        <label className="text-xs text-muted-foreground min-w-[80px]">
                          {prop}
                        </label>
                        <input
                          type="text"
                          value={String(value)}
                          onChange={(e) => {
                            const newProps = {
                              ...currentKeyframe.properties,
                              [prop]: e.target.value,
                            };
                            updateKeyframe(
                              selectedAnimation,
                              selectedKeyframe,
                              { properties: newProps },
                            );
                          }}
                          className="flex-1 px-2 py-1 bg-muted rounded text-sm font-mono"
                        />
                      </div>
                    ),
                  )}
                </div>

                {/* Add Property */}
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">
                    Add property
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(propertyPresets).map(
                      ([category, props]) => (
                        <div key={category} className="relative group">
                          <button
                            className="px-2 py-1 text-xs bg-muted rounded hover:bg-muted/80 capitalize"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            {category}
                            <ChevronDown className="w-3 h-3 inline ml-1" />
                          </button>
                          <div
                            className="absolute bottom-full left-0 mb-1 hidden group-hover:block group-focus-within:block bg-card border border-border rounded-lg shadow-lg p-1 min-w-[120px] z-10"
                            role="menu"
                          >
                            {props.map((p) => (
                              <button
                                key={p.label}
                                role="menuitem"
                                onClick={() => {
                                  const newProps = {
                                    ...currentKeyframe.properties,
                                    [p.label]: p.defaultValue,
                                  };
                                  updateKeyframe(
                                    selectedAnimation,
                                    selectedKeyframe,
                                    { properties: newProps },
                                  );
                                }}
                                className="block w-full text-left px-2 py-1 text-xs rounded hover:bg-muted focus:bg-muted focus:outline-none"
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
};
