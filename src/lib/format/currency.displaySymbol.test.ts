import { describe, expect, it } from "vitest";
import {
  formatAmountWithSymbol,
  hasDisplayAlias,
  tokenDisplaySymbol,
} from "./currency";

/**
 * Casey's ruling 2026-08-12: a user's sUSD balance reads as USD everywhere.
 * sUSD is the chain's ticker, not the thing a person holds.
 *
 * The oracle here is the ruling itself plus the token's identity, not the
 * implementation — these assertions would fail if someone "simplified"
 * tokenDisplaySymbol into an identity function or widened the override map.
 */
describe("tokenDisplaySymbol", () => {
  it("presents sUSD as USD", () => {
    expect(tokenDisplaySymbol("sUSD")).toBe("USD");
  });

  it("presents the uppercase ticker as USD too", () => {
    // Some services normalise symbols to upper case before they reach a view.
    expect(tokenDisplaySymbol("SUSD")).toBe("USD");
  });

  it("leaves every other symbol untouched", () => {
    for (const s of ["SKAI", "ETH", "WETH", "USDC", "BTC", "SOL"]) {
      expect(tokenDisplaySymbol(s)).toBe(s);
    }
  });

  it("returns an empty string for absent input rather than the word undefined", () => {
    expect(tokenDisplaySymbol(null)).toBe("");
    expect(tokenDisplaySymbol(undefined)).toBe("");
    expect(tokenDisplaySymbol("")).toBe("");
  });

  it("does NOT rename USDC, which is a different token", () => {
    // Guards against a well-meaning widening of the override map. sUSD is
    // SKAI's own predeploy; USDC is a bridged third-party asset and keeping
    // them distinct is the whole reason the map is explicit.
    expect(tokenDisplaySymbol("USDC")).toBe("USDC");
  });
});

describe("hasDisplayAlias", () => {
  it("is true only for symbols shown under another name", () => {
    expect(hasDisplayAlias("sUSD")).toBe(true);
    expect(hasDisplayAlias("SKAI")).toBe(false);
    expect(hasDisplayAlias(null)).toBe(false);
  });
});

describe("formatAmountWithSymbol", () => {
  it("joins an already-formatted amount to the display label", () => {
    expect(formatAmountWithSymbol("120.00", "sUSD")).toBe("120.00 USD");
    expect(formatAmountWithSymbol("0.42", "ETH")).toBe("0.42 ETH");
  });

  it("never denominates a placeholder", () => {
    // "— USD" reads as a real quantity in an unknown currency. The unknown is
    // the QUANTITY, so the placeholder must stand alone.
    for (const placeholder of ["—", "-", "…"]) {
      expect(formatAmountWithSymbol(placeholder, "sUSD")).toBe(placeholder);
    }
  });

  it("returns an empty string when there is no amount", () => {
    expect(formatAmountWithSymbol(null, "sUSD")).toBe("");
    expect(formatAmountWithSymbol("", "sUSD")).toBe("");
  });

  it("returns the bare amount when the symbol is missing", () => {
    expect(formatAmountWithSymbol("12.00", null)).toBe("12.00");
  });

  it("does not reformat the amount it is given", () => {
    // The label is this function's only job. Precision belongs to the call
    // site, which is why the amount arrives as a string.
    expect(formatAmountWithSymbol("1234.5678", "sUSD")).toBe("1234.5678 USD");
  });
});
