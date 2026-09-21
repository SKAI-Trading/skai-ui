/**
 * AuthModal — the "Login" and "Sign up" screens with the wallet row.
 *
 * Figma (Skai-Web-App 3sSzw1KewMtUbeLAv7uW0r). Measured 2026-09-18 against the
 * in-context modals, which govern over the standalone components: 448x652 at
 * 1440 (10734:74251 on board 10734:73582), 468x578 at 768 (11189:4066 on
 * 11220:175352) and 358x526 at 375 (11225:183084 on 11225:182385). The
 * referral-open twins are 10734:76229, 11191:4541 and 11225:183983.
 *
 * The three steps are 375 / 768 / 1440 against base / md: / lg:. Nothing here
 * uses sm: — 640 matches no board.
 *
 * Two things the standalone Signup ALT (10734:74426) draws that no in-context
 * frame does: the socials stacked as "Continue with Google" / "Continue with
 * Apple", and its own type step. Every in-context board draws them side by side
 * with the short labels, so that is what is built. Login ALT (10734:74595)
 * likewise draws a password field and stacked socials that no Login board and
 * no auth strategy has.
 *
 * Login ALT read in full 2026-09-19, and the 34 it is taller than the in-context
 * Login accounts for both: 448x686 against 518, which is exactly the second
 * 400x88 field group plus its 24 gap, plus the 56 the socials gain by stacking
 * (two 400x48 on an 8 gap where the boards put two 196x48 side by side). Every
 * other measure agrees with what is built — 24 all round, 40 at the foot, the
 * 36 title, the 62 Continue, the OR rules at 171.5 either side of a 19 gap, the
 * four 94x48 wallet buttons. Its consent row (10734:74618) is hidden, as the
 * boards' are.
 *
 * The title row's left 16 is a balancing slot, not a control: on every board the
 * glyph sitting there is the close mark at opacity 0, while the live close is
 * the one at the right. Drawing nothing there is the same pixels.
 *
 * Opening the referral row is not a disclosure between the hairlines: the two
 * rules go away and the row becomes the same labelled field group as the email
 * one, whose label gains "(optional)" (11225:184114, 11191:4665, 10734:81012).
 *
 * Both modes share one body: email field, Continue, OR, Google | Apple, four
 * wallet buttons. Sign up adds the referral row above Continue and the terms
 * line under the footer. The parent owns every handshake; this component only
 * reports which control was pressed. `loading` and `busyWallet` are the only
 * gates — the frames have no consent checkbox.
 *
 * While a wallet handshake is in flight the 768 and 375 boards draw a sheet
 * across the bottom of the screen (11229:191700, 11229:192093) — the wallet's
 * mark at 100, "Requesting Signature" and one line of instruction. The 1440
 * board draws nothing extra, because there the wallet is a browser extension
 * and the popup is its own window; that is why the sheet stops at lg rather
 * than for any layout reason.
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { AppleIcon, GoogleBrandIcon } from "./auth-provider-icons";
import {
  AUTH_WALLET_ICONS,
  AUTH_WALLET_IDS,
  AUTH_WALLET_LABELS,
  type AuthWalletId,
} from "./auth-wallet-icons";
import { ModalScrim } from "./ModalScrim";

export type AuthModalMode = "login" | "signup";

export interface AuthModalProps {
  mode: AuthModalMode;
  isOpen: boolean;
  onClose: () => void;
  /** Submit the typed email — the parent sends the verification code. */
  onEmailSubmit: (email: string) => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  /** Start a wallet handshake. Omit it to hide the wallet row. */
  onWalletLogin?: (id: AuthWalletId) => void;
  /** The wallet whose handshake is in flight; it shows a spinner, the rest lock. */
  busyWallet?: AuthWalletId | null;
  /**
   * Abandon the handshake `busyWallet` names — the back control on the sheet.
   * Without it the sheet draws the frame's balanced slot and offers no control,
   * rather than a door that opens onto nothing; the modal's own close stays
   * live either way.
   */
  onWalletCancel?: () => void;
  /** Switch modes in place. Without it, login links out to `signupHref`. */
  onSwitchMode?: (mode: AuthModalMode) => void;
  signupHref?: string;
  loginHref?: string;
  /** Sign up only. Controlled so the parent can seed it from a stored referrer. */
  referralCode?: string;
  onReferralCodeChange?: (code: string) => void;
  /** An email send is in flight; every control locks. */
  loading?: boolean;
  error?: string;
  termsHref?: string;
  privacyHref?: string;
  initialEmail?: string;
  className?: string;
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
    <path d="M2 2L14 14M14 2L2 14" />
  </svg>
);

