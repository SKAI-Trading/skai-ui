/**
 * The four wallet marks the sign-in frames draw (Login ALT 10734:74595, Sign up
 * ALT 10734:74426), in the order the frames place them. This module owns the id
 * list: the modal draws one button per id, and each app maps the same ids onto
 * thirdweb wallets. The ids happen to be thirdweb wallet ids, but nothing here
 * imports thirdweb — `@skai/ui` stays a pure presentation library.
 *
 * MetaMask and WalletConnect are the Figma PNG exports downscaled to 48px and
 * inlined; Phantom and Rainbow are the Figma vector exports. Rainbow's
 * gradients carry `useId()` ids so two marks on one page cannot collide.
 */

import * as React from "react";

export const AUTH_WALLET_IDS = ["io.metamask", "app.phantom", "me.rainbow", "walletConnect"] as const;
export type AuthWalletId = (typeof AUTH_WALLET_IDS)[number];

export const AUTH_WALLET_LABELS: Record<AuthWalletId, string> = {
  "io.metamask": "MetaMask",
  "app.phantom": "Phantom",
  "me.rainbow": "Rainbow",
  walletConnect: "WalletConnect",
};

type IconProps = { className?: string };

const METAMASK_PNG =
  "data:image/png;base64,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";

const WALLETCONNECT_PNG =
  "data:image/png;base64,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";

export const MetaMaskWalletIcon: React.FC<IconProps> = ({ className }) => (
  <img
    src={METAMASK_PNG}
    alt=""
    aria-hidden="true"
    width={24}
    height={24}
    draggable={false}
    className={className}
  />
);

export const WalletConnectWalletIcon: React.FC<IconProps> = ({ className }) => (
  <img
    src={WALLETCONNECT_PNG}
    alt=""
    aria-hidden="true"
    width={24}
    height={24}
    draggable={false}
    className={className}
  />
);

/** Figma `logos/others` Phantom: a 20px square clipped to a circle inside the 24px box. */
export const PhantomWalletIcon: React.FC<IconProps> = ({ className }) => {
  const clipId = React.useId();
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} className={className} aria-hidden="true">
      <clipPath id={clipId}>
        <circle cx="12" cy="12" r="10" />
      </clipPath>
      <g clipPath={`url(#${clipId})`} transform="translate(2 2)">
        <path d="M20 0H0V20H20V0Z" fill="#9886E5" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.89922 12.3361C8.22296 13.3723 7.08976 14.6837 5.58188 14.6837C4.86905 14.6837 4.18365 14.3903 4.18365 13.1156C4.18365 9.86927 8.61592 4.84391 12.7283 4.84391C15.0679 4.84391 16 6.46706 16 8.31031C16 10.6763 14.4647 13.3815 12.9385 13.3815C12.4542 13.3815 12.2166 13.1156 12.2166 12.6937C12.2166 12.5837 12.2349 12.4645 12.2714 12.3361C11.7505 13.2256 10.7452 14.051 9.80396 14.051C9.11855 14.051 8.77128 13.62 8.77128 13.0147C8.77128 12.7946 8.81698 12.5654 8.89922 12.3361ZM14.4557 8.24632C14.4557 8.78343 14.1389 9.05199 13.7844 9.05199C13.4245 9.05199 13.113 8.78343 13.113 8.24632C13.113 7.70922 13.4245 7.44067 13.7844 7.44067C14.1389 7.44067 14.4557 7.70922 14.4557 8.24632ZM12.4417 8.24632C12.4417 8.78343 12.1248 9.05199 11.7703 9.05199C11.4104 9.05199 11.0989 8.78343 11.0989 8.24632C11.0989 7.70922 11.4104 7.44067 11.7703 7.44067C12.1248 7.44067 12.4417 7.70922 12.4417 8.24632Z"
          fill="#FFFDF8"
        />
      </g>
    </svg>
  );
};

/**
 * Figma `logos/others` Rainbow (`icon-official`): a 20px disc inset 2px, with the
 * three arcs placed at the frame's own offsets (outer 11.11px at 6.44, middle
 * 8.89px at 6.44/8.67, inner 6.67px at 6.44/10.89). Each arc keeps its exported
 * viewBox by nesting an <svg>.
 */
