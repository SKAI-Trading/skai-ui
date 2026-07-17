import { describe, it, expect } from "vitest";
import { referralUrl } from "../lib/constants";

/**
 * The referral link shape. This is shared by both share surfaces on purpose:
 * each hand-rolled it before, and each got it wrong in a different way (the
 * wallet emitted a flat /wallet link; the app emitted /referral/{username},
 * which matches no route).
 */
describe("referralUrl", () => {
  it("builds /ref/{code} — the route that actually exists", () => {
    expect(referralUrl("vassimo125")).toBe("https://skai.trade/ref/vassimo125");
  });

  it("never emits /referral/{code}, which matches no route", () => {
    // `/referral` is registered with NO param. This is the specific dead URL the
    // app's SharePortfolioModal used to build, attributing nothing.
    expect(referralUrl("vassimo125")).not.toContain("/referral/");
  });

  it("lowercases the code, which is matched literally as a username", () => {
    expect(referralUrl("Vassimo125")).toBe("https://skai.trade/ref/vassimo125");
  });

  it("trims incidental whitespace rather than emitting a broken path", () => {
    expect(referralUrl("  vassimo125 ")).toBe("https://skai.trade/ref/vassimo125");
  });

  it("returns null when there is no attributable code", () => {
    // Callers fall back to a plain product link; emitting /ref/null or /ref/
    // would be a link that looks like a referral and isn't one.
    expect(referralUrl(null)).toBeNull();
    expect(referralUrl(undefined)).toBeNull();
    expect(referralUrl("")).toBeNull();
    expect(referralUrl("   ")).toBeNull();
  });

  it("uses the landing origin, not the app origin", () => {
    // /ref/:code is served by skai.trade (and skai-landing), not app.skai.trade.
    expect(referralUrl("a")).toMatch(/^https:\/\/skai\.trade\//);
  });
});
