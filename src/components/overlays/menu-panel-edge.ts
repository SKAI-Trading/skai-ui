/**
 * The menu panel's 1px edge, as the dropdown frames draw it: a Green Coal 100
 * stroke INSIDE the box. An inside stroke takes no room, so a frame's panel is
 * 8 + rows + 8 (46 for one 30 row at 1440). A CSS border is laid out inside the
 * box instead, so it stood the panel 2 taller and 2 wider and set its rows 9 in.
 * The edge is therefore an inset ring, in the same `border` colour, under the
 * panel's drop shadow.
 *
 * A caller that styles the edge itself keeps a CSS border, as before: a colour
 * of its own (`border-white/10`), a width, or `border-0` for no edge at all.
 * Its colour lives on `border-*`, and a ring would draw the default colour over
 * it, or bring back an edge it removed.
 */

/** The frames' edge: no laid-out border, a 1px inset ring in the border colour. */
export const PANEL_EDGE = "border-0 ring-1 ring-inset ring-border";

/** The CSS border a caller that styles its own edge builds on. */
export const PANEL_BORDER = "border border-border";

/** A class's utility, past its variants. A `:` inside brackets is not a variant's. */
function utilityOf(cls: string): { variant: string; utility: string } {
  let depth = 0;
  let cut = -1;
  for (let i = 0; i < cls.length; i++) {
    const ch = cls[i];
    if (ch === "[") depth++;
    else if (ch === "]") depth--;
    else if (ch === ":" && depth === 0) cut = i;
  }
  return { variant: cls.slice(0, cut + 1), utility: cls.slice(cut + 1).replace(/^!/, "") };
}

/**
 * True when a class list draws the panel's edge itself: a `border` width or
 * colour on the panel. A class behind an arbitrary selector
 * (`[&>div]:border-b`) borders a descendant, so it does not count.
 */
export function drawsOwnEdge(className?: string): boolean {
  return (className ?? "").split(/\s+/).some((cls) => {
    if (!cls) return false;
    const { variant, utility } = utilityOf(cls);
    if (variant.includes("&")) return false;
    return /^border(-|$)/.test(utility) && !/^border-(collapse|separate|spacing)/.test(utility);
  });
}

/** The edge classes a panel takes for a caller's class list. */
export function panelEdge(className?: string): string {
  return drawsOwnEdge(className) ? PANEL_BORDER : PANEL_EDGE;
}
