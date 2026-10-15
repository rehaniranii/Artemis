# MONO foundation file inventory

Created source, configuration, documentation and test files for this phase. The existing `.openai/hosting.json` is retained unchanged. Build output is generated in `dist/` and is not source-controlled.

## Project configuration

- `.gitignore`
- `README.md`
- `components.json`
- `index.html`
- `package-lock.json`
- `package.json`
- `tsconfig.app.json`
- `tsconfig.json`
- `tsconfig.node.json`
- `vite.config.ts`
- `vitest.config.ts`

## Application source

- `src/App.tsx`
- `src/components/charts/ProjectionChart.tsx`
- `src/components/financial/FinancialCard.tsx`
- `src/components/financial/InfoTooltip.tsx`
- `src/components/financial/InvestmentSlider.test.tsx`
- `src/components/financial/InvestmentSlider.tsx`
- `src/components/financial/MetricCard.tsx`
- `src/components/financial/ProgressRing.tsx`
- `src/components/financial/RiskBadge.tsx`
- `src/components/financial/ScenarioBadge.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/RouteErrorBoundary.tsx`
- `src/components/shared/AnimatedNumber.tsx`
- `src/components/shared/Disclaimer.tsx`
- `src/components/shared/EmptyState.tsx`
- `src/components/shared/LoadingState.tsx`
- `src/components/shared/ModulePlaceholder.tsx`
- `src/components/shared/PageHeader.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/slider.tsx`
- `src/components/ui/tooltip.tsx`
- `src/data/assumptions.ts`
- `src/data/defaults.ts`
- `src/data/funds.ts`
- `src/features/blueprint/module.ts`
- `src/features/dashboard/PreferencesPanel.tsx`
- `src/features/explorer/module.ts`
- `src/features/mono-match/module.ts`
- `src/features/explorer/ExploreIntro.tsx`
- `src/features/onboarding/GoalVisual.tsx`
- `src/features/onboarding/OnboardingFlow.tsx`
- `src/features/onboarding/fields.tsx`
- `src/features/onboarding/journey.ts`
- `src/features/onboarding/journey.test.ts`
- `src/features/onboarding/steps.tsx`
- `src/features/planner/module.ts`
- `src/features/reality-lab/ScenarioPicker.tsx`
- `src/features/simulator/module.ts`
- `src/hooks/useAppMotion.ts`
- `src/hooks/useFinancialSummary.ts`
- `src/lib/calculations/calculations.test.ts`
- `src/lib/calculations/index.ts`
- `src/lib/format.ts`
- `src/lib/storage.test.ts`
- `src/lib/storage.ts`
- `src/lib/utils.ts`
- `src/main.tsx`
- `src/pages/BlueprintPage.tsx`
- `src/pages/DesignSystemPage.tsx`
- `src/pages/ExplorePage.tsx`
- `src/pages/FundDetailPage.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/LandingPage.tsx`
- `src/pages/MonoMatchPage.tsx`
- `src/pages/NotFoundPage.tsx`
- `src/pages/OnboardingPage.tsx`
- `src/pages/PlanPage.tsx`
- `src/pages/RealityLabPage.tsx`
- `src/pages/SimulatorPage.tsx`
- `src/router.test.tsx`
- `src/router.tsx`
- `src/store/normalize.ts`
- `src/store/store.test.ts`
- `src/store/useFinancialStore.ts`
- `src/styles/globals.css`
- `src/test-setup.ts`
- `src/types/financial.ts`

## Assets and documentation

- `docs/FILES.md`
- `public/mono.svg`

## Existing hosting identity

- `.openai/hosting.json`

## Preserved original prototype

- `archive/honest-million-v4/dist/index.html`
- `archive/honest-million-v4/dist/style.css`
- `archive/honest-million-v4/dist/app.js`
- `archive/honest-million-v4/dist/motion.js`
- `archive/honest-million-v4/plan.cjs`

The old root `tests/plan.cjs` was relocated into this archive. New tests live beside the modules they cover.
