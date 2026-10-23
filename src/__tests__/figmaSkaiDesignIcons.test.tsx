/**
 * The Skai-Design icon components (file TyX8YAtNDEIvsnSLQ3IXId) that open
 * frames name and the package did not export: the explorer address line's
 * Alarm, Predict's Hot, the Trench chart CTA, the row-menu Tridot, the
 * warnings Error and Success marks, the creator rail's Buy / Follow / Message,
 * the points-tier medallions and the rest below. Rows had been leaving them as
 * stand-ins (lucide AlarmClock, the fire emoji, FigmaCandlestickIcon) because
 * nothing here drew the component itself.
 *
 * The oracle is each component's own SVG export, pasted as Figma returned it
 * (exportAsync SVG_STRING, 2026-10-23), clip groups, masks and #001615 fills
 * included. The tests read the shapes out of that text and compare them with
 * what each export here renders, so a path edited on either side fails.
 */

import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import {
  FigmaActionAlarmIcon,
  FigmaActionCheckEnclosedIcon,
  FigmaActionDownloadIcon,
  FigmaActionHotIcon,
  FigmaActionNowIcon,
  FigmaActionSellIcon,
  FigmaActionShareIcon,
  FigmaActionTridotIcon,
  FigmaTiersBronzeIcon,
  FigmaTiersDiamondIcon,
  FigmaTiersFreeIcon,
  FigmaTiersGoldIcon,
  FigmaTiersLegendIcon,
  FigmaTiersPlatinumIcon,
  FigmaTiersSilverIcon,
  FigmaWalletAddIcon,
  FigmaWalletChartIcon,
  FigmaWalletChatIcon,
  FigmaWalletSpendingIcon,
  FigmaWarningsErrorIcon,
  FigmaWarningsSuccessIcon,
} from "../figma-icons";

