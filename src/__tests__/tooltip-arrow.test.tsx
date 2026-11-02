/**
 * TooltipArrow: the `connector` of Figma's `tool-tip` component (1243:960 in
 * main 7746:117670), read 2026-10-30 on 9102:300724's instance 9135:86683.
 *
 * The oracle is the vector's own SVG export, pasted as Figma returned it. The
 * export draws the point turned to the right (the board's bubble opens left of
 * its trigger); Radix draws an arrow base up and point down and turns it per
 * side, so the test turns the export the same way (x and y swapped) before
 * comparing it with what the arrow renders.
 */
import { cleanup, render } from "@testing-library/react";
import * as React from "react";
import { beforeAll, describe, expect, it } from "vitest";

import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/feedback/tooltip";
import skaiPreset from "../lib/tailwind-preset";

const CONNECTOR_EXPORT = `<svg width="15" height="35" viewBox="0 0 15 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.5329 14.8039C14.9298 16.332 14.9298 18.6735 13.5329 20.2016L0 35.0056L3.06029e-06 -3.8147e-05L13.5329 14.8039Z" fill="#123F3C"/>
</svg>`;

/** The connector frame and its vector: 35.006 along the edge, 16 out. */
const CONNECTOR = { along: 35.006, out: 16 } as const;

beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

/** Every command's points of an absolute M/L/C/Z path, as [x, y] pairs. */
function points(d: string): Array<[number, number]> {
  const nums = (d.match(/-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []).map(Number);
  const out: Array<[number, number]> = [];
  for (let i = 0; i + 1 < nums.length; i += 2) out.push([nums[i], nums[i + 1]]);
  return out;
}

function mount(arrow: React.ReactNode = <TooltipArrow />) {
  return render(
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger>Max. leverage</TooltipTrigger>
        <TooltipContent className="overflow-visible">
          Max. leverage for this pair is 40x.
          {arrow}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
}

describe("TooltipArrow (tool-tip connector 1243:960)", () => {
  it("draws the export's rounded point, turned to point down", () => {
    const want = new DOMParser()
      .parseFromString(CONNECTOR_EXPORT, "image/svg+xml")
      .documentElement.getElementsByTagName("path")[0]
      .getAttribute("d")!;
    const turned = points(want).map(([x, y]) => [y, x]);
    const { baseElement } = mount();
    const arrows = baseElement.querySelectorAll("svg");
    // One arrow: Radix's screen-reader copy of the content leaves it out.
    expect(arrows).toHaveLength(1);
    const got = points(arrows[0].querySelector("path")!.getAttribute("d")!);
    expect(got).toHaveLength(turned.length);
    got.forEach(([x, y], i) => {
      expect(Math.abs(x - turned[i][0]), `x of point ${i}`).toBeLessThan(0.001);
      expect(Math.abs(y - turned[i][1]), `y of point ${i}`).toBeLessThan(0.001);
    });
    // The rounded point stops short of the frame's 16.
    expect(Math.max(...got.map(([, y]) => y))).toBeLessThan(CONNECTOR.out);
  });

  it("stands 35 along the bubble's edge and 16 out from it, stretched to that box", () => {
    const { baseElement } = mount();
    const svg = baseElement.querySelector("svg")!;
    expect(Number(svg.getAttribute("width"))).toBe(Math.round(CONNECTOR.along));
    expect(Number(svg.getAttribute("height"))).toBe(CONNECTOR.out);
    expect(svg.getAttribute("viewBox")).toBe("0 0 35.0056 16");
    expect(svg.getAttribute("preserveAspectRatio")).toBe("none");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });

  it("fills Green Coal 100 by name, the bubble's #123F3C, and takes a caller's fill instead", () => {
    const coal = (skaiPreset.theme?.extend as { colors: Record<string, Record<string, string>> }).colors["green-coal"];
    expect(coal["100"].toUpperCase()).toBe("#123F3C");
    const plain = mount().baseElement.querySelector("svg")!;
    expect(plain.getAttribute("class")?.split(/\s+/)).toContain("fill-green-coal-100");
    cleanup();
    const toned = mount(<TooltipArrow className="fill-sky-blue" />).baseElement.querySelector("svg")!;
    const cls = toned.getAttribute("class")?.split(/\s+/) ?? [];
    expect(cls).toContain("fill-sky-blue");
    expect(cls).not.toContain("fill-green-coal-100");
  });

  it("lets a caller size it", () => {
    const svg = mount(<TooltipArrow width={20} height={8} />).baseElement.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("8");
  });
});
