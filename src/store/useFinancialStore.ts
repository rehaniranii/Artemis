import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { createDefaultState } from '@/data/defaults';
import { APPROACHES } from '@/data/assumptions';
import { findFund } from '@/data/funds';
import { browserStorage } from '@/lib/storage';
import { formatINR } from '@/lib/format';
import { rebalanceAllocation, validAllocation } from '@/lib/calculations';
import { normalizeDraft, normalizeHoldings, normalizeProfile, normalizeState } from './normalize';
import { answersFromState, deriveRiskProfile, validateStep } from '@/features/onboarding/journey';
import type { AssetClass, FinancialState, UserProfile, FinancialGoal, PortfolioAllocation, MarketScenarioId, SimulatedHolding, UserPreferences, OnboardingAnswers, RiskTolerance, InvestmentApproach, RiskProfile } from '@/types/financial';
interface Actions {
 setProfile:(profile:Partial<UserProfile>)=>void;
 setGoal:(goal:Partial<FinancialGoal>)=>void;
 /** Sets the monthly plan contribution (up to income), lowering stored essentials only if needed to keep it affordable. */
 setMonthlyInvestment:(amount:number)=>void;
 setHorizon:(years:number)=>void;
 setApproach:(approach:InvestmentApproach)=>void;
 setAllocation:(allocation:PortfolioAllocation)=>boolean;
 /** Changes one asset class and rebalances the others so the total stays 100%. */
 setAllocationClass:(assetClass:AssetClass,percent:number)=>void;
 addPlanFund:(fundId:string)=>void;
 removePlanFund:(fundId:string)=>void;
 setPlanFundWeight:(fundId:string,weight:number)=>void;
 setScenario:(scenario:MarketScenarioId)=>void;
 setHoldings:(holdings:SimulatedHolding[])=>void;
 saveBlueprint:(signature:string)=>void;
 setPreferences:(preferences:Partial<UserPreferences>)=>void;
 /** Opens the question flow seeded with the saved answers, so revisiting means editing, not re-entering. */
 startOnboarding:()=>void;
 updateOnboarding:(patch:Partial<OnboardingAnswers>)=>void;
 setOnboardingStep:(step:number)=>void;
 /** Commits the draft to profile, goal, journey and plan approach; returns false if there is no valid draft. */
 finishOnboarding:()=>boolean;
 /** Aarav's full demo: profile, plan, example funds and fictional portfolio, with onboarding complete. */
 loadDemo:()=>void;
 resetDemo:()=>void;
}
export type FinancialStore = FinancialState & Actions;
export const approachFor=(profile:RiskProfile):InvestmentApproach=>({conservative:'steady',moderate:'balanced',growth:'growth'} as const)[profile];
const presetAllocation=(approach:InvestmentApproach)=>({...APPROACHES.find(a=>a.id===approach)!.allocation});
const withContribution=(profile:UserProfile,income:number,amount:number)=>normalizeProfile({...profile,monthlyIncome:income,essentialExpenses:Math.max(0,Math.min(profile.essentialExpenses,income-amount)),monthlyInvestmentCapacity:Math.min(amount,income)});
/** Versioned namespace deliberately isolated from the archived prototype. */
export function createFinancialStore(storage:StateStorage=browserStorage){return create<FinancialStore>()(persist((set,get)=>({
 ...createDefaultState(),
 setProfile:patch=>set(s=>({profile:normalizeProfile({...s.profile,...patch})})),
 setGoal:patch=>set(s=>{const goal=normalizeState({...s,goal:{...s.goal,...patch}}).goal;if(patch.amount!==undefined&&patch.name===undefined)goal.name=`My ${formatINR(goal.amount)} goal`;return {goal};}),
 setMonthlyInvestment:amount=>set(s=>({profile:withContribution(s.profile,s.profile.monthlyIncome,Math.max(0,Math.round(amount)))})),
 setHorizon:years=>set(s=>({profile:normalizeProfile({...s.profile,investmentHorizonYears:years})})),
 setApproach:approach=>set({approach,allocation:presetAllocation(approach)}),
 setAllocation:allocation=>{if(!validAllocation(allocation))return false;set({allocation:{...allocation}});return true;},
 setAllocationClass:(assetClass,percent)=>set(s=>({allocation:rebalanceAllocation(s.allocation,assetClass,percent)})),
 addPlanFund:fundId=>set(s=>findFund(fundId)&&!s.planFunds.some(f=>f.fundId===fundId)?{planFunds:[...s.planFunds,{fundId,weight:s.planFunds.some(f=>findFund(f.fundId)?.assetClass===findFund(fundId)!.assetClass)?50:100}]}:{}),
 removePlanFund:fundId=>set(s=>({planFunds:s.planFunds.filter(f=>f.fundId!==fundId)})),
 setPlanFundWeight:(fundId,weight)=>set(s=>({planFunds:s.planFunds.map(f=>f.fundId===fundId?{...f,weight:Math.round(Math.min(100,Math.max(0,weight)))}:f)})),
 setScenario:scenario=>{if(['fast-recovery','slow-recovery','prolonged-downturn'].includes(scenario))set({scenario});},
 setHoldings:holdings=>set({holdings:normalizeHoldings(holdings)}),
 saveBlueprint:signature=>set({savedBlueprint:{savedAt:new Date().toISOString(),signature}}),
 setPreferences:preferences=>set(s=>({preferences:normalizeState({...s,preferences:{...s.preferences,...preferences}}).preferences})),
 startOnboarding:()=>set(s=>({onboardingDraft:{step:1,answers:answersFromState(s)}})),
 updateOnboarding:patch=>set(s=>s.onboardingDraft?{onboardingDraft:normalizeDraft({...s.onboardingDraft,answers:{...s.onboardingDraft.answers,...patch}},s)}:{}),
 setOnboardingStep:step=>set(s=>s.onboardingDraft?{onboardingDraft:normalizeDraft({...s.onboardingDraft,step},s)}:{}),
 finishOnboarding:()=>{
  const {onboardingDraft:draft,profile,goal}=get();if(!draft||[1,2,3,4].some(step=>validateStep(step,draft.answers)))return false;const a=draft.answers;
  const tolerance:Record<OnboardingAnswers['riskComfort'],RiskTolerance>={'very-uncomfortable':'low','worried-but-wait':'moderate',understands:'high'};
  const riskProfile=deriveRiskProfile(a),approach=approachFor(riskProfile);
  // Expenses aren't asked in onboarding; only lower them when needed to keep the contribution affordable, never invent higher ones.
  set({
   profile:{...withContribution(profile,a.monthlyIncome,a.monthlyContribution),investmentHorizonYears:a.horizonYears,riskTolerance:tolerance[a.riskComfort]},
   goal:{...goal,amount:a.goalAmount,name:a.goalAmount===goal.amount?goal.name:`My ${formatINR(a.goalAmount)} goal`},
   journey:{riskComfort:a.riskComfort,accessNeed:a.accessNeed,emergencyStatus:a.emergencyStatus,horizonFlexible:a.horizonFlexible,riskProfile},
   approach,allocation:presetAllocation(approach),
   onboardingDraft:null,onboardingComplete:true,
  });
  return true;
 },
 loadDemo:()=>set(s=>({...createDefaultState(),preferences:s.preferences,onboardingComplete:true})),
 resetDemo:()=>set(createDefaultState()),
}),{name:'mono:financial-state',version:2,storage:createJSONStorage(()=>storage),partialize:state=>({profile:state.profile,goal:state.goal,approach:state.approach,allocation:state.allocation,planFunds:state.planFunds,scenario:state.scenario,holdings:state.holdings,savedBlueprint:state.savedBlueprint,preferences:state.preferences,journey:state.journey,onboardingDraft:state.onboardingDraft,onboardingComplete:state.onboardingComplete}),migrate:state=>normalizeState(state),merge:(persisted,current)=>({...current,...normalizeState(persisted)})}));}
export const useFinancialStore=createFinancialStore();
