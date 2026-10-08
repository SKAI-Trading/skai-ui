import { cn } from "../../lib/utils";
import { skaiFontSizes } from "../../lib/design-tokens";

/**
 * Every class fieldTextSize can return, written out in full.
 *
 * Tailwind builds a class only when it finds it spelled out in a file it
 * scans, so a class put together at runtime is in nobody's stylesheet. The
 * app, launch, skai.trade, command and offer scan all of skai-ui's src; the
 * standalone wallet scans this file alone. Keep every class here a plain
 * string literal.
 *
 * The phone 16 is an arbitrary size rather than Tailwind's base size because
 * an arbitrary size sets the font size and nothing else. Whatever line height
 * the caller's classes put in force (a leading class, a size's `/` value or a
 * preset size's own, or the one the field inherits) still holds, so the box
 * keeps its height; the base size would replace it with 24px. The 16 itself
 * is iOS Safari's threshold: it zooms the page into a focused field whose
 * text is smaller.
 *
 * The comments in this file name no class, so a build that scans it adds
 * these and nothing else.
 */
export const FIELD_TEXT_SIZE = {
  /** The caller names no size: 16 below md, the frames' 14 from md up. */
  unsized: "text-base md:text-sm",
  /** The caller names a size under 16: 16 below md, the caller's own from md up. */
  phone: "max-md:text-[16px]",
  /** The same under an important caller size, which a plain one loses to. */
  phoneImportant: "max-md:!text-[16px]",
  /**
   * The caller names an `sm:` size under 16. Tailwind writes `max-md:` before
   * `sm:`, so the caller's `sm:` size would win from 640 to 767 without it.
   */
  smBand: "sm:max-md:text-[16px]",
  smBandImportant: "sm:max-md:!text-[16px]",
} as const;

/** Tailwind's own size scale in px. The preset's named sizes come from skaiFontSizes. */
const TAILWIND_TEXT_PX: Record<string, number> = {
  xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30,
  "4xl": 36, "5xl": 48, "6xl": 60, "7xl": 72, "8xl": 96, "9xl": 128,
};

function lengthPx(value: unknown): number | undefined {
  const m = /^(\d*\.?\d+)(px|rem)$/.exec(String(value ?? ""));
  if (!m) return undefined;
  return Number(m[1]) * (m[2] === "rem" ? 16 : 1);
}

/** The px a bare size class sets (Tailwind's scale, an arbitrary px or rem, a preset size), when it can be read. */
function textClassPx(sizeClass: string): number | undefined {
  const key = sizeClass.slice("text-".length);
  if (key.startsWith("[")) return lengthPx(key.slice(1, -1));
  if (key in TAILWIND_TEXT_PX) return TAILWIND_TEXT_PX[key];
  const token = (skaiFontSizes as Record<string, unknown>)[key];
  return lengthPx(Array.isArray(token) ? token[0] : token);
}

const isSize = (c: string) => cn("text-base", c) === c;

/**
 * The last size class `className` names under `variant` ("" for none, or
 * "sm:"), without the variant and with its `!` kept. The last one is the one
 * that wins.
 */
function lastSize(className: string | undefined, variant: "" | "sm:"): string | undefined {
  let last: string | undefined;
  for (const c of (className ?? "").split(/\s+/)) {
    if (!c.startsWith(variant)) continue;
    const own = c.slice(variant.length);
    const bare = own.replace(/^!/, "");
    if (bare !== "" && isSize(bare)) last = own;
  }
  return last;
}

/** Whether a size class is under 16px, or cannot be read here (a CSS variable, an `em`). */
function under16(sizeClass: string): boolean {
  const size = sizeClass.replace(/^!/, "").replace(/^(text-(?:\[[^\]]+\]|[^/\s]+))\/.+$/, "$1");
  const px = textClassPx(size);
  return px === undefined || px < 16;
}

/**
 * The text size classes a field adds under its caller's, so that it is never
 * under 16px below md and draws the frames' 14px from md up (Casey 2026-10-08
 * Q29, which takes back the phone half of 2026-10-05 #10; zoom is never
 * locked). A caller's own size holds from md up (#105).
 *
 * - No caller size: FIELD_TEXT_SIZE.unsized.
 * - A caller size under 16: FIELD_TEXT_SIZE.phone, or phoneImportant when the
 *   caller marks its size important with a leading `!`.
 * - A caller `sm:` size under 16: smBand (or smBandImportant) as well.
 * - A caller size of 16 or more: nothing.
 *
 * A caller that sets its own `max-md:` size replaces the 16, and is choosing
 * the zoom. Input, Textarea and PasswordInput apply this, and so does every
 * field built on them. A field on a raw element takes the same rule with
 * `cn(fieldTextSize(className), className)`.
 */
export function fieldTextSize(className?: string): string | undefined {
  const own = lastSize(className, "");
  const ownSm = lastSize(className, "sm:");
  const classes: string[] = [];
  if (own === undefined) classes.push(FIELD_TEXT_SIZE.unsized);
  else if (under16(own)) {
    classes.push(own.startsWith("!") ? FIELD_TEXT_SIZE.phoneImportant : FIELD_TEXT_SIZE.phone);
  }
  if (ownSm !== undefined && under16(ownSm)) {
    classes.push(ownSm.startsWith("!") ? FIELD_TEXT_SIZE.smBandImportant : FIELD_TEXT_SIZE.smBand);
  }
  return classes.length > 0 ? classes.join(" ") : undefined;
}
