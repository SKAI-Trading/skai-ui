# `@skai/ui` Primitive Gaps — 2026-05-26

Audit produced by the F10 agent during the Phase C/D/E (wave-tier) review of
feature-code that was reaching past `@skai/ui` and hand-rolling primitives.
Five gaps in the shared library were causing the duplication. This wave (G1)
closes the top three; the remaining two are tracked here for a follow-up.

The driving principle in `CLAUDE.md` is that **every UI primitive must come
from `@skai/ui`** — feature code should never declare its own `Button`,
`Card`, `Input`, or status chip. When the library is missing a needed shape,
the fix belongs in this submodule, not in the call sites.

---

## Gap 1 — `pill` size on `SkaiButton` (CLOSED — G1)

**Symptom.** Feature code repeatedly hand-rolled a 40px-tall pill-shaped action
button (compact "Connect", "Refresh", "Add to Watchlist" patterns). The
existing SKAI sizes (`massive`/`large`/`medium`/`small`) all bottom out at
46px, which is too tall for inline toolbar use.

**Fix.** New `skaiSize: "pill"` variant on `SkaiButton`:
`h-[40px] px-6 py-3.5 text-sm leading-[18px] rounded-xl gap-2 [&_svg]:size-4`.

**Migration.** Anywhere feature code declared `<button className="h-10 px-6
... rounded-xl ...">`, swap to `<SkaiButton skaiSize="pill">`. The CVA is
backwards compatible — existing call sites keep their current sizes.

---

## Gap 2 — No tier/brand `Tag` chip (CLOSED — G1)

**Symptom.** Tier badges (Bronze, Silver, Gold, Diamond, Platinum, Legend) and
brand chips (Sky Blue, Alien Green) were repeatedly hand-rolled with inline
hex codes. `Badge` was the closest match but it ships semantic variants
(`success`, `warning`, `long`, `short`, `pending`) that don't compose with
tier accents. Result: ~20 sites with copy-pasted `bg-[#FFD700]/10
border-[#FFD700]/30 text-[#FFD700]` strings.

**Fix.** New `Tag` component at `src/components/core/tag.tsx`. CVA with:
- `tone`: `bronze | silver | gold | diamond | platinum | legend | sky-blue |
  alien-green | muted` (9 tones)
- `variant`: `fill | stroke`

Hex values are sourced from `tierColors` in `lib/design-tokens.ts` rather
than CSS variables — the repo has no `--tier-*` CSS-var layer yet, and the
existing `Badge` component follows the same inline-hex pattern.

**Migration.** Replace ad-hoc tier chips with `<Tag tone="gold">Gold</Tag>`.
If a CSS-var layer for tier colors lands later (e.g. for theming), the CVA
class strings become the single point of change.

---

## Gap 3 — `Separator` lacked tone control (CLOSED — G1)

**Symptom.** Feature code overrode the `bg-border` default with one-off
classes (`bg-[#123F3C]`, `bg-[#001615]/40`) — typically to draw a brand
divider inside a card or a faded divider on a dark surface.

**Fix.** New optional `tone` prop on `Separator`:
- `default` (existing behavior — `bg-border`)
- `bright` — deep teal accent `bg-[#123F3C]`
- `dark` — faded green-coal `bg-[#001615]/40`

Backwards compatible. Existing call sites without `tone=` are unchanged.

---

## Gap 4 — `Input` lacks leading/trailing slot (OPEN — defer)

**Symptom.** Search inputs, amount inputs with token suffix, and password
fields with eye toggles all hand-roll a wrapper `<div>` with absolutely
positioned icon children. ~12 sites.

**Proposed shape.** Add optional `leading` / `trailing` ReactNode props on
`Input` that render inside the bordered control, with focus-ring/disabled
states forwarded correctly.

**Why deferred.** The current `Input` is barebones shadcn; the right time to
add slots is alongside the next Input audit (size variants, error state,
helper text) so the API lands in one shape, not two.

---

## Gap 5 — No `Stat` / `Metric` primitive (OPEN — defer)

**Symptom.** Stats cards (price + change %, count + sparkline, balance + USD
equivalent) are hand-rolled across `/trade`, `/portfolio`, `/launchpad`, and
`/predict`. The label-above-value-above-delta pattern is roughly identical,
but each surface uses slightly different typography.

**Proposed shape.** `Stat` component with `label`, `value`, `delta`
(positive/negative/neutral), and `align` (`start`/`center`). Possibly
composes `Tag` for category prefix.

**Why deferred.** Typography is still shifting (the recent `Typography`
component landed). Once typography stabilizes, design the `Stat` API once
and migrate ~25 sites.

---

## Priority summary

| # | Gap                           | Status     | Wave |
|---|-------------------------------|------------|------|
| 1 | `SkaiButton skaiSize="pill"`  | CLOSED     | G1   |
| 2 | `Tag` component (9 tones)     | CLOSED     | G1   |
| 3 | `Separator tone` prop         | CLOSED     | G1   |
| 4 | `Input` leading/trailing slot | OPEN       | TBD  |
| 5 | `Stat` / `Metric` primitive   | OPEN       | TBD  |
