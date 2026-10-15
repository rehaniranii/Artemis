import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { HeroArt } from '@/components/illustrations';
import { useDemoMode } from '@/components/layout/DemoControls';
import { gsap, scrollToTarget, useGsap, useMagnetic, usePointerParallax } from '@/lib/motion';

const WORD = 'MORROW'.split('');

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const tryDemo = useDemoMode();
  const cta = useMagnetic<HTMLAnchorElement>(0.25);
  usePointerParallax(art);

  useGsap(root, () => {
    // 1–8: background, wordmark, illustration layers from different directions, tagline, CTAs.
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(root.current, { backgroundColor: '#FFFDF2', duration: 0.6 })
      .from('[data-letter]', { yPercent: 115, duration: 1, stagger: 0.06 }, 0.1)
      .from('[data-layer="blob"]', { scale: 0.5, opacity: 0, duration: 0.9, transformOrigin: '50% 50%' }, 0.45)
      .from('[data-layer="card"]', { x: -260, rotate: -50, opacity: 0, duration: 1 }, 0.55)
      .from('[data-layer="coin"]', { y: -220, rotate: -200, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'back.out(1.5)' }, 0.6)
      .from('[data-layer="phone"]', { y: 260, opacity: 0, duration: 1.1 }, 0.7)
      .from('[data-layer="ring"], [data-layer="sprout"]', { scale: 0, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(2)' }, 1)
      .from('[data-layer="spark"]', { scale: 0, rotate: -120, duration: 0.6, stagger: 0.1, ease: 'back.out(3)' }, 1.15)
      .from('[data-hero-line]', { yPercent: 110, duration: 0.85, stagger: 0.12 }, 0.5)
      .from('[data-hero-fade]', { y: 28, opacity: 0, duration: 0.6, stagger: 0.1 }, 1.1);

    // Layered parallax as the hero scrolls away: each layer at its own speed.
    const away = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('[data-wordmark]', { yPercent: 35, ease: 'none', scrollTrigger: away });
    gsap.to('[data-layer="phone"]', { y: -120, ease: 'none', scrollTrigger: away });
    gsap.to('[data-layer="coin"]', { y: -200, rotate: 90, ease: 'none', scrollTrigger: away });
    gsap.to('[data-layer="card"]', { y: -60, rotate: -20, ease: 'none', scrollTrigger: away });
    gsap.to('[data-layer="spark"]', { rotate: 180, ease: 'none', scrollTrigger: away });
  });

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative flex min-h-[calc(100svh-72px)] flex-col overflow-hidden border-b-2 border-ink bg-cream">
      <div className="page-width relative z-10 grid flex-1 items-center gap-8 pb-4 pt-10 lg:grid-cols-[1fr_1.05fr] lg:pt-6">
        <div>
          <p data-hero-fade className="eyebrow mb-6 flex items-center gap-2 text-ink"><span className="marker-dot" />The Honest Million · for first-time investors</p>
          <h1 id="hero-title" className="display text-[56px] sm:text-[88px] xl:text-[112px]">
            <span className="block overflow-hidden pb-1"><span data-hero-line className="block">Your money.</span></span>
            <span className="block overflow-hidden pb-2"><span data-hero-line className="block italic text-plum">Your tomorrow.</span></span>
          </h1>
          <p data-hero-fade className="mt-6 max-w-md text-base text-ink/75 sm:text-lg">Investing doesn’t have to be complicated. Let’s make your first million make sense.</p>
          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
            <Link ref={cta} to="/onboarding" className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-ink bg-plum px-7 text-sm font-semibold text-white shadow-[4px_4px_0_#10110F] transition-shadow hover:shadow-[6px_6px_0_#10110F]">Start Your Journey<ArrowUpRight size={17} /></Link>
            <button type="button" onClick={() => scrollToTarget('#story')} className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-ink bg-white px-6 text-sm font-semibold transition-colors hover:bg-sun">See How It Works</button>
          </div>
          <div data-hero-fade className="mt-6 flex flex-wrap items-center gap-6">
            <button type="button" onClick={tryDemo} className="text-sm font-medium underline decoration-2 underline-offset-4 hover:text-plum">Try Morrow with Aarav</button>
            <button type="button" onClick={() => scrollToTarget('#story')} aria-label="Scroll to the story" className="hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] md:flex">
              <span className="grid h-12 w-8 place-items-center rounded-full border-2 border-ink bg-white"><ArrowDown size={15} className="scroll-bob" /></span>Scroll the story
            </button>
          </div>
        </div>
        <div ref={art} className="relative mx-auto aspect-square w-full max-w-[560px]">
          <HeroArt className="absolute inset-0" />
        </div>
      </div>

      {/* Oversized wordmark, behind the illustration. */}
      <div data-wordmark aria-hidden="true" className="pointer-events-none relative z-0 -mt-[5vw] mb-[-0.14em] flex justify-center overflow-hidden font-serif leading-[0.8] tracking-[-0.05em] text-sun [-webkit-text-stroke:2px_#10110F] text-[clamp(96px,23vw,360px)]">
        {WORD.map((letter, i) => <span key={i} className="inline-block overflow-hidden"><span data-letter className="inline-block">{letter}</span></span>)}
      </div>

    </section>
  );
}
