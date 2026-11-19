/**
 * BadgeCard on the dashboard, against the 1440 board 2422:3968 (448x216):
 * badge 150 at x=16, the text column from x=174 (8 after it) and 242 wide,
 * 32 clear of the right edge. "+500 SKAI points" is 163 and the Credited pill
 * 64, 10 after it, so the pair needs 237 of the 242.
 *
 * Report a4444746: the card put 32 on both sides and 16 between, a 218 column,
 * and the pill ran out through the card's right edge. jsdom has no layout, so
 * these pin the classes that carry the board's numbers.
 */
import { afterEach, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BadgeCard } from "./badge-card";
import { paintedAt } from "../../test/tailwindAt";

const classesOf = (el: Element) => (el.getAttribute("class") ?? "").split(/\s+/);

function renderCard() {
  render(
    <BadgeCard
      badgeName="Pioneer"
      badgeSubtitle="Early adopter during platform beta phase"
      badgePoints={500}
      topUsers={[
        { username: "spilledflyer143", skai_points: 437106 },
        { username: "ethluis", skai_points: 420293 },
      ]}
      data-testid="badge-card"
    />,
  );
}

describe("the badge card's row at 1440 (2422:3968, report a4444746)", () => {
  it("insets the badge 16 and the text 8 after it, keeping 32 on the right", () => {
    renderCard();
    const card = paintedAt(screen.getByTestId("badge-card"), 1440);
    expect([card.pl, card.pr]).toEqual([16, 32]);
    expect(paintedAt(screen.getByTestId("badge-card-row"), 1440).gap).toBe(8);
  });

  it("sets the points and the pill in the board's type, so the pair fits the 242 side by side", () => {
    renderCard();
    const [points, pill] = Array.from(screen.getByTestId("badge-card-reward").children);
    // Lg/Numbers 3: Mulish 22/26 at -4% (2422:3975).
    expect(classesOf(points)).toContain("font-numbers");
    const p = paintedAt(points, 1440);
    expect([p.fontSize, p.lineHeight, p.letterSpacing]).toEqual([22, 26, "-0.04em"]);
    // Lg/Label 2: Mulish 11/14 at -4%, on a 2 / 12 pad (2422:3976).
    expect(classesOf(pill)).toContain("font-numbers");
    const l = paintedAt(pill, 1440);
    expect([l.fontSize, l.lineHeight, l.letterSpacing, l.pt, l.pr, l.pb, l.pl]).toEqual([11, 14, "-0.04em", 2, 12, 2, 12]);
  });

  it("lets the Credited pill drop under the points instead of leaving the card", () => {
    renderCard();
    const reward = screen.getByTestId("badge-card-reward");
    expect(classesOf(reward)).toEqual(expect.arrayContaining(["md:flex-row", "md:flex-wrap"]));
    expect(reward).toHaveTextContent("+500 SKAI points");
    // The text column may shrink below its widest child, so the wrap can happen.
    expect(classesOf(reward.parentElement!)).toContain("min-w-0");
  });

  it("keeps the leaderboard 32 in on both sides", () => {
    renderCard();
    expect(classesOf(screen.getByTestId("badge-card-leaderboard"))).toContain("lg:ml-4");
  });
});

/**
 * The 375 boards, each read on its own on 2026-11-19: the Live board 2424:7715 and its
 * coachmark twin 2481:15918, and the pre-launch pair 2005:25112 / 2005:26526, whose card
 * the Live cut governs (round 26 #12). Card 343x80; badge 48 at 12,16; name 72,19 143x22
 * beside the points at 223,19 (104x16); the subtitle line 72,45, its text 149 wide and the
 * "?" at 225, so it runs on under the points and stops short of the pill at 274,43 (53x18).
 */
