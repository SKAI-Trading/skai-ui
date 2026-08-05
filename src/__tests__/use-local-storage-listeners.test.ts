import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLocalStorage } from "../hooks/use-local-storage";

/**
 * Regression: prior to W60-UI-01 the `local-storage` listener was registered
 * with an inline `() => setStoredValue(readValue())` and removed with a
 * SECOND inline arrow — those are different Function identities, so cleanup
 * never actually unregistered anything. Mounting and unmounting the hook
 * repeatedly leaked event listeners forever.
 */
describe("useLocalStorage — listener cleanup (regression)", () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addSpy = vi.spyOn(window, "addEventListener");
    removeSpy = vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("removes both storage and local-storage listeners with the SAME function identity on unmount", () => {
    const { unmount } = renderHook(() => useLocalStorage("k", "v"));

    const localStorageAdds = addSpy.mock.calls.filter(
      (call: unknown[]) => call[0] === "local-storage",
    );
    expect(localStorageAdds.length).toBe(1);
    const addedHandler = localStorageAdds[0][1];

    unmount();

    const localStorageRemoves = removeSpy.mock.calls.filter(
      (call: unknown[]) => call[0] === "local-storage",
    );
    expect(localStorageRemoves.length).toBe(1);
    // Must be the EXACT same Function identity that was registered.
    expect(localStorageRemoves[0][1]).toBe(addedHandler);
  });

  it("does not crash when a cross-tab StorageEvent delivers malformed JSON", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { result } = renderHook(() =>
      useLocalStorage<string>("safe-key", "initial"),
    );
    expect(result.current[0]).toBe("initial");

    // Dispatch a StorageEvent with junk JSON for our key — should be swallowed
    // and console.warn'd, NOT throw inside the handler.
    expect(() => {
      const evt = new StorageEvent("storage", {
        key: "safe-key",
        newValue: "{not valid json",
      });
      window.dispatchEvent(evt);
    }).not.toThrow();

    expect(warnSpy).toHaveBeenCalled();
    expect(result.current[0]).toBe("initial");
    warnSpy.mockRestore();
  });
});
