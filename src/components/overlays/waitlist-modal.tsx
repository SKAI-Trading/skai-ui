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
  /** Whether in loading state */
  isLoading?: boolean;
  /** Initial email value */
  initialEmail?: string;
  /** Custom class name */
  className?: string;
}

// =============================================================================
// ICONS
// =============================================================================

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#56C7F3"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#56C7F3"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#56C7F3"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#56C7F3"
    />
  </svg>
);

const AppleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
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
  isLoading = false,
  initialEmail = "",
  className,
}: WaitlistModalProps) {
  const [email, setEmail] = React.useState(initialEmail);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Reset email when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      // Focus the input when modal opens
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onEmailSubmit(email.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && email.trim() && !isLoading) {
      e.preventDefault();
      onEmailSubmit(email.trim());
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
        <div className="absolute inset-0 z-[10001] flex items-center justify-center bg-[#001615]/80">
          <SpinnerIcon className="w-8 h-8 text-[#17F9B4]" />
        </div>
      )}

      {/* Modal Container */}
      <div
        className="relative w-full max-w-[343px] md:max-w-[468px] lg:max-w-[448px] bg-[#122524] border border-[#123f3c] rounded-[20px] md:rounded-[28px] lg:rounded-[32px] p-4 md:p-6 lg:p-6 shadow-[0px_10px_80px_0px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end mb-4 md:mb-6 lg:mb-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-4 h-4 flex items-center justify-center text-white hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h2 className="font-manrope font-light text-[24px] leading-[28px] md:text-[28px] md:leading-[32px] lg:text-[32px] lg:leading-[36px] tracking-[-0.96px] md:tracking-[-1.12px] lg:tracking-[-1.28px] text-white text-center mb-3 md:mb-4 lg:mb-4">
          Join the waitlist
        </h2>

        {/* Description */}
        <p className="font-manrope font-normal text-[14px] leading-[20px] md:text-[16px] md:leading-[22px] lg:text-[18px] lg:leading-[24px] text-[#E0E0E0] text-center mb-6 md:mb-8 lg:mb-8 px-2 md:px-4 lg:px-4">
          Enter your email and we&apos;ll let you know when SKAI is ready
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 md:mb-5 lg:mb-5">
            <div className="relative">
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Email"
                autoComplete="email"
                className="w-full bg-[#001615] border border-[#123f3c] focus:border-[#17F9B4] rounded-[12px] md:rounded-[14px] lg:rounded-[16px] px-4 py-3.5 md:px-5 md:py-4 lg:px-6 lg:py-5 font-manrope font-normal text-[14px] leading-[20px] md:text-[15px] md:leading-[21px] lg:text-[16px] lg:leading-[22px] text-white placeholder:text-[#5d6b6a] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed pr-20"
                aria-label="Email address"
              />
              {/* Enter hint */}
              {email.trim() && !isLoading && (
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded bg-[#17F9B4]/10 text-[#17F9B4] text-xs font-manrope hover:bg-[#17F9B4]/20 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Enter
                </button>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={!email.trim() || isLoading}
            className="w-full bg-[#56c7f3] hover:bg-[#56c7f3]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-[12px] md:rounded-[14px] lg:rounded-[16px] px-6 py-4 md:px-8 md:py-4.5 lg:px-10 lg:py-5 font-manrope font-normal text-[14px] leading-[20px] md:text-[15px] md:leading-[21px] lg:text-[16px] lg:leading-[22px] tracking-[-0.56px] md:tracking-[-0.6px] lg:tracking-[-0.64px] text-[#001615] text-center transition-all mb-5 md:mb-5.5 lg:mb-6"
          >
            Continue
          </button>
        </form>

        {/* OR Divider */}
        {(onGoogleLogin || onAppleLogin) && (
          <>
            <div className="flex items-center gap-4 md:gap-5 lg:gap-[19px] mb-5 md:mb-5.5 lg:mb-6">
              <div className="flex-1 h-[1px] bg-[#123f3c]" />
              <span className="font-manrope font-normal text-[14px] leading-[18px] tracking-[-0.56px] text-[#95a09f]">
                OR
              </span>
              <div className="flex-1 h-[1px] bg-[#123f3c]" />
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-row gap-2 md:gap-2.5">
              {/* Google Button */}
              {onGoogleLogin && (
                <button
                  onClick={onGoogleLogin}
                  disabled={isLoading}
                  className="flex-1 bg-[#001615] border-[1.5px] border-[#56c7f3] hover:border-[#56c7f3]/80 rounded-[12px] md:rounded-[14px] lg:rounded-[16px] px-4 py-4 md:px-5 md:py-4.5 lg:px-[22px] lg:py-5 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <GoogleIcon className="w-5 h-5 md:w-[22px] md:h-[22px] lg:w-6 lg:h-6 shrink-0" />
                  <span className="font-manrope font-normal text-[14px] leading-[20px] md:text-[15px] md:leading-[21px] lg:text-[16px] lg:leading-[22px] tracking-[-0.56px] md:tracking-[-0.6px] lg:tracking-[-0.64px] text-[#56c7f3]">
                    Google
                  </span>
                </button>
              )}

              {/* Apple Button */}
              {onAppleLogin && (
                <button
                  onClick={onAppleLogin}
                  disabled={isLoading}
                  className="flex-1 bg-[#001615] border-[1.5px] border-[#56c7f3] hover:border-[#56c7f3]/80 rounded-[12px] md:rounded-[14px] lg:rounded-[16px] px-4 py-4 md:px-5 md:py-4.5 lg:px-[22px] lg:py-5 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AppleIcon className="w-5 h-5 md:w-[22px] md:h-[22px] lg:w-6 lg:h-6 shrink-0 text-[#56c7f3]" />
                  <span className="font-manrope font-normal text-[14px] leading-[20px] md:text-[15px] md:leading-[21px] lg:text-[16px] lg:leading-[22px] tracking-[-0.56px] md:tracking-[-0.6px] lg:tracking-[-0.64px] text-[#56c7f3]">
                    Apple
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
