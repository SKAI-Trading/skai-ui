/**
 * ThirdwebOTPHandler - Utility component for Thirdweb OTP UX enhancement
 * 
 * Improves the UX of the Thirdweb OTP (One-Time Password) input:
 * 1. Auto-focuses the input when the modal appears.
 * 2. Allows typing immediately (captures keydown) even if input isn't focused.
 * 3. Auto-submits/verifies when the code is fully entered.
 * 
 * This component renders nothing - it just adds behavior via MutationObserver.
 */

import * as React from "react";

// =============================================================================
// TYPES
// =============================================================================

export interface ThirdwebOTPHandlerProps {
  /** OTP length expected (default: 6) */
  otpLength?: number;
  /** Custom button text patterns to look for */
  verifyButtonPatterns?: string[];
  /** Delay before auto-clicking verify (ms) */
  autoSubmitDelay?: number;
  /** Whether the handler is active */
  enabled?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ThirdwebOTPHandler - Utility component for Thirdweb OTP UX enhancement
 * 
 * Place this component anywhere in your tree when using Thirdweb's OTP modal.
 * It automatically detects OTP inputs and enhances the user experience.
 * 
 * @example
 * ```tsx
 * // In your app layout or near Thirdweb components
 * <ThirdwebOTPHandler />
 * 
 * // With custom configuration
 * <ThirdwebOTPHandler
 *   otpLength={6}
 *   verifyButtonPatterns={['verify', 'continue', 'sign in']}
 *   autoSubmitDelay={300}
 * />
 * ```
 */
export function ThirdwebOTPHandler({
  otpLength = 6,
  verifyButtonPatterns = ["verify", "submit", "continue", "sign in"],
  autoSubmitDelay = 300,
  enabled = true,
}: ThirdwebOTPHandlerProps): null {
  // Track if we've already auto-submitted for the current code to prevent loops
  const lastSubmittedCode = React.useRef<string>("");

  React.useEffect(() => {
    if (!enabled) return;

    const findOTPInputs = () => {
      // Look for inputs that are likely OTP fields
      const inputs = Array.from(document.querySelectorAll("input"));
      return inputs.filter((input) => {
        const autocomplete = input.getAttribute("autocomplete");
        const ariaLabel = input.getAttribute("aria-label");

        // Thirdweb specific heuristics
        return (
          autocomplete === "one-time-code" ||
          (ariaLabel && ariaLabel.toLowerCase().includes("verification code")) ||
          (ariaLabel && ariaLabel.toLowerCase().includes("otp")) ||
          // Fallback: 6 inputs container
          (input.parentElement &&
            input.parentElement.children.length === otpLength &&
            input.parentElement.querySelectorAll("input").length === otpLength)
        );
      });
    };

    const findVerifyButton = () => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find((btn) => {
        const text = btn.innerText.toLowerCase();
        return verifyButtonPatterns.some((pattern) =>
          text.includes(pattern.toLowerCase())
        );
      });
    };

    // Global keydown listener to focus input if user starts typing
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only care about numbers
      if (!/^\d$/.test(e.key)) return;

      const otpInputs = findOTPInputs();
      if (otpInputs.length === 0) return;

      // If user is already in an input/textarea, don't interfere
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
      )
        return;

      // Focus the first empty input or the first one
      const firstEmpty = otpInputs.find(
        (input) => (input as HTMLInputElement).value === ""
      );
      const target = firstEmpty || otpInputs[0];

      if (target) {
        target.focus();
      }
    };

    // Observer to handle auto-focus and auto-submit
    const observer = new MutationObserver(() => {
      const otpInputs = findOTPInputs();
      if (otpInputs.length === 0) return;

      // 1. Auto-focus logic
      if (!document.activeElement || document.activeElement === document.body) {
        const firstEmpty = otpInputs.find(
          (input) => (input as HTMLInputElement).value === ""
        );
        if (firstEmpty) {
          firstEmpty.focus();
        } else {
          otpInputs[0].focus();
        }
      }

      // 2. Auto-submit logic
      let currentCode = "";
      let isComplete = false;

      if (otpInputs.length === 1) {
        // Single input case
        currentCode = (otpInputs[0] as HTMLInputElement).value;
        isComplete = currentCode.length === otpLength;
      } else {
        // Multiple inputs case (usually 6)
        currentCode = otpInputs
          .map((input) => (input as HTMLInputElement).value)
          .join("");
        isComplete = otpInputs.every(
          (input) => (input as HTMLInputElement).value.length === 1
        );
      }

      if (isComplete && currentCode !== lastSubmittedCode.current) {
        const verifyBtn = findVerifyButton();
        if (verifyBtn && !verifyBtn.disabled) {
          // Small delay to ensure state is updated and UI is ready
          setTimeout(() => {
            verifyBtn.click();
            lastSubmittedCode.current = currentCode;
          }, autoSubmitDelay);
        }
      } else if (!isComplete) {
        // Reset submitted code if user clears input
        lastSubmittedCode.current = "";
      }
    });

    window.addEventListener("keydown", handleKeyDown);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
    };
  }, [enabled, otpLength, verifyButtonPatterns, autoSubmitDelay]);

  return null;
}

export default ThirdwebOTPHandler;
