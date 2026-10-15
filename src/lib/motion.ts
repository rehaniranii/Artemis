import { useEffect, useLayoutEffect, useRef, type DependencyList, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useAppMotion } from '@/hooks/useAppMotion';

gsap.registerPlugin(ScrollTrigger);
// The app resets scroll itself on navigation; stop ScrollTrigger restoring old positions when pins revert.
if (typeof window !== 'undefined') ScrollTrigger.clearScrollMemory('manual');
export { gsap, ScrollTrigger };

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Runs GSAP setup scoped to `scope` inside a gsap.context, reverting everything on cleanup.
 * Skipped entirely under reduced motion, so content renders in its final, readable state.
 */
export function useGsap(scope: RefObject<HTMLElement | null>, setup: (ctx: gsap.Context) => void | (() => void), deps: DependencyList = []) {
  const { reduceMotion } = useAppMotion();
  useIsoLayoutEffect(() => {
    if (reduceMotion || !scope.current) return;
    const ctx = gsap.context(setup, scope.current);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, ...deps]);
}

let lenis: Lenis | null = null;
/** Smooth-scrolls to an element or position, via Lenis when active. */
export function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  if (lenis) {
    // Immediate numeric jumps (route changes) also set the native position so Lenis can't hold a stale target.
    if (immediate && typeof target === 'number') window.scrollTo(0, target);
    lenis.scrollTo(target, { immediate, force: true, offset: typeof target === 'number' ? 0 : -80 });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: immediate ? 'instant' : 'smooth' });
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth' });
}

/** App-wide Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll() {
  const { reduceMotion } = useAppMotion();
  useEffect(() => {
    if (reduceMotion || typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return;
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    const onTick = (time: number) => lenis?.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(onTick); lenis?.destroy(); lenis = null; };
  }, [reduceMotion]);
}

/** Subtle magnetic pull toward the cursor for primary CTAs (fine pointers only). */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null);
  const { reduceMotion } = useAppMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * strength); y((e.clientY - r.top - r.height / 2) * strength); };
    const leave = () => { x(0); y(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.set(el, { x: 0, y: 0 }); };
  }, [reduceMotion, strength]);
  return ref;
}

/** Cursor parallax: children with data-depth drift with the pointer inside `scope`. */
export function usePointerParallax(scope: RefObject<HTMLElement | null>, enabled = true) {
  const { reduceMotion } = useAppMotion();
  useEffect(() => {
    const el = scope.current;
    if (!el || !enabled || reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-depth]')).map(node => ({ depth: Number(node.dataset.depth), x: gsap.quickTo(node, 'x', { duration: 0.8, ease: 'power3.out' }), y: gsap.quickTo(node, 'y', { duration: 0.8, ease: 'power3.out' }) }));
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5; layers.forEach(l => { l.x(dx * l.depth * 40); l.y(dy * l.depth * 40); }); };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, [scope, enabled, reduceMotion]);
}
