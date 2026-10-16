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
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BadgeCard } from "./badge-card";

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
    const card = classesOf(screen.getByTestId("badge-card"));
    expect(card).toEqual(expect.arrayContaining(["md:px-8", "lg:pl-4"]));
    expect(classesOf(screen.getByTestId("badge-card-row"))).toContain("lg:gap-2");
  });

  it("sets the points and the pill in the board's type, so the pair fits the 242 side by side", () => {
    renderCard();
    const [points, pill] = Array.from(screen.getByTestId("badge-card-reward").children);
    // Lg/Numbers 3: Mulish 22/26 at -4% (2422:3975).
    expect(classesOf(points)).toEqual(
      expect.arrayContaining(["lg:font-numbers", "lg:text-[22px]", "lg:leading-[26px]", "lg:tracking-[-0.88px]"]),
    );
    // Lg/Label 2: Mulish 11/14 at -4%, on a 2 / 12 pad (2422:3976).
    expect(classesOf(pill)).toEqual(
      expect.arrayContaining(["lg:font-numbers", "lg:text-[11px]", "lg:leading-[14px]", "lg:tracking-[-0.44px]", "lg:px-[12px]", "md:py-[2px]"]),
    );
    expect(classesOf(pill)).not.toContain("lg:py-[4px]");
  });

  it("lets the Credited pill drop under the points instead of leaving the card", () => {
    renderCard();
    const reward = screen.getByTestId("badge-card-reward");
    expect(classesOf(reward)).toEqual(expect.arrayContaining(["md:flex-row", "md:flex-wrap"]));
    expect(reward).toHaveTextContent("+500 SKAI Points");
    // The text column may shrink below its widest child, so the wrap can happen.
    expect(classesOf(reward.parentElement!)).toContain("min-w-0");
  });

  it("keeps the leaderboard 32 in on both sides", () => {
    renderCard();
    expect(classesOf(screen.getByTestId("badge-card-leaderboard"))).toContain("lg:ml-4");
  });
});
