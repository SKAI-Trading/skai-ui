import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  AUTH_WALLET_IDS,
  AUTH_WALLET_ICONS,
  AUTH_WALLET_LABELS,
  PhantomWalletIcon,
  RainbowWalletIcon,
} from "./auth-wallet-icons";

/**
 * Sum the `translate(x y)` transforms between an element and the root <svg>,
 * exclusive of the root. SVG evaluates a `clip-path` in the coordinate space of
 * the element carrying it, so the clip's real position is its own coordinates
 * plus this offset, the same way a path's is.
 */
function translateOffset(el: Element): { x: number; y: number } {
  const offset = { x: 0, y: 0 };
  for (let node: Element | null = el; node && node.tagName !== "svg"; node = node.parentElement) {
    const match = /translate\(\s*(-?[\d.]+)[\s,]+(-?[\d.]+)\s*\)/.exec(node.getAttribute("transform") ?? "");
    if (match) {
      offset.x += Number(match[1]);
      offset.y += Number(match[2]);
    }
  }
  return offset;
}

describe("auth wallet ids", () => {
  it("lists the four wallets the frames draw, in frame order", () => {
    expect(AUTH_WALLET_IDS).toEqual(["io.metamask", "app.phantom", "me.rainbow", "walletConnect"]);
  });

  it("has a label and an icon for every id", () => {
    for (const id of AUTH_WALLET_IDS) {
      expect(AUTH_WALLET_LABELS[id]).toBeTruthy();
      const Icon = AUTH_WALLET_ICONS[id];
      const { container } = render(<Icon />);
      expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("centres the Phantom clip circle on the 20px square it clips (report 956fb9ad)", () => {
    const { container } = render(<PhantomWalletIcon />);

    const clipped = container.querySelector("[clip-path]");
    expect(clipped).not.toBeNull();
    const clipId = /url\(#(.+)\)/.exec(clipped!.getAttribute("clip-path")!)![1];
    const circle = container.querySelector(`clipPath[id="${clipId}"] circle`);
    expect(circle).not.toBeNull();

    const square = container.querySelector('path[d="M20 0H0V20H20V0Z"]');
    expect(square).not.toBeNull();

    // Both centres in the root box. The circle inherits the offset of the
    // element that references it; the square inherits its own ancestors'.
    const clipOffset = translateOffset(clipped!);
    const circleCentre = {
      x: clipOffset.x + Number(circle!.getAttribute("cx")),
      y: clipOffset.y + Number(circle!.getAttribute("cy")),
    };
    const squareOffset = translateOffset(square!);
    const squareCentre = { x: squareOffset.x + 10, y: squareOffset.y + 10 };

    expect(circleCentre).toEqual(squareCentre);
    expect(squareCentre).toEqual({ x: 12, y: 12 });
    // r=10 on a 20px square: the disc is the square's inscribed circle, so no
    // edge of it is cut by the square and none of the square shows outside it.
    expect(Number(circle!.getAttribute("r"))).toBe(10);
  });

  it("gives two Rainbow marks on one page distinct gradient ids", () => {
    const { container } = render(
      <>
        <RainbowWalletIcon />
        <RainbowWalletIcon />
      </>,
    );
    const ids = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
