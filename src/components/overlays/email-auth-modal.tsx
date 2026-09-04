/**
 * EmailAuthModal — the "Log in or sign up" screen. Figma 2086:29529
 * (Skai-Web-App 3sSzw1KewMtUbeLAv7uW0r, frame 2086:28860).
 *
 * Why this is a NEW component and not a variant of WaitlistModal
 * -------------------------------------------------------------
 * `waitlist-modal.tsx` is a different frame (2005:9995): it captures an address
 * for the skai.trade waitlist, has an in-field enter affordance, a Discord
 * option, and no consent control. This one signs a user INTO the app. The two
 * share the modal shell and the provider glyphs (`auth-provider-icons.tsx`) and
 * nothing else. It is also NOT a fork of `email-verification-modal.tsx` — that
 * is the NEXT step of the same flow (2005:12217) and is reused as-is.
 *
 * Breakpoints — read this before "fixing" a number
 * ------------------------------------------------
 * Only the 1440 frame was supplied with the reports (5f0f0ff7 / 06f3a1a8 /
 * aa3f3919). Every `lg:` value below is MEASURED from 2086:29529. The base and
 * `md:` steps are DERIVED — they follow the ratios `email-verification-modal`
 * established from its own measured 375/768/1440 frames, so the two screens of
 * one flow scale together. They are not claimed as Figma-exact. If the 375/768
 * sign-in frames turn up, measure and replace them rather than nudging by eye.
 *
 * Consent
 * -------
 * The checkbox is CONTROLLED and gates every sign-in path (email and both
 * socials), because the copy — "By continuing, you agree to…" — covers all
 * three. It is deliberately not defaulted to checked: the parent records the
 * acceptance, so a pre-ticked box would record an attestation the user never
 * made. See `signupConsent.ts` for what gets stored.
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { AppleIcon, GoogleIcon } from "./auth-provider-icons";

// =============================================================================
// TYPES
// =============================================================================

export interface EmailAuthModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal closes (scrim click or the X) */
  onClose: () => void;
  /** Submit the typed email — the parent sends the verification code */
  onEmailSubmit: (email: string) => void;
  /** Start Google OAuth */
  onGoogleLogin?: () => void;
  /** Start Apple OAuth */
  onAppleLogin?: () => void;
  /** Whether consent has been given (controlled) */
  consentAccepted: boolean;
  /** Consent checkbox toggled */
  onConsentChange: (accepted: boolean) => void;
  /** Whether a sign-in attempt is in flight */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Href for the Terms link */
  termsHref?: string;
  /** Href for the Privacy link */
  privacyHref?: string;
  /** Initial email value */
  initialEmail?: string;
  /** Custom class name */
  className?: string;
}

// =============================================================================
// ICONS
// =============================================================================

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M2 2L14 14M14 2L2 14" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M2 6.5L4.5 9L10 3.5" />
  </svg>
);

// =============================================================================
// COMPONENT
// =============================================================================

