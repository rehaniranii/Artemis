import { useState } from 'react';
import { InvestmentSlider } from '@/components/financial/InvestmentSlider';
import { Term } from '@/components/shared/Term';
import { Button } from '@/components/ui/button';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { APPROACHES } from '@/data/assumptions';
import { blendedReturn, calculateFutureValue, calculateGoalTimeline, calculateInflationAdjustedValue, calculateSIP, formatDuration, goalProgress, projectPlan } from '@/lib/calculations';
import { formatINR } from '@/lib/format';
import { cn } from '@/lib/utils';
import { usePlanProjection } from '@/hooks/useFinancialSummary';
import { useFinancialStore } from '@/store/useFinancialStore';

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return <div className="rounded-2xl ink-outline bg-card p-5"><p className="eyebrow">{label}</p><p className="mt-2 font-serif text-3xl tabular-nums">{value}</p>{sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}</div>;
}

export function SipCalculator({ inflation }: { inflation: boolean }) {
  const { plan, projection } = usePlanProjection();
  const income = useFinancialStore(s => s.profile.monthlyIncome);
  const seed = () => ({ monthly: plan.monthly, years: plan.years, rate: Math.round(projection.annualReturn * 1000) / 10 });
  const [state, setState] = useState(seed);
  const result = calculateSIP({ monthlyAmount: state.monthly, annualReturn: state.rate / 100, years: state.years });
  const real = calculateInflationAdjustedValue(result.value, state.years);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-6 rounded-3xl ink-card bg-card p-6">
        <p className="text-sm text-muted-foreground">A <Term id="sip" /> calculator. Try any numbers — this doesn’t change your plan.</p>
        <InvestmentSlider label="Monthly contribution" value={state.monthly} max={Math.max(income, 20000)} step={100} onChange={monthly => setState(s => ({ ...s, monthly }))} />
        <InvestmentSlider label="Duration" value={state.years} min={1} max={40} step={1} format={v => `${v} years`} onChange={years => setState(s => ({ ...s, years }))} />
        <InvestmentSlider label="Illustrative annual return" value={state.rate} min={-10} max={15} step={0.5} format={v => `${v}%`} onChange={rate => setState(s => ({ ...s, rate }))} description="Negative values show what a losing period does. No return is guaranteed." />
        <Button type="button" variant="outline" size="sm" className="rounded-full text-xs" onClick={() => setState(seed())}>Use my plan’s values</Button>
      </div>
      <div className="grid grid-cols-1 content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Stat label="Total invested" value={formatINR(result.invested)} />
        <Stat label="Hypothetical future value" value={formatINR(result.value)} sub={inflation ? `≈ ${formatINR(real)} in today’s money` : undefined} />
        <Stat label={result.gain >= 0 ? 'Hypothetical gains' : 'Hypothetical losses'} value={formatINR(result.gain)} sub="Before tax. Assumes the same return every year." />
      </div>
    </div>
  );
}

