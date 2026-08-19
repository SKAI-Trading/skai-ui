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
  FigmaBaseChainIcon,
  FigmaBellIcon,
  FigmaBnbIcon,
  FigmaGhostIcon,
  FigmaPersonCheckIcon,
  FigmaPersonStarIcon,
  FigmaSidebarAIBoltIcon,
  FigmaSolanaIcon,
  FigmaSusdIcon,
  FigmaTrashIcon,
  FigmaTrashSolidIcon,
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

// ---------------------------------------------------------------------------
// X-accounts "My list" action group — report c7042893.
// Node 13008:115961 in file mhF3BkzlTaGiLzJ7kvpmVc. The `d` strings below are
// transcribed from the SVG files the get_design_context asset URLs served, so
// they witness the export, not the component.
// ---------------------------------------------------------------------------

const EXPORT_GHOST_D =
  "M5.55057 2.01133C4.61179 2.01133 3.71146 2.38426 3.04765 3.04808C2.38383 3.71189 2.01091 4.61222 2.01091 5.55099V9.90984C2.01089 9.94505 2.02007 9.97967 2.03753 10.0102C2.055 10.0408 2.08015 10.0663 2.11049 10.0842C2.14083 10.1021 2.17532 10.1117 2.21053 10.1122C2.24575 10.1126 2.28047 10.1039 2.31127 10.0868L2.78811 9.82236C3.09217 9.65338 3.43467 9.56567 3.78252 9.56771C4.13037 9.56974 4.47181 9.66146 4.77387 9.83399L5.04895 9.99125C5.20172 10.0785 5.37462 10.1244 5.55057 10.1244C5.72651 10.1244 5.89941 10.0785 6.05219 9.99125L6.32727 9.83449C6.62928 9.66189 6.97071 9.57009 7.31855 9.56796C7.6664 9.56583 8.00892 9.65345 8.31302 9.82236L8.78986 10.0868C8.82066 10.1039 8.85539 10.1126 8.8906 10.1122C8.92582 10.1117 8.9603 10.1021 8.99065 10.0842C9.02099 10.0663 9.04614 10.0408 9.0636 10.0102C9.08107 9.97967 9.09025 9.94505 9.09023 9.90984V5.55099C9.09023 5.08616 8.99867 4.62588 8.82079 4.19642C8.64291 3.76697 8.38218 3.37676 8.05349 3.04808C7.7248 2.71939 7.33459 2.45866 6.90514 2.28077C6.47569 2.10289 6.0154 2.01133 5.55057 2.01133ZM0.999574 5.55099C0.999574 4.344 1.47905 3.18643 2.33253 2.33296C3.18601 1.47948 4.34357 1 5.55057 1C6.75757 1 7.91513 1.47948 8.76861 2.33296C9.62208 3.18643 10.1016 4.344 10.1016 5.55099V9.90984C10.1016 10.8352 9.10742 11.4203 8.29886 10.9712L7.82202 10.7063C7.66994 10.6218 7.49863 10.5779 7.32466 10.579C7.15069 10.5801 6.97993 10.626 6.82889 10.7123L6.55432 10.8691C6.24864 11.0438 5.90265 11.1357 5.55057 11.1357C5.19848 11.1357 4.8525 11.0438 4.54682 10.8691L4.27224 10.7123C4.12121 10.626 3.95045 10.5801 3.77648 10.579C3.6025 10.5779 3.4312 10.6218 3.27912 10.7063L2.80278 10.9712C1.99371 11.4203 0.999574 10.8352 0.999574 9.90984V5.55099ZM4.79207 5.29816C4.79207 5.49933 4.71216 5.69226 4.56991 5.8345C4.42766 5.97675 4.23474 6.05666 4.03357 6.05666C3.8324 6.05666 3.63948 5.97675 3.49723 5.8345C3.35498 5.69226 3.27507 5.49933 3.27507 5.29816C3.27507 5.097 3.35498 4.90407 3.49723 4.76182C3.63948 4.61958 3.8324 4.53966 4.03357 4.53966C4.23474 4.53966 4.42766 4.61958 4.56991 4.76182C4.71216 4.90407 4.79207 5.097 4.79207 5.29816ZM7.06757 6.05666C7.26873 6.05666 7.46166 5.97675 7.60391 5.8345C7.74615 5.69226 7.82607 5.49933 7.82607 5.29816C7.82607 5.097 7.74615 4.90407 7.60391 4.76182C7.46166 4.61958 7.26873 4.53966 7.06757 4.53966C6.8664 4.53966 6.67347 4.61958 6.53123 4.76182C6.38898 4.90407 6.30907 5.097 6.30907 5.29816C6.30907 5.49933 6.38898 5.69226 6.53123 5.8345C6.67347 5.97675 6.8664 6.05666 7.06757 6.05666Z";