/** icons/action chevron, 16px — the referral row's disclosure glyph. */
const ChevronIcon: React.FC<{ className?: string; open: boolean }> = ({ className, open }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(className, "transition-transform", open && "rotate-180")}
    aria-hidden="true"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

/** The return arrow beside ENTER in the focused email field. */
const ReturnIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M14 3v3.5a2.5 2.5 0 01-2.5 2.5H3M5.5 6.5L3 9l2.5 2.5" />
  </svg>
);

/** icons/action back, 16px — the handshake sheet's left glyph (asset bc7eb). */
const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
    <path d="M11.0605 2.35352L5.41406 8L11.0605 13.6465L10.3535 14.3535L4 8L10.3535 1.64648L11.0605 2.35352Z" />
  </svg>
);

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/** Paragraph 2: 12/14 at 375, 12/16 at 768, 14/18 at 1440. */
const PARAGRAPH_2 =
  "font-manrope text-[12px] font-normal leading-[14px] tracking-[-0.48px] md:leading-[16px] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]";

/** Paragraph 1: 14/16 at 375, 14/18 at 768, 16/22 at 1440. */
const PARAGRAPH_1 =
  "font-manrope text-[14px] font-normal leading-[16px] tracking-[-0.56px] md:leading-[18px] lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]";

/**
 * The field box. The frames state its height rather than deriving it from the
 * padding — 48 / 50 / 62 — so it is written that way here; a border and the
 * ascender of a 16px line would otherwise carry it past the drawn box.
 *
 * The hairline is an inset ring rather than a border because the frames draw
 * their strokes inside the box: a border would sit outside the 16 of padding
 * and push the content in by 17. The ring also lets focus thicken it to the
 * 1.5 the frames use without moving anything.
 */
const FIELD_BOX =
  "flex h-12 w-full items-center gap-2 rounded-[12px] bg-[#001615] px-4 shadow-[inset_0_0_0_1px_#123f3c] transition-shadow md:h-[50px] lg:h-[62px] lg:rounded-[16px] lg:px-5";

/** The bare control inside a field box: no chrome of its own. */
const FIELD_INPUT =
  "min-w-0 flex-1 bg-transparent text-white placeholder:text-[#95a09f] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

/** Label rows sit on the field's own horizontal inset, not the modal's. */
const FIELD_LABEL_ROW = "flex w-full items-center px-4 lg:px-5";

/**
 * Green Coal 300 pill. 40 tall at 375 and 42 at 768, both under the 44px touch
 * floor `index.css` puts on every button below 768 — hence `no-min-size`, which
 * the floor honours.
 */
const SOCIAL_BUTTON =
  "no-min-size flex flex-1 min-w-0 items-center justify-center gap-3 rounded-[12px] bg-[#001615] px-4 py-3 text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 md:gap-2.5 md:px-6 lg:rounded-[16px] lg:px-10";

/** Same pill, icon only: 16px logo at 375 and 768, 24 at 1440. */
const WALLET_BUTTON =
  "no-min-size flex flex-1 min-w-0 items-center justify-center rounded-[12px] bg-[#001615] px-4 py-3 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 lg:rounded-[16px] lg:px-10";

const BRAND_ICON = "h-4 w-4 shrink-0 lg:h-6 lg:w-6";

const LINK = "text-[#56C7F3] underline-offset-2 hover:underline";

/**
 * The sheet that waits on a wallet, across the bottom of the screen.
 *
 * 374x262 at 375 (11229:192093) and 768x288 at 768 (11229:191700): Green Coal
 * 200 under a Green Coal 100 hairline, the top corners on 20 / 26, the drop
 * shadow thrown upwards, px 12/16, pt 12/16, pb 32/48, everything centred on a
 * 24 gap. Then the title row on its own 16 gap, the mark boxed at 100 on a 2px
 * white stroke over Green Coal 300, and the two lines 8 apart.
 *
 * The title is the wallet's own name — the board titles it MetaMask, which is
 * the wallet its own instance was pressed with, so it reads from the id rather
 * than from the frame. The right-hand 16 is the frame's balancing slot and
 * holds no control (the board's glyph there sits at opacity 0).
 */
