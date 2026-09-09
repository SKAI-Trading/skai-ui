# Global chrome — frame facts, 2026-09-08

The bottom navigation bar, the desktop price ticker and the shell's hinge between
them. Every number below was read off the node with `get_design_context` /
`get_metadata` on 2026-09-08; nothing here is copied from an earlier note. App
values were read off the **live production DOM** (`app.skai.trade`,
`index-DJRTgxtp.js`, `Last-Modified: Wed, 09 Sep 2026 03:45:53 GMT`) with
`getComputedStyle`, not off the source.

Written because five bug reports (`c8bc78cc`, `3c715416`, `52d5cfd7`,
`a7fe2658`, `0904ea3f`) were cycling on questions this file answers, and three of
the five turn on the same measurement.

---

## 1. There is ONE bottom-nav component, instanced on every board

`10640:30604` (Predict, `3sSzw1KewMtUbeLAv7uW0r`) and `6795:30736` (Home 1,
`mhF3BkzlTaGiLzJ7kvpmVc`) carry **identical child ids** — `I…;1724:2578`
through `…;2592`. They are the same master. So a report filed against the bar on
/predict and one filed against it on /portfolio are the same report; there is no
per-surface bottom bar to diverge.

The tablet bar is a **different** master: `6415:44306`
"Bottom-navigation-tablet", which `6782:27056` instances.

### Phone — `Bottom-navigation-mobile`, 375 x 54

| | value |
|---|---|
| fill | `rgba(0,22,21,0.6)` (Green Coal 300 @ 60%) |
| backdrop blur | 10px |
| top border | 1px `#123F3C` (Green Coal 100) |
| container padding | **4px, uniform** — first `list` starts at x=4, y=4 |
| tab box | 73.4 x 46, five of them, `justify-between` |
| icon | 16 x 16, at y=6 inside the tab |
| label | y=24, h=16 — **Mulish Regular 12 / 16, tracking −0.48px** (`Sm/Label 1 300`) |
| current tab | label `#56C7F3` (Sky Blue 300) — Predict, on the Predict board |
| stacking | icon ABOVE label, 2px gap, tab radius 8 |

### Tablet — `Bottom-navigation-tablet`, 768 x 52

| | value |
|---|---|
| fill / blur / border | identical to the phone bar |
| container padding | **`px-19 py-8`** |
| tab | `flex-1`, icon BESIDE label, gap 6, `pl-16 pr-20 py-6`, radius 8 |
| icon | 16 x 16 |
| label | **Mulish Regular 14 / 16, tracking −0.56px** (`Md/Label 1 300`) |

### What the app ships, measured live

```
nav class  fixed bottom-0 left-0 right-0 z-50 flex h-[52px] items-center
           justify-between gap-1 px-[19px] py-2 border-t border-[#123f3c]
           bg-[rgba(0,22,21,0.6)] backdrop-blur-[10px] md:flex lg:hidden
backgroundColor  rgba(0, 22, 21, 0.6)      backdropFilter  blur(10px)
borderTop        rgb(18, 63, 60) 1px       padding         8px 19px
label            14px / 500 / Manrope       (Mulish IS loaded: 400 loaded,
                                             300–800 declared)
```

⇒ **fill, blur and top border match the frames to the byte.** Reports that read
the bar as "darker than Figma" are reading the page through 40% of it, not a
wrong paint. In Figma the strip sits on the board's own Green Coal ground; in the
app it sits on whatever the route ends with.

⇒ **The app ships the TABLET geometry at every width.** `h-52`, `px-19`, `py-2`
are `6415:44306`'s numbers; the phone master wants **54 tall with 4px uniform
padding**, which makes each tab 73.4 wide against the app's 67.4 at 375.

⇒ The **label family** was the app's body face, not the frames'. Fixed
2026-09-08 by putting `font-mulish` on the nav from
`src/components/layout/MobileBottomNav.tsx` — family is the one of the three
properties the label span leaves to inheritance.

### ⛔ Still wrong, and NOT fixable from the app

`@skai/ui`'s `src/components/layout/mobile-bottom-nav.tsx` owns these, and this
app consumes the package prebuilt from `dist`:

| property | frames | ships | where |
|---|---|---|---|
| label size at 375 | 12px | 13px (`text-[13px] sm:text-[14px]`) | span, :149 |
| label weight | Regular 400 | Medium 500 (`font-medium`) | span, :149 |
| bar height at 375 | 54px | 52px | inline `style.height`, :103 |
| padding at 375 | 4px uniform | `px-[19px] py-2` | :97 |

