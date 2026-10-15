import { useId, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { cn } from '@/lib/utils';

const grouped = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** Rupee input that groups digits the Indian way (2,50,000) while typing. */
export function CurrencyInput({ value, onChange, label, suffix, size = 'lg', invalid, describedBy, autoFocus }: {
  value: number; onChange: (value: number) => void; label: string; suffix?: string;
  size?: 'lg' | 'md'; invalid?: boolean; describedBy?: string; autoFocus?: boolean;
}) {
  return (
    <div className={cn('flex items-baseline gap-2 border-b-2 pb-2 transition-colors focus-within:border-[#557355]', invalid ? 'border-destructive' : 'border-input')}>
      <span aria-hidden="true" className={cn('font-serif text-muted-foreground', size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-3xl')}>₹</span>
      <input
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        autoFocus={autoFocus}
        inputMode="numeric"
        autoComplete="off"
        value={value > 0 ? grouped.format(value) : ''}
        placeholder="0"
        onChange={event => {
          const digits = event.target.value.replace(/\D/g, '').slice(0, 10);
          onChange(digits ? Number(digits) : 0);
        }}
        className={cn('w-full min-w-0 bg-transparent font-serif tabular-nums outline-none placeholder:text-muted-foreground/50 focus-visible:outline-none', size === 'lg' ? 'text-5xl sm:text-6xl' : 'text-4xl')}
      />
      {suffix && <span className="shrink-0 text-sm text-muted-foreground">{suffix}</span>}
    </div>
  );
}

export function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn('rounded-full border px-4 py-2 text-xs transition-colors', selected ? 'border-[#557355] bg-secondary text-foreground' : 'bg-white/60 text-muted-foreground hover:border-primary hover:text-foreground')}
    >
      {children}
    </button>
  );
}

/** Single-choice answers as large tappable cards, backed by native radios for keyboard and screen readers. */
export function ChoiceList<T extends string>({ options, value, onChange, labelledBy }: {
  options: { value: T; label: string; hint?: string }[]; value: T; onChange: (value: T) => void; labelledBy: string;
}) {
  const name = useId();
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid gap-3">
      {options.map(option => {
        const selected = option.value === value;
        return (
          <label
            key={option.value}
            className={cn('group flex cursor-pointer items-center gap-4 rounded-2xl border bg-white/70 p-5 transition-all has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-[#557355] sm:p-6', selected ? 'border-[#557355] bg-secondary/50 shadow-[0_6px_24px_#5573551a]' : 'hover:border-primary/60 hover:bg-white')}
          >
            <input type="radio" name={name} value={option.value} checked={selected} onChange={() => onChange(option.value)} className="sr-only" />
            <span aria-hidden="true" className={cn('grid size-6 shrink-0 place-items-center rounded-full border transition-colors', selected ? 'border-[#557355] bg-[#557355] text-white' : 'border-input bg-white')}>
              {selected && <Check size={14} strokeWidth={2.5} />}
            </span>
            <span>
              <span className="block text-sm font-medium sm:text-base">{option.label}</span>
              {option.hint && <span className="mt-1 block text-xs text-muted-foreground">{option.hint}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function Callout({ tone = 'calm', children }: { tone?: 'calm' | 'warning'; children: ReactNode }) {
  const { reduceMotion } = useAppMotion();
  return (
    <motion.div
      role="status"
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('rounded-2xl p-5 text-sm leading-relaxed', tone === 'warning' ? 'border border-warning/40 bg-[#bd776312]' : 'bg-secondary/50')}
    >
      {children}
    </motion.div>
  );
}
