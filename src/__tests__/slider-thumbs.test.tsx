/// <reference types="vitest/globals" />
import { describe, it, expect, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { Slider } from "../components/forms/slider";

beforeAll(() => {
  // Radix Slider uses ResizeObserver via @radix-ui/react-use-size; jsdom
  // doesn't provide one.
  (
    global as unknown as { ResizeObserver: unknown }
  ).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("Slider thumbs", () => {
  it("renders a single thumb when defaultValue has one value", () => {
    const { container } = render(<Slider defaultValue={[50]} max={100} />);
    const thumbs = container.querySelectorAll('[role="slider"]');
    expect(thumbs.length).toBe(1);
  });

  it("renders two thumbs for a range slider (defaultValue with two values)", () => {
    const { container } = render(
      <Slider defaultValue={[10, 80]} max={100} />,
    );
    const thumbs = container.querySelectorAll('[role="slider"]');
    expect(thumbs.length).toBe(2);
  });

  it("renders three thumbs for a multi-handle slider", () => {
    const { container } = render(
      <Slider defaultValue={[5, 25, 60]} max={100} />,
    );
    const thumbs = container.querySelectorAll('[role="slider"]');
    expect(thumbs.length).toBe(3);
  });

  it("renders thumbs from controlled `value` prop", () => {
    const { container } = render(
      <Slider value={[20, 70]} onValueChange={() => {}} max={100} />,
    );
    const thumbs = container.querySelectorAll('[role="slider"]');
    expect(thumbs.length).toBe(2);
  });
});