const EXPORTS: Record<string, string> = {
  // icons/wallet Size=24px, Type=Add
  "1657:1706": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.501 11.5H20V12.5H12.5V20H11.5V12.5H4V11.5H11.501V4H12.501V11.5Z" fill="#001615"/>
    </svg>`,
  // icons/wallet Size=24px, Type=Spending
  "1556:807": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 3C16.7467 3 21 7.25329 21 12.5C21 17.7467 16.7467 22 11.5 22C6.25329 22 2 17.7467 2 12.5C2 7.25329 6.25329 3 11.5 3ZM11.5 4C6.80558 4 3 7.80558 3 12.5C3 17.1944 6.80558 21 11.5 21C16.1944 21 20 17.1944 20 12.5C20 7.80558 16.1944 4 11.5 4ZM12.7002 7.44824C12.9413 7.47317 13.1794 7.51418 13.4141 7.57422C13.8246 7.66753 14.207 7.80757 14.5615 7.99414C14.9161 8.18078 15.2294 8.40908 15.5 8.67969L15.0664 9.56152C14.3657 8.90065 13.5627 8.52286 12.6582 8.42578V12.1982C12.8881 12.2579 13.1168 12.321 13.3438 12.3896C13.7543 12.5016 14.1323 12.6513 14.4775 12.8379C14.8228 13.0245 15.0984 13.2765 15.3037 13.5938C15.509 13.9017 15.6123 14.3032 15.6123 14.7979C15.6123 15.3577 15.4626 15.8476 15.1641 16.2676C14.8654 16.6876 14.4499 17.0191 13.918 17.2617C13.5531 17.4246 13.147 17.529 12.7002 17.5781V19.124H11.7197V17.5996C11.1519 17.5679 10.6154 17.466 10.1104 17.29C9.49441 17.0661 8.95731 16.7442 8.5 16.3242L8.93359 15.4424C9.42821 15.8623 9.92336 16.1649 10.418 16.3516C10.8313 16.5047 11.2793 16.5936 11.7617 16.6211V13.0635C11.4914 12.9917 11.2205 12.9178 10.9502 12.8379C10.5397 12.7166 10.1616 12.5582 9.81641 12.3623C9.47107 12.157 9.19557 11.8901 8.99023 11.5635C8.78501 11.2369 8.68165 10.8125 8.68164 10.29C8.68164 9.73004 8.83122 9.235 9.12988 8.80566C9.42854 8.36707 9.8397 8.02682 10.3623 7.78418C10.7708 7.59787 11.2232 7.48269 11.7197 7.43945V5.9082H12.7002V7.44824ZM12.6582 16.5947C13.1341 16.5317 13.5219 16.3869 13.8203 16.1562C14.2402 15.839 14.4501 15.3954 14.4502 14.8262C14.4502 14.4808 14.3426 14.2053 14.1279 14C13.9226 13.7947 13.6471 13.6311 13.3018 13.5098C13.1007 13.4316 12.886 13.3607 12.6582 13.2959V16.5947ZM11.7617 8.42188C11.2378 8.47485 10.8081 8.6295 10.4736 8.88965C10.063 9.21631 9.8584 9.66941 9.8584 10.248C9.85841 10.6307 9.96072 10.9386 10.166 11.1719C10.3713 11.3959 10.6469 11.5778 10.9922 11.7178C11.2328 11.8088 11.4894 11.8923 11.7617 11.9697V8.42188Z" fill="#001615"/>
    </svg>`,
  // icons/wallet Size=24px, Type=Chat
  "1657:1717": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.7725 3.5C15.7851 3.50003 17.7155 4.29952 19.1387 5.72266C20.5618 7.14583 21.3612 9.07622 21.3613 11.0889C21.3613 13.1015 20.5618 15.0319 19.1387 16.4551C17.8338 17.7599 16.1025 18.5383 14.2725 18.6592V22.7383L13.5869 22.4639C11.3523 21.57 8.63585 20.2584 6.4707 18.4209C4.30266 16.5809 2.63867 14.1692 2.63867 11.0889C2.63875 9.0762 3.43815 7.14583 4.86133 5.72266C6.2845 4.29951 8.2149 3.50008 10.2275 3.5H13.7725ZM10.2275 4.5C8.48011 4.50008 6.80399 5.19408 5.56836 6.42969C4.33272 7.66533 3.63875 9.34142 3.63867 11.0889C3.63867 13.7683 5.07627 15.926 7.11719 17.6582C8.9518 19.2152 11.236 20.3909 13.2725 21.251V17.6787H13.7725C15.52 17.6787 17.196 16.9837 18.4316 15.748C19.6672 14.5124 20.3613 12.8363 20.3613 11.0889C20.3612 9.34144 19.6673 7.66532 18.4316 6.42969C17.196 5.19409 15.5199 4.50003 13.7725 4.5H10.2275ZM7.67969 9.25977C8.75078 9.26 9.61894 10.1291 9.61914 11.2002C9.6189 12.2713 8.75076 13.1394 7.67969 13.1396C6.60859 13.1394 5.7395 12.2713 5.73926 11.2002C5.73946 10.1291 6.60857 9.25998 7.67969 9.25977ZM12 9.25977C13.0711 9.26 13.9392 10.1291 13.9395 11.2002C13.9392 12.2713 13.0711 13.1394 12 13.1396C10.9289 13.1394 10.0598 12.2713 10.0596 11.2002C10.0598 10.1291 10.9289 9.26001 12 9.25977ZM16.3203 9.25977C17.3914 9.26 18.2596 10.1291 18.2598 11.2002C18.2595 12.2713 17.3914 13.1394 16.3203 13.1396C15.2491 13.1396 14.3801 12.2714 14.3799 11.2002C14.3801 10.129 15.2491 9.25981 16.3203 9.25977ZM7.67969 10.2598C7.16085 10.26 6.73946 10.6814 6.73926 11.2002C6.7395 11.719 7.16087 12.1394 7.67969 12.1396C8.19848 12.1394 8.6189 11.719 8.61914 11.2002C8.61894 10.6814 8.1985 10.26 7.67969 10.2598ZM12 10.2598C11.4812 10.26 11.0598 10.6814 11.0596 11.2002C11.0598 11.719 11.4812 12.1394 12 12.1396C12.5188 12.1394 12.9392 11.719 12.9395 11.2002C12.9392 10.6814 12.5188 10.26 12 10.2598ZM16.3203 10.2598C15.8013 10.2598 15.3801 10.6813 15.3799 11.2002C15.3801 11.7191 15.8014 12.1396 16.3203 12.1396C16.8391 12.1394 17.2595 11.719 17.2598 11.2002C17.2596 10.6814 16.8391 10.26 16.3203 10.2598Z" fill="#001615"/>
    </svg>`,
  // icons/tiers Size=48px, Type=Free
  "1332:1661": `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40.5 24C40.5 14.8873 33.1127 7.5 24 7.5C14.8873 7.5 7.5 14.8873 7.5 24C7.5 33.1127 14.8873 40.5 24 40.5V42C14.0589 42 6 33.9411 6 24C6 14.0589 14.0589 6 24 6C33.9411 6 42 14.0589 42 24C42 33.9411 33.9411 42 24 42V40.5C33.1127 40.5 40.5 33.1127 40.5 24Z" fill="#001615"/>
    <path d="M14 27.2V20H18.335V21.205H15.205V23H17.735V24.2H15.205V27.2H14Z" fill="#001615"/>
    <path d="M18.8344 27.2V20H21.8094C21.8794 20 21.9694 20.0033 22.0794 20.01C22.1894 20.0133 22.291 20.0233 22.3844 20.04C22.801 20.1033 23.1444 20.2417 23.4144 20.455C23.6877 20.6683 23.8894 20.9383 24.0194 21.265C24.1527 21.5883 24.2194 21.9483 24.2194 22.345C24.2194 22.9317 24.071 23.4367 23.7744 23.86C23.4777 24.28 23.0227 24.54 22.4094 24.64L21.8944 24.685H20.0394V27.2H18.8344ZM22.9694 27.2L21.5494 24.27L22.7744 24L24.3344 27.2H22.9694ZM20.0394 23.56H21.7594C21.826 23.56 21.901 23.5567 21.9844 23.55C22.0677 23.5433 22.1444 23.53 22.2144 23.51C22.4144 23.46 22.571 23.3717 22.6844 23.245C22.801 23.1183 22.8827 22.975 22.9294 22.815C22.9794 22.655 23.0044 22.4983 23.0044 22.345C23.0044 22.1917 22.9794 22.035 22.9294 21.875C22.8827 21.7117 22.801 21.5667 22.6844 21.44C22.571 21.3133 22.4144 21.225 22.2144 21.175C22.1444 21.155 22.0677 21.1433 21.9844 21.14C21.901 21.1333 21.826 21.13 21.7594 21.13H20.0394V23.56Z" fill="#001615"/>
    <path d="M25.0359 27.2V20H29.6859V21.13H26.2409V22.905H29.0859V24.035H26.2409V26.07H29.6859V27.2H25.0359Z" fill="#001615"/>
    <path d="M30.4855 27.2V20H35.1355V21.13H31.6905V22.905H34.5355V24.035H31.6905V26.07H35.1355V27.2H30.4855Z" fill="#001615"/>
    </svg>`,
  // icons/tiers Size=48px, Type=Bronze
  "1332:1656": `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="17.25" fill="#E7AA8A" stroke="#A56B4D" stroke-width="1.5"/>
    <path d="M23.1359 14.4836C23.5216 13.8213 24.4784 13.8213 24.8641 14.4836L27.3343 18.7247C27.4756 18.9673 27.7124 19.1393 27.9868 19.1987L32.7836 20.2374C33.5327 20.3997 33.8283 21.3096 33.3177 21.8811L30.0475 25.541C29.8604 25.7503 29.77 26.0287 29.7983 26.308L30.2927 31.191C30.3699 31.9535 29.5959 32.5159 28.8945 32.2069L24.4032 30.2277C24.1463 30.1145 23.8537 30.1145 23.5968 30.2277L19.1055 32.2069C18.4041 32.5159 17.6301 31.9535 17.7073 31.191L18.2017 26.308C18.23 26.0287 18.1396 25.7503 17.9525 25.541L14.6823 21.8811C14.1717 21.3096 14.4673 20.3997 15.2164 20.2374L20.0132 19.1987C20.2876 19.1393 20.5244 18.9673 20.6657 18.7247L23.1359 14.4836Z" fill="#A56B4D"/>
    </svg>`,
  // icons/tiers Size=48px, Type=Silver
  "1332:1657": `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="17.25" fill="#E2E2E2" stroke="#9C9C9C" stroke-width="1.5"/>
    <path d="M23.5684 14.7354C23.7612 14.4043 24.2388 14.4043 24.4316 14.7354L26.9023 18.9766C27.1143 19.3403 27.4694 19.5984 27.8809 19.6875L32.6777 20.7266C33.0522 20.8077 33.1997 21.2621 32.9443 21.5479L29.6748 25.208C29.3942 25.522 29.2584 25.9394 29.3008 26.3584L29.7949 31.2412C29.8335 31.6225 29.4464 31.9036 29.0957 31.749L24.6045 29.7705C24.2192 29.6008 23.7808 29.6008 23.3955 29.7705L18.9043 31.749C18.5536 31.9036 18.1665 31.6225 18.2051 31.2412L18.6992 26.3584C18.7416 25.9394 18.6058 25.522 18.3252 25.208L15.0557 21.5479C14.8003 21.2621 14.9478 20.8077 15.3223 20.7266L20.1191 19.6875C20.5306 19.5984 20.8857 19.3403 21.0977 18.9766L23.5684 14.7354Z" fill="#9C9C9C" stroke="#9C9C9C"/>
    </svg>`,
  // icons/tiers Size=48px, Type=Gold
  "1332:1659": `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="17.25" fill="#FFD258" stroke="#C18D00" stroke-width="1.5"/>
    <path d="M23.1359 14.4836C23.5216 13.8213 24.4784 13.8213 24.8641 14.4836L27.3343 18.7247C27.4756 18.9673 27.7124 19.1393 27.9868 19.1987L32.7836 20.2374C33.5327 20.3997 33.8283 21.3096 33.3177 21.8811L30.0475 25.541C29.8604 25.7503 29.77 26.0287 29.7983 26.308L30.2927 31.191C30.3699 31.9535 29.5959 32.5159 28.8945 32.2069L24.4032 30.2277C24.1463 30.1145 23.8537 30.1145 23.5968 30.2277L19.1055 32.2069C18.4041 32.5159 17.6301 31.9535 17.7073 31.191L18.2017 26.308C18.23 26.0287 18.1396 25.7503 17.9525 25.541L14.6823 21.8811C14.1717 21.3096 14.4673 20.3997 15.2164 20.2374L20.0132 19.1987C20.2876 19.1393 20.5244 18.9673 20.6657 18.7247L23.1359 14.4836Z" fill="#C18D00"/>
    </svg>`,
  // icons/tiers Size=48px, Type=Platinum
  "1332:1660": `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="17.25" fill="#C7D4DC" stroke="#75838B" stroke-width="1.5"/>
    <path d="M23.1782 14.1855C23.5759 13.6118 24.4241 13.6118 24.8218 14.1856L27.1961 17.6105C27.3663 17.8561 27.6376 18.0127 27.9354 18.0374L32.0886 18.381C32.7843 18.4386 33.2085 19.1732 32.9105 19.8045L31.1315 23.5731C31.0039 23.8434 31.0039 24.1566 31.1315 24.4269L32.9105 28.1955C33.2085 28.8268 32.7843 29.5614 32.0886 29.619L27.9354 29.9626C27.6376 29.9873 27.3663 30.1439 27.1961 30.3895L24.8218 33.8144C24.4241 34.3882 23.5759 34.3882 23.1782 33.8144L20.8039 30.3895C20.6337 30.1439 20.3624 29.9873 20.0646 29.9626L15.9114 29.619C15.2157 29.5614 14.7915 28.8268 15.0895 28.1955L16.8685 24.4269C16.9961 24.1566 16.9961 23.8434 16.8685 23.5731L15.0895 19.8045C14.7915 19.1732 15.2157 18.4386 15.9114 18.381L20.0646 18.0374C20.3624 18.0127 20.6337 17.8561 20.8039 17.6105L23.1782 14.1855Z" fill="#75838B"/>
    </svg>`,
  // icons/tiers Size=48px, Type=Diamond
  "1332:1658": `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="17.25" fill="#BDEDFF" stroke="#3AAFDD" stroke-width="1.5"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.7635 33.8175C24.364 34.2896 23.6362 34.2896 23.2367 33.8175L14.3928 23.3657C13.8429 22.7158 14.3049 21.7197 15.1562 21.7197H32.844C33.6954 21.7197 34.1573 22.7158 33.6074 23.3657L24.7635 33.8175ZM33.1999 18.9645C33.8411 19.591 33.3975 20.6797 32.501 20.6797H15.594C14.6975 20.6797 14.2539 19.591 14.8951 18.9645L17.6374 16.2848C17.8242 16.1022 18.0751 16 18.3363 16H29.7587C30.0199 16 30.2707 16.1022 30.4576 16.2848L33.1999 18.9645Z" fill="#3AAFDD"/>
    </svg>`,
  // icons/tiers Size=48px, Type=Legend
  "1706:1407": `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="17.25" fill="#F8E1D8" stroke="#FF7E50" stroke-width="1.5"/>
    <mask id="mask0_1706_1407" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="8" y="8" width="32" height="32">
    <circle cx="24" cy="24" r="16" fill="#BDEDFF"/>
    </mask>
    <g mask="url(#mask0_1706_1407)">
    <path d="M23.2785 27.0892C23.6986 27.0299 24.125 27.0299 24.5451 27.0892C26.8622 27.4163 28.5494 29.4537 28.4391 31.7911L27.06 61H20.7637L19.3845 31.7911C19.2742 29.4537 20.9615 27.4163 23.2785 27.0892Z" fill="#FF7E50"/>
    <path d="M23.9118 10C25.4766 10 26.7452 11.2685 26.7452 12.8333C26.7452 13.9757 26.0687 14.9595 25.0948 15.4078L25.433 22.7113C27.9443 23.0419 30.1656 24.0718 31.7834 25.5452L30.8451 27.1703C28.7956 26.2381 26.3316 25.694 23.6806 25.694C21.2105 25.694 18.9025 26.166 16.941 26.9846L15.9326 25.2372C17.6178 23.8425 19.8725 22.9007 22.3925 22.659L22.7282 15.4078C21.7546 14.9594 21.0785 13.9755 21.0785 12.8333C21.0785 11.2685 22.347 10 23.9118 10Z" fill="#FF7E50"/>
    </g>
    </svg>`,
  // icons/action Size=16px, Type=Alarm
  "1688:1182": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.00187 5.35797V8.23669H9.92101C10.0483 8.23669 10.1703 8.28724 10.2603 8.37722C10.3503 8.46719 10.4008 8.58923 10.4008 8.71648C10.4008 8.84372 10.3503 8.96576 10.2603 9.05574C10.1703 9.14571 10.0483 9.19626 9.92101 9.19626H7.52208C7.39483 9.19626 7.2728 9.14571 7.18282 9.05574C7.09284 8.96576 7.0423 8.84372 7.0423 8.71648V5.35797C7.0423 5.23073 7.09284 5.10869 7.18282 5.01871C7.2728 4.92874 7.39483 4.87819 7.52208 4.87819C7.64933 4.87819 7.77136 4.92874 7.86134 5.01871C7.95132 5.10869 8.00187 5.23073 8.00187 5.35797ZM1.76465 4.3984C1.76465 5.12912 2.0909 5.78306 2.60619 6.22303C2.36636 6.86727 2.24384 7.54926 2.24443 8.23669C2.24443 9.65398 2.75637 10.9513 3.60559 11.9546L2.38501 13.1751C2.33919 13.2194 2.30264 13.2723 2.27749 13.3309C2.25235 13.3894 2.23911 13.4524 2.23856 13.5161C2.238 13.5798 2.25014 13.6429 2.27427 13.7019C2.29839 13.7609 2.33402 13.8144 2.37906 13.8595C2.42411 13.9045 2.47768 13.9402 2.53665 13.9643C2.59561 13.9884 2.65879 14.0006 2.72249 14C2.7862 13.9994 2.84916 13.9862 2.90769 13.9611C2.96623 13.9359 3.01917 13.8994 3.06343 13.8535L4.28401 12.633C5.32235 13.5138 6.64027 13.9963 8.00187 13.9941C9.41916 13.9941 10.7165 13.4822 11.7197 12.633L12.9403 13.8535C13.0308 13.9409 13.152 13.9893 13.2778 13.9882C13.4036 13.9871 13.5239 13.9367 13.6129 13.8477C13.7018 13.7587 13.7523 13.6384 13.7534 13.5126C13.7545 13.3868 13.7061 13.2656 13.6187 13.1751L12.3981 11.9546C13.2789 10.9162 13.7614 9.59829 13.7593 8.23669C13.7593 7.52853 13.6312 6.85011 13.3975 6.22303C13.6487 6.00797 13.8526 5.74333 13.9966 5.4457C14.1406 5.14808 14.2215 4.82391 14.2343 4.49353C14.247 4.16315 14.1914 3.8337 14.0708 3.52586C13.9502 3.21801 13.7672 2.93842 13.5334 2.70464C13.2997 2.47085 13.0201 2.28791 12.7122 2.16731C12.4044 2.0467 12.0749 1.99103 11.7446 2.00379C11.4142 2.01655 11.09 2.09747 10.7924 2.24146C10.4948 2.38545 10.2301 2.58941 10.0151 2.84054C9.3709 2.60108 8.68908 2.47889 8.00187 2.47974C7.2937 2.47974 6.61529 2.60784 5.98821 2.8415C5.66974 2.46839 5.24455 2.20189 4.76994 2.0779C4.29533 1.95391 3.79412 1.9784 3.33385 2.14806C2.87359 2.31772 2.4764 2.62441 2.19582 3.02678C1.91524 3.42915 1.76476 3.90786 1.76465 4.3984ZM2.72422 4.3984C2.7242 4.12643 2.80124 3.86002 2.9464 3.63004C3.09157 3.40005 3.29892 3.21589 3.54444 3.09891C3.78996 2.98192 4.06361 2.93689 4.33367 2.96903C4.60373 3.00116 4.85917 3.10916 5.07038 3.2805C4.23651 3.77511 3.54029 4.47133 3.04568 5.3052C2.83769 5.04875 2.72419 4.72859 2.72422 4.3984ZM13.2795 4.3984C13.2795 4.74193 13.1591 5.05763 12.9581 5.3052C12.4634 4.47133 11.7672 3.77511 10.9334 3.2805C11.1446 3.10916 11.4 3.00116 11.6701 2.96903C11.9401 2.93689 12.2138 2.98192 12.4593 3.09891C12.7048 3.21589 12.9122 3.40005 13.0573 3.63004C13.2025 3.86002 13.2795 4.12643 13.2795 4.3984ZM8.00187 3.43883C10.6517 3.43883 12.7997 5.58683 12.7997 8.23669C12.7997 10.8865 10.6517 13.0346 8.00187 13.0346C5.35201 13.0346 3.20401 10.8865 3.20401 8.23669C3.20401 5.58683 5.35201 3.43883 8.00187 3.43883Z" fill="#001615"/>
    </svg>`,
  // icons/action Size=16px, Type=Download
  "1345:4085": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.50098 12C2.50098 12.8284 3.17255 13.5 4.00098 13.5H12.001C12.8292 13.4997 13.501 12.8283 13.501 12V10H14.501V12C14.501 13.3805 13.3815 14.4997 12.001 14.5H4.00098C2.62027 14.5 1.50098 13.3807 1.50098 12V10H2.50098V12ZM8.5 8.79199L12.1475 5.14551L12.501 5.5L12.8545 5.85352L8.00098 10.707L7.64648 10.3535L3.14648 5.85352L3.5 5.5L3.85352 5.14551L7.5 8.79199V1H8.5V8.79199Z" fill="#001615"/>
    </svg>`,
  // icons/action Size=16px, Type=Share
  "1457:1820": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.50049 12.25C2.50049 13.0784 3.17206 13.75 4.00049 13.75H12.0005C12.8287 13.7497 13.5005 13.0783 13.5005 12.25V10.25H14.5005V12.25C14.5005 13.6305 13.381 14.7497 12.0005 14.75H4.00049C2.61978 14.75 1.49951 13.6307 1.49951 12.25V10.25H2.50049V12.25ZM12.854 5.39648L12.5005 5.75L12.147 6.10449L8.49951 2.45801V10.25H7.49951V2.45801L3.85303 6.10449L3.49951 5.75L3.146 5.39648L7.646 0.896484L8.00049 0.542969L12.854 5.39648Z" fill="#001615"/>
    </svg>`,
  // icons/action Size=16px, Type=Check-enclosed
  "778:189": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_778_189)">
    <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#001615"/>
    <path d="M4.44385 7.99998L7.11051 10.6666L11.555 5.33331" stroke="white" stroke-width="0.888889"/>
    </g>
    <defs>
    <clipPath id="clip0_778_189">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>`,
  // icons/action Size=16px, Type=Hot
  "778:188": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.0328 7.33124C12.7295 6.64852 12.2885 6.03574 11.7375 5.53124L11.2828 5.11406C11.2674 5.10028 11.2488 5.0905 11.2287 5.08558C11.2086 5.08067 11.1876 5.08076 11.1675 5.08585C11.1475 5.09094 11.129 5.10087 11.1137 5.11478C11.0984 5.12869 11.0867 5.14615 11.0797 5.16562L10.8766 5.74843C10.75 6.11406 10.5172 6.48749 10.1875 6.85468C10.1656 6.87812 10.1406 6.88437 10.1234 6.88593C10.1063 6.88749 10.0797 6.88437 10.0562 6.86249C10.0344 6.84374 10.0234 6.81562 10.025 6.78749C10.0828 5.84687 9.80156 4.78593 9.18594 3.63124C8.67656 2.67187 7.96875 1.92343 7.08437 1.40156L6.43906 1.02187C6.35469 0.971869 6.24688 1.03749 6.25156 1.13593L6.28594 1.88593C6.30937 2.39843 6.25 2.85156 6.10938 3.22812C5.9375 3.68906 5.69062 4.11718 5.375 4.50156C5.15535 4.76869 4.9064 5.01031 4.63281 5.22187C3.97391 5.72838 3.43815 6.37739 3.06562 7.12031C2.69402 7.8697 2.50045 8.69477 2.5 9.53124C2.5 10.2687 2.64531 10.9828 2.93281 11.6562C3.21042 12.3046 3.61103 12.8931 4.1125 13.3891C4.61875 13.8891 5.20625 14.2828 5.86094 14.5562C6.53906 14.8406 7.25781 14.9844 8 14.9844C8.74219 14.9844 9.46094 14.8406 10.1391 14.5578C10.7921 14.286 11.386 13.8895 11.8875 13.3906C12.3938 12.8906 12.7906 12.3062 13.0672 11.6578C13.3543 10.9862 13.5015 10.2632 13.5 9.53281C13.5 8.77031 13.3438 8.02968 13.0328 7.33124Z" fill="#001615"/>
    </svg>`,
  // icons/action Size=16px, Type=Tridot
  "1452:1802": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7C3.55228 7 4 7.44772 4 8C4 8.55228 3.55228 9 3 9C2.44772 9 2 8.55228 2 8C2 7.44772 2.44772 7 3 7ZM8 7C8.55228 7 9 7.44772 9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7ZM13 7C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9C12.4477 9 12 8.55228 12 8C12 7.44772 12.4477 7 13 7Z" fill="#001615"/>
    </svg>`,
  // icons/action Size=16px, Type=Sell
  "1601:2455": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1601_2455)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00049 0.5C12.1424 0.500264 15.5005 3.85803 15.5005 8C15.5005 12.142 12.1424 15.4997 8.00049 15.5C3.85835 15.5 0.499512 12.1421 0.499512 8C0.499512 3.85786 3.85835 0.5 8.00049 0.5ZM8.00049 1.5C4.41064 1.5 1.50049 4.41015 1.50049 8C1.50049 11.5899 4.41064 14.5 8.00049 14.5C11.5901 14.4997 14.5005 11.5897 14.5005 8C14.5005 4.41031 11.5901 1.50026 8.00049 1.5ZM8.49951 10.792L12.147 7.14551L12.5005 7.5L12.854 7.85352L8.00049 12.707L7.646 12.3535L3.146 7.85352L3.49951 7.5L3.85303 7.14551L7.49951 10.792V3H8.49951V10.792Z" fill="#001615"/>
    </g>
    <defs>
    <clipPath id="clip0_1601_2455">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>`,
  // icons/action Size=16px, Type=Now
  "1574:1827": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.66699 4.00002V2.66669H2.73366C8.60033 2.66669 13.3337 7.40002 13.3337 13.2667V13.3334H12.0003V13.2667C12.0003 8.13335 7.86699 4.00002 2.66699 4.00002ZM2.66699 6.66669V5.33335C4.78872 5.33335 6.82356 6.17621 8.32385 7.6765C9.82414 9.17679 10.667 11.2116 10.667 13.3334H9.33366C9.33366 12.4579 9.16122 11.591 8.82619 10.7821C8.49116 9.97329 8.00009 9.23837 7.38104 8.61931C6.76198 8.00025 6.02705 7.50919 5.21821 7.17416C4.40938 6.83913 3.54247 6.66669 2.66699 6.66669ZM2.66699 9.33335V8.00002C4.08148 8.00002 5.43803 8.56192 6.43823 9.56212C7.43842 10.5623 8.00033 11.9189 8.00033 13.3334H6.66699C6.66699 12.2725 6.24556 11.2551 5.49542 10.5049C4.74527 9.75478 3.72786 9.33335 2.66699 9.33335ZM2.66699 10.6667C3.37424 10.6667 4.05251 10.9476 4.55261 11.4477C5.05271 11.9478 5.33366 12.6261 5.33366 13.3334H2.66699V10.6667Z" fill="#001615"/>
    </svg>`,
  // icons/warnings Size=16px, Type=Error
  "1339:2571": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1339_2571)">
    <path d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM11.3535 5.35352L8.70703 8L11.3535 10.6465L10.6465 11.3535L8 8.70703L5.35352 11.3535L4.64648 10.6465L7.29297 8L4.64648 5.35352L5.35352 4.64648L8 7.29297L10.6465 4.64648L11.3535 5.35352Z" fill="#FF574A"/>
    </g>
    <defs>
    <clipPath id="clip0_1339_2571">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>`,
  // icons/warnings Size=16px, Type=Success
  "1339:2572": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1339_2572)">
    <path d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM11.5557 5.33301L11.8965 5.61719L7.45215 10.9512L7.14062 11.3252L6.79688 10.9805L4.12988 8.31348L4.44434 8L4.75879 7.68555L7.08008 10.0078L11.2139 5.04883L11.5557 5.33301Z" fill="#17F9B4"/>
    </g>
    <defs>
    <clipPath id="clip0_1339_2572">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>`,
  // icons/wallet Size=24px, Type=Chart
  "1556:782": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 5.5H9.5C10.3284 5.5 11 6.17157 11 7V17C11 17.8284 10.3284 18.5 9.5 18.5H9V21H8V18.5H7.5C6.67157 18.5 6 17.8284 6 17V7C6 6.17157 6.67157 5.5 7.5 5.5H8V3H9V5.5ZM16 7.5H16.5C17.3284 7.5 18 8.17157 18 9V15C18 15.8284 17.3284 16.5 16.5 16.5H16V21H15V16.5H14.5C13.6716 16.5 13 15.8284 13 15V9C13 8.17157 13.6716 7.5 14.5 7.5H15V3H16V7.5ZM7.5 6.5C7.22386 6.5 7 6.72386 7 7V17C7 17.2761 7.22386 17.5 7.5 17.5H9.5C9.77614 17.5 10 17.2761 10 17V7C10 6.72386 9.77614 6.5 9.5 6.5H7.5ZM14.5 8.5C14.2239 8.5 14 8.72386 14 9V15C14 15.2761 14.2239 15.5 14.5 15.5H16.5C16.7761 15.5 17 15.2761 17 15V9C17 8.72386 16.7761 8.5 16.5 8.5H14.5Z" fill="#001615"/>
    </svg>`,
};

