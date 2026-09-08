/**
 * AuthModal — the "Login" and "Sign up" screens with the wallet row.
 *
 * Figma (Skai-Web-App 3sSzw1KewMtUbeLAv7uW0r): components Login ALT 10734:74595
 * and Signup ALT 10734:74426; in context at 1440 in 10730:80518 / 10734:73582 /
 * 10734:76366, at 768 in 11225:178320 / 11220:175352, at 375 in 11225:186385 /
 * 11225:182385. The 1440 values below are measured from those frames; the base
 * and `md:` steps follow the ratios `email-verification-modal` established from
 * its own 375/768/1440 frames, which the 375/768 in-context frames confirm.
 *
 * The standalone Login ALT component draws a password field and stacked social
 * buttons. No in-context frame does, and the auth provider has no password
 * strategy, so the in-context layout is the one built here.
 *
 * Both modes share one body: email field, Continue, OR, Google | Apple, four
 * wallet buttons. Sign up adds the referral row above Continue and the terms
 * line under the footer. The parent owns every handshake; this component only
 * reports which control was pressed. `loading` and `busyWallet` are the only
 * gates — the frames have no consent checkbox.
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

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/** Green Coal 300 pill, white Manrope 16/22 at lg, 12px vertical padding, radius 16. */
const SOCIAL_BUTTON =
  "font-manrope flex flex-1 min-w-0 items-center justify-center gap-2.5 rounded-[12px] bg-[#001615] px-4 py-3 text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] md:text-[15px] lg:rounded-[16px] lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]";

/** Same pill, icon only: 24px logo + 12px vertical padding = the frame's 48px. */
const WALLET_BUTTON =
  "flex flex-1 min-w-0 items-center justify-center rounded-[12px] bg-[#001615] py-3 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] lg:rounded-[16px]";

const LINK = "text-[#56C7F3] underline-offset-2 hover:underline";

