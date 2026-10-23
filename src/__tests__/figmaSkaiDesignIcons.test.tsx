/**
 * The Skai-Design icon components (file TyX8YAtNDEIvsnSLQ3IXId) that open
 * frames name and the package did not export: the explorer address line's
 * Alarm, Predict's Hot, the Trench chart CTA, the row-menu Tridot, the
 * warnings Error and Success marks and the rest below. Rows had been leaving
 * them as stand-ins (lucide AlarmClock, the fire emoji, FigmaCandlestickIcon)
 * because nothing here drew the component itself.
 *
 * The oracle is each component's own SVG export, pasted as Figma returned it
 * (exportAsync SVG_STRING, 2026-10-23), clip groups and #001615 fills
 * included. The tests read the paths out of that text and compare them with
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
  FigmaWalletChartIcon,
  FigmaWarningsErrorIcon,
  FigmaWarningsSuccessIcon,
} from "../figma-icons";

const EXPORTS: Record<string, string> = {
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
];

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
