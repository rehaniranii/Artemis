import type { AssetClass, InvestmentApproach, MarketScenario, PortfolioAllocation } from '@/types/financial';

/**
 * Illustrative annual return assumptions per asset class (after typical fund costs, before tax).
 * Not historical performance, product rates or forecasts. Every projection in Morrow uses these.
 */
export const RETURN_ASSUMPTIONS: Record<AssetClass, { low: number; mid: number; high: number }> = {
  stable: { low: 0.035, mid: 0.05, high: 0.06 },
  debt: { low: 0.045, mid: 0.065, high: 0.08 },
  equity: { low: 0.04, mid: 0.10, high: 0.13 },
  gold: { low: 0.02, mid: 0.07, high: 0.10 },
};

export const INFLATION_RATE = 0.05;

export const ASSET_CLASSES: { id: AssetClass; name: string; short: string; color: string }[] = [
  { id: 'stable', name: 'Stable savings / deposits', short: 'Stable', color: '#FFF5C7' },
  { id: 'debt', name: 'Debt investments', short: 'Debt', color: '#A8D5C2' },
  { id: 'equity', name: 'Equity mutual funds', short: 'Equity', color: '#4B3B63' },
  { id: 'gold', name: 'Gold', short: 'Gold', color: '#FFD95A' },
];

export const APPROACHES: { id: InvestmentApproach; name: string; description: string; allocation: PortfolioAllocation }[] = [
  { id: 'steady', name: 'Steady', description: 'Mostly deposits and debt. Smaller swings, slower growth.', allocation: { stable: 35, debt: 40, equity: 20, gold: 5 } },
  { id: 'balanced', name: 'Balanced', description: 'A mix of steadier and growth investments.', allocation: { stable: 15, debt: 30, equity: 45, gold: 10 } },
  { id: 'growth', name: 'Growth', description: 'Mostly equity. More room to grow, deeper dips.', allocation: { stable: 5, debt: 15, equity: 70, gold: 10 } },
];

/** One hypothetical bad year, applied instantly to the portfolio in Reality Lab. */
export const BAD_YEAR_SHOCK: Record<AssetClass, number> = { stable: 0, debt: -0.03, equity: -0.30, gold: 0.05 };

const y = (stable: number, debt: number, equity: number, gold: number) => ({ stable, debt, equity, gold });

/** Deterministic, hypothetical paths after the bad year. Recovery is never guaranteed. */
export const MARKET_SCENARIOS: MarketScenario[] = [
  { id: 'fast-recovery', name: 'Faster recovery', description: 'Markets bounce back within about two years.', years: [y(0.05, 0.08, 0.25, 0.02), y(0.05, 0.07, 0.14, 0.04)] },
  { id: 'slow-recovery', name: 'Slow recovery', description: 'Several flat years before growth returns.', years: [y(0.05, 0.06, 0, 0.06), y(0.05, 0.06, 0.03, 0.05), y(0.05, 0.065, 0.06, 0.04), y(0.05, 0.065, 0.08, 0.04)] },
  { id: 'prolonged-downturn', name: 'Prolonged downturn', description: 'Shares keep falling, then take years to climb back.', years: [y(0.05, 0.05, -0.12, 0.08), y(0.05, 0.05, -0.05, 0.06), y(0.05, 0.06, 0.02, 0.04), y(0.05, 0.06, 0.05, 0.03), y(0.05, 0.065, 0.07, 0.03)] },
];
