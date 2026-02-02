import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Autocomplete } from "../components/forms/autocomplete";

const mockOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

const groupedOptions = [
  { value: "eth", label: "Ethereum", group: "Layer 1" },
  { value: "btc", label: "Bitcoin", group: "Layer 1" },
  { value: "arb", label: "Arbitrum", group: "Layer 2" },
  { value: "op", label: "Optimism", group: "Layer 2" },
];

const optionsWithDetails = [
  { value: "eth", label: "Ethereum", description: "Layer 1 blockchain" },
  { value: "btc", label: "Bitcoin", description: "Digital gold" },
];

describe("Autocomplete", () => {
  const user = userEvent.setup();

  describe("Rendering", () => {
    it("should render with placeholder", () => {
      render(
        <Autocomplete
          options={mockOptions}
          placeholder="Select framework..."
        />,
      );
      expect(screen.getByText("Select framework...")).toBeInTheDocument();
    });

    it("should render as combobox", () => {
      render(<Autocomplete options={mockOptions} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should render selected value", () => {
      render(<Autocomplete options={mockOptions} value="react" />);
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("should render multiple selected count", () => {
      render(
        <Autocomplete
          options={mockOptions}
          value={["react", "vue"]}
          multiple
        />,
      );
      expect(screen.getByText("2 selected")).toBeInTheDocument();
    });

    it("should render single selected in multiple mode", () => {
      render(<Autocomplete options={mockOptions} value={["react"]} multiple />);
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("should render empty when no value", () => {
      render(<Autocomplete options={mockOptions} placeholder="Select..." />);
      expect(screen.getByText("Select...")).toBeInTheDocument();
    });
  });

  describe("Clear Button", () => {
    it("should show clear button when value selected and clearable", () => {
      render(<Autocomplete options={mockOptions} value="react" clearable />);
      expect(screen.getByLabelText("Clear selection")).toBeInTheDocument();
    });

    it("should not show clear button when not clearable", () => {
      render(
        <Autocomplete options={mockOptions} value="react" clearable={false} />,
      );
      expect(
        screen.queryByLabelText("Clear selection"),
      ).not.toBeInTheDocument();
    });

    it("should clear value when clear button clicked", async () => {
      const onValueChange = vi.fn();
      render(
        <Autocomplete
          options={mockOptions}
          value="react"
          onValueChange={onValueChange}
          clearable
        />,
      );
      await user.click(screen.getByLabelText("Clear selection"));
      expect(onValueChange).toHaveBeenCalledWith("");
    });

    it("should clear array value in multiple mode", async () => {
      const onValueChange = vi.fn();
      render(
        <Autocomplete
          options={mockOptions}
          value={["react", "vue"]}
          onValueChange={onValueChange}
          multiple
          clearable
        />,
      );
      await user.click(screen.getByLabelText("Clear selection"));
      expect(onValueChange).toHaveBeenCalledWith([]);
    });

    it("should not show clear button when disabled", () => {
      render(
        <Autocomplete options={mockOptions} value="react" clearable disabled />,
      );
      expect(
        screen.queryByLabelText("Clear selection"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Autocomplete options={mockOptions} disabled />);
      expect(screen.getByRole("combobox")).toBeDisabled();
    });
  });

  describe("Size Variants", () => {
    it("should apply sm size class", () => {
      render(<Autocomplete options={mockOptions} size="sm" />);
      expect(screen.getByRole("combobox")).toHaveClass("h-8");
    });

    it("should apply default size class", () => {
      render(<Autocomplete options={mockOptions} size="default" />);
      expect(screen.getByRole("combobox")).toHaveClass("h-10");
    });

    it("should apply lg size class", () => {
      render(<Autocomplete options={mockOptions} size="lg" />);
      expect(screen.getByRole("combobox")).toHaveClass("h-12");
    });
  });

  describe("Custom Rendering", () => {
    it("should use custom renderValue function", () => {
      const renderValue = vi.fn((selected) => `Custom: ${selected[0].label}`);
      render(
        <Autocomplete
          options={mockOptions}
          value="react"
          renderValue={renderValue}
        />,
      );
      expect(screen.getByText("Custom: React")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have aria-expanded attribute", () => {
      render(<Autocomplete options={mockOptions} />);
      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("aria-expanded", "false");
    });

    it("should have aria-label from placeholder", () => {
      render(<Autocomplete options={mockOptions} placeholder="Select token" />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-label",
        "Select token",
      );
    });
  });

  describe("Loading State", () => {
    it("should show loading spinner in trigger when loading", () => {
      render(<Autocomplete options={[]} loading />);
      // Loader in the button
      expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    });
  });
});