The height is an inline style, so a `className` override at the call site cannot
reach it — which is why the padding was left alone too. Half the phone geometry
is reachable and half is not, and moving only the reachable half leaves the bar
matching neither master. It is one change, in the component, by its owner.

Note `sm:` is 640px and **matches none of the three boards** (375 / 768 / 1440),
so `text-[13px] sm:text-[14px]` gives 375 a value no frame asked for.

---

## 2. The bar and the ticker hinge on the same breakpoint, opposite ways

```
MobileBottomNav   md:flex lg:hidden      →  visible 768 – 1023
HomeBottomTicker  hidden … lg:flex       →  visible 1024 +
```

They can never both show and never both hide. `@skai/ui` bakes `md:hidden` into
the bar's base and the app appends `md:flex`; **twMerge drops the baked class**,
verified on the live DOM (the served `class` attribute contains no `md:hidden`).

⛔ That merge is load-bearing. In the shipped stylesheet `.md\:hidden{display:none}`
is emitted **after** `.md\:flex{display:flex}`, so if both ever survived onto the
element the later rule would win and the bar would vanish across the entire
tablet range with nothing to replace it. Pinned by
`src/components/layout/MobileBottomNav.chrome.test.tsx`.

Report `a7fe2658` ("the tablet footer menu still has the ticker scroll footer")
is the 1024 hinge seen from above it. Its own attachments settle it: the same
reporter, the same afternoon, photographed the **nav** in a 781px-wide capture
(`3c715416`, the 768 board) and the **ticker** in a 937px-wide one — and the
ticker is `left-[248px]` with the sidebar expanded, so 937 + 248 = **1185px**,
not 768. At 768 the app already draws what the tablet board draws.

There is no board between 768 and 1440, so 1024 is a code decision, not a
measured one. Moving the bar up to 1279 (`lg:` → `xl:`) is a one-word change and
a ruling, not a bug.

---

## 3. `13006:147365` "Trench scroller" is NOT a links footer

Measured first-hand, confirming `LAUNCHPAD_FRAME_FACTS_2026-08-26.md` §2 rather
than quoting it. 1382 x 22 at y=878, and its contents are:

- `Preset 1` with a 12px glyph; a counter (`1`); a balance (`37.21`)
- a rule, then three 12px chain marks
- three balances: `$56.98K` · `$200.11` · `$112.98K`
- five stat pairs: `14.12K` · `112.46K` · `43.09K` · `0.0₂13` · `0.0₂81`

No tokens, no prices-by-pair, no link rows. Its near-twin `13006:147304` at y=0
is the token ticker. Report `0904ea3f` reads "footer missing" and cites this
node, so what it is actually describing is *the app's bottom strip shows market
pairs where the frame's shows presets, balances and gas stats*.

Most of those figures have no live source, and /launchpad passes
`showFooter={false}` (`src/pages/Launchpad.tsx`), so the links `<Footer/>` never
renders there either — what sits at the bottom is `HomeBottomTicker`, global
shell chrome. Both halves are shell decisions.

---

## 4. The onboarding boards carry NO bottom bar — and the app drew one

| node | size | children |
|---|---|---|
| `6383:21006` onboarding Qs - 1 | 375 x 812 | `shine` · `main` · `Header-mobile` |
| `6383:20999` onboarding Qs - 1 | 768 x 1024 | `shine` · `main` · `Header-desktop` |

`main` runs to the frame's bottom edge in both, and neither frame contains a
`Bottom-navigation` instance. At 375 the CTA row `6385:21318` sits at y=744 and
is 44 tall, so a 52px bar pinned to the viewport bottom covers **28px of the two
buttons the step exists to offer**.

`onboardingChrome.ts` exists precisely to suppress global chrome here, and its
docblock enumerates what it hides — "HomeTopBar + the left sidebar + the bottom
ticker". `HomeShellLayout` guards those three (`:143`, `:189`, `:264`) and mounts
`<MobileBottomNav/>` at `:263` with no guard. The list was written from the
desktop shell, where this bar never paints; on a phone it is the only chrome
there is, and its five tabs stayed in the tab order behind the dialog — the focus
leak the flag was added to close.

Fixed 2026-09-08 in `src/components/layout/MobileBottomNav.tsx` by folding the
flag into the bar's existing `visible` expression, so the bar suppresses itself
wherever it is mounted and its "More" drawer cannot outlive it.

★ The shape to look for elsewhere: a guard whose *list of things to hide* was
written against one breakpoint. Enumerations age worse than predicates.
