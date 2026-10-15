import { createDefaultState } from '@/data/defaults';
import { fundConcepts } from '@/data/funds';
import { validAllocation } from '@/lib/calculations';
import type { FinancialState, PortfolioAllocation, UserProfile } from '@/types/financial';
const record=(v:unknown):Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const bounded=(v:unknown,fallback:number,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)?Math.min(max,Math.max(min,v)):fallback;
const text=(v:unknown,fallback:string)=>typeof v==='string'&&v.trim()?v.trim().slice(0,80):fallback;
export function normalizeProfile(value:unknown): UserProfile {
 const d=createDefaultState().profile,p=record(value),income=bounded(p.monthlyIncome,d.monthlyIncome,0,10000000),expenses=bounded(p.essentialExpenses,d.essentialExpenses,0,income);
 return {name:text(p.name,d.name),age:Math.round(bounded(p.age,d.age,18,100)),monthlyIncome:income,essentialExpenses:expenses,monthlyInvestmentCapacity:bounded(p.monthlyInvestmentCapacity,d.monthlyInvestmentCapacity,0,income-expenses),emergencySavings:bounded(p.emergencySavings,d.emergencySavings,0,1000000000),riskTolerance:['low','moderate','high'].includes(String(p.riskTolerance))?p.riskTolerance as UserProfile['riskTolerance']:d.riskTolerance,investmentHorizonYears:Math.round(bounded(p.investmentHorizonYears,d.investmentHorizonYears,1,60))};
}
export function normalizeState(value:unknown):FinancialState {
 const d=createDefaultState(),v=record(value),g=record(v.goal),a=record(v.allocation),prefs=record(v.preferences);
 const allocation={safe:a.safe,steady:a.steady,growth:a.growth} as PortfolioAllocation;
 const holdings=Array.isArray(v.holdings)?v.holdings.slice(0,100).flatMap((raw,index)=>{const h=record(raw);return ['safe','steady','growth'].includes(String(h.bucket))&&typeof h.amount==='number'&&Number.isFinite(h.amount)&&h.amount>=0?[{id:`holding-${index}`,bucket:h.bucket as 'safe'|'steady'|'growth',amount:Math.min(1e9,h.amount)}]:[]}):[];
 return {profile:normalizeProfile(v.profile),goal:{name:text(g.name,d.goal.name),amount:bounded(g.amount,d.goal.amount,1000,1e9),currency:'INR'},allocation:validAllocation(allocation)?allocation:d.allocation,selectedFundIds:Array.isArray(v.selectedFundIds)?[...new Set(v.selectedFundIds.filter((id):id is string=>typeof id==='string'&&fundConcepts.some(f=>f.id===id)))]:[],scenario:['baseline','market-decline','slow-recovery'].includes(String(v.scenario))?v.scenario as FinancialState['scenario']:d.scenario,holdings,preferences:{calmMode:typeof prefs.calmMode==='boolean'?prefs.calmMode:true,reducedMotion:typeof prefs.reducedMotion==='boolean'?prefs.reducedMotion:false},onboardingComplete:v.onboardingComplete===true};
}
