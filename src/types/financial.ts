export type RiskTolerance = 'low' | 'moderate' | 'high';
export type AssetBucket = 'safe' | 'steady' | 'growth';
export type ScenarioId = 'baseline' | 'market-decline' | 'slow-recovery';
export type EvidenceKind = 'concept' | 'assumption' | 'simulation';
export interface UserProfile { name: string; age: number; monthlyIncome: number; essentialExpenses: number; monthlyInvestmentCapacity: number; emergencySavings: number; riskTolerance: RiskTolerance; investmentHorizonYears: number }
export interface FinancialGoal { name: string; amount: number; currency: 'INR' }
export type PortfolioAllocation = Record<AssetBucket, number>;
export interface DemoHolding { id: string; bucket: AssetBucket; amount: number }
export interface UserPreferences { reducedMotion: boolean; calmMode: boolean }
export type RiskComfort = 'very-uncomfortable' | 'worried-but-wait' | 'understands';
export type AccessNeed = 'within-3-years' | 'within-5-years' | 'long-term';
export type EmergencyStatus = 'yes' | 'a-little' | 'not-yet';
/** Educational learning profile, not a regulated suitability assessment. */
export type RiskProfile = 'conservative' | 'moderate' | 'growth';
export interface JourneyAnswers { riskComfort: RiskComfort; accessNeed: AccessNeed; emergencyStatus: EmergencyStatus; horizonFlexible: boolean; riskProfile: RiskProfile }
export interface OnboardingAnswers { goalAmount: number; monthlyIncome: number; monthlyContribution: number; horizonYears: number; horizonFlexible: boolean; riskComfort: RiskComfort; accessNeed: AccessNeed; emergencyStatus: EmergencyStatus }
export interface OnboardingDraft { step: number; answers: OnboardingAnswers }
export interface FinancialState { profile: UserProfile; goal: FinancialGoal; allocation: PortfolioAllocation; selectedFundIds: string[]; scenario: ScenarioId; holdings: DemoHolding[]; preferences: UserPreferences; journey: JourneyAnswers; onboardingDraft: OnboardingDraft | null; onboardingComplete: boolean }
export interface FundConcept { id: string; name: string; bucket: AssetBucket; description: string; risk: RiskTolerance; evidence: EvidenceKind; example: boolean }