const CASES: ReadonlyArray<readonly [string, string, React.FC<React.SVGProps<SVGSVGElement>>]> = [
  ["icons/action Alarm", "1688:1182", FigmaActionAlarmIcon],
  ["icons/action Download", "1345:4085", FigmaActionDownloadIcon],
  ["icons/action Share", "1457:1820", FigmaActionShareIcon],
  ["icons/action Check-enclosed", "778:189", FigmaActionCheckEnclosedIcon],
  ["icons/action Hot", "778:188", FigmaActionHotIcon],
  ["icons/action Tridot", "1452:1802", FigmaActionTridotIcon],
  ["icons/action Sell", "1601:2455", FigmaActionSellIcon],
  ["icons/action Now", "1574:1827", FigmaActionNowIcon],
  ["icons/warnings Error", "1339:2571", FigmaWarningsErrorIcon],
  ["icons/warnings Success", "1339:2572", FigmaWarningsSuccessIcon],
  ["icons/wallet Chart", "1556:782", FigmaWalletChartIcon],
  ["icons/wallet Spending", "1556:807", FigmaWalletSpendingIcon],
  ["icons/wallet Add", "1657:1706", FigmaWalletAddIcon],
  ["icons/wallet Chat", "1657:1717", FigmaWalletChatIcon],
  ["icons/tiers Free", "1332:1661", FigmaTiersFreeIcon],
];

