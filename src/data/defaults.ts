import type { FinancialState, SimulatedHolding } from '@/types/financial';
import { APPROACHES } from './assumptions';

/**
 * FICTIONAL demo portfolio, kept separate from the plan.
 * Totals: ₹1,20,000 contributed, ₹1,42,500 current value.
 */
export const DEMO_HOLDINGS: SimulatedHolding[] = [
  { id: 'h-nifty', name: 'Kestrel Nifty 50 Index Fund', assetClass: 'equity', fundId: 'kestrel-nifty50', contributed: 48000, value: 60200 },
  { id: 'h-baf', name: 'Monsoon Balanced Advantage Fund', assetClass: 'equity', fundId: 'monsoon-baf', contributed: 30000, value: 36900 },
  { id: 'h-debt', name: 'Tidewater Short Duration Fund', assetClass: 'debt', fundId: 'tidewater-short-duration', contributed: 24000, value: 26100 },
  { id: 'h-gold', name: 'Tidewater Gold ETF Fund of Fund', assetClass: 'gold', fundId: 'tidewater-gold', contributed: 6000, value: 7300 },
  { id: 'h-fd', name: 'Bank fixed deposit', assetClass: 'stable', contributed: 12000, value: 12000 },
];

/** Aarav's demo persona. Not a recommended portfolio. */
export const createDefaultState = (): FinancialState => ({
  profile: { name: 'Aarav', age: 19, monthlyIncome: 8000, essentialExpenses: 6000, monthlyInvestmentCapacity: 2000, emergencySavings: 0, riskTolerance: 'moderate', investmentHorizonYears: 15 },
  goal: { name: 'My first ₹10 lakh', amount: 1000000, currency: 'INR' },
  approach: 'balanced',
  allocation: { ...APPROACHES.find(a => a.id === 'balanced')!.allocation },
  planFunds: [
    { fundId: 'kestrel-nifty50', weight: 60 },
    { fundId: 'monsoon-baf', weight: 40 },
    { fundId: 'tidewater-short-duration', weight: 50 },
    { fundId: 'kestrel-liquid', weight: 50 },
    { fundId: 'tidewater-gold', weight: 100 },
  ],
  scenario: 'slow-recovery',
  holdings: DEMO_HOLDINGS.map(h => ({ ...h })),
  savedBlueprint: null,
  preferences: { reducedMotion: false, calmMode: true },
  journey: { riskComfort: 'worried-but-wait', accessNeed: 'long-term', emergencyStatus: 'not-yet', horizonFlexible: false, riskProfile: 'moderate' },
  onboardingDraft: null, onboardingComplete: false,
});
