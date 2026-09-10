/**
 * A slider has to show how far along it is, which needs two colours.
 *
 * The stock shadcn markup paints the Track `bg-secondary` and the Range
 * `bg-primary`. In the dark theme this package ships — and in the consuming
 * app's own `src/index.css`, measured — `--secondary` and `--primary` are the
 * same triple, `160 84% 55%`. Two identical colours means the unfilled track is
 * drawn in the fill colour end to end, so every slider reads as maxed out at
 * any thumb position. That is what "the fill runs past the thumb" is.
 *
 * `--secondary` cannot be moved from here: it also paints the Badge and Button
 * "secondary" variants across the app, so it is a palette decision, not a
 * slider one. What this component owes instead is a track that does not depend
 * on `--secondary` at all.
 *
 * Both assertions matter. The first pins the two roles apart; the second stops
 * them being pinned apart by two names for one colour, which is exactly how the
 * defect arrived.
 */

import { render } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Slider } from "./slider";

beforeAll(() => {
  // Radix Slider reaches for ResizeObserver through @radix-ui/react-use-size;
  // jsdom has none. Same shim as slider-thumbs.test.tsx.
  (global as unknown as { ResizeObserver: unknown }).ResizeObserver =
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
});

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE_CSS = fs.readFileSync(
  path.join(HERE, "..", "..", "styles", "base.css"),
  "utf8",
);

/** The `bg-<token>` utility an element carries, without any opacity modifier. */
function bgToken(el: Element): string | undefined {
  return el.className
    .split(/\s+/)
    .find((c) => c.startsWith("bg-"))
    ?.replace(/^bg-/, "")
    .split("/")[0];
}

/** The dark-theme value of a CSS custom property, as authored in base.css. */
function darkTheme(variable: string): string {
  const dark = BASE_CSS.slice(0, BASE_CSS.indexOf(".light"));
  const hit = dark.match(new RegExp(`--${variable}:\\s*([^;]+);`));
  if (!hit) throw new Error(`--${variable} is not declared in base.css`);
  return hit[1].trim();
}

function renderSlider() {
  const { container } = render(
    <Slider defaultValue={[25]} min={0} max={100} aria-label="Volume" />,
  );
  const track = container.querySelector("[data-orientation] > span");
  const range = track?.firstElementChild;
  if (!track || !range) throw new Error("slider did not render a track + range");
  return { track, range };
}

describe("Slider — the unfilled track has to differ from the fill", () => {
  it("keeps the fill on --primary and the track off --secondary", () => {
    const { track, range } = renderSlider();
    expect(bgToken(range)).toBe("primary");
    expect(bgToken(track)).not.toBe("secondary");
  });

  it("picks a track token the dark theme keeps distinct from the fill", () => {
    const { track, range } = renderSlider();
    const trackToken = bgToken(track);
    const rangeToken = bgToken(range);
    expect(trackToken).toBeDefined();
    expect(darkTheme(trackToken as string)).not.toBe(darkTheme(rangeToken as string));
  });

  it("still shows the collapse this guards against, so the guard is live", () => {
    // If these two ever separate, the original bug is gone and the second
    // assertion above stops proving anything — worth knowing rather than
    // discovering through a silently weakened test.
    expect(darkTheme("secondary")).toBe(darkTheme("primary"));
  });
});
