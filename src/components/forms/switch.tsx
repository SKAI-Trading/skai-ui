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
  primary: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  sky: "data-[state=checked]:bg-[#56C7F3] data-[state=unchecked]:bg-input",
  /* The web-app boards' own `input/toggle`: Sky Blue 300 checked and Green
     Coal 300 at rest, read off 7746:222510 on the spot Layout-settings panel.
     Both pinned, for the reason `sky` gives. */
  toggle: "data-[state=checked]:bg-[#56C7F3] data-[state=unchecked]:bg-[#001615]",
} as const;

export type SwitchVariant = keyof typeof CHECKED_TRACK;

/**
 * A control that cannot be used, drawn rather than left out — and why a bare
 * `disabled` does not draw it.
 *
 * This is a measurement, not a preference. Two of the three variants above
 * rest on `bg-input`, and the main app defines that token as `225 30% 15%`
 * (#1B2132, a navy) at src/index.css:540. Faded by the root's own
 * `disabled:opacity-50` over a dark SKAI surface — Green Coal 200 #122524,
 * which is what the Launch panels sit on — it composites to #17232B, which is
 * a contrast ratio of **1.00:1** against that surface. The track is not dim,
 * it is gone. All that survives is the white thumb, so the row reads as a
 * loose grey dot beside a label rather than as a switch at all. Reports
 * 27e85cd0 and 0935e238 both photograph it, and the launch tool worked around
 * the same thing by omitting the control entirely, which told its readers the
 * product had no such feature.
 *
 * The root already reserves the slot with `border-2 border-transparent`, so
 * naming a colour here draws the pill's outline and moves nothing else. Ash
 * #95A09F is the at-rest track the Figma `input/toggle` itself draws (sampled
 * on 9062:17780), so this is the frame's own off-state colour rather than a
 * new one; through `disabled:opacity-50` it lands at #536261 over #122524 —
 * 2.50:1, legible and still plainly inert.
 *
 * `bg-input` itself is left alone, deliberately. The fill is wrong on every
 * dark SKAI surface and not only these rows, but this package is also the
 * main app's, the wallet's and command's, so repainting the at-rest track
 * would move every toggle in all of them in one commit. Hence the opt-in
 * below: a caller that passes no reason renders exactly as it did before.
 */
const UNAVAILABLE_TRACK = "border-[#95a09f]";

/**
 * Track sizes. `default` is the 44x24 this shipped with: h-6 w-11, a 20 knob on
 * a 20 travel, and 44 is also the width the app's index.css floors touch
 * targets to below 768. `compact` is the `input/toggle` every web-app board
 * draws, 40.593x24 on a 2px pad, so the knob's travel is 40.59 - 4 - 20 =
 * 16.59; it carries `no-min-size` because the floor would otherwise stretch
 * the 24 to 44 through 768. The spot lane restated this box on its own mount
 * (LayoutSettingsDrawer) before it lived here; a consumer now asks for it by
 * name. The design-system file's toggle is a different 38x21, noted on the
 * thumb below; the app builds to the web-app boards.
 *
 * `stepped` is `compact` plus the step the boards take at 768, and it exists
 * because the boards draw ONE control at TWO boxes.
 *
 * Measured on the node rather than carried: the 375 Preferences board
 * 11881:94366 draws all twelve `input/toggle` instances at 40.592594x24
 * (11884:94598, :94612 ... :94638), and both 11846:355537 at 768 and
 * 5529:73628 at 1440 draw 60.888889x36 — exactly 1.5 times the first, on both
 * axes. So this is a size step at the 768 breakpoint, not two components, and
 * `md:` is Tailwind's default 768 with nothing overriding `screens`.
 *
 * Inside that box the component draws a ring, a track and a knob smaller than
 * the track. The first cut of this size kept `compact`'s 2px ring and read the
 * knob off the padding (a 32 at 768), but the ellipse on the node is 26, a 6px
 * miss you can see. Re-read 2026-10-04 on 11884:94598 / 11884:94612 (375) and
 * 11846:355537 / 11846:355570 (768; 5529:73628 / 5529:73723 at 1440 agree):
 *
 *            ring    track            knob    off x   on x   (inside the track)
 *   375      1.333   37.93 x 21.33    17.33   2.33    19
 *   768+     2       56.89 x 32       26      3       28
 *
 * The root's border is the ring, so the content box is the track and
 * `items-center` sets the knob 2 / 3 from its top, as drawn. Neither knob
 * carries an effect, so there is no shadow. The launch boards draw the same
 * component (11461:192414 at 375, 11461:193024 at 768).
 *
 * It is a THIRD size rather than a change to `compact` on purpose. Of the 241
 * `<Switch>` call sites outside node_modules, 11 ask for `compact` today —
 * eight in SettingsTab, one in PrivacySettingsCard, one in WalletCreateModal
 * and one in DiceGame — and the last two already scale themselves past 768 at
 * their own mounts. Stepping `compact` underneath them would scale those twice
 * and move the other nine without their asking. `no-min-size` carries over
 * unchanged: the floor runs to `max-width: 768px` inclusive and this rung is
 * 36 tall at exactly 768, so it is still needed there.
 */
