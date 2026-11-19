import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { ErrorScreen, errorScreenCopy, type ErrorScreenVariant } from "./error-screen";

const tok = (el: Element) => (el.getAttribute("class") || "").split(/\s+/).filter(Boolean);

const variants = Object.keys(errorScreenCopy) as ErrorScreenVariant[];

describe("ErrorScreen", () => {
  it.each(variants)("draws the %s variant's title and one line, and nothing else to read", (variant) => {
    render(<ErrorScreen variant={variant} />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("data-variant", variant);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(errorScreenCopy[variant].title);
    expect(screen.getByText(errorScreenCopy[variant].description)).toBeInTheDocument();
    expect(alert).toHaveAccessibleName(errorScreenCopy[variant].title);
    // Title, line and the button labels are the whole of the text.
    const labels = Array.from(alert.querySelectorAll("button, a"));
    expect(labels.length).toBeGreaterThan(0);
    expect(labels.length).toBeLessThanOrEqual(2);
    const expected = [errorScreenCopy[variant].title, errorScreenCopy[variant].description, ...labels.map((l) => l.textContent)].join("");
    expect(alert.textContent).toBe(expected);
  });

  it("puts a long reason in the plate's hover tooltip, never on the page", () => {
    const message = "Cannot read properties of undefined (reading 'map')";
    const { container } = render(<ErrorScreen detail={message} />);
    expect(screen.queryByText(message)).toBeNull();
    expect(container.querySelector("[data-error-plate]")).toHaveAttribute("title", message);
  });

  it("covers the viewport in page layout, with the logo top-left and clear of the notch", () => {
    const { container } = render(<ErrorScreen />);
    const root = screen.getByRole("alert");
    expect(tok(root)).toEqual(expect.arrayContaining(["fixed", "inset-0", "bg-[#001615]"]));
    const logo = container.querySelector("[data-error-logo]");
    expect(logo).not.toBeNull();
    expect(logo).toHaveAttribute("aria-hidden", "true");
    expect(tok(logo!)).toContain("top-[calc(1rem+env(safe-area-inset-top,0px))]");
    const scroller = logo!.parentElement!;
    expect(tok(scroller)).toEqual(
      expect.arrayContaining([
        "pt-[calc(4.5rem+env(safe-area-inset-top,0px))]",
        "pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]",
        "pl-[calc(1rem+env(safe-area-inset-left,0px))]",
        "pr-[calc(1rem+env(safe-area-inset-right,0px))]",
      ]),
    );
  });

  it("fills its slot in inline layout: no logo, no fixed cover, an h2", () => {
    const { container } = render(<ErrorScreen layout="inline" />);
    const root = screen.getByRole("alert");
    expect(tok(root)).not.toContain("fixed");
    expect(container.querySelector("[data-error-logo]")).toBeNull();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Something went wrong");
  });

  it("draws the error treatment: the Bridge card under the Swap error plate", () => {
    const { container } = render(<ErrorScreen />);
    const card = container.querySelector("[data-error-card]")!;
    expect(tok(card)).toEqual(expect.arrayContaining(["bg-[#122524]", "rounded-[24px]", "p-4"]));
    const plate = container.querySelector("[data-error-plate]")!;
    expect(tok(plate)).toEqual(expect.arrayContaining(["rounded-[16px]", "bg-[#ff574a]/[0.16]"]));
    expect(plate.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("gives a crash Reload and a plain Go home anchor by default", () => {
    render(<ErrorScreen variant="crash" />);
    expect(screen.getByRole("button", { name: "Reload" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/");
  });

  it("gives not-found Go home and Go back, and reload a single Reload", () => {
    const { unmount } = render(<ErrorScreen variant="not-found" />);
    expect(screen.getByRole("link", { name: "Go home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
    unmount();
    render(<ErrorScreen variant="reload" />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Reload" })).toBeInTheDocument();
  });

  it("runs a caller's actions, and null removes one", () => {
    const retry = vi.fn();
    render(
      <ErrorScreen
        primaryAction={{ label: "Try again", onClick: retry }}
        secondaryAction={null}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("lets an anchor action hand its navigation to onClick", () => {
    const navigate = vi.fn();
    render(<ErrorScreen secondaryAction={{ label: "Go home", href: "/", onClick: navigate }} />);
    const link = screen.getByRole("link", { name: "Go home" });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it("focuses the primary action on mount, unless told not to", () => {
    const { unmount } = render(<ErrorScreen />);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Reload" }));
    unmount();
    render(<ErrorScreen autoFocus={false} />);
    expect(document.activeElement).toBe(document.body);
  });

  it("renders with no provider of any kind above it", () => {
    // Nothing wraps this render: no router, no query client, no tooltip
    // provider. A throw here is a white screen in production.
    expect(() => render(<ErrorScreen variant="offline" detail="net::ERR_INTERNET_DISCONNECTED" />)).not.toThrow();
  });

  it("imports nothing that can load late or read a context", () => {
    const src = readFileSync(path.join(__dirname, "error-screen.tsx"), "utf8");
    const imports = [...src.matchAll(/^import[^"]+"([^"]+)";$/gm)].map((m) => m[1]);
    expect(imports.sort()).toEqual(["../../lib/utils", "../branding/skai-logo", "../core/button", "lucide-react", "react"]);
    expect(src).not.toMatch(/\bimport\(/);
    expect(src).not.toMatch(/useContext|React\.lazy|\blazy\(/);
  });
});