export const RainbowWalletIcon: React.FC<IconProps> = ({ className }) => {
  const id = React.useId();
  const g = (name: string) => `${id}-${name}`;
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={g("bg")} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#174299" />
          <stop offset="1" stopColor="#001E59" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill={`url(#${g("bg")})`} />
      <svg x="6.444" y="6.444" width="11.111" height="11.111" viewBox="0 0 11.1111 11.1111">
        <defs>
          <radialGradient id={g("o0")} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.833334 10.2778) rotate(-90) scale(10.2778)">
            <stop offset="0.770277" stopColor="#FF4000" />
            <stop offset="1" stopColor="#8754C9" />
          </radialGradient>
          <linearGradient id={g("o1")} x1="8.74986" y1="10.6945" x2="11.111" y2="10.6945" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF4000" />
            <stop offset="1" stopColor="#8754C9" />
          </linearGradient>
          <linearGradient id={g("o2")} x1="0.416667" y1="0" x2="0.416666" y2="2.36111" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8754C9" />
            <stop offset="1" stopColor="#FF4000" />
          </linearGradient>
        </defs>
        <path d="M0 2.5H0.833333C5.12888 2.5 8.61111 5.98223 8.61111 10.2778V11.1111H10.2778C10.738 11.1111 11.1111 10.738 11.1111 10.2778C11.1111 4.60152 6.50959 0 0.833333 0C0.373096 0 0 0.373096 0 0.833333V2.5Z" fill={`url(#${g("o0")})`} />
        <path d="M8.88875 10.2778H11.111C11.111 10.738 10.7379 11.1111 10.2776 11.1111H8.88875V10.2778Z" fill={`url(#${g("o1")})`} />
        <path d="M0.833333 0L0.833333 2.22222H0L6.07103e-08 0.833333C8.08279e-08 0.373096 0.373096 -2.01176e-08 0.833333 0Z" fill={`url(#${g("o2")})`} />
      </svg>
      <svg x="6.444" y="8.667" width="8.889" height="8.889" viewBox="0 0 8.88891 8.8889">
        <defs>
          <radialGradient id={g("m0")} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.833333 8.05557) rotate(-90) scale(8.05556)">
            <stop offset="0.723929" stopColor="#FFF700" />
            <stop offset="1" stopColor="#FF9901" />
          </radialGradient>
          <linearGradient id={g("m1")} x1="6.66667" y1="8.47222" x2="8.88889" y2="8.47222" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF700" />
            <stop offset="1" stopColor="#FF9901" />
          </linearGradient>
          <linearGradient id={g("m2")} x1="0.416667" y1="2.22223" x2="0.416667" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF700" />
            <stop offset="1" stopColor="#FF9901" />
          </linearGradient>
        </defs>
        <path d="M0 1.01725e-05H0.833333C5.28229 1.01725e-05 8.88889 3.6066 8.88889 8.05557V8.8889H6.38889V8.05557C6.38889 4.98732 3.90158 2.50001 0.833333 2.50001H0V1.01725e-05Z" fill={`url(#${g("m0")})`} />
        <path d="M6.66667 8.05556H8.88889V8.88889H6.66667V8.05556Z" fill={`url(#${g("m1")})`} />
        <path d="M9.71364e-08 2.22223L0 1.0209e-05L0.833333 1.01725e-05L0.833333 2.22223H9.71364e-08Z" fill={`url(#${g("m2")})`} />
      </svg>
      <svg x="6.444" y="10.889" width="6.667" height="6.667" viewBox="0 0 6.66667 6.66667">
        <defs>
          <radialGradient id={g("i0")} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.833333 5.83333) rotate(-90) scale(5.83333)">
            <stop offset="0.59513" stopColor="#00AAFF" />
            <stop offset="1" stopColor="#01DA40" />
          </radialGradient>
          <radialGradient id={g("i1")} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.30528 6.25) scale(2.36111 6.2963)">
            <stop stopColor="#00AAFF" />
            <stop offset="1" stopColor="#01DA40" />
          </radialGradient>
          <radialGradient id={g("i2")} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.416666 2.36111) rotate(-90) scale(2.36111 44.7737)">
            <stop stopColor="#00AAFF" />
            <stop offset="1" stopColor="#01DA40" />
          </radialGradient>
        </defs>
        <path d="M0 1.38889C0 1.84913 0.373096 2.22222 0.833333 2.22222C2.82769 2.22222 4.44444 3.83897 4.44444 5.83333C4.44444 6.29357 4.81754 6.66667 5.27778 6.66667H6.66667V5.83333C6.66667 2.61167 4.05499 0 0.833333 0H0V1.38889Z" fill={`url(#${g("i0")})`} />
        <path d="M4.44417 5.83333H6.6664V6.66667H5.27751C4.81727 6.66667 4.44417 6.29357 4.44417 5.83333Z" fill={`url(#${g("i1")})`} />
        <path d="M0.833333 2.22222C0.373096 2.22222 8.08279e-08 1.84913 6.07103e-08 1.38889L0 3.64262e-08L0.833333 0L0.833333 2.22222Z" fill={`url(#${g("i2")})`} />
      </svg>
    </svg>
  );
};

export const AUTH_WALLET_ICONS: Record<AuthWalletId, React.FC<IconProps>> = {
  "io.metamask": MetaMaskWalletIcon,
  "app.phantom": PhantomWalletIcon,
  "me.rainbow": RainbowWalletIcon,
  walletConnect: WalletConnectWalletIcon,
};
