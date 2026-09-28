/**
 * The Temporary landing legal nav, read 2026-09-27: Manrope Bold 14/16 at 375
 * (11225:181650, 111x16, Terms 40 wide), Regular 12/16 at 768 (11189:2629,
 * 117x16, Terms 33 wide) and Regular 14/18 at 1440 (10767:307473, 117x18).
 *
 * jsdom lays nothing out, so this pins the classes that carry each rung.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandingHeader } from "./landing-header";

const RUNGS = [
  "font-manrope",
  "text-para-1-mobile",
  "font-bold",
  "md:text-para-2-tablet",
  "md:font-normal",
  "lg:text-para-2",
  "text-[#E0E0E0]",
];

const classesOf = (el: Element | null): string[] => {
  expect(el).not.toBeNull();
  return (el as HTMLElement).className.split(/\s+/);
};

describe("LandingHeader legal nav", () => {
  it("steps Terms and Privacy Bold 14/16, Regular 12/16, Regular 14/18", () => {
    render(<LandingHeader discordUrl="" telegramUrl="" twitterUrl="" instagramUrl="" />);
    for (const name of ["Terms", "Privacy"]) {
      const link = screen.getByRole("link", { name });
      const classes = classesOf(link);
      expect(classes).toEqual(expect.arrayContaining(RUNGS));
      expect(classes).not.toContain("text-[14px]");
      expect(classes).not.toContain("leading-[18px]");
    }
  });

  it("keeps the 24 / 32 gap between the two links", () => {
    render(<LandingHeader discordUrl="" telegramUrl="" twitterUrl="" instagramUrl="" />);
    const row = screen.getByRole("link", { name: "Terms" }).parentElement;
    expect(classesOf(row)).toEqual(expect.arrayContaining(["gap-6", "md:gap-8"]));
  });

  it("draws a social icon only for a url it is handed", () => {
    // An anchor handed an empty url renders with no href and so has no link
    // role; count the elements themselves, not the links.
    const { container, unmount } = render(
      <LandingHeader discordUrl="" telegramUrl="" twitterUrl="" instagramUrl="" />,
    );
    expect(container.querySelectorAll("a")).toHaveLength(2);
    expect(screen.queryByLabelText("Discord")).toBeNull();
    expect(screen.queryByLabelText("Telegram")).toBeNull();
    unmount();

    render(
      <LandingHeader
        discordUrl="https://discord.example"
        telegramUrl=""
        twitterUrl="https://x.example"
        instagramUrl="https://instagram.example"
      />,
    );
    expect(screen.getByRole("link", { name: "Discord" })).toHaveAttribute("href", "https://discord.example");
    expect(screen.getByRole("link", { name: "X (Twitter)" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Telegram")).toBeNull();
  });
});
