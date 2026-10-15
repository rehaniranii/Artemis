import { ASSET_CLASSES } from '@/data/assumptions';
import { calculateGoalTimeline, calculatePortfolioAllocation, formatDuration, futureValue } from '@/lib/calculations';
import { formatINR } from '@/lib/format';
import type { FinancialPlan, JourneyAnswers, ProjectionResult } from '@/types/financial';

export interface Insight { tone: 'calm' | 'warning'; text: string }

/** Monthly amount needed to reach `goal` in `months` at `annualReturn`. */
export const requiredMonthly = (goal: number, annualReturn: number, months: number) => months > 0 ? goal / futureValue(1, annualReturn, months) : Infinity;

/** Plain-language observations about a plan, ordered by importance. */
export function planInsights(plan: FinancialPlan, projection: ProjectionResult, context: { income: number; journey: JourneyAnswers }): Insight[] {
  const out: Insight[] = [];
  const months = Math.round(plan.years * 12);
  const { monthsToGoal } = projection;
  if (monthsToGoal === null) out.push({ tone: 'warning', text: 'At this contribution level, the goal isn’t reached within 100 years under these assumptions. Even a small increase changes that picture.' });
  else if (monthsToGoal > months) {
    const needed = requiredMonthly(plan.goal, projection.annualReturn, months);
    out.push({ tone: 'warning', text: `Your preferred goal date may not be achievable with your current contribution level. Under these assumptions you’d need about ${formatINR(Math.ceil(needed / 100) * 100)} a month to reach it in ${plan.years} years — or about ${formatDuration(monthsToGoal)} at today’s amount.` });
  } else out.push({ tone: 'calm', text: `Under these assumptions, the goal could be reached in about ${formatDuration(monthsToGoal)} — within your ${plan.years}-year horizon. Real markets won’t follow a straight line.` });

  if (monthsToGoal !== null && monthsToGoal > 0) {
    const faster = calculateGoalTimeline({ goal: plan.goal, monthlyAmount: plan.monthly + 500, annualReturn: projection.annualReturn });
    if (faster !== null && faster < monthsToGoal) out.push({ tone: 'calm', text: `Increasing monthly contributions by ₹500 may shorten your goal timeline by about ${formatDuration(monthsToGoal - faster)} under the same assumptions.` });
  }
  if (plan.allocation.equity >= 60) out.push({ tone: 'warning', text: `${plan.allocation.equity}% in equity: growth-oriented investments can experience larger declines — sometimes 30% or more in a bad year.` });
  if (plan.allocation.stable + plan.allocation.debt >= 70) out.push({ tone: 'calm', text: 'Mostly steady investments: smaller swings, but growth may only modestly outpace inflation over long periods.' });
  if (context.journey.emergencyStatus === 'not-yet') out.push({ tone: 'warning', text: 'You don’t have emergency savings yet. Many people build an accessible cushion first, so a surprise doesn’t force them to sell investments.' });
  if (context.income > 0 && plan.monthly / context.income > 0.5) out.push({ tone: 'warning', text: 'This is more than half your monthly income. Plans with breathing room tend to last longer.' });

  const rows = calculatePortfolioAllocation(plan.monthly, plan.allocation, plan.funds);
  for (const row of rows) {
    const name = ASSET_CLASSES.find(c => c.id === row.assetClass)!.short;
    if (row.percent === 0 && row.funds.length) out.push({ tone: 'warning', text: `${row.funds.map(f => f.fund.name).join(', ')} won’t receive anything because ${name} is at 0% of your allocation.` });
  }
  return out;
}
