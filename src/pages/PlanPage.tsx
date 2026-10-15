import { Link } from 'react-router-dom';
import { ModulePlaceholder } from '@/components/shared/ModulePlaceholder';
import { moduleConfig } from '@/features/planner/module';
export default function PlanPage(){return <><ModulePlaceholder config={moduleConfig}/><div className="mt-8 flex flex-wrap gap-4 text-xs text-muted-foreground"><Link to="/simulator" className="underline underline-offset-4">Scenario simulator preview</Link><Link to="/mono-match" className="underline underline-offset-4">MONO Match preview</Link></div></>;}