/** The medallions with fixed colours: every shape and every paint is the export's. */
const TIERS: ReadonlyArray<readonly [string, string, React.FC<React.SVGProps<SVGSVGElement>>]> = [
  ["Bronze", "1332:1656", FigmaTiersBronzeIcon],
  ["Silver", "1332:1657", FigmaTiersSilverIcon],
  ["Gold", "1332:1659", FigmaTiersGoldIcon],
  ["Platinum", "1332:1660", FigmaTiersPlatinumIcon],
  ["Diamond", "1332:1658", FigmaTiersDiamondIcon],
  ["Legend", "1706:1407", FigmaTiersLegendIcon],
];

const SHAPE_ATTRS = ["d", "cx", "cy", "r", "fill-rule", "clip-rule", "fill", "stroke", "stroke-width"] as const;

/** In document order. A "path, circle" selector list does not keep it on the
 *  parsed export (it returns every path before any circle). */
function shapesOf(root: Element) {
  const drawnTags = new Set(["path", "circle"]);
  const els = Array.from(root.getElementsByTagName("*")).filter((el) => drawnTags.has(el.tagName.toLowerCase()));
  return els.map((el) => {
    const inMask = el.parentElement?.tagName.toLowerCase() === "mask";
    return [el.tagName.toLowerCase(), inMask ? "mask" : "", ...SHAPE_ATTRS.map((a) => el.getAttribute(a))];
  });
}

