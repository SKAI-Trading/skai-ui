# Layer E — tokens: what Figma calls it vs what our class ships

Started 2026-08-13. CATALOG_DESIGN.md lists layer E as "not started"; this is the
border-radius half of it, measured rather than recalled.

**The one rule:** read the frame's resolved **pixel** value, never its token name. The
name is what carries over when someone copies a spec off a frame; the value is what
does not. Every radius defect found in the 2026-08-11 sweep had the correct pixel value
written in a comment directly above a class one step too large.

> ### ⚠️ If a brief told you "our scale is `sm 4 / md 8 / lg 12 / xl 16 / 2xl 24`" — it is wrong
>
> Verified again 2026-08-26. That is the raw `skaiBorderRadius` **declaration**
> (`design-tokens.ts:1282-1290`), which the preset then **overrides for `sm`, `md` and
> `lg`** at `tailwind-preset.ts:392-397`. What the app paints is
> **`sm 8 / md 10 / lg 12 / xl 16 / 2xl 24`**.
>
> `sm` and `md` are the two that differ, and both differ in the dangerous direction: a
> lane told "`sm` = 4px" reads Figma's 4px, ships `rounded-sm`, and paints **8px**;
> reading Figma's 8px it ships `rounded-md` and paints **10px**. Neither throws and both
> look intentional. The delta table below is the correct one — and prefer a pixel literal
> (`rounded-[8px]`) over any class name.

## Figma's scale — measured, not assumed

Method: `findAll` over eight screens in `mhF3BkzlTaGiLzJ7kvpmVc`
(`13006:134301`, `13006:146233`, `13008:113481`, `7482:144645`, `2713:4425`,
`13008:115463`, `13006:210576`, `3903:21478`, `13008:36562`), reading each node's
`cornerRadius` together with the variable bound to `topLeftRadius`/`cornerRadius`.
473 nodes carried a bound radius variable.

| Figma variable | Resolves to | Placements seen |
|---|---|---|
| `border-radius/rounded-sm` | **2px** | 24 |
| `border-radius/rounded` | **4px** | 58 |
| `border-radius/rounded-md` | **6px** | 18 |
| `border-radius/rounded-lg` | **8px** | 109 |
| `border-radius/rounded-xl` | **12px** | 14 |
| `border-radius/rounded-2xl` | **16px** | 122 |
| `border-radius/rounded-3xl` | **24px** | 13 |
| `border-radius/rounded-full` | **9999px** | 67 |

That is exactly the **stock Tailwind v3 default scale**. Figma did not invent a radius
ramp; it uses Tailwind's.

There are no *local* variable collections in either product file
(`getLocalVariableCollectionsAsync()` returns `[]`) — the radius variables come from a
published library, so they are only readable through a node that binds one. Enumerating
collections to find them returns nothing and reads as "no variables exist", which is
wrong.

## Our scale — sourced, with file:line

The `borderRadius` block of `modules/skai-ui/src/lib/tailwind-preset.ts` is what the app
actually consumes (the root `tailwind.config.ts:47` pulls it in via
`presets: [skaiPreset]`). It sat at lines 359-364 when this was written and moved to
392-397 the same day when an unrelated `opacity` scale landed above it — **grep for
`borderRadius:` rather than trusting that number.**

```ts
borderRadius: {
  ...skaiBorderRadius,              // design-tokens.ts:1282-1290
  lg: "var(--radius)",              // 12px
  md: "calc(var(--radius) - 2px)",  // 10px
  sm: "calc(var(--radius) - 4px)",  //  8px
},
```

`--radius: 0.75rem` (= 12px), declared identically in `src/index.css:495`,
`modules/skai-ui/src/styles/base.css:138` and `modules/skai-ui/src/styles/index.css:90`.

`skaiBorderRadius` (`modules/skai-ui/src/lib/design-tokens.ts:1282-1290`) declares
`none:0 sm:4px md:8px lg:12px xl:16px 2xl:24px full:9999px`. The three keys after the
spread override `sm`, `md` and `lg`; **`xl` and `2xl` survive from the spread**, which is
what pushes them off Tailwind's defaults.

⚠ Do not read the radius scale out of `modules/skai-ui/tailwind.config.ts:70-74`. That
file configures building skai-ui itself, does **not** spread `skaiBorderRadius`, and
therefore describes a scale the app never ships. It was misread once while writing this
document and produced a confidently wrong answer.

## The delta table — this is the part that prevents a wrong "fix"

