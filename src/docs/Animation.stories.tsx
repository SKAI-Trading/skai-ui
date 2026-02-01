import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { Progress } from "../components/progress";
import { Loader2, Check, ArrowRight, Zap, TrendingUp } from "lucide-react";

const meta: Meta = {
  title: "Design Tokens/Animation & Motion",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const TransitionDurations: StoryObj = {
  name: "Transition Durations",
  render: () => {
    const [active, setActive] = useState(false);

    return (
      <div className="p-8 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Animation & Motion</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Consistent timing and easing for smooth interactions.
          </p>

          <Button onClick={() => setActive(!active)} className="mb-8">
            Toggle Animations
          </Button>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Duration Scale</h2>
            <div className="space-y-4">
              {[
                {
                  name: "75ms",
                  class: "duration-75",
                  use: "Micro interactions",
                },
                { name: "100ms", class: "duration-100", use: "Quick feedback" },
                {
                  name: "150ms",
                  class: "duration-150",
                  use: "Buttons, toggles",
                },
                {
                  name: "200ms",
                  class: "duration-200",
                  use: "Default transitions",
                },
                {
                  name: "300ms",
                  class: "duration-300",
                  use: "Modals, dropdowns",
                },
                {
                  name: "500ms",
                  class: "duration-500",
                  use: "Page transitions",
                },
                {
                  name: "700ms",
                  class: "duration-700",
                  use: "Complex animations",
                },
                { name: "1000ms", class: "duration-1000", use: "Slow reveals" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <code className="w-20 text-sm font-mono">{item.name}</code>
                  <div className="flex-1 h-10 bg-muted rounded-lg overflow-hidden">
                    <div
                      className={`h-full bg-primary transition-all ${item.class} ease-out`}
                      style={{ width: active ? "100%" : "0%" }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-40">
                    {item.use}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Easing Functions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  name: "ease-linear",
                  desc: "Constant speed, mechanical feel",
                },
                { name: "ease-in", desc: "Slow start, fast end (exiting)" },
                { name: "ease-out", desc: "Fast start, slow end (entering)" },
                { name: "ease-in-out", desc: "Smooth start and end (default)" },
              ].map((ease) => (
                <Card key={ease.name}>
                  <CardContent className="p-4">
                    <code className="text-primary text-sm">{ease.name}</code>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      {ease.desc}
                    </p>
                    <div className="h-8 bg-muted rounded overflow-hidden">
                      <div
                        className={`h-full w-8 bg-primary transition-transform duration-500 ${ease.name}`}
                        style={{
                          transform: active
                            ? "translateX(calc(100% * 4))"
                            : "translateX(0)",
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  },
};

export const LoadingStates: StoryObj = {
  name: "Loading States",
  render: () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const interval = setInterval(() => setLoading((l) => !l), 3000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="p-8 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading States</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Spinner */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Spinner</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
              <div className="px-4 pb-4">
                <code className="text-xs text-muted-foreground">
                  animate-spin
                </code>
              </div>
            </Card>

            {/* Pulse */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pulse / Skeleton</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              </CardContent>
              <div className="px-4 pb-4">
                <code className="text-xs text-muted-foreground">
                  animate-pulse
                </code>
              </div>
            </Card>

            {/* Progress Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Progress Bar</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress
                  value={loading ? 33 : 100}
                  className="transition-all duration-500"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {loading ? "Loading..." : "Complete!"}
                </p>
              </CardContent>
            </Card>

            {/* Dots */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Bouncing Dots</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-32 gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </CardContent>
              <div className="px-4 pb-4">
                <code className="text-xs text-muted-foreground">
                  animate-bounce with stagger
                </code>
              </div>
            </Card>

            {/* Button Loading */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Button States</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button disabled className="w-full">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </Button>
                <Button className="w-full" variant="outline">
                  <Check className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              </CardContent>
            </Card>

            {/* Shimmer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Shimmer Effect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-hidden rounded-lg bg-muted h-20">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
                <style>{`
                  @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                `}</style>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  },
};

export const MicroInteractions: StoryObj = {
  name: "Micro Interactions",
  render: () => (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Micro Interactions</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Hover Scale */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Hover Scale</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <div className="p-4 bg-primary rounded-lg transition-transform duration-200 hover:scale-105 cursor-pointer">
                Hover me
              </div>
            </CardContent>
            <div className="px-4 pb-4">
              <code className="text-xs text-muted-foreground">
                hover:scale-105 transition-transform
              </code>
            </div>
          </Card>

          {/* Hover Lift */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Hover Lift (Shadow)</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <div className="p-4 bg-card border rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                Hover me
              </div>
            </CardContent>
            <div className="px-4 pb-4">
              <code className="text-xs text-muted-foreground">
                hover:shadow-lg hover:-translate-y-1
              </code>
            </div>
          </Card>

          {/* Active Press */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Press</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <button className="p-4 bg-primary text-primary-foreground rounded-lg transition-transform duration-100 active:scale-95">
                Click me
              </button>
            </CardContent>
            <div className="px-4 pb-4">
              <code className="text-xs text-muted-foreground">
                active:scale-95
              </code>
            </div>
          </Card>

          {/* Focus Ring */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Focus Ring</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <button className="p-4 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                Tab to me
              </button>
            </CardContent>
            <div className="px-4 pb-4">
              <code className="text-xs text-muted-foreground">
                focus:ring-2 focus:ring-primary
              </code>
            </div>
          </Card>

          {/* Icon Rotation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Icon Animation</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32 gap-4">
              <div className="p-3 bg-muted rounded-lg hover:bg-primary/20 transition-colors cursor-pointer group">
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="p-3 bg-muted rounded-lg hover:bg-primary/20 transition-colors cursor-pointer group">
                <Zap className="h-6 w-6 transition-transform group-hover:scale-110" />
              </div>
            </CardContent>
          </Card>

          {/* Badge Pulse */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Notification Pulse</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <div className="relative">
                <Button variant="outline">Notifications</Button>
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                  3
                </span>
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-ping" />
              </div>
            </CardContent>
            <div className="px-4 pb-4">
              <code className="text-xs text-muted-foreground">
                animate-ping for attention
              </code>
            </div>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const NumberAnimations: StoryObj = {
  name: "Number Animations",
  render: () => {
    const [value, setValue] = useState(0);
    const targetValue = 12345.67;

    useEffect(() => {
      const duration = 1500;
      const steps = 60;
      const stepValue = targetValue / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += stepValue;
        if (current >= targetValue) {
          setValue(targetValue);
          clearInterval(interval);
        } else {
          setValue(current);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="p-8 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Number & Value Animations</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Count Up */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Count Up Animation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold font-mono">
                  $
                  {value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Portfolio Value
                </p>
              </CardContent>
            </Card>

            {/* Price Flash */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Price Change Flash</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center p-4 rounded-lg transition-colors duration-300 bg-green-500/10">
                    <p className="text-2xl font-mono text-green-500">
                      $2,145.32
                    </p>
                    <div className="flex items-center justify-center gap-1 text-green-500">
                      <TrendingUp className="h-4 w-4" />
                      <span>+2.34%</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Flash green/red on price updates
                </p>
              </CardContent>
            </Card>

            {/* Progress Ring */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Circular Progress</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="relative h-32 w-32">
                  <svg className="h-full w-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${68 * 3.14} ${100 * 3.14}`}
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Animated Badge */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Status Transitions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 justify-center">
                <Badge className="transition-all duration-300 bg-yellow-500/10 text-yellow-500">
                  ● Pending
                </Badge>
                <Badge className="transition-all duration-300 bg-blue-500/10 text-blue-500">
                  ● Processing
                </Badge>
                <Badge className="transition-all duration-300 bg-green-500/10 text-green-500">
                  ● Complete
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Code Example */}
          <div className="mt-8 p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Animation Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">✓ Do</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Use 200-300ms for most transitions</li>
                  <li>• Use ease-out for entering elements</li>
                  <li>• Animate opacity + transform together</li>
                  <li>• Keep animations subtle and purposeful</li>
                  <li>• Provide visual feedback on interactions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">✗ Don't</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Don't animate layout properties (width/height)</li>
                  <li>• Don't use animations longer than 500ms</li>
                  <li>• Don't animate everything</li>
                  <li>• Don't block user interactions</li>
                  <li>• Don't forget reduced-motion preferences</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
