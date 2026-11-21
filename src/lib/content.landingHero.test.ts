/**
 * The Temporary landing hero copy. All six boards (August 10767:307473,
 * 11189:2629, 11225:181650 and May 2065:110, 2065:8549, 2065:16978) set the
 * subheading as one sentence ending in a full stop (text 10767:307478, read
 * in full 2026-09-27).
 */
import { describe, it, expect } from "vitest";
import { content, interpolate } from "./content";

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

/**
 * The signups strip on the Onboarding i5 boards (2665:8843, 2665:9536,
 * 2665:10229, read 2026-11-21) and round 92 Q1 and Q4 (session pick).
 */
describe("landing signups strip copy", () => {
  it("splits the today line where the 1440 board changes face", () => {
    // 2665:10925: "20 new" in Mulish, then " signups today!" in Manrope.
    expect(shared.signupsToday).toEqual({ count: "{{count}} new", suffix: " signups today!" });
  });

  it("reads as the boards' one line once the count is in", () => {
    // Text 2665:10925, 2667:10936 and 2667:10944 all read this.
    const line = interpolate(shared.signupsToday.count, { count: 20 }) + shared.signupsToday.suffix;
    expect(line).toBe("20 new signups today!");
  });

  it("words a pill's age as the board does", () => {
    expect(shared.justJoined.now).toBe("just joined");
    expect(interpolate(shared.justJoined.ago, { age: "1m" })).toBe("joined 1m ago");
  });

  it("holds no figure of its own: the count and the age come from the caller", () => {
    const templates = [shared.signupsToday.count, shared.signupsToday.suffix, shared.justJoined.now, shared.justJoined.ago];
    for (const t of templates) expect(t).not.toMatch(/[0-9]/);
    expect(shared.signupsToday.count).toContain("{{count}}");
    expect(shared.justJoined.ago).toContain("{{age}}");
  });
});
