import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ArrowUp, Coin, MoneyCard, Ring, Sparkle } from '@/components/illustrations';
import { RiskometerBadge } from '@/components/financial/RiskometerBadge';
import { fundCategoryById } from '@/data/funds';
import { gsap, useGsap } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { FundCategoryId, Riskometer } from '@/types/financial';

const DESKTOP = '(min-width: 1024px)';
const SMALL = '(max-width: 1023px)';

function SceneNumber({ n, light = false }: { n: number; light?: boolean }) {
  return <span aria-hidden="true" className={cn('display block text-[88px] lg:text-[140px]', light ? 'text-[#FFFDF2]/15' : 'text-ink/10')}>{String(n).padStart(2, '0')}</span>;
}

// ---------------------------------------------------------------- Scene 1
const CONFUSION = [
  { label: 'FD', sub: 'Fixed deposits', fill: '#FFD95A', left: 6, top: 10, rotate: -9, from: [-60, -30] },
  { label: 'Gold', sub: 'Coins, ETFs, funds', fill: '#FFF5C7', left: 58, top: 4, rotate: 7, from: [60, -40] },
  { label: 'Mutual Funds', sub: '1,500+ schemes', fill: '#A8D5C2', left: 30, top: 34, rotate: -3, from: [0, 60] },
  { label: 'Index Funds', sub: 'Nifty? Sensex?', fill: '#E7E1F0', left: 64, top: 50, rotate: 10, from: [70, 30] },
  { label: 'Bonds', sub: 'Yield? Coupon?', fill: '#FFFFFF', left: 2, top: 60, rotate: 6, from: [-70, 40] },
  { label: 'SIP', sub: 'A method, not a product', fill: '#FFD95A', left: 38, top: 72, rotate: -12, from: [-10, 70] },
];

export function SceneConfusion() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-confused]');
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=170%', pin: true, scrub: 1 } });
      tl.from(cards, { x: i => `${CONFUSION[i].from[0]}vw`, y: i => `${CONFUSION[i].from[1]}vh`, rotate: i => CONFUSION[i].rotate * 5, opacity: 0, stagger: 0.12, duration: 1 })
        .to(cards, { scale: 1.18, rotate: i => CONFUSION[i].rotate * 1.8, stagger: 0.03, duration: 0.6 })
        .from('[data-simple]', { scale: 0.4, opacity: 0, rotate: -6, duration: 0.6 }, '+=0.15')
        .to(cards, { x: i => `${CONFUSION[i].from[0] * 1.2}vw`, y: i => `${CONFUSION[i].from[1] * 1.2}vh`, opacity: 0, rotate: '+=40', stagger: 0.04, duration: 1 }, '<')
        .to('[data-confusion-title]', { opacity: 0.15, duration: 0.5 }, '<');
    });
    mm.add(SMALL, () => {
      gsap.from('[data-confused]', { y: 40, opacity: 0, rotate: 0, stagger: 0.08, duration: 0.6, scrollTrigger: { trigger: '[data-stage]', start: 'top 80%' } });
      gsap.from('[data-simple]', { scale: 0.7, opacity: 0, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: '[data-simple]', start: 'top 85%' } });
    });
  });
  return (
    <section ref={root} id="story" aria-labelledby="confusion-title" className="relative overflow-hidden bg-paper py-16 lg:flex lg:h-screen lg:flex-col lg:py-10">
      <div className="page-width flex items-end justify-between gap-6" data-confusion-title>
        <h2 id="confusion-title" className="display text-5xl sm:text-7xl lg:text-[96px]">Too many options.<br /><em className="text-plum">One big goal.</em></h2>
        <SceneNumber n={1} />
      </div>
      <div data-stage className="page-width relative mt-8 h-[460px] flex-1 lg:h-auto">
        {CONFUSION.map(card => (
          <div key={card.label} data-confused className="absolute w-[46%] max-w-[260px] rounded-2xl ink-card p-4 sm:p-5" style={{ left: `${card.left}%`, top: `${card.top}%`, transform: `rotate(${card.rotate}deg)`, background: card.fill }}>
            <p className="font-serif text-2xl leading-none sm:text-4xl">{card.label}</p>
            <p className="mt-2 text-[11px] text-ink/70 sm:text-xs">{card.sub}</p>
          </div>
        ))}
        <div data-simple className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-plum px-6 py-4 ink-card sm:px-10 sm:py-6">
          <p className="flex items-center gap-3 font-serif text-3xl text-[#FFFDF2] sm:text-6xl"><Sparkle className="size-7 sm:size-10" />Let’s make it simple.</p>
        </div>
      </div>
      <p className="page-width mt-6 text-sm text-muted-foreground">Aarav, 19, earns ₹8,000 a month. He wants ₹10 lakh — and every app shows him something different.</p>
    </section>
  );
}

