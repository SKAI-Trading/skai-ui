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

  // 16 square below lg and 24 square from it, on every mark. At 1440 the pill
  // is 94 wide on 40 of side padding, a 14px content box, so a mark that can be
  // capped at its container's width draws 14x24 (report 24b031c0).
  it("gives all four marks one square box, and no mark a width cap", () => {
    setup();
    for (const n of ["MetaMask", "Phantom", "Rainbow", "WalletConnect"]) {
      const mark = screen.getByRole("button", { name: `Continue with ${n}` }).firstElementChild!;
      const classes = (mark.getAttribute("class") ?? "").split(/\s+/);
      expect(classes, n).toEqual(expect.arrayContaining(["h-4", "w-4", "shrink-0", "lg:h-6", "lg:w-6"]));
      if (mark.tagName === "IMG") expect(classes, n).toContain("max-w-none");
    }
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

// Report 6dbf34d9, the short-window half: centred in a scrim that could not
// scroll, a modal taller than the window lost its title off the top for good.
// jsdom has no layout, so this pins the two classes that make it scroll from
// the title (measured in Chromium at 1498x560: the panel opens at the scrim's
// 24 and scrolls to its last line; at 900 it is centred as before).
describe("a window shorter than the modal", () => {
  it("scrolls the scrim, and the panel's auto margins give way to its top edge", () => {
    setup({ mode: "signup" });
    const scrim = screen.getByTestId("auth-modal-backdrop");
    const panel = screen.getByTestId("auth-modal-panel");
    expect(scrim.className.split(/\s+/)).toContain("overflow-y-auto");
    expect(panel.className.split(/\s+/)).toContain("my-auto");
    expect(panel.parentElement).toBe(scrim);
  });
});

describe("email and socials", () => {
  it("submits a plausible email", () => {
    const props = setup();
    typeEmail("someone@example.com");
    fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));
    expect(props.onEmailSubmit).toHaveBeenCalledWith("someone@example.com");
  });

  // Report 10dae49d: the ENTER beside a typed address was a drawing, so a
  // click on it did nothing. It sends, through the same checks as Continue,
  // and stays out of the tab order.
  it("sends the address when ENTER in the field is clicked", () => {
    const props = setup({ mode: "signup" });
    typeEmail("someone@example.com");
    const enter = screen.getByTestId("auth-email-enter");
    expect(enter).toHaveTextContent("ENTER");
    expect(enter).toHaveAttribute("tabindex", "-1");
    fireEvent.click(enter);
    expect(props.onEmailSubmit).toHaveBeenCalledWith("someone@example.com");
  });

  it("checks the address on an ENTER click as Continue does", () => {
    const props = setup({ mode: "signup" });
    typeEmail("someone@");
    fireEvent.click(screen.getByTestId("auth-email-enter"));
    expect(props.onEmailSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("That does not look like an email address.");
  });

  it("does not send from ENTER while a code is on its way", () => {
    const props = setup({ mode: "signup", loading: true });
    typeEmail("someone@example.com");
    const enter = screen.getByTestId("auth-email-enter");
    expect(enter).toBeDisabled();
    fireEvent.click(enter);
    expect(props.onEmailSubmit).not.toHaveBeenCalled();
  });

  it("does not send from ENTER while a wallet handshake is pending", () => {
    const props = setup({ mode: "signup", busyWallet: "walletConnect" });
    typeEmail("someone@example.com");
    const enter = screen.getByTestId("auth-email-enter");
    expect(enter).toBeDisabled();
    fireEvent.click(enter);
    expect(props.onEmailSubmit).not.toHaveBeenCalled();
  });

  // ENTER is the form's first submit, so it is also the button Enter in the
  // field presses; it has to be shut whenever Continue is, or one of the two
  // would send while the other refuses.
  it.each([
    ["at rest", {}, false],
    ["while a code is on its way", { loading: true }, true],
    ["while a wallet handshake is pending", { busyWallet: "walletConnect" as const }, true],
  ] as const)("disables ENTER exactly when Continue is disabled, %s", (_state, overrides, disabled) => {
    setup({ mode: "signup", ...overrides });
    typeEmail("someone@example.com");
    const enter = screen.getByTestId("auth-email-enter") as HTMLButtonElement;
    const cont = screen.getByRole("button", { name: /^(continue|sending code…)$/i }) as HTMLButtonElement;
    expect([enter.disabled, cont.disabled]).toEqual([disabled, disabled]);
    expect(enter.form?.querySelector('button[type="submit"]')).toBe(enter);
  });

  // The check inside submitEmail is the one a submit that comes through
  // neither button meets, such as a script's form.requestSubmit().
  it.each([
    ["while a code is on its way", { loading: true }],
    ["while a wallet handshake is pending", { busyWallet: "walletConnect" as const }],
  ] as const)("sends nothing when the form itself is submitted %s", (_state, overrides) => {
    const props = setup({ mode: "signup", ...overrides });
    typeEmail("someone@example.com");
    fireEvent.submit(screen.getByTestId("auth-email-enter").closest("form")!);
    expect(props.onEmailSubmit).not.toHaveBeenCalled();
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

/**
 * jsdom lays nothing out, so these pin the declarations the heights come from.
 * Both regressions are two pixels that move everything under them, and neither
 * shows up in a screenshot unless it is set beside the board.
 */
describe("row heights", () => {
  it("draws the referral rules inside the row, so they add nothing to its height", () => {
    setup({ mode: "signup", referralCode: "", onReferralCodeChange: vi.fn() });
    const row = screen.getByTestId("auth-referral-row");
    expect(row.className).not.toMatch(/\bborder(-[a-z]+)?\b/);
    expect(row.className).toContain("shadow-[inset_0_1px_0_#123f3c,inset_0_-1px_0_#123f3c]");
    expect(screen.getByRole("button", { name: /referral code/i }).className).toContain("py-4");
  });

  it("sets the OR on a 16 line at 375 on Login only; Sign up keeps the ramp's 14", () => {
    setup({ mode: "login" });
    const login = screen.getByTestId("auth-or-word").className;
    expect(login).toContain("leading-[16px]");
    expect(login).not.toContain("leading-[14px]");
    expect(login).toContain("lg:leading-[18px]");
  });

  it("leaves Sign up's OR on Paragraph 2's own 14 / 16 / 18", () => {
    setup({ mode: "signup" });
    const signup = screen.getByTestId("auth-or-word").className;
    expect(signup).toContain("leading-[14px]");
    expect(signup).toContain("md:leading-[16px]");
    expect(signup).toContain("lg:leading-[18px]");
    expect(signup.split(/\s+/)).not.toContain("leading-[16px]");
  });
});

describe("the ENTER hint", () => {
  /**
   * Every in-context field is drawn holding an address, with the return glyph
   * and ENTER beside it in App Green. A click on it sends the form (report
   * 10dae49d), but Continue is the control a keyboard or a screen reader
   * reaches, so ENTER is hidden from the accessibility tree and kept out of the
   * tab order, and it only shows once there is something to send.
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
