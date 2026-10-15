import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs } from '@/components/shared/Tabs';
import { Term } from '@/components/shared/Term';
import { RiskometerBadge } from '@/components/financial/RiskometerBadge';
import { Button } from '@/components/ui/button';
import { ExploreNav } from '@/features/explorer/ExploreNav';
import { compareFunds, matchFundCategories } from '@/features/match/matching';
import { PlanToggle } from '@/features/match/PlanToggle';
import { NextStep } from '@/components/shared/NextStep';
import { findFund, fundCategories, fundCategoryById, mutualFunds } from '@/data/funds';
import { formatINR } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useFinancialStore } from '@/store/useFinancialStore';
import type { MutualFund } from '@/types/financial';

type Tab = 'for-you' | 'funds' | 'compare';
const TABS: { id: Tab; label: string }[] = [{ id: 'for-you', label: 'For You' }, { id: 'funds', label: 'Explore Funds' }, { id: 'compare', label: 'Compare' }];

function FundCard({ fund, onCompare, index, selected }: { fund: MutualFund; onCompare: (id: string) => void; index: number; selected: boolean }) {
  const { reduceMotion } = useAppMotion();
  return (
    <motion.article
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ delay: reduceMotion ? 0 : Math.min(index, 8) * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex flex-col rounded-2xl ink-outline ink-lift bg-card p-5', selected && 'bg-cream shadow-[5px_5px_0_#10110F]')}
    >
      <p className="eyebrow">{fundCategoryById[fund.category].name}</p>
      <h3 className="display mt-2 text-3xl">{fund.name}</h3>
      <div className="mt-3"><RiskometerBadge level={fund.riskometer} /></div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div><dt className="text-muted-foreground"><Term id="expense-ratio" /></dt><dd className="mt-1 font-medium">{fund.expenseRatio.toFixed(2)}%</dd></div>
        <div><dt className="text-muted-foreground">Min <Term id="sip" /></dt><dd className="mt-1 font-medium">{formatINR(fund.minSip)}</dd></div>
        <div><dt className="text-muted-foreground">3Y (simulated)</dt><dd className="mt-1 font-medium">{fund.simulatedReturns.y3.toFixed(1)}%</dd></div>
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">Exit load: {fund.exitLoad}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Button asChild size="sm" className="rounded-full bg-ink text-xs text-white hover:bg-ink/90"><Link to={`/explore/funds/${fund.id}`}>Details<ArrowUpRight size={13} /></Link></Button>
        <Button type="button" variant="outline" size="sm" className="rounded-full text-xs" onClick={() => onCompare(fund.id)}>Compare</Button>
        <PlanToggle fundId={fund.id} />
      </div>
    </motion.article>
  );
}

export default function MatchPage() {
  const { reduceMotion } = useAppMotion();
  const [params, setParams] = useSearchParams();
  const tab = (TABS.some(t => t.id === params.get('tab')) ? params.get('tab') : 'for-you') as Tab;
  const category = params.get('category');
  const a = findFund(params.get('a')), b = findFund(params.get('b'));
  const journey = useFinancialStore(s => s.journey);
  const years = useFinancialStore(s => s.profile.investmentHorizonYears);
  const monthly = useFinancialStore(s => s.profile.monthlyInvestmentCapacity);
  const name = useFinancialStore(s => s.profile.name);
  const complete = useFinancialStore(s => s.onboardingComplete);
  const matches = matchFundCategories({ journey, years, monthly });
  const update = (patch: Record<string, string | null>) => setParams(current => { const next = new URLSearchParams(current); Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k))); return next; }, { preventScrollReset: true });
  const onCompare = (id: string) => {
    if (!a || a.id === id) update({ a: id });
    else update({ b: id, tab: 'compare' });
  };
  const visible = category ? mutualFunds.filter(f => f.category === category) : mutualFunds;
  const comparison = a && b && a.id !== b.id ? compareFunds(a, b) : null;

  return (
    <>
      <PageHeader eyebrow="EXPLORE / MORROW MATCH" title="Find fund categories worth exploring." description="A starting point for learning, based on your answers — not a verdict, and not personalised advice." />
      <ExploreNav />
      <Tabs label="Morrow Match sections" value={tab} onChange={next => update({ tab: next })} items={TABS} />

      {tab === 'for-you' && (
        <section aria-label="Categories for you">
          <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
            Based on {complete ? 'your' : `${name}’s demo`} answers: {journey.riskProfile} learning profile, a {years}-year horizon, {formatINR(monthly)} a month.{' '}
            <Link to="/onboarding" className="underline underline-offset-4">{complete ? 'Change answers' : 'Answer for yourself'}</Link>
          </p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {matches.map((match, index) => (
              <motion.article key={match.category.id} initial={reduceMotion ? false : { opacity: 0, y: 40, rotate: index % 2 ? 2 : -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.1 + index * 0.12, type: 'spring', stiffness: 140, damping: 18 }} className={cn('flex flex-col rounded-3xl ink-card ink-lift p-6', ['bg-mint', 'bg-sun', 'bg-cream'][index])}>
                <p className="eyebrow">Worth exploring · {index + 1}</p>
                <h2 className="display mt-3 text-4xl">{match.category.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{match.category.summary}</p>
                <h3 className="mt-5 text-xs font-medium uppercase tracking-[0.12em]">Why it appears</h3>
                <ul className="mt-2 space-y-2 text-sm">{match.reasons.map(r => <li key={r}>{r}</li>)}</ul>
                <h3 className="mt-5 text-xs font-medium uppercase tracking-[0.12em] text-warning">Watch out for</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">{match.cautions.map(c => <li key={c}>{c}</li>)}</ul>
                <Button type="button" variant="outline" className="mt-6 self-start rounded-full text-xs" onClick={() => update({ tab: 'funds', category: match.category.id })}>See example funds<ArrowUpRight size={13} /></Button>
              </motion.article>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Educational matching using simple rules about comfort with losses, timeline, access needs and emergency savings. It is not a regulated suitability assessment or a recommendation to invest.</p>
        </section>
      )}

      {tab === 'funds' && (
        <section aria-label="Fund catalogue">
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {[{ id: null, name: 'All' }, ...fundCategories].map(c => (
              <button key={c.id ?? 'all'} type="button" aria-pressed={category === c.id} onClick={() => update({ category: c.id })} className={cn('rounded-full border-2 border-ink px-3.5 py-1.5 text-xs', category === c.id ? 'bg-sun font-semibold shadow-[2px_2px_0_#10110F]' : 'bg-white text-muted-foreground hover:bg-cream hover:text-ink')}>{c.name}</button>
            ))}
          </div>
          {(a || b) && <p role="status" className="mb-4 text-xs text-muted-foreground">Comparing: {[a, b].filter(Boolean).map(f => f!.name).join(' and ')}{a && !b && ' — pick one more.'}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"><AnimatePresence initial={false}>{visible.map((fund, i) => <FundCard key={fund.id} fund={fund} index={i} selected={a?.id === fund.id || b?.id === fund.id} onCompare={onCompare} />)}</AnimatePresence></div>
          <p className="mt-6 text-xs text-muted-foreground">Fictional schemes with simulated figures, for learning only. Expense ratios and returns are illustrative, not real fund data or performance.</p>
        </section>
      )}

      {tab === 'compare' && (
        <section aria-label="Compare two funds">
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(['a', 'b'] as const).map(slot => (
              <label key={slot} className="text-xs text-muted-foreground">Fund {slot.toUpperCase()}
                <select value={params.get(slot) ?? ''} onChange={e => update({ [slot]: e.target.value || null })} className="mt-2 h-11 w-full rounded-xl ink-outline bg-white px-3 text-sm text-foreground">
                  <option value="">Choose a fund…</option>
                  {mutualFunds.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </label>
            ))}
          </div>
          {a && b && a.id === b.id && <p role="alert" className="text-sm text-destructive">Choose two different funds to compare.</p>}
          {!comparison && !(a && b && a.id === b.id) && <p className="rounded-2xl border-2 border-dashed border-ink p-6 text-sm text-muted-foreground">Choose two funds above, or use “Compare” on any fund card.</p>}
          {comparison && a && b && (
            <>
              <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
                {[a, b].map((f, i) => (
                  <motion.div key={f.id} style={{ order: i * 2 }} initial={reduceMotion ? false : { opacity: 0, x: i ? 80 : -80, rotate: i ? 6 : -6 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} className={cn('rounded-3xl ink-card p-4 sm:p-6', i ? 'bg-mint' : 'bg-sun')}>
                    <p className="eyebrow text-ink/60">{fundCategoryById[f.category].name}</p>
                    <p className="display mt-2 text-2xl sm:text-4xl">{f.name}</p>
                    <div className="mt-3"><RiskometerBadge level={f.riskometer} /></div>
                  </motion.div>
                ))}
                <motion.span style={{ order: 1 }} initial={reduceMotion ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 14 }} aria-hidden="true" className="grid size-12 place-items-center rounded-full border-2 border-ink bg-plum font-serif text-xl italic text-white sm:size-16 sm:text-2xl">vs</motion.span>
              </div>
              <div className="overflow-x-auto rounded-2xl ink-outline bg-card">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead><tr className="border-b"><th scope="col" className="w-40 p-4 text-xs font-medium text-muted-foreground">What</th><th scope="col" className="p-4 font-serif text-lg font-normal">{a.name}</th><th scope="col" className="p-4 font-serif text-lg font-normal">{b.name}</th></tr></thead>
                  <tbody>{comparison.rows.map(row => <tr key={row.label} className="border-b last:border-0 align-top"><th scope="row" className="p-4 text-xs font-medium text-muted-foreground">{row.label}</th><td className="p-4">{row.a}</td><td className="p-4">{row.b}</td></tr>)}</tbody>
                </table>
              </div>
              <div className="mt-6 rounded-2xl ink-outline bg-cream p-6">
                <h2 className="display text-3xl">The most important differences</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">{comparison.differences.map((d, i) => <motion.li key={d} initial={reduceMotion ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.12 }}>{d}</motion.li>)}</ul>
                <p className="mt-4 text-xs text-muted-foreground">There’s no automatic winner. Which fits depends on your goal, timeline and comfort with swings.</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2"><PlanToggle fundId={a.id} /><PlanToggle fundId={b.id} /></div>
            </>
          )}
        </section>
      )}
      <NextStep to="/plan" label="Build your plan" hint="Funds you add appear in My Plan, where you decide how much each receives." />
    </>
  );
}
