/**
 * HeaderNavRichDropdown — the `triggerTo` trigger is a pathway of its own.
 *
 * Figma "Skai > Play - dropdown" 4765:64029 / 4768:66183 (node 4765:65172) puts
 * THREE pathways on one nav entry: clicking the "Play" label lands on the Play
 * page, and the two menu rows go elsewhere (Casino, Sportsbook). A plain Radix
 * trigger toggles on click and can't navigate, so `triggerTo` swaps the trigger
 * for an <a href> and moves disclosure to hover / ArrowDown.
 *
 * The regressable parts, and why each is here:
 *  - Enter must NAVIGATE, not toggle. Radix's default is toggle-on-Enter, so
 *    this is the assertion that breaks if the keyDown handler is dropped.
 *  - ArrowDown must still disclose, or the two rows become pointer-only — the
 *    accessibility cost of spending Enter on navigation.
 *  - Modified clicks (⌘/ctrl) must fall through to the browser, or "open in new
 *    tab" silently turns into an in-app navigation.
 *  - Omitting `triggerTo` must leave the original toggle button intact, since
 *    Trade / Social / More share this component and pass nothing.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeaderNavRichDropdown } from "../components/layout/header/header-navigation";

const ITEMS = [
  {
    to: "/play/casino",
    label: "Casino",
    iconName: "games" as const,
    description: "Provably fair games with instant payouts",
  },
  {
    to: "/sports",
    label: "Sportsbook",
    iconName: "reward" as const,
    description: "Bet on live sports with real odds",
  },
];

describe("HeaderNavRichDropdown — triggerTo", () => {
  let onNavigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onNavigate = vi.fn();
  });

  function renderWithTrigger() {
    return render(
      <HeaderNavRichDropdown
        label="Play"
        items={ITEMS}
        onNavigate={onNavigate}
        triggerTo="/play"
      />,
    );
  }

  it("renders the trigger as a real link so it can be opened in a new tab", () => {
    renderWithTrigger();
    const trigger = screen.getByRole("link", { name: /play/i });
    expect(trigger).toHaveAttribute("href", "/play");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  });

  it("navigates on click instead of toggling the menu open", async () => {
    const user = userEvent.setup();
    renderWithTrigger();
    await user.click(screen.getByRole("link", { name: /play/i }));
    expect(onNavigate).toHaveBeenCalledWith("/play");
  });

  it("navigates on Enter (Radix would otherwise toggle)", async () => {
    const user = userEvent.setup();
    renderWithTrigger();
    screen.getByRole("link", { name: /play/i }).focus();
    await user.keyboard("{Enter}");
    expect(onNavigate).toHaveBeenCalledWith("/play");
  });

  it("discloses the menu on ArrowDown without navigating", async () => {
    const user = userEvent.setup();
    renderWithTrigger();
    screen.getByRole("link", { name: /play/i }).focus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByText("Casino")).toBeInTheDocument();
    expect(screen.getByText("Sportsbook")).toBeInTheDocument();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("leaves modified clicks to the browser so new-tab still works", async () => {
    const user = userEvent.setup();
    renderWithTrigger();
    await user.keyboard("{Meta>}");
    await user.click(screen.getByRole("link", { name: /play/i }));
    await user.keyboard("{/Meta}");
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("routes the two menu rows to their own destinations", async () => {
    const user = userEvent.setup();
    renderWithTrigger();
    screen.getByRole("link", { name: /play/i }).focus();
    await user.keyboard("{ArrowDown}");
    await user.click(await screen.findByText("Casino"));
    expect(onNavigate).toHaveBeenCalledWith("/play/casino");
  });

  it("keeps the plain toggle button when triggerTo is omitted", async () => {
    const user = userEvent.setup();
    render(<HeaderNavRichDropdown label="Trade" items={ITEMS} onNavigate={onNavigate} />);
    // Trade / Social / More pass no triggerTo: the trigger must stay a button
    // with no href, so nothing about their behaviour changed.
    expect(screen.queryByRole("link", { name: /trade/i })).toBeNull();
    const trigger = screen.getByRole("button", { name: /trade/i });
    expect(trigger).not.toHaveAttribute("href");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    // Clicking must not navigate — it is a disclosure control, not a link.
    // (That it OPENS on click is Radix's own pointerdown behaviour, which cannot
    // be exercised here: this jsdom has no Element.prototype.hasPointerCapture,
    // so user-event's pointer sequence never reaches Radix's handler. Verified
    // in a real browser instead.)
    await user.click(trigger);
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
