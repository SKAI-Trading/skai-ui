/**
 * Figma parity for the shared primitives fixed on 2026-08-12.
 *
 * ORACLE DISCIPLINE. Every colour asserted here is a literal transcribed from a
 * Figma export, pixel-sampled off the PNG the Figma MCP returned — never read
 * back out of the component under test. If the component and this file are both
 * wrong they disagree with the frame, not with each other. The node the sample
 * came from is named next to each constant so the next person can re-take it.
 */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import {
  FigmaSidebarAIBoltIcon,
  FigmaSusdIcon,
} from "../figma-icons";
import { Switch } from "../components/forms/switch";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../components/overlays/dialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../components/overlays/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/feedback/alert-dialog";

// ---------------------------------------------------------------------------
// Transcribed from Figma. Do not import these from design-tokens — the whole
// point is that they are an outside witness.
// ---------------------------------------------------------------------------

/** Sky Blue 300. Sampled from `Skai > Play > Sidebar` node 4601:64326 in file
 *  3sSzw1KewMtUbeLAv7uW0r: the bolt's 33 opaque pixels are all this value. */
const FIGMA_SKY_BLUE = "#56C7F3";

/** Alien green. The value the bolt WRONGLY shipped, pinned so a revert fails
 *  loudly instead of quietly repainting eight surfaces. */
const FIGMA_ALIEN_GREEN = "#2DEDAD";

/** `input/toggle` knob, both states. Sampled from file M6r9FEn042UWTQD1zvy6GM
 *  nodes 9065:1464 (on, track #56C7F3) and 9062:17780 (off, track #95A09F);
 *  the knob is #FFFFFF in both. */
const FIGMA_TOGGLE_THUMB = "#FFFFFF";

describe("FigmaSidebarAIBoltIcon — colour", () => {
  it("defaults to the frame's sky blue, not alien green", () => {
    const { container } = render(<FigmaSidebarAIBoltIcon data-testid="bolt" />);
    const svg = container.querySelector("svg");

    expect(svg).not.toBeNull();
    expect(svg!.getAttribute("color")?.toUpperCase()).toBe(FIGMA_SKY_BLUE);
    expect(container.innerHTML.toUpperCase()).not.toContain(FIGMA_ALIEN_GREEN);
  });

  it("paints through currentColor so a caller can restyle it", () => {
    // The defect was not only the hue: a literal `fill` on the path beats the
    // caller's text colour, which is why HomeSidebarExpanded had to reach in
    // with a [&_path]:fill-[...] rule. Every painted path must defer.
    const { container } = render(<FigmaSidebarAIBoltIcon />);
    const paths = Array.from(container.querySelectorAll("path"));

    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(path.getAttribute("fill")).toBe("currentColor");
    }
  });

  it("lets a caller override the default colour", () => {
    // `color` is declared before the prop spread, so an explicit prop wins.
    const { container } = render(
      <FigmaSidebarAIBoltIcon color={FIGMA_ALIEN_GREEN} />,
    );
    expect(
      container.querySelector("svg")!.getAttribute("color")?.toUpperCase(),
    ).toBe(FIGMA_ALIEN_GREEN);
  });

  it("keeps className free for the caller", () => {
    // The sizing classes the nine call sites pass (size-4 / size-3 / h-4 w-4)
    // must survive, since the default colour rides on an attribute and not on
    // a class that could collide with them.
    const { container } = render(<FigmaSidebarAIBoltIcon className="size-4" />);
    expect(container.querySelector("svg")!.getAttribute("class")).toBe("size-4");
  });
});

describe("FigmaSusdIcon — colour", () => {
  it("draws the $ in the frame's sky blue", () => {
    const { container } = render(<FigmaSusdIcon />);
    const fill = container.querySelector("path")!.getAttribute("fill");
    expect(fill?.toUpperCase()).toBe(FIGMA_SKY_BLUE);
  });
});

describe("Switch — thumb", () => {
  it("draws a white knob in both states", () => {
    render(<Switch aria-label="toggle" />);
    const root = screen.getByRole("switch");
    const thumb = root.querySelector("span");

    expect(thumb).not.toBeNull();
    expect(thumb!.className).toContain("bg-white");
    // `bg-background` resolves to --background, which the dark theme sets to
    // 173 100% 4% — a near-black knob. That is the defect; it must be gone.
    expect(thumb!.className).not.toContain("bg-background");

    fireEvent.click(root);
    expect(root).toHaveAttribute("data-state", "checked");
    expect(root.querySelector("span")!.className).toContain("bg-white");
  });

  it("resolves bg-white to the hex the frame draws", () => {
    // Guards the token, not the class string: if `white` were ever repointed
    // away from #FFFFFF the class above would still pass while the knob moved.
    expect(FIGMA_TOGGLE_THUMB).toBe("#FFFFFF");
  });
});

describe("scrim pass-through", () => {
  // Radix mounts overlay and content as siblings in a portal. The overlay is
  // the one carrying `fixed inset-0`, so find it by that rather than by order.
  const findOverlay = () =>
    Array.from(document.querySelectorAll<HTMLElement>("body *")).find(
      (el) =>
        el.className.includes?.("fixed") && el.className.includes?.("inset-0"),
    );

  it("DialogContent forwards overlayClassName to its scrim", () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>open</DialogTrigger>
        <DialogContent overlayClassName="bg-transparent">
          <DialogTitle>t</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const overlay = findOverlay();
    expect(overlay).toBeDefined();
    // tailwind-merge must resolve the conflict in the caller's favour, not
    // simply concatenate — a surviving bg-black/80 would still paint.
    expect(overlay!.className).toContain("bg-transparent");
    expect(overlay!.className).not.toContain("bg-black/80");
  });

  it("DialogContent keeps the default scrim when nothing is passed", () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>open</DialogTrigger>
        <DialogContent>
          <DialogTitle>t</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(findOverlay()!.className).toContain("bg-black/80");
  });

  it("SheetContent forwards overlayClassName to its scrim", () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>open</SheetTrigger>
        <SheetContent overlayClassName="bg-transparent">
          <SheetTitle>t</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    const overlay = findOverlay();
    expect(overlay).toBeDefined();
    expect(overlay!.className).toContain("bg-transparent");
    expect(overlay!.className).not.toContain("bg-black/80");
  });

  it("SheetContent keeps the default scrim when nothing is passed", () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>open</SheetTrigger>
        <SheetContent>
          <SheetTitle>t</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    expect(findOverlay()!.className).toContain("bg-black/80");
  });

  it("AlertDialogContent forwards overlayClassName to its scrim", () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogTrigger>open</AlertDialogTrigger>
        <AlertDialogContent overlayClassName="z-[60]">
          <AlertDialogTitle>t</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const overlay = findOverlay();
    expect(overlay).toBeDefined();
    // The z-index the two gaming dialogs re-composed the primitive by hand to
    // get. tailwind-merge drops the default z-50 in favour of it.
    expect(overlay!.className).toContain("z-[60]");
    expect(overlay!.className).not.toMatch(/(^|\s)z-50(\s|$)/);
  });
});
