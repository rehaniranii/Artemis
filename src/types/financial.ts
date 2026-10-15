export type RiskTolerance = 'low' | 'moderate' | 'high';
export type AssetBucket = 'safe' | 'steady' | 'growth';
export type ScenarioId = 'baseline' | 'market-decline' | 'slow-recovery';
export type EvidenceKind = 'concept' | 'assumption' | 'simulation';
export interface UserProfile { name: string; age: number; monthlyIncome: number; essentialExpenses: number; monthlyInvestmentCapacity: number; emergencySavings: number; riskTolerance: RiskTolerance; investmentHorizonYears: number }
export interface FinancialGoal { name: string; amount: number; currency: 'INR' }
export type PortfolioAllocation = Record<AssetBucket, number>;
export interface DemoHolding { id: string; bucket: AssetBucket; amount: number }
export interface UserPreferences { reducedMotion: boolean; calmMode: boolean }
export interface FinancialState { profile: UserProfile; goal: FinancialGoal; allocation: PortfolioAllocation; selectedFundIds: string[]; scenario: ScenarioId; holdings: DemoHolding[]; preferences: UserPreferences; onboardingComplete: boolean }
export interface FundConcept { id: string; name: string; bucket: AssetBucket; description: string; risk: RiskTolerance; evidence: EvidenceKind; example: boolean }
