# Wave 6 — integration lanes (delta from WAVE5-BRIEF.md)

**READ `WAVE5-BRIEF.md` FIRST AND IN FULL. All of it still binds** — the hard
prohibitions, the radius scale, the 44px tap floor, the type rules, the product
constraints, the TSV format. This file only says what is DIFFERENT.

Wave 5 measured. **Wave 6 builds.** Your frames are `not-started`: the design
exists and the implementation mostly does not.

---

## 1. ★ DO NOT TRY TO MEASURE A RENDERED DOM. It does not work in a fleet.

Wave 5 spent enormous effort discovering this, and 20 lanes must not rediscover
it 20 more times:

- **`optimizeDeps.force: true` means concurrent vite dev servers destroy each
  other's shared `node_modules/.vite/deps`.** 25 servers were started; **all 25
  probed DEAD** while still LISTENING. One lane's server took 80s to answer its
  first request and then never answered again. Two lanes independently started
  servers and watched both die identically.
- **The chrome-devtools MCP is a SINGLE shared browser profile.** A second lane
  is refused: *"The browser is already running for …chrome-profile"*. Where two
  did get in, they stole tab focus from each other mid-call.
- A page that never painted still returns **plausible geometry** —
  `innerW 1440 / bodyW 1424 / docH 900`, where the 16px "gutter" is the default
  8px body margin doubled on an empty document.

**So: do not start a dev server. Do not open the browser.** If you think your
frame cannot be built without one, say so in your report and move to the next.

## 2. What replaces it: a PARITY ORACLE TEST

This is the pattern that worked 19-wide with zero contention.

**Copy the exemplar: `src/components/trade/order/ScaledOrderFields.figma.test.tsx`.**
Its shape, which yours must match:

- **every expectation is a Figma pixel** read from node data;
- **every actual is resolved through the shipping Tailwind config** — so the test
  proves what the browser would paint, without a browser;
- **nothing re-reads the component's own strings.** A test that imports the
  component's constants and compares them to themselves passes forever and
  proves nothing.

That last point is the whole value. An independent oracle is what makes a `done`
row credible without a DOM.

**A `done` row in wave 6 requires: Figma pixel values in the reason column AND a
passing oracle test that encodes them.** No oracle test, no `done`.

## 3. `not-started` means you will CREATE files

Unlike wave 5, expect to add components rather than adjust them.

- Put new files where the surrounding feature already lives. Match the
  neighbouring code's conventions exactly — imports, naming, comment density.
- **Every primitive comes from `@skai/ui`.** Never write a new Button, Card,
  Input, Dialog, or Badge in feature code. If `@skai/ui` lacks something, report
  it — do not build a local substitute.
- **Wire it up or say you did not.** A component imported by nothing is not
  integrated: wave 5 found a 679-line panel imported by nothing, and 40 catalog
  rows naming components with zero mount sites. If you cannot reach the mount
  host (another lane owns it), say exactly which file needs the import.
- Do not add a route unless your frame IS a route. **A market TYPE is a filter,
  never a route.**

## 4. Scope is already decided — do not widen it

Your work list is a TSV in `figma-catalog/wave6-worklists/<your-lane>.tsv`, with
`node`, `device`, `title`, `fileKey`, `page`. Those frames and no others.

**Governance (29 frames) and Onboarding (18) are EXCLUDED** — Casey holds
Governance and has ruled onboarding/landing fine as-is. They were caught in a
fallback bucket while this partition was being built; if a frame you are given
turns out to be on either page, skip it and report.

## 5. Untitled frames — read node data, do not guess

Trade 2 lanes: many of your rows show `UNTITLED`. That is a known truncation of
`trade-2.titles.tsv`, **not** an unnamed frame. Read the real name and geometry
from node data before deciding what the frame is. Do not infer a screen's purpose
from its node id.

## 6. Report back

As WAVE5-BRIEF §12, plus:

- **frames built / frames in your work list** — the denominator is in your TSV,
  so there is no excuse for a countless report;
- for each built frame: the oracle test path, and the Figma numbers it encodes;
- every file you CREATED, and where it is mounted (or which file needs to mount it);
- anything you could not build, with the reason — a `blocked-on-backend` or a
  product question is a fine outcome, an invented answer is not.
