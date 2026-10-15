import type { AccessNeed, EmergencyStatus, FinancialState, OnboardingAnswers, RiskComfort, RiskProfile } from '@/types/financial';

export const LIMITS = {
  goal: { min: 10000, max: 1000000000 },
  income: { min: 100, max: 10000000 },
  horizon: { min: 1, max: 40 },
} as const;

/** Above this share of income, a contribution gets a gentle note rather than a block. */
export const HIGH_CONTRIBUTION_SHARE = 0.5;

export const GOAL_CHIPS = [500000, 1000000, 2500000, 5000000, 10000000];
export const HORIZON_CHIPS = [5, 10, 15];

export const riskComfortOptions: { value: RiskComfort; label: string; hint: string }[] = [
  { value: 'very-uncomfortable', label: 'I’d be very uncomfortable.', hint: 'Steadiness matters more to me than growth.' },
  { value: 'worried-but-wait', label: 'I’d be worried but could wait.', hint: 'It would sting, but I wouldn’t rush to sell.' },
  { value: 'understands', label: 'I understand this possibility.', hint: 'Ups and downs are part of investing for growth.' },
];

export const accessOptions: { value: AccessNeed; label: string; hint: string }[] = [
  { value: 'within-3-years', label: 'Yes, within 1–3 years.', hint: 'A course, a move, a big purchase.' },
  { value: 'within-5-years', label: 'Maybe within 3–5 years.', hint: 'Not sure yet, and that’s fine.' },
  { value: 'long-term', label: 'No, this is for a longer-term goal.', hint: 'I can leave it alone for a while.' },
];

export const emergencyOptions: { value: EmergencyStatus; label: string; hint: string }[] = [
  { value: 'yes', label: 'Yes.', hint: 'I could cover a few months of essentials.' },
  { value: 'a-little', label: 'A little.', hint: 'Enough for a small surprise.' },
  { value: 'not-yet', label: 'Not yet.', hint: 'I’m starting from zero here.' },
];

export const labelFor = <T extends string>(options: { value: T; label: string }[], value: T) =>
  options.find(option => option.value === value)?.label.replace(/\.$/, '') ?? '';

export const riskProfileCopy: Record<RiskProfile, { name: string; summary: string; explore: string }> = {
  conservative: {
    name: 'Conservative',
    summary: 'Keeping money steady and reachable matters most right now.',
    explore: 'We’ll start with the steadier ideas: how short-term money is kept safe, and why “safe” still has trade-offs.',
  },
  moderate: {
    name: 'Moderate',
    summary: 'You can live with some ups and downs in exchange for room to grow.',
    explore: 'We’ll start with balance: how steadier and growth-focused ideas can work side by side.',
  },
  growth: {
    name: 'Growth-oriented',
    summary: 'You have time and comfort to ride out bumpier stretches.',
    explore: 'We’ll start with long-term growth ideas, and be honest about how deep and long their dips can be.',
  },
};

const comfortScore: Record<RiskComfort, number> = { 'very-uncomfortable': 0, 'worried-but-wait': 1, understands: 2 };
const accessScore: Record<AccessNeed, number> = { 'within-3-years': 0, 'within-5-years': 1, 'long-term': 2 };
const profiles: RiskProfile[] = ['conservative', 'moderate', 'growth'];

/**
 * Educational profile from comfort with losses, time horizon and need for access.
 * The most cautious factor sets the tone: being comfortable with losses does not
 * make it sensible to take them on money needed soon. Age is deliberately not used.
 */
export function deriveRiskProfile(answers: Pick<OnboardingAnswers, 'riskComfort' | 'accessNeed' | 'horizonYears' | 'horizonFlexible'>): RiskProfile {
  const horizon = answers.horizonFlexible ? 1 : answers.horizonYears < 5 ? 0 : answers.horizonYears < 10 ? 1 : 2;
  return profiles[Math.min(comfortScore[answers.riskComfort], accessScore[answers.accessNeed], horizon)];
}

export function answersFromState(state: Pick<FinancialState, 'profile' | 'goal' | 'journey'>): OnboardingAnswers {
  return {
    goalAmount: state.goal.amount,
    monthlyIncome: state.profile.monthlyIncome,
    monthlyContribution: state.profile.monthlyInvestmentCapacity,
    horizonYears: state.profile.investmentHorizonYears,
    horizonFlexible: state.journey.horizonFlexible,
    riskComfort: state.journey.riskComfort,
    accessNeed: state.journey.accessNeed,
    emergencyStatus: state.journey.emergencyStatus,
  };
}

export const horizonLabel = (answers: Pick<OnboardingAnswers, 'horizonYears' | 'horizonFlexible'>) =>
  answers.horizonFlexible ? 'Flexible' : `${answers.horizonYears} ${answers.horizonYears === 1 ? 'year' : 'years'}`;

/** Indian-system words for large amounts, e.g. 1000000 → "10 lakh". */
export function amountInWords(value: number) {
  const trim = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
  if (value >= 10000000) return `${trim(value / 10000000)} crore`;
  if (value >= 100000) return `${trim(value / 100000)} lakh`;
  if (value >= 1000) return `${trim(value / 1000)} thousand`;
  return trim(value);
}

/** Returns a message when a step's answers can't be accepted yet, otherwise null. */
export function validateStep(step: number, answers: OnboardingAnswers): string | null {
  if (step === 1 && (answers.goalAmount < LIMITS.goal.min || answers.goalAmount > LIMITS.goal.max))
    return `Choose a goal between ₹10,000 and ₹100 crore.`;
  if (step === 2 && (answers.monthlyIncome < LIMITS.income.min || answers.monthlyIncome > LIMITS.income.max))
    return 'Enter the amount you usually receive each month (at least ₹100).';
  if (step === 3 && answers.monthlyContribution <= 0) return 'Set aside any amount above ₹0. Even ₹100 counts.';
  if (step === 3 && answers.monthlyContribution > answers.monthlyIncome)
    return 'This is more than you receive each month. Try a smaller amount.';
  if (step === 4 && !answers.horizonFlexible && (!Number.isInteger(answers.horizonYears) || answers.horizonYears < LIMITS.horizon.min || answers.horizonYears > LIMITS.horizon.max))
    return 'Choose a timeline between 1 and 40 years.';
  return null;
}
