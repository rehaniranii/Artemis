import { useId } from 'react';
import { motion } from 'motion/react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { cn } from '@/lib/utils';

/** Accessible tab bar with a sliding indicator. Panels are rendered by the caller based on `value`. */
export function Tabs<T extends string>({ value, onChange, items, label }: { value: T; onChange: (value: T) => void; items: { id: T; label: string }[]; label: string }) {
  const id = useId();
  const { reduceMotion } = useAppMotion();
  return (
    <div role="tablist" aria-label={label} className="mb-8 flex gap-1 overflow-x-auto rounded-full border-2 border-ink bg-white p-1 sm:inline-flex">
      {items.map(item => (
        <button key={item.id} id={`${id}-${item.id}`} role="tab" type="button" aria-selected={value === item.id} onClick={() => onChange(item.id)} className={cn('relative shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors sm:px-5', value === item.id ? 'text-white' : 'text-muted-foreground hover:text-ink')}>
          {value === item.id && <motion.span layoutId={reduceMotion ? undefined : `${id}-indicator`} transition={{ type: 'spring', stiffness: 400, damping: 34 }} className="absolute inset-0 rounded-full bg-ink" />}
          <span className="relative">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
