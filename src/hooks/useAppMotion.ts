import { useReducedMotion } from 'motion/react';
import { useFinancialStore } from '@/store/useFinancialStore';
export function useAppMotion(){const system=useReducedMotion(),preference=useFinancialStore(s=>s.preferences.reducedMotion);return {reduceMotion:Boolean(system||preference)};}
