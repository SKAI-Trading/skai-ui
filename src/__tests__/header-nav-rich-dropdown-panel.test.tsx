/**
 * HeaderNavRichDropdown and HeaderNavDropdown: the panels and the lit rows name
 * the design system's colours, and those names carry the frame's values.
 *
 * Figma "Skai > Play - dropdown 1VH" 4765:64029 / 4768:66183, panel
 * 4765:65172 / 4768:67035 (read 2026-09-27): 300x136, pad [16,32,16,16], gap
 * 24, radius 12, fill #122524 (Green Coal 200), 1px #123F3C (Green Coal 100)
 * inside, drop shadow 0 4 12 #000 at 0.24. The lit row's glyph, title and sub
 * are #56C7F3 (Sky Blue 300), the sub at 0.64 as every sub is.
 *
 * Until 2026-09-27 the file wrote those as hex literals. The triggers' hex came
 * in e8fb20f (2026-07-22), when `sky-blue` still resolved to green; the token
 * was pointed at #56C7F3 on 2026-08-12 and the literals outlived the reason.
 */
import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeaderNavDropdown, HeaderNavRichDropdown } from "../components/layout/header/header-navigation";
import skaiPreset from "../lib/tailwind-preset";
import { skaiShadows } from "../lib/design-tokens";

const ITEMS = [
  {
    to: "/play/casino",
    label: "Casino",
    iconName: "games" as const,
    description: "Provably fair games with instant payouts",
  },
  {
    to: "/sports",
    label: "Sportsbook",
    iconName: "reward" as const,
    description: "Bet on live sports with real odds",
  },
];

const HEX = /#[0-9a-f]{3,8}\b/i;
const classesOf = (el: Element) => (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);

async function openRich(props: { triggerActive?: boolean } = {}) {
  const user = userEvent.setup();
  render(<HeaderNavRichDropdown label="Play" items={ITEMS} triggerTo="/play" {...props} />);
  screen.getByRole("link", { name: /play/i }).focus();
  await user.keyboard("{ArrowDown}");
  return screen.findByRole("menu");
}

describe("the colour names resolve to the frame's values", () => {
  it("green-coal 200 / 100, sky-blue and rounded-xl are #122524 / #123F3C, #56C7F3 and 12px", () => {
    const theme = skaiPreset.theme?.extend as {
      colors: Record<string, string | Record<string, string>>;
      borderRadius: Record<string, string>;
    };
    const coal = theme.colors["green-coal"] as Record<string, string>;
    expect(coal["200"].toUpperCase()).toBe("#122524");
    expect(coal["100"].toUpperCase()).toBe("#123F3C");
    expect(String(theme.colors["sky-blue"]).toUpperCase()).toBe("#56C7F3");
    expect(theme.borderRadius.xl).toBe("12px");
  });
});

