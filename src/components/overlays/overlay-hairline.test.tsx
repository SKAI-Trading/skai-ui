/**
 * The onboarding overlays draw their Green Coal 100 hairline as an inset ring.
 *
 * The boards lay each column out inside the stroke - 2005:21380 is 468x317
 * with a 436 column at x=16, 11229:188072 is 358x342 with a 342 column at
 * x=8 - so a CSS border on the box takes 2 off the column and adds 2 to the
 * height. jsdom lays nothing out, so this pins the declarations instead.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WalletChoiceModal } from "./wallet-choice-modal";
import { EmailVerificationModal } from "./email-verification-modal";

const RING = "shadow-[inset_0_0_0_1px_#123f3c,0px_10px_80px_0px_rgba(0,0,0,0.25)]";

function boxClasses(heading: string): string[] {
  const box = screen.getByRole("heading", { name: heading }).parentElement;
  expect(box).not.toBeNull();
  return (box as HTMLElement).className.split(/\s+/);
}

describe("overlay hairline", () => {
  it("wallet choice draws its box stroke inside the box", () => {
    render(
      <WalletChoiceModal
        isOpen
        onClose={vi.fn()}
        onSelectEmailWallet={vi.fn()}
        onSelectExternalWallet={vi.fn()}
      />,
    );
    const classes = boxClasses("Choose your wallet");
    expect(classes).toContain(RING);
    expect(classes).not.toContain("border");
  });

  /**
   * 2065:27090 at 375: controls at y=24, rows ending at 266 in a 290 box, and
   * the subtitle on Sm/Sub-headline 2 300's flat 18 (2065:27098).
   */
  it("wallet choice keeps the 375 board's 24 / 24 insets and 18 subtitle line", () => {
    render(
      <WalletChoiceModal
        isOpen
        onClose={vi.fn()}
        onSelectEmailWallet={vi.fn()}
        onSelectExternalWallet={vi.fn()}
      />,
    );
    const classes = boxClasses("Choose your wallet");
    expect(classes).toEqual(expect.arrayContaining(["pt-6", "pb-6", "md:p-4", "lg:p-6"]));
    expect(classes).not.toContain("pb-2");
    const subtitle = screen.getByText(/store your assets/i).className.split(/\s+/);
    expect(subtitle).toEqual(expect.arrayContaining(["leading-[18px]", "tracking-[-0.56px]", "md:leading-[18.05px]"]));
  });

  it("email verification draws its box stroke inside the box", () => {
    render(
      <EmailVerificationModal
        isOpen
        onClose={vi.fn()}
        onBack={vi.fn()}
        email="someone@example.com"
        onVerify={vi.fn()}
      />,
    );
    const classes = boxClasses("Email verification");
    expect(classes).toContain(RING);
    expect(classes).not.toContain("border");
  });
});
