# Status verification brief — SKAI Figma redesign families

Goal: set an ACCURATE implementation status for each Figma screen "family" in
`figma-catalog/families.json`, verified against real code + routing, not just
citation counts. A code file citing a Figma node-id in a comment is a HINT, not
proof the screen is built and rendering.

## Status values (write these)
- `done` — implementing component exists AND is reachable (routed / mounted) AND renders the screen's substance. Cite the file + route.
- `partial` — some implementing code exists but incomplete: missing states/variants, stubbed, not routed, or renders an offline/placeholder shell only.
- `not-started` — no implementing code found.
- Keep `unknown` only if genuinely undetermined after checking.

## Ground truth for routing (from App.tsx + RedesignHome.tsx)
- Whole redesign gated by `REDESIGN_HOME` (default ON), in `src/config/features.ts`.
- `App.tsx:821`  `/`         → `<RedesignHome/>` (else legacy `<Index/>`)
- `App.tsx:1128` `/portfolio` → `<PortfolioScreen/>` (else legacy `<Portfolio/>`)
- `RedesignHome.tsx` dispatches AI-home tool surfaces via `?tab=`/`toolSurface`:
  signals, news, sentiment, insights(=Analysis), research(=Screener), insightx,
  market(=Market Intel), whale/whales, myagent, advisor, autotrading, copy,
  backtest, arbitrage/prediction-arbitrage, feed. Each renders a screen from
  `src/components/home-redesign/screens/` (or market-intel/, insightx/, whales/, agents/).
- home-redesign impl dirs: agents, conversation, feed, insightx, market-intel,
  markets, onboarding, portfolio, screens, upgrade, whales.
- Play redesign lives in the `modules/skai-gaming` submodule (skinned UI in
  `modules/skai-gaming/src/components/play/ui/`), NOT src/.
- **Wallet is a SEPARATE APP** in the `modules/skai-wallet` submodule (now checked
  out), deployed at wallet.skai.trade — NOT compiled into the main src/ app. Its
  Figma frames are implemented THERE: `modules/skai-wallet/src/{pages/wallet,components/wallet,shell,shell/panels}`.
  Its own router (`modules/skai-wallet/src/shell/routes.tsx`): `/` WalletHomeRoute,
  `/activity` WalletActivityRoute, `/token/:symbol` WalletTokenDetailRoute,
  `/account` WalletAccountRoute; send/receive/swap/buy/unlock/notifications are
  routes or drawers/modals (WalletSend, WalletReceive, WalletSwap, WalletUnlock,
  WalletModals, panels/*). Verify wallet families against THIS submodule, not src/.

## How to verify a family
1. Read its `citedFiles` + `dirs` in families.json.
2. Open the most relevant cited file(s); confirm they actually implement THAT
   screen (not just mention the node-id). Check for real JSX/structure vs stub.
3. Check reachability: is it routed in App.tsx or dispatched in RedesignHome?
4. Decide status with a one-line reason + primary file:route evidence.

## Output
Write `figma-catalog/status.<section>.tsv`: `family <TAB> status <TAB> primaryFile <TAB> route <TAB> reason`.
One line per family in that section. Do not modify other files.
