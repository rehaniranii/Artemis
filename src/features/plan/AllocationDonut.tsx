import { motion } from 'motion/react';
import { ASSET_CLASSES } from '@/data/assumptions';
import { useAppMotion } from '@/hooks/useAppMotion';
import type { PortfolioAllocation } from '@/types/financial';

const R = 40, C = 2 * Math.PI * R;

/** Ink-outlined donut whose segments glide to new sizes when the allocation changes. */
export function AllocationDonut({ allocation, size = 132 }: { allocation: PortfolioAllocation; size?: number }) {
  const { reduceMotion } = useAppMotion();
  let offset = 0;
  const label = ASSET_CLASSES.map(c => `${c.short} ${allocation[c.id]}%`).join(', ');
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Allocation: ${label}`} className="shrink-0 -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="#10110F" strokeWidth="22" />
        {ASSET_CLASSES.map(c => {
          const length = (allocation[c.id] / 100) * C;
          const dash = `${Math.max(0, length - 0.8)} ${C}`;
          const el = <motion.circle key={c.id} cx="50" cy="50" r={R} fill="none" stroke={c.color} strokeWidth="17" initial={false} animate={{ strokeDasharray: dash, strokeDashoffset: -offset }} transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }} />;
          offset += length;
          return el;
        })}
      </svg>
      <ul className="grid gap-1.5 text-xs">
        {ASSET_CLASSES.map(c => (
          <li key={c.id} className="flex items-center gap-2"><span className="size-3.5 rounded-full border-2 border-ink" style={{ background: c.color }} /><span className="w-14">{c.short}</span><span className="font-semibold tabular-nums">{allocation[c.id]}%</span></li>
        ))}
      </ul>
    </div>
  );
}