describe("the badge card at 375 (2424:7715, 2481:15918, 2005:25112, 2005:26526)", () => {
  const orderOf = (el: Element) => Number((classesOf(el).find((c) => /^order-\d$/.test(c)) ?? "order-0").slice(6));

  it("holds the row to 64 so the card stands 80 as drawn, and lets it go from 768", () => {
    renderCard();
    expect(classesOf(screen.getByTestId("badge-card-row"))).toEqual(expect.arrayContaining(["min-h-16", "md:min-h-0"]));
    expect(paintedAt(screen.getByTestId("badge-card"), 375)).toMatchObject({ pt: 8, pb: 8 });
  });

  it("runs the name beside the points, then the subtitle line beside the pill", () => {
    renderCard();
    const text = screen.getByTestId("badge-card-text");
    const reward = screen.getByTestId("badge-card-reward");
    // Below md neither column draws a box of its own; from md both do again.
    for (const group of [text, reward]) {
      expect(classesOf(group)).toContain("contents");
      expect(classesOf(group)).toContain("md:flex");
    }
    const body = text.parentElement!;
    expect(classesOf(body)).toEqual(expect.arrayContaining(["flex-wrap", "items-start", "gap-x-2", "md:flex-col", "md:flex-nowrap"]));
    const name = screen.getByRole("heading", { name: "Pioneer" });
    const line = screen.getByTestId("badge-card-subtitle");
    const [points, pill] = Array.from(reward.children);
    const brk = Array.from(body.children).find((c) => c.getAttribute("aria-hidden") === "true")!;
    expect([name, points, brk, line, pill].map(orderOf)).toEqual([1, 2, 3, 4, 5]);
    // The break fills a line of its own, so the subtitle cannot ride up beside the name.
    expect(classesOf(brk)).toEqual(expect.arrayContaining(["basis-full", "h-0", "md:hidden"]));
    // The name and the subtitle line take what the points and the pill leave, 8 from each.
    for (const el of [name, line]) expect(classesOf(el)).toEqual(expect.arrayContaining(["flex-1", "min-w-0"]));
    for (const el of [points, pill]) expect(classesOf(el)).toContain("shrink-0");
    // Line one is the name's 22; the subtitle line and the pill sit on the foot of line two,
    // the pill 2 under it, so the pill's top is 8 under the points' foot (35 to 43).
    expect(paintedAt(name, 375).lineHeight).toBe(22);
    expect(classesOf(name)).not.toContain("mb-1");
    expect(classesOf(name)).toContain("md:mb-1");
    expect(classesOf(line)).toEqual(expect.arrayContaining(["self-end", "min-h-4", "md:self-auto"]));
    expect(classesOf(pill)).toEqual(expect.arrayContaining(["self-end", "mt-0.5", "md:mt-0", "md:self-auto"]));
  });
});

describe("the coachmark at 375 (2481:15918)", () => {
  // The board: tool-tip 2481:17333 at 100,277, 250 wide; the "?" 2481:17255 at 241,264.
  const TIP = { x: 100, y: 277 };
  const ICON = { x: 241, y: 264 };
  afterEach(() => vi.restoreAllMocks());

  function openAt(iconLeft: number, viewport: number) {
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(viewport);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ left: iconLeft } as DOMRect);
    renderCard();
    fireEvent.click(screen.getByRole("button", { name: "What is Skai?" }));
    return screen.getByRole("tooltip");
  }

  it("hangs off the icon where the board puts it", () => {
    const tip = openAt(ICON.x, 375);
    expect(classesOf(tip)).toEqual(
      expect.arrayContaining([`left-[var(--coach-left,${TIP.x - ICON.x}px)]`, `top-[${TIP.y - ICON.y}px]`, "w-[250px]"]),
    );
    expect(classesOf(tip).filter((c) => /translate-x|^left-1\/2$/.test(c))).toEqual([]);
    // Where the board's own subtitle puts the icon, nothing moves it.
    expect(tip.style.getPropertyValue("--coach-left")).toBe("");
  });

  it("is held 16 inside the screen when a short subtitle would carry it off the left", () => {
    const tip = openAt(100, 375);
    expect(tip.style.getPropertyValue("--coach-left")).toBe(`${16 - 100}px`);
  });

  it("is held 16 inside the screen when a long subtitle would carry it off the right", () => {
    const tip = openAt(251, 375);
    expect(tip.style.getPropertyValue("--coach-left")).toBe(`${375 - 16 - 250 - 251}px`);
  });
});
