# GoldTrader Research Lab — public read-only dashboard shell

Status: **research preview; not deployed to main**. Date: 2026-10-20.

This directory is an additive static page for the KredBanK GitHub Pages site at `/goldtrader/`; it does not change the existing homepage.

## Included
- Responsive black/white interface consistent with the existing KredBanK static site.
- Nine navigable panels: Overview, Market Explorer, Pattern Explorer, Strategy Lab, Backtesting, Fundamentals, Research Library, Risk & Validation, System Health.
- 30 bibliography entries with links, methodology, limitations and abstract/full-text access labels.
- Explicit research-only, no live quotes, no broker orders, no fabricated equity curves or P&L.
- TF selection and bibliography filtering work client-side.

## Deliberately NOT included
- No raw FxPro GOLD quotes or tick data (redistribution/licence not approved).
- No trading API, credentials, orders, or account identifiers.
- No backend/API calls; live charts and authenticated backtests are blocked until independently implemented and approved.
- No production deployment or merge into `main`.

## Next implementation gates
1. Confirm FxPro / provider redistribution rights and legal approval for public derivatives.
2. Design an authenticated read-only API on the private GoldTrader market/research side with bounded public fields and rate limits.
3. Add point-in-time bars, provenance, data freshness, DST-safe aggregation, session-aware missingness and immutable snapshot IDs.
4. Add OOS-validated backtests with slippage/commission/swap, broker contract specifications and no-look-ahead.
5. Implement authentication if non-public research/account data are exposed; otherwise keep page static and public.
6. Test mobile Safari, keyboard navigation, screen readers, CSP, CI, accessibility and production deployment separately.

The 5.2 GoldTrader canonical repository is private. Public code must never embed private GitHub links that expose secrets, broker account data or runtime paths.
