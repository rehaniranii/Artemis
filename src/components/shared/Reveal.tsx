import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useAppMotion } from '@/hooks/useAppMotion';

/** Fades content up once as it enters the viewport. Renders statically under reduced motion and in print. */
export function Reveal({ children, delay = 0, className, as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'section' | 'li' | 'article' }) {
  const { reduceMotion } = useAppMotion();
  const Tag = motion[as];
  if (reduceMotion) { const Static = as; return <Static className={className}>{children}</Static>; }
  return (
    <Tag data-reveal className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -60px 0px' }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </Tag>
  );
}
