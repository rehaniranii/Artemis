import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
export function InfoTooltip({label,children}:{label:string;children:string}){return <Tooltip><TooltipTrigger asChild><button type="button" aria-label={label} className="inline-flex rounded-full text-muted-foreground"><Info size={14}/></button></TooltipTrigger><TooltipContent className="max-w-64 text-xs leading-relaxed">{children}</TooltipContent></Tooltip>;}
