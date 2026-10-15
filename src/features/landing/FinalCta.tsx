import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, HeartHandshake, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppMotion } from '@/hooks/useAppMotion';

export function FinalCta() {
  const { reduceMotion } = useAppMotion();

  return (
    <section className="page-width py-20 lg:py-28" id="get-started">
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-[#8BA88B]/40 bg-gradient-to-br from-secondary/50 via-card to-[#FAF9F5] p-10 text-center shadow-[0_20px_60px_#22252108] md:p-16 lg:p-20"
      >
        {/* Subtle background decorative geometry */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full border border-primary/20 bg-primary/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full border border-secondary/40 bg-secondary/20 blur-2xl" />

        <div className="relative mx-auto max-w-2xl">
          <p className="eyebrow mb-4 flex items-center justify-center gap-2">
            <span className="marker-dot" />
            YOUR NEXT STEP
          </p>

          <h2 className="serif-title text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.05]">
            Ready to make money <em className="font-normal italic text-[#6a8769]">make sense?</em>
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">
            Your first million starts with understanding. Take five quiet minutes to map your income, protect your essentials, and build a plan tailored to your life.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full px-8 text-sm font-medium shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              <Link to="/onboarding" className="flex items-center gap-2">
                <span>Build My Plan</span>
                <ArrowRight size={16} />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 rounded-full px-8 text-sm font-medium hover:bg-secondary/40"
            >
              <Link to="/explore">
                <span>Browse Concepts First</span>
              </Link>
            </Button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-border/70 pt-8 text-xs text-muted-foreground sm:gap-10">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-[#557355]" />
              <span>100% Free & Educational</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake size={15} className="text-[#557355]" />
              <span>Zero Brokerage or Commissions</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeOff size={15} className="text-[#557355]" />
              <span>Private — Stored In Your Browser</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
