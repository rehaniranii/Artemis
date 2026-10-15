import { motion } from 'motion/react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { cn } from '@/lib/utils';

/** Ink-outlined progress ring that sweeps to its value on mount and on change. */
export function ProgressRing({ value, label, className }: { value: number; label: string; className?: string }) {
  const { reduceMotion } = useAppMotion();
  const progress = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  return (
    <div className={cn('relative size-24', className)} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r="40" fill="#FFFDF2" stroke="#10110F" strokeWidth="18" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#FFF5C7" strokeWidth="12" />
        <motion.circle cx="50" cy="50" r="40" fill="none" stroke="#4B3B63" strokeWidth="12" pathLength="100" strokeDasharray="100" initial={reduceMotion ? false : { strokeDashoffset: 100 }} animate={{ strokeDashoffset: 100 - progress }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-serif text-xl">{Math.round(progress)}%</span>
    </div>
  );
}
