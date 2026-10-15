import { useSearchParams } from 'react-router-dom';
import { categories, findInvestment, type CategoryId, type Investment } from '@/data/investments';

export type CompareResult = 'added' | 'removed' | 'full' | 'mixed-kinds';

/**
 * Explorer state lives in the URL (?category=&item=&compare=a,b&view=compare)
 * so a detail or comparison can be linked, reloaded, or closed with Back.
 */
export function useExplorerState() {
  const [params, setParams] = useSearchParams();
  const rawCategory = params.get('category');
  const category = categories.some(c => c.id === rawCategory) ? rawCategory as CategoryId : null;
  const item = findInvestment(params.get('item')) ?? null;
  const compareIds = [...new Set((params.get('compare') ?? '').split(','))].filter(id => findInvestment(id)).slice(0, 2);
  const compared = compareIds.map(id => findInvestment(id)!) as Investment[];
  const comparing = params.get('view') === 'compare' && compared.length === 2;

  function update(patch: Record<string, string | null>, push = false) {
    setParams(current => {
      const next = new URLSearchParams(current);
      for (const [key, value] of Object.entries(patch)) value ? next.set(key, value) : next.delete(key);
      return next;
    }, { replace: !push, preventScrollReset: true });
  }

  return {
    category, item, compared, comparing,
    selectCategory: (id: CategoryId | null) => update({ category: id }),
    openItem: (id: string) => update({ item: id, view: null }, true),
    closeItem: () => update({ item: null }),
    openComparison: (ids?: [string, string]) => update({ compare: ids ? ids.join(',') : compareIds.join(','), view: 'compare', item: null }, true),
    closeComparison: () => update({ view: null }),
    clearCompare: () => update({ compare: null, view: null }),
    /** Toggles an investment in the two-item comparison. Methods are only compared with methods. */
    toggleCompare(investment: Investment): CompareResult {
      if (compareIds.includes(investment.id)) { update({ compare: compareIds.filter(id => id !== investment.id).join(',') || null }); return 'removed'; }
      if (compared.length === 2) return 'full';
      if (compared.length === 1 && compared[0].kind !== investment.kind) return 'mixed-kinds';
      update({ compare: [...compareIds, investment.id].join(',') });
      return 'added';
    },
    isCompared: (id: string) => compareIds.includes(id),
  };
}

export type ExplorerState = ReturnType<typeof useExplorerState>;
