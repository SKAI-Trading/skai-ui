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

/**
 * The social row on the link-wallet boards, read from the design store
 * 2026-10-04 (2086:39242 at 1440, 2065:9242 at 768, 2065:17671 at 375): each
 * logos/social instance is a 16 box whose icon vector is Core/White with no
 * alpha, inset at the same place on all three boards.
 *
 * jsdom has no getBBox, so the path bounds below were measured once in
 * headless Chromium (path units). The checksum ties each one to the path it
 * was measured on: a new path has to be measured again before this can pass.
 */
const GLYPHS = [
  { name: "Discord", sum: 300587632, bounds: [-0.0005, 2.8536, 24.0007, 18.2934], board: [1, 2.5, 14, 10.5] },
  { name: "X (Twitter)", sum: 2158182272, bounds: [1.254, 2.25, 21.573, 19.5], board: [1, 1.5, 14, 12.5] },
  { name: "Instagram", sum: 2333193703, bounds: [0, 0, 24, 24], board: [1.5, 1.5, 13.5, 13.5] },
];

const fnv1a = (text: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
};

const renderSocials = () =>
  render(
    <LandingHeader
      discordUrl="https://discord.example"
      telegramUrl="https://t.example"
      twitterUrl="https://x.example"
      instagramUrl="https://instagram.example"
    />,
  );

describe("LandingHeader socials", () => {
  it("rests every icon at full white, not white/60", () => {
    renderSocials();
    for (const name of ["Discord", "X (Twitter)", "Telegram", "Instagram"]) {
      const link = screen.getByRole("link", { name });
      const classes = classesOf(link);
      expect(classes).toContain("text-white");
      expect(classes.filter((c) => /^text-white\/\d+$/.test(c))).toEqual([]);
      expect(classes.filter((c) => /^opacity-\d+$/.test(c))).toEqual([]);
      expect(link.querySelector("svg")).toHaveAttribute("fill", "currentColor");
    }
  });

  it("lands each glyph where the boards draw it inside the 16 box", () => {
    renderSocials();
    for (const { name, sum, bounds, board } of GLYPHS) {
      const svg = screen.getByRole("link", { name }).querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg!.getAttribute("class")!.split(/\s+/)).toEqual(expect.arrayContaining(["h-4", "w-4"]));
      expect(fnv1a(svg!.querySelector("path")!.getAttribute("d")!)).toBe(sum);

      const [vx, vy, vw, vh] = svg!.getAttribute("viewBox")!.trim().split(/[\s,]+/).map(Number);
      expect(vw).toBe(vh);
      const scale = 16 / vw;
      const [bx, by, bw, bh] = bounds;
      const drawn = [(bx - vx) * scale, (by - vy) * scale, bw * scale, bh * scale];
      const [left, top, width, height] = board;
      // every edge within a quarter pixel of the board's
      expect(Math.abs(drawn[0] - left)).toBeLessThan(0.25);
      expect(Math.abs(drawn[1] - top)).toBeLessThan(0.25);
      expect(Math.abs(drawn[0] + drawn[2] - (left + width))).toBeLessThan(0.25);
      expect(Math.abs(drawn[1] + drawn[3] - (top + height))).toBeLessThan(0.25);
    }
  });
});
