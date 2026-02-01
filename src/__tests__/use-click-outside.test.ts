import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useClickOutside,
  useClickOutsideMultiple,
} from "../hooks/use-click-outside";

describe("useClickOutside", () => {
  it("should call handler when clicking outside", () => {
    const handler = vi.fn();
    const { result } = renderHook(() =>
      useClickOutside<HTMLDivElement>(handler),
    );

    // Create and attach the ref to a real element
    const element = document.createElement("div");
    document.body.appendChild(element);

    // Manually set the ref
    act(() => {
      (result.current as React.MutableRefObject<HTMLDivElement>).current =
        element;
    });

    // Simulate click outside
    act(() => {
      const outsideClick = new MouseEvent("mousedown", { bubbles: true });
      document.body.dispatchEvent(outsideClick);
    });

    expect(handler).toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it("should not call handler when clicking inside", () => {
    const handler = vi.fn();
    const { result } = renderHook(() =>
      useClickOutside<HTMLDivElement>(handler),
    );

    const element = document.createElement("div");
    document.body.appendChild(element);

    act(() => {
      (result.current as React.MutableRefObject<HTMLDivElement>).current =
        element;
    });

    // Simulate click inside
    act(() => {
      const insideClick = new MouseEvent("mousedown", { bubbles: true });
      element.dispatchEvent(insideClick);
    });

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it("should work with touch events", () => {
    const handler = vi.fn();
    const { result } = renderHook(() =>
      useClickOutside<HTMLDivElement>(handler),
    );

    const element = document.createElement("div");
    document.body.appendChild(element);

    act(() => {
      (result.current as React.MutableRefObject<HTMLDivElement>).current =
        element;
    });

    // Simulate touch outside
    act(() => {
      const touchEvent = new TouchEvent("touchstart", { bubbles: true });
      document.body.dispatchEvent(touchEvent);
    });

    expect(handler).toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it("should not call handler when disabled", () => {
    const handler = vi.fn();
    // Note: enabled is the second parameter
    const { result } = renderHook(() =>
      useClickOutside<HTMLDivElement>(handler, false),
    );

    const element = document.createElement("div");
    document.body.appendChild(element);

    act(() => {
      (result.current as React.MutableRefObject<HTMLDivElement>).current =
        element;
    });

    act(() => {
      const outsideClick = new MouseEvent("mousedown", { bubbles: true });
      document.body.dispatchEvent(outsideClick);
    });

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(element);
  });
});

describe("useClickOutsideMultiple", () => {
  it("should call handler when clicking outside all refs", () => {
    const handler = vi.fn();
    const ref1 = { current: null as HTMLDivElement | null };
    const ref2 = { current: null as HTMLDivElement | null };

    const element1 = document.createElement("div");
    const element2 = document.createElement("div");
    document.body.appendChild(element1);
    document.body.appendChild(element2);

    ref1.current = element1;
    ref2.current = element2;

    renderHook(() => useClickOutsideMultiple([ref1, ref2], handler));

    // Simulate click outside both
    act(() => {
      const outsideClick = new MouseEvent("mousedown", { bubbles: true });
      document.body.dispatchEvent(outsideClick);
    });

    expect(handler).toHaveBeenCalled();

    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });

  it("should not call handler when clicking inside any ref", () => {
    const handler = vi.fn();
    const ref1 = { current: null as HTMLDivElement | null };
    const ref2 = { current: null as HTMLDivElement | null };

    const element1 = document.createElement("div");
    const element2 = document.createElement("div");
    document.body.appendChild(element1);
    document.body.appendChild(element2);

    ref1.current = element1;
    ref2.current = element2;

    renderHook(() => useClickOutsideMultiple([ref1, ref2], handler));

    // Simulate click inside first element
    act(() => {
      const insideClick = new MouseEvent("mousedown", { bubbles: true });
      element1.dispatchEvent(insideClick);
    });

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });
});
