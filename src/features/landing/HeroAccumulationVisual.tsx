import { useState, useId } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play, Pause, ChevronRight } from 'lucide-react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { formatINR } from '@/lib/format';
import { futureValue } from '@/lib/calculations';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';

const TARGET_GOAL = 1000000; // ₹10,00,000 - Your First Million
const ANNUAL_RATE = 0.10; // 10% long-term assumed broad market return

const PACING_PRESETS = [
  { label: 'Gentle', amount: 5000, desc: '₹5,000 / mo' },
  { label: 'Steady', amount: 10000, desc: '₹10,000 / mo' },
  { label: 'Accelerated', amount: 20000, desc: '₹20,000 / mo' },
];

export function HeroAccumulationVisual() {
  const { reduceMotion } = useAppMotion();
  const [monthly, setMonthly] = useState(10000);
  const [selectedYear, setSelectedYear] = useState(5);
  const [isPlaying, setIsPlaying] = useState(!reduceMotion);
  const sliderId = useId();

  // Calculate milestone years needed to hit ₹10,00,000
  // FV = monthly * ((1+r)^m - 1) / r => solve for m
  const monthlyRate = ANNUAL_RATE / 12;
  const monthsToTarget = Math.ceil(
    Math.log(1 + (TARGET_GOAL * monthlyRate) / monthly) / Math.log(1 + monthlyRate)
  );
  const yearsToTarget = (monthsToTarget / 12).toFixed(1);

  // Future value at selected year (capped at milestone duration)
  const currentMonths = selectedYear * 12;
  const projectedAtYear = Math.round(futureValue(monthly, ANNUAL_RATE, currentMonths));
  const principalInvested = monthly * currentMonths;
  const compoundGains = Math.max(0, projectedAtYear - principalInvested);
  const progressPercent = Math.min(100, Math.round((projectedAtYear / TARGET_GOAL) * 100));

  return (
    <div className="relative mx-auto w-full max-w-[500px] select-none rounded-3xl border border-border/80 bg-gradient-to-b from-card to-background p-6 shadow-[0_20px_50px_#22252108] md:p-8">
      {/* Editorial Header / Status Bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span
              className={`absolute inline-flex size-full rounded-full bg-primary/60 ${
                isPlaying && !reduceMotion ? 'animate-ping' : ''
              }`}
            />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#557355]" />
          </span>
          <span className="eyebrow text-[9px] tracking-widest text-foreground/80">
            THE ACCUMULATION HORIZON
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Sparkles size={12} className="text-[#6a8769]" />
          <span>Goal: {formatINR(TARGET_GOAL)}</span>
        </div>
      </div>

      {/* Abstract Geometric Canvas */}
      <div className="relative my-6 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/40 bg-[#F2F1EC]/80 p-5">
        {/* Subtle geometric background grid and concentric rings */}
        <svg
          className="pointer-events-none absolute inset-0 size-full opacity-40"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="halo" cx="70%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#8BA88B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8BA88B" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="growthGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#62685e" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#8BA88B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#557355" stopOpacity="1" />
            </linearGradient>
          </defs>
          <circle cx="70%" cy="30%" r="140" fill="url(#halo)" />
          {/* Subtle concentric orbital rings */}
          <circle cx="50%" cy="100%" r="220" fill="none" stroke="#8ba88b" strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />
          <circle cx="50%" cy="100%" r="170" fill="none" stroke="#8ba88b" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
          <circle cx="50%" cy="100%" r="120" fill="none" stroke="#8ba88b" strokeWidth="1" opacity="0.3" />
        </svg>

        {/* Dynamic Curved Growth Horizon */}
        <svg
          viewBox="0 0 400 240"
          className="relative size-full overflow-visible"
          aria-hidden="true"
        >
          {/* Base guideline */}
          <line x1="30" y1="210" x2="370" y2="210" stroke="#d4d8cc" strokeWidth="1" strokeDasharray="4 4" />

          {/* Area fill for compounding accumulation */}
          <motion.path
            d={`M 40 210 Q 180 190, 360 ${210 - (progressPercent * 1.6)} L 360 210 Z`}
            fill="url(#growthGrad)"
            fillOpacity="0.18"
            animate={{
              d: `M 40 210 Q 180 190, 360 ${210 - (progressPercent * 1.6)} L 360 210 Z`,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* Dynamic Parabolic Curve Line */}
          <motion.path
            d={`M 40 210 Q 180 190, 360 ${210 - (progressPercent * 1.6)}`}
            fill="none"
            stroke="#557355"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
              d: `M 40 210 Q 180 190, 360 ${210 - (progressPercent * 1.6)}`,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* Recurring contribution particles floating along the curve */}
          {isPlaying && !reduceMotion && (
            <>
              <motion.circle
                r="4.5"
                fill="#8BA88B"
                initial={{ cx: 40, cy: 210, opacity: 0 }}
                animate={{
                  cx: [40, 180, 360],
                  cy: [210, 190, 210 - (progressPercent * 1.6)],
                  opacity: [0, 1, 0],
                  scale: [0.7, 1.2, 0.9],
                }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle
                r="3.5"
                fill="#bd7763"
                initial={{ cx: 40, cy: 210, opacity: 0 }}
                animate={{
                  cx: [40, 180, 360],
                  cy: [210, 190, 210 - (progressPercent * 1.6)],
                  opacity: [0, 0.9, 0],
                }}
                transition={{ duration: 3.2, repeat: Infinity, delay: 1.6, ease: 'easeInOut' }}
              />
            </>
          )}

          {/* Tiered Stacked Geometric Pillars on the right */}
          <g transform="translate(325, 0)">
            {/* Principal block */}
            <motion.rect
              x="0"
              y={210 - (principalInvested / TARGET_GOAL) * 160}
              width="36"
              height={Math.max(4, (principalInvested / TARGET_GOAL) * 160)}
              rx="4"
              fill="#222521"
              fillOpacity="0.75"
              animate={{
                y: 210 - (principalInvested / TARGET_GOAL) * 160,
                height: Math.max(4, (principalInvested / TARGET_GOAL) * 160),
              }}
              transition={{ duration: 0.5 }}
            />
            {/* Compounding block on top */}
            <motion.rect
              x="0"
              y={210 - (progressPercent * 1.6)}
              width="36"
              height={Math.max(2, (compoundGains / TARGET_GOAL) * 160)}
              rx="4"
              fill="#8BA88B"
              animate={{
                y: 210 - (progressPercent * 1.6),
                height: Math.max(2, (compoundGains / TARGET_GOAL) * 160),
              }}
              transition={{ duration: 0.5 }}
            />
          </g>

          {/* Milestone Target Node at the top right */}
          <g transform="translate(343, 40)">
            <circle cx="0" cy="0" r="14" fill="#F8F7F3" stroke="#8BA88B" strokeWidth="1.5" />
            <motion.circle
              cx="0"
              cy="0"
              r="8"
              fill="#557355"
              animate={reduceMotion ? {} : { scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>

          {/* Start Origin Node */}
          <circle cx="40" cy="210" r="5" fill="#222521" />
          <text x="36" y="230" fontSize="9" fill="#62685e" fontFamily="Inter, sans-serif">Month 1</text>
          <text x="320" y="230" fontSize="9" fill="#62685e" fontFamily="Inter, sans-serif">Year {selectedYear}</text>
        </svg>

        {/* Milestone floating badge overlay */}
        <motion.div
          className="absolute right-5 top-5 rounded-xl border border-white/80 bg-white/90 p-3 shadow-sm backdrop-blur-sm"
          animate={{ y: [0, -4, 0] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <p className="eyebrow text-[8px] text-muted-foreground">MILESTONE PROGRESS</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-normal leading-none text-foreground">
              {progressPercent}%
            </span>
            <span className="text-[10px] text-muted-foreground">of ₹10 Lakhs</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-[#557355]">
            <span className="size-1.5 rounded-full bg-[#557355]" />
            <span>~{yearsToTarget} yrs to goal</span>
          </div>
        </motion.div>
      </div>

      {/* Dynamic Cumulative Numbers Bar */}
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/70 bg-card p-4">
        <div>
          <p className="eyebrow text-[9px]">TOTAL ACCUMULATED</p>
          <p className="mt-1 font-serif text-2xl font-normal text-foreground">
            <AnimatedNumber value={projectedAtYear} />
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            In {selectedYear} {selectedYear === 1 ? 'year' : 'years'}
          </p>
        </div>
        <div className="border-l border-border/60 pl-3">
          <p className="eyebrow text-[9px] text-[#557355]">FROM COMPOUND GROWTH</p>
          <p className="mt-1 font-serif text-2xl font-normal text-[#557355]">
            +<AnimatedNumber value={compoundGains} />
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {Math.round((compoundGains / Math.max(1, projectedAtYear)) * 100)}% created by time
          </p>
        </div>
      </div>

      {/* Interactive Controls & Scrubbing */}
      <div className="mt-5 space-y-4">
        {/* Pacing Presets */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <label htmlFor={sliderId} className="text-[11px] font-medium text-foreground">
              Monthly recurring contribution
            </label>
            <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
              {formatINR(monthly)} / mo
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {PACING_PRESETS.map((preset) => {
              const active = monthly === preset.amount;
              return (
                <button
                  key={preset.amount}
                  type="button"
                  onClick={() => setMonthly(preset.amount)}
                  className={`flex flex-col items-center rounded-xl border p-2 text-center transition-all ${
                    active
                      ? 'border-[#557355] bg-secondary/60 text-foreground ring-1 ring-[#557355]'
                      : 'border-border/70 bg-background/60 text-muted-foreground hover:bg-secondary/20 hover:text-foreground'
                  }`}
                  aria-pressed={active}
                >
                  <span className="text-[10px] font-semibold">{preset.label}</span>
                  <span className="text-[9px] opacity-80">{preset.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Horizon Slider Scrubber */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Accumulation timeline</span>
            <span className="font-medium text-foreground">Year {selectedYear} of 10</span>
          </div>
          <input
            id={sliderId}
            type="range"
            min={1}
            max={10}
            step={1}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-[#557355]"
            aria-label="Accumulation timeline in years"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>Year 1</span>
            <span>Year 3</span>
            <span>Year 5</span>
            <span>Year 7</span>
            <span>Year 10</span>
          </div>
        </div>

        {/* Subtle animation toggle */}
        <div className="flex items-center justify-between border-t border-border/50 pt-3 text-[10px] text-muted-foreground">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            aria-label={isPlaying ? 'Pause animation stream' : 'Play animation stream'}
          >
            {isPlaying ? <Pause size={11} /> : <Play size={11} />}
            <span>{isPlaying ? 'Pause motion stream' : 'Resume motion stream'}</span>
          </button>
          <span className="flex items-center gap-1 text-[9px]">
            Compounding at 10% CAGR
            <ChevronRight size={10} />
          </span>
        </div>
      </div>
    </div>
  );
}
