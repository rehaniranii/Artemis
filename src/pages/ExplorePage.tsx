import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FinancialCard } from '@/components/financial/FinancialCard';
import { fundConcepts } from '@/data/funds';
import { explorerIntro } from '@/features/explorer/module';
export default function ExplorePage(){return <><PageHeader eyebrow="EXPLORE / MODULE PREVIEW" title={explorerIntro.title} description={explorerIntro.description}/><div className="grid gap-5 md:grid-cols-3">{fundConcepts.map(fund=><FinancialCard fund={fund} key={fund.id}/>)}<div className="flex flex-col justify-between rounded-2xl bg-secondary/60 p-7"><div><p className="eyebrow">A USEFUL DISTINCTION</p><h2 className="mb-5 mt-8 font-serif text-3xl">A SIP is a method.<br/>Not an asset.</h2><p className="text-sm text-muted-foreground">It means contributing regularly. The investment underneath determines the risk.</p></div><Link to="/mono-match" className="mt-8 flex items-center justify-between text-xs">Preview MONO Match<ArrowUpRight size={16}/></Link></div></div><p className="mt-6 text-xs text-muted-foreground">These are educational categories, not actual fund listings or product recommendations. Debt investments can lose value.</p></>;}