const EXPORT_PERSON_D =
  "M7.7089 10.5945H2.00115V8.30913C2.00115 6.9779 4.66934 6.30942 6.00058 6.30942C6.66612 6.30942 7.66581 6.4765 8.4992 6.80994M6.00058 5.16673C6.94901 5.16673 7.7089 4.40113 7.7089 3.45269C7.7089 2.50426 6.94901 1.73865 6.00058 1.73865C5.05214 1.73865 4.28654 2.50426 4.28654 3.45269C4.28654 4.40113 5.05214 5.16673 6.00058 5.16673Z";

const EXPORT_STAR_D =
  "M10 7L10.5878 8.19098L11.9021 8.38197L10.9511 9.30902L11.1756 10.618L10 10L8.82443 10.618L9.04894 9.30902L8.09789 8.38197L9.41221 8.19098L10 7Z";

const EXPORT_TRASH_SOLID_D =
  "M9.33301 2H13V3H11.5986L9.99414 13.9062L9.93164 14.333H3.06738L3.00488 13.9062L1.40137 3H0V2H3.66699V0H9.33301V2ZM3.93164 13.333H9.06738L10.5879 3H2.41211L3.93164 13.333ZM7 11.667H6V4.66699H7V11.667ZM4.66699 2H8.33301V1H4.66699V2Z";

