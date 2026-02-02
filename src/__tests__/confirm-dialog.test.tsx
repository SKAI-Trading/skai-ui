import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "../components/overlays/confirm-dialog";

describe("ConfirmDialog", () => {
  it("renders when open", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="Test Title"
        description="Are you sure?"
        onConfirm={() => {}}
      />,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <ConfirmDialog
        open={false}
        onOpenChange={() => {}}
        title="Test Title"
        description="Are you sure?"
        onConfirm={() => {}}
      />,
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });

  it("calls onConfirm when confirm button clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="Test Title"
        description="Are you sure?"
        onConfirm={onConfirm}
        confirmText="Yes, proceed"
      />,
    );

    fireEvent.click(screen.getByText("Yes, proceed"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button clicked", () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="Test Title"
        description="Are you sure?"
        onConfirm={() => {}}
        onCancel={onCancel}
        cancelText="No, go back"
      />,
    );

    fireEvent.click(screen.getByText("No, go back"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("uses default button text", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="Test Title"
        description="Are you sure?"
        onConfirm={() => {}}
      />,
    );

    // Find both buttons by role
    const buttons = screen.getAllByRole("button");
    const buttonTexts = buttons.map((btn) => btn.textContent);
    expect(buttonTexts).toContain("Cancel");
    expect(buttonTexts).toContain("Confirm");
  });

  it("applies destructive variant styling", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="Delete Item"
        description="This cannot be undone"
        onConfirm={() => {}}
        variant="destructive"
      />,
    );

    // The dialog should render with destructive variant
    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    expect(confirmButton).toHaveClass("bg-destructive");
  });

  it("disables confirm button when loading", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="Test Title"
        description="Are you sure?"
        onConfirm={() => {}}
        loading={true}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    expect(confirmButton).toBeDisabled();
  });
});