export function TimeMachine({ inflation }: { inflation: boolean }) {
  const { plan, projection } = usePlanProjection();
  const startYear = new Date().getFullYear();
  const [year, setYear] = useState(Math.min(5, plan.years));
  const point = projection.points[Math.min(year, projection.points.length - 1)];
  const growth = point.value - point.contributed;
  const progress = goalProgress(point.value, plan.goal);
  const ticks = Array.from(new Set([0, ...Array.from({ length: Math.floor(plan.years / 5) }, (_, i) => (i + 1) * 5), plan.years]));
  const max = Math.max(...projection.points.map(p => p.value), plan.goal, 1);
  const share = point.value > 0 ? growth / point.value : 0;
  const story = year === 0 ? 'Today. Nothing invested yet — every journey starts at zero.'
    : point.value >= plan.goal ? 'In this illustration, the goal is reached. Real markets could get there sooner, later, or not at all.'
      : share < 0.15 ? 'Early years: almost all of the value is money you put in yourself. Habits matter more than returns here.'
        : share < 0.4 ? 'Compounding starts to show — growth is earning growth on top of your contributions.'
          : 'Later years: in this illustration, growth does much of the work. Staying invested through dips is what makes this possible.';
  return (
    <div className="space-y-6">
      <div className="rounded-3xl ink-card bg-plum p-6 text-[#FFFDF2] md:p-10">
        <p className="eyebrow text-sun">Financial time machine · your plan, illustrative</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="display text-7xl tabular-nums sm:text-[120px]"><AnimatedNumber value={startYear + year} format={n => String(Math.round(n))} /></p>
            <p className="text-sm text-[#FFFDF2]/70">{year === 0 ? 'Today' : `${year} ${year === 1 ? 'year' : 'years'} from now`}</p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#FFFDF2]/85" aria-live="polite">{story}</p>
        </div>
        <div className="mt-8">
          <input type="range" min={0} max={plan.years} step={1} value={Math.min(year, plan.years)} onChange={e => setYear(Number(e.target.value))} aria-label="Year on the timeline" aria-valuetext={`${startYear + year}`} className="range-ink w-full" />
          <div className="relative mt-2 h-5 text-[11px] text-[#FFFDF2]/70">
            {ticks.map(t => <button key={t} type="button" onClick={() => setYear(t)} className="absolute -translate-x-1/2 hover:text-sun" style={{ left: `${t / plan.years * 100}%` }}>{startYear + t}</button>)}
          </div>
        </div>
        <div className="relative mt-8 flex h-36 items-end gap-1 rounded-2xl bg-[#FFFDF2] p-3" aria-hidden="true">
          <div className="absolute inset-x-3 border-t-2 border-dashed border-plum" style={{ bottom: `calc(${plan.goal / max * 100}% * (1 - 24 / 144) + 12px)` }} />
          {projection.points.map((p, i) => (
            <button key={p.month} type="button" tabIndex={-1} onClick={() => setYear(i)} className="flex h-full flex-1 flex-col justify-end" title={`${startYear + i}: ${formatINR(p.value)}`}>
              <span className={cn('block w-full rounded-t-md border-2 border-b-0 border-ink transition-all duration-300', i === year ? 'bg-sun' : i < year ? 'bg-mint' : 'bg-white')} style={{ height: `${p.value / max * 100}%` }} />
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total contributions" value={<AnimatedNumber value={point.contributed} />} />
        <Stat label="Simulated value" value={<AnimatedNumber value={point.value} />} sub={inflation ? `≈ ${formatINR(calculateInflationAdjustedValue(point.value, year))} in today’s money` : undefined} />
        <Stat label={growth >= 0 ? 'Investment growth' : 'Investment loss'} value={<AnimatedNumber value={growth} />} />
        <div className="rounded-2xl ink-outline bg-card p-5"><p className="eyebrow">Goal progress</p><p className="mt-2 font-serif text-3xl">{Math.round(progress)}%</p><div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-ink bg-white"><div className="h-full bg-plum transition-[width] duration-500" style={{ width: `${progress}%` }} /></div></div>
      </div>
      <p className="text-xs text-muted-foreground">Uses your plan’s central assumption of {(projection.annualReturn * 100).toFixed(1)}% a year. Real portfolios don’t grow in a straight line.</p>
    </div>
  );
}

type FutureId = 'more' | 'later' | 'mix';

export function CompareFutures({ inflation }: { inflation: boolean }) {
  const { plan } = usePlanProjection();
  const [which, setWhich] = useState<FutureId>('more');
  const months = plan.years * 12;
  const steady = APPROACHES.find(a => a.id === 'steady')!.allocation, growth = APPROACHES.find(a => a.id === 'growth')!.allocation;
  const base = projectPlan(plan);
  const futures = {
    more: [
      { name: `${formatINR(plan.monthly)} a month`, ...base },
      { name: `${formatINR(plan.monthly + 1000)} a month`, ...projectPlan({ ...plan, monthly: plan.monthly + 1000 }) },
    ],
    later: [
      { name: 'Starting now', ...base },
      (() => {
        const r = blendedReturn(plan.allocation), m = Math.max(0, months - 24);
        const value = calculateFutureValue({ monthlyAmount: plan.monthly, annualReturn: r, months: m });
        const t = calculateGoalTimeline({ goal: plan.goal, monthlyAmount: plan.monthly, annualReturn: r });
        return { name: 'Starting two years later', value, contributed: plan.monthly * m, gain: value - plan.monthly * m, monthsToGoal: t === null ? null : t + 24 };
      })(),
    ],
    mix: [
      { name: 'Steady allocation', ...projectPlan({ ...plan, allocation: steady }) },
      { name: 'Growth allocation', ...projectPlan({ ...plan, allocation: growth }) },
    ],
  }[which];
  const [a, b] = futures;
  const diff = b.value - a.value;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a comparison">
        {([['more', `${formatINR(plan.monthly)} vs ${formatINR(plan.monthly + 1000)}/month`], ['later', 'Start now vs in 2 years'], ['mix', 'Steady vs Growth']] as const).map(([id, label]) => (
          <button key={id} type="button" aria-pressed={which === id} onClick={() => setWhich(id)} className={cn('rounded-full border-2 border-ink px-4 py-2 text-xs', which === id ? 'border-ink bg-sun' : 'bg-white text-muted-foreground hover:text-foreground')}>{label}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {futures.map(f => (
          <article key={f.name} className="rounded-3xl ink-card bg-card p-6">
            <h3 className="font-serif text-3xl">{f.name}</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Value in {plan.years} years</dt><dd className="font-medium tabular-nums">{formatINR(f.value)}</dd></div>
              {inflation && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">In today’s money</dt><dd className="tabular-nums">≈ {formatINR(calculateInflationAdjustedValue(f.value, plan.years))}</dd></div>}
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Contributions</dt><dd className="tabular-nums">{formatINR(f.contributed)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{f.gain >= 0 ? 'Growth' : 'Loss'}</dt><dd className="tabular-nums">{formatINR(f.gain)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Time to goal</dt><dd className="tabular-nums">{formatDuration(f.monthsToGoal)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <p className="rounded-2xl ink-outline bg-cream p-5 text-sm">
        <strong className="font-medium">The difference:</strong> {b.name.toLowerCase()} ends about {formatINR(Math.abs(diff))} {diff >= 0 ? 'higher' : 'lower'} after {plan.years} years under these assumptions.
        {which === 'later' && ' Waiting costs more than the missed contributions, because those early rupees lose years of compounding.'}
        {which === 'mix' && ' The growth mix also means deeper falls along the way — try Reality Lab to feel what that’s like.'}
      </p>
    </div>
  );
}
