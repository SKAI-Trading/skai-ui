import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "../components/forms/select";
import { Slider } from "../components/forms/slider";
import { RadioGroup, RadioGroupItem } from "../components/forms/radio-group";
import { Switch } from "../components/forms/switch";
import { Label } from "../components/core/label";

// Mock scrollIntoView for Radix Select
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();

  // Mock ResizeObserver for Radix Slider
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("Select", () => {
  it("should render trigger with placeholder", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("should open dropdown on trigger click", async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole("combobox"));

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  it("should select an option", async () => {
    const handleValueChange = vi.fn();

    render(
      <Select onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole("combobox"));

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Option 1"));
    expect(handleValueChange).toHaveBeenCalledWith("option1");
  });

  it("should display selected value", async () => {
    render(
      <Select defaultValue="option1">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("should render select groups", async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole("combobox"));

    await waitFor(() => {
      expect(screen.getByText("Fruits")).toBeInTheDocument();
      expect(screen.getByText("Apple")).toBeInTheDocument();
    });
  });

  it("should be disabled when disabled prop is true", () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("should apply custom className to trigger", () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole("combobox")).toHaveClass("custom-trigger");
  });

  it("should render separator between groups", async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectSeparator data-testid="separator" />
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole("combobox"));

    await waitFor(() => {
      expect(screen.getByTestId("separator")).toBeInTheDocument();
    });
  });
});

describe("Slider", () => {
  it("should render with default value", () => {
    render(<Slider defaultValue={[50]} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("should have correct default value", () => {
    render(<Slider defaultValue={[50]} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
  });

  it("should handle value change", () => {
    const handleValueChange = vi.fn();
    render(<Slider defaultValue={[50]} onValueChange={handleValueChange} />);

    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(handleValueChange).toHaveBeenCalled();
  });

  it("should respect min and max props", () => {
    render(<Slider defaultValue={[50]} min={0} max={100} />);
    const slider = screen.getByRole("slider");

    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Slider defaultValue={[50]} disabled />);
    const slider = screen.getByRole("slider");

    expect(slider).toHaveAttribute("data-disabled");
  });

  it("should apply custom className", () => {
    render(<Slider defaultValue={[50]} className="custom-slider" />);
    const container = screen.getByRole("slider").parentElement?.parentElement;

    expect(container).toHaveClass("custom-slider");
  });

  it("should handle step prop", () => {
    const handleValueChange = vi.fn();
    render(
      <Slider
        defaultValue={[50]}
        step={10}
        onValueChange={handleValueChange}
      />,
    );

    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });

    // Should step by 10
    expect(handleValueChange).toHaveBeenCalledWith([60]);
  });

  it("should handle keyboard navigation", () => {
    const handleValueChange = vi.fn();
    render(<Slider defaultValue={[50]} onValueChange={handleValueChange} />);

    const slider = screen.getByRole("slider");

    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(handleValueChange).toHaveBeenCalled();

    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(handleValueChange).toHaveBeenCalled();
  });
});

describe("RadioGroup", () => {
  it("should render radio options", () => {
    render(
      <RadioGroup defaultValue="option1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <Label htmlFor="option1">Option 1</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <Label htmlFor="option2">Option 2</Label>
        </div>
      </RadioGroup>,
    );

    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
  });

  it("should have default checked value", () => {
    render(
      <RadioGroup defaultValue="option1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <Label htmlFor="option1">Option 1</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <Label htmlFor="option2">Option 2</Label>
        </div>
      </RadioGroup>,
    );

    expect(screen.getByLabelText("Option 1")).toBeChecked();
    expect(screen.getByLabelText("Option 2")).not.toBeChecked();
  });

  it("should call onValueChange when selection changes", () => {
    const handleValueChange = vi.fn();

    render(
      <RadioGroup defaultValue="option1" onValueChange={handleValueChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <Label htmlFor="option1">Option 1</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <Label htmlFor="option2">Option 2</Label>
        </div>
      </RadioGroup>,
    );

    fireEvent.click(screen.getByLabelText("Option 2"));
    expect(handleValueChange).toHaveBeenCalledWith("option2");
  });

  it("should be disabled when disabled prop is true", () => {
    render(
      <RadioGroup defaultValue="option1" disabled>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <Label htmlFor="option1">Option 1</Label>
        </div>
      </RadioGroup>,
    );

    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-disabled");
  });

  it("should apply custom className", () => {
    render(
      <RadioGroup className="custom-radio-group" data-testid="radio-group">
        <RadioGroupItem value="option1" />
      </RadioGroup>,
    );

    expect(screen.getByTestId("radio-group")).toHaveClass("custom-radio-group");
  });

  it("should support multiple radio items", () => {
    render(
      <RadioGroup defaultValue="option1">
        <RadioGroupItem value="option1" data-testid="radio-1" />
        <RadioGroupItem value="option2" data-testid="radio-2" />
        <RadioGroupItem value="option3" data-testid="radio-3" />
      </RadioGroup>,
    );

    expect(screen.getByTestId("radio-1")).toBeInTheDocument();
    expect(screen.getByTestId("radio-2")).toBeInTheDocument();
    expect(screen.getByTestId("radio-3")).toBeInTheDocument();
  });
});

describe("Switch", () => {
  it("should render unchecked by default", () => {
    render(<Switch />);
    const switchEl = screen.getByRole("switch");

    expect(switchEl).toHaveAttribute("data-state", "unchecked");
  });

  it("should render checked when defaultChecked is true", () => {
    render(<Switch defaultChecked />);
    const switchEl = screen.getByRole("switch");

    expect(switchEl).toHaveAttribute("data-state", "checked");
  });

  it("should toggle when clicked", () => {
    const handleCheckedChange = vi.fn();
    render(<Switch onCheckedChange={handleCheckedChange} />);

    const switchEl = screen.getByRole("switch");
    fireEvent.click(switchEl);

    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Switch disabled />);
    const switchEl = screen.getByRole("switch");

    expect(switchEl).toBeDisabled();
  });

  it("should apply custom className", () => {
    render(<Switch className="custom-switch" />);
    const switchEl = screen.getByRole("switch");

    expect(switchEl).toHaveClass("custom-switch");
  });

  it("should be controlled with checked prop", () => {
    const { rerender } = render(<Switch checked={false} />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "data-state",
      "unchecked",
    );

    rerender(<Switch checked={true} />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "checked");
  });

  it("should toggle on click interaction", () => {
    const handleCheckedChange = vi.fn();
    render(<Switch onCheckedChange={handleCheckedChange} />);

    const switchEl = screen.getByRole("switch");
    fireEvent.click(switchEl);

    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it("should work with label", () => {
    render(
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>,
    );

    expect(screen.getByLabelText("Airplane Mode")).toBeInTheDocument();
  });

  it("should have accessible name when aria-label is provided", () => {
    render(<Switch aria-label="Toggle notifications" />);
    expect(screen.getByLabelText("Toggle notifications")).toBeInTheDocument();
  });

  it("should not toggle when disabled", () => {
    const handleCheckedChange = vi.fn();
    render(<Switch disabled onCheckedChange={handleCheckedChange} />);

    const switchEl = screen.getByRole("switch");
    fireEvent.click(switchEl);

    expect(handleCheckedChange).not.toHaveBeenCalled();
  });
});
