"use client";

import * as React from "react";

/**
 * Keeping a dark surface dark inside a light app.
 *
 * The main app's light theme sets the `--coal-*` properties on `<html>`, so
 * every Green Coal, White, Ash, wash and accent utility below it follows the
 * theme. A casino board is drawn dark on purpose and must not follow it. The
 * app's `.coal-dark` class puts the board back: it redeclares the dark tokens
 * and resets every `--coal-*` property to `initial`, so each utility paints its
 * own fallback, which is the dark colour it always painted.
 *
 * A class reaches only the DOM below it, and Radix renders menus, selects,
 * popovers and dialogs into `<body>`. So a board also wraps its children in
 * `CoalDarkScope`, and the portal content primitives in this package read the
 * scope and add the class to their own root. A bet panel's select opened from
 * a board then keeps the board's dark popover.
 */
export const COAL_DARK_CLASS = "coal-dark";

/**
 * Every role the theme can recolour. Each is a custom property holding RGB
 * channels, read as `rgb(var(--coal-<role>, <dark channels>) / <alpha>)`.
 */
export const COAL_ROLES = [
  "base",
  "raised",
  "fill",
  "line",
  "ink",
  "ink-muted",
  "wash",
  "accent-sky",
  "accent-green",
  "accent-red",
  "accent-yellow",
] as const;

export type CoalRole = (typeof COAL_ROLES)[number];

/** `--coal-base`, `--coal-raised`, ... in the order of COAL_ROLES. */
export const COAL_PROPERTIES = COAL_ROLES.map(
  (role) => `--coal-${role}` as const,
);

const CoalDarkContext = React.createContext(false);

export interface CoalDarkScopeProps {
  children?: React.ReactNode;
}

/** Marks a subtree whose portals must stay dark. Renders no element. */
export function CoalDarkScope({ children }: CoalDarkScopeProps) {
  return (
    <CoalDarkContext.Provider value={true}>{children}</CoalDarkContext.Provider>
  );
}

/** True below a CoalDarkScope. */
export function useCoalDark(): boolean {
  return React.useContext(CoalDarkContext);
}

/** `coal-dark` below a CoalDarkScope, otherwise undefined (which `cn` drops). */
export function useCoalDarkClass(): typeof COAL_DARK_CLASS | undefined {
  return useCoalDark() ? COAL_DARK_CLASS : undefined;
}

/**
 * A colour for an inline style or a JS constant that follows the theme the way
 * the utilities do: `coalColor("base", "#001615")` is
 * `rgb(var(--coal-base, 0 22 21))`, and `coalColor("line", "#123F3C", 0.5)`
 * adds `/ 0.5`. With the property unset (the dark theme, or anywhere under
 * `coal-dark`) it paints exactly the hex passed in.
 *
 * Canvas and SVG attributes cannot resolve a custom property; those read
 * `useResolvedTheme()` and pick a palette instead.
 */
export function coalColor(role: CoalRole, hex: string, alpha?: number): string {
  const match = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!match) {
    throw new Error(`coalColor needs a #rrggbb colour, got "${hex}"`);
  }
  const n = parseInt(match[1], 16);
  const channels = `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
  const value = `var(--coal-${role}, ${channels})`;
  return alpha === undefined ? `rgb(${value})` : `rgb(${value} / ${alpha})`;
}

export type ResolvedTheme = "light" | "dark";

// One observer for the whole page, however many charts listen. useTheme() in
// the app keeps its own state per caller, so a chart that called it never
// heard the account menu switch the theme; the class on <html> is the one
// signal every caller shares.
const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

function readDocumentTheme(): ResolvedTheme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light")
    ? "light"
    : "dark";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (
    !observer &&
    typeof document !== "undefined" &&
    typeof MutationObserver !== "undefined"
  ) {
    observer = new MutationObserver(() => {
      for (const notify of [...listeners]) notify();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && observer) {
      observer.disconnect();
      observer = null;
    }
  };
}

/**
 * The theme a canvas, chart or JS palette should draw in: `light` when the
 * page is light, `dark` otherwise, and always `dark` below a CoalDarkScope.
 * Re-renders when the class on `<html>` changes.
 */
export function useResolvedTheme(): ResolvedTheme {
  const scoped = useCoalDark();
  const theme = React.useSyncExternalStore(
    subscribe,
    readDocumentTheme,
    () => "dark" as const,
  );
  return scoped ? "dark" : theme;
}
