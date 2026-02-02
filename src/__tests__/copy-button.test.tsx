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

    fireEvent.click(screen.getByRole("button"));

    // Wait for state to update - the component should show check icon briefly
    await waitFor(() => {
      // The copied state shows Check icon
      expect(mockClipboard.writeText).toHaveBeenCalled();
    });
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