const HandshakeSheet: React.FC<{
  wallet: AuthWalletId;
  onBack?: () => void;
}> = ({ wallet, onBack }) => {
  const Mark = AUTH_WALLET_ICONS[wallet];
  const label = AUTH_WALLET_LABELS[wallet];
  return (
    <div
      role="status"
      data-testid="auth-wallet-handshake"
      className="fixed inset-x-0 bottom-0 z-[10001] flex flex-col items-center gap-6 rounded-t-[20px] bg-[#122524] px-3 pb-8 pt-3 shadow-[inset_0_0_0_1px_#123f3c,0px_-10px_80px_0px_rgba(0,0,0,0.25)] md:rounded-t-[26px] md:px-4 md:pb-12 md:pt-4 lg:hidden"
    >
      <div className="flex w-full items-center gap-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label={`Stop connecting to ${label}`}
            className="no-min-size flex h-4 w-4 shrink-0 items-center justify-center text-white transition-opacity hover:opacity-70"
          >
            <BackIcon className="h-4 w-4" />
          </button>
        ) : (
          <span className="h-4 w-4 shrink-0" aria-hidden />
        )}
        <p className="font-manrope min-w-0 flex-1 text-center text-[20px] font-light leading-[24px] tracking-[-0.8px] text-white md:text-[24px] md:leading-[28px] md:tracking-[-0.96px]">
          {label}
        </p>
        <span className="h-4 w-4 shrink-0" aria-hidden />
      </div>

      <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-[12px] border-2 border-white bg-[#001615]">
        <Mark className="h-[72px] w-[72px]" />
      </div>

      <div className="flex w-full flex-col items-center gap-2 text-center">
        <p className="font-manrope text-[18px] font-normal leading-[22px] tracking-[-0.72px] text-white">
          Requesting Signature
        </p>
        <p className="font-manrope text-[14px] font-normal leading-[16px] tracking-[-0.56px] text-[#95a09f] md:leading-[18px]">
          Please sign in to connect.
        </p>
      </div>
    </div>
  );
};

