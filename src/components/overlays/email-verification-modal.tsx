/**
 * EmailVerificationModal - OTP verification modal for email authentication
 *
 * Features:
 * - 6-digit OTP input with auto-advance
 * - Auto-submit when complete
 * - Paste support for OTP
 * - Resend code with countdown timer
 * - Error handling and loading states
 * - SKAI brand styling
 */

import * as React from "react";
import { cn } from "../../lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export interface EmailVerificationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal closes */
  onClose: () => void;
  /** Callback when back button is clicked */
  onBack: () => void;
  /** Email address being verified */
  email: string;
  /** Callback when OTP is submitted */
  onVerify: (code: string) => void;
  /** Callback to resend verification code */
  onResendCode?: () => void;
  /** Error message to display */
  error?: string;
  /** Whether in loading state */
  loading?: boolean;
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

const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M10 12L6 8L10 4" />
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
 * EmailVerificationModal - OTP verification modal for email authentication
 *
 * @example
 * ```tsx
 * <EmailVerificationModal
 *   isOpen={showVerification}
 *   onClose={() => setShowVerification(false)}
 *   onBack={() => goBackToEmail()}
 *   email="user@example.com"
 *   onVerify={(code) => handleVerify(code)}
 *   onResendCode={() => handleResend()}
 *   error={verificationError}
 *   loading={verifying}
 * />
 * ```
 */
