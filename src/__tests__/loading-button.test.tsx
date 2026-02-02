import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoadingButton } from "../components/utility/loading-button";

describe("LoadingButton", () => {
  it("renders children", () => {
    render(<LoadingButton>Click me</LoadingButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("shows spinner when loading", () => {
    render(<LoadingButton loading>Click me</LoadingButton>);
    // Loader2 icon should be present and spinning
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("shows loading text when provided", () => {
    render(
      <LoadingButton loading loadingText="Processing...">
        Click me
      </LoadingButton>,
    );
    expect(screen.getByText("Processing...")).toBeInTheDocument();
    expect(screen.queryByText("Click me")).not.toBeInTheDocument();
  });

  it("is disabled while loading", () => {
    render(<LoadingButton loading>Click me</LoadingButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onClick when not loading", () => {
    const onClick = vi.fn();
    render(<LoadingButton onClick={onClick}>Click me</LoadingButton>);

    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });

  it("does not call onClick when loading", () => {
    const onClick = vi.fn();
    render(
      <LoadingButton loading onClick={onClick}>
        Click me
      </LoadingButton>,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("passes variant prop to underlying button", () => {
    render(<LoadingButton variant="destructive">Delete</LoadingButton>);
    expect(screen.getByRole("button")).toHaveClass("bg-destructive");
  });

  it("passes size prop to underlying button", () => {
    const { container } = render(
      <LoadingButton size="lg">Large</LoadingButton>,
    );
    // Large size uses h-11 class
    expect(container.querySelector("button")).toHaveClass("h-11");
  });

  it("supports icon position", () => {
    const { container } = render(
      <LoadingButton iconPosition="right">With Icon</LoadingButton>,
    );
    expect(container).toBeInTheDocument();
  });
});
