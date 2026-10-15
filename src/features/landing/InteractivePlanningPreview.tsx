import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { formatINR } from '@/lib/format';
import { futureValue } from '@/lib/calculations';
import { useAppMotion } from '@/hooks/useAppMotion';

const GOAL_PRESETS = [
  { label: '5 Lakhs', amount: 500000, desc: 'Emergency cushion' },
  { label: '10 Lakhs', amount: 1000000, desc: 'Your first million' },
  { label: '25 Lakhs', amount: 2500000, desc: 'Substantial anchor' },
  { label: '50 Lakhs', amount: 5000000, desc: 'Financial independence' },
];

const HORIZON_PRESETS = [
  { years: 5, label: '5 Years' },
  { years: 10, label: '10 Years' },
  { years: 15, label: '15 Years' },
];

const RETURN_SCENARIOS = [
  { rate: 0.08, label: 'Conservative (8%)', desc: 'Debt & steady index mix' },
  { rate: 0.105, label: 'Moderate (10.5%)', desc: 'Broad-market index core' },
  { rate: 0.125, label: 'Growth (12.5%)', desc: 'Patient all-equity strategy' },
];

export function InteractivePlanningPreview() {
  const { reduceMotion } = useAppMotion();
  const [goalAmount, setGoalAmount] = useState(1000000);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [horizonYears, setHorizonYears] = useState(10);
  const [annualRate, setAnnualRate] = useState(0.105);
  const sliderId = useId();

  // Calculations using core lib
  const months = horizonYears * 12;
  const projectedOutcome = Math.round(futureValue(monthlyContribution, annualRate, months));
  const totalInvested = monthlyContribution * months;
  const compoundEarnings = Math.max(0, projectedOutcome - totalInvested);

  // Time to reach the target goal
  const monthlyRate = annualRate / 12;
  const monthsToHitGoal = Math.ceil(
    Math.log(1 + (goalAmount * monthlyRate) / monthlyContribution) / Math.log(1 + monthlyRate)
  );
  const yearsToGoal = (monthsToHitGoal / 12).toFixed(1);

  // Ratio split
  const investedPercent = Math.max(1, Math.min(100, Math.round((totalInvested / projectedOutcome) * 100)));
  const compoundPercent = 100 - investedPercent;

  return (
    <section className="page-width py-20 lg:py-28" id="interactive-preview">
      {/* Section Header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-3 flex items-center justify-center gap-2">
          <span className="marker-dot" />
          INTERACTIVE SIMULATOR
        </p>
        <h2 className="serif-title text-4xl sm:text-5xl lg:text-6xl text-foreground">
          Simulate before you commit.
        </h2>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
          Experience the quiet power of compound interest. Adjust your goal amount, monthly pacing, and horizon to see your financial future take shape.
        </p>
      </div>

      {/* Simulator Container */}
      <div className="mt-14 rounded-3xl border border-border/80 bg-card p-6 shadow-[0_20px_60px_#22252108] md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          {/* Controls Column */}
          <div className="space-y-8">
            {/* 1. Goal Amount Presets */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-xs font-semibold tracking-wide uppercase text-foreground">
                  1. Your Target Goal
                </label>
                <span className="font-serif text-2xl font-normal text-foreground">
                  {formatINR(goalAmount)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {GOAL_PRESETS.map((preset) => {
                  const active = goalAmount === preset.amount;
                  return (
                    <button
                      key={preset.amount}
                      type="button"
                      onClick={() => setGoalAmount(preset.amount)}
                      className={`rounded-2xl border p-3 text-left transition-all ${
                        active
                          ? 'border-[#557355] bg-secondary/60 text-foreground ring-1 ring-[#557355]'
                          : 'border-border/70 bg-background/50 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      }`}
                      aria-pressed={active}
                    >
                      <p className="text-xs font-semibold">{preset.label}</p>
                      <p className="mt-0.5 text-[9px] opacity-75">{preset.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Monthly Contribution Slider */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <label htmlFor={sliderId} className="text-xs font-semibold tracking-wide uppercase text-foreground">
                    2. Monthly Contribution
                  </label>
                  <p className="text-[11px] text-muted-foreground">What you can save consistently each month</p>
                </div>
                <output className="font-mono text-xl font-bold tabular-nums text-foreground">
                  {formatINR(monthlyContribution)}
                </output>
              </div>

              <Slider
                id={sliderId}
                aria-label="Monthly contribution amount"
                value={[monthlyContribution]}
                min={1000}
                max={50000}
                step={500}
                onValueChange={([val]) => setMonthlyContribution(val)}
                className="py-4"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
                <div className="flex gap-2">
                  {[5000, 10000, 20000, 30000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setMonthlyContribution(amt)}
                      className={`rounded-md border px-2 py-0.5 text-[10px] transition-colors ${
                        monthlyContribution === amt
                          ? 'border-[#557355] bg-secondary font-medium text-foreground'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>
                <span>Range: ₹1,000 – ₹50,000</span>
              </div>
            </div>

            {/* 3. Horizon & Assumed Rate */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wide uppercase text-foreground">
                  Timeline
                </label>
                <div className="flex rounded-xl border border-border p-1">
                  {HORIZON_PRESETS.map((h) => {
                    const active = horizonYears === h.years;
                    return (
                      <button
                        key={h.years}
                        type="button"
                        onClick={() => setHorizonYears(h.years)}
                        className={`flex-1 rounded-lg py-1.5 text-center text-xs transition-colors ${
                          active
                            ? 'bg-secondary font-semibold text-foreground shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        aria-pressed={active}
                      >
                        {h.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wide uppercase text-foreground">
                  Growth Model
                </label>
                <select
                  aria-label="Investment growth model"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#557355]"
                >
                  {RETURN_SCENARIOS.map((s) => (
                    <option key={s.rate} value={s.rate}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Outcome Display Column */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#8BA88B]/50 bg-gradient-to-b from-[#FAF9F5] to-secondary/35 p-7 md:p-8">
            <div>
              {/* Outcome Header */}
              <div className="flex items-center justify-between border-b border-[#8BA88B]/30 pb-4">
                <span className="eyebrow flex items-center gap-1.5 text-[#557355]">
                  <TrendingUp size={13} />
                  PROJECTED WEALTH
                </span>
                <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] text-muted-foreground shadow-xs">
                  In {horizonYears} Years
                </span>
              </div>

              {/* Big Projected Total */}
              <div className="my-6">
                <p className="font-serif text-5xl sm:text-6xl text-foreground">
                  <AnimatedNumber value={projectedOutcome} />
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Estimated outcome based on {formatINR(monthlyContribution)}/month at {(annualRate * 100).toFixed(1)}% annual return.
                </p>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/70 bg-white/80 p-4 shadow-xs">
                <div>
                  <p className="eyebrow text-[9px]">TOTAL YOU INVEST</p>
                  <p className="mt-1 font-mono text-base font-bold text-foreground">
                    <AnimatedNumber value={totalInvested} />
                  </p>
                  <p className="text-[10px] text-muted-foreground">{investedPercent}% principal</p>
                </div>
                <div className="border-l border-border/70 pl-3">
                  <p className="eyebrow text-[9px] text-[#557355]">COMPOUND GAINS</p>
                  <p className="mt-1 font-mono text-base font-bold text-[#557355]">
                    +<AnimatedNumber value={compoundEarnings} />
                  </p>
                  <p className="text-[10px] text-muted-foreground">{compoundPercent}% generated by growth</p>
                </div>
              </div>

              {/* Compounding Visual Ratio Bar */}
              <div className="mt-6 space-y-1.5">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Your Deposits ({investedPercent}%)</span>
                  <span>Compound Interest ({compoundPercent}%)</span>
                </div>
                <div className="flex h-3 w-full overflow-hidden rounded-full border border-border/60 bg-muted/70">
                  <motion.div
                    className="h-full bg-foreground"
                    style={{ width: `${investedPercent}%` }}
                    animate={{ width: `${investedPercent}%` }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.4 }}
                  />
                  <motion.div
                    className="h-full bg-[#8BA88B]"
                    style={{ width: `${compoundPercent}%` }}
                    animate={{ width: `${compoundPercent}%` }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Goal Horizon Insight */}
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#8BA88B]/40 bg-white/60 p-3 text-xs">
                <Sparkles size={16} className="shrink-0 text-[#6a8769]" />
                <p className="text-muted-foreground">
                  At this pace, you reach your <span className="font-semibold text-foreground">{formatINR(goalAmount)}</span> milestone in{' '}
                  <span className="font-semibold text-[#557355]">~{yearsToGoal} years</span>.
                </p>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="mt-8 pt-4">
              <Button asChild size="lg" className="h-12 w-full rounded-full text-xs shadow-sm">
                <Link to="/onboarding" className="flex items-center justify-center gap-2">
                  <span>Build your personalized plan</span>
                  <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
