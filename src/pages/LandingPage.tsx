import { useEffect } from 'react';
import { Hero } from '@/features/story/Hero';
import { SceneClarity, SceneConfusion, SceneDiscovery, SceneMatch } from '@/features/story/StoryScenes';
import { SceneFinal, SceneMillion, SceneReality } from '@/features/story/FutureScenes';
import { Sparkle } from '@/components/illustrations';

const BAND = ['Your money. Your tomorrow.', 'Understand', 'Plan', 'Grow', 'No stock tips', 'No overnight riches'];

function Marquee() {
  const items = [...BAND, ...BAND];
  return (
    <div aria-hidden="true" className="relative z-10 -my-1 -rotate-2 overflow-hidden border-y-2 border-ink bg-ink py-4 text-sun">
      <div className="marquee">
        {[0, 1].map(copy => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((t, i) => <span key={i} className="flex items-center gap-6 px-6 font-serif text-3xl uppercase sm:text-4xl">{t}<Sparkle className="size-6" /></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

/** The scroll-driven story: hero, then seven scenes from confusion to a first step. */
export default function LandingPage() {
  useEffect(() => { document.title = 'Morrow — Your money. Your tomorrow.'; }, []);
  return (
    <div className="overflow-x-clip">
      <Hero />
      <Marquee />
      <SceneConfusion />
      <SceneClarity />
      <SceneDiscovery />
      <SceneMatch />
      <SceneMillion />
      <SceneReality />
      <SceneFinal />
    </div>
  );
}
