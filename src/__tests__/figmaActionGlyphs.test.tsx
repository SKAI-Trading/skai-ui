/**
 * The icons/action glyphs, the two icons/message bubbles and the rank star the
 * wave 90 boards draw (HQ-604), added beside FigmaActionLinkOutIcon, and the
 * quick-bet notice's icons/warnings Info.
 *
 * Two oracles, neither of them the constant under test:
 *  - OPENINGS: each path's opening move as the read lane's log prints it
 *    (wave80 lanes/L220/LOG-L220.md, 2026-11-23; Info from L223's saved read,
 *    lanes/L223/figma/r1-result.txt line 27), typed here by hand;
 *  - EXPORTS: each instance's SVG export, pasted as the read returned it
 *    (lanes/L220/figma/<tag>-result.txt or lanes/L223/figma/r1-result.txt,
 *    the lines named beside each).
 * Enter came later, from the Gaming cap field's read (HQ-695, 2026-11-25): its
 * opening and export are that read's exportAsync of I14422:79646;976:361.
 * The star's export was cut after its filter box, so its oracle is the path,
 * the paints and the effect the same log records for it.
 */

import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import {
  FigmaActionAlertOnIcon,
  FigmaActionArrowUpIcon,
  FigmaActionCopyIcon,
  FigmaActionDeleteIcon,
  FigmaActionEditIcon,
  FigmaActionEnterIcon,
  FigmaActionForwardIcon,
  FigmaActionPinIcon,
  FigmaActionRerunIcon,
  FigmaActionRightChevronIcon,
  FigmaMessageBarIcon,
  FigmaMessageDotsIcon,
  FigmaRankStarIcon,
  FigmaWarningsInfoIcon,
  type FigmaRankStarTier,
} from "../figma-icons";
import * as icons from "../icons";

const GLYPHS = {
  FigmaActionRerunIcon,
  FigmaActionAlertOnIcon,
  FigmaActionCopyIcon,
  FigmaActionPinIcon,
  FigmaActionDeleteIcon,
  FigmaActionForwardIcon,
  FigmaActionArrowUpIcon,
  FigmaActionRightChevronIcon,
  FigmaActionEditIcon,
  FigmaActionEnterIcon,
  FigmaMessageDotsIcon,
  FigmaMessageBarIcon,
  FigmaWarningsInfoIcon,
} as const;

type GlyphName = keyof typeof GLYPHS;

/** LOG-L220.md: the s6, s10 and m-notes lines and the hand-off blocks. */
const OPENINGS: Record<GlyphName, string[]> = {
  FigmaActionRerunIcon: ["M12.8896 9.99805"],
  FigmaActionAlertOnIcon: ["M7.72656 2.87695"],
  FigmaActionCopyIcon: ["M9.5 8.13086"],
  FigmaActionPinIcon: ["M7.9502 1.22266"],
  FigmaActionDeleteIcon: ["M10.833 2.83301"],
  FigmaActionForwardIcon: ["M15.707 8"],
  FigmaActionArrowUpIcon: ["M4 10"],
  FigmaActionRightChevronIcon: ["M11.4141 8"],
  FigmaActionEditIcon: ["M12.3096 1.5"],
  FigmaActionEnterIcon: ["M14.1674 2.66699"],
  FigmaMessageDotsIcon: ["M9.28906 0.831055"],
  FigmaMessageBarIcon: ["M9.28906 0.831055", "M5 6.5"],
  FigmaWarningsInfoIcon: ["M8 0"],
};

