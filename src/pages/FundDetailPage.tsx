import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ThumbsUp, TriangleAlert } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Term } from '@/components/shared/Term';
import { RiskometerBadge } from '@/components/financial/RiskometerBadge';
import { ScenarioBadge } from '@/components/financial/ScenarioBadge';
import { Button } from '@/components/ui/button';
import { PlanToggle } from '@/features/match/PlanToggle';
import { findFund, fundCategoryById } from '@/data/funds';
import { formatINR } from '@/lib/format';
import { useFinancialStore } from '@/store/useFinancialStore';
import NotFoundPage from './NotFoundPage';

export default function FundDetailPage() {
  const { fundId } = useParams();
  const fund = findFund(fundId);
  const inPlan = useFinancialStore(s => s.planFunds.some(f => f.fundId === fundId));
  if (!fund) return <NotFoundPage />;
  const category = fundCategoryById[fund.category];
  const facts: [string, React.ReactNode][] = [
    ['Risk level', <RiskometerBadge level={fund.riskometer} />],
    ['Fees', <><Term id="expense-ratio" />: {fund.expenseRatio.toFixed(2)}% a year, taken from the fund’s <Term id="nav" /> daily.</>],
    ['Exit load', <><Term id="exit-load" />: {fund.exitLoad}.</>],
    ['Minimum investment', <>From {formatINR(fund.minSip)} a month via <Term id="sip" />.</>],
    ['Liquidity', fund.liquidity],
    ['Counts in your plan as', `${fund.assetClass.charAt(0).toUpperCase() + fund.assetClass.slice(1)}${fund.category === 'hybrid' ? ' (where most of this hybrid fund’s money sits)' : ''}`],
  ];
  return (
    <>
      <Link to="/explore/match?tab=funds" className="mb-8 inline-flex items-center gap-2 text-xs text-muted-foreground"><ArrowLeft size={14} />Back to funds</Link>
      <PageHeader eyebrow={`MORROW MATCH / ${category.name.toUpperCase()}`} title={fund.name} description={fund.strategy} />
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <ScenarioBadge kind="simulation" />
        <span className="text-xs text-muted-foreground">Fictional scheme for learning. Not a real fund.</span>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-3xl ink-card bg-card p-6 md:p-8">
            <h2 className="font-serif text-3xl">What the fund does</h2>
            <p className="mt-3 text-sm leading-relaxed">{category.summary} {fund.strategy}</p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium"><ThumbsUp size={15} className="text-plum" />Why someone might explore it</h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm">{[...fund.whyExplore, ...category.considerations].map(x => <li key={x}>{x}</li>)}</ul>
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium"><TriangleAlert size={15} className="text-warning" />What could go wrong</h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm">{[...fund.risks, ...category.drawbacks].map(x => <li key={x}>{x}</li>)}</ul>
              </div>
            </div>
          </section>
          <section className="rounded-3xl ink-card bg-card p-6 md:p-8">
            <h2 className="font-serif text-3xl">Simulated returns</h2>
            <dl className="mt-4 grid grid-cols-3 gap-4">{([['1 year', fund.simulatedReturns.y1], ['3 years', fund.simulatedReturns.y3], ['5 years', fund.simulatedReturns.y5]] as const).map(([label, v]) => <div key={label}><dt className="eyebrow">{label}</dt><dd className="mt-1 font-serif text-3xl">{v.toFixed(1)}%</dd></div>)}</dl>
            <p className="mt-4 text-xs text-muted-foreground">Annualised, simulated figures for a fictional fund. Not real performance. Past returns — real or simulated — don’t predict future ones.</p>
          </section>
        </div>
        <aside className="space-y-4">
          <dl className="divide-y rounded-3xl ink-card bg-card px-6">
            {facts.map(([label, value]) => <div key={label} className="py-4"><dt className="eyebrow">{label}</dt><dd className="mt-2 text-sm">{value}</dd></div>)}
          </dl>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="lg" className="rounded-full text-xs"><Link to={`/explore/match?tab=compare&a=${fund.id}`}>Compare Fund</Link></Button>
            <PlanToggle fundId={fund.id} size="lg" />
          </div>
          {inPlan && <Link to="/plan" className="flex items-center gap-1 text-xs underline underline-offset-4">See it in My Plan<ArrowUpRight size={13} /></Link>}
        </aside>
      </div>
    </>
  );
}
