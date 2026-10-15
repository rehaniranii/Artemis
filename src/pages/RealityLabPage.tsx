import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ScenarioBadge } from '@/components/financial/ScenarioBadge';
import { Button } from '@/components/ui/button';
import { ASSET_CLASSES, BAD_YEAR_SHOCK, MARKET_SCENARIOS } from '@/data/assumptions';
import { AssumptionsPanel } from '@/features/plan/AssumptionsPanel';
import { applyMarketShock, formatDuration, simulateMarketScenario } from '@/lib/calculations';
import { formatINR } from '@/lib/format';
import { cn } from '@/lib/utils';
import { usePlanProjection } from '@/hooks/useFinancialSummary';
import { useFinancialStore } from '@/store/useFinancialStore';
import { NextStep } from '@/components/shared/NextStep';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { RealityChart } from '@/features/reality/RealityChart';
import { gsap, useGsap } from '@/lib/motion';
import type { ContributionDecision } from '@/types/financial';

const DECISIONS: { id: ContributionDecision; name: string; description: string }[] = [
  { id: 'continue', name: 'Continue investing', description: 'Keep your monthly amount going.' },
  { id: 'pause', name: 'Pause contributions', description: 'Stop for 12 months, then restart.' },
  { id: 'reduce', name: 'Reduce contributions', description: 'Invest half as much from now on.' },
];

const signed = (v: number) => `${v < 0 ? '−' : '+'}${formatINR(Math.abs(v))}`;

