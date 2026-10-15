import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppMotion } from '@/hooks/useAppMotion';

const SCENARIOS = [
  {
    id: 'correction',
    name: 'Market Correction (-22%)',
    shortLabel: '-22% Downturn',
    description: 'A sharp, unexpected decline driven by macro headwinds or economic slowdown.',
    traditionalOutcome: 'Fear spikes. Without a liquid emergency cushion, investors sell equities at the bottom to fund lifestyle expenses, locking in real financial loss.',
    monoOutcome: 'Zero panic selling. Your 6-month liquid cushion absorbs living costs, while monthly SIP purchases more shares at a deep valuation discount.',
    cushionImpact: 'Liquid reserve 100% safe. Compounding continues unaffected.',
  },
  {
    id: 'stagnation',
    name: 'The 3-Year Plateau (0% Growth)',
    shortLabel: '3-Yr Plateau',
    description: 'Markets remain completely flat for years, testing emotional patience and discipline.',
    traditionalOutcome: 'Boredom and frustration. Investors chase speculative hype or jump between funds, incurring fees and taxes.',
    monoOutcome: 'Quiet accumulation. Low volatility allows steady rupee-cost averaging, building a massive foundation for the subsequent breakout.',
    cushionImpact: 'Consistency beats boredom. Accumulation continues on schedule.',
  },
  {
    id: 'bull',
    name: 'The Bull Expansion (+15%)',
    shortLabel: '+15% Expansion',
    description: 'Strong economic growth where almost every asset class climbs.',
    traditionalOutcome: 'Euphoria. Investors take on excessive leverage, forget emergency savings, and become reckless.',
    monoOutcome: 'Grounded discipline. Enjoy compound growth without taking undue risk or abandoning your safe allocation.',
    cushionImpact: 'Rebalancing preserves gains while keeping foundations solid.',
  },
];

export function RealityCheckPreview() {
  const { reduceMotion } = useAppMotion();
  const [activeScenarioId, setActiveScenarioId] = useState('correction');

  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  return (
    <section className="page-width py-20 lg:py-28" id="reality-check">
      {/* Header */}
      <div className="section-label">
        <div className="space-y-1">
          <p className="eyebrow flex items-center gap-2">
            <span className="marker-dot" />
            MARKET RESILIENCE
          </p>
          <h2 className="serif-title text-4xl sm:text-5xl lg:text-6xl text-foreground">
            A good plan makes room for <em className="font-normal italic text-[#bd7763]">bad years.</em>
          </h2>
        </div>
        <p className="hidden max-w-xs text-xs text-muted-foreground md:block">
          Financial independence is not about predicting the market; it’s about surviving its worst years without interrupting your compounding.
        </p>
      </div>

      {/* Main Resilience Card */}
      <div className="mt-12 rounded-3xl border border-border/80 bg-card p-6 shadow-[0_12px_40px_#22252104] md:p-10">
        {/* Scenario Switcher Tabs */}
        <div>
          <p className="eyebrow mb-3 text-[10px] text-muted-foreground">SELECT A HYPOTHETICAL STRESS-TEST</p>
          <div className="flex flex-wrap gap-2.5">
            {SCENARIOS.map((scenario) => {
              const active = scenario.id === activeScenarioId;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setActiveScenarioId(scenario.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                    active
                      ? 'border-[#557355] bg-secondary/70 text-foreground ring-1 ring-[#557355]'
                      : 'border-border bg-background/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                  aria-pressed={active}
                >
                  {scenario.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Scenario Insight */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScenario.id}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12"
          >
            {/* Left: What Happens */}
            <div className="space-y-6">
              <div>
                <span className="eyebrow text-[9px] text-[#bd7763]">SCENARIO OVERVIEW</span>
                <h3 className="serif-title mt-1 text-3xl sm:text-4xl text-foreground">
                  {activeScenario.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {activeScenario.description}
                </p>
              </div>

              {/* Ungrounded vs Grounded Comparison */}
              <div className="space-y-4 rounded-2xl border border-border/60 bg-[#FAF9F5] p-5">
                <div>
                  <p className="text-[11px] font-semibold text-destructive">Without a Resilient Plan:</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {activeScenario.traditionalOutcome}
                  </p>
                </div>
                <div className="border-t border-border/60 pt-3">
                  <p className="text-[11px] font-semibold text-[#557355]">With MONO's 3-Layer Architecture:</p>
                  <p className="mt-1 text-xs leading-relaxed text-foreground">
                    {activeScenario.monoOutcome}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: The MONO Resilience Architecture */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#8BA88B]/40 bg-gradient-to-br from-secondary/40 via-card to-card p-6 md:p-8">
              <div>
                <div className="flex items-center gap-2 border-b border-[#8BA88B]/30 pb-3">
                  <Shield size={16} className="text-[#557355]" />
                  <span className="eyebrow font-semibold text-[#557355]">MONO RESILIENCE GUARANTEE</span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#8BA88B]/30 text-[#557355]">
                      <Check size={12} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Protected Liquid Cushion</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        3 to 6 months of living expenses stored safely in liquid debt or high-yield accounts, never exposed to market drops.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#8BA88B]/30 text-[#557355]">
                      <Check size={12} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Automated Dispassionate Buying</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Your pre-committed monthly contribution automatically purchases cheaper units when markets dip, accelerating eventual recovery.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#8BA88B]/30 text-[#557355]">
                      <Check size={12} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Zero Forced Exits</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Because life expenses are already funded, you never have to sell investments in a downturn to pay for emergencies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 border-t border-border/60 pt-4">
                <Button asChild variant="outline" className="h-10 w-full rounded-full text-xs">
                  <Link to="/reality-lab" className="flex items-center justify-center gap-2">
                    <span>Test deeper scenarios in the Reality Lab</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
