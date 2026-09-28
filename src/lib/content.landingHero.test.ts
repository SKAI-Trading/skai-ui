/**
 * The Temporary landing hero copy. All six boards (August 10767:307473,
 * 11189:2629, 11225:181650 and May 2065:110, 2065:8549, 2065:16978) set the
 * subheading as one sentence ending in a full stop (text 10767:307478, read
 * in full 2026-09-27).
 */
import { describe, it, expect } from "vitest";
import { content } from "./content";

const shared = content.landing.waitlist.shared;

describe("landing hero copy", () => {
  it("ends the subheading on the boards' full stop", () => {
    expect(shared.subheading).toBe(
      "Discover the new world of perpetual trading, swaps, prediction markets, memes, launchpads, and a catalog of casino-style gaming.",
    );
  });

  it("carries no stand-in count for the counter", () => {
    expect(Object.keys(shared)).not.toContain("defaultCount");
    for (const value of Object.values(shared)) {
      if (typeof value === "string") expect(value).not.toMatch(/^\d[\d,.]*k?$/i);
    }
  });
});
