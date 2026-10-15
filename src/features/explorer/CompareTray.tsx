import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { findInvestment, suggestedComparisons } from '@/data/investments';
import type { Investment } from '@/data/investments';
import type { ExplorerState } from './useExplorerState';

export function SuggestedComparisons({ state }: { state: ExplorerState }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs text-muted-foreground">Popular comparisons:</span>
      {suggestedComparisons.map(([a, b]) => (
        <button key={`${a}-${b}`} type="button" onClick={() => state.openComparison([a, b])} className="rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-xs font-medium transition-all hover:-translate-y-0.5 hover:bg-sun hover:shadow-[2px_2px_0_#10110F]">
          {findInvestment(a)!.shortName} <span className="italic text-muted-foreground">vs</span> {findInvestment(b)!.shortName}
        </button>
      ))}
    </div>
  );
}

/** Floating tray holding the (at most two) investments picked for comparison. */
export function CompareTray({ state, message, onCompare }: { state: ExplorerState; message: string | null; onCompare: (investment: Investment) => void }) {
  const { reduceMotion } = useAppMotion();
  const visible = state.compared.length > 0 && !state.item && !state.comparing;
  const ready = state.compared.length === 2;
  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-label="Comparison tray"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 24 }}
          className="fixed inset-x-4 bottom-4 z-30 mx-auto max-w-xl rounded-3xl ink-card bg-white p-3 shadow-[5px_5px_0_#10110F] backdrop-blur-md sm:p-4"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {[0, 1].map(slot => {
                const item = state.compared[slot];
                return item ? (
                  <span key={item.id} className="flex min-w-0 items-center gap-1 rounded-full border-2 border-ink bg-sun py-1 pl-3.5 pr-1 text-xs font-medium">
                    <span className="truncate">{item.shortName}</span>
                    <button type="button" aria-label={`Remove ${item.shortName} from comparison`} onClick={() => onCompare(item)} className="rounded-full p-1 hover:bg-white"><X size={12} /></button>
                  </span>
                ) : (
                  <span key={slot} className="truncate rounded-full border-2 border-dashed border-ink/40 px-3.5 py-1.5 text-xs text-muted-foreground">Pick one more</span>
                );
              })}
            </div>
            <button type="button" disabled={!ready} onClick={() => state.openComparison()} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-ink bg-plum px-4 py-2.5 text-xs font-semibold text-white transition-opacity disabled:opacity-35 sm:px-5">
              Compare<ArrowRight size={13} />
            </button>
          </div>
          <p role="status" className="px-2 pt-2 text-[11px] leading-snug text-muted-foreground empty:hidden">{message}</p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
