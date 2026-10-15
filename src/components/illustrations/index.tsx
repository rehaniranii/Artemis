import type { CSSProperties, SVGProps } from 'react';

/**
 * Morrow illustration kit: thick ink outlines, flat pastel fills, playful money objects.
 * Each object is its own SVG so scenes can layer and animate them independently.
 */
const INK = '#10110F', SUN = '#FFD95A', CREAM = '#FFF5C7', PLUM = '#4B3B63', MINT = '#A8D5C2', PAPER = '#FFFDF2';
const line = { stroke: INK, strokeWidth: 5, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;
type Art = { className?: string; style?: CSSProperties } & Omit<SVGProps<SVGSVGElement>, 'viewBox'>;
const svg = (props: Art) => ({ 'aria-hidden': true as const, focusable: false as const, ...props });

export function Coin({ symbol = '₹', fill = SUN, ...props }: Art & { symbol?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 120 120" {...svg(props)}>
      <ellipse cx="60" cy="66" rx="50" ry="50" fill={INK} />
      <circle cx="60" cy="58" r="50" fill={fill} {...line} />
      <circle cx="60" cy="58" r="36" fill="none" {...line} strokeWidth={3.5} strokeDasharray="2 9" />
      <text x="60" y="76" textAnchor="middle" fontFamily="'DM Serif Display', Georgia, serif" fontSize="52" fill={INK}>{symbol}</text>
      <path d="M28 36 q8 -12 20 -16" fill="none" stroke={PAPER} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function Phone({ ...props }: Art) {
  return (
    <svg viewBox="0 0 160 300" {...svg(props)}>
      <rect x="14" y="14" width="138" height="280" rx="26" fill={INK} />
      <rect x="8" y="6" width="138" height="280" rx="26" fill={PLUM} {...line} />
      <rect x="20" y="30" width="114" height="232" rx="14" fill={PAPER} {...line} strokeWidth={4} />
      <rect x="58" y="16" width="38" height="7" rx="3.5" fill={INK} />
      <text x="32" y="62" fontFamily="'DM Serif Display', Georgia, serif" fontSize="22" fill={INK}>₹1.4L</text>
      <path d="M32 72 h60" stroke={MINT} strokeWidth="6" strokeLinecap="round" />
      {[[36, 180, 40], [58, 160, 60], [80, 140, 80], [102, 112, 108]].map(([x, y, h], i) => (
        <rect key={i} x={x} y={y} width="16" height={h} rx="4" fill={i === 3 ? SUN : MINT} {...line} strokeWidth={3.5} />
      ))}
      <path d="M34 128 L58 112 L80 118 L118 88" fill="none" {...line} strokeWidth={4} />
      <circle cx="118" cy="88" r="6" fill={SUN} {...line} strokeWidth={3.5} />
      <rect x="42" y="236" width="70" height="14" rx="7" fill={SUN} {...line} strokeWidth={3.5} />
    </svg>
  );
}

export function MoneyCard({ fill = MINT, label, ...props }: Art & { fill?: string; label?: string }) {
  return (
    <svg viewBox="0 0 240 150" {...svg(props)}>
      <rect x="14" y="14" width="220" height="130" rx="18" fill={INK} />
      <rect x="6" y="6" width="220" height="130" rx="18" fill={fill} {...line} />
      <rect x="26" y="34" width="38" height="28" rx="6" fill={SUN} {...line} strokeWidth={4} />
      <path d="M26 48 h38 M45 34 v28" stroke={INK} strokeWidth="3" />
      <path d="M26 96 h70 M26 114 h44" {...line} strokeWidth={4.5} />
      <circle cx="176" cy="104" r="16" fill={SUN} {...line} strokeWidth={4} />
      <circle cx="198" cy="104" r="16" fill={PLUM} {...line} strokeWidth={4} />
      {label && <text x="208" y="48" textAnchor="end" fontFamily="'DM Serif Display', Georgia, serif" fontSize="26" fill={INK}>{label}</text>}
    </svg>
  );
}

export function Sparkle({ fill = SUN, ...props }: Art & { fill?: string }) {
  return (
    <svg viewBox="0 0 100 100" {...svg(props)}>
      <path d="M50 6 C54 34 66 46 94 50 C66 54 54 66 50 94 C46 66 34 54 6 50 C34 46 46 34 50 6 Z" fill={fill} {...line} />
    </svg>
  );
}

export function Blob({ fill = PLUM, ...props }: Art & { fill?: string }) {
  return (
    <svg viewBox="0 0 200 180" {...svg(props)}>
      <path d="M40 30 C80 -4 150 6 176 46 C200 84 186 140 140 160 C96 180 30 168 14 124 C0 86 10 52 40 30 Z" fill={fill} {...line} />
    </svg>
  );
}

export function Sprout({ ...props }: Art) {
  return (
    <svg viewBox="0 0 140 180" {...svg(props)}>
      <path d="M70 110 V58" {...line} />
      <path d="M70 76 C40 76 26 56 26 34 C52 34 70 50 70 76 Z" fill={MINT} {...line} />
      <path d="M70 64 C96 64 116 46 116 22 C88 22 70 38 70 64 Z" fill={MINT} {...line} />
      <path d="M30 108 H110 L100 170 H40 Z" fill={SUN} {...line} />
      <path d="M24 100 H116 V116 H24 Z" fill={PLUM} {...line} />
    </svg>
  );
}

export function ArrowUp({ fill = MINT, ...props }: Art & { fill?: string }) {
  return (
    <svg viewBox="0 0 120 140" {...svg(props)}>
      <path d="M60 8 L112 64 H80 V132 H40 V64 H8 Z" fill={fill} {...line} />
    </svg>
  );
}

export function Squiggle({ color = INK, ...props }: Art & { color?: string }) {
  return (
    <svg viewBox="0 0 200 40" {...svg(props)}>
      <path d="M6 20 C26 0 42 40 62 20 S98 0 118 20 S154 40 174 20 S190 8 196 12" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function Ring({ fill = MINT, ...props }: Art & { fill?: string }) {
  return (
    <svg viewBox="0 0 120 120" {...svg(props)}>
      <circle cx="60" cy="60" r="48" fill="none" stroke={INK} strokeWidth="26" />
      <circle cx="60" cy="60" r="48" fill="none" stroke={fill} strokeWidth="16" />
    </svg>
  );
}

export function Pill({ fill = CREAM, ...props }: Art & { fill?: string }) {
  return (
    <svg viewBox="0 0 160 70" {...svg(props)}>
      <rect x="10" y="12" width="144" height="52" rx="26" fill={INK} />
      <rect x="4" y="6" width="144" height="52" rx="26" fill={fill} {...line} />
    </svg>
  );
}

/** The hero composition: separate layers (data-layer) that GSAP animates independently. */
export function HeroArt({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div data-layer="blob" className="absolute left-[8%] top-[18%] w-[62%]"><div data-depth="0.2"><Blob fill={PLUM} className="w-full" /></div></div>
      <div data-layer="ring" className="absolute right-[2%] top-[4%] w-[26%]"><div data-depth="0.5"><Ring className="w-full" /></div></div>
      <div data-layer="card" className="absolute bottom-[10%] left-0 w-[52%] -rotate-12"><div data-depth="0.4"><MoneyCard className="w-full" label="SIP" /></div></div>
      <div data-layer="phone" className="absolute left-[34%] top-[6%] w-[34%] rotate-6"><div data-depth="0.7"><Phone className="w-full" /></div></div>
      <div data-layer="coin" className="absolute right-[6%] top-[40%] w-[24%]"><div data-depth="1"><Coin className="w-full" /></div></div>
      <div data-layer="coin" className="absolute left-[4%] top-[6%] w-[18%]"><div data-depth="1"><Coin className="w-full" fill={MINT} /></div></div>
      <div data-layer="coin" className="absolute bottom-[4%] right-[18%] w-[16%]"><div data-depth="1"><Coin className="w-full" /></div></div>
      <div data-layer="sprout" className="absolute bottom-[2%] right-[-2%] w-[20%]"><div data-depth="0.5"><Sprout className="w-full" /></div></div>
      <div data-layer="spark" className="absolute right-[34%] top-0 w-[11%]"><div data-depth="1.2"><Sparkle className="w-full" /></div></div>
      <div data-layer="spark" className="absolute bottom-[34%] left-[2%] w-[9%]"><div data-depth="1.2"><Sparkle className="w-full" fill={MINT} /></div></div>
    </div>
  );
}
