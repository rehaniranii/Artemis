import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

/** Switches between learning the basics and Morrow Match inside Explore. */
export function ExploreNav() {
  return (
    <nav aria-label="Explore sections" className="mb-10 flex gap-6 border-b-2 border-ink text-sm font-medium">
      {[{ to: '/explore', label: 'Understand the basics', end: true }, { to: '/explore/match', label: 'Morrow Match · mutual funds', end: false }].map(item => (
        <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cn('-mb-[2px] border-b-[5px] pb-3 transition-colors', isActive ? 'border-plum text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