/** Separate simulation state: nothing here changes the saved plan. */
export default function RealityLabPage() {
  const { plan, projection } = usePlanProjection();
  const scenarioId = useFinancialStore(s => s.scenario), setScenario = useFinancialStore(s => s.setScenario);
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const crashOptions = [3, 5, 10].filter(y => y < plan.years);
  const options = crashOptions.length ? crashOptions : [Math.max(1, plan.years - 1)];
  const [chosenYear, setCrashYear] = useState(options.includes(5) ? 5 : options[0]);
  const crashYear = options.includes(chosenYear) ? chosenYear : options[0];
  const [decision, setDecision] = useState<ContributionDecision>('continue');
  const scenario = MARKET_SCENARIOS.find(s => s.id === scenarioId)!;

  const before = projection.points[Math.min(crashYear, projection.points.length - 1)];
  const shock = applyMarketShock(before.value, plan.allocation);
  const remaining = Math.max(0, (plan.years - crashYear) * 12);
  const run = (d: ContributionDecision) => {
    const sim = simulateMarketScenario({ startValue: shock.after, monthlyAmount: plan.monthly, allocation: plan.allocation, scenario, months: remaining, decision: d, goal: plan.goal });
    const contributed = before.contributed + sim.contributed;
    // If the plan had already reached the goal before the bad year, the crash can't delay that milestone.
    const reachedBefore = projection.monthsToGoal !== null && projection.monthsToGoal <= crashYear * 12;
    const monthsToGoal = reachedBefore ? projection.monthsToGoal : sim.monthsToGoal === null ? null : crashYear * 12 + sim.monthsToGoal;
    return { ...sim, contributed, gain: sim.value - contributed, monthsToGoal };
  };
  const result = run(decision);
  const delay = result.monthsToGoal !== null && projection.monthsToGoal !== null ? result.monthsToGoal - projection.monthsToGoal : null;
  const reset = () => { setStage(1); setDecision('continue'); };
  const root = useRef<HTMLDivElement>(null);

  // The bad year, as one calm, coordinated sequence: the line drops, the value counts down,
  // the backdrop cools, figures and explanation arrive, then the choices.
  useGsap(root, () => {
    if (stage !== 2) return;
    const drop = root.current!.querySelector<SVGPathElement>('[data-drop]');
    const length = drop?.getTotalLength() ?? 0;
    const counter = { v: shock.before };
    const out = root.current!.querySelector('[data-crash-after]');
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    if (drop) tl.fromTo(drop, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.in' });
    tl.from('[data-drop-dot]', { scale: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(3)' })
      .fromTo('[data-lab-stage]', { backgroundColor: '#FFF5C7' }, { backgroundColor: '#E7E1F0', duration: 1.2 }, 0.2)
      .from('[data-crash-stat]', { y: 24, opacity: 0, stagger: 0.15, duration: 0.5 }, 0.5)
      .to(counter, { v: shock.after, duration: 1.1, ease: 'power3.out', onUpdate: () => { if (out) out.textContent = formatINR(counter.v); } }, 0.6)
      .from('[data-crash-explain]', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
      .from('[data-crash-next]', { y: 16, opacity: 0, duration: 0.5 });
  }, [stage]);

  return (
    <div ref={root}>
      <PageHeader eyebrow="REALITY LAB / MARKET DOWNTURN SIMULATOR" title="What if things don’t go according to plan?" description="Not every year goes up. Try a hypothetical bad year on your plan — your saved plan won’t change." action={<ScenarioBadge kind="simulation" />} />

      <section data-lab-stage aria-label="Your plan, illustrated" className={cn('mb-6 rounded-[32px] ink-card p-4 transition-colors duration-1000 sm:p-8', stage === 1 ? 'bg-cream' : 'bg-plum-soft')}>
        <RealityChart before={projection.points.slice(0, crashYear + 1).map(p => p.value)} original={projection.points.map(p => p.value)} crashYear={crashYear} after={shock.after} future={stage === 3 ? result.points.map(p => p.value) : null} years={plan.years} goal={plan.goal} stage={stage} />
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-1 w-5 rounded bg-ink" />Your plan so far</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 border-t-2 border-dashed border-ink/40" />Original plan</span>
          {stage >= 2 && <span className="flex items-center gap-1.5"><span className="h-1 w-5 rounded bg-warning" />The bad year</span>}
          {stage === 3 && <span className="flex items-center gap-1.5"><span className="h-1 w-5 rounded bg-plum" />After: {scenario.name.toLowerCase()}, {DECISIONS.find(d => d.id === decision)!.name.toLowerCase()}</span>}
        </div>
      </section>

      {stage === 1 && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl ink-card bg-sun p-6 md:p-10">
            <p className="eyebrow">Your projected portfolio after {crashYear} {crashYear === 1 ? 'year' : 'years'}</p>
            <p className="display mt-3 text-6xl sm:text-7xl"><AnimatedNumber value={before.value} /></p>
            <p className="mt-2 text-sm text-muted-foreground">{formatINR(before.contributed)} contributed at {formatINR(plan.monthly)} a month, with a {plan.approach} mix ({plan.allocation.equity}% equity).</p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs" role="group" aria-label="When the bad year happens">
              <span className="text-muted-foreground">The bad year arrives after:</span>
              {options.map(y => <button key={y} type="button" aria-pressed={crashYear === y} onClick={() => setCrashYear(y)} className={cn('rounded-full border-2 border-ink px-3 py-1.5', crashYear === y ? 'bg-ink font-semibold text-sun' : 'bg-white text-ink')}>{y} years</button>)}
            </div>
            <Button type="button" size="lg" className="mt-8 h-12 rounded-full px-7 text-sm" onClick={() => setStage(2)}>Experience a Bad Year<ArrowRight size={16} /></Button>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Real markets don’t rise smoothly. Equity investments have fallen by a third or more in single years, and taken years to recover.</p>
            <p>This simulator applies one hypothetical bad year to your plan’s allocation, then lets you test how you respond and how markets might behave afterwards.</p>
            <p>Nothing here predicts the future. Recovery is never guaranteed.</p>
          </div>
        </section>
      )}

      {stage >= 2 && (
        <section aria-label="The bad year" className="rounded-3xl ink-card bg-card p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div data-crash-stat><p className="eyebrow">Before</p><p className="display mt-2 text-5xl">{formatINR(shock.before)}</p></div>
            <div data-crash-stat><p className="eyebrow">After</p><p className="display mt-2 text-5xl" data-crash-after>{formatINR(shock.after)}</p></div>
            <div data-crash-stat><p className="eyebrow">{shock.loss >= 0 ? 'Loss' : 'Gain'}</p><p className="display mt-2 text-5xl text-warning">{formatINR(Math.abs(shock.loss))}</p><p className="text-xs text-muted-foreground">{(shock.change * 100).toFixed(1)}% overall</p></div>
          </div>
          <p data-crash-explain className="display mt-8 max-w-3xl text-3xl sm:text-4xl">Your portfolio has fallen in value. Your financial goal hasn’t changed, but your expected journey may.</p>
          <table className="mt-6 w-full max-w-xl text-left text-xs">
            <thead><tr className="text-muted-foreground"><th scope="col" className="py-1 font-normal">Asset class</th><th scope="col" className="py-1 font-normal">Your allocation</th><th scope="col" className="py-1 font-normal">Hypothetical bad-year change</th></tr></thead>
            <tbody>{ASSET_CLASSES.map(c => <tr key={c.id} className="border-t"><th scope="row" className="py-1.5 font-normal">{c.name}</th><td className="py-1.5">{plan.allocation[c.id]}%</td><td className="py-1.5">{BAD_YEAR_SHOCK[c.id] === 0 ? 'No change' : `${BAD_YEAR_SHOCK[c.id] > 0 ? '+' : ''}${BAD_YEAR_SHOCK[c.id] * 100}%`}</td></tr>)}</tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">Gold sometimes rises when shares fall — that’s the idea behind diversification, not a guarantee.</p>
          {stage === 2 && <Button data-crash-next type="button" className="mt-6 rounded-full" onClick={() => setStage(3)}>What could I do next?<ArrowRight size={15} /></Button>}
        </section>
      )}

      {stage === 3 && (
        <section aria-label="Decisions and scenarios" className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div>
              <h2 className="mb-3 font-serif text-2xl">1. How do you respond?</h2>
              <div className="grid gap-2" role="radiogroup" aria-label="Your response">
                {DECISIONS.map(d => (
                  <button key={d.id} type="button" role="radio" aria-checked={decision === d.id} onClick={() => setDecision(d.id)} className={cn('rounded-2xl border-2 border-ink p-4 text-left', decision === d.id ? 'border-ink bg-sun shadow-[3px_3px_0_#10110F]' : 'bg-white hover:bg-cream')}>
                    <span className="block text-sm font-medium">{d.name}</span><span className="text-xs text-muted-foreground">{d.description}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-3 font-serif text-2xl">2. How do markets behave?</h2>
              <div className="grid gap-2" role="radiogroup" aria-label="Market scenario">
                {MARKET_SCENARIOS.map(s => (
                  <button key={s.id} type="button" role="radio" aria-checked={scenarioId === s.id} onClick={() => setScenario(s.id)} className={cn('rounded-2xl border-2 border-ink p-4 text-left', scenarioId === s.id ? 'border-ink bg-sun shadow-[3px_3px_0_#10110F]' : 'bg-white hover:bg-cream')}>
                    <span className="block text-sm font-medium">{s.name}</span><span className="text-xs text-muted-foreground">{s.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl ink-card bg-sun p-6">
              <p className="eyebrow">At the end of your {plan.years}-year horizon · {scenario.name.toLowerCase()}</p>
              <p className="display mt-2 text-6xl" data-testid="scenario-value"><AnimatedNumber value={result.value} /></p>
              <p className="text-xs text-muted-foreground">Original plan: {formatINR(projection.value)} ({signed(result.value - projection.value)})</p>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t-2 border-ink pt-4 text-sm">
                <div><dt className="eyebrow">Contributions</dt><dd className="mt-1 tabular-nums">{formatINR(result.contributed)}</dd></div>
                <div><dt className="eyebrow">{result.gain >= 0 ? 'Gains' : 'Losses'}</dt><dd className="mt-1 tabular-nums">{formatINR(result.gain)}</dd></div>
                <div className="col-span-2"><dt className="eyebrow">Estimated impact on goal timeline</dt><dd className="mt-1">{result.monthsToGoal === null ? 'Goal not reached within 100 years under this path.' : delay === null ? `Goal reached in about ${formatDuration(result.monthsToGoal)}.` : delay > 0 ? `Goal reached about ${formatDuration(delay)} later than planned (${formatDuration(result.monthsToGoal)} in total).` : delay < 0 ? `Goal reached about ${formatDuration(-delay)} earlier than the original plan.` : 'No change to the goal timeline.'}</dd></div>
              </dl>
            </div>
            <div className="overflow-x-auto rounded-2xl ink-outline bg-card">
              <table className="w-full min-w-[420px] text-left text-xs">
                <caption className="p-4 pb-0 text-left text-xs text-muted-foreground">All three responses under a {scenario.name.toLowerCase()}</caption>
                <thead><tr><th scope="col" className="p-4 font-normal text-muted-foreground">Response</th><th scope="col" className="p-4 font-normal text-muted-foreground">Value at horizon</th><th scope="col" className="p-4 font-normal text-muted-foreground">Contributions</th><th scope="col" className="p-4 font-normal text-muted-foreground">Time to goal</th></tr></thead>
                <tbody>{DECISIONS.map(d => { const r = run(d.id); return <tr key={d.id} className={cn('border-t', d.id === decision && 'bg-cream')}><th scope="row" className="p-4 font-medium">{d.name}</th><td className="p-4 tabular-nums">{formatINR(r.value)}</td><td className="p-4 tabular-nums">{formatINR(r.contributed)}</td><td className="p-4">{formatDuration(r.monthsToGoal)}</td></tr>; })}</tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">Deterministic, hypothetical return paths. They illustrate how responses and recoveries change outcomes — they don’t predict what will happen.</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="rounded-full text-xs" onClick={reset}><RotateCcw size={13} />Reset simulation</Button>
              <Button asChild variant="ghost" className="rounded-full text-xs"><Link to="/plan">Adjust my plan</Link></Button>
            </div>
          </div>
        </section>
      )}
      {stage === 2 && <div className="mt-4"><Button type="button" variant="ghost" size="sm" className="rounded-full text-xs" onClick={reset}><RotateCcw size={13} />Reset simulation</Button></div>}
      <div className="mt-8"><AssumptionsPanel /></div>
      <NextStep to="/home" label="See where you stand today" hint="Your dashboard, with a clearly labelled demo portfolio." />
    </div>
  );
}
