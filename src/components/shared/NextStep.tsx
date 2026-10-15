import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/** Points to the next stage of the journey: Explore → Match → Plan → Reality Lab → Home → Blueprint. */
export function NextStep({ to, label, hint }: { to: string; label: string; hint: string }) {
  return (
    <Link to={to} className="mt-12 flex items-center justify-between gap-4 rounded-3xl ink-card bg-card p-6 transition-colors hover:bg-cream print:hidden">
      <span><span className="eyebrow block">Next step</span><span className="mt-2 block font-serif text-2xl">{label}</span><span className="mt-1 block text-xs text-muted-foreground">{hint}</span></span>
      <ArrowRight size={20} className="shrink-0" />
    </Link>
  );
}
