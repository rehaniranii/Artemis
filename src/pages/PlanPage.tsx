import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs } from '@/components/shared/Tabs';
import { Term } from '@/components/shared/Term';
import { INFLATION_RATE } from '@/data/assumptions';
import { PlanBuilder } from '@/features/plan/PlanBuilder';
import { CompareFutures, SipCalculator, TimeMachine } from '@/features/plan/FutureTools';
import { useFinancialStore } from '@/store/useFinancialStore';
import { NextStep } from '@/components/shared/NextStep';

type Tab = 'build' | 'sip' | 'time-machine' | 'compare';
const TABS: { id: Tab; label: string }[] = [{ id: 'build', label: 'Plan builder' }, { id: 'sip', label: 'SIP calculator' }, { id: 'time-machine', label: 'Time machine' }, { id: 'compare', label: 'Compare futures' }];

export default function PlanPage() {
  const [params, setParams] = useSearchParams();
  const tab = (TABS.some(t => t.id === params.get('tab')) ? params.get('tab') : 'build') as Tab;
  const inflation = params.get('real') === '1';
  const name = useFinancialStore(s => s.profile.name);
  const update = (key: string, value: string | null) => setParams(current => { const next = new URLSearchParams(current); value ? next.set(key, value) : next.delete(key); return next; }, { replace: true, preventScrollReset: true });
  return (
    <>
      <PageHeader eyebrow={`MY PLAN / ${name.toUpperCase()}`} title="A plan with room for life." description="Change anything — every number updates instantly. Projections are illustrative, not promises." />
      <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
        <Tabs label="My Plan sections" value={tab} onChange={next => update('tab', next === 'build' ? null : next)} items={TABS} />
        <label className="flex max-w-sm items-start gap-3 rounded-2xl ink-outline bg-white p-3 text-xs">
          <input type="checkbox" className="mt-0.5 accent-plum" checked={inflation} onChange={e => update('real', e.target.checked ? '1' : null)} />
          <span><span className="font-medium">Show future purchasing power</span><span className="mt-1 block text-muted-foreground">Prices rise over time (<Term id="inflation" />). At an illustrative {INFLATION_RATE * 100}% a year, a future rupee buys less — this shows future values in today’s money.</span></span>
        </label>
      </div>
      {tab === 'build' && <PlanBuilder inflation={inflation} />}
      {tab === 'sip' && <SipCalculator inflation={inflation} />}
      {tab === 'time-machine' && <TimeMachine inflation={inflation} />}
      {tab === 'compare' && <CompareFutures inflation={inflation} />}
      <NextStep to="/reality-lab" label="Test your plan in Reality Lab" hint="See what a bad year could do — without changing your plan." />
    </>
  );
}
