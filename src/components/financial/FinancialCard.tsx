import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FundConcept } from '@/types/financial';
import { Card, CardContent } from '@/components/ui/card';
import { RiskBadge } from './RiskBadge';
import { ScenarioBadge } from './ScenarioBadge';
export function FinancialCard({fund}:{fund:FundConcept}){return <Card className="h-full rounded-2xl shadow-none transition-shadow hover:shadow-sm"><CardContent className="p-6"><ScenarioBadge kind={fund.evidence}/><h2 className="mb-3 mt-7 font-serif text-3xl">{fund.name}</h2><p className="min-h-16 text-sm text-muted-foreground">{fund.description}</p><div className="mt-5"><RiskBadge risk={fund.risk}/></div><Link to={`/explore/funds/${fund.id}`} className="mt-8 flex items-center justify-between border-t pt-4 text-xs font-medium">Open concept preview<ArrowUpRight size={16}/></Link></CardContent></Card>;}
