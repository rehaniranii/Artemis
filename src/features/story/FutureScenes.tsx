import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Coin, HeroArt, Sparkle, Sprout } from '@/components/illustrations';
import { createDefaultState } from '@/data/defaults';
import { applyMarketShock, blendedReturn, calculateFutureValue, calculateGoalTimeline } from '@/lib/calculations';
import { formatINR } from '@/lib/format';
import { gsap, useGsap } from '@/lib/motion';

const DESKTOP = '(min-width: 1024px)';
const SMALL = '(max-width: 1023px)';
const W = 640, H = 300, PAD = 24;

/** Aarav's illustrative demo plan, computed with the app's own calculation engine. */
function useDemoPath() {
  return useMemo(() => {
    const d = createDefaultState();
    const monthly = d.profile.monthlyInvestmentCapacity, goal = d.goal.amount, rate = blendedReturn(d.allocation);
    const months = calculateGoalTimeline({ goal, monthlyAmount: monthly, annualReturn: rate }) ?? 240;
    const years = Math.ceil(months / 12);
    const points = Array.from({ length: years + 1 }, (_, y) => ({ year: y, value: calculateFutureValue({ monthlyAmount: monthly, annualReturn: rate, months: y * 12 }), contributed: monthly * 12 * y }));
    return { monthly, goal, rate, years, points, allocation: d.allocation };
  }, []);
}

const toXY = (i: number, n: number, v: number, max: number) => [PAD + (i / n) * (W - PAD * 2), H - PAD - (v / max) * (H - PAD * 2)] as const;

