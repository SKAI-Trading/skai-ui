/**
 * WaitlistModal - Email capture modal for waitlist signup
 *
 * Features:
 * - Email input with validation
 * - Enter key submit support
 * - Google/Apple login options
 * - Loading state with overlay
 * - SKAI brand styling
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { AppleIcon, GoogleIcon } from "./auth-provider-icons";

// =============================================================================
// TYPES
// =============================================================================

export interface WaitlistModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal closes */
  onClose: () => void;
  /** Callback when email is submitted */
  onEmailSubmit: (email: string) => void;
  /** Callback for Google login */
  onGoogleLogin?: () => void;
  /** Callback for Apple login */
  onAppleLogin?: () => void;
  /** Callback for Discord login */
  onDiscordLogin?: () => void;
  /** Whether in loading state */
  isLoading?: boolean;
  /** Callback to cancel an in-progress auth attempt */
  onCancelAuth?: () => void;
  /** Initial email value */
  initialEmail?: string;
  /** Backend error message to display */
  error?: string;
  /** Custom class name */
  className?: string;
}

// =============================================================================
// ICONS
// =============================================================================

// GoogleIcon / AppleIcon moved to `auth-provider-icons.tsx` so this modal and
// the sign-in modal (email-auth-modal) cannot draw different marks. Imported at
// the top of this file; the glyphs are byte-identical to the ones that lived
// here.

const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
  </svg>
);

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

/**
 * icon/enter — Figma 2005:10012 / 2005:18475 / 2005:28667. Exported vector,
 * 16x16, filled with `currentColor` so it inherits the ENTER label's colour.
 */
const EnterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
    <path
      d="M14.1667 2.66667C14.2993 2.66667 14.4265 2.71935 14.5203 2.81311C14.6141 2.90688 14.6667 3.03406 14.6667 3.16667V7.5C14.6667 8.16304 14.4033 8.79893 13.9345 9.26777C13.4657 9.73661 12.8298 10 12.1667 10H3.05807L5.53807 12.48C5.62265 12.5647 5.67401 12.677 5.68282 12.7964C5.69162 12.9158 5.65729 13.0344 5.58607 13.1307L5.53807 13.1867C5.45337 13.2715 5.341 13.3231 5.22144 13.332C5.10189 13.341 4.9831 13.3067 4.88673 13.2353L4.83073 13.1867L1.4974 9.85333C1.41272 9.76867 1.36124 9.65644 1.3523 9.53703C1.34337 9.41763 1.37759 9.29898 1.44873 9.20267L1.4974 9.14667L4.83073 5.81333C4.92007 5.7247 5.03954 5.673 5.16531 5.66857C5.29107 5.66415 5.41389 5.70731 5.50923 5.78944C5.60458 5.87157 5.66545 5.98664 5.67969 6.11168C5.69393 6.23672 5.6605 6.36253 5.58607 6.464L5.53807 6.52L3.05807 9H12.1681C12.548 8.99988 12.9138 8.85556 13.1915 8.59619C13.4692 8.33683 13.6381 7.98174 13.6641 7.60267L13.6681 7.5V3.16667C13.6681 3.03406 13.7207 2.90688 13.8145 2.81311C13.9083 2.71935 14.0355 2.66667 14.1681 2.66667"
      fill="currentColor"
    />
  </svg>
);

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * WaitlistModal - Email capture modal for waitlist signup
 *
 * @example
 * ```tsx
 * <WaitlistModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onEmailSubmit={(email) => handleSignup(email)}
 *   onGoogleLogin={handleGoogleLogin}
 *   onAppleLogin={handleAppleLogin}
 *   isLoading={loading}
 * />
 * ```
 */
