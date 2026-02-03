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
        "fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6",
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
        className="relative w-full max-w-[343px] rounded-[20px] border border-[#123f3c] bg-[#122524] p-4 shadow-[0px_10px_80px_0px_rgba(0,0,0,0.25)] md:max-w-[468px] md:rounded-[28px] md:p-6 lg:max-w-[448px] lg:rounded-[32px] lg:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back and Close Buttons */}
        <div className="mb-4 flex items-center justify-between md:mb-6 lg:mb-6">
          <button
            onClick={onBack}
            disabled={loading}
            className="flex items-center gap-1.5 text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50 md:gap-2"
            aria-label="Back"
          >
            <BackIcon className="h-4 w-4" />
            <span className="font-manrope text-[14px] font-normal leading-[18px] tracking-[-0.56px]">
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

        {/* Title */}
        <h2 className="font-manrope mb-3 text-center text-[24px] font-light leading-[28px] tracking-[-0.96px] text-white md:mb-4 md:text-[28px] md:leading-[32px] md:tracking-[-1.12px] lg:mb-4 lg:text-[32px] lg:leading-[36px] lg:tracking-[-1.28px]">
          Email verification
        </h2>

        {/* Description */}
        <p className="font-manrope mb-6 px-1 text-center text-[14px] font-normal leading-[20px] text-[#E0E0E0] md:mb-6 md:px-2 md:text-[16px] md:leading-[22px] lg:mb-6 lg:px-0 lg:text-[18px] lg:leading-[24px]">
          Enter the verification code sent to <br />
          <span className="font-semibold text-white">{email}</span>
        </p>

        {/* Code Input */}
        <div className="mb-6 md:mb-6 lg:mb-6">
          <div className="mb-4 flex justify-center gap-1 px-1 md:mb-4 md:gap-2 md:px-0 lg:mb-4 lg:gap-3">
            {code.map((digit, index) => (
              <div
                key={index}
                className={cn(
                  "flex-shrink-0 rounded-[12px] border bg-[#001615] px-1 py-2.5 transition-colors md:rounded-[14px] md:px-2.5 md:py-4 lg:rounded-[16px] lg:px-4 lg:py-5",
                  localError
                    ? "border-[#FF4444]"
                    : "border-[#123f3c] focus-within:border-[#17F9B4]"
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
                  className="font-manrope h-[32px] w-[32px] border-none bg-transparent text-center text-[18px] font-normal leading-none text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:h-[40px] md:w-[40px] md:text-[20px] lg:h-[38px] lg:w-5 lg:text-[24px]"
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
            className="font-manrope flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#56c7f3] px-6 py-4 text-center text-[14px] font-normal leading-[20px] tracking-[-0.56px] text-[#001615] transition-all hover:bg-[#56c7f3]/90 disabled:cursor-not-allowed disabled:opacity-50 md:rounded-[14px] md:px-10 md:py-5 md:text-[16px] md:leading-[22px] md:tracking-[-0.64px] lg:rounded-[16px] lg:px-10 lg:py-5 lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]"
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
                className="font-manrope text-[14px] font-normal leading-[18px] tracking-[-0.56px] text-[#56c7f3] underline transition-colors hover:text-[#56c7f3]/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Resend code
              </button>
            )
          ) : (
            <p className="font-manrope text-[14px] font-normal leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
              Resend code in{" "}
              <span className="font-semibold text-[#56c7f3]">
                {timer} {timer === 1 ? "second" : "seconds"}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationModal;
