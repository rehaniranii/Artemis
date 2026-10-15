import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Info, TriangleAlert, X } from 'lucide-react';
import { InvestmentSlider } from '@/components/financial/InvestmentSlider';
import { Term } from '@/components/shared/Term';
import { Button } from '@/components/ui/button';
import { CurrencyInput, Chip } from '@/features/onboarding/fields';
import { GOAL_CHIPS, amountInWords } from '@/features/onboarding/journey';
import { APPROACHES, ASSET_CLASSES } from '@/data/assumptions';
import { mutualFunds } from '@/data/funds';
import { calculateInflationAdjustedValue, calculatePortfolioAllocation, formatDuration } from '@/lib/calculations';
import { formatINR } from '@/lib/format';
import { cn } from '@/lib/utils';
import { usePlanProjection } from '@/hooks/useFinancialSummary';
import { useFinancialStore } from '@/store/useFinancialStore';
import { planInsights } from './insights';
import { AssumptionsPanel } from './AssumptionsPanel';
import { AllocationDonut } from './AllocationDonut';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { motion } from 'motion/react';
import { useAppMotion } from '@/hooks/useAppMotion';

const pct = (v: number) => `${Math.round(v)}%`;

function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="rounded-2xl ink-outline bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-3"><h2 className="text-sm font-medium">{title}</h2>{aside}</div>
      {children}
    </section>
  );
}

function GoalControl() {
  const goal = useFinancialStore(s => s.goal.amount), setGoal = useFinancialStore(s => s.setGoal);
  const [draft, setDraft] = useState(goal);
  useEffect(() => setDraft(goal), [goal]);
  const invalid = draft < 10000;
  return (
    <Section title="1. Financial goal">
      <CurrencyInput label="Goal amount" size="md" value={draft} invalid={invalid} onChange={v => { setDraft(v); if (v >= 10000) setGoal({ amount: v }); }} />
      <p className={cn('mt-2 text-xs', invalid ? 'text-destructive' : 'text-muted-foreground')} role={invalid ? 'alert' : undefined}>{invalid ? 'Enter a goal of at least ₹10,000.' : `₹${amountInWords(goal)}`}</p>
      <div className="mt-3 flex flex-wrap gap-2">{GOAL_CHIPS.map(a => <Chip key={a} selected={goal === a} onClick={() => setGoal({ amount: a })}>₹{amountInWords(a)}</Chip>)}</div>
    </Section>
  );
}

