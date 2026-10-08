/**
 * The landing cards may only name a way to earn points that something on the
 * server pays.
 *
 * Casey, 2026-09-22: a sign-up earns nothing. The referral (100) and the
 * onboarding badge (500) are paid on the friend's or the account's first
 * deposit or trade, and the app's referral surfaces already say so. The
 * landing's referral card still said "for each friend that joins", its share
 * text promised 500 points for joining the waitlist, and the prediction card
 * sent a player with no points to "depositing sUSD", which no writer pays
 * points for.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReferralCard } from "./referral-card";
import { PredictionMarketCard } from "./prediction-market-card";
import { PortfolioCard } from "./portfolio-card";
import { content } from "../../lib/content";

const RULE = /for each friend who makes their first deposit or trade/;

describe("landing reward copy", () => {
  it("the referral card pays on the friend's first deposit or trade, not on joining", () => {
    render(
      <ReferralCard referralLink="https://skai.trade/ref/casey" referralPoints={100} shareTweetPoints={0} />,
    );
    expect(screen.getByText(/Earn 100 SKAI Points/).textContent).toMatch(RULE);
    expect(screen.queryByText(/that joins/)).toBeNull();
  });

  it("the referral strings in content say the same", () => {
    const d = content.landing.waitlist.dashboard.referral;
    expect(d.subtitle).toMatch(RULE);
    expect(content.earn.referral.description).toMatch(RULE);
    for (const s of [d.subtitle, content.earn.referral.description]) {
      expect(s).not.toMatch(/joins/);
    }
  });

  it("the share text does not promise 500 points for joining the waitlist", () => {
    const text = content.landing.waitlist.dashboard.referral.shareText;
    expect(text).not.toMatch(/to claim 500/);
    expect(text).toMatch(/first deposit or trade earns 500 SKAI Points/);
    // The link the tweet carries is unchanged.
    expect(text).toContain("https://skai.trade/ref/{{username}}");
  });

  it("the prediction card sends a player with no points to sharing, not to a deposit", () => {
    render(
      <PredictionMarketCard
        skaiPoints={0}
        userId="u1"
        onFetchPrice={() => new Promise<number>(() => {})}
        onFetchPriceHistory={() => new Promise(() => {})}
      />,
    );
    const line = screen.getByText(/You need SKAI Points to predict/);
    expect(line.textContent).toMatch(/Earn points by sharing\.$/);
    expect(line.textContent).not.toMatch(/deposit/i);
  });

  // The landing's Deposit card (DashboardPage) promised "1 SKAI Point for
  // every sUSD on your first deposit" and "Deposit sUSD on Base to earn 1 SKAI
  // Point per sUSD". Nothing pays a deposit today, and hasClaimedDeposit is
  // never true on the landing, so every user on Base saw both.
  it("the deposit card promises no points for a deposit, on either chain", () => {
    for (const hasClaimedDeposit of [false, true]) {
      const { container, unmount } = render(
        <PortfolioCard walletAddress="0x1111111111111111111111111111111111111111" hasClaimedDeposit={hasClaimedDeposit} />,
      );
      expect(container.textContent).not.toMatch(/SKAI Point|1:1|one-time reward/i);
      screen.getByText("Ethereum").click();
      expect(container.textContent).not.toMatch(/SKAI Point/i);
      // The card still does its job: the address and what it accepts.
      expect(container.textContent).toContain("Accepted: ETH & sUSD");
      unmount();
    }
  });
});