export function AuthModal({
  mode,
  isOpen,
  onClose,
  onEmailSubmit,
  onGoogleLogin,
  onAppleLogin,
  onWalletLogin,
  busyWallet = null,
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
        <button type="button" onClick={() => onSwitchMode("login")} disabled={blocked} className={LINK}>
          Login
        </button>
      ) : (
        <a href={loginHref} className={LINK}>
          Login
        </a>
      )}
    </>
  ) : (
    <>
      Don&rsquo;t have an account?{" "}
      {onSwitchMode ? (
        <button type="button" onClick={() => onSwitchMode("signup")} disabled={blocked} className={LINK}>
          Sign up
        </button>
      ) : (
        <a href={signupHref} className={LINK}>
          Sign up
        </a>
      )}
    </>
  );

  return (
    /* ModalScrim owns Escape-to-close and the drag-release guard (bug 232862b0):
       a click landing on the backdrop only dismisses when the PRESS also began
       there, so sweeping a selection out of the email field and letting go past
       the edge cannot discard a half-typed address. A hand-rolled
       `onClick={onClose}` + child `stopPropagation()` looked equivalent but
       isn't — a click's target is the nearest common ancestor of press and
       release, so that pair still closed on a drag-off. */
    <ModalScrim
      onClose={onClose}
      label={isSignup ? "Sign up" : "Login"}
      testId="auth-modal-backdrop"
      className={cn("z-[10000] bg-[rgba(0,22,21,0.44)] p-2 backdrop-blur-[12px] sm:p-6", className)}
    >
      <div
        /* 448 wide at lg, radius 32, Green Coal 200 on a Green Coal 100 hairline,
           24 top / 40 bottom. 358 wide and radius 20 at 375. */
        className="relative flex w-full max-w-[358px] flex-col gap-4 rounded-[20px] border border-[#123f3c] bg-[#122524] px-4 pb-6 pt-4 shadow-[0px_10px_80px_0px_rgba(0,0,0,0.25)] md:max-w-[468px] md:gap-5 md:rounded-[28px] md:px-5 md:pb-8 md:pt-5 lg:max-w-[448px] lg:gap-6 lg:rounded-[32px] lg:px-6 lg:pb-10 lg:pt-6"
      >
        {/* Title row: centred Super-headline 4 300 with the close glyph at the right. */}
        <div className="relative flex items-center justify-center">
          <h2
            id="skai-auth-title"
            className="font-manrope text-center text-[24px] font-light leading-[28px] tracking-[-0.96px] text-white md:text-[28px] md:leading-[32px] md:tracking-[-1.12px] lg:text-[32px] lg:leading-[36px] lg:tracking-[-1.28px]"
          >
            {isSignup ? "Sign up" : "Login"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute right-0 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
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

        <form onSubmit={submitEmail} noValidate className="flex flex-col gap-2">
          <label
            htmlFor="skai-auth-email"
            className="font-manrope px-4 text-[12px] font-normal leading-[16px] tracking-[-0.48px] text-white md:px-5 md:text-[13px] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]"
          >
            Email address
          </label>
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
            /* Sign up's focused field draws a 1.5px App Green ring (10734:74431). */
            className={cn(
              "font-manrope w-full rounded-[12px] border border-[#123f3c] bg-[#001615] px-4 py-3.5 text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-white transition-colors placeholder:text-[#95a09f] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] md:px-5 md:py-4 md:text-[15px] md:leading-[21px] lg:rounded-[16px] lg:p-5 lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]",
              isSignup ? "focus:border-[#17F9B4] focus:shadow-[0px_4px_12px_rgba(0,0,0,0.24)]" : "focus:border-[#56C7F3]",
            )}
          />
          {emailError && (
            <p
              id="skai-auth-email-error"
              role="alert"
              className="font-manrope px-4 text-[12px] font-normal leading-[16px] tracking-[-0.48px] text-[#FF4444] md:px-5 lg:text-[13px] lg:leading-[18px]"
            >
              {emailError}
            </p>
          )}

          {showReferral && (
            /* "Referral code" row: hairlines above and below, collapsed until pressed
               or pre-filled (10734:73582 collapsed, 10734:76366 open). */
            <div className="mt-2 flex flex-col border-y border-[#123f3c]">
              <button
                type="button"
                onClick={() => setReferralOpen((o) => !o)}
                disabled={blocked}
                aria-expanded={referralOpen}
                aria-controls="skai-auth-referral"
                className="font-manrope flex w-full items-center justify-between px-4 py-3 text-left text-[12px] font-normal leading-[16px] tracking-[-0.48px] text-white disabled:opacity-50 md:px-5 lg:py-4 lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]"
              >
                Referral code (optional)
                <ChevronIcon className="h-4 w-4 shrink-0 text-white" open={referralOpen} />
              </button>
              {referralOpen && (
                <div className="pb-3 lg:pb-4">
                  <label htmlFor="skai-auth-referral" className="sr-only">
                    Referral code
                  </label>
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
                    className="font-manrope w-full rounded-[12px] border border-[#123f3c] bg-[#001615] px-4 py-3.5 text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-white placeholder:text-[#95a09f] focus:border-[#56C7F3] focus:outline-none disabled:opacity-50 md:rounded-[14px] md:px-5 md:py-4 lg:rounded-[16px] lg:p-5 lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]"
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={blocked}
            className="font-manrope mt-2 w-full rounded-[12px] bg-[#56C7F3] px-6 py-[14px] text-center text-[14px] font-normal leading-[16px] tracking-[-0.56px] text-[#001615] transition-all hover:bg-[#56C7F3]/90 disabled:cursor-not-allowed disabled:opacity-50 md:mt-3 md:rounded-[14px] md:px-10 md:py-4 md:text-[16px] md:leading-[22px] md:tracking-[-0.64px] lg:mt-4 lg:rounded-[16px] lg:px-10 lg:py-5"
          >
            {loading ? "Sending code…" : "Continue"}
          </button>
        </form>

        <div className="flex items-center gap-3 lg:gap-[19px]">
          <span className="h-px flex-1 bg-[#123f3c]" aria-hidden />
          <span className="font-manrope text-[12px] font-normal leading-[16px] tracking-[-0.48px] text-[#95a09f] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]">
            OR
          </span>
          <span className="h-px flex-1 bg-[#123f3c]" aria-hidden />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button type="button" onClick={onGoogleLogin} disabled={blocked || !onGoogleLogin} className={SOCIAL_BUTTON}>
              <GoogleBrandIcon className="h-5 w-5 shrink-0 lg:h-6 lg:w-6" />
              Google
            </button>
            <button type="button" onClick={onAppleLogin} disabled={blocked || !onAppleLogin} className={SOCIAL_BUTTON}>
              <AppleIcon className="h-5 w-5 shrink-0 lg:h-6 lg:w-6" />
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
                    {busy ? <SpinnerIcon className="h-6 w-6 text-[#56C7F3]" /> : <Icon className="h-6 w-6" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <p className="font-manrope text-center text-[12px] font-normal leading-[16px] tracking-[-0.48px] text-[#E0E0E0] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]">
          {footer}
        </p>

        {isSignup && (
          <p className="font-manrope mx-auto max-w-[314px] text-center text-[12px] font-normal leading-[16px] tracking-[-0.48px] text-[#E0E0E0] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]">
            By creating an account, you agree to Skai&rsquo;s{" "}
            <a href={privacyHref} target="_blank" rel="noreferrer" className={LINK}>
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href={termsHref} target="_blank" rel="noreferrer" className={LINK}>
              Terms of Service
            </a>
          </p>
        )}
      </div>
    </ModalScrim>
  );
}

export default AuthModal;
