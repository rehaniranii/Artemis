import { motion } from 'motion/react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { amountInWords } from './journey';

const FIRST_MILLION = 1000000;
const SIZE = 220;
const MAX_RADIUS = 100;

/** Area-true comparison of the goal against ₹10 lakh (one million rupees), so bigger goals look proportionally bigger. */
export function GoalVisual({ amount }: { amount: number }) {
  const { reduceMotion } = useAppMotion();
  const largest = Math.max(amount, FIRST_MILLION);
  const radius = (value: number) => Math.max(3, MAX_RADIUS * Math.sqrt(value / largest));
  const ratio = amount / FIRST_MILLION;
  const comparison =
    amount === FIRST_MILLION ? 'Exactly your first million.'
      : ratio > 1 ? `${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(ratio)}× your first million.`
        : `${Math.round(ratio * 100)}% of the way to your first million.`;
  const center = SIZE / 2;
  const baseline = center + MAX_RADIUS;
  return (
    <figure className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-44 shrink-0 sm:size-52" role="img" aria-label={`Your ₹${amountInWords(amount)} goal compared with ₹10 lakh. ${comparison}`}>
        {/* Both circles sit on a shared baseline, like coins on a table. */}
        <motion.circle
          cx={center}
          initial={false}
          animate={{ r: radius(amount), cy: baseline - radius(amount) }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
          fill="#FFF5C7"
          stroke="#4B3B63"
        />
        <motion.circle
          cx={center}
          initial={false}
          animate={{ r: radius(FIRST_MILLION), cy: baseline - radius(FIRST_MILLION) }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
          fill="none"
          stroke="#4B3B63"
          strokeDasharray="4 5"
        />
        <line x1={center - MAX_RADIUS} x2={center + MAX_RADIUS} y1={baseline + 0.5} y2={baseline + 0.5} stroke="#D6CB9E" />
      </svg>
      <figcaption className="space-y-3 text-center text-xs text-muted-foreground sm:text-left">
        <p className="font-serif text-2xl text-foreground">{comparison}</p>
        <p className="flex items-center justify-center gap-2 sm:justify-start"><span className="size-3 rounded-full border-2 border-ink bg-cream" />Your goal · ₹{amountInWords(amount)}</p>
        <p className="flex items-center justify-center gap-2 sm:justify-start"><span className="size-3 rounded-full border border-dashed border-plum" />₹10 lakh · one million rupees</p>
      </figcaption>
    </figure>
  );
}
