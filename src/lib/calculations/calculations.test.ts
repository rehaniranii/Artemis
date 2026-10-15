import { describe, it, expect } from 'vitest';
import {
  applyMarketShock, blendedReturn, calculateFutureValue, calculateGoalTimeline, calculateInflationAdjustedValue,
  calculatePortfolioAllocation, calculatePortfolioProgress, calculateSIP, capacitySummary, futureValue, goalProgress,
  projectPlan, rebalanceAllocation, simulateMarketScenario, validAllocation,
} from './index';
import { createDefaultState, DEMO_HOLDINGS } from '@/data/defaults';
import { MARKET_SCENARIOS } from '@/data/assumptions';

const manual = (monthly: number, annual: number, months: number, initial = 0) => { let v = initial; for (let i = 0; i < months; i++) v = v * (1 + annual / 12) + monthly; return v; };
const balanced = { stable: 15, debt: 30, equity: 45, gold: 10 };

describe('core calculations', () => {
  it('handles zero, positive and negative returns with month-end contributions', () => {
    expect(futureValue(2000, 0, 12)).toBe(24000);
    expect(futureValue(2000, 0.06, 12)).toBeCloseTo(manual(2000, 0.06, 12), 6);
    expect(futureValue(2000, -0.1, 24)).toBeCloseTo(manual(2000, -0.1, 24), 6);
    expect(futureValue(2000, -0.1, 24)).toBeLessThan(48000);
    expect(futureValue(2000, 0.06, 0)).toBe(0);
  });
  it('rejects invalid projection inputs instead of inventing results', () => {
    expect(() => futureValue(-1, 0.06, 12)).toThrow();
    expect(() => futureValue(1000, NaN, 12)).toThrow();
    expect(() => futureValue(1000, 0.05, 1.5)).toThrow();
    expect(() => futureValue(1000, -1, 12)).toThrow();
  });
  it('supports a starting balance and zero contributions', () => {
    expect(calculateFutureValue({ initial: 100000, monthlyAmount: 0, annualReturn: 0.12, months: 12 })).toBeCloseTo(100000 * Math.pow(1.01, 12), 6);
    expect(calculateFutureValue({ initial: 5000, monthlyAmount: 1000, annualReturn: 0.08, months: 60 })).toBeCloseTo(manual(1000, 0.08, 60, 5000), 6);
  });
  it('calculates SIP totals consistently', () => {
    const sip = calculateSIP({ monthlyAmount: 2000, annualReturn: 0.1, years: 15 });
    expect(sip.invested).toBe(360000);
    expect(sip.value).toBeCloseTo(futureValue(2000, 0.1, 180), 6);
    expect(sip.gain).toBeCloseTo(sip.value - 360000, 6);
  });
  it('finds the goal timeline, matching the future-value formula', () => {
    const months = calculateGoalTimeline({ goal: 1000000, monthlyAmount: 2000, annualReturn: 0.1 })!;
    expect(futureValue(2000, 0.1, months)).toBeGreaterThanOrEqual(1000000);
    expect(futureValue(2000, 0.1, months - 1)).toBeLessThan(1000000);
    expect(calculateGoalTimeline({ goal: 1000000, monthlyAmount: 0, annualReturn: 0.1 })).toBeNull();
    expect(calculateGoalTimeline({ goal: 1000, monthlyAmount: 0, annualReturn: 0, initial: 5000 })).toBe(0);
  });
  it('adjusts for inflation', () => {
    expect(calculateInflationAdjustedValue(105000, 1, 0.05)).toBeCloseTo(100000, 6);
    expect(calculateInflationAdjustedValue(100000, 0)).toBe(100000);
  });
});

