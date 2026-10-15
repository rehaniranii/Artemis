import { useMemo } from 'react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { calculatePortfolioProgress, projectPlan } from '@/lib/calculations';
import type { FinancialPlan } from '@/types/financial';

/** The current plan, assembled from the single store so every page projects from the same inputs. */
export function usePlan(): FinancialPlan {
  const goal = useFinancialStore(s => s.goal.amount);
  const monthly = useFinancialStore(s => s.profile.monthlyInvestmentCapacity);
  const years = useFinancialStore(s => s.profile.investmentHorizonYears);
  const approach = useFinancialStore(s => s.approach);
  const allocation = useFinancialStore(s => s.allocation);
  const funds = useFinancialStore(s => s.planFunds);
  return useMemo(() => ({ goal, monthly, years, approach, allocation, funds }), [goal, monthly, years, approach, allocation, funds]);
}

export function usePlanProjection() {
  const plan = usePlan();
  return { plan, projection: useMemo(() => projectPlan(plan), [plan]) };
}

/** The fictional demo portfolio, kept separate from the plan. */
export function usePortfolio() {
  const holdings = useFinancialStore(s => s.holdings);
  const goal = useFinancialStore(s => s.goal.amount);
  return { holdings, ...useMemo(() => calculatePortfolioProgress(holdings, goal), [holdings, goal]) };
}
