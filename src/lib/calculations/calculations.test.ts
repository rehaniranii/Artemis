import { describe, it, expect } from 'vitest';
import { futureValue,validAllocation,goalProgress,capacitySummary,portfolioTotal } from './index';
import { createDefaultState } from '@/data/defaults';
describe('financial foundation',()=>{
 it('handles zero return and month-end compounding',()=>{expect(futureValue(2000,0,12)).toBe(24000);let manual=0;for(let i=0;i<12;i++)manual=manual*1.005+2000;expect(futureValue(2000,.06,12)).toBeCloseTo(manual,6);expect(futureValue(2000,.06,0)).toBe(0);});
 it('rejects invalid projection inputs instead of inventing results',()=>{expect(()=>futureValue(-1,.06,12)).toThrow();expect(()=>futureValue(1000,NaN,12)).toThrow();expect(()=>futureValue(1000,.05,1.5)).toThrow();expect(()=>futureValue(1000,-1,12)).toThrow();});
 it('requires a finite, non-negative allocation totalling 100%',()=>{expect(validAllocation({safe:20,steady:30,growth:50})).toBe(true);expect(validAllocation({safe:-20,steady:30,growth:90})).toBe(false);expect(validAllocation({safe:20,steady:30,growth:60})).toBe(false);expect(validAllocation({safe:NaN,steady:30,growth:70})).toBe(false);});
 it('derives capacity and progress without duplicate stored totals',()=>{expect(capacitySummary(createDefaultState().profile)).toEqual({available:2000,committed:2000,remaining:0});expect(goalProgress(250000,1000000)).toBe(25);expect(goalProgress(200,100)).toBe(100);expect(goalProgress(100,0)).toBe(0);expect(portfolioTotal([{id:'x',bucket:'safe',amount:100}])).toBe(100);});
});
