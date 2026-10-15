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
- `src/components/financial/InfoTooltip.tsx`
- `src/components/financial/InvestmentSlider.test.tsx`
- `src/components/financial/InvestmentSlider.tsx`
- `src/components/financial/MetricCard.tsx`
- `src/components/financial/ProgressRing.tsx`
- `src/components/financial/RiskBadge.tsx`
- `src/components/financial/RiskometerBadge.tsx`
- `src/components/financial/ScenarioBadge.tsx`
- `src/components/illustrations/index.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/DemoControls.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/RouteErrorBoundary.tsx`
- `src/components/shared/AnimatedNumber.tsx`
- `src/components/shared/Disclaimer.tsx`
- `src/components/shared/EmptyState.tsx`
- `src/components/shared/LoadingState.tsx`
- `src/components/shared/NextStep.tsx`
- `src/components/shared/PageHeader.tsx`
- `src/components/shared/Reveal.tsx`
- `src/components/shared/Tabs.tsx`
- `src/components/shared/Term.tsx`
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
- `src/data/glossary.ts`
- `src/data/investments.ts`
- `src/features/dashboard/PreferencesPanel.tsx`
- `src/features/explorer/CategoryExplorer.tsx`
- `src/features/explorer/CompareTray.tsx`
- `src/features/explorer/ExploreIntro.tsx`
- `src/features/explorer/ExploreNav.tsx`
- `src/features/explorer/InvestmentPanels.tsx`
- `src/features/explorer/module.ts`
- `src/features/explorer/useExplorerState.ts`
- `src/features/match/PlanToggle.tsx`
- `src/features/match/matching.ts`
- `src/features/onboarding/GoalVisual.tsx`
- `src/features/onboarding/OnboardingFlow.tsx`
- `src/features/onboarding/fields.tsx`
- `src/features/onboarding/journey.test.ts`
- `src/features/onboarding/journey.ts`
- `src/features/onboarding/steps.tsx`
- `src/features/plan/AllocationDonut.tsx`
- `src/features/plan/AssumptionsPanel.tsx`
- `src/features/plan/FutureTools.tsx`
- `src/features/plan/PlanBuilder.tsx`
- `src/features/plan/insights.ts`
- `src/features/reality/RealityChart.tsx`
- `src/features/story/FutureScenes.tsx`
- `src/features/story/Hero.tsx`
- `src/features/story/StoryScenes.tsx`
- `src/hooks/useAppMotion.ts`
- `src/hooks/useFinancialSummary.ts`
- `src/lib/calculations/calculations.test.ts`
- `src/lib/calculations/index.ts`
- `src/lib/format.ts`
- `src/lib/motion.ts`
- `src/lib/storage.test.ts`
- `src/lib/storage.ts`
- `src/lib/utils.ts`
- `src/main.tsx`
- `src/pages/BlueprintPage.tsx`
- `src/pages/DesignSystemPage.tsx`
- `src/pages/ExplorePage.test.tsx`
- `src/pages/ExplorePage.tsx`
- `src/pages/FundDetailPage.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/LandingPage.test.tsx`
- `src/pages/LandingPage.tsx`
- `src/pages/MatchPage.tsx`
- `src/pages/NotFoundPage.tsx`
- `src/pages/OnboardingPage.tsx`
- `src/pages/PlanPage.tsx`
- `src/pages/RealityLabPage.tsx`
- `src/pages/journey.test.tsx`
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
