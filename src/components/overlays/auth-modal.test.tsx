/**
 * AuthModal — the Login / Sign up frames with the wallet row. There is no
 * consent checkbox any more (Casey, 2026-09-08: follow the frames); the only
 * gate on the buttons is an in-flight handshake.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthModal } from "./auth-modal";

function setup(overrides: Partial<React.ComponentProps<typeof AuthModal>> = {}) {
  const props = {
    mode: "login" as const,
    isOpen: true,
    onClose: vi.fn(),
    onEmailSubmit: vi.fn(),
    onGoogleLogin: vi.fn(),
    onAppleLogin: vi.fn(),
    onWalletLogin: vi.fn(),
    ...overrides,
  };
  render(<AuthModal {...props} />);
  return props;
}

const typeEmail = (value: string) =>
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value } });

beforeEach(() => vi.clearAllMocks());

describe("wallet row", () => {
  it("draws one button per wallet, named for the wallet, in frame order", () => {
    setup();
    const names = ["MetaMask", "Phantom", "Rainbow", "WalletConnect"].map(
      (n) => screen.getByRole("button", { name: `Continue with ${n}` }),
    );
    expect(names).toHaveLength(4);
  });

  it("reports the pressed wallet's id", () => {
    const props = setup();
    fireEvent.click(screen.getByRole("button", { name: "Continue with Phantom" }));
    expect(props.onWalletLogin).toHaveBeenCalledWith("app.phantom");
  });

  it("is absent when no wallet handler is supplied (flag off)", () => {
    setup({ onWalletLogin: undefined });
    expect(screen.queryByRole("button", { name: /continue with metamask/i })).toBeNull();
  });

  it("disables every other control while one wallet is mid-handshake", () => {
    const props = setup({ busyWallet: "io.metamask" });
    fireEvent.click(screen.getByRole("button", { name: "Continue with Rainbow" }));
    fireEvent.click(screen.getByRole("button", { name: /google/i }));
    expect(props.onWalletLogin).not.toHaveBeenCalled();
    expect(props.onGoogleLogin).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Continue with MetaMask" })).toHaveAttribute("aria-busy", "true");
  });
});

describe("email and socials", () => {
  it("submits a plausible email", () => {
    const props = setup();
    typeEmail("someone@example.com");
    fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));
    expect(props.onEmailSubmit).toHaveBeenCalledWith("someone@example.com");
  });

  it("names a malformed address instead of swallowing the press", () => {
    const props = setup();
    typeEmail("someone@");
    fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));
    expect(props.onEmailSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("That does not look like an email address.");
  });

  it("blocks every path while loading", () => {
    const props = setup({ loading: true });
    typeEmail("someone@example.com");
    fireEvent.click(screen.getByRole("button", { name: /sending code/i }));
    fireEvent.click(screen.getByRole("button", { name: /apple/i }));
    fireEvent.click(screen.getByRole("button", { name: "Continue with MetaMask" }));
    expect(props.onEmailSubmit).not.toHaveBeenCalled();
    expect(props.onAppleLogin).not.toHaveBeenCalled();
    expect(props.onWalletLogin).not.toHaveBeenCalled();
  });
});

describe("modes", () => {
  it("login shows the sign-up footer and links out when there is no in-place switch", () => {
    setup({ signupHref: "https://skai.trade" });
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "https://skai.trade");
    expect(screen.queryByText(/referral code/i)).toBeNull();
    expect(screen.queryByText(/by creating an account/i)).toBeNull();
  });

  it("login switches to sign up in place when a switch handler exists", () => {
    const props = setup({ onSwitchMode: vi.fn() });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(props.onSwitchMode).toHaveBeenCalledWith("signup");
  });

  it("sign up shows the referral row, the terms line and the login footer", () => {
    const props = setup({ mode: "signup", onSwitchMode: vi.fn(), referralCode: "", onReferralCodeChange: vi.fn() });
    expect(screen.getByRole("heading", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByText(/by creating an account/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /referral code/i }));
    fireEvent.change(screen.getByLabelText(/referral code/i), { target: { value: "ALICE" } });
    expect(props.onReferralCodeChange).toHaveBeenCalledWith("ALICE");
    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));
    expect(props.onSwitchMode).toHaveBeenCalledWith("login");
  });

  it("opens the referral field when a code is pre-filled", () => {
    setup({ mode: "signup", referralCode: "ALICE", onReferralCodeChange: vi.fn() });
    expect(screen.getByLabelText(/referral code/i)).toHaveValue("ALICE");
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <AuthModal mode="login" isOpen={false} onClose={() => undefined} onEmailSubmit={() => undefined} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("dismissal", () => {
  it("closes on Escape", () => {
    const props = setup();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * The drag-release regression (bug 232862b0): a click's target is the
   * nearest common ancestor of press and release, so pressing inside the
   * email field and releasing over the backdrop delivers a click whose
   * target IS the backdrop. Only ModalScrim's pointerdown latch tells that
   * apart from a deliberate outside click.
   */
  it("does not close when the press started inside the email field, but still closes on a plain backdrop click", () => {
    const props = setup();
    const backdrop = screen.getByTestId("auth-modal-backdrop");
    const field = screen.getByLabelText(/email address/i);

    fireEvent.pointerDown(field);
    fireEvent.click(backdrop);
    expect(props.onClose).not.toHaveBeenCalled();

    fireEvent.pointerDown(backdrop);
    fireEvent.click(backdrop);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
