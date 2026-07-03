import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import {
  SKAI_BOLT_VIEWBOX,
  SKAI_BOLT_PATH_1,
  SKAI_BOLT_PATH_2,
  SKAI_BOLT_GRADIENT_FROM,
  SKAI_BOLT_GRADIENT_TO,
} from "../branding/skai-bolt-paths";

// =============================================================================
// SKAI LOADER
// =============================================================================
// Branded loading screen matching Figma "load effect" (nodes 2713:4119 desktop,
// 6393:53747 mobile): the gradient Skai bolt pulses and shimmers over the dark
// green-coal base with a soft green glow rising from the bottom.
//
// Animation lives in a component-scoped <style> block (precedent:
// MinimalPageSkeleton) so it never depends on Tailwind content-scanning, which
// has silently dropped classes in this repo before. All motion collapses to a
// static bolt under prefers-reduced-motion.
// =============================================================================

// Bolt height in px per size; width derives from the brand viewBox ratio.
const boltHeightMap = { md: 44, lg: 64 } as const;
const BOLT_ASPECT = 57.1 / 64;

const SkaiLoaderMark: React.FC<{ size: "md" | "lg" }> = ({ size }) => {
  // useId is SSR-safe and unique per instance; strip colons so the value is a
  // valid id for url(#...) fragment references inside the SVG.
  const uid = React.useId().replace(/:/g, "");
  const gradId = `${uid}-grad`;
  const clipId = `${uid}-clip`;
  const height = boltHeightMap[size];
  const width = height * BOLT_ASPECT;

  return (
    <svg
      width={width}
      height={height}
      viewBox={SKAI_BOLT_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="skai-loader__bolt block"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="57" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor={SKAI_BOLT_GRADIENT_FROM} />
          <stop offset="1" stopColor={SKAI_BOLT_GRADIENT_TO} />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={SKAI_BOLT_PATH_1} />
          <path d={SKAI_BOLT_PATH_2} />
        </clipPath>
      </defs>
      <path d={SKAI_BOLT_PATH_1} fill={`url(#${gradId})`} />
      <path d={SKAI_BOLT_PATH_2} fill={`url(#${gradId})`} />
      {/* Shimmer: a soft white band swept across the bolt, clipped to its shape. */}
      <g clipPath={`url(#${clipId})`}>
        <rect className="skai-loader__shimmer" x="-30" y="-12" width="22" height="88" fill="rgba(255,255,255,0.6)" />
      </g>
    </svg>
  );
};

const rootVariants = cva(
  "flex flex-col items-center justify-center gap-4 overflow-hidden",
  {
    variants: {
      fullScreen: {
        true: "fixed inset-0 z-50",
        false: "absolute inset-0",
      },
      background: {
        default: "bg-[#001615]",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: { fullScreen: false, background: "default" },
  },
);

export interface SkaiLoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof rootVariants> {
  /** Optional caption rendered under the bolt. Off by default (matches Figma). */
  message?: string;
  /** Bolt size: lg (64px, default, matches Figma) or md (44px, tighter regions). */
  size?: "md" | "lg";
  /** Accessible label for screen readers. */
  label?: string;
}

const SkaiLoader = React.forwardRef<HTMLDivElement, SkaiLoaderProps>(
  (
    { className, fullScreen, background, message, size = "lg", label = "Loading", ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        aria-live="polite"
        aria-label={label}
        className={cn(rootVariants({ fullScreen, background }), className)}
        {...props}
      >
        <style>{`
          @keyframes skai-loader-pulse {
            0%, 100% { transform: scale(1); opacity: 0.85; }
            50% { transform: scale(1.06); opacity: 1; }
          }
          @keyframes skai-loader-glow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.9; }
          }
          @keyframes skai-loader-shimmer {
            /* Fade the white band in as it enters the bolt and out as it leaves,
               so the very first/last frame (and any quick "loaded too fast"
               freeze-frame) never shows a hard white sliver at the bolt edge
               (bug 7e381d5a — "glitchy white pixel line"). */
            0% { transform: translateX(0) rotate(18deg); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateX(96px) rotate(18deg); opacity: 0; }
          }
          .skai-loader__bolt {
            animation: skai-loader-pulse 1.6s ease-in-out infinite;
            transform-origin: center;
            will-change: transform, opacity;
          }
          .skai-loader__shine {
            animation: skai-loader-glow 1.6s ease-in-out infinite;
          }
          .skai-loader__shimmer {
            animation: skai-loader-shimmer 1.4s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center;
            /* Hidden at rest so a first paint before the animation's first frame
               — and the static prefers-reduced-motion state below — never flash
               the white band as a stray line. */
            opacity: 0;
          }
          @media (prefers-reduced-motion: reduce) {
            .skai-loader__bolt,
            .skai-loader__shine,
            .skai-loader__shimmer {
              animation: none;
            }
          }
        `}</style>

        {background !== "transparent" && (
          <div
            aria-hidden="true"
            className="skai-loader__shine pointer-events-none absolute left-1/2 top-[70%] h-[180vw] max-h-[1800px] w-[180vw] max-w-[1800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(23,249,180,0.18), rgba(23,249,180,0.06) 45%, transparent 70%)",
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center gap-4">
          <SkaiLoaderMark size={size} />
          {message ? <p className="text-sm text-white/70">{message}</p> : null}
        </div>

        <span className="sr-only">{label}</span>
      </div>
    );
  },
);
SkaiLoader.displayName = "SkaiLoader";

export { SkaiLoader, rootVariants as skaiLoaderVariants };