// ---------------------------------------------------------------- Scene 5
export function SceneMillion() {
  const root = useRef<HTMLElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const putInRef = useRef<HTMLSpanElement>(null);
  const { monthly, goal, rate, years, points } = useDemoPath();
  const start = new Date().getFullYear();
  const max = Math.max(goal, points[points.length - 1].value) * 1.05;
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${toXY(i, years, p.value, max).join(' ')}`).join(' ');
  const last = points[points.length - 1];
  const goalY = toXY(0, years, goal, max)[1];

  useGsap(root, () => {
    const show = (progress: number) => {
      const p = points[Math.round(progress * years)];
      if (valueRef.current) valueRef.current.textContent = formatINR(p.value);
      if (yearRef.current) yearRef.current.textContent = String(start + p.year);
      if (putInRef.current) putInRef.current.textContent = formatINR(p.contributed);
    };
    const build = (pin: boolean) => {
      const line = root.current!.querySelector<SVGPathElement>('[data-growth]')!;
      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: pin ? 'top top' : 'top 70%', end: pin ? '+=180%' : 'bottom 60%', pin, scrub: 1, onUpdate: self => show(self.progress) } });
      tl.set(line, { opacity: 1 }, 0.001).to(line, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
        .from('[data-marker]', { scale: 0, transformOrigin: '50% 50%', stagger: 1 / points.length, duration: 0.05, ease: 'none' }, 0)
        .from('[data-goal-flag]', { opacity: 0, y: 20, duration: 0.15 }, 0.85);
      show(0);
    };
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => build(true));
    mm.add(SMALL, () => build(false));
  });

  return (
    <section ref={root} aria-labelledby="million-title" className="relative overflow-hidden bg-cream py-20 lg:flex lg:h-screen lg:items-center lg:py-0">
      <div className="page-width grid w-full gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <span aria-hidden="true" className="display block text-[88px] text-ink/10 lg:text-[140px]">05</span>
          <h2 id="million-title" className="display -mt-6 text-5xl sm:text-7xl">₹10,00,000<br /><em className="text-plum">starts somewhere.</em></h2>
          <p className="mt-6 max-w-md text-sm text-ink/75">Illustration: {formatINR(monthly)} a month in a balanced mix, assuming {(rate * 100).toFixed(1)}% a year. Real returns will be uneven — and could be lower.</p>
          <p className="mt-8 font-serif text-3xl">Every plan begins with one decision.</p>
          <Link to="/plan" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full border-2 border-ink bg-plum px-6 text-sm font-semibold text-white shadow-[4px_4px_0_#10110F] ink-lift">Build Your Plan<ArrowUpRight size={16} /></Link>
        </div>
        <figure className="rounded-[28px] bg-white p-6 ink-card sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Illustrative value in <span ref={yearRef}>{start + last.year}</span></p>
              <p className="display mt-2 text-6xl tabular-nums sm:text-7xl"><span ref={valueRef}>{formatINR(last.value)}</span></p>
            </div>
            <p className="text-right text-xs text-muted-foreground">You put in<br /><span ref={putInRef} className="font-serif text-2xl text-ink">{formatINR(last.contributed)}</span></p>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full" role="img" aria-label={`Illustrative path: ${formatINR(monthly)} a month reaches about ${formatINR(last.value)} in ${years} years at an assumed ${(rate * 100).toFixed(1)}% a year.`}>
            <line x1={PAD} x2={W - PAD} y1={goalY} y2={goalY} stroke="#4B3B63" strokeWidth="2" strokeDasharray="6 8" />
            <g data-goal-flag><rect x={W - PAD - 118} y={goalY - 34} width="118" height="26" rx="13" fill="#FFD95A" stroke="#10110F" strokeWidth="2.5" /><text x={W - PAD - 59} y={goalY - 16} textAnchor="middle" fontSize="13" fontWeight="600" fill="#10110F">Goal ₹10 lakh</text></g>
            {points.map((p, i) => { const [x, y] = toXY(i, years, p.contributed, max); return <circle key={i} data-marker cx={x} cy={y} r="5" fill="#A8D5C2" stroke="#10110F" strokeWidth="2.5" />; })}
            <path data-growth d={path} fill="none" stroke="#10110F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <text x={PAD} y={H - 4} fontSize="12" fill="#5E5A6B">{start}</text>
            <text x={W - PAD} y={H - 4} fontSize="12" textAnchor="end" fill="#5E5A6B">{start + years}</text>
          </svg>
          <figcaption className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-1 w-5 rounded bg-ink" />Illustrative value</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full border-2 border-ink bg-mint" />Your contributions</span>
          </figcaption>
        </figure>
      </div>
      <div aria-hidden="true" className="float-slow pointer-events-none absolute right-6 top-10 hidden w-24 xl:block"><Coin /></div>
    </section>
  );
}

// ---------------------------------------------------------------- Scene 6
export function SceneReality() {
  const root = useRef<HTMLElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const { points, allocation } = useDemoPath();
  const at = points[Math.min(5, points.length - 1)];
  const shock = applyMarketShock(at.value, allocation);
  const rise = points.slice(0, 6);
  const max = at.value * 1.15;
  const risePath = rise.map((p, i) => `${i ? 'L' : 'M'}${toXY(i, 6, p.value, max).join(' ')}`).join(' ');
  const [px, py] = toXY(5, 6, at.value, max);
  const [fx, fy] = toXY(6, 6, shock.after, max);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const up = root.current!.querySelector<SVGPathElement>('[data-rise]')!, down = root.current!.querySelector<SVGPathElement>('[data-fall]')!;
      // Hidden until drawn, so round line caps don't leave a stray dot.
      [up, down].forEach(p => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l, opacity: 0 }); });
      gsap.set('[data-fall-dot]', { scale: 0, transformOrigin: '50% 50%' });
      const counter = { v: 0 };
      const write = () => { if (valueRef.current) valueRef.current.textContent = formatINR(counter.v); };
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=200%', pin: true, scrub: 1 } });
      tl.set(up, { opacity: 1 }).to(up, { strokeDashoffset: 0, ease: 'none', duration: 1 })
        .to(counter, { v: at.value, ease: 'none', duration: 1, onUpdate: write }, 0)
        .to(root.current, { backgroundColor: '#4B3B63', color: '#FFFDF2', duration: 0.8 })
        .to('[data-reality-chart]', { backgroundColor: '#FFF5C7', duration: 0.8 }, '<')
        .to('[data-lab-label]', { color: '#FFD95A', duration: 0.8 }, '<')
        .set(down, { opacity: 1 }, '<')
        .to(down, { strokeDashoffset: 0, ease: 'none', duration: 0.8 }, '<')
        .to('[data-fall-dot]', { scale: 1, duration: 0.15, ease: 'back.out(3)' })
        .to(counter, { v: shock.after, ease: 'none', duration: 0.8, onUpdate: write }, '<')
        .from('[data-bad-years]', { opacity: 0, y: 30, duration: 0.5 })
        .from('[data-lab]', { opacity: 0, y: 30, duration: 0.5 });
    });
    mm.add(SMALL, () => {
      gsap.from('[data-bad-years], [data-lab]', { opacity: 0, y: 30, stagger: 0.15, duration: 0.6, scrollTrigger: { trigger: '[data-bad-years]', start: 'top 85%' } });
    });
  });

  return (
    <section ref={root} aria-labelledby="reality-title" className="relative overflow-hidden bg-plum py-20 text-[#FFFDF2] lg:flex lg:h-screen lg:items-center lg:bg-cream lg:py-0 lg:text-ink">
      <div className="page-width grid w-full gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <span aria-hidden="true" className="display block text-[88px] opacity-15 lg:text-[140px]">06</span>
          <h2 id="reality-title" className="display -mt-6 text-5xl sm:text-7xl">But markets don’t<br />always go up.</h2>
          <p data-bad-years className="mt-8 font-serif text-3xl leading-snug">Bad years happen.<br />A better plan prepares for them.</p>
          <div data-lab className="mt-8">
            <p data-lab-label className="eyebrow text-sun lg:text-plum">Morrow Reality Lab</p>
            <Link to="/reality-lab" className="mt-4 inline-flex h-14 items-center gap-2 rounded-full border-2 border-ink bg-sun px-7 text-sm font-semibold text-ink shadow-[4px_4px_0_#10110F] ink-lift">Experience a Market Downturn<ArrowUpRight size={16} /></Link>
          </div>
        </div>
        <figure data-reality-chart className="rounded-[28px] bg-cream p-6 text-ink ink-card sm:p-8 lg:bg-white">
          <p className="eyebrow">Illustrative portfolio · year 5</p>
          <p className="display mt-2 text-6xl tabular-nums"><span ref={valueRef}>{formatINR(shock.after)}</span></p>
          <p className="mt-1 text-xs text-muted-foreground">A hypothetical bad year: {formatINR(at.value)} → {formatINR(shock.after)} ({(shock.change * 100).toFixed(1)}%).</p>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full" role="img" aria-label={`Illustrative: value rises to ${formatINR(at.value)} over five years, then a hypothetical bad year takes it to ${formatINR(shock.after)}.`}>
            <path data-rise d={risePath} fill="none" stroke="#10110F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path data-fall d={`M${px} ${py} L${fx} ${fy}`} fill="none" stroke="#B3492F" strokeWidth="6" strokeLinecap="round" />
            <circle data-fall-dot cx={fx} cy={fy} r="9" fill="#FFD95A" stroke="#10110F" strokeWidth="3" />
          </svg>
          <p className="mt-2 text-[11px] text-muted-foreground">Hypothetical. Losses can be larger and last longer; recovery is never guaranteed.</p>
        </figure>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Scene 7
export function SceneFinal() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, () => {
    gsap.from('[data-final-letter]', { yPercent: 110, stagger: 0.05, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } });
    gsap.from('[data-final-art] [data-layer]', { scale: 0.6, opacity: 0, stagger: 0.06, duration: 0.7, ease: 'back.out(1.6)', scrollTrigger: { trigger: '[data-final-art]', start: 'top 80%' } });
  });
  return (
    <section ref={root} aria-labelledby="final-title" className="relative overflow-hidden bg-sun pt-20">
      <div className="page-width grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span aria-hidden="true" className="display block text-[88px] text-ink/15 lg:text-[140px]">07</span>
          <h2 id="final-title" className="display -mt-6 text-5xl sm:text-7xl lg:text-[88px]">Your future starts with <em className="text-plum">understanding.</em></h2>
          <Link to="/onboarding" className="mt-10 inline-flex h-16 items-center gap-3 rounded-full border-2 border-ink bg-ink px-9 text-base font-semibold text-sun shadow-[5px_5px_0_#4B3B63] ink-lift">Let’s Begin<ArrowUpRight size={18} /></Link>
          <p className="mt-5 flex items-center gap-2 text-xs text-ink/70"><Sprout className="w-5" />Free, educational, and private — your answers stay on this device.</p>
        </div>
        <div data-final-art className="relative mx-auto aspect-square w-full max-w-[440px]"><HeroArt className="absolute inset-0" /></div>
      </div>
      <div aria-hidden="true" className="mt-6 flex justify-center overflow-hidden font-serif leading-[0.78] tracking-[-0.05em] text-cream [-webkit-text-stroke:2px_#10110F] text-[clamp(96px,23vw,360px)]">
        {'MORROW'.split('').map((l, i) => <span key={i} className="inline-block overflow-hidden"><span data-final-letter className="inline-block">{l}</span></span>)}
      </div>
      <Sparkle aria-hidden="true" className="absolute right-8 top-10 w-16 float-slow" />
    </section>
  );
}
