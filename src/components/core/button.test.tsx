import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../core/button";

describe("Button", () => {
  it("renders with default variant", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-primary");

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-destructive");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-secondary");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("hover:bg-accent");

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole("button")).toHaveClass("underline-offset-4");
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10");

    rerender(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-9");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-11");

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-10");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is passed", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not fire click when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders as child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveTextContent("Link Button");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it("renders with type attribute", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("renders children correctly", () => {
    render(
      <Button>
        <span data-testid="child">Child Element</span>
      </Button>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  describe("loading prop", () => {
    it("sets aria-busy and disables when loading", () => {
      render(<Button loading>Save</Button>);
      const btn = screen.getByRole("button");
      expect(btn).toHaveAttribute("aria-busy", "true");
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute("data-loading", "true");
    });

    it("renders loadingText when provided", () => {
      render(
        <Button loading loadingText="Saving...">
          Save
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveTextContent("Saving...");
    });

    it("does not render loading affordances when not loading", () => {
      render(<Button>Idle</Button>);
      const btn = screen.getByRole("button");
      expect(btn).not.toHaveAttribute("aria-busy");
      expect(btn).not.toHaveAttribute("data-loading");
    });

    it("ignores loading when asChild is true", () => {
      render(
        <Button asChild loading>
          <a href="/x">Link</a>
        </Button>,
      );
      // No spinner because Slot bypass — only the link rendered
      expect(screen.getByRole("link")).toBeInTheDocument();
    });
  });
});
