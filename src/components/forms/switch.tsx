import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";

/**
 * The checked track, and why there is a choice to make.
 *
 * `bg-primary` is faithful to THIS package: design-tokens.css sets
 * `--primary: 200 90% 65%`, the Sky Blue #56C7F3 the Figma component draws, so
 * the toggle is blue in Storybook. The main app redefines the same variable —
 * `src/index.css:502`, `--primary: 160 84% 55%`, Alien Green #2DEDAD — so the
 * identical component renders green there. Nobody changed the switch; the token
 * under it means something different in each surface.
 *
 * `sky` pins the sampled value instead of resolving a variable, so it is the
 * same colour wherever it is mounted. Reports 4cbb5583 and 91a0a43a are the
 * Predict settings panels, which opt in.
 *
 * The default stays `bg-primary` deliberately: flipping it would repaint every
 * toggle in the app, the wallet and command in one commit. Whether the app's
 * `--primary` should be green at all is a separate question, and a bigger one.
 */
const CHECKED_TRACK = {
  primary: "data-[state=checked]:bg-primary",
  sky: "data-[state=checked]:bg-[#56C7F3]",
} as const;

export type SwitchVariant = keyof typeof CHECKED_TRACK;

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & { variant?: SwitchVariant }
>(({ className, variant = "primary", ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
      CHECKED_TRACK[variant],
      className,
    )}
    {...props}
    ref={ref}
  >
    {/* THUMB IS WHITE IN BOTH STATES, and that is measured, not assumed.
        Figma component `input/toggle`, sampled off two exported instances in
        file M6r9FEn042UWTQD1zvy6GM:
          9065:1464 (on)  — track #56C7F3, knob #FFFFFF
          9062:17780 (off) — track #95A09F, knob #FFFFFF
        It shipped `bg-background`, which under the dark theme
        (--background: 173 100% 4%) is a near-black #001512 knob: on the
        unchecked track it was all but invisible, and on the checked track it
        read as a hole punched in the accent rather than a knob sitting on it.
        `bg-white` is the `white` token (coreColors.white = #FFFFFF), so it is
        theme-invariant the way the frame is — in the light theme it moves the
        knob #FFFFEE -> #FFFFFF, which is imperceptible.

        NOT changed here, deliberately, because the frame disagrees with the
        code in two more ways that no report covers and that would move ~171
        consuming files at once:
          - the UNCHECKED track. Figma #95A09F, which is exactly this package's
            `ash` token (neutralColors.ash); the code uses `bg-input`, a dark
            teal. `bg-ash` is a one-word fix when someone owns that change.
          - the size. Figma draws 38x21 with a ~19px knob; this is 44x24 with a
            20px knob (h-6 w-11), ~15% larger, and the 44px width is also the
            mobile minimum-hit-target the app's index.css enforces. */}
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 motion-reduce:transition-none",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
