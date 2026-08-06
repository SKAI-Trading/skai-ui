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

/**
 * SKAI Lightning Bolt Icon
 *
 * viewBox is the artwork's own 47.1085x48 box, not a padded 48x48 square, so a
 * 47.11px-wide container renders it 1:1 — that is the width Figma gives the
 * option-row icon (2005:12210 / 2005:21403 / 2005:31595) and the 0.9px it frees
 * is part of the budget the second row's subtitle needs to stay on one line.
 */
const SkaiLightningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 47.1085 48" fill="none" className={className} aria-hidden="true">
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

/**
 * External Wallet Connect Icon
 *
 * Same solid Sky Blue disc as the email-wallet icon, with the chain-link
 * glyph (icon24/link) inset at the coordinates the design uses.
 */
const ExternalWalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 47.1085 48" fill="none" className={className} aria-hidden="true">
    <path
      d="M0 23.5543C0 10.5456 10.5456 0 23.5543 0C36.5629 0 47.1085 10.5456 47.1085 23.5543V24.4457C47.1085 37.4544 36.5629 48 23.5543 48C10.5456 48 0 37.4544 0 24.4457V23.5543Z"
      fill="#56C7F3"
    />
    <g transform="translate(11.4434 11.7217)">
      <path
        d="M4.61717 19.9392C7.18743 22.3867 10.2478 21.4075 11.4726 20.416C12.1049 19.9034 12.3904 19.5719 12.6349 19.3263C13.4913 18.5313 13.4371 17.7353 12.8805 17.0988C12.6564 16.8441 11.227 15.4709 9.85592 14.063C9.14583 13.3529 8.65674 12.8516 8.23723 12.4464C7.67754 11.8877 7.18743 11.2472 6.45278 11.2656C5.77952 11.2656 5.29043 11.8591 4.67754 12.472C3.97358 13.1759 3.4538 14.063 3.27065 14.8591C2.71915 17.1848 3.57658 18.8372 4.61717 19.9392ZM4.61717 19.9392L2.04589 22.5095M19.9385 4.61997C17.3672 2.17044 14.317 3.16703 13.0933 4.15953C12.4589 4.67317 12.1745 5.00469 11.9289 5.25026C11.0725 6.0463 11.1267 6.84234 11.6844 7.47877C11.7642 7.57086 12.0016 7.80619 12.3341 8.13771M19.9385 4.61997C20.9791 5.72195 21.8477 7.39282 21.2962 9.72059C21.1121 10.5166 20.5923 11.4037 19.8883 12.1087C19.2765 12.7206 18.7864 13.3151 18.1131 13.3151C17.3784 13.3335 16.9978 12.8014 16.4361 12.2428M19.9385 4.61997L22.5098 2.04664M12.3341 8.13771C12.9286 8.72604 13.831 9.61315 14.7089 10.5156C15.419 11.2257 16.0166 11.8376 16.4361 12.2417L14.8379 13.8021M12.3341 8.13771L10.7553 9.7257"
        stroke="#001615"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
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
        /* 8px scrim inset below sm — Figma 2005:31572 puts the 358px modal at
           x=8 in a 375 frame, the same as the verification modal. */
        "fixed inset-0 z-[10001] flex items-center justify-center p-2 sm:p-6",
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
        /* Internal padding 8h/16v at 375 (2005:31572), 16 at 768 and 24 at
           1440 — the mobile step gives the option rows the frame's full 342px
           content width. */
        className="relative w-full max-w-[358px] rounded-[20px] border border-[#123f3c] bg-[#122524] px-2 py-4 shadow-[0px_10px_80px_0px_rgba(0,0,0,0.25)] md:max-w-[468px] md:rounded-[28px] md:p-4 lg:max-w-[448px] lg:rounded-[32px] lg:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button — the frame's `controls` row keeps its own 8px inset at
            375 (2005:31573) so the close glyph still sits 16px off the edge. */}
        <div className="mb-5 flex items-center justify-end px-2 md:mb-6 md:px-0 lg:mb-6">
          <button
            onClick={onClose}
            className="flex h-4 w-4 items-center justify-center text-white transition-opacity hover:opacity-70"
            aria-label="Close modal"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        <h2 className="font-manrope mb-2 text-center text-[20px] font-light leading-[24px] tracking-[-0.8px] text-white md:mb-4 md:text-[24px] md:leading-[28px] md:tracking-[-0.96px] lg:mb-4 lg:text-[32px] lg:leading-[36px] lg:tracking-[-1.28px]">
          Choose your wallet
        </h2>

        {/* Subtitle */}
        <p className="font-manrope mb-5 px-0 text-center text-[14px] font-normal leading-[20px] text-[#E0E0E0] md:mb-6 md:text-[16px] md:leading-[22px] lg:mb-6 lg:text-[18px] lg:leading-[24px] lg:tracking-[-0.72px]">
          Choose how you&apos;d like to store your assets.
        </p>

        {/* Wallet Options — Figma 2005:31582 / 2005:21390 / 2005:12197 draw a
            MATCHED PAIR of 342x60, 436x70 and 400x88 rows. The app was
            rendering 309x74 + 309x82, 434x90 + 434x90 and 398x90 + 398x108:
            every row ran tall because the icon column was sized off the
            desktop step, and the second row grew another 18-20px because "Add
            Metamask, Coinbase, etc., to your account" wrapped.

            Three things hold the pair now. (1) Padding is border-compensated:
            Figma strokes sit outside the layout box, CSS borders inside it, so
            13 + 1 = 14, 14.5 + 1.5 = 16 and 20.5 + 1.5 = 22 put the icon at
            exactly the frame's inset and give the text column back the 3px the
            border was eating. (2) The icon boxes are the frame's own
            23.55/31.41/47.11 widths and the divider is a zero-width rule like
            the frame's Vector 360. (3) The two text lines are
            `whitespace-nowrap`, which is how the frame sets them (both text
            nodes hug); at 1440 the longest subtitle measures 276.95px against
            a 276.89px column, so the pair no longer depends on font metrics
            landing inside a 6px margin. Row gaps are 16/18/24. */}
        <div className="flex flex-col gap-4 md:gap-[18px] lg:gap-6">
          {/* Email Wallet Option */}
          <button
            onClick={onSelectEmailWallet}
            className="group flex w-full items-center gap-[10px] rounded-[12px] border border-[#56C7F3] bg-[#001615] p-[13px] text-left transition-all hover:bg-[#56C7F3]/5 md:gap-4 md:rounded-[12px] md:border-[1.5px] md:p-[14.5px] lg:gap-4 lg:rounded-[16px] lg:px-[20.5px] lg:py-[18.5px]"
          >
            {/* Icon */}
            <div className="h-6 w-[23.55px] flex-shrink-0 md:h-8 md:w-[31.41px] lg:h-12 lg:w-[47.11px]">
              <SkaiLightningIcon className="h-full w-full" />
            </div>

            <div className="relative h-6 w-0 flex-shrink-0 md:h-8 lg:h-10">
              <div className="absolute inset-y-0 left-0 border-l border-dashed border-[#56C7F3]" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 text-[#56C7F3]">
              <h3 className="font-manrope mb-[2px] whitespace-nowrap text-[14px] font-bold leading-[16px] tracking-[-0.56px] md:mb-1 md:text-[14px] md:font-normal md:leading-[18px] lg:mb-2 lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]">
                Use built in email wallet
              </h3>
              <p className="font-manrope whitespace-nowrap text-[12px] font-normal leading-[14px] tracking-[-0.48px] md:leading-[16px] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]">
                Secure wallet provided by Skai
              </p>
            </div>
          </button>

          {/* External Wallet Option */}
          <button
            onClick={onSelectExternalWallet}
            className="group flex w-full items-center gap-[10px] rounded-[12px] border border-[#56C7F3] bg-[#001615] p-[13px] text-left transition-all hover:bg-[#56C7F3]/5 md:gap-4 md:rounded-[12px] md:border-[1.5px] md:p-[14.5px] lg:gap-4 lg:rounded-[16px] lg:px-[20.5px] lg:py-[18.5px]"
          >
            {/* Icon */}
            <div className="h-6 w-[23.55px] flex-shrink-0 md:h-8 md:w-[31.41px] lg:h-12 lg:w-[47.11px]">
              <ExternalWalletIcon className="h-full w-full" />
            </div>

            <div className="relative h-6 w-0 flex-shrink-0 md:h-8 lg:h-10">
              <div className="absolute inset-y-0 left-0 border-l border-dashed border-[#56C7F3]" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 text-[#56C7F3]">
              <h3 className="font-manrope mb-[2px] whitespace-nowrap text-[14px] font-bold leading-[16px] tracking-[-0.56px] md:mb-1 md:text-[14px] md:font-normal md:leading-[18px] lg:mb-2 lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]">
                Link external wallet
              </h3>
              <p className="font-manrope whitespace-nowrap text-[12px] font-normal leading-[14px] tracking-[-0.48px] md:leading-[16px] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]">
                Add Metamask, Coinbase, etc., to your account
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WalletChoiceModal;
