import { Suspense, useEffect, useSyncExternalStore } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Navbar, mainNavigation } from './Navbar';
import { DemoControls } from './DemoControls';
import { LoadingState } from '@/components/shared/LoadingState';
import { Disclaimer } from '@/components/shared/Disclaimer';
import { Sparkle } from '@/components/illustrations';
import { useAppMotion } from '@/hooks/useAppMotion';
import { storageStatus } from '@/lib/storage';
import { ScrollTrigger, scrollToTarget, useSmoothScroll } from '@/lib/motion';

export function AppShell() {
  const { pathname } = useLocation();
  const { reduceMotion } = useAppMotion();
  const warning = useSyncExternalStore(storageStatus.subscribe, storageStatus.getSnapshot, () => null);
  useSmoothScroll();
  useEffect(() => { document.documentElement.dataset.reducedMotion = String(reduceMotion); }, [reduceMotion]);
  useEffect(() => {
    // Reset now, and again once the lazily loaded page has painted and old pins have reverted.
    scrollToTarget(0, true);
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => scrollToTarget(0, true)));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  // Web fonts change text metrics; re-measure scroll scenes once they've loaded.
  useEffect(() => { document.fonts?.ready.then(() => ScrollTrigger.refresh()); }, [pathname]);
  return (
    <>
      <a href="#main-content" className="fixed left-4 top-4 z-50 -translate-y-32 rounded-full bg-ink px-5 py-3 text-sm text-white focus:translate-y-0 print:hidden">Skip to content</a>
      <Navbar />
      {warning && <p role="status" className="page-width py-3 text-xs text-destructive">{warning}</p>}
      <main id="main-content" className="route-content" tabIndex={-1}>
        <Suspense fallback={<LoadingState />}>
          {/* Opacity only: a transform here would break pinned scroll scenes and fixed overlays. */}
          <motion.div key={pathname} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            <div className={pathname === '/' ? '' : 'page-width py-12 md:py-16'}><Outlet /></div>
          </motion.div>
        </Suspense>
      </main>
      <footer className={`${pathname === '/' ? '' : 'mt-16 '}bg-ink text-[#FFFDF2] print:hidden`}>
        <div className="page-width grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2 font-serif text-5xl">MORROW<Sparkle className="size-8" /></p>
            <p className="mt-3 font-serif text-2xl text-sun">Your money. Your tomorrow.</p>
            <div className="mt-6 max-w-md"><Disclaimer inverse /></div>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
            <p className="eyebrow mb-2 text-[#FFFDF2]/50">Explore Morrow</p>
            {[...mainNavigation, { to: '/explore/match', label: 'Morrow Match' }, { to: '/blueprint', label: 'Financial Blueprint' }].map(item => <Link key={item.to} to={item.to} className="w-fit hover:text-sun">{item.label}</Link>)}
          </nav>
          <div className="flex flex-col gap-3 text-sm">
            <p className="eyebrow text-[#FFFDF2]/50">Demo</p>
            <DemoControls />
            <Link to="/design-system" className="w-fit text-[11px] text-[#FFFDF2]/60 underline underline-offset-4">Component library</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
