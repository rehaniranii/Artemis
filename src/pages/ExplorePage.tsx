import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Term } from '@/components/shared/Term';
import { featuredTerms } from '@/data/glossary';
import type { Investment } from '@/data/investments';
import { explorerIntro } from '@/features/explorer/module';
import { ExploreIntro } from '@/features/explorer/ExploreIntro';
import { CategoryExplorer } from '@/features/explorer/CategoryExplorer';
import { InvestmentDetail, ComparisonView } from '@/features/explorer/InvestmentPanels';
import { CompareTray, SuggestedComparisons } from '@/features/explorer/CompareTray';
import { useExplorerState, type CompareResult } from '@/features/explorer/useExplorerState';

const compareMessages: Record<CompareResult, string | null> = {
  added: null,
  removed: null,
  full: 'Two at a time keeps it clear. Remove one to swap it out.',
  'mixed-kinds': 'SIP and lump sum are ways of investing, not investments — so they’re compared with each other.',
};

export default function ExplorePage() {
  const state = useExplorerState();
  const [message, setMessage] = useState<string | null>(null);
  const onCompare = (investment: Investment) => setMessage(compareMessages[state.toggleCompare(investment)]);
  return (
    <>
      <PageHeader eyebrow="EXPLORE / UNDERSTAND YOUR OPTIONS" title={explorerIntro.title} description={explorerIntro.description} />
      <ExploreIntro />
      <CategoryExplorer state={state} onCompare={onCompare} />
      <div className="mt-10 grid gap-8 border-t pt-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <SuggestedComparisons state={state} />
        <Link to="/mono-match" className="flex items-center gap-2 text-xs font-medium">Not sure where to start? Try MONO Match<ArrowUpRight size={15} /></Link>
      </div>
      <section aria-labelledby="glossary-heading" className="mt-8 rounded-3xl bg-secondary/40 p-6 md:p-8">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="glossary-heading" className="font-serif text-3xl">Words you’ll meet</h2>
          <p className="text-xs text-muted-foreground">Tap any word for a plain-language meaning. Underlined words work the same way.</p>
        </div>
        <div className="flex flex-wrap gap-2">{featuredTerms.map(id => <Term key={id} id={id} variant="chip" />)}</div>
      </section>
      <p className="mt-6 pb-20 text-xs text-muted-foreground">Educational descriptions of investment types, not product listings or recommendations. Apart from bank deposits, every option here can lose value.</p>
      <InvestmentDetail state={state} onCompare={onCompare} />
      <ComparisonView state={state} />
      <CompareTray state={state} message={message} onCompare={onCompare} />
    </>
  );
}
