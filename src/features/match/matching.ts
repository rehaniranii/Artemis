import { fundCategoryById } from '@/data/funds';
import { formatINR } from '@/lib/format';
import type { FinancialState, FundCategoryId, FundComparison, FundMatch, MutualFund } from '@/types/financial';

type MatchInput = Pick<FinancialState, 'journey'> & { years: number; monthly: number };

/**
 * Simple, transparent rules that pick up to three fund categories worth *learning about*.
 * Educational only — not personalised advice or a suitability assessment.
 */
export function matchFundCategories({ journey, years, monthly }: MatchInput): FundMatch[] {
  const picks: { id: FundCategoryId; reasons: string[]; cautions: string[] }[] = [];
  const add = (id: FundCategoryId, reason: string, caution?: string) => {
    const existing = picks.find(p => p.id === id);
    if (existing) { existing.reasons.push(reason); if (caution) existing.cautions.push(caution); return; }
    picks.push({ id, reasons: [reason], cautions: caution ? [caution] : [] });
  };
  const shortTerm = journey.accessNeed === 'within-3-years' || (!journey.horizonFlexible && years < 5);
  const mediumTerm = journey.accessNeed === 'within-5-years' || (!journey.horizonFlexible && years < 7);

  if (journey.emergencyStatus !== 'yes')
    add('liquid', journey.emergencyStatus === 'not-yet'
      ? 'You don’t have emergency savings yet. Liquid funds are one common place people keep money they may need quickly.'
      : 'You have a little set aside for emergencies. Liquid funds are one way people build that cushion while keeping access.',
      'A bank savings account or FD may suit an emergency fund just as well — and bank deposits are insured.');

  if (shortTerm) {
    add('debt', 'You may need this money within a few years, which leaves little time to recover from a fall in shares.');
    add('liquid', 'Money needed soon is often kept where values move very little.');
  } else if (journey.riskProfile === 'conservative' || mediumTerm) {
    add('debt', journey.riskProfile === 'conservative' ? 'You told us steadiness matters most to you. Debt funds usually move less than equity.' : 'Your timeline is medium-term, where steadier investments often play a bigger role.');
    add('hybrid', 'Hybrid funds mix shares and bonds, offering some growth with a smoother ride than pure equity.', 'They still fall when share markets fall.');
  } else {
    add('nifty50-index', `Your goal is about ${years} years away and you indicated you can tolerate some market fluctuations. A low-cost index fund is a common, simple way to own a broad slice of the market.`);
    if (journey.riskProfile === 'growth') {
      add('flexi-cap', 'You’re comfortable with ups and downs and have time on your side. Flexi cap funds spread money across company sizes.');
      if (years >= 10 && journey.emergencyStatus === 'yes') add('mid-cap', 'With a long horizon and an emergency cushion, some people explore mid-sized companies for extra growth potential.', 'Mid caps can fall much further than large caps, and stay down for years.');
    } else {
      add('hybrid', 'You can wait through some worry. Hybrid funds balance shares with bonds, so dips tend to be gentler.', 'The trade-off is usually less growth in strong markets.');
      add('large-cap', 'Large cap funds focus on established companies, which tend to swing less than smaller ones.');
    }
  }

  if (monthly > 0 && monthly < 500) picks.forEach(p => p.cautions.push(`At ${formatINR(monthly)} a month, check minimum SIP amounts — many funds start at ₹500, some at ₹100.`));

  return picks.slice(0, 3).map(p => {
    const category = fundCategoryById[p.id];
    return { category, reasons: p.reasons, cautions: [...p.cautions, ...category.drawbacks] };
  });
}

const pct = (n: number) => `${n.toFixed(2)}%`;
const riskOrder = ['Low', 'Low to Moderate', 'Moderate', 'Moderately High', 'High', 'Very High'];

/** Side-by-side rows plus plain-language differences. Never declares a winner. */
export function compareFunds(a: MutualFund, b: MutualFund): FundComparison {
  const ca = fundCategoryById[a.category], cb = fundCategoryById[b.category];
  const rows = [
    { label: 'Category', a: ca.name, b: cb.name },
    { label: 'Risk (SEBI riskometer)', a: a.riskometer, b: b.riskometer },
    { label: 'Expense ratio', a: pct(a.expenseRatio), b: pct(b.expenseRatio) },
    { label: 'Minimum SIP', a: formatINR(a.minSip), b: formatINR(b.minSip) },
    { label: 'Exit load', a: a.exitLoad, b: b.exitLoad },
    { label: 'Investment strategy', a: a.strategy, b: b.strategy },
    { label: 'Liquidity', a: a.liquidity, b: b.liquidity },
    { label: 'Important limitations', a: a.risks.join(' '), b: b.risks.join(' ') },
  ];
  const differences: string[] = [];
  if (a.category === b.category) differences.push(`Both are ${ca.name.toLowerCase()}, so they aim to do a similar job. Differences in cost and rules matter more here than strategy.`);
  else differences.push(`These do different jobs: ${ca.summary.charAt(0).toLowerCase() + ca.summary.slice(1)} The other: ${cb.summary.charAt(0).toLowerCase() + cb.summary.slice(1)}`);
  const ra = riskOrder.indexOf(a.riskometer), rb = riskOrder.indexOf(b.riskometer);
  if (ra !== rb) { const [hi, lo] = ra > rb ? [a, b] : [b, a]; differences.push(`${hi.name} sits higher on the riskometer (${hi.riskometer} vs ${lo.riskometer}), so expect bigger swings in value.`); }
  const feeGap = Math.abs(a.expenseRatio - b.expenseRatio);
  if (feeGap >= 0.05) { const hi = a.expenseRatio > b.expenseRatio ? a : b; differences.push(`${hi.name} costs ${pct(feeGap)} more a year — about ${formatINR(feeGap / 100 * 100000)} a year on every ₹1 lakh invested, compounding over time. Higher fees aren’t a problem by themselves, but they need to be earned.`); }
  if (a.minSip !== b.minSip) differences.push(`You can start ${a.minSip < b.minSip ? a.name : b.name} with a smaller monthly amount (${formatINR(Math.min(a.minSip, b.minSip))}).`);
  if (a.exitLoad !== b.exitLoad) differences.push('Their exit loads differ — check how soon you might want to withdraw.');
  if (a.assetClass !== b.assetClass) differences.push(`In your plan they’d count toward different asset classes (${a.assetClass} vs ${b.assetClass}).`);
  return { rows, differences };
}
