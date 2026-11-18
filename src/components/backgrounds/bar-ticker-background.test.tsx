/**
 * BarTickerBackground's layers. Every page that draws it with no props (the landing's hero and
 * onboarding steps, the status page, the wallet) keeps its markup; the dashboard places its
 * front bars apart from the back ones through frontClassName.
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BarTickerBackground, backHeights, frontHeights } from "./bar-ticker-background";

const layersOf = (root: HTMLElement) => ({
  back: root.querySelector(".ticker-bars-back")!,
  front: root.querySelector(".ticker-bars-front")!,
});

describe("BarTickerBackground", () => {
  it("with no props draws both layers and the depth overlay, with the classes it always had", () => {
    const { container } = render(<BarTickerBackground />);
    const { back, front } = layersOf(container);
    expect(back.getAttribute("class")).toBe("ticker-bars-wrapper ticker-bars-back transition-all duration-300");
    expect(front.getAttribute("class")).toBe("ticker-bars-wrapper ticker-bars-front transition-all duration-300");
    expect(container.querySelector(".stock-ticker-blur")).not.toBeNull();
    expect(container.querySelector(".ticker-shimmer")).toBeNull();
  });

  it("puts className on the back layer only and frontClassName on the front layer only", () => {
    const { container } = render(<BarTickerBackground className="page-back" frontClassName="page-front" />);
    const { back, front } = layersOf(container);
    expect(back.classList.contains("page-back")).toBe(true);
    expect(back.classList.contains("page-front")).toBe(false);
    expect(front.classList.contains("page-front")).toBe(true);
    expect(front.classList.contains("page-back")).toBe(false);
  });

  it("drops the depth overlay on request", () => {
    const { container } = render(<BarTickerBackground showDepthBlur={false} />);
    expect(container.querySelector(".stock-ticker-blur")).toBeNull();
  });

  it("gives each layer 160 bars a half, the back's tallest 1 and the front's .958", () => {
    expect(backHeights).toHaveLength(160);
    expect(frontHeights).toHaveLength(160);
    expect(Math.max(...backHeights)).toBe(1);
    expect(Math.max(...frontHeights)).toBe(0.958);
  });
});