| Class | Figma value for the same NAME | Our shipped value | Same? |
|---|---|---|---|
| `rounded-sm` | 2px | **8px** | ✗ +6px |
| `rounded` | 4px | 4px | ✓ |
| `rounded-md` | 6px | **10px** | ✗ +4px |
| `rounded-lg` | 8px | **12px** | ✗ +4px |
| `rounded-xl` | 12px | **16px** | ✗ +4px |
| `rounded-2xl` | 16px | **24px** | ✗ +8px |
| `rounded-3xl` | 24px | 24px | ✓ |
| `rounded-full` | 9999px | 9999px | ✓ |

### Converting a Figma radius to a class

Match on the **value**, not the name:

| Figma says | Ship this |
|---|---|
| 2px | `rounded-[2px]` — no class on our scale is 2px |
| 4px | `rounded` |
| 6px | `rounded-[6px]` — no class on our scale is 6px |
| 8px | `rounded-sm` |
| 10px | `rounded-md` |
| 12px | `rounded-lg` |
| 16px | `rounded-xl` |
| 24px | `rounded-2xl` (or `rounded-3xl`) |
| 9999px | `rounded-full` |

For `lg`/`xl`/`2xl` the shortcut is **one step down**: Figma's `rounded-xl` is our
`rounded-lg`. The shortcut breaks at both ends — Figma's `sm` (2px) and `md` (6px) have
no class at all, and `3xl`/`full`/`rounded` match by name already.

### Correction to the previously circulated table

`figma-parity-measurement-traps-2026-07-22` records Figma's `rounded-sm` as 4px. It is
**2px**. 4px is Figma's *unsuffixed* `border-radius/rounded`, which that table omits
entirely, so the two rows appear to have been collapsed. The `lg`/`xl`/`2xl` rows in
that table are correct and are reproduced above. The `md` and `3xl` rows are new here.

`design-tokens.ts` declaring `sm: 4px` is a third spelling of the same number and is
**dead** — the preset overrides it to 8px. Grepping the token file "confirms" 4px while
the browser paints 8px.

## Guardrails

- A radius that already matches the table above is **correct**. Do not restyle it to
  match a token name that appears in a Figma layer panel.
- `rounded-full` on a rectangle is not automatically a bug and not automatically right;
  9999px is a real Figma value with 67 placements in the sample.
- The values above are the **product** files. The Games file was not sampled; treat game
  screens as unmeasured rather than assuming they share the ramp.
- Colour tokens are still layer-E-unstarted, in the sense that no Figma variable
  collection has been harvested for colour. ★ **CORRECTED 2026-08-31: the trap this
  bullet used to name is not a trap, it is a nineteen-day-old falsehood.** The old
  text read "`sky-blue` resolves to `#2DEDAD` (green) after the 2026-06-12
  green-theme directive". MEASURED at source, not inferred:
  `modules/skai-ui/src/lib/design-tokens.ts:70` holds `skyBlue: "#56C7F3"`; the
  preset maps `"sky-blue": accentColors.skyBlue` at `:244`; and `:51-69` carries an
  explicit **DO NOT "fix" this back to #2DEDAD**, recording that the 2026-08-12
  Casey ruling "Match figma always" SUPERSEDED the 2026-06-12 green-theme
  directive, and naming the hazard it removed — while `skyBlue === alienGreen` an
  accent control was pixel-identical to a buy/long control on trading surfaces. So
  `sky-blue` is BLUE and equals Figma's Primary/Sky Blue 300.
  **DEPTH: source-file read of `design-tokens.ts` only** (declaration, preset
  mapping, CSS-var emission at `:993`). Nothing was read off a rendered DOM or a
  Figma variable def this pass, so this settles what the TOKEN resolves to and
  says nothing about what any given screen actually paints.
- The genuinely confusable set, all three measured in the same read: `alien-green`
  (`design-tokens.ts:49`, `#2DEDAD`), `skai-green` (`:248` → `semanticColors.green[300]`,
  `:79`, also `#2DEDAD`) and `alien-green-bright` (`:50`, `#17F9B4`). Green comes from
  those classes, never from `sky-blue`. A green render therefore CANNOT be blamed on
  the `sky-blue` token — if you see one, the painting class is unidentified and the
  row is an open colour defect, not a ruled app-wide exemption.
  Source of truth is `get_variable_defs` on the node and `design-tokens.ts` in code,
  never a reporter's adjective and never a prose line in this file — this bullet was
  itself the counter-example, and downstream rows cited it BY NAME to defer real
  defects (corrections already landed on `status.wave3.verify-social.tsv:196`,
  `status.wave4.social-a.tsv:13/25`, `status.wave4.social-b.tsv:10/11/12/38/39`,
  `status.wave5.discover-createtoken.tsv:2`, `status.social.tsv:49`).
