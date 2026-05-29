import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Autocomplete } from "../components/forms/autocomplete";

// W59 a11y regression — clear control was a bare lucide <X/> SVG with onClick.
// SVGs aren't focusable and onClick is unreachable by keyboard / AT. The fix
// promotes it to role="button" + tabIndex + Enter/Space handling.
describe("Autocomplete clear button — a11y", () => {
  const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
  ];

  it("exposes the clear control as a keyboard-reachable button", () => {
    render(
      <Autocomplete options={options} value="react" onValueChange={() => {}} />,
    );
    const clear = screen.getByRole("button", { name: /clear selection/i });
    expect(clear).toBeInTheDocument();
    // tabIndex 0 makes it sequentially focusable
    expect(clear).toHaveAttribute("tabIndex", "0");
  });

  it("clears the value on Enter key", () => {
    const onValueChange = vi.fn();
    render(
      <Autocomplete
        options={options}
        value="react"
        onValueChange={onValueChange}
      />,
    );
    const clear = screen.getByRole("button", { name: /clear selection/i });
    fireEvent.keyDown(clear, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("");
  });

  it("clears the value on Space key", () => {
    const onValueChange = vi.fn();
    render(
      <Autocomplete
        options={options}
        value="react"
        onValueChange={onValueChange}
        multiple
      />,
    );
    const clear = screen.getByRole("button", { name: /clear selection/i });
    fireEvent.keyDown(clear, { key: " " });
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it("still clears on click", () => {
    const onValueChange = vi.fn();
    render(
      <Autocomplete
        options={options}
        value="react"
        onValueChange={onValueChange}
      />,
    );
    const clear = screen.getByRole("button", { name: /clear selection/i });
    fireEvent.click(clear);
    expect(onValueChange).toHaveBeenCalledWith("");
  });

  it("does not open the popover when Enter is pressed on the clear button", () => {
    const onValueChange = vi.fn();
    render(
      <Autocomplete
        options={options}
        value="react"
        onValueChange={onValueChange}
      />,
    );
    const clear = screen.getByRole("button", { name: /clear selection/i });
    fireEvent.keyDown(clear, { key: "Enter" });
    // The combobox trigger should still be aria-expanded="false"
    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
  });
});
