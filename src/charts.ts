/**
 * SKAI UI Charts
 *
 * The components that draw with a charting library: the recharts wrapper
 * (`ChartContainer`, `ChartTooltip`, `ChartLegend` and their content parts)
 * and the lightweight-charts `CandlestickChart`.
 *
 * Import them from '@skai/ui/charts', not from the main entry.
 *
 * @example
 * ```tsx
 * import { ChartContainer, ChartTooltip, CandlestickChart } from '@skai/ui/charts';
 * ```
 *
 * WHY THEY HAVE THEIR OWN ENTRY (2026-09-22, report 5d7a6dc7): the main entry
 * is built as ONE module, and these components are `forwardRef(...)` calls a
 * bundler cannot prove free of side effects, so it keeps them even when nothing
 * renders them. Every app that imported anything at all from '@skai/ui'
 * therefore loaded recharts and lightweight-charts at boot. In the main app
 * that meant both libraries on every page load, and the recharts it loaded is
 * this package's own v3, a second copy next to the app's v2. In the wallet it
 * put lightweight-charts in the entry chunk. Nothing imported these from the
 * main entry when they moved here.
 *
 * `LazyChart` stays in the main entry: it loads recharts with import().
 */
export * from "./components/data-display/chart";
export * from "./components/data-display/candlestick-chart";