export function EmailVerificationModal({
  isOpen,
  onClose,
  onBack,
  email,
  onVerify,
  onResendCode,
  error,
  loading = false,
  className,
}: EmailVerificationModalProps) {
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = React.useState(30);
  const [canResend, setCanResend] = React.useState(false);
  const [localError, setLocalError] = React.useState<string>("");
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Update local error when error prop changes
  React.useEffect(() => {
    setLocalError(error || "");
  }, [error]);

  React.useEffect(() => {
    if (isOpen) {
      // Focus first input when modal opens
      inputRefs.current[0]?.focus();
      setCode(["", "", "", "", "", ""]);
      setTimer(30);
      setCanResend(false);
      setLocalError("");
    }
  }, [isOpen]);

  // Timer countdown effect
  React.useEffect(() => {
    if (!isOpen || canResend) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, canResend]);

  const handleResend = () => {
    if (!canResend || !onResendCode) return;
    onResendCode();
    setTimer(30);
    setCanResend(false);
  };

  const handleChange = (index: number, value: string) => {
    // Don't allow changes while loading
    if (loading) return;

    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    // Clear error when user starts typing
    if (localError) {
      setLocalError("");
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (newCode.every((digit) => digit !== "") && index === 5) {
      onVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if ((e.ctrlKey || e.metaKey) && e.key === "v") {
      if (loading) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("");
        const newCode = [...code];
        digits.forEach((digit, i) => {
          if (index + i < 6) {
            newCode[index + i] = digit;
          }
        });
        setCode(newCode);
        const nextIndex = Math.min(index + digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
        if (newCode.every((digit) => digit !== "")) {
          onVerify(newCode.join(""));
        }
      }).catch(() => {
        // Clipboard read permission denied - silently ignore
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    // Don't allow paste while loading
    if (loading) return;

    // Clear error when user pastes
    if (localError) {
      setLocalError("");
    }
    const text = e.clipboardData.getData("text");
    const digits = text.replace(/\D/g, "").slice(0, 6).split("");
    const newCode = [...code];
    digits.forEach((digit, i) => {
      if (i < 6) {
        newCode[i] = digit;
      }
    });
    setCode(newCode);
    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
    // Auto-submit when all 6 digits are filled
    if (newCode.every((digit) => digit !== "")) {
      onVerify(newCode.join(""));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        /* 8px scrim inset below sm — Figma 2005:30112 puts the 358px modal at
           x=8 in a 375 frame. p-4 capped it at 343 and every child inherited
           the 15px shortfall (the OTP boxes rendered 43.5 wide against the
           frame's 50.33). */
        "fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-6",
        className
      )}
      style={{
        background: "rgba(0, 22, 21, 0.44)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        /* Horizontal inset 8 / 16 / 24, so the six OTP boxes get the modal's
           full content width at every rung. The vertical inset is not a pair:
           the August boards put the controls row at y=24 and end the resend
           line 24 off the floor at 375 (11229:188072, 358x342 at x=8), and at
           y=16 over the same 24 at 768 (11225:181606, 468x375 at 150,325). The
           May set this file was first built from had a flat 16 at 375, and
           Casey's ruling of 2026-09-19 takes August.

           The hairline is an inset ring rather than a border, as in
           auth-modal: the boards lay the 342 column out inside the stroke,
           and a 1px border took 2 off it (340 across six cells) and stood the
           box 344 where 11229:188072 draws 342. */
        className="relative w-full max-w-[358px] rounded-[20px] bg-[#122524] px-2 pb-6 pt-6 shadow-[inset_0_0_0_1px_#123f3c,0px_10px_80px_0px_rgba(0,0,0,0.25)] md:max-w-[468px] md:rounded-[28px] md:px-4 md:pt-4 lg:max-w-[448px] lg:rounded-[32px] lg:px-6 lg:pt-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back and Close Buttons — the frame's `controls` row carries its own
            8px inset at 375 (2005:30113), which is what keeps Back and close
            16px off the modal edge once the modal itself drops to 8. */}
        <div className="mb-5 flex items-center justify-between px-2 md:mb-6 md:px-0">
          <button
            onClick={onBack}
            disabled={loading}
            className="flex items-center gap-2 text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Back"
          >
            <BackIcon className="h-4 w-4" />
            {/* The label steps DOWN a size as the modal grows: Sm/Paragraph 1
                300 at 375 (14/16, the 31-wide box on 11229:188076) and
                Md/Paragraph 2 300 at 768 (12/16, 26 wide on 11225:181610).
                Gray 100, not white — only the glyph beside it is white. */}
            <span className="font-manrope text-[14px] font-normal leading-[16px] tracking-[-0.56px] text-[#E0E0E0] md:text-[12px] md:tracking-[-0.48px] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]">
              Back
            </span>
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex h-4 w-4 items-center justify-center text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Title — Super-headline 4 300: 20/24 at 375 (11229:188079) and 24/28
            at 768 (11225:181613), over an 8 / 16 gap to the line below. */}
        <h2 className="font-manrope mb-2 text-center text-[20px] font-light leading-[24px] tracking-[-0.8px] text-white md:mb-4 md:text-[24px] md:leading-[28px] md:tracking-[-0.96px] lg:text-[32px] lg:leading-[36px] lg:tracking-[-1.28px]">
          Email verification
        </h2>

        {/* Description — Sub-headline 2 300, Manrope Regular 14 at -0.56 with
            the address on the Bold cut. Its leading is the face's own: a flat
            18 at 375 and Manrope's natural 18.048 at 768, which is why the
            frame's two-line box reads 36 at one width and 37 at the other. */}
        <p className="font-manrope mb-5 text-center text-[14px] font-normal leading-[18px] tracking-[-0.56px] text-[#E0E0E0] md:mb-6 md:leading-[18.05px] lg:text-[18px] lg:leading-[24px]">
          Enter the verification code sent to <br />
          <span className="font-bold text-white">{email}</span>
        </p>

        {/* Code Input */}
        <div className="mb-5 md:mb-6">
          {/* Figma 2005:20664 — the six inputs are `flex-[1_0_0]`, i.e. they
              split the modal's full content width evenly (8px gutter), not a
              narrow centred cluster of fixed 44/52/56px boxes. That fixed-width
              layout was the "pop up size do not match" report (8658d6a4). */}
          <div className="mb-5 flex justify-center gap-2 md:mb-6">
            {code.map((digit, index) => (
              <div
                key={index}
                /* Box height is the frame's, not a square: Figma 2005:30127
                   draws 50.33x72 at 375, 2005:19935 66x76 at 768 and
                   2005:11472 60x78 at 1440 — px-16/py-24, px-16/py-24 and
                   px-16/py-20 around a single centred digit. The old
                   48/56/60 heights ran 18-24px short at every width while the
                   x-grid already matched. Radius is 12/12/16 per those nodes.
                   The `px-1` that used to sit on this row is gone — the frame
                   gives the six inputs the modal's full content width. */
                className={cn(
                  "flex h-[72px] flex-1 min-w-0 items-center justify-center rounded-[12px] border bg-[#001615] transition-colors md:h-[76px] md:rounded-[12px] lg:h-[78px] lg:rounded-[16px]",
                  localError
                    ? "border-[#FF4444]"
                    : digit
                      ? "border-[#2DEDAD]"
                      : "border-[#123f3c] focus-within:border-[#2DEDAD]"
                )}
              >
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={loading}
                  /* Figma 2005:20667 — the OTP digits are the "Numbers" ramp
                     (Mulish Light), not Manrope. Manrope rendered the code in
                     the body face, which was the "text font do not match"
                     half of report 8658d6a4. Sizes are 20 / 24 / 32 at -4%
                     tracking (2005:30129, 2005:19937, 2005:11474); the desktop
                     step was rendering 28. */
                  className="font-mulish h-full w-full border-none bg-transparent text-center text-[20px] font-light leading-none tracking-[-0.8px] text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[24px] md:tracking-[-0.96px] lg:text-[32px] lg:tracking-[-1.28px]"
                  aria-label={`Digit ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Error Message */}
          {localError && (
            <p className="font-manrope mb-8 text-center text-[14px] font-medium leading-[18px] tracking-[-0.56px] text-[#FF4444]">
              {localError}
            </p>
          )}

          {/* Continue Button */}
          <button
            type="button"
            onClick={() => {
              if (code.every((digit) => digit !== "") && !loading) {
                onVerify(code.join(""));
              }
            }}
            disabled={!code.every((digit) => digit !== "") || loading}
            /* 342x44 at 375 and 436x50 at 768 (11229:188102, 11225:181636).
               The 768 instance is cta/button Medium Primary read off its own
               node: Sky Blue 300, px 24, py 16, radius 12 and Md/Paragraph 1
               300 at 14/18/-0.56, so 16+18+16 lands the 50. It had been
               rendering 54 on a 16/22 face at radius 14, neither of which any
               instance draws. */
            className="font-manrope flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#56C7F3] px-6 py-[14px] text-center text-[14px] font-normal leading-[16px] tracking-[-0.56px] text-[#001615] transition-all hover:bg-[#56C7F3]/90 disabled:cursor-not-allowed disabled:opacity-50 md:py-4 md:leading-[18px] lg:rounded-[16px] lg:px-10 lg:py-5 lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]"
          >
            {loading ? (
              <>
                <SpinnerIcon className="h-4 w-4 text-[#001615]" />
                <span>Verifying...</span>
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>

        {/* Resend Code Timer */}
        <div className="text-center">
          {canResend ? (
            onResendCode && (
              <button
                onClick={handleResend}
                disabled={loading}
                className="font-manrope text-[12px] font-normal leading-[14px] tracking-[-0.48px] text-[#56C7F3] underline transition-colors hover:text-[#56C7F3]/80 disabled:cursor-not-allowed disabled:opacity-50 md:leading-[16px] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]"
              >
                Resend code
              </button>
            )
          ) : (
            /* Paragraph 2 300: 12/14 at 375 (the 14-tall 11229:188103) and
               12/16 at 768 (the 16-tall 11225:181637). */
            <p className="font-manrope text-[12px] font-normal leading-[14px] tracking-[-0.48px] text-[#E0E0E0] md:leading-[16px] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]">
              Resend code in{" "}
              <span className="font-medium text-[#56C7F3]">
                {timer} seconds
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationModal;
