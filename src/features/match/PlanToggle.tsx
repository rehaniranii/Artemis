import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFinancialStore } from '@/store/useFinancialStore';

/** Adds or removes a fund from the plan; the plan builder decides how much it receives. */
export function PlanToggle({ fundId, size = 'sm' }: { fundId: string; size?: 'sm' | 'lg' }) {
  const inPlan = useFinancialStore(s => s.planFunds.some(f => f.fundId === fundId));
  const add = useFinancialStore(s => s.addPlanFund), remove = useFinancialStore(s => s.removePlanFund);
  return (
    <Button type="button" variant={inPlan ? 'secondary' : 'outline'} size={size === 'lg' ? 'lg' : 'sm'} className="rounded-full text-xs" aria-pressed={inPlan} onClick={() => (inPlan ? remove(fundId) : add(fundId))}>
      {inPlan ? <><Check size={13} />In My Plan</> : <><Plus size={13} />Add to My Plan</>}
    </Button>
  );
}

