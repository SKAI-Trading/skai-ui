/**
 * SKAI UI Icons
 *
 * Two sets, one entry point:
 *
 *  - `Figma*Icon` — the SKAI set, traced from the design file. Prefer these
 *    whenever the design draws the icon; they are what parity is measured
 *    against.
 *  - everything else — lucide, for affordances the design does not draw.
 *
 * Import icons from '@skai/ui/icons' instead of 'lucide-react' directly.
 *
 * @example
 * ```tsx
 * import { FigmaSearchIcon, Bot, Wallet } from '@skai/ui/icons';
 * ```
 *
 * WHY THE FIGMA SET LIVES HERE (2026-07-17): it used to live only in the app
 * (`src/components/icons/figma-icons.tsx`), so the wallet — a separate surface
 * consuming this same package — could not reach it and imported raw lucide in 45
 * files. Every wallet page then read as "close but not Figma", which is exactly
 * what QA reported (28006e50, and the 19567214 / 0d33d475 meta-reports). The set
 * is self-contained (React only), so it belongs in the shared package that
 * CLAUDE.md already mandates every primitive come from. The app's old path is
 * now a re-export shim, so its 58 importers are untouched.
 *
 * No collision risk: every SKAI icon is `Figma`-prefixed and lucide exports no
 * such name, so both `export *`s can coexist.
 */
export * from "lucide-react";
export * from "./figma-icons";
