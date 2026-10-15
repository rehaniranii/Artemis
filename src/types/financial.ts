/** Central financial types for Morrow. All market figures in the app are illustrative or simulated. */

// ---------- Profile & onboarding ----------
export type RiskTolerance = 'low' | 'moderate' | 'high';
export type EvidenceKind = 'concept' | 'assumption' | 'simulation';
export interface UserProfile { name: string; age: number; monthlyIncome: number; essentialExpenses: number; monthlyInvestmentCapacity: number; emergencySavings: number; riskTolerance: RiskTolerance; investmentHorizonYears: number }
export interface FinancialGoal { name: string; amount: number; currency: 'INR' }
export interface UserPreferences { reducedMotion: boolean; calmMode: boolean }
export type RiskComfort = 'very-uncomfortable' | 'worried-but-wait' | 'understands';
export type AccessNeed = 'within-3-years' | 'within-5-years' | 'long-term';
export type EmergencyStatus = 'yes' | 'a-little' | 'not-yet';
/** Educational learning profile, not a regulated suitability assessment. */
export type RiskProfile = 'conservative' | 'moderate' | 'growth';
export interface JourneyAnswers { riskComfort: RiskComfort; accessNeed: AccessNeed; emergencyStatus: EmergencyStatus; horizonFlexible: boolean; riskProfile: RiskProfile }
export interface OnboardingAnswers { goalAmount: number; monthlyIncome: number; monthlyContribution: number; horizonYears: number; horizonFlexible: boolean; riskComfort: RiskComfort; accessNeed: AccessNeed; emergencyStatus: EmergencyStatus }
export interface OnboardingDraft { step: number; answers: OnboardingAnswers }

// ---------- Explorer (investment types) ----------
export type CategoryId = 'stability' | 'fixed-income' | 'growth' | 'diversification' | 'methods';
export interface InvestmentCategory { id: CategoryId; name: string; purpose: string; description: string }
export interface Investment {
  id: string;
  category: CategoryId;
  /** Methods (SIP, lump sum) describe how money goes in, so they are only compared with each other. */
  kind: 'asset' | 'method';
  name: string;
  shortName: string;
  tagline: string;
  analogy: string;
  detail: { what: string; how: string; returnSource: string; decline: string; access: string; lockIn: string; fees: string; goal: string };
  why: string[];
  catches: string[];
  compare: { returns: string; risk: string; liquidity: string; horizon: string; fees: string; limitations: string };
}

// ---------- Plan ----------
export type AssetClass = 'stable' | 'debt' | 'equity' | 'gold';
/** Percent of the monthly contribution per asset class; always sums to 100. */
export type PortfolioAllocation = Record<AssetClass, number>;
export type InvestmentApproach = 'steady' | 'balanced' | 'growth';
/** A fund chosen for the plan. Its weight is relative to other funds in the same asset class, so funds never double-count. */
export interface PlanFund { fundId: string; weight: number }
export interface FinancialPlan { goal: number; monthly: number; years: number; approach: InvestmentApproach; allocation: PortfolioAllocation; funds: PlanFund[] }
export interface ProjectionPoint { month: number; contributed: number; value: number }
export interface ProjectionResult {
  contributed: number; value: number; gain: number;
  /** Months to reach the goal at the central assumption; null if not within 100 years. */
  monthsToGoal: number | null;
  low: number; high: number; annualReturn: number;
  points: ProjectionPoint[];
}

// ---------- Mutual funds (fictional catalogue) ----------
/** SEBI riskometer levels. */
export type Riskometer = 'Low' | 'Low to Moderate' | 'Moderate' | 'Moderately High' | 'High' | 'Very High';
export type FundCategoryId = 'nifty50-index' | 'large-cap' | 'flexi-cap' | 'hybrid' | 'debt' | 'liquid' | 'mid-cap' | 'small-cap' | 'gold';
export interface FundCategory { id: FundCategoryId; name: string; assetClass: AssetClass; summary: string; considerations: string[]; drawbacks: string[] }
export interface MutualFund {
  id: string; name: string; category: FundCategoryId;
  /** Asset class the fund counts toward in a plan (hybrids count where most of their money sits). */
  assetClass: AssetClass;
  riskometer: Riskometer; expenseRatio: number; minSip: number; exitLoad: string;
  strategy: string; whyExplore: string[]; risks: string[]; liquidity: string;
  /** Simulated annualised returns. Not real performance. */
  simulatedReturns: { y1: number; y3: number; y5: number };
}
export interface FundComparisonRow { label: string; a: string; b: string }
export interface FundComparison { rows: FundComparisonRow[]; differences: string[] }
export interface FundMatch { category: FundCategory; reasons: string[]; cautions: string[] }

// ---------- Markets & simulation ----------
export type MarketScenarioId = 'fast-recovery' | 'slow-recovery' | 'prolonged-downturn';
export interface MarketScenario {
  id: MarketScenarioId; name: string; description: string;
  /** Annual returns per asset class for each year after the shock; later years use central assumptions. */
  years: Record<AssetClass, number>[];
}
export type ContributionDecision = 'continue' | 'pause' | 'reduce';

// ---------- Demo portfolio (separate from the plan) ----------
export interface SimulatedHolding { id: string; name: string; assetClass: AssetClass; fundId?: string; contributed: number; value: number }
export interface SavedBlueprint { savedAt: string; signature: string }

export interface FinancialState {
  profile: UserProfile; goal: FinancialGoal;
  approach: InvestmentApproach; allocation: PortfolioAllocation; planFunds: PlanFund[];
  scenario: MarketScenarioId; holdings: SimulatedHolding[]; savedBlueprint: SavedBlueprint | null;
  preferences: UserPreferences; journey: JourneyAnswers; onboardingDraft: OnboardingDraft | null; onboardingComplete: boolean;
}
