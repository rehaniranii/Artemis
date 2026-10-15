import { motion } from 'motion/react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { formatINR } from '@/lib/format';

const W = 640, H = 280, PAD = 28;

/**
 * Plan path up to the bad year, the drop, and (optionally) the simulated path afterwards.
 * Future paths always have the same number of points, so switching scenarios morphs smoothly.
 */
export function RealityChart({ before, original, crashYear, after, future, years, goal, stage }: {
  before: number[]; original: number[]; crashYear: number; after: number; future: number[] | null; years: number; goal: number; stage: 1 | 2 | 3;
}) {
  const { reduceMotion } = useAppMotion();
  const max = Math.max(goal, ...original, ...(future ?? []), ...before) * 1.08;
  const x = (year: number) => PAD + (year / years) * (W - PAD * 2);
  const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2);
  const line = (values: number[], startYear: number) => values.map((v, i) => `${i ? 'L' : 'M'}${x(startYear + i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const crashX = x(crashYear), dropX = x(crashYear + 0.25);
  const futurePath = future ? `M${dropX.toFixed(1)} ${y(after).toFixed(1)} ` + future.slice(1).map((v, i) => `L${x(crashYear + 1 + i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ') : '';
  const morph = reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Illustrative chart: the plan grows to ${formatINR(before[before.length - 1])}, a bad year takes it to ${formatINR(after)}${future ? `, then the simulated path ends at ${formatINR(future[future.length - 1])}` : ''}.`}>
      <line x1={PAD} x2={W - PAD} y1={y(goal)} y2={y(goal)} stroke="#4B3B63" strokeWidth="2" strokeDasharray="6 8" />
      <text x={W - PAD} y={y(goal) - 8} textAnchor="end" fontSize="12" fontWeight="600" fill="#4B3B63">Goal {formatINR(goal)}</text>
      {/* The original plan, as a quiet dashed reference beyond the bad year. */}
      <path d={line(original.slice(crashYear), crashYear)} fill="none" stroke="#10110F" strokeOpacity="0.3" strokeWidth="3" strokeDasharray="4 7" />
      <path d={line(before, 0)} fill="none" stroke="#10110F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {stage >= 2 && <path data-drop d={`M${crashX} ${y(before[before.length - 1])} L${dropX} ${y(after)}`} fill="none" stroke="#B3492F" strokeWidth="6" strokeLinecap="round" />}
      {stage === 3 && future && <motion.path initial={false} animate={{ d: futurePath }} transition={morph} fill="none" stroke="#4B3B63" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />}
      <circle cx={crashX} cy={y(before[before.length - 1])} r="8" fill="#FFD95A" stroke="#10110F" strokeWidth="3" />
      {stage >= 2 && <circle data-drop-dot cx={dropX} cy={y(after)} r="8" fill="#B3492F" stroke="#10110F" strokeWidth="3" />}
      <text x={PAD} y={H - 6} fontSize="12" fill="#5E5A6B">Today</text>
      <text x={W - PAD} y={H - 6} fontSize="12" textAnchor="end" fill="#5E5A6B">Year {years}</text>
    </svg>
  );
}
