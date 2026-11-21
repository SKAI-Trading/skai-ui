import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CopyButton } from "../components/utility/copy-button";

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn(),
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

describe("CopyButton", () => {
  beforeEach(() => {
    mockClipboard.writeText.mockClear();
    mockClipboard.writeText.mockResolvedValue(undefined);
  });

  it("renders copy button", () => {
    render(<CopyButton value="test value" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("copies value to clipboard on click", async () => {
    render(<CopyButton value="test value" />);

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith("test value");
    });
  });

  it("shows check icon after successful copy", async () => {
    render(<CopyButton value="test value" />);
    const button = screen.getByRole("button");
    expect(button.querySelector("svg.lucide-copy")).not.toBeNull();

    fireEvent.click(button);

    await screen.findByRole("button", { name: "Copied!" });
    expect(button.querySelector("svg.lucide-check")).not.toBeNull();
    expect(button.querySelector("svg.lucide-copy")).toBeNull();
  });

  // Report a56400fe: the check takes the ink of the copy mark it replaces,
  // the same white check the AI chat draws, never a green.
  it("draws the copied check in the button's ink, not green", async () => {
    render(<CopyButton value="test value" />);
    const button = screen.getByRole("button");
    const before = button.className;

    fireEvent.click(button);
    await screen.findByRole("button", { name: "Copied!" });

    expect(button.className).toBe(before);
    expect(button.className).not.toMatch(/green/);
    const check = button.querySelector("svg.lucide-check");
    expect(check?.getAttribute("class") ?? "").not.toMatch(/green|text-/);
  });

  it("keeps a caller's ink on the copied state", async () => {
    render(<CopyButton value="test value" className="text-white" />);
    fireEvent.click(screen.getByRole("button"));

    expect(await screen.findByRole("button", { name: "Copied!" })).toHaveClass(
      "text-white",
    );
  });

  it("keeps its labels on the copied state", async () => {
    render(<CopyButton value="test value" showLabel />);
    expect(screen.getByText("Copy")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));

    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });

  it("calls onCopySuccess callback on successful copy", async () => {
    const onCopySuccess = vi.fn();
    render(<CopyButton value="test value" onCopySuccess={onCopySuccess} />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(onCopySuccess).toHaveBeenCalled();
    });
  });

  it("handles copy error gracefully", async () => {
    mockClipboard.writeText.mockRejectedValue(new Error("Copy failed"));
    const onCopyError = vi.fn();
    render(<CopyButton value="test value" onCopyError={onCopyError} />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(onCopyError).toHaveBeenCalled();
    });
  });

  it("is disabled when disabled prop is set", () => {
    render(<CopyButton value="test value" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders children when provided", () => {
    render(<CopyButton value="test value">Copy Address</CopyButton>);
    expect(screen.getByText("Copy Address")).toBeInTheDocument();
  });
});
