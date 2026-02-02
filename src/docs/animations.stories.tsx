import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  durations,
  easings,
  useReducedMotion,
  FadeIn,
  SlideIn,
  Stagger,
  Pulse,
  Spin,
  Float,
  Shake,
  ScaleOnInteract,
  NumberTicker,
  GradientText,
  Collapse,
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
        <h2 className="mb-4 text-2xl font-semibold">Duration Scale</h2>
        <p className="mb-6 text-muted-foreground">
          Consistent timing for animations across the design system.
        </p>
        <div className="space-y-4">
          {Object.entries(durations).map(([name, ms]) => (
            <div key={name} className="flex items-center gap-4">
              <span className="w-24 font-mono text-sm">{name}</span>
              <span className="w-16 text-sm text-muted-foreground">{ms}ms</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
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

      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-2 font-semibold">Usage Guidelines</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <strong>instant (0ms)</strong> - Immediate feedback, disabled animations
          </li>
          <li>
            <strong>fast (150ms)</strong> - Hover states, micro-interactions
          </li>
          <li>
            <strong>normal (300ms)</strong> - Standard transitions, modals
          </li>
          <li>
            <strong>slow (500ms)</strong> - Complex animations, page transitions
          </li>
          <li>
            <strong>slower (700ms)</strong> - Dramatic reveals, onboarding
          </li>
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
        <div className="flex items-center justify-between">
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
              <span className="w-24 font-mono text-sm">{name}</span>
              <div className="relative h-10 flex-1 overflow-hidden rounded-lg bg-muted">
                <div
                  className="absolute bottom-1 top-1 w-8 rounded bg-primary"
                  style={{
                    left: animate ? "calc(100% - 36px)" : "4px",
                    transition: `left 1000ms ${curve}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-card p-4 font-mono text-xs">
          <p className="mb-2 text-muted-foreground">Example CSS:</p>
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Fade In</h2>
          <Button onClick={() => setKey((k) => k + 1)}>Replay</Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4" key={key}>
          {(["up", "down", "left", "right"] as const).map((direction, i) => (
            <FadeIn key={direction} direction={direction} delay={i * 100}>
              <div className="rounded-lg border bg-card p-6 text-center">
                <p className="font-medium">Fade {direction}</p>
                <p className="text-sm text-muted-foreground">delay: {i * 100}ms</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="rounded-lg bg-muted p-4 font-mono text-sm">
          <p className="mb-2 text-muted-foreground">Usage:</p>
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Slide In</h2>
          <Button onClick={() => setKey((k) => k + 1)}>Replay</Button>
        </div>

        <div className="grid grid-cols-2 gap-4" key={key}>
          {(["left", "right", "top", "bottom"] as const).map((direction, i) => (
            <SlideIn key={direction} direction={direction} delay={i * 100}>
              <div className="rounded-lg border bg-card p-6 text-center">
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
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Scale on Interact</h2>
          <p className="text-muted-foreground">Hover or tap to see effect</p>
        </div>

        <div className="flex justify-center gap-8">
          <ScaleOnInteract scale={1.1}>
            <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg bg-primary">
              <span className="font-semibold text-primary-foreground">Hover</span>
            </div>
          </ScaleOnInteract>
          <ScaleOnInteract scale={0.95}>
            <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg bg-secondary">
              <span className="font-semibold text-secondary-foreground">Press</span>
            </div>
          </ScaleOnInteract>
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Staggered Animation</h2>
          <Button onClick={() => setKey((k) => k + 1)}>Replay</Button>
        </div>

        <Stagger key={key} staggerDelay={80}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="mb-2 rounded-lg border bg-card p-4">
              List Item {item}
            </div>
          ))}
        </Stagger>

        <div className="rounded-lg bg-muted p-4 font-mono text-sm">
          <pre>{`<Stagger staggerDelay={80}>
  {items.map(item => (
    <Card key={item.id}>{item.content}</Card>
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

      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="flex flex-col items-center gap-4">
          <Pulse>
            <div className="h-16 w-16 rounded-full bg-green-500" />
          </Pulse>
          <span className="text-sm">Pulse</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div
            className="animate-shimmer h-16 w-32 rounded-lg bg-gradient-to-r from-muted via-muted-foreground/10 to-muted"
            style={{ backgroundSize: "200% 100%" }}
          />
          <span className="text-sm">Shimmer</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Shake trigger>
            <div className="h-12 w-12 rounded-lg bg-primary" />
          </Shake>
          <span className="text-sm">Shake</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Spin>
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent" />
          </Spin>
          <span className="text-sm">Spin</span>
        </div>
      </div>

      <div className="flex justify-center">
        <Float>
          <div className="rounded-lg border bg-card p-4 shadow-lg">
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

        <div
          className={`rounded-lg border p-6 ${reducedMotion ? "border-yellow-500/30 bg-yellow-500/10" : "bg-card"}`}
        >
          <p className="mb-2 font-semibold">
            {reducedMotion ? "⚠️ Reduced Motion Enabled" : "✓ Animations Enabled"}
          </p>
          <p className="text-sm text-muted-foreground">
            {reducedMotion
              ? "User prefers reduced motion. All SKAI animations respect this preference automatically."
              : "System allows animations. Toggle in OS accessibility settings to test."}
          </p>
        </div>

        <div className="rounded-lg bg-muted p-4 font-mono text-sm">
          <p className="mb-2 text-muted-foreground">Usage in components:</p>
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
