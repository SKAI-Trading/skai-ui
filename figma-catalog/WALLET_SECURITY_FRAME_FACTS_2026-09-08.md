# Wallet account / security frame facts — 2026-09-08

File `mhF3BkzlTaGiLzJ7kvpmVc`. Every number below was read with `get_metadata`
on the node id quoted beside it, in one session while Figma was reachable. Nodes
that were not opened are named as not opened.

---

## ⛔ THE FINDING THAT CHANGES OTHER PEOPLE'S WORK

**Wallet 2 has no successor frame for the wallet's security surface. Not one
screen of it was redrawn.**

`live/_pages.json` scopes Wallet 1 (`2998:19593`) `v1-superseded` and Wallet 2
(`13008:26951`) `in-scope`, and the standing instruction on a superseded row is
"re-point it at the Wallet 2 equivalent, or close it as superseded". For this
surface there is nothing to re-point to.

Wallet 2 has 182 top-level children, 131 of them screen frames. Grepped its own
title list for `import`, `keystone`, `private`, `recovery`, `seed`, `phrase`,
`non-custodial`, `password`, `export`, `scan`, `unlock`, `lock`: **zero hits.**
The only account-adjacent boards on the page are three account frames and their
edit and logout variants.

Wallet 1 carries the whole set at all three widths:

| Screen | 375 | 768 | 1440 |
|---|---|---|---|
| Add wallet › Import existing | — | `7717:10153` | `7482:141833` |
| … › Recovery phrase | — | `7717:10565` | `7482:142212` |
| … › Recovery phrase › Wallet name | — | `7717:11907` | `7482:143789` |
| … › Private key | — | `7717:12740` | `7482:144255` |
| … › Keystone | `7774:70180` | `7717:13147` | `7482:144645` |
| Export private key | `7774:66509` | `7713:16630` | `7479:135805` |
| Export private key – reveal | `7774:67001` | `7713:16984` | `7479:136195` |
| unlock – password | `7727:14974` | `7675:51418` | `3012:15180` |
| Forgot password | `7727:15699` | `7683:7930` | `7473:130910` |
| Forgot password › OTP | `7728:59382` | `7683:33892` | `7473:131013` |
| … › Set new password | `7728:59766` | `7683:34510` | `7473:133033` |

**So `v1-superseded` over-blocks 13 open reports** whose subject the product
still ships and users still reach. Whether Wallet 2 *drops* these screens or
merely never redrew them is a question for Casey; it is not answerable from the
files. Do not close those rows as superseded and do not build the v1 boards as
drawn until it is answered.

---

## Import existing wallets, 375 — settles reports `80809420` and half of `23583e06`

`7797:71702` is **the drawer's `controls` header row, not the method list** —
which is what makes the "icons are smaller than Figma" report resolvable:

```
controls              335x24
  icons/action        24x24   at (0,0)      back
  text                275x22  at (34,1)     "Import existing wallets"
  icons/action        16x16   at (319,4)    close
```

`7797:71718`, the Keystone **row** on the same board:

```
Frame 374             335x64
  Frame 330           283x40  at (12,12)
    "Keystone"        60x18   at (0,0)
    "Upload an encrypted file that contains private keys"  283x14 at (0,26)
  icons/action        16x16   at (307,24)   trailing chevron
```

There is **no leading icon box** on the row. The removal measured on `7717:10529`
(768) and `7482:142032` (1440) is therefore correct at 375 too, and Casey's
"each board matches its own frame" ruling resolves to *no change*.

★ The row's own subtitle says "encrypted file", under a title that says
"Keystone". The homophone confusion is in the board, not only in the code.

---

## Account page — Wallet 2, in scope

Three boards: **375 `13008:44120`**, **768 `13008:43059`**, **1440
`13008:27689`**.

| | 375 | 768 | 1440 |
|---|---|---|---|
| Main container | 346 @ (15,64) | 580 @ (94,76) | 680 @ (380,104) |
| card gap | 8 | 8 | 16 |
| card pad | 12 | 12 | 16 |
| "My account" card | 346x168 | 580x180 | 680x200 |
| title row → content | 8 | 20 | **16** |
| heading leading | 18 | 19 | 24 |
| avatar (`Frame 407`) | 104x100 | 104x100 | 104x100 |
| … disc / glyph | 24 @ (80,76) / 16 | same | same |
| `Frame 275` x | 128 | 128 | 128 |
| … arrangement | handle **over** Wallet/Email | side by side (x=225) | side by side (x=318) |
| handle ramp | 20/24 | 24/28 | 32/38 |
| Wallet:/Email: leading | 14 | 16 | 18 |
| Preferences card | 346x294 | 580x311 | 680x414 |
| internal gap | 20 | 20 | **32**, and **48** before Save |
| theme pill | 102x44 | 180x50 | 210.67x62 |
| … label box | 28x16 @ y14 | 28x18 @ y16 | 22 tall @ y20 |
| currency input | 322x56 | 556x58 | 648x62 |
| … content inset / leading | 20 / 16 | 20 / 18 | 20 / 22 |
| Save | 322x44 | 556x50 | 648x62 |

★ **The 375 board is the only one that stacks the handle over Wallet:/Email:.**
Everything else on the row merely resizes. A `sm:` (640) tier cannot express it —
the boards are 375 / 768 / 1440, i.e. base / `md:` / `lg:`.

★ **Every one of these controls was rendering Tailwind's default leading**, not
the frame's, and in each case the padding was already right. That is the
recurring shape on this page: read the label's own text box, not the box around
it.

---

## Account edit drawer ("Update account settings")

375 `13008:44256`, 1440 `13008:27961`/`13008:27967`/`13008:27979`. **The 768
drawer was not opened.**

```
375   Frame 340        359x796 @ (8,8)      Frame 345 @ (12,12)  ⇒ pad 12
      controls         335x24               back 24, title 275x22 @ x34, close 16 @ x319
      → Background     y=48                 ⇒ 24 step
      Background 1     335x162              "Change avatar" 335x18, link 91x12 @ y26,
                                            Frame 407 104x100 @ y62  ⇒ 20 step
      Background 2     335x198 @ y234       heading 335x18, inputs 335x70 @ y38 and y128
      CTA              335x44  @ (12,740)
```

`input/primary-inputs`, the component both fields use:

| | 375 `13008:44281` | 1440 `13008:27986` |
|---|---|---|
| total | 70 | 88 |
| label | 14 | 18 |
| gap | 8 | 8 |
| field | 48 | 62 |
| field content inset / leading | 16 / 16 | 20 / 22 |

1440 avatar `13008:27974` is the same 104x100 / 24 @ (80,76) / 16 box as 375.

---

## Notification settings sidecar, 375 — `13008:44069`

Recorded for whoever owns `NotificationsPanel.tsx`; **not implemented**, that
file was dirty in another lane when this was measured.

```
Frame 340    359x796 @ (8,8)    Frame 345 @ (12,12), only 80 tall
  controls   335x22             title 309x22 @ (0,0), icons/action 16x16 @ (319,3)
                                ⇒ close only, NO back mark
  Frame 172  335x34 @ y46       "Push notifications" 109x18,
                                "Get alerts for transactions" 278.4x14 @ y20,
                                input/toggle 40.59x24 @ (294.41,5)
  CTA        335x44 @ (12,740)  pinned to the foot of the 796 panel
```

One toggle row, not a list. `13008:43852` (feed) and `13008:44082` (sample
notification) were **not** opened.
