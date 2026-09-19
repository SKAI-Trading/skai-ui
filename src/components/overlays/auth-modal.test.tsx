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

describe("the handshake sheet", () => {
  it("stays away until a wallet is actually waiting", () => {
    setup();
    expect(screen.queryByTestId("auth-wallet-handshake")).toBeNull();
  });

  it("names the waiting wallet and says what it is waiting for", () => {
    setup({ busyWallet: "app.phantom" });
    const sheet = screen.getByTestId("auth-wallet-handshake");
    expect(sheet).toHaveTextContent("Phantom");
    expect(sheet).toHaveTextContent("Requesting Signature");
    expect(sheet).toHaveTextContent("Please sign in to connect.");
  });

  it("offers a way back only when the parent can take it", () => {
    setup({ busyWallet: "app.phantom" });
    expect(screen.queryByRole("button", { name: /stop connecting/i })).toBeNull();
  });

  it("reports the back press to the parent", () => {
    const onWalletCancel = vi.fn();
    setup({ busyWallet: "me.rainbow", onWalletCancel });
    fireEvent.click(screen.getByRole("button", { name: "Stop connecting to Rainbow" }));
    expect(onWalletCancel).toHaveBeenCalledTimes(1);
  });

  it("is not drawn when the wallet row itself is off", () => {
    setup({ onWalletLogin: undefined, busyWallet: "io.metamask" });
    expect(screen.queryByTestId("auth-wallet-handshake")).toBeNull();
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

  /**
   * The frames name the row twice over: collapsed it is a bare "Referral code"
   * between two hairlines (10734:74415, 11189:4076, 11225:183094), and open it
   * is a labelled field group whose label carries "(optional)" (11225:184116,
   * 11191:4655). Taking either string for both loses half the frame.
   */
  it("names the referral row one way collapsed and another open, and closes again", () => {
    setup({ mode: "signup", referralCode: "", onReferralCodeChange: vi.fn() });

    const disclosure = screen.getByRole("button", { name: /referral code/i });
    expect(disclosure).toHaveTextContent(/^Referral code$/);

    fireEvent.click(disclosure);
    expect(screen.getByText("Referral code (optional)")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /hide the referral field/i }));
    expect(screen.queryByLabelText(/referral code/i)).toBeNull();
    expect(screen.getByRole("button", { name: /referral code/i })).toHaveTextContent(/^Referral code$/);
  });
});

describe("the ENTER hint", () => {
  /**
   * Every in-context field is drawn holding an address, with the return glyph
   * and ENTER beside it in App Green. It is the key that sends the form, not a
   * second control, so it is hidden from the accessibility tree and only shows
   * once there is something to send.
   */
  it("appears beside a typed address and not before", () => {
    setup();
    expect(screen.queryByText("ENTER")).toBeNull();
    typeEmail("someone@example.com");
    expect(screen.getByText("ENTER")).toHaveAttribute("aria-hidden", "true");
  });

  it("stays away for whitespace alone", () => {
    setup();
    typeEmail("   ");
    expect(screen.queryByText("ENTER")).toBeNull();
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
   * A Google popup the user closes without answering never rejects, so the
   * parent holds `loading` until its own timeout. The X has to stay live
   * through that, the way Escape always has.
   */
  it("closes from the X while a handshake is in flight", () => {
    const props = setup({ loading: true });
    const close = screen.getByRole("button", { name: "Close" });
    expect(close).not.toBeDisabled();
    fireEvent.click(close);
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
