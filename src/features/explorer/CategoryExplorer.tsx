import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, Plus, Repeat } from 'lucide-react';
import { Coin, MoneyCard, Ring, Sprout } from '@/components/illustrations';
import { usePointerParallax } from '@/lib/motion';
import { useAppMotion } from '@/hooks/useAppMotion';
import { cn } from '@/lib/utils';
import { categories, investmentsIn, type CategoryId, type Investment } from '@/data/investments';
import type { ExplorerState } from './useExplorerState';

/** Each category's own colour and illustration within the Morrow palette. */
const identity: Record<Exclude<CategoryId, 'methods'>, { bg: string; text: string; art: React.ReactNode }> = {
  stability: { bg: 'bg-sun', text: 'text-ink', art: <Coin className="w-20" /> },
  'fixed-income': { bg: 'bg-mint', text: 'text-ink', art: <MoneyCard className="w-28" fill="#FFF5C7" /> },
  growth: { bg: 'bg-plum', text: 'text-[#FFFDF2]', art: <Sprout className="w-20" /> },
  diversification: { bg: 'bg-cream', text: 'text-ink', art: <Ring className="w-20" fill="#FFD95A" /> },
};
const assetCategories = categories.filter(c => c.id !== 'methods');
const methods = categories.find(c => c.id === 'methods')!;

export function CategoryExplorer({ state, onCompare }: { state: ExplorerState; onCompare: (investment: Investment) => void }) {
  const { reduceMotion } = useAppMotion();
  const panel = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  usePointerParallax(grid);
  const selected = categories.find(c => c.id === state.category);
  const choose = (id: CategoryId) => state.selectCategory(state.category === id ? null : id);

  useEffect(() => {
    // Bring the revealed options into view on small screens, where they appear below every card.
    if (state.category && window.innerWidth < 768) panel.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [state.category, reduceMotion]);

  return (
    <section aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="sr-only">Investment categories</h2>
      <div ref={grid} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {assetCategories.map((category, index) => {
          const look = identity[category.id as keyof typeof identity];
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
                'group relative flex items-center gap-4 overflow-hidden rounded-3xl ink-card ink-lift p-5 text-left sm:min-h-56 sm:flex-col sm:items-stretch sm:justify-between sm:p-6',
                look.bg, look.text,
                active && '-translate-x-1 -translate-y-1 shadow-[9px_9px_0_#10110F] ring-4 ring-ink ring-offset-2 ring-offset-paper',
                dimmed && 'opacity-55 saturate-50 hover:opacity-100 hover:saturate-100',
              )}
            >
              <div className="flex shrink-0 items-start justify-between">
                <span aria-hidden="true" className="w-16 shrink-0 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:w-auto"><span data-depth="0.5" className="block">{look.art}</span></span>
                <span className="hidden font-serif text-2xl tabular-nums opacity-60 sm:inline">0{index + 1}</span>
              </div>
              <div>
                <h3 className="display text-3xl sm:mt-6 sm:text-[34px]">{category.name}</h3>
                <p className="mt-2 text-xs opacity-75">{category.purpose}</p>
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
          'mt-4 flex w-full flex-col gap-3 rounded-3xl border-2 border-dashed border-ink p-5 text-left transition-all sm:flex-row sm:items-center sm:justify-between sm:px-6',
          state.category === 'methods' ? 'border-ink bg-sun shadow-[3px_3px_0_#10110F]' : 'bg-white hover:bg-cream',
          state.category !== null && state.category !== 'methods' && 'opacity-60 hover:opacity-100',
        )}
      >
        <span className="flex items-center gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-mint"><Repeat size={16} /></span>
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
              className="mt-8 rounded-3xl ink-card bg-cream p-6 md:p-8"
            >
              <div className="mb-7 max-w-2xl">
                <p className="eyebrow mb-3">{selected.name}</p>
                <p className="display text-3xl md:text-5xl">{selected.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {investmentsIn(selected.id).map((investment, index) => (
                  <motion.article
                    key={investment.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduceMotion ? 0 : 0.08 + index * 0.06, duration: 0.3 }}
                    className="flex flex-col rounded-2xl ink-outline ink-lift bg-card p-6"
                  >
                    <h3 className="display text-4xl">{investment.name}</h3>
                    <p className="mt-2 text-sm">{investment.tagline}</p>
                    <p className="mt-4 border-l-4 border-sun pl-3 text-xs italic leading-relaxed text-muted-foreground">{investment.analogy}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-7">
                      <button type="button" onClick={() => state.openItem(investment.id)} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs text-white transition-transform hover:scale-[1.02]">
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
      className={cn('inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-4 py-2 text-xs transition-colors', on ? 'bg-sun font-semibold text-ink' : 'bg-white text-muted-foreground hover:bg-cream hover:text-ink')}
    >
      {on ? <Check size={13} /> : <Plus size={13} />}{on ? 'Comparing' : 'Compare'}
    </button>
  );
}