// ---------------------------------------------------------------- Scene 2
const CLARITY = [
  { word: 'Understand.', text: 'Plain-language explanations of every option — no jargon, no sales pitch.' },
  { word: 'Plan.', text: 'A plan built on your income and comfort, not someone else’s.' },
  { word: 'Grow.', text: 'Patience, consistency, and honest room for bad years.' },
];

export function SceneClarity() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=200%', pin: true, scrub: 1 } });
      tl.set(root.current, { backgroundColor: '#FFF5C7' })
        .from('[data-word="0"]', { yPercent: 60, opacity: 0.08, duration: 1 })
        .from('[data-caption="0"]', { opacity: 0, y: 20, duration: 0.5 }, '<0.5')
        .to(root.current, { backgroundColor: '#A8D5C2', duration: 1 })
        .from('[data-word="1"]', { yPercent: 60, opacity: 0.08, duration: 1 }, '<')
        .from('[data-caption="1"]', { opacity: 0, y: 20, duration: 0.5 }, '<0.5')
        .to(root.current, { backgroundColor: '#4B3B63', color: '#FFFDF2', duration: 1 })
        .to('[data-clarity-ink]', { borderColor: '#FFFDF2', duration: 1 }, '<')
        .from('[data-word="2"]', { yPercent: 60, opacity: 0.08, duration: 1 }, '<')
        .from('[data-caption="2"]', { opacity: 0, y: 20, duration: 0.5 }, '<0.5')
        .to('[data-spin]', { rotate: 360, duration: 3, ease: 'none' }, 0);
    });
    mm.add(SMALL, () => {
      gsap.utils.toArray<HTMLElement>('[data-word]').forEach(el => gsap.from(el, { yPercent: 40, opacity: 0, duration: 0.7, scrollTrigger: { trigger: el, start: 'top 85%' } }));
    });
  });
  return (
    <section ref={root} aria-label="Understand, plan, grow" className="relative overflow-hidden border-y-2 border-ink bg-mint py-20 text-ink lg:flex lg:h-screen lg:items-center lg:py-0">
      <div data-spin aria-hidden="true" className="absolute -right-16 -top-16 w-56 opacity-90 lg:w-80"><Sparkle /></div>
      <div className="page-width grid w-full gap-10 lg:grid-cols-[auto_1fr] lg:items-center">
        <SceneNumber n={2} light />
        <ol className="space-y-6 lg:space-y-4">
          {CLARITY.map((item, i) => (
            <li key={item.word} data-clarity-ink className="grid gap-2 border-b-2 border-ink pb-5 lg:grid-cols-[1fr_280px] lg:items-end">
              <span data-word={i} className="display block text-[64px] sm:text-[100px] lg:text-[136px]">{item.word}</span>
              <span data-caption={i} className="text-sm leading-relaxed opacity-80 lg:pb-6">{item.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Scene 3
const DISCOVERY = [
  { name: 'Fixed Deposits', art: <Coin className="w-24" />, fill: '#FFD95A', what: 'Lock money for a set time at a set rate. Bank deposits are insured up to ₹5 lakh per bank.', risk: 0, horizon: 'Months to a few years' },
  { name: 'Index Funds', art: <ArrowUp className="w-20" />, fill: '#A8D5C2', what: 'Own the whole market at low cost. When the market falls, so does the fund.', risk: 2, horizon: '5+ years' },
  { name: 'Mutual Funds', art: <Ring className="w-24" fill="#FFD95A" />, fill: '#E7E1F0', what: 'Pooled money, managed for you — from steady debt funds to bumpier equity funds.', risk: 1, horizon: 'Depends on the fund' },
];
const RISK_WORDS = ['Small ups & downs', 'Some ups & downs', 'Big ups & downs'];

export function SceneDiscovery() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-disc-card]');
      gsap.set('[data-disc-stack]', { position: 'relative', height: 440 });
      gsap.set(cards, { position: 'absolute', inset: 0, margin: 0 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=220%', pin: true, scrub: 1 } });
      tl.from(cards[0], { y: 120, opacity: 0, duration: 0.6 });
      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.from(card, { yPercent: 110, rotate: 6, duration: 1 })
          .to(cards.slice(0, i), { scale: (j: number) => 1 - (i - j) * 0.06, y: (j: number) => -(i - j) * 34, opacity: 0.55, duration: 1 }, '<')
          .to(cards.slice(0, i).map(c => c.querySelector('[data-detail]')), { opacity: 0, duration: 0.4 }, '<');
      });
      tl.from('[data-disc-end]', { opacity: 0, y: 40, duration: 0.6 });
    });
    mm.add(SMALL, () => {
      gsap.utils.toArray<HTMLElement>('[data-disc-card]').forEach(el => gsap.from(el, { y: 50, opacity: 0, duration: 0.7, scrollTrigger: { trigger: el, start: 'top 85%' } }));
    });
  });
  return (
    <section ref={root} aria-labelledby="discovery-title" className="relative overflow-hidden bg-paper py-20 lg:flex lg:h-screen lg:items-center lg:py-0">
      <div className="page-width grid w-full gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SceneNumber n={3} />
          <h2 id="discovery-title" className="display -mt-6 text-5xl sm:text-7xl">One idea<br />at a time.</h2>
          <div data-disc-end className="mt-8">
            <p className="font-serif text-3xl text-plum">Understand before you invest.</p>
            <Link to="/explore" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full border-2 border-ink bg-sun px-6 text-sm font-semibold shadow-[4px_4px_0_#10110F] ink-lift">Explore Investments<ArrowUpRight size={16} /></Link>
          </div>
        </div>
        <div data-disc-stack className="flex flex-col gap-5">
          {DISCOVERY.map(card => (
            <article key={card.name} data-disc-card className="flex flex-col justify-between rounded-[28px] ink-card p-7 sm:p-9" style={{ background: card.fill }}>
              <div className="flex items-start justify-between gap-4">
                <h3 className="display text-5xl sm:text-6xl">{card.name}</h3>
                <div aria-hidden="true" className="shrink-0">{card.art}</div>
              </div>
              <div data-detail>
                <p className="mt-6 max-w-md text-base">{card.what}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-2"><span className="flex gap-1" aria-hidden="true">{[0, 1, 2].map(n => <span key={n} className={cn('h-3 w-7 rounded-full border-2 border-ink', n <= card.risk ? 'bg-ink' : 'bg-white')} />)}</span>{RISK_WORDS[card.risk]}</span>
                  <span className="rounded-full border-2 border-ink bg-white px-3 py-1">{card.horizon}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Scene 4
const MATCH: { id: FundCategoryId; risk: Riskometer; horizon: string; fill: string }[] = [
  { id: 'nifty50-index', risk: 'Very High', horizon: '7+ years', fill: '#A8D5C2' },
  { id: 'hybrid', risk: 'High', horizon: '5+ years', fill: '#FFD95A' },
  { id: 'liquid', risk: 'Low to Moderate', horizon: 'Under a year', fill: '#FFFFFF' },
];
const SLOTS = [
  { x: '0%', y: 0, rotate: 0, scale: 1, zIndex: 3, opacity: 1 },
  { x: '-30%', y: 30, rotate: -8, scale: 0.84, zIndex: 2, opacity: 0.9 },
  { x: '30%', y: 30, rotate: 8, scale: 0.84, zIndex: 1, opacity: 0.9 },
];

export function SceneMatch() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-match-card]');
      gsap.set('[data-match-fan]', { position: 'relative', height: 470, display: 'block' });
      gsap.set(cards, { position: 'absolute', left: '50%', top: 0, width: 360, marginLeft: -180 });
      cards.forEach((c, i) => gsap.set(c, SLOTS[i]));
      // Each scroll step brings the next card forward; the others shift behind it.
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'bottom 40%', scrub: 1 } });
      [1, 2].forEach(step => tl.to(cards, { ...Object.fromEntries(['x', 'y', 'rotate', 'scale', 'opacity'].map(k => [k, (i: number) => SLOTS[(i - step + 3) % 3][k as keyof typeof SLOTS[number]]])), zIndex: (i: number) => SLOTS[(i - step + 3) % 3].zIndex, duration: 1 }));
    });
    mm.add(SMALL, () => {
      gsap.from('[data-match-card]', { y: 50, opacity: 0, stagger: 0.12, duration: 0.6, scrollTrigger: { trigger: '[data-match-fan]', start: 'top 80%' } });
    });
  });
  return (
    <section ref={root} aria-labelledby="match-title" className="relative overflow-hidden border-y-2 border-ink bg-plum py-24 text-[#FFFDF2]">
      <div className="page-width">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SceneNumber n={4} light />
            <p className="eyebrow -mt-4 text-sun">Morrow Match</p>
            <h2 id="match-title" className="display mt-3 text-5xl sm:text-7xl">Not every fund<br />is for everyone.</h2>
          </div>
          <p className="max-w-sm text-sm text-[#FFFDF2]/75">Tell us your timeline and comfort with dips. We’ll suggest fund categories worth learning about — and explain the catch in each.</p>
        </div>
        <div data-match-fan className="mt-14 grid gap-5 text-ink md:grid-cols-3">
          {MATCH.map(m => {
            const cat = fundCategoryById[m.id];
            return (
              <article key={m.id} data-match-card className="rounded-[28px] ink-card p-7" style={{ background: m.fill }}>
                <p className="eyebrow text-ink/60">Fund category</p>
                <h3 className="display mt-3 text-4xl">{cat.name}</h3>
                <div className="mt-4"><RiskometerBadge level={m.risk} /></div>
                <dl className="mt-5 space-y-3 text-sm">
                  <div><dt className="text-xs font-semibold uppercase tracking-wider text-ink/60">Horizon</dt><dd>{m.horizon}</dd></div>
                  <div><dt className="text-xs font-semibold uppercase tracking-wider text-ink/60">Why explore it</dt><dd>{cat.summary}</dd></div>
                </dl>
              </article>
            );
          })}
        </div>
        <div className="mt-14 flex flex-wrap items-center gap-5">
          <Link to="/explore/match" className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-ink bg-sun px-7 text-sm font-semibold text-ink shadow-[4px_4px_0_#10110F] ink-lift">Find Your Match<ArrowUpRight size={16} /></Link>
          <p className="text-xs text-[#FFFDF2]/60">Educational suggestions, not personalised investment advice.</p>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -left-10 hidden w-64 rotate-12 opacity-90 lg:block"><MoneyCard fill="#FFF5C7" /></div>
    </section>
  );
}
