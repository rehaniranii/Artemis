import { ASSET_CLASSES, BAD_YEAR_SHOCK, INFLATION_RATE, RETURN_ASSUMPTIONS } from '@/data/assumptions';
import { findFund } from '@/data/funds';
import type {
  AssetClass, ContributionDecision, FinancialPlan, MarketScenario, MutualFund, PlanFund,
  PortfolioAllocation, ProjectionPoint, ProjectionResult, SimulatedHolding, UserProfile,
} from '@/types/financial';

/**
 * Conventions used everywhere: contributions at the end of each month, and a monthly
 * rate of annualReturn / 12. Returns may be negative (> -100%). Months are whole numbers.
 */
const MAX_MONTHS = 1200;
const monthly = (annualReturn: number) => annualReturn / 12;
const CLASSES = ASSET_CLASSES.map(c => c.id);

export const disposableIncome = (profile: Pick<UserProfile, 'monthlyIncome' | 'essentialExpenses'>) => Math.max(0, profile.monthlyIncome - profile.essentialExpenses);
export const goalProgress = (balance: number, goal: number) => goal > 0 ? Math.min(100, Math.max(0, balance * 100 / goal)) : 0;
export function validAllocation(allocation: PortfolioAllocation): boolean {
  const values = CLASSES.map(c => allocation[c]);
  return values.every(v => Number.isFinite(v) && v >= 0 && v <= 100) && Math.abs(values.reduce((a, b) => a + b, 0) - 100) < 0.0001;
}
/** Capacity is a monetary constraint, not a risk-tolerance recommendation. */
export function capacitySummary(profile: UserProfile) {
  return { available: disposableIncome(profile), committed: profile.monthlyInvestmentCapacity, remaining: Math.max(0, disposableIncome(profile) - profile.monthlyInvestmentCapacity) };
}

/** Value of monthly end-of-month contributions after `months` at `annualRate`. */
export function futureValue(monthlyAmount: number, annualRate: number, months: number): number {
  if (!Number.isFinite(monthlyAmount) || monthlyAmount < 0 || !Number.isFinite(annualRate) || annualRate <= -1 || !Number.isInteger(months) || months < 0 || months > MAX_MONTHS) throw new RangeError('Invalid projection inputs');
  const r = monthly(annualRate);
  return r === 0 ? monthlyAmount * months : monthlyAmount * Math.expm1(months * Math.log1p(r)) / r;
}

/** Starting balance plus monthly contributions. */
export function calculateFutureValue({ initial = 0, monthlyAmount, annualReturn, months }: { initial?: number; monthlyAmount: number; annualReturn: number; months: number }) {
  return initial * Math.pow(1 + monthly(annualReturn), months) + futureValue(monthlyAmount, annualReturn, months);
}

export function calculateSIP({ monthlyAmount, annualReturn, years }: { monthlyAmount: number; annualReturn: number; years: number }) {
  const months = Math.round(years * 12);
  const value = futureValue(monthlyAmount, annualReturn, months);
  const invested = monthlyAmount * months;
  return { invested, value, gain: value - invested };
}

/** Months until `goal` is reached, or null if not within 100 years. */
export function calculateGoalTimeline({ goal, monthlyAmount, annualReturn, initial = 0 }: { goal: number; monthlyAmount: number; annualReturn: number; initial?: number }): number | null {
  if (initial >= goal) return 0;
  const r = monthly(annualReturn);
  let value = initial;
  for (let month = 1; month <= MAX_MONTHS; month++) {
    value = value * (1 + r) + monthlyAmount;
    if (value >= goal) return month;
  }
  return null;
}

export const calculateInflationAdjustedValue = (value: number, years: number, rate = INFLATION_RATE) => value / Math.pow(1 + rate, years);

/** Weighted annual return for an allocation at the low, central or high assumption. */
export function blendedReturn(allocation: PortfolioAllocation, level: 'low' | 'mid' | 'high' = 'mid', rates: Record<AssetClass, number> = Object.fromEntries(CLASSES.map(c => [c, RETURN_ASSUMPTIONS[c][level]])) as Record<AssetClass, number>) {
  return CLASSES.reduce((sum, c) => sum + allocation[c] / 100 * rates[c], 0);
}

/** Full projection for a plan: central value with a low–high range and yearly points. */
export function projectPlan(plan: Pick<FinancialPlan, 'goal' | 'monthly' | 'years' | 'allocation'>, initial = 0): ProjectionResult {
  const months = Math.round(plan.years * 12);
  const annualReturn = blendedReturn(plan.allocation);
  const at = (rate: number, m: number) => calculateFutureValue({ initial, monthlyAmount: plan.monthly, annualReturn: rate, months: m });
  const points: ProjectionPoint[] = Array.from({ length: Math.floor(plan.years) + 1 }, (_, year) => ({ month: year * 12, contributed: initial + plan.monthly * year * 12, value: at(annualReturn, year * 12) }));
  const value = at(annualReturn, months);
  const contributed = initial + plan.monthly * months;
  return {
    contributed, value, gain: value - contributed, annualReturn, points,
    low: at(blendedReturn(plan.allocation, 'low'), months),
    high: at(blendedReturn(plan.allocation, 'high'), months),
    monthsToGoal: calculateGoalTimeline({ goal: plan.goal, monthlyAmount: plan.monthly, annualReturn, initial }),
  };
}