export function AuthModal({
  mode,
  isOpen,
  onClose,
  onEmailSubmit,
  onGoogleLogin,
  onAppleLogin,
  onWalletLogin,
  busyWallet = null,
  onWalletCancel,
  onSwitchMode,
  signupHref = "https://skai.trade",
  loginHref = "https://skai.trade",
  referralCode,
  onReferralCodeChange,
  loading = false,
  error,
  termsHref = "/terms",
  privacyHref = "/privacy",
  initialEmail = "",
  className,
}: AuthModalProps) {
  const [email, setEmail] = React.useState(initialEmail);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [referralOpen, setReferralOpen] = React.useState(Boolean(referralCode));
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setEmailError(null);
      inputRef.current?.focus();
    }
    // Re-seeding while the user types would fight them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  React.useEffect(() => {
    if (referralCode) setReferralOpen(true);
  }, [referralCode]);

  if (!isOpen) return null;

  const isSignup = mode === "signup";
  const blocked = loading || busyWallet !== null;
  const showReferral = isSignup && typeof onReferralCodeChange === "function";

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (blocked) return;
    const address = email.trim();
    if (!address) {
      setEmailError("Enter your email address to continue.");
      inputRef.current?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setEmailError("That does not look like an email address.");
      inputRef.current?.focus();
      return;
    }
    setEmailError(null);
    onEmailSubmit(address);
  };

  const footer = isSignup ? (
    <>
      Already have an account?{" "}
      {onSwitchMode ? (
        <button type="button" onClick={() => onSwitchMode("login")} disabled={blocked} className={cn("no-min-size", LINK)}>
          Login
        </button>
      ) : (
        <a href={loginHref} className={cn("no-min-size", LINK)}>
          Login
        </a>
      )}
    </>
  ) : (
    <>
      Don&rsquo;t have an account?{" "}
      {onSwitchMode ? (
        <button type="button" onClick={() => onSwitchMode("signup")} disabled={blocked} className={cn("no-min-size", LINK)}>
          Sign up
        </button>
      ) : (
        <a href={signupHref} className={cn("no-min-size", LINK)}>
          Sign up
        </a>
      )}
    </>
  );

  /* ModalScrim owns Escape-to-close and the drag-release guard (bug 232862b0):
     a click landing on the backdrop only dismisses when the PRESS also began
     there, so sweeping a selection out of the email field and letting go past
     the edge cannot discard a half-typed address. A hand-rolled
     `onClick={onClose}` + child `stopPropagation()` looked equivalent but
     isn't — a click's target is the nearest common ancestor of press and
     release, so that pair still closed on a drag-off.

     The sheet sits OUTSIDE the scrim on purpose: the scrim is a padded flex row
     with a backdrop filter, so a child of it can neither sit flush against the
     bottom edge nor escape that padding without cancelling it twice. */
  return (
    <>
      <ModalScrim
        onClose={onClose}
        label={isSignup ? "Sign up" : "Login"}
        testId="auth-modal-backdrop"
        className={cn("z-[10000] bg-[rgba(0,22,21,0.44)] p-2 backdrop-blur-[12px] sm:p-6", className)}
      >
        <div
          /* 358 wide on a 20 radius at 375, 468 on 26 at 768, 448 on 32 at 1440;
             Green Coal 200 under a Green Coal 100 hairline, which is an inset
             ring for the reason FIELD_BOX gives. The top and bottom insets are
             not a pair — 24/24, 16/32, 24/40 across the three. */
          className="relative flex w-full max-w-[358px] flex-col gap-5 rounded-[20px] bg-[#122524] px-2 pb-6 pt-6 shadow-[inset_0_0_0_1px_#123f3c,0px_10px_80px_0px_rgba(0,0,0,0.25)] md:max-w-[468px] md:gap-6 md:rounded-[26px] md:px-4 md:pb-8 md:pt-4 lg:max-w-[448px] lg:rounded-[32px] lg:px-6 lg:pb-10 lg:pt-6"
        >
          {/* Title row: Super-headline 4 300 centred on the modal, with the close
              glyph at the right inset. The frame balances the glyph with an empty
              16px slot on the left; centring the heading puts it in the same
              place without drawing a second box. */}
          <div className="relative flex items-center justify-center">
            <h2
              id="skai-auth-title"
              className="font-manrope text-center text-[20px] font-light leading-[24px] tracking-[-0.8px] text-white md:text-[24px] md:leading-[28px] md:tracking-[-0.96px] lg:text-[32px] lg:leading-[36px] lg:tracking-[-1.28px]"
            >
              {isSignup ? "Sign up" : "Login"}
            </h2>
            {/* Never gated on `loading`: a social popup the user closed without
                answering leaves the handshake pending for up to the parent's
                safety timeout, and a locked X strands them there. Escape has
                always worked during that window; this is the same door. */}
            <button
              type="button"
              onClick={onClose}
              className="no-min-size absolute right-0 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70"
              aria-label="Close"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="font-manrope rounded-[12px] border border-[#FF4444]/30 bg-[#FF4444]/10 px-4 py-3 text-center text-[13px] font-medium leading-[18px] tracking-[-0.52px] text-[#FF4444]"
            >
              {error}
            </p>
          )}

          {/* The modal is one column on a single gap, so the form carries that
              same gap rather than a tighter one with margins on top of it. */}
          <form onSubmit={submitEmail} noValidate className="flex flex-col gap-5 md:gap-6">
            <div className="flex flex-col gap-2">
              <div className={FIELD_LABEL_ROW}>
                <label htmlFor="skai-auth-email" className={cn(PARAGRAPH_2, "text-white")}>
                  Email address
                </label>
              </div>
              {/* Sign up's focused field draws an App Green ring: 1.5px #17F9B4
                  over the resting 1px #123F3C, on both 10734:74431 and the
                  in-context 10734:74378, with Input hint (dark) under it.

                  The login half is NOT measured, and saying so is the point of
                  this note. Every August Login board draws the field at rest -
                  10730:81195 is a 1px #123F3C box holding the placeholder
                  example@provider.com in #95A09F - so no frame in the governing
                  set shows a focused or filled Login field, and the Sky Blue
                  below is carried from the mode's own accent rather than read
                  off a node. It is one token to change if a board turns up. */}
              <div
                className={cn(
                  FIELD_BOX,
                  isSignup
                    ? "focus-within:shadow-[inset_0_0_0_1.5px_#17F9B4,0px_4px_12px_rgba(0,0,0,0.24)]"
                    : "focus-within:shadow-[inset_0_0_0_1.5px_#56C7F3]",
                )}
              >
                <input
                  ref={inputRef}
                  id="skai-auth-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(null);
                  }}
                  disabled={blocked}
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? "skai-auth-email-error" : undefined}
                  placeholder="example@provider.com"
                  className={cn(FIELD_INPUT, PARAGRAPH_1)}
                />
                {/* The key that sends the address, not a second control, so it
                    stays out of the tab order and the form's own submit does
                    the work.

                    Read off the governing board 2026-09-21. The in-context Sign
                    up modal (10734:74251) draws its field holding an address
                    with a 16 icons/action and the word ENTER 8 apart at the
                    right edge, Manrope Regular 16/22 at -0.64, uppercase, in
                    App Green 300 #17F9B4 - the same accent as that field's
                    1.5px ring, and opaque, so this is a state the set draws
                    rather than one inferred from a hidden node. The May node
                    2005:10011 describes the same affordance in Sky Blue but
                    sits at opacity 0 on its own board; the August set governs,
                    so the hint takes the mode's own accent, green on sign up
                    and the login field's blue on login. */}
                {email.trim() !== "" && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      PARAGRAPH_1,
                      "flex shrink-0 items-center gap-2 uppercase",
                      isSignup ? "text-[#17F9B4]" : "text-[#56C7F3]",
                    )}
                  >
                    <ReturnIcon className="h-4 w-4" />
                    ENTER
                  </span>
                )}
              </div>
              {emailError && (
                <p
                  id="skai-auth-email-error"
                  role="alert"
                  className={cn(PARAGRAPH_2, "px-4 text-[#FF4444] lg:px-5")}
                >
                  {emailError}
                </p>
              )}
            </div>

            {showReferral &&
              (referralOpen ? (
                /* Open (11225:184114 and twins): the rules are gone and this is
                   the email field's own group — label row, 8, field — with the
                   word the collapsed row leaves off. */
                <div className="flex flex-col gap-2">
                  <div className={cn(FIELD_LABEL_ROW, "justify-between")}>
                    <label htmlFor="skai-auth-referral" className={cn(PARAGRAPH_2, "text-white")}>
                      Referral code (optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => setReferralOpen(false)}
                      disabled={blocked}
                      aria-expanded
                      aria-controls="skai-auth-referral"
                      aria-label="Hide the referral field"
                      className="no-min-size flex h-4 w-4 shrink-0 items-center justify-center text-white disabled:opacity-50"
                    >
                      <ChevronIcon className="h-4 w-4" open />
                    </button>
                  </div>
                  <div className={cn(FIELD_BOX, "focus-within:shadow-[inset_0_0_0_1.5px_#56C7F3]")}>
                    <input
                      id="skai-auth-referral"
                      type="text"
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      value={referralCode ?? ""}
                      onChange={(e) => onReferralCodeChange?.(e.target.value)}
                      disabled={blocked}
                      placeholder="Enter referral code"
                      className={cn(FIELD_INPUT, PARAGRAPH_1)}
                    />
                  </div>
                </div>
              ) : (
                /* Collapsed (10734:74413 and twins): a hairline above and below,
                   16 of air on each side of the row. The frames draw both rules
                   as zero-height vectors, so Frame 197 is 16 + line + 16 and
                   nothing more: 48 at 375 and 768 (11225:183090, 11189:4072),
                   50 at 1440 (10734:74425). A border-y added its own 2px on top of that and
                   let everything below the row sit 2px low, so the rules are
                   inset rings, drawn inside the box as FIELD_BOX draws its. */
                <div
                  data-testid="auth-referral-row"
                  className="flex flex-col shadow-[inset_0_1px_0_#123f3c,inset_0_-1px_0_#123f3c]"
                >
                  <button
                    type="button"
                    onClick={() => setReferralOpen(true)}
                    disabled={blocked}
                    aria-expanded={false}
                    aria-controls="skai-auth-referral"
                    className={cn(
                      PARAGRAPH_2,
                      "flex w-full items-center justify-between px-4 py-4 text-left text-white disabled:opacity-50 lg:px-5",
                    )}
                  >
                    Referral code
                    <ChevronIcon className="h-4 w-4 shrink-0 text-white" open={false} />
                  </button>
                </div>
              ))}

            <button
              type="submit"
              disabled={blocked}
              className={cn(
                PARAGRAPH_1,
                "no-min-size w-full rounded-[12px] bg-[#56C7F3] px-4 py-[14px] text-center text-[#001615] transition-all hover:bg-[#56C7F3]/90 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-4 lg:rounded-[16px] lg:px-10 lg:py-5",
              )}
            >
              {loading ? "Sending code…" : "Continue"}
            </button>
          </form>

          {/* Frame 168: rules either side of the word on a 19 gap, and the row
              is as tall as the word's own line box - 16 / 16 / 18 across the
              three on Login (11225:187069, 11225:178226, 10730:81197). At 375
              that is a 16 where Paragraph 2 gives 14 everywhere else on the
              modal, so Login states the leading rather than taking it from the
              ramp; it was the two pixels between a rendered 410 and the
              frame's 412.

              Sign up does NOT share that 16. Its 375 board draws the row
              342x14 with the word on a 14 line (11225:183099), so the override
              is Login's alone and Sign up keeps the ramp; the referral-open
              board draws the same 14 (11225:183998). The condition is the
              frames disagreeing by mode, not a leftover. 768 and 1440 agree
              across the modes. */}
          <div className="flex items-center gap-[19px]">
            <span className="h-px flex-1 bg-[#123f3c]" aria-hidden />
            <span
              data-testid="auth-or-word"
              className={cn(PARAGRAPH_2, !isSignup && "leading-[16px]", "text-[#95a09f]")}
            >
              OR
            </span>
            <span className="h-px flex-1 bg-[#123f3c]" aria-hidden />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onGoogleLogin}
                disabled={blocked || !onGoogleLogin}
                className={cn(SOCIAL_BUTTON, PARAGRAPH_1)}
              >
                <GoogleBrandIcon className={BRAND_ICON} />
                Google
              </button>
              <button
                type="button"
                onClick={onAppleLogin}
                disabled={blocked || !onAppleLogin}
                className={cn(SOCIAL_BUTTON, PARAGRAPH_1)}
              >
                <AppleIcon className={BRAND_ICON} />
                Apple
              </button>
            </div>

            {onWalletLogin && (
              <div className="flex gap-2" role="group" aria-label="Continue with a wallet">
                {AUTH_WALLET_IDS.map((id) => {
                  const Icon = AUTH_WALLET_ICONS[id];
                  const busy = busyWallet === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onWalletLogin(id)}
                      disabled={blocked}
                      aria-busy={busy || undefined}
                      aria-label={`Continue with ${AUTH_WALLET_LABELS[id]}`}
                      className={WALLET_BUTTON}
                    >
                      {busy ? <SpinnerIcon className={cn(BRAND_ICON, "text-[#56C7F3]")} /> : <Icon className={BRAND_ICON} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <p className={cn(PARAGRAPH_2, "text-center text-[#E0E0E0]")}>{footer}</p>

          {isSignup && (
            <p className={cn(PARAGRAPH_2, "mx-auto max-w-[314px] text-center text-[#E0E0E0]")}>
              By creating an account, you agree to Skai&rsquo;s{" "}
              <a href={privacyHref} target="_blank" rel="noreferrer" className={cn("no-min-size", LINK)}>
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href={termsHref} target="_blank" rel="noreferrer" className={cn("no-min-size", LINK)}>
                Terms of Service
              </a>
            </p>
          )}
        </div>
      </ModalScrim>

      {busyWallet && onWalletLogin && <HandshakeSheet wallet={busyWallet} onBack={onWalletCancel} />}
    </>
  );
}

export default AuthModal;
