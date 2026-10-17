/**
 * A bet the server refuses for the player's region shows the server's words.
 *
 * prediction-market answers a bet from a restricted or unverifiable region
 * with a 451 (supabase/functions/_shared/geoGate.ts in the app). skai-landing
 * passes on its `error` text alone, so the card gets "This region is not
 * supported" or "We could not verify your region"; it used to replace both
 * with "Something went wrong. Please try again.", a retry that can only be
 * refused again.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PredictionMarketCard } from "./prediction-market-card";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

function renderWith(refusal: unknown) {
  render(
    <PredictionMarketCard
      skaiPoints={100}
      userId="u1"
      onFetchPrice={() => Promise.resolve(2500)}
      onFetchPriceHistory={() => Promise.resolve([])}
      onPlaceBet={() => Promise.reject(refusal)}
      onSettleBet={() => new Promise(() => {})}
    />,
  );
}

async function betHigher() {
  const higher = (await screen.findByText(/HIGHER/)).closest("button")!;
  await waitFor(() => expect(higher.disabled).toBe(false));
  fireEvent.click(higher);
}

describe("prediction card: region refusals", () => {
  for (const text of ["This region is not supported", "We could not verify your region"]) {
    it(`shows "${text}" as the server sent it`, async () => {
      renderWith(new Error(text));
      await betHigher();
      expect(await screen.findByText(text)).toBeTruthy();
      expect(screen.queryByText("Something went wrong. Please try again.")).toBeNull();
    });
  }

  it("reads the refusal's code when the caller passes it on", async () => {
    renderWith(Object.assign(new Error("Prediction API failed: 451"), { code: "GEO_RESTRICTED" }));
    await betHigher();
    expect(await screen.findByText("This region is not supported")).toBeTruthy();
  });

  it("any other failure still asks the player to try again", async () => {
    renderWith(new Error("Failed to fetch ETH price"));
    await betHigher();
    expect(await screen.findByText("Something went wrong. Please try again.")).toBeTruthy();
  });
});