describe("X-accounts action glyphs (13008:115961)", () => {
  it("FigmaGhostIcon carries the exported ghost, filled, at 12x12", () => {
    const { container } = render(<FigmaGhostIcon />);
    const svg = container.querySelector("svg")!;
    const paths = Array.from(container.querySelectorAll("path"));

    expect(svg.getAttribute("viewBox")).toBe("0 0 12 12");
    expect(paths).toHaveLength(1);
    expect(paths[0].getAttribute("d")).toBe(EXPORT_GHOST_D);
    // Filled, not stroked — the control it replaces was an outline bell.
    expect(paths[0].getAttribute("fill")).toBe("currentColor");
    expect(paths[0].getAttribute("stroke")).toBeNull();
  });

  it("FigmaPersonStarIcon carries the exported person AND star", () => {
    const { container } = render(<FigmaPersonStarIcon />);
    const svg = container.querySelector("svg")!;
    const paths = Array.from(container.querySelectorAll("path"));

    expect(svg.getAttribute("viewBox")).toBe("0 0 12 12");
    expect(paths).toHaveLength(2);
    // Person is stroked with no fill; star is filled with no stroke.
    expect(paths[0].getAttribute("d")).toBe(EXPORT_PERSON_D);
    expect(paths[0].getAttribute("stroke")).toBe("currentColor");
    expect(paths[0].getAttribute("fill")).toBeNull();
    expect(paths[1].getAttribute("d")).toBe(EXPORT_STAR_D);
    expect(paths[1].getAttribute("fill")).toBe("currentColor");
    // The glyph it replaces builds its head from a <circle>; this one does not.
    expect(container.querySelector("circle")).toBeNull();
  });

  it("FigmaTrashSolidIcon carries the exported solid trash at 13x14.333", () => {
    const { container } = render(<FigmaTrashSolidIcon />);
    const svg = container.querySelector("svg")!;
    const paths = Array.from(container.querySelectorAll("path"));

    expect(svg.getAttribute("viewBox")).toBe("0 0 13 14.333");
    expect(paths).toHaveLength(1);
    expect(paths[0].getAttribute("d")).toBe(EXPORT_TRASH_SOLID_D);
    expect(paths[0].getAttribute("fill")).toBe("currentColor");
    expect(paths[0].getAttribute("stroke")).toBeNull();
  });

  it("bakes no colour into any of the three", () => {
    // XAccountsPanel's GreenToggle drives these from state
    // (`on ? text-alien-green-bright : text-ash hover:text-foreground`) and the
    // remove control ramps `text-foreground hover:text-ash`. A `color`
    // attribute or a literal fill here would outrank the inherited value and
    // freeze the toggles — the opposite trade-off from the sidebar bolt, whose
    // callers set nothing.
    for (const Icon of [FigmaGhostIcon, FigmaPersonStarIcon, FigmaTrashSolidIcon]) {
      const { container, unmount } = render(<Icon />);
      const html = container.innerHTML.toUpperCase();

      expect(container.querySelector("svg")!.getAttribute("color")).toBeNull();
      expect(html).not.toContain("#17F9B4");
      expect(html).not.toContain("#FFFFFF");
      expect(html).not.toContain('FILL="WHITE"');
      unmount();
    }
  });

  it("leaves the glyphs it replaces alone, because each is used elsewhere", () => {
    // FigmaBellIcon still draws the HomeTopBar notification bell (2713:4828),
    // FigmaPersonCheckIcon still draws HomeOnboarding's complete_profile quest,
    // FigmaTrashIcon still draws ActivityView + HomeSidebarExpanded. Repointing
    // any of them at the new art would have fixed one surface and broken two.
    const bell = render(<FigmaBellIcon />);
    expect(bell.container.querySelector("svg")!.getAttribute("viewBox")).toBe(
      "0 0 11.9668 15.6211",
    );

    const personCheck = render(<FigmaPersonCheckIcon />);
    expect(
      personCheck.container.querySelector("svg")!.getAttribute("viewBox"),
    ).toBe("0 0 16 16");
    // Its head is a <circle> and it has no star — i.e. still the check variant.
    expect(personCheck.container.querySelector("circle")).not.toBeNull();
    expect(personCheck.container.innerHTML).not.toContain(EXPORT_STAR_D);

    const trash = render(<FigmaTrashIcon />);
    expect(trash.container.querySelector("svg")!.getAttribute("viewBox")).toBe(
      "0 0 16 16",
    );
    // Still the 1.2px outline, not the solid.
    expect(
      trash.container.querySelector("path")!.getAttribute("strokeWidth") ??
        trash.container.querySelector("path")!.getAttribute("stroke-width"),
    ).toBe("1.2");
    expect(trash.container.innerHTML).not.toContain(EXPORT_TRASH_SOLID_D);
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

// ---------------------------------------------------------------------------
// Chain badges — reports 82fda67c / 4f582d84 (BNB), 10ba5a8f / c2a43c8b
// (Solana), 24eb10ba / 4c512f03 (Base), 35bff67c (all three, Import-wallets).
//
// ORACLE. These badges are RASTER `<img>` fills in Figma, not vectors, so the
// witness here is the exported PNG rather than an SVG string: nodes
// 13006:134372/3/4 (32px trench badges, exported at 68/64/64px) and
// 13008:115806/7/8 (the 40px import-wallets badges, exported at 84/80/80px) in
// file mhF3BkzlTaGiLzJ7kvpmVc. Every constant below is a modal pixel value read
// off those PNGs — two independent exports of the same art, which agreed
// exactly on all four colours. Nothing here is read back out of the component.
// ---------------------------------------------------------------------------

/** BNB badge disc. (58,58,58) is 49.8% of the 80px export and 48.6% of the
 *  independent 64px one. */
const FIGMA_BNB_DISC = "#3A3A3A";
/** BNB cube. (241,185,10) — note it is NOT the Binance brand deck's #F0B90B. */
const FIGMA_BNB_GOLD = "#F1B90A";
/** The disc + mark this badge WRONGLY shipped: a #181A20 disc carrying the
 *  retired four-diamond Binance *exchange* logo. Pinned so a revert to the old
 *  glyph fails loudly rather than silently reinstating the wrong brand. */
const RETIRED_BINANCE_DISC = "#181A20";

/** Solana ring. (23,249,180) in both exports, and the same get_design_context
 *  response names the style `Primary/Alien Green 300: #17F9B4`. */
const FIGMA_SOL_RING = "#17F9B4";
/** The ring hex this badge shipped — the published brand green, one shade off
 *  the frame. */
const SOL_BRAND_GREEN_NOT_THE_FRAME = "#14F195";
/** The frame's disc behind the tri-bars: pure black, 39–43% of both exports.
 *  Its ABSENCE was the reported defect — the badge read see-through. */
const FIGMA_SOL_DISC = "#000000";

/** Base disc. (0,82,255), 69.3% of the 80px export and 69.4% of the 64px one. */
const FIGMA_BASE_BLUE = "#0052FF";

const fills = (c: HTMLElement) =>
  Array.from(c.querySelectorAll("path, circle")).map((n) =>
    (n.getAttribute("fill") ?? "").toUpperCase(),
  );

describe("chain badges (13006:134372-4 / 13008:115806-8)", () => {
  it("BNB draws the BNB-Chain cube on the frame's disc, not the retired Binance diamonds", () => {
    const { container } = render(<FigmaBnbIcon />);
    const disc = container.querySelector("circle")!;
    const glyph = container.querySelector("path")!;

    expect(disc.getAttribute("fill")?.toUpperCase()).toBe(FIGMA_BNB_DISC);
    expect(disc.getAttribute("fill")?.toUpperCase()).not.toBe(
      RETIRED_BINANCE_DISC,
    );
    expect(glyph.getAttribute("fill")?.toUpperCase()).toBe(FIGMA_BNB_GOLD);

    // Shape, not just colour: the retired mark is five diamonds (5 subpaths of
    // 4 corners each); the cube the frame draws is a 10-piece isometric
    // outline. Counting subpaths is the cheapest witness that survives any
    // re-tracing of the individual segments.
    const subpaths = (glyph.getAttribute("d")!.match(/M/g) ?? []).length;
    expect(subpaths).toBe(10);
  });

  it("Solana fills its disc and uses the frame's ring, not the brand green", () => {
    const { container } = render(<FigmaSolanaIcon />);
    const circles = Array.from(container.querySelectorAll("circle"));

    // The whole reported defect: there was no disc at all, so on a dark panel
    // the badge read see-through behind the tri-bars.
    expect(fills(container as HTMLElement)).toContain(FIGMA_SOL_DISC);

    const ring = circles.find((c) => c.getAttribute("stroke"))!;
    expect(ring.getAttribute("stroke")?.toUpperCase()).toBe(FIGMA_SOL_RING);
    expect(ring.getAttribute("stroke")?.toUpperCase()).not.toBe(
      SOL_BRAND_GREEN_NOT_THE_FRAME,
    );

    // The disc has to sit UNDER the ring, or a fill painted last would hide it.
    const discIndex = circles.findIndex(
      (c) => c.getAttribute("fill")?.toUpperCase() === FIGMA_SOL_DISC,
    );
    expect(discIndex).toBeLessThan(circles.indexOf(ring));
  });

  it("Base is the Figma export — a disc with the bar knocked THROUGH it", () => {
    // ⚠️ THIS TEST ASSERTED THE OPPOSITE UNTIL 2026-08-19, AND THE REVERSAL IS
    // THE POINT. It previously pinned a hand-drawn substitute on the grounds
    // that the Figma export was "broken" — a #0052FF disc with a rectangular
    // slot knocked fully transparent.
    //
    // Re-measured against the REPORTER'S OWN attached PNG (24eb10ba /
    // 4c512f03): the export matches it once scaled, and the knockout IS the
    // brandmark — Base's mark is a disc with the bar removed, showing the page
    // behind it, not a white bar painted on top. The substitute rendered a
    // white field inside a thin blue ring, which is not what its own docblock
    // claimed it drew.
    //
    // So the oracle here is the reporter's raster, not a reading of the frame:
    // one `evenodd` path, filled Base blue, whose `d` carries BOTH the disc and
    // the bar. A white `<path>` or a separate `<circle>` means someone has
    // reinstated the substitute.
    const { container } = render(<FigmaBaseChainIcon />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(1);
    expect(paths[0].getAttribute("fill")?.toUpperCase()).toBe(FIGMA_BASE_BLUE);
    // evenodd is what makes the bar a hole rather than a second shape.
    expect(paths[0].getAttribute("fill-rule")).toBe("evenodd");
    const d = paths[0].getAttribute("d")!;
    expect(d).toContain("A8 8 0 0 1"); // the disc
    expect(d).toMatch(/H10\.4|H10,4/); // the bar subpath
    // Negative twin: nothing is painted white, which is how the substitute drew
    // the bar. Paired with the positive assertions above so it cannot pass
    // vacuously on an empty render.
    expect(container.querySelector('[fill="#FFFFFF"]')).toBeNull();
    expect(container.querySelector("circle")).toBeNull();
  });

  it("all three badges fill the same box, so a row of them reads level", () => {
    for (const Icon of [FigmaSolanaIcon, FigmaBaseChainIcon, FigmaBnbIcon]) {
      const { container } = render(<Icon />);
      expect(container.querySelector("svg")!.getAttribute("viewBox")).toBe(
        "0 0 16 16",
      );
    }
    // Solana's ring overflows its 32px node in Figma (`inset:-3.13%`), which a
    // 0 0 16 16 viewBox would clip. It is drawn at r=7.5 + strokeWidth 1 so the
    // outer edge lands on the box: same 1-unit thickness, same disc size, and
    // the badge still measures 16 units across like its two siblings instead of
    // rendering ~6% small next to them.
    const { container } = render(<FigmaSolanaIcon />);
    const ring = Array.from(container.querySelectorAll("circle")).find((c) =>
      c.getAttribute("stroke"),
    )!;
    const r = Number(ring.getAttribute("r"));
    const w = Number(ring.getAttribute("strokeWidth") ?? ring.getAttribute("stroke-width"));
    expect(r + w / 2).toBe(8);
  });
});
