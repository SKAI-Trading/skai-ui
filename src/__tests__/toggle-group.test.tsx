import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ToggleGroup, ToggleGroupItem } from "../components/forms/toggle-group";

describe("ToggleGroup", () => {
  it("renders single-select group with radiogroup role", () => {
    render(
      <ToggleGroup type="single" aria-label="alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("toggles single value via click", () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="single" onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    fireEvent.click(screen.getByText("A"));
    expect(onValueChange).toHaveBeenCalledWith("a");
    expect(screen.getByText("A").closest("button")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("supports multiple-select", () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="multiple" onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText("B"));
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);
    // both buttons aria-pressed=true
    expect(screen.getByText("A").closest("button")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("deselects when clicking active single item again", () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="single" defaultValue="a" onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    fireEvent.click(screen.getByText("A"));
    expect(onValueChange).toHaveBeenCalledWith("");
  });

  it("toggles via keyboard Space/Enter", () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="single" onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    const btn = screen.getByText("A").closest("button")!;
    btn.focus();
    fireEvent.keyDown(btn, { key: " " });
    expect(onValueChange).toHaveBeenCalledWith("a");
    fireEvent.keyDown(btn, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it("respects group-level disabled", () => {
    render(
      <ToggleGroup type="single" disabled>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByText("A").closest("button")).toBeDisabled();
  });

  it("sets aria-orientation", () => {
    const { rerender } = render(
      <ToggleGroup type="single" orientation="vertical">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
    rerender(
      <ToggleGroup type="single" orientation="horizontal">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });
});