function FundsControl() {
  const planFunds = useFinancialStore(s => s.planFunds);
  const monthly = useFinancialStore(s => s.profile.monthlyInvestmentCapacity);
  const allocation = useFinancialStore(s => s.allocation);
  const { addPlanFund, removePlanFund, setPlanFundWeight } = useFinancialStore.getState();
  const [pick, setPick] = useState('');
  const rows = calculatePortfolioAllocation(monthly, allocation, planFunds);
  const available = mutualFunds.filter(f => !planFunds.some(p => p.fundId === f.id));
  return (
    <Section title="6. Mutual funds in this plan" aside={<Link to="/explore/match" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">Morrow Match<ArrowUpRight size={12} /></Link>}>
      <p className="mb-4 text-xs text-muted-foreground">Each fund shares its asset class’s slice, so funds never add up to more than your allocation.</p>
      <div className="space-y-4">
        {rows.map(row => {
          const meta = ASSET_CLASSES.find(c => c.id === row.assetClass)!;
          return (
            <div key={row.assetClass}>
              <p className="flex justify-between text-xs"><span className="font-medium">{meta.name} · {row.percent}%</span><span className="tabular-nums text-muted-foreground">{formatINR(row.monthlyAmount)}/mo</span></p>
              {row.funds.length === 0 && <p className="mt-1 text-[11px] text-muted-foreground">{row.assetClass === 'stable' ? 'Kept in savings or deposits — no fund needed.' : row.percent > 0 ? 'No fund chosen yet.' : '—'}</p>}
              {row.percent === 0 && row.funds.length > 0 && <p className="mt-1 flex items-center gap-1 text-[11px] text-warning"><TriangleAlert size={12} />This class is at 0%, so these funds receive nothing.</p>}
              <ul className="mt-2 space-y-2">
                {row.funds.map(({ fund, percentOfTotal, monthlyAmount }) => {
                  const weight = planFunds.find(p => p.fundId === fund.id)!.weight;
                  return (
                    <li key={fund.id} className="rounded-xl bg-cream p-3">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/explore/funds/${fund.id}`} className="text-xs font-medium hover:underline">{fund.name}</Link>
                        <button type="button" aria-label={`Remove ${fund.name} from plan`} onClick={() => removePlanFund(fund.id)} className="rounded-full p-1 text-muted-foreground hover:bg-white"><X size={13} /></button>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">{pct(percentOfTotal)} of total · {formatINR(monthlyAmount)}/mo</p>
                      {row.funds.length > 1 && (
                        <label className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">Weight
                          <input type="range" min={0} max={100} step={5} value={weight} aria-label={`Weight of ${fund.name} within ${meta.short}`} onChange={e => setPlanFundWeight(fund.id, Number(e.target.value))} className="flex-1 accent-plum" />
                        </label>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex gap-2">
        <select aria-label="Choose a fund to add" value={pick} onChange={e => setPick(e.target.value)} className="h-9 min-w-0 flex-1 rounded-full border bg-white px-3 text-xs">
          <option value="">Add a fund…</option>
          {available.map(f => <option key={f.id} value={f.id}>{f.name} ({f.assetClass})</option>)}
        </select>
        <Button type="button" size="sm" className="rounded-full text-xs" disabled={!pick} onClick={() => { addPlanFund(pick); setPick(''); }}>Add</Button>
      </div>
    </Section>
  );
}

export function PlanBuilder({ inflation }: { inflation: boolean }) {
  const { plan, projection } = usePlanProjection();
  const { reduceMotion } = useAppMotion();
  const income = useFinancialStore(s => s.profile.monthlyIncome);
  const journey = useFinancialStore(s => s.journey);
  const { setMonthlyInvestment, setHorizon, setApproach, setAllocationClass } = useFinancialStore.getState();
  const preset = APPROACHES.find(a => a.id === plan.approach)!;
  const edited = ASSET_CLASSES.some(c => preset.allocation[c.id] !== plan.allocation[c.id]);
  const insights = planInsights(plan, projection, { income, journey });
  const real = (v: number) => calculateInflationAdjustedValue(v, plan.years);
  // Leave headroom so the goal marker is never clipped at the right edge.
  const scale = Math.max(plan.goal, projection.high) * 1.08;
  const bar = (v: number) => `${Math.max(0, Math.min(100, v / scale * 100))}%`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-4">
        <GoalControl />
        <Section title="2. Monthly investment">
          <InvestmentSlider label="Each month" value={plan.monthly} max={income} step={100} onChange={setMonthlyInvestment} description={`${formatINR(Math.max(0, income - plan.monthly))} of your ${formatINR(income)} income remains for everything else.`} />
        </Section>
        <Section title="3. Investment horizon">
          <InvestmentSlider label="Years" value={plan.years} min={1} max={40} step={1} format={v => `${v} ${v === 1 ? 'year' : 'years'}`} onChange={setHorizon} />
        </Section>
        <Section title="4. Investment approach" aside={edited && <span className="text-[11px] text-muted-foreground">{preset.name}, customised</span>}>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Investment approach">
            {APPROACHES.map(a => (
              <button key={a.id} type="button" aria-pressed={plan.approach === a.id && !edited} onClick={() => setApproach(a.id)} className={cn('rounded-xl border-2 border-ink p-3 text-left text-xs transition-colors', plan.approach === a.id ? 'border-ink bg-sun shadow-[3px_3px_0_#10110F]' : 'hover:bg-cream')}>
                <span className="block font-medium">{a.name}</span>
                <span className="mt-1 hidden text-[11px] text-muted-foreground sm:block">{a.description}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">Educational presets — a starting point you can edit below.</p>
        </Section>
        <Section title="5. Asset allocation" aside={<span className="text-xs tabular-nums text-muted-foreground">Total {ASSET_CLASSES.reduce((s, c) => s + plan.allocation[c.id], 0)}%</span>}>
          <div className="mb-6 rounded-2xl bg-cream p-4"><AllocationDonut allocation={plan.allocation} /></div>
          <div className="space-y-5">
            {ASSET_CLASSES.map(c => <InvestmentSlider key={c.id} label={c.name} value={plan.allocation[c.id]} max={100} step={1} format={pct} onChange={v => setAllocationClass(c.id, v)} />)}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">Moving one slider rebalances the others so the total always stays at 100%.</p>
        </Section>
        <FundsControl />
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <section aria-label="Projection" className="rounded-3xl ink-card bg-sun p-6 md:p-8">
          <p className="eyebrow">Estimated in {plan.years} years · illustrative</p>
          {/* A brief pulse acknowledges each change; the number itself counts to its new value. */}
          <motion.p key={Math.round(projection.value)} initial={reduceMotion ? false : { scale: 0.97 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="display mt-3 origin-left text-6xl md:text-7xl" data-testid="projected-value"><AnimatedNumber value={projection.value} /></motion.p>
          {inflation && <p className="mt-1 text-sm text-muted-foreground">≈ {formatINR(real(projection.value))} in today’s money</p>}
          <p className="mt-2 text-xs text-muted-foreground">Possible range: {formatINR(projection.low)} – {formatINR(projection.high)}{inflation && ` (≈ ${formatINR(real(projection.low))} – ${formatINR(real(projection.high))} today)`}</p>

          <div className="mt-6" aria-hidden="true">
            <div className="relative h-5 overflow-hidden rounded-full border-2 border-ink bg-white">
              <div className="absolute inset-y-0 left-0 bg-mint transition-[width] duration-500 ease-out" style={{ width: bar(projection.value) }} />
              <div className="absolute inset-y-0 left-0 bg-plum transition-[width] duration-500 ease-out" style={{ width: bar(Math.min(projection.contributed, projection.value)) }} />
              <div className="absolute inset-y-0 w-1 bg-ink transition-[left] duration-500" style={{ left: bar(plan.goal) }} />
            </div>
            <div className="relative mt-1 h-2"><div className="absolute h-1.5 rounded-full bg-ink/25 transition-all duration-500" style={{ left: bar(projection.low), width: `calc(${bar(projection.high)} - ${bar(projection.low)})` }} /></div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-plum" />Contributions</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-mint" />Illustrative growth</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-0.5 bg-ink" />Goal</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-4 rounded-full bg-ink/20" />Range</span>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t-2 border-ink pt-5 text-sm">
            {([
              ['Goal amount', formatINR(plan.goal)],
              ['Monthly contribution', formatINR(plan.monthly)],
              ['Total contributions', <AnimatedNumber value={projection.contributed} />],
              [projection.gain >= 0 ? 'Illustrative gains' : 'Illustrative losses', <AnimatedNumber value={projection.gain} />],
              ['Estimated time to goal', formatDuration(projection.monthsToGoal)],
              ['Central return used', `${(projection.annualReturn * 100).toFixed(1)}% a year`],
            ] as [string, React.ReactNode][]).map(([k, v]) => <div key={k}><dt className="eyebrow">{k}</dt><dd className="mt-1 font-medium tabular-nums">{v}</dd></div>)}
          </dl>
        </section>

        <section aria-label="Insights" className="space-y-2">
          {insights.slice(0, 4).map(i => (
            <p key={i.text} className={cn('flex gap-2 rounded-2xl p-4 text-sm leading-relaxed', i.tone === 'warning' ? 'border border-warning/30 bg-[#B3492F12]' : 'border bg-white')}>
              {i.tone === 'warning' ? <TriangleAlert size={15} className="mt-0.5 shrink-0 text-warning" /> : <Info size={15} className="mt-0.5 shrink-0 text-plum" />}{i.text}
            </p>
          ))}
        </section>
        <AssumptionsPanel />
        <p className="text-[11px] text-muted-foreground">Illustrative projections, not guarantees. Learn about <Term id="compounding" /> and <Term id="volatility" />.</p>
      </div>
    </div>
  );
}
