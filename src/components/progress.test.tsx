import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Progress } from "./progress";

describe("Progress", () => {
  it("renders correctly", () => {
    render(<Progress value={50} data-testid="progress" />);
    expect(screen.getByTestId("progress")).toBeInTheDocument();
  });

  it("renders with 0% value", () => {
    render(<Progress value={0} data-testid="progress" />);
    const progress = screen.getByTestId("progress");
    expect(progress).toBeInTheDocument();
    // Check the indicator transform shows 0%
    const indicator = progress.querySelector("[data-state]");
    expect(indicator).toHaveStyle({ transform: "translateX(-100%)" });
  });

  it("renders with 50% value", () => {
    render(<Progress value={50} data-testid="progress" />);
    const progress = screen.getByTestId("progress");
    expect(progress).toBeInTheDocument();
    const indicator = progress.querySelector("[data-state]");
    expect(indicator).toHaveStyle({ transform: "translateX(-50%)" });
  });

  it("renders with 100% value", () => {
    render(<Progress value={100} data-testid="progress" />);
    const progress = screen.getByTestId("progress");
    expect(progress).toBeInTheDocument();
    const indicator = progress.querySelector("[data-state]");
    // The transform is translateX(-0%) due to the calculation `100 - 100`
    expect(indicator).toHaveStyle({ transform: "translateX(-0%)" });
  });

  it("applies custom className", () => {
    render(
      <Progress value={50} className="custom-class" data-testid="progress" />,
    );
    expect(screen.getByTestId("progress")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Progress value={50} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("has correct base styles", () => {
    render(<Progress value={50} data-testid="progress" />);
    const progress = screen.getByTestId("progress");
    expect(progress).toHaveClass("relative");
    expect(progress).toHaveClass("h-4");
    expect(progress).toHaveClass("w-full");
    expect(progress).toHaveClass("overflow-hidden");
    expect(progress).toHaveClass("rounded-full");
  });

  it("has progressbar role", () => {
    render(<Progress value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("handles undefined value", () => {
    render(<Progress data-testid="progress" />);
    const progress = screen.getByTestId("progress");
    expect(progress).toBeInTheDocument();
  });

  it("handles null value gracefully", () => {
    render(
      <Progress value={null as unknown as number} data-testid="progress" />,
    );
    expect(screen.getByTestId("progress")).toBeInTheDocument();
  });
});
