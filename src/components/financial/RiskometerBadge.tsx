import type { Riskometer } from '@/types/financial';
import { cn } from '@/lib/utils';

const LEVELS: Riskometer[] = ['Low', 'Low to Moderate', 'Moderate', 'Moderately High', 'High', 'Very High'];

/** SEBI riskometer level, shown as its official label with a six-step marker. */
export function RiskometerBadge({ level, className }: { level: Riskometer; className?: string }) {
  const index = LEVELS.indexOf(level);
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full border bg-white px-2.5 py-1 text-[11px]', className)}>
      <span aria-hidden="true" className="flex gap-0.5">
        {LEVELS.map((l, i) => <span key={l} className={cn('h-2 w-1.5 rounded-sm', i <= index ? (index >= 4 ? 'bg-warning' : 'bg-plum') : 'bg-muted')} />)}
      </span>
      <span>Riskometer: {level}</span>
    </span>
  );
}
