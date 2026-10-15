import { Fragment, type ReactNode } from 'react';
import { Popover } from 'radix-ui';
import { X } from 'lucide-react';
import { glossary, isGlossaryId, type GlossaryId } from '@/data/glossary';
import { cn } from '@/lib/utils';

/** A clickable word that opens its plain-language definition. Tap-friendly, unlike a hover tooltip. */
export function Term({ id, children, variant = 'inline' }: { id: GlossaryId; children?: ReactNode; variant?: 'inline' | 'chip' }) {
  const entry = glossary[id];
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={`What is ${entry.term}?`}
        className={cn(
          variant === 'inline'
            ? 'cursor-help rounded-sm underline decoration-plum decoration-dotted decoration-2 underline-offset-[3px] hover:decoration-plum data-[state=open]:bg-sun'
            : 'rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-xs font-medium text-ink transition-all hover:-translate-y-0.5 hover:bg-cream hover:text-foreground data-[state=open]:border-plum data-[state=open]:bg-sun data-[state=open]:text-foreground',
        )}
      >
        {children ?? entry.term}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 w-[min(20rem,calc(100vw-32px))] rounded-2xl border-2 border-ink bg-white p-5 text-left shadow-[5px_5px_0_#10110F] outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <p className="font-serif text-2xl leading-none">{entry.term}</p>
            <Popover.Close aria-label="Close definition" className="-mr-1 -mt-1 rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-foreground"><X size={14} /></Popover.Close>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{entry.short}</p>
          {'example' in entry && entry.example && <p className="mt-3 border-t pt-3 text-xs leading-relaxed text-muted-foreground">For example: {entry.example}</p>}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** Default inline label: lower-case mid-sentence, except acronyms like SIP and NAV. */
const inlineLabel = (id: GlossaryId) => { const term = glossary[id].term; return term === term.toUpperCase() ? term : term.charAt(0).toLowerCase() + term.slice(1); };

const TOKEN = /\[\[([a-z-]+)(?:\|([^\]]+))?\]\]/g;

/** Renders data text, turning [[glossary-id|shown text]] tokens into <Term> definitions. */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const [whole, id, label] = match;
    parts.push(text.slice(last, match.index));
    parts.push(isGlossaryId(id) ? <Term key={match.index} id={id}>{label ?? inlineLabel(id)}</Term> : (label ?? id));
    last = match.index + whole.length;
  }
  parts.push(text.slice(last));
  return <>{parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)}</>;
}

