import { Label } from '@/components/ui/label';
import { scenarios } from '@/data/assumptions';
import { useFinancialStore } from '@/store/useFinancialStore';
import type { ScenarioId } from '@/types/financial';
export function ScenarioPicker(){const scenario=useFinancialStore(s=>s.scenario),setScenario=useFinancialStore(s=>s.setScenario);return <div className="rounded-2xl border bg-white p-6"><Label htmlFor="scenario">Scenario preference</Label><select id="scenario" value={scenario} onChange={e=>setScenario(e.target.value as ScenarioId)} className="mt-3 h-11 w-full rounded-xl border bg-background px-3 text-sm">{scenarios.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select><p className="mt-3 text-xs text-muted-foreground">Your choice is saved. Scenario playback will be implemented in a later phase.</p></div>;}
