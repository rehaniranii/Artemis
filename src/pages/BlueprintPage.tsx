import { Link } from 'react-router-dom';
import { Pencil, Printer, Save } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { RiskometerBadge } from '@/components/financial/RiskometerBadge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/shared/Reveal';
import { Coin, Sparkle, Sprout } from '@/components/illustrations';
import { APPROACHES, ASSET_CLASSES } from '@/data/assumptions';
import { AssumptionsPanel } from '@/features/plan/AssumptionsPanel';
import { planInsights } from '@/features/plan/insights';
import { riskProfileCopy } from '@/features/onboarding/journey';
import { calculatePortfolioAllocation, formatDuration } from '@/lib/calculations';
import { formatINR } from '@/lib/format';
import { usePlanProjection } from '@/hooks/useFinancialSummary';
import { useFinancialStore } from '@/store/useFinancialStore';

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="break-inside-avoid border-t-2 border-ink py-8 sm:grid sm:grid-cols-[260px_1fr] sm:gap-10">
      <h2 className="mb-4 flex items-baseline gap-3 sm:mb-0"><span className="display text-5xl text-plum">{String(n).padStart(2, '0')}</span><span className="font-serif text-2xl">{title}</span></h2>
      <div className="text-sm leading-relaxed">{children}</div>
    </Reveal>
  );
}

