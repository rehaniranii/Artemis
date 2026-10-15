import { describe, it, expect } from 'vitest';
import { amountInWords, deriveRiskProfile, validateStep } from './journey';
import type { OnboardingAnswers } from '@/types/financial';
const aarav: OnboardingAnswers = { goalAmount: 1000000, monthlyIncome: 8000, monthlyContribution: 2000, horizonYears: 10, horizonFlexible: false, riskComfort: 'worried-but-wait', accessNeed: 'long-term', emergencyStatus: 'not-yet' };
describe('educational risk profile', () => {
  it('gives the demo persona a moderate profile', () => expect(deriveRiskProfile(aarav)).toBe('moderate'));
  it('is growth-oriented only when comfort, horizon and access all allow it', () => {
    expect(deriveRiskProfile({ ...aarav, riskComfort: 'understands' })).toBe('growth');
    expect(deriveRiskProfile({ ...aarav, riskComfort: 'understands', horizonYears: 5 })).toBe('moderate');
    expect(deriveRiskProfile({ ...aarav, riskComfort: 'understands', horizonFlexible: true })).toBe('moderate');
  });
  it('lets the most cautious answer set the tone', () => {
    expect(deriveRiskProfile({ ...aarav, riskComfort: 'understands', accessNeed: 'within-3-years', horizonYears: 15 })).toBe('conservative');
    expect(deriveRiskProfile({ ...aarav, riskComfort: 'very-uncomfortable', horizonYears: 30 })).toBe('conservative');
    expect(deriveRiskProfile({ ...aarav, riskComfort: 'understands', horizonYears: 3 })).toBe('conservative');
  });
});
describe('step validation', () => {
  it('accepts the demo answers on every step', () => [1, 2, 3, 4, 5, 6, 7].forEach(step => expect(validateStep(step, aarav)).toBeNull()));
  it('rejects goals, incomes and timelines out of range', () => {
    expect(validateStep(1, { ...aarav, goalAmount: 500 })).toMatch(/between/);
    expect(validateStep(2, { ...aarav, monthlyIncome: 0 })).toMatch(/each month/);
    expect(validateStep(4, { ...aarav, horizonYears: 0 })).toMatch(/1 and 40/);
    expect(validateStep(4, { ...aarav, horizonYears: 0, horizonFlexible: true })).toBeNull();
  });
  it('requires a contribution within income', () => {
    expect(validateStep(3, { ...aarav, monthlyContribution: 0 })).not.toBeNull();
    expect(validateStep(3, { ...aarav, monthlyContribution: 9000 })).toMatch(/more than you receive/);
  });
  it('describes amounts in lakh and crore', () => {
    expect(amountInWords(1000000)).toBe('10 lakh');
    expect(amountInWords(25000000)).toBe('2.5 crore');
  });
});
