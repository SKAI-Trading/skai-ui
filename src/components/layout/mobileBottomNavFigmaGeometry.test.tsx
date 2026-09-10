/**
 * Bottom-navigation-mobile geometry, node 10640:30604 on the 375 board.
 *
 * The bar is global chrome — it draws on every mobile surface, not just the one
 * the report was filed against — so the phone numbers are pinned here rather
 * than left to a screenshot. Read off the node:
 *
 *   375 x 54, HORIZONTAL, padding 4 on all four sides
 *   five cells 73.4 x 46 laid edge to edge (x = 4, 77.4, 150.8, 224.2, 297.6),
 *     gap 0
 *   each cell: a 16x16 icon at y=6 over a 16-tall label at y=24
 *   fill #001615 at 60%, stroke #123F3C, BACKGROUND_BLUR radius 20
 *   labels "Sm/Label 1 300" — Mulish Regular 12/16, tracking -0.48px
 *
 * The tablet band keeps 6704:26136's 52px bar, 19px side padding and 10px
 * blur, so every phone value below carries an `md:` counterpart and the two
 * frames do not overwrite each other.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MobileBottomNav, type MobileBottomNavItem } from "./mobile-bottom-nav";

const items: MobileBottomNavItem[] = [
  { href: "/trade", icon: <svg />, label: "Trade" },
  { href: "/predict", icon: <svg />, label: "Predict" },
  { href: "/play", icon: <svg />, label: "Play" },
  { href: "/social", icon: <svg />, label: "Social" },
  { href: "#more", icon: <svg />, label: "More", onClick: () => {} },
];

function renderBar() {
  render(
    <MobileBottomNav
      items={items}
      currentPath="/predict"
      renderLink={({ key, href, className, children, onClick }) =>
        onClick ? (
          <button key={key} type="button" className={className} onClick={onClick}>
            {children}
          </button>
        ) : (
          <a key={key} href={href} className={className}>
            {children}
          </a>
        )
      }
    />,
  );
  return screen.getByRole("navigation");
}

describe("MobileBottomNav — 10640:30604 phone geometry", () => {
  it("blurs the backdrop at the frame's 20px on phones and keeps 10px on tablets", () => {
    const nav = renderBar();
    expect(nav.className).toContain("backdrop-blur-[20px]");
    expect(nav.className).toContain("md:backdrop-blur-[10px]");
  });

  it("is 54px tall on phones and still 52px on tablets, both clearing the safe area", () => {
    const nav = renderBar();
    expect(nav.className).toContain(
      "h-[calc(54px+env(safe-area-inset-bottom,0px))]",
    );
    expect(nav.className).toContain(
      "md:h-[calc(52px+env(safe-area-inset-bottom,0px))]",
    );
    // An inline height would beat both classes and freeze the bar at one size.
    expect(nav.style.height).toBe("");
  });

  it("pads 4px all round on phones rather than the tablet's 19/8", () => {
    const nav = renderBar();
    expect(nav.className).toContain("p-1");
    expect(nav.className).toContain("md:px-[19px]");
    expect(nav.className).toContain("md:py-2");
    expect(nav.className).toContain(
      "pb-[calc(4px+env(safe-area-inset-bottom,0px))]",
    );
    expect(nav.style.paddingBottom).toBe("");
  });

  it("lays the five cells edge to edge with no gap on phones", () => {
    const nav = renderBar();
    expect(nav.className).toContain("gap-0");
    expect(nav.className).toContain("md:gap-1");
    // justify-between spreads leftover space; the frame has none to spread,
    // and it fights flex-1 if the cells ever stop filling the row.
    expect(nav.className).not.toContain("justify-between");
  });

  it("sets the labels at the phone frame's 12px, stepping up at the tablet board", () => {
    renderBar();
    const label = screen.getByText("Predict");
    expect(label.className).toContain("text-[12px]");
    expect(label.className).toContain("md:text-[14px]");
    // sm: is 640, which is not one of the 375 / 768 / 1440 boards.
    expect(label.className).not.toContain("sm:text-");
  });

  it("keeps the fill, rule and 16px icon box the frame specifies", () => {
    const nav = renderBar();
    expect(nav.className).toContain("bg-[rgba(0,22,21,0.6)]");
    expect(nav.className).toContain("border-[#123f3c]");
    expect(
      nav.querySelectorAll("[aria-hidden='true'].size-4"),
    ).toHaveLength(items.length);
  });
});
