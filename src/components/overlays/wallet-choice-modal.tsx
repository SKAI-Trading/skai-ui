/**
 * WalletChoiceModal - Modal for choosing wallet type
 * 
 * Features:
 * - Two wallet options: email wallet or external wallet
 * - SKAI branding with lightning bolt icon
 * - Responsive design with SKAI styling
 */

import * as React from "react";
import { cn } from "../../lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export interface WalletChoiceModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal closes */
  onClose: () => void;
  /** Callback when email wallet is selected */
  onSelectEmailWallet: () => void;
  /** Callback when external wallet is selected */
  onSelectExternalWallet: () => void;
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

/** SKAI Lightning Bolt Icon */
const SkaiLightningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M0 23.5543C0 10.5456 10.5456 0 23.5543 0C36.5629 0 47.1085 10.5456 47.1085 23.5543V24.4457C47.1085 37.4544 36.5629 48 23.5543 48C10.5456 48 0 37.4544 0 24.4457V23.5543Z"
      fill="#56C7F3"
    />
    <path
      d="M21.8472 27.2045L24.0223 25.0294C24.1929 24.8588 24.0725 24.5649 23.8301 24.5649H21.3396C20.8937 24.5649 20.6499 24.0444 20.9367 23.7017L29.8551 13.0714C30.0042 12.895 29.878 12.624 29.6471 12.624H25.3027C24.7091 12.624 24.1413 12.8606 23.7226 13.2807L13.7002 23.3633C13.3575 23.7089 13.3575 24.2667 13.7016 24.6108L15.9212 26.8303C16.2839 27.1931 16.7743 27.3967 17.2862 27.3967H21.3812C21.5547 27.3967 21.7224 27.3279 21.8457 27.2045H21.8472Z"
      fill="#001615"
    />
    <path
      d="M33.7414 23.386L31.5218 21.1665C31.159 20.8037 30.6687 20.6001 30.1568 20.6001H26.0618C25.8883 20.6001 25.7206 20.6689 25.5972 20.7922L23.4221 22.9673C23.2515 23.138 23.372 23.4319 23.6143 23.4319H26.1048C26.5507 23.4319 26.7945 23.9524 26.5077 24.2951L17.5879 34.9283C17.4388 35.1046 17.565 35.3756 17.7958 35.3756H22.1403C22.7339 35.3756 23.3017 35.139 23.7204 34.7189L33.7428 24.6363C34.0855 24.2908 34.0855 23.733 33.7414 23.3889V23.386Z"
      fill="#001615"
    />
  </svg>
);

/** External Wallet Connect Icon */
const ExternalWalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <rect width="48" height="48" rx="24" fill="#56C7F3" fillOpacity="0.1" />
    <path
      d="M14 24C14 18.477 18.477 14 24 14C29.523 14 34 18.477 34 24C34 29.523 29.523 34 24 34"
      stroke="#56C7F3"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M24 20V24L27 27"
      stroke="#56C7F3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 30L18 34M14 34L18 30"
      stroke="#56C7F3"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * WalletChoiceModal - Modal for choosing wallet type
 * 
 * @example
 * ```tsx
 * <WalletChoiceModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onSelectEmailWallet={() => handleEmailWallet()}
 *   onSelectExternalWallet={() => handleExternalWallet()}
 * />
 * ```
 */
export function WalletChoiceModal({
  isOpen,
  onClose,
  onSelectEmailWallet,
  onSelectExternalWallet,
  className,
}: WalletChoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[10001] flex items-center justify-center p-4 sm:p-6",
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
        className="relative w-full max-w-[343px] md:max-w-[468px] lg:max-w-[520px] bg-[#122524] border border-[#123f3c] rounded-[20px] md:rounded-[28px] lg:rounded-[32px] p-4 md:p-6 lg:p-6 shadow-[0px_10px_80px_0px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex items-center justify-end mb-4 md:mb-5 lg:mb-6">
          <button
            onClick={onClose}
            className="w-4 h-4 flex items-center justify-center text-white hover:opacity-70 transition-opacity"
            aria-label="Close modal"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h2 className="font-manrope font-light text-white text-center text-[20px] leading-[24px] tracking-[-0.8px] md:text-[24px] md:leading-[28px] md:tracking-[-0.96px] lg:text-[32px] lg:leading-[36px] lg:tracking-[-1.28px] mb-2 md:mb-3 lg:mb-4">
          Choose your wallet
        </h2>

        {/* Subtitle */}
        <p className="font-manrope font-normal text-[14px] leading-[20px] md:text-[16px] md:leading-[22px] lg:text-[18px] lg:leading-[24px] text-[#E0E0E0] text-center mb-5 md:mb-6 lg:mb-6 px-1 md:px-2 lg:px-0">
          Choose how you&apos;d like to store your assets.
        </p>

        {/* Wallet Options */}
        <div className="flex flex-col gap-3 md:gap-4 lg:gap-4">
          {/* Email Wallet Option */}
          <button
            onClick={onSelectEmailWallet}
            className="w-full bg-[#001615] border-[1.5px] border-[#56c7f3] hover:bg-[#56c7f3]/5 rounded-[12px] md:rounded-[14px] lg:rounded-[16px] p-4 md:p-5 lg:p-6 flex items-start gap-3 md:gap-4 lg:gap-4 transition-all text-left group"
          >
            {/* Icon */}
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex-shrink-0 flex items-center justify-center">
              <SkaiLightningIcon className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
            </div>

            <div className="self-stretch w-px border-l border-dashed border-[#123f3c] opacity-80" />

            {/* Content */}
            <div className="flex-1 text-[#56C7F3]">
              <h3 className="font-manrope font-normal text-[12px] leading-[16px] md:text-[14px] md:leading-[18px] lg:text-[16px] lg:leading-[22px] tracking-[-0.64px] md:tracking-[-0.72px] lg:tracking-[-0.8px] mb-1 md:mb-1.5 lg:mb-2">
                Use built in email wallet
              </h3>
              <p className="font-manrope font-normal text-[10px] leading-[14px] md:text-[12px] md:leading-[16px] lg:text-[16px] lg:leading-[22px] md:tracking-[-0.6px] lg:tracking-[-0.64px]">
                Secure wallet provided by Skai
              </p>
            </div>
          </button>

          {/* External Wallet Option */}
          <button
            onClick={onSelectExternalWallet}
            className="w-full bg-[#001615] border-[1.5px] border-[#56c7f3] hover:bg-[#56c7f3]/5 rounded-[12px] md:rounded-[14px] lg:rounded-[16px] p-4 md:p-5 lg:p-6 flex items-start gap-3 md:gap-4 lg:gap-4 transition-all text-left group"
          >
            {/* Icon */}
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex-shrink-0 flex items-center justify-center">
              <ExternalWalletIcon className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
            </div>

            <div className="self-stretch w-px border-l border-dashed border-[#123f3c] opacity-80" />

            {/* Content */}
            <div className="flex-1 text-[#56C7F3]">
              <h3 className="font-manrope font-normal text-[12px] leading-[16px] md:text-[14px] md:leading-[18px] lg:text-[16px] lg:leading-[22px] tracking-[-0.64px] md:tracking-[-0.72px] lg:tracking-[-0.8px] mb-1 md:mb-1.5 lg:mb-2">
                Link external wallet
              </h3>
              <p className="font-manrope font-normal text-[10px] leading-[14px] md:text-[12px] md:leading-[16px] lg:text-[16px] lg:leading-[22px] md:tracking-[-0.6px] lg:tracking-[-0.64px]">
                Add Metamask, Coinbase, etc. to your account
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WalletChoiceModal;
