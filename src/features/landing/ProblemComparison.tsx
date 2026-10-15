import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useAppMotion } from '@/hooks/useAppMotion';

const JARGON_DECODER = [
  {
    jargon: 'Sharpe Ratio & Alpha',
    translation: 'Is this investment earning enough return to justify the risk and headaches?',
    monoTake: 'Most active fund managers fail to beat simple broad-market indexes over 10 years.',
  },
  {
    jargon: 'Total Expense Ratio (TER)',
    translation: 'The annual maintenance fee the fund manager deducts directly from your returns.',
    monoTake: 'A 1.5% difference in fees can eat up to 30% of your total wealth over 25 years.',
  },
  {
    jargon: 'Asset Allocation Matrix',
    translation: 'Balancing safe cash for today with patient investments for tomorrow.',
    monoTake: 'Three simple buckets: Liquid Emergency, Steady Index Core, and Long Horizon.',
  },
];

export function ProblemComparison() {
  const { reduceMotion } = useAppMotion();
  const [activeDecoderIndex, setActiveDecoderIndex] = useState(0);

  return (
    <section className="page-width py-20 lg:py-28" id="the-problem">
      {/* Section Header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-3 flex items-center justify-center gap-2">
          <span className="marker-dot" />
          THE OVERWHELM TRAP
        </p>
        <h2 className="serif-title text-4xl sm:text-5xl lg:text-6xl text-foreground">
          Investing shouldn’t require a <em className="font-normal italic text-[#6a8769]">finance degree.</em>
        </h2>
        <p className="mt-5 text-sm sm:text-base leading-relaxed text-muted-foreground">
          The modern financial industry thrives on confusion. Opaque acronyms, thousands of overlapping funds, and sensational market headlines leave beginners hesitant and paralyzed.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
        {/* The Industry Noise Card */}
        <div className="group relative rounded-3xl border border-destructive/20 bg-card p-8 shadow-[0_4px_24px_#22252103] transition-all hover:border-destructive/30">
          <div className="flex items-center justify-between pb-6 border-b border-border/70">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle size={16} />
              </span>
              <span className="eyebrow text-destructive font-semibold">THE CONVENTIONAL WAY</span>
            </div>
            <span className="text-xs text-muted-foreground">Overwhelming</span>
          </div>

          {/* Wall of Confusing Jargon Pills */}
          <div className="my-6 flex flex-wrap gap-2">
            {[
              'TER 2.15%',
              'Standard Dev: 14.8%',
              '3,500+ Schemes',
              'Beta 1.12',
              'IDCW vs Growth',
              'Exit Load 1%',
              'Tactical Overlay',
            ].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border/80 bg-muted/50 px-3 py-1 font-mono text-[11px] text-muted-foreground line-through opacity-75"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 text-destructive font-bold text-xs">✕</span>
              <div>
                <h3 className="text-sm font-medium text-foreground">3,500+ Overlapping Products</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Beginners face a wall of identical-sounding schemes with endless prospectuses, turning a simple habit into an exhausting chore.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-destructive font-bold text-xs">✕</span>
              <div>
                <h3 className="text-sm font-medium text-foreground">Conflict of Interest</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Advisors and platforms often push complex, high-commission products rather than what is genuinely best for long-term compounding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-destructive font-bold text-xs">✕</span>
              <div>
                <h3 className="text-sm font-medium text-foreground">The Cost of Hesitation</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Fearing a mistake, most people leave their money sitting in low-yield savings accounts, silently losing purchasing power to inflation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The MONO Way Card */}
        <div className="relative rounded-3xl border border-[#8BA88B]/60 bg-gradient-to-br from-card via-[#F9FAF8] to-secondary/30 p-8 shadow-[0_8px_30px_#8ba88b12]">
          <div className="flex items-center justify-between pb-6 border-b border-[#8BA88B]/30">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#8BA88B]/20 text-[#557355]">
                <CheckCircle2 size={16} />
              </span>
              <span className="eyebrow text-[#557355] font-semibold">THE MONO PRINCIPLE</span>
            </div>
            <span className="text-xs text-[#557355] font-medium">Clarity first</span>
          </div>

          {/* MONO 3 Foundational Pillars */}
          <div className="my-6 grid grid-cols-3 gap-2">
            {[
              { label: 'Safe Cushion', sub: 'Liquid Reserve' },
              { label: 'Steady Core', sub: 'Broad Index' },
              { label: 'Long Growth', sub: 'Compounding' },
            ].map((pillar) => (
              <div
                key={pillar.label}
                className="rounded-xl border border-[#8BA88B]/40 bg-white/80 p-2.5 text-center shadow-xs"
              >
                <p className="text-[11px] font-semibold text-foreground">{pillar.label}</p>
                <p className="text-[9px] text-[#557355]">{pillar.sub}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 text-[#557355] font-bold text-xs">✓</span>
              <div>
                <h3 className="text-sm font-medium text-foreground">Plain Human Language</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  No acronyms without instant translations. Every financial vehicle is broken down into simple, honest trade-offs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-[#557355] font-bold text-xs">✓</span>
              <div>
                <h3 className="text-sm font-medium text-foreground">Grounded in Real Life</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  We calculate what you can comfortably commit after rent, food, and essentials—never asking you to sacrifice your life for a spreadsheet.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-[#557355] font-bold text-xs">✓</span>
              <div>
                <h3 className="text-sm font-medium text-foreground">Zero Brokerage or Commission Motives</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  MONO has no financial products to sell you. We exist solely to bring clarity, perspective, and quiet confidence to your decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Plain-English Demystifier */}
      <div className="mt-12 rounded-2xl border border-border/80 bg-card p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-2">
            <HelpCircle size={15} className="text-[#6a8769]" />
            <h4 className="font-serif text-xl sm:text-2xl">The MONO Jargon Decoder</h4>
          </div>
          <p className="text-xs text-muted-foreground">Tap a financial term to hear it in plain English</p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col gap-2">
            {JARGON_DECODER.map((item, idx) => {
              const active = idx === activeDecoderIndex;
              return (
                <button
                  key={item.jargon}
                  type="button"
                  onClick={() => setActiveDecoderIndex(idx)}
                  className={`flex items-center justify-between rounded-xl p-3.5 text-left text-xs transition-all ${
                    active
                      ? 'border border-[#557355]/40 bg-secondary/60 font-medium text-foreground'
                      : 'border border-transparent bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  }`}
                  aria-pressed={active}
                >
                  <span>{item.jargon}</span>
                  <ArrowRight size={13} className={active ? 'text-[#557355]' : 'opacity-40'} />
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-border/60 bg-[#FAF9F5] p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDecoderIndex}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <p className="eyebrow text-[9px] text-muted-foreground">IN PLAIN ENGLISH</p>
                  <p className="mt-1.5 text-sm sm:text-base font-medium text-foreground leading-snug">
                    "{JARGON_DECODER[activeDecoderIndex].translation}"
                  </p>
                </div>
                <div className="border-t border-border/60 pt-3">
                  <p className="eyebrow text-[9px] text-[#557355]">HOW MONO APPROACHES THIS</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {JARGON_DECODER[activeDecoderIndex].monoTake}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