type Drawn = { d: string | null; fillRule: string | null; clipRule: string | null; strokeWidth: string | null };

function exported(node: string) {
  const doc = new DOMParser().parseFromString(EXPORTS[node], "image/svg+xml");
  const svg = doc.documentElement;
  const paths: Drawn[] = Array.from(svg.getElementsByTagName("path")).map((p) => ({
    d: p.getAttribute("d"),
    fillRule: p.getAttribute("fill-rule"),
    clipRule: p.getAttribute("clip-rule"),
    strokeWidth: p.getAttribute("stroke-width"),
  }));
  return { viewBox: svg.getAttribute("viewBox"), paths };
}

function drawn(Icon: React.FC<React.SVGProps<SVGSVGElement>>) {
  const { container } = render(<Icon />);
  const svg = container.querySelector("svg");
  const paths: Drawn[] = Array.from(svg?.querySelectorAll("path") ?? []).map((p) => ({
    d: p.getAttribute("d"),
    fillRule: p.getAttribute("fill-rule"),
    clipRule: p.getAttribute("clip-rule"),
    strokeWidth: p.getAttribute("stroke-width"),
  }));
  return { svg, viewBox: svg?.getAttribute("viewBox") ?? null, paths, container };
}

describe("Skai-Design icon components", () => {
  it.each(CASES)("%s (%s) draws the component's box and paths", (_label, node, Icon) => {
    const want = exported(node);
    const got = drawn(Icon);
    expect(want.paths.length).toBeGreaterThan(0);
    expect(got.viewBox).toBe(want.viewBox);
    expect(got.paths).toEqual(want.paths);
  });

  it.each(CASES)("%s paints from currentColor", (_label, _node, Icon) => {
    const { container } = render(<Icon />);
    const painted: string[] = [];
    for (const el of Array.from(container.querySelectorAll("path"))) {
      const fill = el.getAttribute("fill");
      if (fill && fill !== "none") painted.push(fill);
    }
    expect(painted.length).toBeGreaterThan(0);
    expect(new Set(painted)).toEqual(new Set(["currentColor"]));
  });

  it.each(CASES)("%s carries no ids, so two mounts cannot collide", (_label, _node, Icon) => {
    const { container } = render(
      <>
        <Icon />
        <Icon />
      </>,
    );
    expect(container.querySelectorAll("svg")).toHaveLength(2);
    expect(container.querySelectorAll("[id]")).toHaveLength(0);
    expect(container.innerHTML).not.toContain("url(#");
  });

  it("Check-enclosed keeps the export's white tick and lets a class restroke it", () => {
    const plain = render(<FigmaActionCheckEnclosedIcon />).container.querySelectorAll("path")[1];
    expect(plain.getAttribute("stroke")).toBe("white");
    expect(plain.getAttribute("class")).toBeNull();

    const toned = render(<FigmaActionCheckEnclosedIcon tickClassName="stroke-green-coal-300" />).container;
    const [disc, tick] = Array.from(toned.querySelectorAll("path"));
    expect(tick.getAttribute("class")).toBe("stroke-green-coal-300");
    expect(disc.getAttribute("class")).toBeNull();
    expect(toned.querySelector("svg")?.getAttribute("tickClassName")).toBeNull();
  });
});

