import type { DemoHolding, PortfolioAllocation, UserProfile } from '@/types/financial';
export const disposableIncome = (profile: Pick<UserProfile,'monthlyIncome'|'essentialExpenses'>) => Math.max(0,profile.monthlyIncome-profile.essentialExpenses);
export const portfolioTotal = (holdings: DemoHolding[]) => holdings.reduce((total,holding)=>total+holding.amount,0);
export const goalProgress = (balance: number,goal: number) => goal>0?Math.min(100,Math.max(0,balance/goal*100)):0;
export function validAllocation(allocation: PortfolioAllocation): boolean {const values=[allocation.safe,allocation.steady,allocation.growth];return values.every(v=>Number.isFinite(v)&&v>=0&&v<=100)&&Math.abs(values.reduce((a,b)=>a+b,0)-100)<0.0001;}
/** Capacity is a monetary constraint, not a risk-tolerance recommendation. */
export function capacitySummary(profile: UserProfile) {return {available:disposableIncome(profile),committed:profile.monthlyInvestmentCapacity,remaining:Math.max(0,disposableIncome(profile)-profile.monthlyInvestmentCapacity)};}
/** Reusable month-end contribution helper; no market simulator is implemented yet. */
export function futureValue(monthlyAmount: number,annualRate: number,months: number): number {
 if(!Number.isFinite(monthlyAmount)||monthlyAmount<0||!Number.isFinite(annualRate)||annualRate<=-1||!Number.isInteger(months)||months<0||months>1200)throw new RangeError('Invalid projection inputs');
 const r=annualRate/12;
 return r===0?monthlyAmount*months:monthlyAmount*Math.expm1(months*Math.log1p(r))/r;
}
