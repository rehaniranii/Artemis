import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
export function Disclaimer({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <p className={cn('flex items-start gap-2 text-[11px] leading-relaxed', inverse ? 'text-[#FFFDF2]/75' : 'text-muted-foreground')}>
      <Info size={13} className="mt-0.5 shrink-0" />
      <span>{compact ? 'Educational prototype. No real investments or transactions.' : 'Morrow is an educational prototype, not personalized investment advice. Examples and projections are illustrative; returns are not guaranteed. No accounts, transactions or live market data are connected.'}</span>
    </p>
  );
}
