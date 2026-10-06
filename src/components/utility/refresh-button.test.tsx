import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RefreshButton, refreshFailed } from "./refresh-button";

function deferred<T = unknown>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const button = () => screen.getByRole("button", { name: "Refresh" });
const icon = () => button().querySelector("[data-icon]") as Element;
const status = () => screen.getByRole("status");

afterEach(() => {
  vi.useRealTimers();
});

describe("RefreshButton", () => {
  it("spins and is disabled for exactly as long as the read is in flight", async () => {
    const read = deferred();
    render(<RefreshButton onRefresh={() => read.promise} />);

    expect(button()).not.toBeDisabled();
    expect(icon()).not.toHaveClass("animate-spin");

    fireEvent.click(button());
    expect(button()).toBeDisabled();
    expect(button()).toHaveAttribute("aria-busy", "true");
    expect(icon()).toHaveClass("animate-spin");
    // The spin has to land on something a transform can turn. The vault's
    // text glyph sat in an inline <span>, where animate-spin does nothing.
    expect(icon().tagName.toLowerCase()).toBe("svg");

    await act(async () => {
      read.resolve(undefined);
    });
    expect(button()).not.toBeDisabled();
    expect(icon()).not.toHaveClass("animate-spin");
  });

  it("starts one read however many times it is pressed while that read runs", async () => {
    const read = deferred();
    const onRefresh = vi.fn(() => read.promise);
    render(<RefreshButton onRefresh={onRefresh} />);

    fireEvent.click(button());
    fireEvent.click(button());
    fireEvent.click(button());
    expect(onRefresh).toHaveBeenCalledTimes(1);

    await act(async () => {
      read.resolve(undefined);
    });
    fireEvent.click(button());
    expect(onRefresh).toHaveBeenCalledTimes(2);
  });

  it("says the read worked, then goes back to rest", async () => {
    vi.useFakeTimers();
    render(<RefreshButton onRefresh={() => Promise.resolve()} succeededMs={1500} />);

    await act(async () => {
      fireEvent.click(button());
    });
    expect(button()).toHaveAttribute("data-status", "succeeded");
    expect(icon()).toHaveAttribute("data-icon", "succeeded");
    expect(status()).toHaveTextContent("Refreshed");
    expect(button().getAttribute("title")).toMatch(/^Updated /);

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(button()).toHaveAttribute("data-status", "idle");
    expect(status()).toHaveTextContent("");
    // The time of the good read stays in the tooltip.
    expect(button().getAttribute("title")).toMatch(/^Updated /);
  });

  it("says the read failed when it rejects, and keeps saying so until one works", async () => {
    vi.useFakeTimers();
    const onRefreshFailed = vi.fn();
    let fail = true;
    render(
      <RefreshButton
        onRefresh={() => (fail ? Promise.reject(new Error("rpc down")) : Promise.resolve())}
        onRefreshFailed={onRefreshFailed}
        failedMs={4000}
      />,
    );

    await act(async () => {
      fireEvent.click(button());
    });
    expect(button()).toHaveAttribute("data-status", "failed");
    expect(icon()).toHaveAttribute("data-icon", "failed");
    expect(icon()).toHaveClass("text-skai-red");
    expect(status()).toHaveTextContent("Couldn't refresh");
    expect(onRefreshFailed).toHaveBeenCalledWith(expect.objectContaining({ message: "rpc down" }));

    await act(async () => {
      vi.advanceTimersByTime(4000);
    });
    expect(button()).toHaveAttribute("data-status", "idle");
    expect(button().getAttribute("title")).toMatch(/^Couldn't refresh/);

    fail = false;
    await act(async () => {
      fireEvent.click(button());
    });
    expect(button()).toHaveAttribute("data-status", "succeeded");
    expect(button().getAttribute("title")).toMatch(/^Updated /);
  });

  it("counts a react-query refetch that came back with an error as a failure", async () => {
    render(<RefreshButton onRefresh={() => Promise.resolve({ isError: true, error: new Error("500") })} />);
    await act(async () => {
      fireEvent.click(button());
    });
    expect(button()).toHaveAttribute("data-status", "failed");
  });

  it("counts a throw before any promise as a failure", async () => {
    render(
      <RefreshButton
        onRefresh={() => {
          throw new Error("no client");
        }}
      />,
    );
    await act(async () => {
      fireEvent.click(button());
    });
    expect(button()).toHaveAttribute("data-status", "failed");
  });

  it("puts the caller's own read time in the tooltip", () => {
    const at = new Date(2026, 9, 6, 15, 4);
    render(<RefreshButton onRefresh={() => undefined} updatedAt={at} messages={{ updatedAt: (t) => `Read ${t}` }} />);
    expect(button().getAttribute("title")).toBe(`Read ${at.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
  });

  it("draws the design-system square unless told otherwise", () => {
    const { rerender } = render(<RefreshButton onRefresh={() => undefined} />);
    expect(button()).toHaveClass("size-8", "rounded-lg", "border-[1.5px]", "border-[#56C7F3]");
    rerender(<RefreshButton onRefresh={() => undefined} size="md" />);
    expect(button()).toHaveClass("size-9");
    rerender(<RefreshButton onRefresh={() => undefined} size="none" className="h-9 flex-1" />);
    expect(button()).not.toHaveClass("size-8");
    expect(button()).toHaveClass("h-9", "flex-1");
    rerender(<RefreshButton onRefresh={() => undefined} variant="ghost" />);
    expect(button()).not.toHaveClass("size-8");
    expect(button()).not.toHaveClass("border-[1.5px]");
  });

  it("adds nothing beside itself in the row it sits in", () => {
    const { container } = render(
      <div data-testid="row">
        <RefreshButton onRefresh={() => undefined} />
        <span>next</span>
      </div>,
    );
    const row = container.querySelector("[data-testid=row]")!;
    expect(Array.from(row.children).map((el) => el.tagName.toLowerCase())).toEqual(["button", "span"]);
    expect(row.querySelector("[role=status]")).toBeNull();
    expect(status().parentElement).toBe(document.body);
  });

  it("does not trip over a read that settles after it unmounts", async () => {
    const read = deferred();
    const { unmount } = render(<RefreshButton onRefresh={() => read.promise} />);
    fireEvent.click(button());
    unmount();
    await act(async () => {
      read.resolve(undefined);
    });
  });
});

describe("refreshFailed", () => {
  it("reads every shape the app's refreshes return", () => {
    expect(refreshFailed(undefined)).toBe(false);
    expect(refreshFailed(true)).toBe(false);
    expect(refreshFailed(false)).toBe(true);
    expect(refreshFailed({ isError: false, data: 1 })).toBe(false);
    expect(refreshFailed({ isError: true })).toBe(true);
    expect(refreshFailed([{ status: "fulfilled", value: 1 }, { status: "fulfilled", value: undefined }])).toBe(false);
    expect(refreshFailed([{ status: "fulfilled", value: 1 }, { status: "rejected", reason: new Error() }])).toBe(true);
    expect(refreshFailed([{ status: "fulfilled", value: { isError: true } }])).toBe(true);
    expect(refreshFailed([undefined, { isError: true }])).toBe(true);
  });
});
