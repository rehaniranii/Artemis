import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fundConcepts } from '@/data/funds';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ScenarioBadge } from '@/components/financial/ScenarioBadge';
import { RiskBadge } from '@/components/financial/RiskBadge';
import { Button } from '@/components/ui/button';
import NotFoundPage from './NotFoundPage';
export default function FundDetailPage(){const {fundId}=useParams();const fund=fundConcepts.find(item=>item.id===fundId);if(!fund)return <NotFoundPage/>;return <><Link to="/explore" className="mb-8 inline-flex items-center gap-2 text-xs text-muted-foreground"><ArrowLeft size={14}/>Back to Explore</Link><PageHeader eyebrow="FUND CONCEPT / DETAIL PREVIEW" title={fund.name} description={fund.description}/><div className="mb-8 flex gap-3"><ScenarioBadge kind="concept"/><RiskBadge risk={fund.risk}/></div><EmptyState title="Understand before you choose." description="This route is ready for plain-language risk, cost and access details. No fictional fund returns or product recommendations are shown." action={<Button asChild variant="outline" className="rounded-full"><Link to="/explore">Explore another concept</Link></Button>}/></>;}
