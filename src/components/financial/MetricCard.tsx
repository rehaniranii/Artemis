import { Card, CardContent } from '@/components/ui/card';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { InfoTooltip } from './InfoTooltip';
export function MetricCard({label,value,description,tooltip}:{label:string;value:number;description:string;tooltip?:string}){return <Card className="rounded-2xl shadow-none"><CardContent className="p-6"><div className="flex items-center gap-2"><p className="eyebrow">{label}</p>{tooltip&&<InfoTooltip label={`About ${label.toLowerCase()}`}>{tooltip}</InfoTooltip>}</div><AnimatedNumber value={value} className="my-5 block font-serif text-4xl"/><p className="text-xs text-muted-foreground">{description}</p></CardContent></Card>;}