describe("HeaderNavRichDropdown panel (4765:65172 / 4768:67035)", () => {
  it("fills the panel Green Coal 200 on a Green Coal 100 hairline, by name", async () => {
    const menu = await openRich();
    const cls = classesOf(menu);
    for (const c of ["w-[300px]", "bg-green-coal-200", "border", "border-green-coal-100", "rounded-xl", "pl-4", "pr-8", "py-4", "gap-6"]) {
      expect(cls, c).toContain(c);
    }
    // The content primitive's own fill and corner are merged away, not stacked.
    expect(cls).not.toContain("bg-popover");
    expect(cls).not.toContain("rounded-md");
    expect(cls.filter((c) => HEX.test(c)), "no hex left in the panel's classes").toEqual([]);
  });

  it("keeps the 0 4 12 @0.24 shadow written out, and that alone paints", async () => {
    const menu = await openRich();
    const shadows = classesOf(menu).filter((c) => c.startsWith("shadow"));
    // One shadow, and it is the frame's. `shadow-inputHint` would leave the
    // primitive's `shadow-md` beside it (tailwind-merge 2.6 takes the name for a
    // shadow colour), so the literal is what lets the merge drop `shadow-md`.
    expect(shadows).toEqual(["shadow-[0px_4px_12px_rgba(0,0,0,0.24)]"]);
    const literal = shadows[0].slice("shadow-[".length, -1).replace(/_/g, " ");
    expect(literal.replace(/\s+/g, "")).toBe(skaiShadows.inputHint.replace(/\s+/g, ""));
  });

  it("lights each row Sky Blue by name: the glyph always, the title on hover, focus and highlight", async () => {
    await openRich();
    for (const label of ["Casino", "Sportsbook"]) {
      const title = screen.getByText(label);
      const titleCls = classesOf(title);
      for (const c of ["text-white", "group-hover:text-sky-blue", "group-focus:text-sky-blue", "group-data-[highlighted]:text-sky-blue"]) {
        expect(titleCls, `${label}: ${c}`).toContain(c);
      }
      const row = title.closest("[role='menuitem']") as HTMLElement;
      const glyph = row.querySelector("svg") as SVGElement;
      expect(classesOf(glyph), `${label} glyph`).toContain("text-sky-blue");
      for (const el of [row, title, glyph]) {
        expect(classesOf(el).filter((c) => HEX.test(c)), `${label}: no hex`).toEqual([]);
      }
    }
  });

  it("lights each row's sub with its title: white at 0.64 at rest, Sky Blue at 0.64 when lit", async () => {
    // 4765:65172 lights "Sports book" and 4768:67035 lights "Casino": the lit
    // row's sub (4765:65197, 4768:67040) is #56C7F3 at 0.64, the other row's
    // is #FFFFFF at 0.64. Until 2026-10-04 the lit sub turned white at 0.80
    // (16da373), which no row in either panel draws.
    await openRich();
    for (const description of ITEMS.map((item) => item.description)) {
      const sub = screen.getByText(description);
      const cls = classesOf(sub);
      expect(cls, "at rest").toContain("text-white/64");
      for (const lit of ["group-hover", "group-focus", "group-data-[highlighted]"]) {
        const lightsAs = cls.filter((c) => c.startsWith(`${lit}:text-`));
        expect(lightsAs, `${description}: ${lit}`).toEqual([`${lit}:text-sky-blue/64`]);
      }
      expect(cls.filter((c) => HEX.test(c)), `${description}: no hex`).toEqual([]);
    }
    // And the names carry the frame's values: sky-blue is #56C7F3 and the
    // opacity scale's 64 is 0.64 (an off-scale step emits no rule at all).
    const theme = skaiPreset.theme?.extend as {
      colors: Record<string, string | Record<string, string>>;
      opacity: Record<string, string>;
    };
    expect(String(theme.colors["sky-blue"]).toUpperCase()).toBe("#56C7F3");
    expect(theme.opacity["64"]).toBe("0.64");
  });

  it("lights the open or active trigger Sky Blue by name", async () => {
    const menu = await openRich();
    expect(menu).toBeTruthy();
    const trigger = screen.getByRole("link", { name: /play/i });
    const cls = classesOf(trigger);
    expect(cls).toContain("text-sky-blue");
    expect(cls).toContain("hover:text-sky-blue");
    expect(cls.filter((c) => HEX.test(c))).toEqual([]);
  });

  it("paints the closed plain trigger white and Sky Blue only on hover", () => {
    render(<HeaderNavRichDropdown label="Trade" items={ITEMS} />);
    const cls = classesOf(screen.getByRole("button", { name: /trade/i }));
    expect(cls).toContain("text-white");
    expect(cls).toContain("hover:text-sky-blue");
    expect(cls).not.toContain("text-sky-blue");
    expect(cls.filter((c) => HEX.test(c))).toEqual([]);
  });
});

describe("HeaderNavDropdown panel", () => {
  it("uses the same Green Coal pair by name", async () => {
    const { container } = render(
      <HeaderNavDropdown label="Social" items={[{ to: "/social", label: "Feed" }]} />,
    );
    // It opens on hover (handleEnter on the wrapper around the trigger).
    fireEvent.mouseEnter(container.firstElementChild as Element);
    const menu = await screen.findByRole("menu");
    const cls = classesOf(menu);
    expect(cls).toContain("bg-green-coal-200");
    expect(cls).toContain("border-green-coal-100");
    expect(cls).not.toContain("bg-popover");
    expect(cls.filter((c) => HEX.test(c))).toEqual([]);
  });
});
