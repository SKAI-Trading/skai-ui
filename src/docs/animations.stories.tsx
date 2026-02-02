import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  durations,
  easings,
  useReducedMotion,
  FadeIn,
  SlideIn,
  ScaleIn,
  Stagger,
  StaggerItem,
  Pulse,
  Shimmer,
  Bounce,
  Spin,
  Float,
} from "../lib/animations";
import { Button } from "../components/core/button";

const meta: Meta = {
  title: "Design Tokens/Animation",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const DurationTokens: StoryObj = {
  name: "Duration Tokens",
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Duration Scale</h2>
        <p className="text-muted-foreground mb-6">
          Consistent timing for animations across the design system.
        </p>
        <div className="space-y-4">
          {Object.entries(durations).map(([name, ms]) => (
            <div key={name} className="flex items-center gap-4">
              <span className="w-24 text-sm font-mono">{name}</span>
              <span className="w-16 text-sm text-muted-foreground">{ms}ms</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${Math.min((ms / 700) * 100, 100)}%`,
                    transition: `width ${ms}ms ease`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-card rounded-lg border">
        <h3 className="font-semibold mb-2">Usage Guidelines</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li><strong>instant (0ms)</strong> - Immediate feedback, disabled animations</li>
          <li><strong>fast (150ms)</strong> - Hover states, micro-interactions</li>
          <li><strong>normal (300ms)</strong> - Standard transitions, modals</li>
          <li><strong>slow (500ms)</strong> - Complex animations, page transitions</li>
          <li><strong>slower (700ms)</strong> - Dramatic reveals, onboarding</li>
        </ul>
      </div>
    </div>
  ),
};

export const EasingFunctions: StoryObj = {
  name: "Easing Functions",
  render: () => {
    const [animate, setAnimate] = useState(false);

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Easing Functions</h2>
            <p className="text-muted-foreground">
              Compare different easing curves side by side
            </p>
          </div>
          <Button onClick={() => setAnimate(!animate)}>
            {animate ? "Reset" : "Animate"}
          </Button>
        </div>

        <div className="space-y-4">
          {Object.entries(easings).map(([name, curve]) => (
            <div key={name} className="flex items-center gap-4">
              <span className="w-24 text-sm font-mono">{name}</span>
              <div className="flex-1 h-10 bg-muted rounded-lg relative overflow-hidden">
                <div
                  className="absolute top-1 bottom-1 w-8 bg-primary rounded"
                  style={{
                    left: animate ? "calc(100% - 36px)" : "4px",
                    transition: `left 1000ms ${curve}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-card rounded-lg border font-mono text-xs">
          <p className="text-muted-foreground mb-2">Example CSS:</p>
          <code>transition: transform 300ms {easings.ease};</code>
        </div>
      </div>
    );
  },
};

export const FadeAnimations: StoryObj = {
  name: "Fade Animations",
  render: () => {
    const [key, setKey] = useState(0);

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Fade In</h2>
          <Button onClick={() => setKey((k) => k + 1)}>Replay</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" key={key}>
          {(["up", "down", "left", "right"] as const).map((direction, i) => (
            <FadeIn key={direction} direction={direction} delay={i * 100}>
              <div className="p-6 bg-card rounded-lg border text-center">
                <p className="font-medium">Fade {direction}</p>
                <p className="text-sm text-muted-foreground">delay: {i * 100}ms</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p className="text-muted-foreground mb-2">Usage:</p>
          <code>{`<FadeIn direction="up" delay={100}>`}</code>
        </div>
      </div>
    );
  },
};

export const SlideAnimations: StoryObj = {
  name: "Slide Animations",
  render: () => {
    const [key, setKey] = useState(0);

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Slide In</h2>
          <Button onClick={() => setKey((k) => k + 1)}>Replay</Button>
        </div>

        <div className="grid grid-cols-2 gap-4" key={key}>
          {(["left", "right", "top", "bottom"] as const).map((direction, i) => (
            <SlideIn key={direction} direction={direction} delay={i * 100}>
              <div className="p-6 bg-card rounded-lg border text-center">
                <p className="font-medium">Slide from {direction}</p>
              </div>
            </SlideIn>
          ))}
        </div>
      </div>
    );
  },
};

export const ScaleAnimations: StoryObj = {
  name: "Scale Animations",
  render: () => {
    const [key, setKey] = useState(0);

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Scale In</h2>
          <Button onClick={() => setKey((k) => k + 1)}>Replay</Button>
        </div>

        <div className="flex gap-8 justify-center" key={key}>
          <ScaleIn>
            <div className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">Scale</span>
            </div>
          </ScaleIn>
        </div>
      </div>
    );
  },
};

export const StaggeredLists: StoryObj = {
  name: "Staggered Lists",
  render: () => {
    const [key, setKey] = useState(0);

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Staggered Animation</h2>
          <Button onClick={() => setKey((k) => k + 1)}>Replay</Button>
        </div>

        <Stagger key={key} staggerDelay={80}>
          {[1, 2, 3, 4, 5].map((item) => (
            <StaggerItem key={item}>
              <div className="p-4 bg-card rounded-lg border mb-2">
                List Item {item}
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <pre>{`<Stagger staggerDelay={80}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <Card>{item.content}</Card>
    </StaggerItem>
  ))}
</Stagger>`}</pre>
        </div>
      </div>
    );
  },
};

export const LoopingAnimations: StoryObj = {
  name: "Looping Animations",
  render: () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Continuous Animations</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center gap-4">
          <Pulse>
            <div className="w-16 h-16 bg-green-500 rounded-full" />
          </Pulse>
          <span className="text-sm">Pulse</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Shimmer className="w-32 h-16 rounded-lg" />
          <span className="text-sm">Shimmer</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Bounce>
            <div className="w-12 h-12 bg-primary rounded-lg" />
          </Bounce>
          <span className="text-sm">Bounce</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Spin>
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
          </Spin>
          <span className="text-sm">Spin</span>
        </div>
      </div>

      <div className="flex justify-center">
        <Float>
          <div className="p-4 bg-card rounded-lg border shadow-lg">
            Floating element
          </div>
        </Float>
      </div>
    </div>
  ),
};

export const ReducedMotion: StoryObj = {
  name: "Reduced Motion",
  render: () => {
    const reducedMotion = useReducedMotion();

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Accessibility: Reduced Motion</h2>

        <div className={`p-6 rounded-lg border ${reducedMotion ? "bg-yellow-500/10 border-yellow-500/30" : "bg-card"}`}>
          <p className="font-semibold mb-2">
            {reducedMotion ? "⚠️ Reduced Motion Enabled" : "✓ Animations Enabled"}
          </p>
          <p className="text-sm text-muted-foreground">
            {reducedMotion
              ? "User prefers reduced motion. All SKAI animations respect this preference automatically."
              : "System allows animations. Toggle in OS accessibility settings to test."}
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg font-mono text-sm">
          <p className="text-muted-foreground mb-2">Usage in components:</p>
          <pre>{`const reducedMotion = useReducedMotion();

return (
  <div style={{
    transition: reducedMotion ? 'none' : 'transform 300ms ease'
  }}>
    {children}
  </div>
);`}</pre>
        </div>
      </div>
    );
  },
};
