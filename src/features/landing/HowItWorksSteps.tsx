import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Compass, Layers, ShieldCheck } from 'lucide-react';
import { useAppMotion } from '@/hooks/useAppMotion';

const STEPS = [
  {
    number: '01',
    stepTitle: 'Understand.',
    tagline: 'Demystify before you allocate.',
    description:
      'Learn how the financial system actually works. Discover the difference between liquid safety, broad-market index growth, and patient compounding—all explained in human terms without commission incentives.',
    icon: Compass,
    link: '/explore',
    ctaText: 'Explore concepts & funds',
    highlights: ['Zero financial jargon', 'Broad-market index principles', 'Transparent trade-offs'],
  },
  {
    number: '02',
    stepTitle: 'Plan.',
    tagline: 'Ground your money in your life.',
    description:
      'No arbitrary budgets or unrealistic sacrifices. MONO determines your true monthly investment capacity from your income and essentials, ensuring an emergency buffer comes first.',
    icon: Layers,
    link: '/plan',
    ctaText: 'Discover planning',
    highlights: ['Essential expenses protected', 'Emergency fund first', 'Automated recurring pacing'],
  },
  {
    number: '03',
    stepTitle: 'Prepare.',
    tagline: 'Make room for the bad years.',
    description:
      'Markets don’t climb in a straight line. Before committing capital, stress-test your strategy against bear markets and inflation shocks so you never panic during real downturns.',
    icon: ShieldCheck,
    link: '/reality-lab',
    ctaText: 'Test in Reality Lab',
    highlights: ['Downturn simulations', 'No panic selling design', 'Emotional resilience'],
  },
];

export function HowItWorksSteps() {
  const { reduceMotion } = useAppMotion();

  return (
    <section className="page-width py-20 lg:py-28" id="how-it-works">
      {/* Section Header */}
      <div className="section-label">
        <div className="space-y-1">
          <p className="eyebrow flex items-center gap-2">
            <span className="marker-dot" />
            THE MONO METHODOLOGY
          </p>
          <h2 className="serif-title text-4xl sm:text-5xl lg:text-6xl text-foreground">
            Three steps to make money make sense.
          </h2>
        </div>
        <p className="hidden max-w-xs text-xs text-muted-foreground md:block">
          A disciplined, step-by-step foundation built for calm, long-term financial independence.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.article
              key={step.number}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-border/70 bg-card p-8 shadow-[0_4px_24px_#22252103] transition-all hover:border-[#8BA88B]/60 hover:shadow-[0_12px_36px_#8ba88b14]"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-wider text-muted-foreground">
                    {step.number} /
                  </span>
                  <div className="grid size-9 place-items-center rounded-xl bg-secondary/60 text-[#557355] transition-transform group-hover:scale-105">
                    <Icon size={18} />
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="serif-title mb-2 mt-6 text-3xl sm:text-4xl text-foreground">
                  {step.stepTitle}
                </h3>
                <p className="text-xs font-medium text-[#557355]">{step.tagline}</p>

                {/* Description */}
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                {/* Key Highlights */}
                <div className="mt-6 space-y-2 border-t border-border/50 pt-4">
                  {step.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="size-1 rounded-full bg-[#8BA88B]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-8 pt-4">
                <Link
                  to={step.link}
                  className="inline-flex items-center gap-2 text-xs font-medium text-foreground transition-all group-hover:text-[#557355]"
                >
                  <span>{step.ctaText}</span>
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
