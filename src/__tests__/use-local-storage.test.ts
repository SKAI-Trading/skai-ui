import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../hooks/use-local-storage";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default-value"),
    );

    expect(result.current[0]).toBe("default-value");
  });

  it("should return stored value from localStorage", () => {
    localStorageMock.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default-value"),
    );

    expect(result.current[0]).toBe("stored-value");
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorageMock.getItem("test-key")!)).toBe("updated");
  });

  it("should support function updates", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("should handle complex objects", () => {
    const initialValue = { name: "test", count: 0 };
    const { result } = renderHook(() =>
      useLocalStorage("object-key", initialValue),
    );

    act(() => {
      result.current[1]({ name: "updated", count: 5 });
    });

    expect(result.current[0]).toEqual({ name: "updated", count: 5 });
  });

  it("should handle arrays", () => {
    const { result } = renderHook(() =>
      useLocalStorage<string[]>("array-key", []),
    );

    act(() => {
      result.current[1](["a", "b", "c"]);
    });

    expect(result.current[0]).toEqual(["a", "b", "c"]);
  });

  it("should remove item from localStorage", () => {
    localStorageMock.setItem("test-key", JSON.stringify("value"));

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => {
      result.current[2](); // removeValue
    });

    expect(localStorageMock.getItem("test-key")).toBeNull();
    expect(result.current[0]).toBe("default");
  });

  it("should handle invalid JSON in localStorage", () => {
    localStorageMock.setItem("test-key", "invalid-json{");

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("default");
    expect(console.warn).toHaveBeenCalled();
  });
});
