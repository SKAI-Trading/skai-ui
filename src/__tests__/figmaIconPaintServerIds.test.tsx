/**
 * Report 5526ea62 — "[IPHONE 16 PRO MAX] Home Moat Currency Logo": the SKAI
 * points glyph was missing from the mobile menu drawer while the two pills
 * beside it drew fine.
 *
 * Those two are immune by construction — FigmaVaultIcon fills with
 * `currentColor`, FigmaSusdIcon with a flat token. FigmaPointsIcon was the only
 * StatPill glyph painted through a REFERENCED PAINT SERVER, and its gradient id
 * was a hardcoded string. HomeTopBar renders it twice on "/" at once: the
 * desktop row inside a `hidden … lg:flex` wrapper (`hidden` is `display:none`)
 * and the drawer row. Two identical ids collapse — every `url(#…)` resolves to
 * the first in document order, which is the copy inside the hidden subtree,
 * where WebKit does not realise the paint server. The fill resolves to nothing
 * and the icon vanishes.
 *
 * These tests assert the invariant that prevents it: **an icon's paint-server
 * id must be unique per instance, and every url(#…) must resolve inside its own
 * <svg>.** They fail on the pre-fix code, where two mounts share one id.
 */

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  FigmaPointsIcon,
  FigmaSolanaIcon,
  FigmaSocialBubbleIcon,
} from "../figma-icons";

/** Every `url(#x)` reference in the subtree, and every id it could point at.
 *  Accepts either a container or a single <svg>; `querySelectorAll` does not
 *  match the root itself, so an <svg> passed in must be added explicitly. */
function collect(root: Element) {
  const svgs = Array.from(root.querySelectorAll("svg"));
  if (root.tagName.toLowerCase() === "svg") svgs.unshift(root);
  const refs: string[] = [];
  const ids: string[] = [];
  for (const svg of svgs) {
    for (const el of Array.from(svg.querySelectorAll("*"))) {
      for (const attr of Array.from(el.attributes)) {
        const m = /^url\(#(.+)\)$/.exec(attr.value.trim());
        if (m) refs.push(m[1]);
      }
      const id = el.getAttribute("id");
      if (id) ids.push(id);
    }
  }
  return { svgs, refs, ids };
}

const CASES = [
  ["FigmaPointsIcon", FigmaPointsIcon],
  ["FigmaSolanaIcon", FigmaSolanaIcon],
  ["FigmaSocialBubbleIcon", FigmaSocialBubbleIcon],
] as const;

describe.each(CASES)("%s — paint-server ids are per instance", (name, Icon) => {
  it("gives two mounted copies different ids", () => {
    const { container } = render(
      <>
        <Icon />
        <Icon />
      </>,
    );
    const { svgs, ids } = collect(container);
    expect(svgs).toHaveLength(2);
    expect(ids.length).toBeGreaterThan(0);
    // The whole bug in one assertion: duplicates here mean the second copy
    // paints from the first copy's server, wherever that happens to live.
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves every url(#…) inside its own svg", () => {
    const { container } = render(
      <>
        <Icon />
        <Icon />
      </>,
    );
    for (const svg of Array.from(container.querySelectorAll("svg"))) {
      const local = collect(svg);
      for (const ref of local.refs) {
        // A reference that only resolves via a SIBLING svg is the failure mode:
        // hide that sibling and this icon stops painting.
        expect(local.ids).toContain(ref);
      }
    }
  });

  it("keeps painting when an earlier copy is display:none", () => {
    // Reproduces the reported layout: desktop copy hidden, drawer copy visible.
    const { container } = render(
      <>
        <div style={{ display: "none" }}>
          <Icon />
        </div>
        <Icon />
      </>,
    );
    const svgs = Array.from(container.querySelectorAll("svg"));
    const visible = svgs[1];
    const local = collect(visible);
    expect(local.refs.length).toBeGreaterThan(0);
    for (const ref of local.refs) {
      expect(local.ids).toContain(ref);
    }
  });
});
