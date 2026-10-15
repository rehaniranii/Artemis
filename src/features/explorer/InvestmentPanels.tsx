import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ThumbsUp, TriangleAlert } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { RichText } from '@/components/shared/Term';
import { categories, compareCriteria, detailQuestions, type Investment } from '@/data/investments';
import { CompareToggle } from './CategoryExplorer';
import type { ExplorerState } from './useExplorerState';

function Drawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <Sheet open={open} onOpenChange={next => { if (!next) onClose(); }}>
      <SheetContent className="w-full gap-0 overflow-y-auto bg-background p-0 sm:max-w-2xl">
        {children}
      </SheetContent>
    </Sheet>
  );
}

function MatchLink({ text }: { text: string }) {
  return (
    <Link to="/mono-match" className="flex items-center justify-between gap-4 rounded-2xl bg-foreground p-5 text-sm text-background transition-opacity hover:opacity-90">
      <span><span className="block font-serif text-2xl">MONO Match</span><span className="text-xs text-background/70">{text}</span></span>
      <ArrowUpRight size={18} />
    </Link>
  );
}

export function InvestmentDetail({ state, onCompare }: { state: ExplorerState; onCompare: (investment: Investment) => void }) {
  const item = state.item;
  return (
    <Drawer open={Boolean(item)} onClose={state.closeItem}>
      {item && (
        <article>
          <header className="border-b bg-secondary/50 px-6 pb-8 pt-12 sm:px-10">
            <p className="eyebrow">{categories.find(c => c.id === item.category)?.name}{item.kind === 'method' && ' · a method, not an asset'}</p>
            <SheetTitle className="mt-4 font-serif text-5xl font-normal leading-none">{item.name}</SheetTitle>
            <SheetDescription className="mt-3 text-base text-foreground">{item.tagline}</SheetDescription>
            <p className="mt-6 rounded-2xl bg-white/70 p-4 text-sm italic leading-relaxed"><span className="not-italic text-muted-foreground">Think of it like this: </span>{item.analogy}</p>
          </header>

          <dl className="divide-y px-6 sm:px-10">
            {detailQuestions.map(({ key, question }) => (
              <div key={key} className="grid gap-2 py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground sm:pt-0.5">{question}</dt>
                <dd className="text-sm leading-relaxed"><RichText text={item.detail[key]} /></dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="catch-heading" className="mx-6 my-6 rounded-3xl border bg-card p-6 sm:mx-10 sm:p-7">
            <h3 id="catch-heading" className="font-serif text-3xl">What’s the catch?</h3>
            <p className="mt-1 text-xs text-muted-foreground">Every investment has both sides. Here are the two, side by side.</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-medium"><ThumbsUp size={15} className="text-[#557355]" />Why people consider it</h4>
                <ul className="space-y-2.5 text-sm leading-relaxed">{item.why.map(point => <li key={point} className="flex gap-2.5"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#557355]" />{point}</li>)}</ul>
              </div>
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-medium"><TriangleAlert size={15} className="text-warning" />What could go wrong?</h4>
                <ul className="space-y-2.5 text-sm leading-relaxed">{item.catches.map(point => <li key={point} className="flex gap-2.5"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-warning" />{point}</li>)}</ul>
              </div>
            </div>
          </section>

          <footer className="space-y-4 px-6 pb-10 sm:px-10">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>Want to see it next to something else?</span>
              <CompareToggle investment={item} state={state} onCompare={onCompare} />
            </div>
            <MatchLink text="See how ideas like this could fit your plan." />
            <p className="text-[11px] leading-relaxed text-muted-foreground">General education, not a recommendation. Product terms, fees and tax rules vary and change — check the latest documents before investing.</p>
          </footer>
        </article>
      )}
    </Drawer>
  );
}

export function ComparisonView({ state }: { state: ExplorerState }) {
  const [a, b] = state.compared;
  return (
    <Drawer open={state.comparing} onClose={state.closeComparison}>
      {state.comparing && a && b && (
        <article>
          <header className="border-b bg-secondary/50 px-6 pb-8 pt-12 sm:px-10">
            <p className="eyebrow">Side by side</p>
            <SheetTitle className="mt-4 font-serif text-5xl font-normal leading-none">{a.shortName} <span className="italic text-[#6a8769]">vs</span> {b.shortName}</SheetTitle>
            <SheetDescription className="mt-3 text-sm text-muted-foreground">Neither is “better”. They’re built for different jobs — this shows what each job looks like.</SheetDescription>
          </header>
          <div className="px-6 sm:px-10">
            <div aria-hidden="true" className="hidden grid-cols-[130px_1fr_1fr] gap-6 border-b py-5 sm:grid">
              <span />
              {[a, b].map(item => <div key={item.id}><p className="font-serif text-2xl leading-tight">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{item.tagline}</p></div>)}
            </div>
            <dl className="divide-y">
              {compareCriteria.map(({ key, label }) => (
                <div key={key} className="grid gap-3 py-5 sm:grid-cols-[130px_1fr_1fr] sm:gap-6">
                  <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground sm:pt-0.5">{label}</dt>
                  {[a, b].map(item => (
                    <dd key={item.id} className="text-sm leading-relaxed">
                      <span className="mb-1 block text-[11px] font-medium text-[#557355] sm:hidden">{item.shortName}</span>
                      {item.compare[key]}
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
          </div>
          <footer className="space-y-4 px-6 pb-10 pt-4 sm:px-10">
            <p className="rounded-2xl bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">Risk is described in words, not scores. A single number can hide <em>which</em> risk you’re taking — losing value, losing ground to inflation, or not reaching your money when you need it.</p>
            <div className="flex flex-wrap gap-2">
              {[a, b].map(item => <button key={item.id} type="button" onClick={() => state.openItem(item.id)} className="rounded-full border px-4 py-2 text-xs hover:border-primary">Full explanation: {item.shortName}</button>)}
            </div>
            <MatchLink text="Turn understanding into a plan that fits you." />
          </footer>
        </article>
      )}
    </Drawer>
  );
}
