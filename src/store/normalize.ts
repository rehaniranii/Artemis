import { createDefaultState } from '@/data/defaults';
import { findFund } from '@/data/funds';
import { validAllocation } from '@/lib/calculations';
import { LIMITS } from '@/features/onboarding/journey';
import type { AssetClass, FinancialState, JourneyAnswers, OnboardingDraft, PlanFund, PortfolioAllocation, SimulatedHolding, UserProfile } from '@/types/financial';
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
const classes=['stable','debt','equity','gold'] as const;
const money=(v:unknown)=>bounded(v,0,0,1e9);
export function normalizePlanFunds(value:unknown):PlanFund[]{
 if(!Array.isArray(value))return createDefaultState().planFunds;
 const seen=new Set<string>();
 return value.slice(0,24).flatMap(raw=>{const f=record(raw),id=String(f.fundId);if(!findFund(id)||seen.has(id))return [];seen.add(id);return [{fundId:id,weight:Math.round(bounded(f.weight,100,0,100))}];});
}
export function normalizeHoldings(value:unknown):SimulatedHolding[]{
 if(!Array.isArray(value))return createDefaultState().holdings;
 return value.slice(0,50).flatMap((raw,index)=>{const h=record(raw);if(!classes.includes(h.assetClass as AssetClass))return [];return [{id:text(h.id,`holding-${index}`),name:text(h.name,'Holding'),assetClass:h.assetClass as AssetClass,...(typeof h.fundId==='string'&&findFund(h.fundId)?{fundId:h.fundId}:{}),contributed:money(h.contributed),value:money(h.value)}];});
}
export function normalizeState(value:unknown):FinancialState {
 const d=createDefaultState(),v=record(value),g=record(v.goal),a=record(v.allocation),prefs=record(v.preferences),saved=record(v.savedBlueprint);
 const allocation=Object.fromEntries(classes.map(c=>[c,a[c]])) as PortfolioAllocation;
 const profile=normalizeProfile(v.profile),journey=normalizeJourney(v.journey);
 return {profile,goal:{name:text(g.name,d.goal.name),amount:bounded(g.amount,d.goal.amount,1000,1e9),currency:'INR'},
  approach:oneOf(v.approach,['steady','balanced','growth'] as const,d.approach),allocation:validAllocation(allocation)?allocation:d.allocation,planFunds:normalizePlanFunds(v.planFunds),
  scenario:oneOf(v.scenario,['fast-recovery','slow-recovery','prolonged-downturn'] as const,d.scenario),holdings:normalizeHoldings(v.holdings),
  savedBlueprint:typeof saved.savedAt==='string'&&typeof saved.signature==='string'?{savedAt:saved.savedAt,signature:saved.signature}:null,
  preferences:{calmMode:typeof prefs.calmMode==='boolean'?prefs.calmMode:true,reducedMotion:typeof prefs.reducedMotion==='boolean'?prefs.reducedMotion:false},journey,onboardingDraft:normalizeDraft(v.onboardingDraft,{profile,journey}),onboardingComplete:v.onboardingComplete===true};
}
