import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "../components/data-display/carousel";

// embla-carousel-react is hard to drive in jsdom (no layout); we mock it to
// return a stable api with a known scrollSnapList. The behaviour we care about
// here is the rendered <button> markup, not embla itself.
vi.mock("embla-carousel-react", () => {
  const fakeApi = {
    canScrollPrev: () => false,
    canScrollNext: () => true,
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    scrollTo: vi.fn(),
    selectedScrollSnap: () => 0,
    scrollSnapList: () => [0, 0.33, 0.66],
    on: vi.fn(),
    off: vi.fn(),
  };
  return {
    default: () => [vi.fn(), fakeApi],
  };
});

describe("CarouselDots — a11y", () => {
  it("renders dot buttons with type=button and aria-current on active", () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>1</CarouselItem>
          <CarouselItem>2</CarouselItem>
          <CarouselItem>3</CarouselItem>
        </CarouselContent>
        <CarouselDots />
      </Carousel>,
    );
    const buttons = Array.from(container.querySelectorAll("button[aria-label^='Go to slide']"));
    expect(buttons.length).toBeGreaterThan(0);
    // Every dot must declare type="button" to avoid form-submit when nested.
    buttons.forEach((b) => {
      expect(b.getAttribute("type")).toBe("button");
    });
    // The first dot is active per our mock — should expose aria-current
    expect(buttons[0].getAttribute("aria-current")).toBe("true");
    // Inactive dots must not declare aria-current
    expect(buttons[1].getAttribute("aria-current")).toBeNull();
  });
});
