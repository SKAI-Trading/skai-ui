import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsSheet } from "./settings-sheet";

describe("SettingsSheet", () => {
  it("renders nothing when closed, and its title, description and rows once open", async () => {
    const { rerender } = render(
      <SettingsSheet open={false} onOpenChange={vi.fn()} title="Display" onSave={vi.fn()}>
        <p>Row content</p>
      </SettingsSheet>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <SettingsSheet
        open
        onOpenChange={vi.fn()}
        title="Display"
        description="What each card shows."
        onSave={vi.fn()}
      >
        <p>Row content</p>
      </SettingsSheet>,
    );

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(screen.getByText("Display")).toBeInTheDocument();
    expect(screen.getByText("What each card shows.")).toBeInTheDocument();
    expect(screen.getByText("Row content")).toBeInTheDocument();
  });

  it("slides in from the right by default", async () => {
    render(
      <SettingsSheet open onOpenChange={vi.fn()} title="Display" onSave={vi.fn()}>
        <p>Row</p>
      </SettingsSheet>,
    );
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toHaveClass("right-0");
    });
  });

  it("calls onSave, under the default footer label, when the button is pressed", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <SettingsSheet open onOpenChange={vi.fn()} title="Display" onSave={onSave}>
        <p>Row</p>
      </SettingsSheet>,
    );
    await user.click(await screen.findByRole("button", { name: "Save settings" }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("does not close itself on save -- the caller decides that", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <SettingsSheet open onOpenChange={onOpenChange} title="Display" onSave={vi.fn()}>
        <p>Row</p>
      </SettingsSheet>,
    );
    await user.click(await screen.findByRole("button", { name: "Save settings" }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("takes a custom footer label", async () => {
    render(
      <SettingsSheet open onOpenChange={vi.fn()} title="Filters" onSave={vi.fn()} saveLabel="Apply">
        <p>Row</p>
      </SettingsSheet>,
    );
    expect(await screen.findByRole("button", { name: "Apply" })).toBeInTheDocument();
  });
});