const TRACK_SIZE = {
  default: {
    root: "h-6 w-11",
    thumb: "data-[state=checked]:translate-x-5",
  },
  compact: {
    root: "no-min-size h-6 w-[40.59px]",
    thumb: "data-[state=checked]:translate-x-[16.59px]",
  },
  stepped: {
    root: "no-min-size h-6 w-[40.59px] border-[1.333px] md:h-9 md:w-[60.889px] md:border-2",
    thumb:
      "size-[17.33px] shadow-none data-[state=unchecked]:translate-x-[2.33px] data-[state=checked]:translate-x-[19px] md:size-[26px] md:data-[state=unchecked]:translate-x-[3px] md:data-[state=checked]:translate-x-7",
  },
} as const;

/**
 * The ring's colour and the at-rest track, for `stepped` with `toggle` only.
 * The node's root is Green Coal 300, so on the Green Coal 300 cards the ring
 * disappears and the pill you see is the track: Sky Blue on, Ash off (the
 * 768 Off instance 11846:355570, photographed 2026-10-04). `toggle` alone
 * rests on Green Coal 300, which on those cards leaves a white dot and no
 * pill.
 *
 * Scoped to the pair because `toggle` at `compact` and `default` belongs to
 * other surfaces, whose own tests pin `data-[state=unchecked]:bg-[#001615]`.
 * Applied before UNAVAILABLE_TRACK, so an unavailable switch keeps its Ash
 * edge.
 */
const STEPPED_TOGGLE = "border-green-coal-300 data-[state=unchecked]:bg-ash";

export type SwitchSize = keyof typeof TRACK_SIZE;

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    variant?: SwitchVariant;
    size?: SwitchSize;
    /**
     * Why this control cannot be used. Passing it draws the switch as
     * unavailable (see UNAVAILABLE_TRACK) and makes it inert.
     *
     * A sentence rather than a boolean, because a control somebody cannot
     * work and is not told why about is the very thing this state exists to
     * replace — so there is no way to ask for it without supplying the
     * reason. A native disabled button is out of the tab order and `title`
     * reaches no keyboard or touch reader, so a caller should also put this
     * sentence on screen and point `aria-describedby` at it.
     */
    unavailable?: string;
  }
>(
  (
    { className, variant = "primary", size = "default", unavailable, ...props },
    ref,
  ) => {
    // Applied after the caller's props rather than merged into them: an
    // unavailable switch has to be inert whatever else was passed. Both
    // `disabled` and `aria-disabled`, because some readers skip a natively
    // disabled button without announcing it at all.
    const inert =
      unavailable === undefined
        ? {}
        : { disabled: true, "aria-disabled": true, title: unavailable };
    return (
      <SwitchPrimitives.Root
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
          TRACK_SIZE[size].root,
          CHECKED_TRACK[variant],
          size === "stepped" && variant === "toggle" ? STEPPED_TOGGLE : undefined,
          unavailable === undefined ? undefined : UNAVAILABLE_TRACK,
          className,
        )}
        {...props}
        {...inert}
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
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 motion-reduce:transition-none",
            TRACK_SIZE[size].thumb,
          )}
        />
      </SwitchPrimitives.Root>
    );
  },
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