export default function BlueprintPage() {
  const { plan, projection } = usePlanProjection();
  const profile = useFinancialStore(s => s.profile);
  const journey = useFinancialStore(s => s.journey);
  const saved = useFinancialStore(s => s.savedBlueprint), saveBlueprint = useFinancialStore(s => s.saveBlueprint);
  const rows = calculatePortfolioAllocation(plan.monthly, plan.allocation, plan.funds);
  const funds = rows.flatMap(r => r.funds);
  const approach = APPROACHES.find(a => a.id === plan.approach)!;
  const edited = ASSET_CLASSES.some(c => approach.allocation[c.id] !== plan.allocation[c.id]);
  const signature = JSON.stringify({ plan, journey, income: profile.monthlyIncome });
  const insights = planInsights(plan, projection, { income: profile.monthlyIncome, journey });

  const risks = [
    plan.allocation.equity > 0 && `${plan.allocation.equity}% in equity can fall sharply — a bad year could take 30% or more off that part.`,
    plan.allocation.debt > 0 && 'Debt investments can lose value when interest rates rise or a borrower defaults.',
    plan.allocation.gold > 0 && 'Gold earns no income and can stay flat for years.',
    plan.allocation.stable > 0 && 'Deposits are steady, but may barely keep pace with inflation.',
    journey.accessNeed !== 'long-term' && 'You may need some of this money within a few years — less time to recover from a fall.',
    journey.emergencyStatus !== 'yes' && 'Without enough emergency savings, a surprise expense could force you to sell at a bad time.',
    ...funds.filter(f => f.fund.riskometer === 'Very High').slice(0, 2).map(f => `${f.fund.name} is rated “Very High” on the riskometer.`),
  ].filter(Boolean) as string[];

  const nextSteps = [
    journey.emergencyStatus !== 'yes' && { text: 'Build an emergency cushion you can reach quickly.', to: '/explore?category=stability' },
    { text: 'Feel how your plan handles a bad year.', to: '/reality-lab' },
    rows.some(r => r.assetClass !== 'stable' && r.percent > 0 && r.funds.length === 0) ? { text: 'Explore example funds for the asset classes without one.', to: '/explore/match' } : { text: 'Compare your chosen funds side by side.', to: '/explore/match?tab=compare' },
    { text: 'Learn what expense ratios and exit loads cost you.', to: '/explore' },
  ].filter(Boolean) as { text: string; to: string }[];

  return (
    <>
      <PageHeader eyebrow={`FINANCIAL BLUEPRINT / ${profile.name.toUpperCase()}`} title="Your Financial Blueprint" description="Everything in your plan, on one page — generated from your current plan and answers." />
      <div className="mb-6 flex flex-wrap items-center gap-2 print:hidden">
        <Button asChild variant="outline" className="rounded-full text-xs"><Link to="/plan"><Pencil size={13} />Edit My Plan</Link></Button>
        <Button type="button" variant="outline" className="rounded-full text-xs" onClick={() => saveBlueprint(signature)}><Save size={13} />Save Blueprint</Button>
        <Button type="button" className="rounded-full text-xs" onClick={() => window.print()}><Printer size={13} />Print / Export</Button>
        <p role="status" className="text-xs text-muted-foreground">{saved ? `Saved ${new Date(saved.savedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}${saved.signature !== signature ? ' · your plan has changed since then' : ' · up to date'}` : 'Not saved yet.'}</p>
      </div>

      <header className="relative mb-0 overflow-hidden rounded-t-[32px] ink-outline border-b-0 bg-sun px-6 py-10 md:px-10 print:rounded-none print:border-0 print:bg-white print:px-0">
        <p className="eyebrow text-ink">Prepared for {profile.name} · {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
        <p className="display mt-4 max-w-3xl text-5xl md:text-7xl">{formatINR(plan.goal)} in {plan.years} years, one month at a time.</p>
        <div aria-hidden="true" className="pointer-events-none absolute -right-4 bottom-0 hidden w-48 md:block print:hidden"><Sprout className="absolute bottom-0 right-6 w-24" /><Coin className="float-slow absolute bottom-24 right-28 w-16" /><Sparkle className="absolute bottom-40 right-4 w-10" /></div>
      </header>
      <article className="rounded-b-[32px] ink-card bg-card px-6 pb-2 md:px-10 print:border-0 print:px-0">
        <Block n={1} title="Financial goal"><p className="display text-5xl">{formatINR(plan.goal)}</p></Block>
        <Block n={2} title="Monthly contribution"><p className="display text-5xl">{formatINR(plan.monthly)}</p><p className="text-muted-foreground">of {formatINR(profile.monthlyIncome)} monthly income</p></Block>
        <Block n={3} title="Investment horizon"><p className="display text-5xl">{plan.years} years</p>{journey.horizonFlexible && <p className="text-muted-foreground">You said you’re flexible; this is a working assumption.</p>}</Block>
        <Block n={4} title="Investment approach"><p><strong className="font-medium">{approach.name}{edited && ' (customised)'}</strong> — {approach.description}</p><p className="mt-1 text-muted-foreground">Learning profile: {riskProfileCopy[journey.riskProfile].name}. {riskProfileCopy[journey.riskProfile].summary}</p></Block>
        <Block n={5} title="Asset allocation">
          <div className="mb-3 flex h-3 overflow-hidden rounded-full" aria-hidden="true">{ASSET_CLASSES.map(c => <span key={c.id} style={{ width: `${plan.allocation[c.id]}%`, background: c.color }} />)}</div>
          <table className="w-full text-left"><tbody>{rows.map(r => <tr key={r.assetClass} className="border-t"><th scope="row" className="py-1.5 font-normal">{ASSET_CLASSES.find(c => c.id === r.assetClass)!.name}</th><td className="py-1.5 tabular-nums">{r.percent}%</td><td className="py-1.5 tabular-nums">{formatINR(r.monthlyAmount)}/mo</td></tr>)}</tbody></table>
        </Block>
        <Block n={6} title="Selected mutual funds">
          {funds.length === 0 ? <p className="text-muted-foreground">No funds selected yet. <Link to="/explore/match" className="underline">Explore Morrow Match</Link>.</p> : (
            <ul className="space-y-3">{funds.map(f => <li key={f.fund.id} className="flex flex-wrap items-center justify-between gap-2"><span><span className="font-medium">{f.fund.name}</span><span className="block text-xs text-muted-foreground">{f.percentOfTotal.toFixed(1)}% of plan · {formatINR(f.monthlyAmount)}/mo · expense ratio {f.fund.expenseRatio.toFixed(2)}%</span></span><RiskometerBadge level={f.fund.riskometer} /></li>)}</ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">Fictional example schemes, for learning.</p>
        </Block>
        <Block n={7} title="Possible future value">
          <p className="display text-5xl">{formatINR(projection.value)}</p>
          <p className="text-muted-foreground">Range {formatINR(projection.low)} – {formatINR(projection.high)} · {formatINR(projection.contributed)} contributed · goal in about {formatDuration(projection.monthsToGoal)}</p>
          <p className="mt-2">{insights[0]?.text}</p>
        </Block>
        <Block n={8} title="Important risks"><ul className="list-disc space-y-1.5 pl-5">{risks.map(r => <li key={r}>{r}</li>)}</ul></Block>
        <Block n={9} title="Financial assumptions"><AssumptionsPanel open /></Block>
        <Block n={10} title="Suggested next steps"><ol className="list-decimal space-y-1.5 pl-5">{nextSteps.map(s => <li key={s.text}><Link to={s.to} className="underline-offset-4 hover:underline">{s.text}</Link></li>)}</ol></Block>
      </article>
      <p className="mt-6 text-xs text-muted-foreground">An educational summary, not financial advice. All projections are illustrative and use the stated assumptions; returns are not guaranteed.</p>
    </>
  );
}