export function WaitlistModal({
  isOpen,
  onClose,
  onEmailSubmit,
  onGoogleLogin,
  onAppleLogin,
  onDiscordLogin,
  isLoading = false,
  onCancelAuth,
  initialEmail = "",
  error,
  className,
}: WaitlistModalProps) {
  const [email, setEmail] = React.useState(initialEmail);
  const [emailError, setEmailError] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Simple email format validation
  const isValidEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // Clear local validation error when backend error arrives
  React.useEffect(() => {
    if (error) {
      setEmailError("");
    }
  }, [error]);

  // Reset email and error when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setEmailError("");
      // Focus the input when modal opens
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialEmail]);

  // Clear error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  const validateAndSubmit = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Please enter your email address.");
      inputRef.current?.focus();
      return;
    }
    if (!isValidEmail(trimmed)) {
      setEmailError("Please enter a valid email address.");
      inputRef.current?.focus();
      return;
    }
    setEmailError("");
    onEmailSubmit(trimmed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      validateAndSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6",
        className
      )}
      style={{
        background: "rgba(0, 22, 21, 0.44)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[10001] flex flex-col items-center justify-center gap-3 bg-[#001615]/80">
          <SpinnerIcon className="h-8 w-8 text-[#2DEDAD]" />
          <p className="font-manrope text-sm text-white/70">Authenticating...</p>
          {onCancelAuth && (
            <button
              onClick={onCancelAuth}
              className="font-manrope mt-1 text-xs text-white/40 underline transition-colors hover:text-white/70"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Modal Container */}
      <div
        className="relative w-full max-w-[358px] rounded-[20px] border border-[#123f3c] bg-[#122524] p-4 shadow-[0px_10px_80px_0px_rgba(0,0,0,0.25)] md:max-w-[468px] md:rounded-[28px] md:p-4 lg:max-w-[448px] lg:rounded-[32px] lg:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="mb-4 flex justify-end md:mb-6 lg:mb-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex h-4 w-4 items-center justify-center text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        <h2 className="font-manrope mb-3 text-center text-[24px] font-light leading-[28px] tracking-[-0.96px] text-white md:mb-4 md:text-[28px] md:leading-[32px] md:tracking-[-1.12px] lg:mb-4 lg:text-[32px] lg:leading-[36px] lg:tracking-[-1.28px]">
          Get early access to Skai
        </h2>

        {/* Description — Figma 2005:10003. Full-width (the frame's text box is
            the modal's 400px content width, with no inner inset) and tracked at
            -4% like every other Manrope run in the frame. The old px-2/px-4
            inset narrowed it to 366px and re-wrapped the sentence. The 24px gap
            down to the email field is the modal's own flex gap in Figma. */}
        <p className="font-manrope mb-6 text-center text-[14px] font-normal leading-[20px] tracking-[-0.04em] text-[#E0E0E0] md:mb-6 md:text-[16px] md:leading-[22px] lg:mb-6 lg:text-[18px] lg:leading-[24px]">
          Enter your email address to get access to join the Skai waitlist.
        </p>

        {/* Backend Error */}
        {error && (
          <div
            className="font-manrope mb-4 rounded-[12px] border border-[#FF7E50]/30 bg-[#FF7E50]/10 px-4 py-3 text-center text-[13px] font-normal leading-[18px] text-[#FF7E50]"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit}>
          {/* 24px down to the Continue button — Figma 2005:9995 lays the modal
              out as a 24px-gap column; this was 20px. */}
          <div className="mb-4 md:mb-6 lg:mb-6">
            {/* Email Label — Figma 2005:10007, Manrope Regular 14/18 at -4%. */}
            <label className="font-manrope mb-2 block px-4 text-[10px] font-normal leading-[14px] tracking-[-0.04em] text-white md:px-5 md:text-[12px] md:leading-[16px] lg:px-[22px] lg:text-[14px] lg:leading-[18px]">
              Email address
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={handleEmailChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="example@provider.com"
                autoComplete="email"
                /* Figma 2005:10008 — 22px padding all round (66px tall at
                   16/22 type, not 64), and the placeholder is App/Ash 300
                   #95A09F. #5d6b6a sat well under the frame's contrast. */
                className={cn(
                  /* pr-* reserves the enter affordance's column (its own width
                     plus the 8px gutter plus the field padding) so a long email
                     scrolls behind nothing — the frame lays the field out as a
                     two-up row for the same reason. */
                  "font-manrope w-full rounded-[12px] border bg-[#001615] px-4 py-3.5 pr-[88px] text-[14px] font-normal leading-[20px] tracking-[-0.04em] text-white transition-colors placeholder:text-[#95a09f] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] md:px-5 md:py-4 md:pr-[99px] md:text-[15px] md:leading-[21px] lg:rounded-[16px] lg:p-[22px] lg:pr-[101px] lg:text-[16px] lg:leading-[22px]",
                  emailError
                    ? "border-[#FF7E50] focus:border-[#FF7E50]"
                    // Sky Blue 300 on focus, not Alien Green. The modal
                    // auto-focuses this field on open, so #2DEDAD was the
                    // first thing on screen and it is not a colour the frame
                    // (2005:9995) uses anywhere — every accent there is
                    // #56C7F3, including the two social buttons right below.
                    : "border-[#123f3c] focus:border-[#56C7F3]"
                )}
                aria-label="Email address"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              {/* In-field enter affordance — Figma 2005:10011 (1440),
                  2005:18474 (768), 2005:28666 (375). A 16px icon/enter plus an
                  uppercase ENTER label, 8px apart, pinned to the input's
                  content right edge (so `right-*` tracks the input's own
                  horizontal padding: 16 / 20 / 22). It is STATE-GATED, not
                  always-on: the empty frames draw the group at opacity 0 and
                  only the "with input" twins (2005:10032 / 2005:18495 /
                  2005:28687) reveal it. Type is 12/16 at 375 and 16/22 from 768
                  up, both at -4% tracking, per the frames. The visible twin
                  paints it App/Green 300 #17F9B4; we keep Primary/Sky Blue 300
                  because this field's focus ring is deliberately Sky Blue (see
                  the border comment above) and a green label beside a blue ring
                  reads as two accents. Decorative — the Enter key and the
                  Continue button are the real controls. */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 transition-opacity duration-150 md:right-5 lg:right-[22px]",
                  email.trim() ? "opacity-100" : "opacity-0"
                )}
                aria-hidden="true"
              >
                <EnterIcon className="h-4 w-4 shrink-0 text-[#56C7F3]" />
                <span className="font-manrope text-[12px] font-normal uppercase leading-[16px] tracking-[-0.48px] text-[#56C7F3] md:text-[16px] md:leading-[22px] md:tracking-[-0.64px]">
                  Enter
                </span>
              </div>
            </div>
            {emailError && (
              <p
                id="email-error"
                className="font-manrope mt-2 px-4 text-[11px] font-normal leading-[14px] text-[#FF7E50] md:px-5 md:text-[12px] md:leading-[16px] lg:px-[22px] lg:text-[13px] lg:leading-[16px]"
                role="alert"
              >
                {emailError}
              </p>
            )}
          </div>

          {/* Continue Button — Figma 2005:10015 draws this at full strength
              alongside an empty (placeholder-only) field. Disabling it on an
              empty email both greyed out the frame's primary CTA on open and
              made `validateAndSubmit`'s "Please enter your email address."
              branch unreachable, so an empty submit gave the user no feedback
              at all. Empty input still cannot reach onEmailSubmit. */}
          <button
            type="submit"
            disabled={isLoading}
            className="md:py-4.5 font-manrope md:mb-5.5 mb-5 w-full rounded-[12px] bg-[#56C7F3] px-6 py-4 text-center text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-[#001615] transition-all hover:bg-[#56C7F3]/90 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] md:px-8 md:text-[15px] md:leading-[21px] md:tracking-[-0.6px] lg:mb-6 lg:rounded-[16px] lg:px-10 lg:py-5 lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]"
          >
            Continue
          </button>
        </form>

        {/* OR Divider */}
        {(onGoogleLogin || onAppleLogin || onDiscordLogin) && (
          <>
            <div className="md:mb-5.5 mb-5 flex items-center gap-4 md:gap-5 lg:mb-6 lg:gap-[19px]">
              <div className="h-[1px] flex-1 bg-[#123f3c]" />
              <span className="font-manrope text-[14px] font-normal leading-[18px] tracking-[-0.56px] text-[#95a09f]">
                OR
              </span>
              <div className="h-[1px] flex-1 bg-[#123f3c]" />
            </div>

            {/* Social Login Buttons — Figma 2005:10021 puts an 8px gutter
                between the two 196px halves of the 400px content width. */}
            <div className="flex flex-row gap-2">
              {/* Google Button */}
              {onGoogleLogin && (
                <button
                  onClick={onGoogleLogin}
                  disabled={isLoading}
                  className="md:py-4.5 flex flex-1 items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#56C7F3] bg-[#001615] px-4 py-4 transition-all hover:border-[#56C7F3]/80 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] md:px-5 lg:rounded-[16px] lg:px-[22px] lg:py-5"
                >
                  <GoogleIcon className="h-5 w-5 shrink-0 md:h-[22px] md:w-[22px] lg:h-6 lg:w-6" />
                  <span className="font-manrope text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-[#56C7F3] md:text-[15px] md:leading-[21px] md:tracking-[-0.6px] lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]">
                    Google
                  </span>
                </button>
              )}

              {/* Apple Button */}
              {onAppleLogin && (
                <button
                  onClick={onAppleLogin}
                  disabled={isLoading}
                  className="md:py-4.5 flex flex-1 items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#56C7F3] bg-[#001615] px-4 py-4 transition-all hover:border-[#56C7F3]/80 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] md:px-5 lg:rounded-[16px] lg:px-[22px] lg:py-5"
                >
                  <AppleIcon className="h-5 w-5 shrink-0 text-[#56C7F3] md:h-[22px] md:w-[22px] lg:h-6 lg:w-6" />
                  <span className="font-manrope text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-[#56C7F3] md:text-[15px] md:leading-[21px] md:tracking-[-0.6px] lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]">
                    Apple
                  </span>
                </button>
              )}

              {/* Discord Button */}
              {onDiscordLogin && (
                <button
                  onClick={onDiscordLogin}
                  disabled={isLoading}
                  className="md:py-4.5 flex flex-1 items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#56C7F3] bg-[#001615] px-4 py-4 transition-all hover:border-[#56C7F3]/80 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] md:px-5 lg:rounded-[16px] lg:px-[22px] lg:py-5"
                >
                  <DiscordIcon className="h-5 w-5 shrink-0 text-[#56C7F3] md:h-[22px] md:w-[22px] lg:h-6 lg:w-6" />
                  <span className="font-manrope text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-[#56C7F3] md:text-[15px] md:leading-[21px] md:tracking-[-0.6px] lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]">
                    Discord
                  </span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WaitlistModal;
