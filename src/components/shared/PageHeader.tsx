import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useAppMotion } from '@/hooks/useAppMotion';

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const { reduceMotion } = useAppMotion();
  useEffect(() => { document.title = `${title} | Morrow`; heading.current?.focus({ preventScroll: true }); }, [title]);
  const rise = (delay: number) => (reduceMotion ? {} : { initial: { y: '105%' }, animate: { y: 0 }, transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const } });
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
      <div className="max-w-4xl">
        <p className="eyebrow mb-5 flex items-center gap-2 text-ink"><span className="marker-dot" />{eyebrow}</p>
        <div className="overflow-hidden pb-2">
          <motion.h1 ref={heading} tabIndex={-1} {...rise(0)} className="display text-[44px] outline-none sm:text-6xl md:text-[84px]">{title}</motion.h1>
        </div>
        <motion.p initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="mt-5 max-w-xl text-sm text-muted-foreground md:text-base">{description}</motion.p>
      </div>
      {action}
    </div>
  );
}