describe("Skai-Design icons/tiers medallions", () => {
  it.each(TIERS)("%s (%s) draws the export's shapes in the export's colours", (_label, node, Icon) => {
    const want = new DOMParser().parseFromString(EXPORTS[node], "image/svg+xml").documentElement;
    const got = render(<Icon />).container.querySelector("svg");
    expect(got?.getAttribute("viewBox")).toBe(want.getAttribute("viewBox"));
    expect(shapesOf(got!)).toEqual(shapesOf(want));
  });

  it("Legend masks its mark to the disc with an id of its own on every mount", () => {
    const { container } = render(
      <>
        <FigmaTiersLegendIcon />
        <FigmaTiersLegendIcon />
      </>,
    );
    const wantMask = new DOMParser()
      .parseFromString(EXPORTS["1706:1407"], "image/svg+xml")
      .documentElement.getElementsByTagName("mask")[0];
    const box = (m: Element | null | undefined) =>
      ["maskUnits", "x", "y", "width", "height"].map((a) => m?.getAttribute(a));
    const svgs = Array.from(container.querySelectorAll("svg"));
    for (const svg of svgs) expect(box(svg.querySelector("mask"))).toEqual(box(wantMask));
    const ids = svgs.map((svg) => svg.querySelector("mask")?.getAttribute("id"));
    expect(ids[0]).toBeTruthy();
    expect(ids[0]).not.toBe(ids[1]);
    svgs.forEach((svg, i) => {
      expect(svg.querySelector("g")?.getAttribute("mask")).toBe(`url(#${ids[i]})`);
      expect(svg.querySelector("mask")?.getAttribute("style")).toContain("mask-type: alpha");
    });
  });
});