describe('allocation', () => {
  it('requires four finite, non-negative classes totalling 100%', () => {
    expect(validAllocation(balanced)).toBe(true);
    expect(validAllocation({ ...balanced, equity: 50 })).toBe(false);
    expect(validAllocation({ ...balanced, stable: -5, equity: 65 })).toBe(false);
  });
  it('rebalances to whole percents that always total 100', () => {
    for (const v of [0, 7, 33, 61, 100]) {
      const next = rebalanceAllocation(balanced, 'equity', v);
      expect(next.equity).toBe(v);
      expect(validAllocation(next)).toBe(true);
      expect(Object.values(next).every(Number.isInteger)).toBe(true);
    }
    expect(rebalanceAllocation({ stable: 0, debt: 0, equity: 100, gold: 0 }, 'equity', 40)).toEqual({ stable: 20, debt: 20, equity: 40, gold: 20 });
  });
  it('splits money across classes and funds without double counting', () => {
    const rows = calculatePortfolioAllocation(2000, balanced, createDefaultState().planFunds);
    expect(rows.reduce((s, r) => s + r.monthlyAmount, 0)).toBeCloseTo(2000, 6);
    const equity = rows.find(r => r.assetClass === 'equity')!;
    expect(equity.funds.reduce((s, f) => s + f.monthlyAmount, 0)).toBeCloseTo(equity.monthlyAmount, 6);
    expect(equity.funds.map(f => Math.round(f.percentOfTotal))).toEqual([27, 18]);
    expect(rows.find(r => r.assetClass === 'stable')!.funds).toEqual([]);
  });
  it('blends returns by weight', () => {
    expect(blendedReturn({ stable: 100, debt: 0, equity: 0, gold: 0 })).toBeCloseTo(0.05, 10);
    expect(blendedReturn({ stable: 0, debt: 0, equity: 100, gold: 0 }, 'low')).toBeCloseTo(0.04, 10);
  });
});

describe('plan projection and scenarios', () => {
  it('projects the demo plan with a low ≤ central ≤ high range', () => {
    const p = projectPlan({ goal: 1000000, monthly: 2000, years: 15, allocation: balanced });
    expect(p.contributed).toBe(360000);
    expect(p.value).toBeCloseTo(futureValue(2000, blendedReturn(balanced), 180), 6);
    expect(p.low).toBeLessThan(p.value);
    expect(p.high).toBeGreaterThan(p.value);
    expect(p.points).toHaveLength(16);
    expect(p.points[15].value).toBeCloseTo(p.value, 6);
  });
  it('applies a bad year according to the allocation', () => {
    const shock = applyMarketShock(100000, balanced);
    expect(shock.change).toBeCloseTo(0.3 * -0.03 + 0.45 * -0.3 + 0.1 * 0.05, 10);
    expect(shock.before - shock.after).toBeCloseTo(shock.loss, 6);
    expect(applyMarketShock(100000, { stable: 100, debt: 0, equity: 0, gold: 0 }).loss).toBe(0);
  });
  it('simulates deterministic scenarios and contribution decisions', () => {
    const args = { startValue: 100000, monthlyAmount: 2000, allocation: balanced, months: 60, goal: 1000000 };
    const fast = simulateMarketScenario({ ...args, scenario: MARKET_SCENARIOS[0] });
    const slow = simulateMarketScenario({ ...args, scenario: MARKET_SCENARIOS[1] });
    const prolonged = simulateMarketScenario({ ...args, scenario: MARKET_SCENARIOS[2] });
    expect(fast.value).toBeGreaterThan(slow.value);
    expect(slow.value).toBeGreaterThan(prolonged.value);
    expect(simulateMarketScenario({ ...args, scenario: MARKET_SCENARIOS[1] }).value).toBe(slow.value);
    expect(fast.contributed).toBe(120000);
    expect(simulateMarketScenario({ ...args, scenario: MARKET_SCENARIOS[0], decision: 'pause' }).contributed).toBe(96000);
    expect(simulateMarketScenario({ ...args, scenario: MARKET_SCENARIOS[0], decision: 'reduce' }).contributed).toBe(60000);
    expect(prolonged.monthsToGoal!).toBeGreaterThan(fast.monthsToGoal!);
    // With no scenario, the path equals the plain projection.
    expect(simulateMarketScenario({ ...args, scenario: null }).value).toBeCloseTo(calculateFutureValue({ initial: 100000, monthlyAmount: 2000, annualReturn: blendedReturn(balanced), months: 60 }), 6);
  });
});

describe('portfolio', () => {
  it('summarises the fictional demo portfolio', () => {
    const demo = calculatePortfolioProgress(DEMO_HOLDINGS, 1000000);
    expect(demo).toMatchObject({ value: 142500, contributed: 120000, gain: 22500 });
    expect(demo.gainPct).toBeCloseTo(18.75, 10);
    expect(demo.progress).toBeCloseTo(14.25, 10);
    expect(calculatePortfolioProgress([], 1000000).progress).toBe(0);
  });
  it('derives capacity and progress without duplicate stored totals', () => {
    expect(capacitySummary(createDefaultState().profile)).toEqual({ available: 2000, committed: 2000, remaining: 0 });
    expect(goalProgress(250000, 1000000)).toBe(25);
    expect(goalProgress(100, 0)).toBe(0);
  });
});
