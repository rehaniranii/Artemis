import { Badge } from '@/components/ui/badge';
import type { RiskTolerance } from '@/types/financial';
export function RiskBadge({risk}:{risk:RiskTolerance}){const names={low:'Lower risk',moderate:'Moderate risk',high:'Higher risk'};return <Badge variant="outline" className="gap-2 border-border bg-background text-[10px] font-normal"><span aria-hidden="true">{risk==='high'?'●●●':risk==='moderate'?'●●○':'●○○'}</span>{names[risk]}</Badge>;}
