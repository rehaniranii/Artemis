import { useId } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { formatINR } from '@/lib/format';
export function InvestmentSlider({label,value,onChange,min=0,max,step=100,description,format=formatINR}:{label:string;value:number;onChange:(value:number)=>void;min?:number;max:number;step?:number;description?:string;format?:(value:number)=>string}){const id=useId();return <div className="space-y-4"><div className="flex items-center justify-between gap-4"><Label id={id}>{label}</Label><output className="text-sm tabular-nums">{format(value)}</output></div><Slider aria-labelledby={id} aria-describedby={description?`${id}-help`:undefined} value={[Math.min(max,Math.max(min,value))]} min={min} max={max} step={step} onValueChange={([next])=>onChange(next)} disabled={max<=min}/>{description&&<p id={`${id}-help`} className="text-xs text-muted-foreground">{description}</p>}</div>;}