const EXPORTS: Record<GlyphName, string> = {
  // s10-result.txt lines 3-5
  FigmaActionRerunIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.8896 9.99805L13.3535 10.1855C12.9447 11.1973 12.2602 12.0746 11.3779 12.7168C10.4957 13.3588 9.45063 13.7403 8.3623 13.8184C7.27391 13.8963 6.18452 13.668 5.21973 13.1582C4.68297 12.8745 4.19886 12.5069 3.77832 12.0771V14H2.77832V10.667C2.77832 10.391 3.00236 10.1672 3.27832 10.167H6.61133V11.167H4.29688C4.68669 11.616 5.15622 11.9931 5.68652 12.2734C6.48583 12.6958 7.38831 12.8858 8.29004 12.8213C9.19181 12.7567 10.058 12.4401 10.7891 11.9082C11.5202 11.3761 12.088 10.649 12.4268 9.81055L12.8896 9.99805ZM13.1113 5.33301C13.1113 5.60915 12.8875 5.83301 12.6113 5.83301H9.27832V4.83301H11.5918C11.2019 4.38417 10.7324 4.00671 10.2021 3.72656C9.40296 3.30452 8.50109 3.11515 7.59961 3.17969C6.69787 3.24438 5.83156 3.56079 5.10059 4.09277C4.36971 4.6248 3.80262 5.35131 3.46387 6.18945L2.53613 5.81445C2.94494 4.80298 3.62973 3.92627 4.51172 3.28418C5.39384 2.6422 6.43916 2.25978 7.52734 2.18164C8.6157 2.10365 9.70511 2.33312 10.6699 2.84277C11.2066 3.12635 11.6908 3.49318 12.1113 3.92285V2H13.1113V5.33301Z" fill="white"/>
</svg>`,
  // s6-result.txt lines 4-6
  FigmaActionAlertOnIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.72656 2.87695C7.90238 2.86392 8.07952 2.89989 8.23633 2.98047C8.39292 3.06111 8.52458 3.18357 8.61621 3.33398C8.70674 3.48284 8.75511 3.65399 8.75586 3.82812V12.167C8.75541 12.3429 8.70605 12.515 8.61426 12.665C8.52237 12.8152 8.39097 12.9381 8.23438 13.0186C8.07797 13.0988 7.90188 13.1348 7.72656 13.1221C7.5513 13.1092 7.38239 13.0483 7.23926 12.9463L5.1543 11.46H3.20996C2.62413 11.4598 2.06171 11.2268 1.64746 10.8125C1.23344 10.3983 1.00011 9.83664 1 9.25098V6.74902C1.00012 6.16324 1.23327 5.60077 1.64746 5.18652C2.06168 4.77248 2.62429 4.54016 3.20996 4.54004H5.15234L7.23828 3.05371C7.38134 2.9509 7.5509 2.89014 7.72656 2.87695ZM11.1152 2.91602C11.1862 2.91873 11.2567 2.9362 11.3213 2.96582C12.2852 3.40925 13.102 4.11961 13.6748 5.0127C14.2477 5.90609 14.553 6.94554 14.5537 8.00684C14.5537 9.06449 14.2496 10.1054 13.6748 11.001C13.1023 11.8943 12.2854 12.6049 11.3213 13.0479C11.1908 13.1077 11.0409 13.1134 10.9062 13.0635C10.7716 13.0135 10.6625 12.9118 10.6025 12.7812C10.5427 12.6507 10.537 12.5019 10.5869 12.3672C10.6369 12.2325 10.7386 12.1224 10.8691 12.0625C11.6454 11.7097 12.302 11.1377 12.7578 10.417H12.7588C13.2186 9.69785 13.4631 8.86139 13.4629 8.00781C13.4626 7.26057 13.2744 6.52649 12.9189 5.87305L12.7568 5.59863C12.2951 4.87951 11.6364 4.30779 10.8594 3.95215C10.7947 3.92251 10.7359 3.88023 10.6875 3.82812C10.6392 3.77609 10.6019 3.71494 10.5771 3.64844C10.5524 3.58175 10.5403 3.51054 10.543 3.43945C10.5456 3.36836 10.5631 3.29806 10.5928 3.2334L10.6201 3.17383L10.6396 3.16992C10.6646 3.13054 10.6923 3.09239 10.7266 3.06055C10.7786 3.0124 10.8398 2.97488 10.9062 2.9502C10.9729 2.92553 11.0442 2.91336 11.1152 2.91602ZM5.75293 5.44824C5.59038 5.56418 5.39497 5.62698 5.19531 5.62695H3.33594V5.63379H3.21094C2.91267 5.63396 2.62598 5.75201 2.41504 5.96289C2.20415 6.17383 2.08612 6.46053 2.08594 6.75879V9.26074C2.08598 9.55906 2.2042 9.84561 2.41504 10.0566C2.62599 10.2676 2.91262 10.3865 3.21094 10.3867H5.19531C5.39487 10.3867 5.59043 10.4486 5.75293 10.5645L7.67285 11.9326V4.0791L5.75293 5.44824ZM10.1855 5.3125C10.3243 5.27533 10.4723 5.29449 10.5967 5.36621L10.7666 5.47168C11.1538 5.7301 11.477 6.07493 11.7109 6.47949C11.9782 6.94171 12.1198 7.46608 12.1201 8C12.1203 8.53385 11.9796 9.05904 11.7129 9.52148C11.4461 9.98385 11.0619 10.3687 10.5996 10.6357L10.5967 10.6377C10.4728 10.7048 10.327 10.7207 10.1914 10.6826C10.0557 10.6444 9.93983 10.5546 9.86914 10.4326C9.79854 10.3107 9.77831 10.1659 9.8125 10.0293C9.8469 9.89259 9.93381 9.7743 10.0537 9.7002L10.0566 9.69824C10.3539 9.52604 10.601 9.27809 10.7725 8.98047C10.9439 8.68275 11.0344 8.34453 11.0342 8.00098C11.0339 7.65721 10.9425 7.31911 10.7705 7.02148C10.5984 6.72392 10.3505 6.47643 10.0527 6.30469C9.92865 6.23282 9.83795 6.11409 9.80078 5.97559C9.76378 5.83703 9.78288 5.68871 9.85449 5.56445L9.89062 5.50195H9.90234C9.97418 5.41085 10.0722 5.34297 10.1855 5.3125Z" fill="white"/>
</svg>`,
  // s3-result.txt lines 8-10
  FigmaActionCopyIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.5 8.13086C9.5 7.75031 9.49949 7.49472 9.4834 7.29785C9.47165 7.15418 9.45319 7.06675 9.43164 7.00684L9.40918 6.95508C9.32929 6.79829 9.20172 6.67072 9.04492 6.59082C8.98445 6.56005 8.89243 6.53223 8.70117 6.5166C8.50398 6.50052 8.24752 6.5 7.86621 6.5H4.13379C3.75249 6.5 3.49602 6.50052 3.29883 6.5166C3.10758 6.53223 3.01556 6.56005 2.95508 6.59082C2.79829 6.67072 2.67072 6.79829 2.59082 6.95508C2.56005 7.01556 2.53223 7.10758 2.5166 7.29883C2.50052 7.49602 2.5 7.75249 2.5 8.13379V11.8662C2.5 12.2475 2.50052 12.504 2.5166 12.7012C2.53223 12.8924 2.56005 12.9844 2.59082 13.0449C2.67072 13.2017 2.79829 13.3293 2.95508 13.4092L3.00684 13.4316C3.06675 13.4532 3.15418 13.4716 3.29785 13.4834C3.49472 13.4995 3.75031 13.5 4.13086 13.5H7.86914C8.24973 13.5 8.50536 13.4995 8.70215 13.4834C8.89285 13.4678 8.98435 13.44 9.04492 13.4092C9.20172 13.3293 9.32929 13.2017 9.40918 13.0449C9.44 12.9844 9.46778 12.8929 9.4834 12.7022C9.49951 12.5054 9.5 12.2498 9.5 11.8691V8.13086ZM10.5 9.5H11.8691C12.2495 9.5 12.5053 9.49951 12.7022 9.4834C12.8929 9.46777 12.9845 9.43995 13.0449 9.40918C13.2017 9.32929 13.3293 9.20172 13.4092 9.04492C13.44 8.98445 13.4678 8.89243 13.4834 8.70117C13.4995 8.50398 13.5 8.24752 13.5 7.86621V4.13379C13.5 3.75249 13.4995 3.49602 13.4834 3.29883C13.4678 3.10758 13.44 3.01556 13.4092 2.95508C13.3293 2.79829 13.2017 2.67072 13.0449 2.59082C12.9844 2.56005 12.8924 2.53223 12.7012 2.5166C12.504 2.50052 12.2475 2.5 11.8662 2.5H8.13379C7.75249 2.5 7.49602 2.50052 7.29883 2.5166C7.10758 2.53223 7.01556 2.56005 6.95508 2.59082C6.7979 2.67087 6.67088 2.7979 6.59082 2.95508C6.56005 3.01556 6.53223 3.10758 6.5166 3.29883C6.50052 3.49602 6.5 3.75249 6.5 4.13379V5.5H7.86621C8.2313 5.5 8.53579 5.49932 8.78321 5.51953C9.03643 5.54023 9.2742 5.58569 9.49903 5.7002C9.84384 5.87594 10.1241 6.15616 10.2998 6.50098L10.374 6.67188C10.4359 6.84524 10.465 7.02631 10.4805 7.21582C10.5007 7.46291 10.5 7.76666 10.5 8.13086V9.5ZM14.5 7.86621C14.5 8.2313 14.5007 8.53579 14.4805 8.78321C14.4598 9.03643 14.4143 9.2742 14.2998 9.49903C14.1241 9.84384 13.8438 10.1241 13.499 10.2998C13.2742 10.4143 13.0362 10.4598 12.7832 10.4805C12.5362 10.5007 12.2329 10.5 11.8691 10.5H10.5V11.8691C10.5 12.2331 10.5006 12.5363 10.4805 12.7832C10.4598 13.0362 10.4143 13.2743 10.2998 13.499C10.1241 13.8438 9.84384 14.1241 9.49903 14.2998C9.2744 14.4142 9.03698 14.4597 8.78418 14.4805C8.53714 14.5007 8.23322 14.5 7.86914 14.5H4.13086C3.76666 14.5 3.46291 14.5007 3.21582 14.4805C3.02631 14.465 2.84524 14.4359 2.67188 14.374L2.50098 14.2998C2.15616 14.1241 1.87594 13.8438 1.7002 13.499C1.58569 13.2742 1.54023 13.0364 1.51953 12.7832C1.49932 12.5358 1.5 12.2313 1.5 11.8662V8.13379C1.5 7.76871 1.49932 7.46422 1.51953 7.2168C1.54023 6.96358 1.58569 6.7258 1.7002 6.50098C1.87594 6.15616 2.15616 5.87594 2.50098 5.7002C2.7258 5.58569 2.96358 5.54023 3.2168 5.51953C3.46422 5.49932 3.76871 5.5 4.13379 5.5H5.5V4.13379C5.5 3.76871 5.49932 3.46422 5.51953 3.2168C5.54023 2.96358 5.58569 2.7258 5.7002 2.50098C5.87611 2.1557 6.1557 1.87611 6.50098 1.7002C6.7258 1.58569 6.96358 1.54023 7.2168 1.51953C7.46422 1.49932 7.76871 1.5 8.13379 1.5H11.8662C12.2313 1.5 12.5358 1.49932 12.7832 1.51953C13.0364 1.54023 13.2742 1.58569 13.499 1.7002C13.8438 1.87594 14.1241 2.15616 14.2998 2.50098C14.4143 2.7258 14.4598 2.96358 14.4805 3.2168C14.5007 3.46422 14.5 3.76871 14.5 4.13379V7.86621Z" fill="#56C7F3"/>
</svg>`,
  // s2-result.txt lines 9-11
  FigmaActionPinIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.9502 1.22266C8.14351 1.12302 8.37943 1.1597 8.5332 1.31348L14.6865 7.46777C14.84 7.62152 14.8768 7.85669 14.7773 8.0498C14.6776 8.24286 14.4643 8.35047 14.25 8.31445L12.4609 8.0127C10.9577 9.12732 9.54897 10.3641 8.24707 11.709L8.64746 12.7725C8.73028 12.9926 8.64875 13.2415 8.45117 13.3691C8.25342 13.4966 7.99268 13.4689 7.82617 13.3027L5.61523 11.0918L2.01953 14.6875L1.3125 13.9805L4.9082 10.3848L3.62012 9.09766L3.62109 9.09668L2.69727 8.1748C2.53083 8.00839 2.50346 7.74768 2.63086 7.5498C2.75852 7.35203 3.00723 7.27055 3.22754 7.35352L4.29102 7.75293C5.63601 6.45081 6.87266 5.04153 7.9873 3.53809L7.68652 1.75C7.65053 1.53573 7.75723 1.32241 7.9502 1.22266ZM9.27246 3.46582C7.92438 5.3757 6.38968 7.1464 4.69141 8.75293L6.10449 10.167L7.24609 11.3086C8.85251 9.61021 10.6234 8.07575 12.5332 6.72754L9.27246 3.46582Z" fill="white"/>
</svg>`,
  // s2-result.txt lines 14-16
  FigmaActionDeleteIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.833 2.83301H14.5V3.83301H13.0986L11.4941 14.7393L11.4316 15.166H4.56738L4.50488 14.7393L2.90137 3.83301H1.5V2.83301H5.16699V0.833008H10.833V2.83301ZM5.43164 14.166H10.5674L12.0879 3.83301H3.91211L5.43164 14.166ZM8.5 12.5H7.5V5.5H8.5V12.5ZM6.16699 2.83301H9.83301V1.83301H6.16699V2.83301Z" fill="#FF574A"/>
</svg>`,
  // s2-result.txt lines 32-34
  FigmaActionForwardIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.707 8L9.35352 14.3535L8.64648 13.6465L13.793 8.5H1V7.5H13.793L8.64648 2.35352L9.35352 1.64648L15.707 8Z" fill="white"/>
</svg>`,
  // s4-result.txt lines 93-95
  FigmaActionArrowUpIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 10L8 6L12 10H4Z" fill="white"/>
</svg>`,
  // s5-result.txt lines 70-72
  FigmaActionRightChevronIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.4141 8L5.06055 14.3535L4.35352 13.6465L10 8L4.35352 2.35352L5.06055 1.64648L11.4141 8Z" fill="#95A09F"/>
</svg>`,
  // s10-result.txt lines 9-11
  FigmaActionEditIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.3096 1.5C12.597 1.50009 12.8819 1.55701 13.1475 1.66699C13.4131 1.77707 13.655 1.93831 13.8584 2.1416C14.0618 2.34509 14.2239 2.58767 14.334 2.85352C14.4439 3.11917 14.5 3.40391 14.5 3.69141C14.5 3.97918 14.4432 4.26442 14.333 4.53027C14.2229 4.79602 14.0618 5.03782 13.8584 5.24121L5.84961 13.251C5.70188 13.3982 5.52844 13.5174 5.33887 13.6016L5.14355 13.6738L2.53125 14.4658H2.53027C2.39203 14.5073 2.24447 14.5108 2.10449 14.4756C1.96474 14.4403 1.83639 14.3685 1.73438 14.2666C1.63227 14.1646 1.55983 14.0364 1.52441 13.8965C1.489 13.7565 1.49188 13.609 1.5332 13.4707L1.53418 13.4688L2.32715 10.8574V10.8564C2.40883 10.5901 2.55466 10.3471 2.75195 10.1504L10.7598 2.1416C10.9632 1.93825 11.205 1.77706 11.4707 1.66699C11.7365 1.55694 12.0219 1.5 12.3096 1.5ZM13.4004 12.9004C13.6764 12.9004 13.9003 13.1244 13.9004 13.4004C13.9004 13.6765 13.6765 13.9004 13.4004 13.9004H8.60059C8.32457 13.9002 8.10059 13.6764 8.10059 13.4004C8.10071 13.1244 8.32465 12.9005 8.60059 12.9004H13.4004ZM12.3086 2.5C12.1525 2.50008 11.9978 2.53113 11.8535 2.59082C11.7091 2.65063 11.5773 2.73817 11.4668 2.84863L3.45898 10.8584L3.45801 10.8594C3.37698 10.9403 3.31679 11.0399 3.2832 11.1494L2.59961 13.3994L4.85254 12.7168C4.96209 12.6835 5.06243 12.6238 5.14355 12.543L13.1514 4.53418C13.262 4.42362 13.3493 4.2919 13.4092 4.14746C13.4691 4.00292 13.5 3.84786 13.5 3.69141C13.5 3.535 13.47 3.37986 13.4102 3.23535C13.3503 3.09085 13.2619 2.95924 13.1514 2.84863C13.0408 2.73817 12.909 2.65064 12.7646 2.59082C12.6202 2.53106 12.4649 2.50002 12.3086 2.5Z" fill="#56C7F3"/>
</svg>`,
  // s7-result.txt lines 3-5
  FigmaMessageDotsIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.28906 0.831055C10.7899 0.831055 12.2298 1.42703 13.291 2.48828C14.3521 3.54951 14.9482 4.98949 14.9482 6.49023C14.948 7.99065 14.3519 9.43017 13.291 10.4912C12.3483 11.4337 11.1064 12.0082 9.78906 12.125V15.168L9.10352 14.8945C7.4723 14.242 5.47969 13.2806 3.8877 11.9297C2.29287 10.5762 1.05105 8.786 1.05078 6.49023C1.05078 4.98958 1.647 3.54949 2.70801 2.48828C3.76919 1.4271 5.20924 0.831133 6.70996 0.831055H9.28906ZM6.70996 1.83105C5.47445 1.83113 4.28868 2.32167 3.41504 3.19531C2.54156 4.06899 2.05078 5.2548 2.05078 6.49023C2.05105 8.38536 3.0663 9.92121 4.53418 11.167C5.79851 12.24 7.36314 13.0644 8.78906 13.6797V11.1484H9.28906C10.5244 11.1484 11.7093 10.6575 12.583 9.78418C13.4565 8.91064 13.948 7.72558 13.9482 6.49023C13.9482 5.25466 13.4567 4.06902 12.583 3.19531C11.7093 2.32184 10.5245 1.83105 9.28906 1.83105H6.70996ZM4.85645 5.52246C5.43515 5.52246 5.90424 5.99162 5.9043 6.57031C5.9043 7.14905 5.43518 7.61816 4.85645 7.61816C4.27775 7.61811 3.80859 7.14902 3.80859 6.57031C3.80865 5.99166 4.27779 5.52252 4.85645 5.52246ZM8.00098 5.52246C8.57968 5.52246 9.04877 5.99162 9.04883 6.57031C9.04883 7.14905 8.57972 7.61816 8.00098 7.61816C7.42228 7.61811 6.95312 7.14902 6.95312 6.57031C6.95318 5.99166 7.42232 5.52252 8.00098 5.52246ZM11.1436 5.52246C11.7223 5.52246 12.1913 5.99162 12.1914 6.57031C12.1914 7.14905 11.7223 7.61816 11.1436 7.61816C10.565 7.61798 10.0957 7.14894 10.0957 6.57031C10.0958 5.99174 10.565 5.52265 11.1436 5.52246ZM11.1436 6.52246C11.1173 6.52265 11.0958 6.54402 11.0957 6.57031C11.0957 6.59665 11.1173 6.61798 11.1436 6.61816C11.17 6.61816 11.1914 6.59677 11.1914 6.57031C11.1913 6.54391 11.17 6.52246 11.1436 6.52246ZM4.85645 6.52246C4.83007 6.52252 4.80865 6.54394 4.80859 6.57031C4.80859 6.59673 4.83004 6.61811 4.85645 6.61816C4.8829 6.61816 4.9043 6.59677 4.9043 6.57031C4.90424 6.54391 4.88286 6.52246 4.85645 6.52246ZM8.00098 6.52246C7.97461 6.52252 7.95318 6.54394 7.95312 6.57031C7.95312 6.59673 7.97457 6.61811 8.00098 6.61816C8.02743 6.61816 8.04883 6.59677 8.04883 6.57031C8.04877 6.54391 8.02739 6.52246 8.00098 6.52246Z" fill="white"/>
</svg>`,
  // s6-result.txt lines 56-59
  FigmaMessageBarIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.28906 0.831055C10.7899 0.831055 12.2298 1.42703 13.291 2.48828C14.3521 3.54951 14.9482 4.98949 14.9482 6.49023C14.948 7.99065 14.3519 9.43017 13.291 10.4912C12.3483 11.4337 11.1064 12.0082 9.78906 12.125V15.168L9.10352 14.8945C7.4723 14.242 5.47969 13.2806 3.8877 11.9297C2.29287 10.5762 1.05105 8.786 1.05078 6.49023C1.05078 4.98958 1.647 3.54949 2.70801 2.48828C3.76919 1.4271 5.20924 0.831133 6.70996 0.831055H9.28906ZM6.70996 1.83105C5.47445 1.83113 4.28868 2.32167 3.41504 3.19531C2.54156 4.06899 2.05078 5.2548 2.05078 6.49023C2.05105 8.38536 3.0663 9.92121 4.53418 11.167C5.79851 12.24 7.36314 13.0644 8.78906 13.6797V11.1484H9.28906C10.5244 11.1484 11.7093 10.6575 12.583 9.78418C13.4565 8.91064 13.948 7.72558 13.9482 6.49023C13.9482 5.25466 13.4567 4.06902 12.583 3.19531C11.7093 2.32184 10.5245 1.83105 9.28906 1.83105H6.70996Z" fill="white"/>
<path d="M5 6.5H11" stroke="white"/>
</svg>`,
  // lanes/L223/figma/r1-result.txt lines 25-34 (11216:148617; 11144:190000 compared SAME)
  FigmaWarningsInfoIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_11216_148617)">
<path d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM9 12H7V10.3115H9V12ZM9 9.25H7V4H9V9.25Z" fill="#56C7F3"/>
</g>
<defs>
<clipPath id="clip0_11216_148617">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>`,
  // HQ-695 read, 2026-11-25: exportAsync({ format: "SVG_STRING" }) of I14422:79646;976:361
  FigmaActionEnterIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.1674 2.66699C14.3 2.66699 14.4272 2.71967 14.5209 2.81344C14.6147 2.90721 14.6674 3.03438 14.6674 3.16699V7.50033C14.6674 8.16337 14.404 8.79925 13.9352 9.26809C13.4663 9.73693 12.8304 10.0003 12.1674 10.0003H3.05872L5.53872 12.4803C5.6233 12.5651 5.67466 12.6773 5.68347 12.7968C5.69228 12.9162 5.65795 13.0348 5.58672 13.131L5.53872 13.187C5.45402 13.2718 5.34165 13.3234 5.2221 13.3324C5.10254 13.3413 4.98375 13.307 4.88738 13.2357L4.83138 13.187L1.49805 9.85366C1.41337 9.769 1.36189 9.65676 1.35296 9.53736C1.34402 9.41795 1.37824 9.29931 1.44938 9.20299L1.49805 9.14699L4.83138 5.81366C4.92072 5.72502 5.04019 5.67333 5.16596 5.6689C5.29173 5.66447 5.41454 5.70763 5.50989 5.78977C5.60523 5.8719 5.6661 5.98697 5.68034 6.11201C5.69458 6.23704 5.66115 6.36285 5.58672 6.46433L5.53872 6.52033L3.05872 9.00033H12.1687C12.5487 9.0002 12.9145 8.85588 13.1921 8.59652C13.4698 8.33715 13.6387 7.98207 13.6647 7.60299L13.6687 7.50033V3.16699C13.6687 3.03438 13.7214 2.90721 13.8152 2.81344C13.9089 2.71967 14.0361 2.66699 14.1687 2.66699" fill="white"/>
</svg>`,
};

/** The star as LOG-L220.md's "L210 follow-up" prints it (complete). */
const STAR_PATH =
  "M4.41755 4.45673L1.94691 4.81573C1.04184 4.94724 0.680453 6.05949 1.33537 6.69787L3.12313 8.44051C3.3832 8.69402 3.50188 9.05926 3.44048 9.41721L3.01845 11.8779C2.86384 12.7793 3.80997 13.4667 4.61949 13.0411L6.82929 11.8793C7.15075 11.7103 7.53479 11.7103 7.85625 11.8793L10.0661 13.0411C10.8756 13.4667 11.8217 12.7793 11.6671 11.8779L11.2451 9.41721C11.1837 9.05926 11.3023 8.69402 11.5624 8.44051L13.3502 6.69787C14.0051 6.05949 13.6437 4.94725 12.7386 4.81573L10.268 4.45673C9.9086 4.4045 9.59791 4.17877 9.43717 3.8531L8.33228 1.61433C7.92752 0.794192 6.75803 0.794191 6.35327 1.61432L5.24837 3.8531C5.08764 4.17877 4.77695 4.4045 4.41755 4.45673Z";

/** The same log, its s5 line: fill then stroke, top stop first. */
const STAR_PAINTS: Record<FigmaRankStarTier, { fill: string[]; stroke: string[] }> = {
  gold: { fill: ["#E59664", "#F1B90A"], stroke: ["#F7E19C", "#E59664"] },
  silver: { fill: ["#B5B5B5", "#8B8B8B"], stroke: ["#FFFFFF", "#A1A1A1"] },
  bronze: { fill: ["#BB6851", "#F17E0A"], stroke: ["#F7AA9C", "#E56F64"] },
};

const TIERS: FigmaRankStarTier[] = ["gold", "silver", "bronze"];

/** "M x y" from the start of a path's d. */
function opening(d: string | null): string {
  const m = /^M\s*(-?[\d.]+)[\s,]+(-?[\d.]+)/.exec(d ?? "");
  return m ? `M${m[1]} ${m[2]}` : "";
}

function exportPaths(svg: string) {
  return Array.from(svg.matchAll(/<path ([^>]*?)\/>/g)).map(([, attrs]) => {
    const a = Object.fromEntries(Array.from(attrs.matchAll(/([\w-]+)="([^"]*)"/g)).map((m) => [m[1], m[2]]));
    return { d: a.d, paint: "fill" in a ? "fill" : "stroke" };
  });
}

function renderOne(node: React.ReactElement) {
  const { container } = render(node);
  const svgs = container.querySelectorAll("svg");
  expect(svgs).toHaveLength(1);
  return svgs[0];
}

/** Every `url(#x)` and `href="#x"` reference under an svg, and its ids. */
function references(svg: Element) {
  const refs: string[] = [];
  const ids: string[] = [];
  for (const el of [svg, ...Array.from(svg.querySelectorAll("*"))]) {
    for (const attr of Array.from(el.attributes)) {
      const url = /^url\(#(.+)\)$/.exec(attr.value.trim());
      if (url) refs.push(url[1]);
      if (/href$/.test(attr.name) && attr.value.startsWith("#")) refs.push(attr.value.slice(1));
    }
    const id = el.getAttribute("id");
    if (id) ids.push(id);
  }
  return { refs, ids };
}

function byRef(svg: Element, value: string | null): Element {
  const id = /^url\(#(.+)\)$/.exec(value ?? "")?.[1];
  const el = id ? Array.from(svg.querySelectorAll("[id]")).find((e) => e.id === id) : undefined;
  if (!el) throw new Error(`no paint server for ${value}`);
  return el;
}

describe.each(Object.keys(GLYPHS) as GlyphName[])("%s", (name) => {
  const Icon = GLYPHS[name];

  it("renders one 16 viewBox svg, aria-hidden, painted in currentColor", () => {
    const svg = renderOne(<Icon />);
    expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("fill")).toBe("none");
    const paths = Array.from(svg.querySelectorAll("path"));
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) {
      const paints = ["fill", "stroke"].map((k) => p.getAttribute(k)).filter((v) => v !== null);
      expect(paints).toEqual(["currentColor"]);
    }
  });

  it("opens each path where the read's log says it opens", () => {
    const svg = renderOne(<Icon />);
    const openings = Array.from(svg.querySelectorAll("path")).map((p) => opening(p.getAttribute("d")));
    expect(openings).toEqual(OPENINGS[name]);
  });

  it("draws the export's paths byte for byte, each with the export's kind of paint", () => {
    const svg = renderOne(<Icon />);
    const drawn = Array.from(svg.querySelectorAll("path")).map((p) => ({
      d: p.getAttribute("d"),
      paint: p.hasAttribute("fill") ? "fill" : "stroke",
    }));
    expect(drawn).toEqual(exportPaths(EXPORTS[name]));
  });

  it("lets the caller's props win, and is reachable through the icons barrel", () => {
    const svg = renderOne(<Icon className="size-4 text-ash" viewBox="0 0 24 24" />);
    expect(svg.getAttribute("class")).toBe("size-4 text-ash");
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    expect((icons as unknown as Record<string, unknown>)[name]).toBe(Icon);
  });
});

describe("FigmaRankStarIcon", () => {
  it("is reachable through the icons barrel", () => {
    expect(icons.FigmaRankStarIcon).toBe(FigmaRankStarIcon);
  });

  it.each(TIERS)("%s: one 16 viewBox svg, the log's path in all three places, no currentColor", (tier) => {
    const svg = renderOne(<FigmaRankStarIcon tier={tier} />);
    expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    const ds = Array.from(svg.querySelectorAll("path")).map((p) => p.getAttribute("d"));
    expect(ds).toEqual([STAR_PATH, STAR_PATH, STAR_PATH]);
    expect(opening(ds[0])).toBe("M4.41755 4.45673");
    expect(svg.outerHTML).not.toContain("currentColor");
    // The node's offset in the export's 15 x 16 frame, so the star sits in
    // the 16 box where the board's node does.
    expect(svg.querySelector("g")?.getAttribute("transform")).toBe("translate(0.657227 0.390625)");
  });

  it.each(TIERS)("%s: the fill and the outside stroke take the tier's recorded gradients", (tier) => {
    const svg = renderOne(<FigmaRankStarIcon tier={tier} />);
    const [fillPath, , strokePath] = Array.from(svg.querySelectorAll("path"));
    const stops = (server: Element) =>
      Array.from(server.querySelectorAll("stop")).map((s) => s.getAttribute("stop-color")?.toUpperCase());
    const fill = byRef(svg, fillPath.getAttribute("fill"));
    const stroke = byRef(svg, strokePath.getAttribute("stroke"));
    expect(stops(fill)).toEqual(STAR_PAINTS[tier].fill);
    expect(stops(stroke)).toEqual(STAR_PAINTS[tier].stroke);
    for (const g of [fill, stroke]) {
      // transform [[0,1,0],[-1,0,1]]: top centre to bottom centre of the node.
      expect(g.getAttribute("x1")).toBe(g.getAttribute("x2"));
      expect(Number(g.getAttribute("y2")) - Number(g.getAttribute("y1"))).toBeCloseTo(16, 3);
    }
  });

  it("draws the 1px outside stroke as a 2px stroke masked to the outside", () => {
    const svg = renderOne(<FigmaRankStarIcon tier="gold" />);
    const strokePath = svg.querySelectorAll("path")[2];
    expect(strokePath.getAttribute("stroke-width")).toBe("2");
    const mask = byRef(svg, strokePath.getAttribute("mask"));
    expect(mask.localName).toBe("mask");
    expect(mask.getAttribute("fill")).toBe("black");
    const rect = mask.querySelector("rect");
    expect(rect?.getAttribute("fill")).toBe("white");
    const knockOut = mask.querySelector("path");
    expect(knockOut?.getAttribute("d")).toBe(STAR_PATH);
    expect(knockOut?.hasAttribute("fill")).toBe(false);
  });

  it("casts the recorded shadow: offset 0 1, no blur, black at 0.61", () => {
    const svg = renderOne(<FigmaRankStarIcon tier="bronze" />);
    const group = svg.querySelector("g g");
    const filter = byRef(svg, group?.getAttribute("filter") ?? null);
    const steps = Array.from(filter.children);
    expect(steps.map((s) => s.localName)).not.toContain("feGaussianBlur");
    const offset = steps.find((s) => s.localName === "feOffset");
    expect(offset?.getAttribute("dy")).toBe("1");
    expect(offset?.hasAttribute("dx")).toBe(false);
    const colours = steps.filter((s) => s.localName === "feColorMatrix");
    const colour = colours[colours.length - 1];
    expect(colour?.getAttribute("values")).toBe("0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.61 0");
  });

  it("gives two stars on one page their own paint servers", () => {
    const { container } = render(
      <>
        <FigmaRankStarIcon tier="gold" />
        <FigmaRankStarIcon tier="gold" />
        <FigmaRankStarIcon tier="silver" />
      </>,
    );
    const svgs = Array.from(container.querySelectorAll("svg"));
    expect(svgs).toHaveLength(3);
    const all = svgs.flatMap((svg) => references(svg).ids);
    expect(all.length).toBe(12);
    expect(new Set(all).size).toBe(all.length);
    for (const svg of svgs) {
      const { refs, ids } = references(svg);
      expect(refs.length).toBe(4);
      for (const ref of refs) expect(ids).toContain(ref);
    }
  });

  it("keeps painting when an earlier star is display:none", () => {
    const { container } = render(
      <>
        <div style={{ display: "none" }}>
          <FigmaRankStarIcon tier="gold" />
        </div>
        <FigmaRankStarIcon tier="gold" />
      </>,
    );
    const visible = container.querySelectorAll("svg")[1];
    const { refs, ids } = references(visible);
    expect(refs.length).toBe(4);
    for (const ref of refs) expect(ids).toContain(ref);
  });
});
