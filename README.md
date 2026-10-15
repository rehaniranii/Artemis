# MONO — Make Money Make Sense

A frontend-only foundation for a financial education hackathon. The UI uses warm ivory, sage, Instrument Serif and Inter. This phase intentionally stops at the application shell, persisted inputs, reusable components and module placeholders.

## Run locally

Node.js 22.12+ (tested with Node 26.10). Dependencies are locked in `package-lock.json`.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
```

## Architecture

- `src/pages/`: lazy-loaded route entry points; no duplicate financial state.
- `src/features/`: module-specific UI and configuration, separated by responsibility.
- `src/components/ui/`: official shadcn/ui source components built on Radix, adapted to local tokens and the `cn` helper. Slider thumbs explicitly inherit accessible labels.
- `src/components/layout/`: application shell, responsive navigation and render-error boundary.
- `src/components/shared/`: page headings, placeholders, animated numbers, loading/empty states and disclaimers.
- `src/components/financial/`: reusable cards, progress ring, risk and scenario labels, contribution slider and tooltip.
- `src/components/charts/`: the isolated Recharts primitive. Loaded only in the component library for now.
- `src/types/`: domain contracts. Investment method (SIP) is not represented as an asset category.
- `src/data/`: demo persona, fictional concept cards and explicitly illustrative assumptions.
- `src/store/`: one Zustand source of truth plus normalization and validation.
- `src/hooks/`: derived financial summary and reduced-motion preference.
- `src/lib/calculations/`: pure financial helpers, separate from presentation.
- `src/styles/`: Tailwind v4 tokens, typography, shared treatments and reduced-motion rules.

The requested feature boundaries exist for onboarding, explorer, MONO Match, planner, simulator, Reality Lab, dashboard and blueprint. A sidebar was intentionally unnecessary for four primary navigation jobs.

## Routes

React Router uses **hash routing** so static hosting supports direct navigation and reloads without a server rewrite. Example: `/#/plan`.

| Path | Purpose | Current scope |
| --- | --- | --- |
| `/` | Landing | Designed introduction and working links |
| `/home` | Home | Saved profile summary, empty demo portfolio, preferences |
| `/explore` | Explore | Concept previews; no fund marketplace |
| `/explore/funds/:fundId` | Fund detail | Validated concept route and detail placeholder |
| `/plan` | My Plan | Planner placeholder |
| `/reality-lab` | Reality Lab | Saved scenario choice; playback placeholder |
| `/onboarding` | Starting point | Basic saved-input form; full guided flow deferred |
| `/blueprint` | Financial Blueprint | Placeholder |
| `/mono-match` | MONO Match | Placeholder; no recommendations |
| `/simulator` | Simulator | Placeholder; no projections generated |
| `/design-system` | Component library | Isolated component examples; no financial state changes |
| `*` | Not found | Recovery link; also used for invalid fund IDs |

The old single-page anchors are mapped in `main.tsx` to relevant new routes. The old site remains in `archive/honest-million-v4/` and Git history.

## State & persistence

`useFinancialStore` owns the profile, INR goal, income, essential expenses, monthly capacity, horizon, risk tolerance, portfolio allocation, selected concept IDs, scenario, demo holdings and preferences. It persists only data (not actions) under `mono:financial-state`, schema version 1. Older prototype storage keys are left untouched; MONO starts with a fresh demo persona.

- Financial capacity is derived from income minus essentials; it is not risk tolerance.
- Profile updates cannot create a contribution amount greater than available income.
- Allocations must be nonnegative, finite and sum to 100%; invalid updates are rejected atomically.
- Persisted objects are normalized, bounded and checked against known IDs. Migration falls back to safe demo values.
- Malformed JSON and denied storage do not crash the app. A visible notice explains when persistence is unavailable.
- Holdings start empty. No fabricated account balance or market performance is shown.
- The browser's reduced-motion preference and the saved app preference both apply. Calm view is saved; full performance summaries are deferred.
- `resetDemo()` resets only MONO's data, not other LocalStorage keys.

## Financial and visual conventions

All amounts use INR formatting. Assumptions are kept separate from investment concepts and simulated data. No real fund names, historical returns, recommendations, authentication, server state or transactions are implemented. The initial 30/40/30 allocation is a demo-state fixture, not an allocation recommendation. The future-value helper uses month-end contributions and an illustrative nominal annual rate divided by 12; it is not exposed as a full planner yet.

Fonts are bundled locally via Fontsource. No external font request is needed at runtime. Sage uses dark foreground text; warning text uses a darker accessible tone while preserving the requested terracotta accent token. Motion is subtle and respects reduced-motion preferences. Navigation uses an accessible Radix Sheet on small screens.

## Validation and remaining work

Automated checks cover route rendering, primary navigation, mobile navigation keyboard dismissal, profile consistency, persistence, migration, corrupted/blocked storage, allocation invariants, keyboard slider input and financial helper edge cases. TypeScript strict checking and Vite production build are required before publication.

Full browser visual QA remains unverified because this environment's browser security check is unavailable. The UI must still be visually reviewed on target devices before the final hackathon demo.

The full onboarding wizard, option comparisons, matching engine, allocation planner, projections, crash replay, real holdings display and generated blueprint are intentionally **not implemented** in this foundation phase.

See [the complete file inventory](docs/FILES.md).

## Implementation references

The setup follows the official [shadcn Vite instructions](https://ui.shadcn.com/docs/installation/vite) and [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite). Components are local source files, ready to evolve with MONO.
