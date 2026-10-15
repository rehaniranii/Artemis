import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, HandCoins, Landmark, Plus, Repeat, Shapes, Sprout, type LucideIcon } from 'lucide-react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { cn } from '@/lib/utils';
import { categories, investmentsIn, type CategoryId, type Investment } from '@/data/investments';
import type { ExplorerState } from './useExplorerState';

const icons: Record<CategoryId, LucideIcon> = { stability: Landmark, 'fixed-income': HandCoins, growth: Sprout, diversification: Shapes, methods: Repeat };
const assetCategories = categories.filter(c => c.id !== 'methods');
const methods = categories.find(c => c.id === 'methods')!;

export function CategoryExplorer({ state, onCompare }: { state: ExplorerState; onCompare: (investment: Investment) => void }) {
  const { reduceMotion } = useAppMotion();
  const panel = useRef<HTMLDivElement>(null);
  const selected = categories.find(c => c.id === state.category);
  const choose = (id: CategoryId) => state.selectCategory(state.category === id ? null : id);

  useEffect(() => {
    // Bring the revealed options into view on small screens, where they appear below every card.
    if (state.category && window.innerWidth < 768) panel.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [state.category, reduceMotion]);

  return (
    <section aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="sr-only">Investment categories</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {assetCategories.map((category, index) => {
          const Icon = icons[category.id];
          const active = state.category === category.id;
          const dimmed = state.category !== null && !active;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              aria-controls="category-options"
              onClick={() => choose(category.id)}
              className={cn(
                'group relative flex items-center gap-4 rounded-3xl border p-5 text-left transition-all duration-300 sm:min-h-48 sm:flex-col sm:items-stretch sm:justify-between sm:p-6',
                active ? 'border-[#557355] bg-secondary/70 shadow-[0_16px_40px_#5573551f]' : 'bg-white/70 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-white hover:shadow-[0_12px_32px_#2225210a]',
                dimmed && 'opacity-60 hover:opacity-100',
              )}
            >
              <div className="flex shrink-0 items-start justify-between">
                <span className={cn('grid size-11 place-items-center rounded-full transition-colors', active ? 'bg-[#557355] text-white' : 'bg-secondary/70 text-[#557355]')}><Icon size={19} strokeWidth={1.6} /></span>
                <span className="hidden text-[10px] tabular-nums text-muted-foreground sm:inline">0{index + 1}</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl leading-none sm:mt-8 sm:text-[28px]">{category.name}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{category.purpose}</p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-pressed={state.category === 'methods'}
        aria-controls="category-options"
        onClick={() => choose('methods')}
        className={cn(
          'mt-3 flex w-full flex-col gap-3 rounded-3xl border border-dashed p-5 text-left transition-all sm:flex-row sm:items-center sm:justify-between sm:px-6',
          state.category === 'methods' ? 'border-[#557355] bg-secondary/60' : 'border-primary/50 bg-transparent hover:bg-white/60',
          state.category !== null && state.category !== 'methods' && 'opacity-60 hover:opacity-100',
        )}
      >
        <span className="flex items-center gap-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-primary/50 text-[#557355]"><Repeat size={15} /></span>
          <span>
            <span className="block text-sm font-medium">{methods.name}: SIP and lump sum</span>
            <span className="block text-xs text-muted-foreground">Not a type of investment — a way of putting money into one.</span>
          </span>
        </span>
        <span className="flex items-center gap-1 pl-13 text-xs text-muted-foreground sm:pl-0">{state.category === 'methods' ? 'Showing' : 'See how they differ'}<ArrowRight size={13} /></span>
      </button>

      <div ref={panel} id="category-options" className="scroll-mt-28">
        <AnimatePresence mode="wait" initial={false}>
          {selected && (
            <motion.div
              key={selected.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8, transition: { duration: 0.15 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 rounded-3xl bg-white/60 p-6 ring-1 ring-border md:p-8"
            >
              <div className="mb-7 max-w-2xl">
                <p className="eyebrow mb-3">{selected.name}</p>
                <p className="font-serif text-3xl leading-tight md:text-4xl">{selected.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {investmentsIn(selected.id).map((investment, index) => (
                  <motion.article
                    key={investment.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduceMotion ? 0 : 0.08 + index * 0.06, duration: 0.3 }}
                    className="flex flex-col rounded-2xl border bg-card p-6"
                  >
                    <h3 className="font-serif text-3xl">{investment.name}</h3>
                    <p className="mt-2 text-sm">{investment.tagline}</p>
                    <p className="mt-4 border-l-2 border-primary/50 pl-3 text-xs italic leading-relaxed text-muted-foreground">{investment.analogy}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-7">
                      <button type="button" onClick={() => state.openItem(investment.id)} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs text-background transition-transform hover:scale-[1.02]">
                        Understand {investment.shortName}<ArrowRight size={14} />
                      </button>
                      <CompareToggle investment={investment} state={state} onCompare={onCompare} />
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export function CompareToggle({ investment, state, onCompare }: { investment: Investment; state: ExplorerState; onCompare: (investment: Investment) => void }) {
  const on = state.isCompared(investment.id);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={`${on ? 'Remove' : 'Add'} ${investment.shortName} ${on ? 'from' : 'to'} comparison`}
      onClick={() => onCompare(investment)}
      className={cn('inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs transition-colors', on ? 'border-[#557355] bg-secondary text-foreground' : 'text-muted-foreground hover:border-primary hover:text-foreground')}
    >
      {on ? <Check size={13} /> : <Plus size={13} />}{on ? 'Comparing' : 'Compare'}
    </button>
  );
}
