import { createDefaultState } from '@/data/defaults';
import { fundConcepts } from '@/data/funds';
import { validAllocation } from '@/lib/calculations';
import { LIMITS } from '@/features/onboarding/journey';
import type { FinancialState, JourneyAnswers, OnboardingDraft, PortfolioAllocation, UserProfile } from '@/types/financial';
const record=(v:unknown):Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const bounded=(v:unknown,fallback:number,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)?Math.min(max,Math.max(min,v)):fallback;
const text=(v:unknown,fallback:string)=>typeof v==='string'&&v.trim()?v.trim().slice(0,80):fallback;
export function normalizeProfile(value:unknown): UserProfile {
 const d=createDefaultState().profile,p=record(value),income=bounded(p.monthlyIncome,d.monthlyIncome,0,10000000),expenses=bounded(p.essentialExpenses,d.essentialExpenses,0,income);
 return {name:text(p.name,d.name),age:Math.round(bounded(p.age,d.age,18,100)),monthlyIncome:income,essentialExpenses:expenses,monthlyInvestmentCapacity:bounded(p.monthlyInvestmentCapacity,d.monthlyInvestmentCapacity,0,income-expenses),emergencySavings:bounded(p.emergencySavings,d.emergencySavings,0,1000000000),riskTolerance:['low','moderate','high'].includes(String(p.riskTolerance))?p.riskTolerance as UserProfile['riskTolerance']:d.riskTolerance,investmentHorizonYears:Math.round(bounded(p.investmentHorizonYears,d.investmentHorizonYears,1,60))};
}
const oneOf=<T extends string>(v:unknown,options:readonly T[],fallback:T):T=>options.includes(v as T)?v as T:fallback;
const comforts=['very-uncomfortable','worried-but-wait','understands'] as const,access=['within-3-years','within-5-years','long-term'] as const,emergency=['yes','a-little','not-yet'] as const;
export function normalizeJourney(value:unknown):JourneyAnswers {
 const d=createDefaultState().journey,j=record(value);
 return {riskComfort:oneOf(j.riskComfort,comforts,d.riskComfort),accessNeed:oneOf(j.accessNeed,access,d.accessNeed),emergencyStatus:oneOf(j.emergencyStatus,emergency,d.emergencyStatus),horizonFlexible:j.horizonFlexible===true,riskProfile:oneOf(j.riskProfile,['conservative','moderate','growth'] as const,d.riskProfile)};
}
/** A half-finished onboarding survives reloads. Numbers are only sanitised here so typing isn't fought; each step validates its own bounds. */
export function normalizeDraft(value:unknown,state:Pick<FinancialState,'profile'|'journey'>):OnboardingDraft|null {
 if(value===null||typeof value!=='object')return null;
 const v=record(value),a=record(v.answers);
 const answers={goalAmount:Math.round(bounded(a.goalAmount,1000000,0,LIMITS.goal.max)),monthlyIncome:Math.round(bounded(a.monthlyIncome,state.profile.monthlyIncome,0,LIMITS.income.max)),monthlyContribution:Math.round(bounded(a.monthlyContribution,state.profile.monthlyInvestmentCapacity,0,LIMITS.income.max)),horizonYears:Math.round(bounded(a.horizonYears,state.profile.investmentHorizonYears,0,LIMITS.horizon.max)),horizonFlexible:a.horizonFlexible===true,riskComfort:oneOf(a.riskComfort,comforts,state.journey.riskComfort),accessNeed:oneOf(a.accessNeed,access,state.journey.accessNeed),emergencyStatus:oneOf(a.emergencyStatus,emergency,state.journey.emergencyStatus)};
 return {step:Math.round(bounded(v.step,0,0,8)),answers};
}
export function normalizeState(value:unknown):FinancialState {
 const d=createDefaultState(),v=record(value),g=record(v.goal),a=record(v.allocation),prefs=record(v.preferences);
 const allocation={safe:a.safe,steady:a.steady,growth:a.growth} as PortfolioAllocation;
 const profile=normalizeProfile(v.profile),journey=normalizeJourney(v.journey);
 const holdings=Array.isArray(v.holdings)?v.holdings.slice(0,100).flatMap((raw,index)=>{const h=record(raw);return ['safe','steady','growth'].includes(String(h.bucket))&&typeof h.amount==='number'&&Number.isFinite(h.amount)&&h.amount>=0?[{id:`holding-${index}`,bucket:h.bucket as 'safe'|'steady'|'growth',amount:Math.min(1e9,h.amount)}]:[]}):[];
 return {profile,goal:{name:text(g.name,d.goal.name),amount:bounded(g.amount,d.goal.amount,1000,1e9),currency:'INR'},allocation:validAllocation(allocation)?allocation:d.allocation,selectedFundIds:Array.isArray(v.selectedFundIds)?[...new Set(v.selectedFundIds.filter((id):id is string=>typeof id==='string'&&fundConcepts.some(f=>f.id===id)))]:[],scenario:['baseline','market-decline','slow-recovery'].includes(String(v.scenario))?v.scenario as FinancialState['scenario']:d.scenario,holdings,preferences:{calmMode:typeof prefs.calmMode==='boolean'?prefs.calmMode:true,reducedMotion:typeof prefs.reducedMotion==='boolean'?prefs.reducedMotion:false},journey,onboardingDraft:normalizeDraft(v.onboardingDraft,{profile,journey}),onboardingComplete:v.onboardingComplete===true};
}
