import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Info } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ScenarioBadge } from '@/components/financial/ScenarioBadge';
import { Button } from '@/components/ui/button';
import { ASSET_CLASSES } from '@/data/assumptions';
import { DEMO_HOLDINGS } from '@/data/defaults';
import { PreferencesPanel } from '@/features/dashboard/PreferencesPanel';
import { ProgressRing } from '@/components/financial/ProgressRing';
import { Reveal } from '@/components/shared/Reveal';
import { Coin, Sparkle } from '@/components/illustrations';
import { motion } from 'motion/react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { calculateGoalTimeline, formatDuration } from '@/lib/calculations';
import { formatINR } from '@/lib/format';
import { usePlanProjection, usePortfolio } from '@/hooks/useFinancialSummary';
import { useFinancialStore } from '@/store/useFinancialStore';

const greeting = (hour: number) => hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

export default function HomePage() {
  const name = useFinancialStore(s => s.profile.name);
  const setHoldings = useFinancialStore(s => s.setHoldings);
  const { plan, projection } = usePlanProjection();
  const portfolio = usePortfolio();
  const outlookMonths = calculateGoalTimeline({ goal: plan.goal, monthlyAmount: plan.monthly, annualReturn: projection.annualReturn, initial: portfolio.value });
  const outlookYear = outlookMonths === null ? null : new Date().getFullYear() + Math.ceil(outlookMonths / 12);
  const equityShare = portfolio.value > 0 ? portfolio.holdings.filter(h => h.assetClass === 'equity').reduce((s, h) => s + h.value, 0) / portfolio.value * 100 : 0;
  const { reduceMotion } = useAppMotion();
  const quickActions = [{ to: '/plan', label: 'Adjust My Plan' }, { to: '/reality-lab', label: 'Explore a Scenario' }, { to: '/blueprint', label: 'View My Blueprint' }];

  return (
    <>
      <PageHeader eyebrow="HOME / WHERE DO I STAND?" title={`${greeting(new Date().getHours())}, ${name}.`} description="Your demo portfolio, your goal, and what might come next." action={<ScenarioBadge kind="simulation" />} />
      {portfolio.holdings.length === 0 ? (
        <EmptyState title="No demo holdings yet." description="Load a fictional sample portfolio to see how the dashboard works. Nothing real is connected." action={<Button className="rounded-full" onClick={() => setHoldings(DEMO_HOLDINGS)}>Load demo portfolio</Button>} />
      ) : (
        <>
          <section aria-label="Goal progress" className="relative overflow-hidden rounded-[32px] ink-card bg-sun p-6 md:p-10">
            <div className="relative z-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <p className="eyebrow text-ink">Fictional demo portfolio · {formatINR(plan.goal)} goal</p>
                <p className="display mt-4 text-6xl sm:text-7xl md:text-[96px]"><span>{formatINR(portfolio.value)}</span></p>
                <p className="mt-2 font-serif text-2xl text-ink/60">of {formatINR(plan.goal)}</p>
                <div className="mt-6 h-5 overflow-hidden rounded-full border-2 border-ink bg-white" role="progressbar" aria-label="Progress toward goal" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(portfolio.progress)}>
                  <motion.div className="h-full bg-plum" initial={reduceMotion ? false : { width: 0 }} animate={{ width: `${portfolio.progress}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} />
                </div>
                <p className="mt-2 text-sm font-medium">{portfolio.progress.toFixed(1)}% of the way there</p>
              </div>
              <ProgressRing value={portfolio.progress} label="Goal progress ring" className="hidden size-44 md:block" />
            </div>
            <Coin aria-hidden="true" className="float-slow absolute right-[22%] top-8 hidden w-16 lg:block" />
            <Sparkle aria-hidden="true" className="absolute bottom-5 right-5 w-9 md:hidden" />
          </section>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Reveal className="rounded-2xl ink-outline ink-lift bg-card p-6"><p className="eyebrow">Total contributions</p><p className="display mt-3 text-5xl">{formatINR(portfolio.contributed)}</p><p className="mt-2 text-xs text-muted-foreground">What went in from your pocket.</p></Reveal>
            <Reveal delay={0.08} className="rounded-2xl ink-outline ink-lift bg-mint p-6"><p className="eyebrow text-ink">Investment {portfolio.gain >= 0 ? 'gain' : 'loss'}</p><p className="display mt-3 text-5xl">{portfolio.gain >= 0 ? '+' : '−'}{formatINR(Math.abs(portfolio.gain))}</p><p className="mt-2 text-xs text-muted-foreground">{portfolio.gainPct.toFixed(1)}% on contributions. Simulated, not real performance.</p></Reveal>
            <Reveal delay={0.16} className="rounded-2xl ink-outline ink-lift bg-plum p-6 text-white"><p className="eyebrow text-sun">Goal outlook</p><p className="display mt-3 text-5xl">{outlookYear ?? 'Not yet'}</p><p className="mt-2 text-xs text-white/80">{outlookMonths === null ? 'Not reached within 100 years at the current plan.' : `About ${formatDuration(outlookMonths)} at ${formatINR(plan.monthly)}/month and ${(projection.annualReturn * 100).toFixed(1)}% a year — illustrative.`}</p></Reveal>
          </div>

          <section aria-labelledby="holdings-heading" className="mt-10">
            <div className="section-label"><h2 id="holdings-heading" className="display text-4xl">Simulated holdings</h2><span className="eyebrow">Fictional · not your plan</span></div>
            <ul className="space-y-3">
              {portfolio.holdings.map((h, i) => {
                const gain = h.value - h.contributed;
                const meta = ASSET_CLASSES.find(c => c.id === h.assetClass)!;
                return (
                  <motion.li key={h.id} initial={reduceMotion ? false : { opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden rounded-2xl ink-outline bg-card transition-shadow hover:shadow-[4px_4px_0_#10110F]">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                        <span className="flex min-w-0 items-center gap-3"><span aria-hidden="true" className="size-4 shrink-0 rounded-full border-2 border-ink" style={{ background: meta.color }} /><span className="min-w-0"><span className="block truncate text-sm font-medium">{h.name}</span><span className="text-xs text-muted-foreground">{meta.name}</span></span></span>
                        <span className="flex shrink-0 items-center gap-4 text-right"><span><span className="block text-sm tabular-nums">{formatINR(h.value)}</span><span className="text-xs text-muted-foreground">{(h.value / portfolio.value * 100).toFixed(1)}%</span></span><ChevronDown size={16} className="text-muted-foreground transition-transform group-open:rotate-180" /></span>
                      </summary>
                      <div className="grid grid-cols-1 gap-3 px-5 pb-5 text-xs sm:grid-cols-3">
                        <p><span className="block text-muted-foreground">Contributed</span>{formatINR(h.contributed)}</p>
                        <p><span className="block text-muted-foreground">Simulated {gain >= 0 ? 'gain' : 'loss'}</span>{formatINR(gain)} ({h.contributed > 0 ? (gain / h.contributed * 100).toFixed(1) : '0'}%)</p>
                        {h.fundId ? <Link to={`/explore/funds/${h.fundId}`} className="flex items-center gap-1 underline underline-offset-4">About this fund<ArrowUpRight size={12} /></Link> : <p className="text-muted-foreground">Bank deposit — value doesn’t swing.</p>}
                      </div>
                    </details>
                  </motion.li>
                );
              })}
            </ul>
          </section>

          <p className="mt-6 flex gap-3 rounded-2xl ink-outline bg-white p-5 text-sm"><Info size={16} className="mt-0.5 shrink-0 text-plum" />Your demo portfolio is {Math.round(equityShare)}% equity, while your plan aims for {plan.allocation.equity}%. Future contributions following the plan would gradually move it closer — without selling anything.</p>
        </>
      )}

      <section aria-label="Quick actions" className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {quickActions.map(a => <Button key={a.to} asChild variant="outline" size="lg" className="h-14 justify-between rounded-2xl bg-card px-5 text-sm"><Link to={a.to}>{a.label}<ArrowUpRight size={16} /></Link></Button>)}
      </section>
      <PreferencesPanel />
    </>
  );
}