export function EmailAuthModal({
  isOpen,
  onClose,
  onEmailSubmit,
  onGoogleLogin,
  onAppleLogin,
  consentAccepted,
  onConsentChange,
  loading = false,
  error,
  termsHref = "/terms",
  privacyHref = "/privacy",
  initialEmail = "",
  className,
}: EmailAuthModalProps) {
  const [email, setEmail] = React.useState(initialEmail);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setEmailError(null);
      inputRef.current?.focus();
    }
    // `initialEmail` is intentionally not a dependency: re-seeding the field
    // while the user is typing would fight them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  // One gate for all three sign-in paths. `loading` also blocks re-entry so a
  // double-click can't start two handshakes.
  const blocked = loading || !consentAccepted;

  // Continue carries its full Sky Blue whether or not an address has been typed
  // — 3023:12591 draws it that way over an empty field, and a control that looks
  // spent before anyone has done anything wrong reads as broken. An empty or
  // malformed address is answered here, next to the field, rather than by a
  // button that cannot be pressed.
  //
  // `blocked` still dims it, and that dimming is not the same thing: consent is
  // an attestation the user has to make, so until they make it there is nothing
  // to submit and the button says so.
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

  return (
    <div
      className={cn(
        "fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-6",
        className,
      )}
      style={{ background: "rgba(0, 22, 21, 0.44)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Log in or sign up"
        /* 2086:29529 — 448 wide, 24px radius step (32 at lg), #122524 on a
           #123f3c hairline, and an asymmetric 24/40 vertical inset: the frame
           pads the top by 24 and the floor by 40. */
        className="relative flex w-full max-w-[358px] flex-col gap-4 rounded-[20px] border border-[#123f3c] bg-[#122524] px-4 pb-6 pt-4 shadow-[0px_10px_80px_0px_rgba(0,0,0,0.25)] md:max-w-[468px] md:gap-5 md:rounded-[28px] md:px-5 md:pb-8 md:pt-5 lg:max-w-[448px] lg:gap-6 lg:rounded-[32px] lg:px-6 lg:pb-10 lg:pt-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls — close only; this is the first screen, so there is no Back. */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-4 w-4 items-center justify-center text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Header — Lg/Super-headline 4 300 (Manrope Light 32/36 at -4%) over
            Lg/Sub-headline 2 300 (Manrope Regular 18/24 at -4%), 16px apart. */}
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <h2 className="font-manrope w-full text-center text-[24px] font-light leading-[28px] tracking-[-0.96px] text-white md:text-[28px] md:leading-[32px] md:tracking-[-1.12px] lg:text-[32px] lg:leading-[36px] lg:tracking-[-1.28px]">
            Log in or sign up
          </h2>
          <p className="font-manrope w-full text-center text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-[#E0E0E0] md:text-[16px] md:leading-[22px] md:tracking-[-0.64px] lg:text-[18px] lg:leading-[24px] lg:tracking-[-0.72px]">
            Continue to Skai with your email.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="font-manrope rounded-[12px] border border-[#FF4444]/30 bg-[#FF4444]/10 px-4 py-3 text-center text-[13px] font-medium leading-[18px] tracking-[-0.52px] text-[#FF4444]"
          >
            {error}
          </p>
        )}

        {/* Email field — label 20px in from the modal edge per the frame's
            `label` row, field is Green Coal 300 on a Green Coal 100 hairline. */}
        {/* `noValidate`: the browser's own bubble for a malformed address is
            unstyled, positioned by the UA and worded by the locale, none of
            which this modal controls. The message below the field is ours. */}
        <form onSubmit={submitEmail} noValidate className="flex flex-col gap-2">
          <label
            htmlFor="skai-auth-email"
            className="font-manrope px-4 text-[12px] font-normal leading-[16px] tracking-[-0.48px] text-white md:px-5 md:text-[13px] lg:px-5 lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]"
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
            disabled={loading}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "skai-auth-email-error" : undefined}
            placeholder="example@provider.com"
            className="font-manrope w-full rounded-[12px] border border-[#123f3c] bg-[#001615] px-4 py-3.5 text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-white transition-colors placeholder:text-[#95a09f] focus:border-[#56C7F3] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] md:px-5 md:py-4 md:text-[15px] md:leading-[21px] lg:rounded-[16px] lg:p-5 lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]"
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

          {/* Continue — Primary/Sky Blue 300 on Green Coal 300 text. */}
          <button
            type="submit"
            disabled={blocked}
            className="font-manrope mt-2 w-full rounded-[12px] bg-[#56C7F3] px-6 py-[14px] text-center text-[14px] font-normal leading-[16px] tracking-[-0.56px] text-[#001615] transition-all hover:bg-[#56C7F3]/90 disabled:cursor-not-allowed disabled:opacity-50 md:mt-3 md:rounded-[14px] md:px-10 md:py-4 md:text-[16px] md:leading-[22px] md:tracking-[-0.64px] lg:mt-4 lg:rounded-[16px] lg:px-10 lg:py-5"
          >
            {loading ? "Sending code…" : "Continue"}
          </button>
        </form>

        {/* OR — hairlines either side, App/Ash 300 label. */}
        <div className="flex items-center gap-3 lg:gap-[19px]">
          <span className="h-px flex-1 bg-[#123f3c]" aria-hidden />
          <span className="font-manrope text-[12px] font-normal leading-[16px] tracking-[-0.48px] text-[#95a09f] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]">
            OR
          </span>
          <span className="h-px flex-1 bg-[#123f3c]" aria-hidden />
        </div>

        {/* Socials — outlined Sky Blue, 1.5px border per 2086:29544/29545. */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onGoogleLogin}
            disabled={blocked || !onGoogleLogin}
            className="font-manrope flex flex-1 min-w-0 items-center justify-center gap-2.5 rounded-[12px] border-[1.5px] border-[#56C7F3] bg-[#001615] px-4 py-3.5 text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-[#56C7F3] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] md:py-4 md:text-[15px] lg:rounded-[16px] lg:py-5 lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]"
          >
            <GoogleIcon className="h-5 w-5 shrink-0 lg:h-6 lg:w-6" />
            Google
          </button>
          <button
            type="button"
            onClick={onAppleLogin}
            disabled={blocked || !onAppleLogin}
            className="font-manrope flex flex-1 min-w-0 items-center justify-center gap-2.5 rounded-[12px] border-[1.5px] border-[#56C7F3] bg-[#001615] px-4 py-3.5 text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-[#56C7F3] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] md:py-4 md:text-[15px] lg:rounded-[16px] lg:py-5 lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]"
          >
            <AppleIcon className="h-5 w-5 shrink-0 lg:h-6 lg:w-6" />
            Apple
          </button>
        </div>

        {/* Consent — 24px box, 14px gutter to the copy (2088:3161 / 2200:1164). */}
        <div className="flex items-start gap-3 lg:gap-[14px]">
          <button
            type="button"
            role="checkbox"
            aria-checked={consentAccepted}
            aria-labelledby="skai-auth-consent-copy"
            onClick={() => onConsentChange(!consentAccepted)}
            disabled={loading}
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-[8px] border-[1.333px] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              consentAccepted
                ? "border-[#56C7F3] bg-[#56C7F3] text-[#001615]"
                : "border-[#123f3c] bg-black text-transparent",
            )}
          >
            <CheckIcon className="h-3 w-3" />
          </button>
          <p
            id="skai-auth-consent-copy"
            className="font-manrope flex-1 text-[12px] font-normal leading-[16px] tracking-[-0.48px] text-[#E0E0E0] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]"
          >
            By continuing, you agree to the{" "}
            <a href={termsHref} target="_blank" rel="noreferrer" className="text-[#56C7F3] underline-offset-2 hover:underline">
              Terms
            </a>{" "}
            of use and{" "}
            <a href={privacyHref} target="_blank" rel="noreferrer" className="text-[#56C7F3] underline-offset-2 hover:underline">
              Privacy
            </a>{" "}
            policy of this platform and are not located in a restricted jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailAuthModal;
