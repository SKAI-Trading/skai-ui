import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * A menu row's type in the dropdown frames: Paragraph 2 at each width, 12/14 on
 * a phone, 12/16 on a tablet and 14/18 on a desktop, all at -4%. The font is
 * not named: it is the page's Manrope through the preset, and naming it would
 * force Manrope on the other apps' menus.
 */
export const MENU_ROW_TYPE =
  "text-para-2-mobile md:text-para-2-tablet lg:text-para-2";

/**
 * The ramp for a row whose caller sets no font size of its own. A caller that
 * does (`text-sm`, `text-[12px]`) keeps that size at every width. Merged
 * blindly, the ramp's `md:` and `lg:` steps would outlive the caller's size,
 * because tailwind-merge only drops a class carrying the same variant.
 */
export function menuRowType(className?: string): string | undefined {
  const merged = cn("text-para-2-mobile", className).split(" ");
  return merged.includes("text-para-2-mobile") ? MENU_ROW_TYPE : undefined;
}

/**
 * The same for a row that may render `asChild`. Radix's Slot joins the row's
 * classes and its child's as plain strings, without tailwind-merge, so a size
 * the child names (`<a className="text-sm">`) never displaces the ramp, and the
 * ramp's `md:` / `lg:` steps would win over it at those widths. Read the
 * child's classes too.
 */
export function menuRowTypeFor(
  className: string | undefined,
  asChild: boolean | undefined,
  children: React.ReactNode,
): string | undefined {
  if (!asChild || !React.isValidElement(children)) return menuRowType(className);
  const own = (children.props as { className?: unknown }).className;
  return menuRowType(typeof own === "string" ? cn(className, own) : className);
}
