import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowDown, MoveUpRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppMotion } from '@/hooks/useAppMotion';
import { HeroAccumulationVisual } from '@/features/landing/HeroAccumulationVisual';
import { ProblemComparison } from '@/features/landing/ProblemComparison';
import { HowItWorksSteps } from '@/features/landing/HowItWorksSteps';
import { InteractivePlanningPreview } from '@/features/landing/InteractivePlanningPreview';
import { RealityCheckPreview } from '@/features/landing/RealityCheckPreview';
import { FinalCta } from '@/features/landing/FinalCta';

export default function LandingPage() {
  const { reduceMotion } = useAppMotion();

  useEffect(() => {
    document.title = 'MONO — Make Money Make Sense';
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="page-width py-12 lg:py-20" id="hero">
        {/* Subtle quick anchor sub-nav for effortless page scanning */}
        <nav
          aria-label="Landing page sections"
          className="mb-8 hidden items-center gap-2 border-b border-border/60 pb-3 sm:flex text-[11px] text-muted-foreground"
        >
          <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Jump to:</span>
          <a href="#the-problem" className="rounded-full px-3 py-1 transition-colors hover:bg-secondary/60 hover:text-foreground">
            The Problem
          </a>
          <span>·</span>
          <a href="#how-it-works" className="rounded-full px-3 py-1 transition-colors hover:bg-secondary/60 hover:text-foreground">
            How It Works
          </a>
          <span>·</span>
          <a href="#interactive-preview" className="rounded-full px-3 py-1 transition-colors hover:bg-secondary/60 hover:text-foreground">
            Interactive Preview
          </a>
          <span>·</span>
          <a href="#reality-check" className="rounded-full px-3 py-1 transition-colors hover:bg-secondary/60 hover:text-foreground">
            Reality Check
          </a>
        </nav>

        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14 xl:grid-cols-[1.2fr_1fr]">
          {/* Hero Left: Editorial Copy */}
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="flex flex-col justify-center"
          >
            {/* Brand Eyebrow */}
            <p className="eyebrow mb-6 flex items-center gap-2">
              <span className="marker-dot" />
              MONO · MAKE MONEY MAKE SENSE
            </p>

            {/* Large Expressive Serif Headline */}
            <h1 className="serif-title text-5xl leading-[0.98] sm:text-7xl lg:text-[80px] xl:text-[90px] text-foreground">
              Your first million starts with{' '}
              <em className="font-normal italic text-[#6a8769]">understanding.</em>
            </h1>

            {/* Supporting Copy in Inter */}
            <div className="my-8 max-w-lg space-y-2 text-base sm:text-lg leading-relaxed text-muted-foreground">
              <p>No confusing financial jargon.</p>
              <p>No overwhelming choices.</p>
              <p className="font-medium text-foreground">
                Just a clearer way to build your financial future.
              </p>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full px-8 text-sm font-medium shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                <Link to="/onboarding" className="flex items-center gap-2">
                  <span>Find My Path</span>
                  <span className="text-base transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </Button>

              <a
                href="#interactive-preview"
                className="group flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-5 py-3.5 text-xs font-medium text-foreground transition-all hover:bg-secondary/50"
              >
                <span>Interactive Preview</span>
                <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5 text-muted-foreground" />
              </a>

              <Link
                to="/explore"
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>Take a look around</span>
                <MoveUpRight size={13} />
              </Link>
            </div>

            {/* Trust Assurance */}
            <p className="mt-8 flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck size={14} className="text-[#557355]" />
              <span>No accounts. No transactions. Just perspective.</span>
            </p>
          </motion.div>

          {/* Hero Right: Interactive Accumulation Visual */}
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
            className="w-full"
          >
            <HeroAccumulationVisual />
          </motion.div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <ProblemComparison />

      {/* 3. HOW MONO WORKS SECTION */}
      <HowItWorksSteps />

      {/* 4. INTERACTIVE PREVIEW SECTION */}
      <InteractivePlanningPreview />

      {/* 5. REALITY CHECK PREVIEW SECTION */}
      <RealityCheckPreview />

      {/* 6. FINAL CTA SECTION */}
      <FinalCta />
    </div>
  );
}
