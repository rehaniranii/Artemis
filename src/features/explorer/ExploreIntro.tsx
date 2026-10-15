import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Pencil } from 'lucide-react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { useFinancialStore } from '@/store/useFinancialStore';
import { formatINR } from '@/lib/format';
import { horizonLabel, riskProfileCopy } from '@/features/onboarding/journey';

/** Personal welcome after onboarding; before it, a quiet invitation to answer the questions once. */
export function ExploreIntro() {
  const { reduceMotion } = useAppMotion();
  const fromOnboarding = Boolean((useLocation().state as { fromOnboarding?: boolean } | null)?.fromOnboarding);
  const complete = useFinancialStore(s => s.onboardingComplete);
  const profile = useFinancialStore(s => s.profile);
  const goal = useFinancialStore(s => s.goal);
  const journey = useFinancialStore(s => s.journey);
  if (!complete) {
    return (
      <Link to="/onboarding" className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-primary/60 bg-white/50 p-5 text-sm transition-colors hover:bg-secondary/30">
        <span>Answer seven quick questions and this space will start where you are.</span>
        <span className="flex items-center gap-1 text-xs font-medium">Find your starting point<ArrowUpRight size={14} /></span>
      </Link>
    );
  }
  const copy = riskProfileCopy[journey.riskProfile];
  const facts = [
    ['Goal', formatINR(goal.amount)],
    ['Each month', formatINR(profile.monthlyInvestmentCapacity)],
    ['Horizon', horizonLabel({ horizonYears: profile.investmentHorizonYears, horizonFlexible: journey.horizonFlexible })],
    ['Learning profile', copy.name],
  ];
  return (
    <motion.section
      aria-labelledby="explore-welcome"
      initial={reduceMotion || !fromOnboarding ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mb-10 rounded-3xl border border-primary/30 bg-secondary/40 p-6 md:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="eyebrow">{fromOnboarding ? 'YOUR JOURNEY STARTS HERE' : 'WHERE YOU’RE STARTING'}</p>
        <Link to="/onboarding" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><Pencil size={12} />Edit answers</Link>
      </div>
      <h2 id="explore-welcome" className="mt-4 max-w-3xl font-serif text-2xl leading-snug md:text-3xl">Welcome, {profile.name}. {copy.summary}</h2>
      <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{copy.explore}{journey.emergencyStatus === 'not-yet' && ' And since you don’t have emergency savings yet, Saving & Stability is a good first stop.'}</p>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-primary/25 pt-5 md:grid-cols-4">
        {facts.map(([label, value]) => <div key={label}><dt className="eyebrow">{label}</dt><dd className="mt-1.5 font-serif text-xl">{value}</dd></div>)}
      </dl>
      <p className="mt-5 text-[11px] text-muted-foreground">An educational profile from your answers — not a suitability assessment or a recommendation.</p>
    </motion.section>
  );
}
