import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAppMotion } from '@/hooks/useAppMotion';
import { useMagnetic } from '@/lib/motion';
import { useFinancialStore } from '@/store/useFinancialStore';
import { cn } from '@/lib/utils';

export const mainNavigation = [{ to: '/home', label: 'Home' }, { to: '/explore', label: 'Explore' }, { to: '/plan', label: 'My Plan' }, { to: '/reality-lab', label: 'Reality Lab' }];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { reduceMotion } = useAppMotion();
  const name = useFinancialStore(s => s.profile.name);
  const complete = useFinancialStore(s => s.onboardingComplete);
  const journey = complete ? '/blueprint' : '/onboarding';
  const magnetic = useMagnetic<HTMLAnchorElement>(0.3);
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/90 backdrop-blur-xl print:hidden">
      <div className="page-width flex h-[72px] items-center justify-between gap-4">
        <Link to="/" aria-label="Morrow home page" className="group flex shrink-0 items-center">
          <img src="/morrow-logo.jpg" alt="Morrow" width={688} height={384} className="h-[56px] w-auto rounded-xl border-2 border-ink object-cover transition-transform duration-300 group-hover:-rotate-2" />
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 rounded-full border-2 border-ink bg-white p-1 md:flex">
          {mainNavigation.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => cn('relative rounded-full px-5 py-2 text-[13px] font-medium transition-colors', isActive ? 'text-ink' : 'text-muted-foreground hover:text-ink')}>
              {({ isActive }) => <>{isActive && <motion.span layoutId={reduceMotion ? undefined : 'nav-pill'} transition={{ type: 'spring', stiffness: 380, damping: 32 }} className="absolute inset-0 rounded-full border-2 border-ink bg-sun" />}<span className="relative">{item.label}</span></>}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link ref={magnetic} to={journey} className="hidden items-center gap-1.5 rounded-full border-2 border-ink bg-plum px-5 py-2.5 text-[13px] font-medium text-white shadow-[3px_3px_0_#10110F] transition-shadow hover:shadow-[5px_5px_0_#10110F] lg:inline-flex">My Journey<ArrowUpRight size={15} /></Link>
          <Link to="/onboarding" className="grid size-10 place-items-center rounded-full border-2 border-ink bg-mint font-serif text-lg" aria-label={`Edit ${name}’s profile`}>{name.charAt(0).toUpperCase()}</Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="rounded-full border-2 border-ink md:hidden" aria-label="Open navigation"><Menu size={18} /></Button></SheetTrigger>
            <SheetContent className="border-l-2 border-ink bg-sun" data-lenis-prevent>
              <SheetHeader><SheetTitle className="mono-wordmark">MORROW</SheetTitle><SheetDescription className="text-ink/70">Your money. Your tomorrow.</SheetDescription></SheetHeader>
              <nav aria-label="Mobile navigation" className="flex flex-col gap-2 p-4">
                {[...mainNavigation, { to: '/blueprint', label: 'Financial Blueprint' }, { to: '/onboarding', label: 'Your profile' }].map((item, i) => (
                  <motion.div key={item.to} initial={reduceMotion ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                    <NavLink to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => cn('block rounded-2xl border-2 border-ink p-4 font-serif text-2xl', isActive ? 'bg-white shadow-[4px_4px_0_#10110F]' : 'bg-cream')}>{item.label}</NavLink>
                  </motion.div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
