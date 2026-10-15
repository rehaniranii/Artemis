import { Badge } from '@/components/ui/badge';
import type { EvidenceKind } from '@/types/financial';
export function ScenarioBadge({kind}:{kind:EvidenceKind}){return <Badge variant="secondary" className="text-[10px] font-normal">{{concept:'Investment concept',assumption:'Illustrative assumption',simulation:'Simulated data'}[kind]}</Badge>;}