export interface AllocationRow { assetClass: AssetClass; percent: number; monthlyAmount: number; funds: { fund: MutualFund; percentOfTotal: number; monthlyAmount: number }[] }

/**
 * Splits a monthly amount across asset classes, then across chosen funds within each class.
 * A fund's weight is relative to funds of the same class, so fund amounts always add up to the
 * class amount and nothing is double-counted.
 */
export function calculatePortfolioAllocation(monthlyAmount: number, allocation: PortfolioAllocation, planFunds: PlanFund[]): AllocationRow[] {
  return CLASSES.map(assetClass => {
    const percent = allocation[assetClass];
    const members = planFunds.flatMap(pf => { const fund = findFund(pf.fundId); return fund && fund.assetClass === assetClass ? [{ fund, weight: Math.max(0, pf.weight) }] : []; });
    const totalWeight = members.reduce((sum, m) => sum + m.weight, 0);
    const funds = members.map(m => {
      const share = totalWeight > 0 ? m.weight / totalWeight : 1 / members.length;
      return { fund: m.fund, percentOfTotal: percent * share, monthlyAmount: monthlyAmount * percent / 100 * share };
    });
    return { assetClass, percent, monthlyAmount: monthlyAmount * percent / 100, funds };
  });
}

/** Sets one class and spreads the remainder over the others in proportion, keeping whole percents summing to 100. */
export function rebalanceAllocation(allocation: PortfolioAllocation, key: AssetClass, value: number): PortfolioAllocation {
  const target = Math.round(Math.min(100, Math.max(0, value)));
  const others = CLASSES.filter(c => c !== key);
  const remainder = 100 - target;
  const base = others.reduce((sum, c) => sum + allocation[c], 0);
  const raw = others.map(c => ({ c, v: base > 0 ? allocation[c] / base * remainder : remainder / others.length }));
  const floored = raw.map(r => ({ ...r, f: Math.floor(r.v) }));
  let left = remainder - floored.reduce((sum, r) => sum + r.f, 0);
  floored.sort((a, b) => (b.v - b.f) - (a.v - a.f)).forEach(r => { if (left > 0) { r.f += 1; left -= 1; } });
  const next = { ...allocation, [key]: target };
  floored.forEach(r => { next[r.c] = r.f; });
  return next;
}

/** Instant hypothetical bad year: per-class shocks weighted by the allocation. */
export function applyMarketShock(value: number, allocation: PortfolioAllocation, shock: Record<AssetClass, number> = BAD_YEAR_SHOCK) {
  const change = CLASSES.reduce((sum, c) => sum + allocation[c] / 100 * shock[c], 0);
  const after = value * (1 + change);
  return { before: value, after, loss: value - after, change };
}

export const contributionFor = (decision: ContributionDecision, base: number, month: number) =>
  decision === 'pause' ? (month <= 12 ? 0 : base) : decision === 'reduce' ? base / 2 : base;

/**
 * Deterministic path after a shock: each year uses the scenario's per-class returns
 * (then central assumptions), with contributions set by the decision.
 */
export function simulateMarketScenario({ startValue, monthlyAmount, allocation, scenario, months, decision = 'continue', goal }: {
  startValue: number; monthlyAmount: number; allocation: PortfolioAllocation; scenario: MarketScenario | null;
  months: number; decision?: ContributionDecision; goal?: number;
}) {
  const yearReturn = (yearIndex: number) => blendedReturn(allocation, 'mid', scenario?.years[yearIndex]);
  let value = startValue, contributed = 0, monthsToGoal: number | null = goal !== undefined && startValue >= goal ? 0 : null;
  const points: ProjectionPoint[] = [{ month: 0, contributed: 0, value }];
  const limit = goal !== undefined ? MAX_MONTHS : months;
  for (let month = 1; month <= limit; month++) {
    const add = contributionFor(decision, monthlyAmount, month);
    value = value * (1 + monthly(yearReturn(Math.floor((month - 1) / 12)))) + add;
    if (month <= months) { contributed += add; if (month % 12 === 0 || month === months) points.push({ month, contributed, value }); }
    if (goal !== undefined && monthsToGoal === null && value >= goal) monthsToGoal = month;
    if (month >= months && (goal === undefined || monthsToGoal !== null)) break;
  }
  const final = points[points.length - 1];
  return { points, value: final.value, contributed: final.contributed, monthsToGoal };
}

export function calculatePortfolioProgress(holdings: SimulatedHolding[], goal: number) {
  const value = holdings.reduce((sum, h) => sum + h.value, 0);
  const contributed = holdings.reduce((sum, h) => sum + h.contributed, 0);
  const gain = value - contributed;
  return { value, contributed, gain, gainPct: contributed > 0 ? gain * 100 / contributed : 0, progress: goalProgress(value, goal) };
}

/** "3 years 4 months" style duration. */
export function formatDuration(months: number | null) {
  if (months === null) return 'More than 100 years';
  if (months === 0) return 'Already reached';
  const y = Math.floor(months / 12), m = months % 12;
  return [y && `${y} ${y === 1 ? 'year' : 'years'}`, m && `${m} ${m === 1 ? 'month' : 'months'}`].filter(Boolean).join(' ');
}
