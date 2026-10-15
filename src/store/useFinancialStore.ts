import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { createDefaultState } from '@/data/defaults';
import { browserStorage } from '@/lib/storage';
import { formatINR } from '@/lib/format';
import { validAllocation } from '@/lib/calculations';
import { fundConcepts } from '@/data/funds';
import { normalizeDraft, normalizeProfile, normalizeState } from './normalize';
import { answersFromState, deriveRiskProfile, validateStep } from '@/features/onboarding/journey';
import type { FinancialState, UserProfile, FinancialGoal, PortfolioAllocation, ScenarioId, DemoHolding, UserPreferences, OnboardingAnswers, RiskTolerance } from '@/types/financial';
interface Actions {
 setProfile:(profile:Partial<UserProfile>)=>void;
 setGoal:(goal:Partial<FinancialGoal>)=>void;
 setAllocation:(allocation:PortfolioAllocation)=>boolean;
 setSelectedFunds:(ids:string[])=>void;
 setScenario:(scenario:ScenarioId)=>void;
 setHoldings:(holdings:DemoHolding[])=>void;
 setPreferences:(preferences:Partial<UserPreferences>)=>void;
 /** Opens the question flow seeded with the saved answers, so revisiting means editing, not re-entering. */
 startOnboarding:()=>void;
 updateOnboarding:(patch:Partial<OnboardingAnswers>)=>void;
 setOnboardingStep:(step:number)=>void;
 /** Commits the draft to profile, goal and journey; returns false if there is no valid draft. */
 finishOnboarding:()=>boolean;
 resetDemo:()=>void;
}
export type FinancialStore = FinancialState & Actions;
/** Versioned namespace deliberately isolated from the archived prototype. */
export function createFinancialStore(storage:StateStorage=browserStorage){return create<FinancialStore>()(persist((set,get)=>({
 ...createDefaultState(),
 setProfile:patch=>set(s=>({profile:normalizeProfile({...s.profile,...patch})})),
 setGoal:patch=>set(s=>{const goal=normalizeState({...s,goal:{...s.goal,...patch}}).goal;if(patch.amount!==undefined&&patch.name===undefined)goal.name=`My ${formatINR(goal.amount)} goal`;return {goal};}),
 setAllocation:allocation=>{if(!validAllocation(allocation))return false;set({allocation:{...allocation}});return true;},
 setSelectedFunds:ids=>set({selectedFundIds:[...new Set(ids.filter(id=>fundConcepts.some(f=>f.id===id)))]}),
 setScenario:scenario=>{if(['baseline','market-decline','slow-recovery'].includes(scenario))set({scenario});},
 setHoldings:holdings=>set(s=>({holdings:normalizeState({...s,holdings}).holdings})),
 setPreferences:preferences=>set(s=>({preferences:normalizeState({...s,preferences:{...s.preferences,...preferences}}).preferences})),
 startOnboarding:()=>set(s=>({onboardingDraft:{step:1,answers:answersFromState(s)}})),
 updateOnboarding:patch=>set(s=>s.onboardingDraft?{onboardingDraft:normalizeDraft({...s.onboardingDraft,answers:{...s.onboardingDraft.answers,...patch}},s)}:{}),
 setOnboardingStep:step=>set(s=>s.onboardingDraft?{onboardingDraft:normalizeDraft({...s.onboardingDraft,step},s)}:{}),
 finishOnboarding:()=>{
  const {onboardingDraft:draft,profile,goal}=get();if(!draft||[1,2,3,4].some(step=>validateStep(step,draft.answers)))return false;const a=draft.answers;
  const tolerance:Record<OnboardingAnswers['riskComfort'],RiskTolerance>={'very-uncomfortable':'low','worried-but-wait':'moderate',understands:'high'};
  // Expenses aren't asked in onboarding; only lower them when needed to keep the contribution affordable, never invent higher ones.
  set({
   profile:normalizeProfile({...profile,monthlyIncome:a.monthlyIncome,essentialExpenses:Math.min(profile.essentialExpenses,a.monthlyIncome-a.monthlyContribution),monthlyInvestmentCapacity:a.monthlyContribution,investmentHorizonYears:a.horizonYears,riskTolerance:tolerance[a.riskComfort]}),
   goal:{...goal,amount:a.goalAmount,name:a.goalAmount===goal.amount?goal.name:`My ${formatINR(a.goalAmount)} goal`},
   journey:{riskComfort:a.riskComfort,accessNeed:a.accessNeed,emergencyStatus:a.emergencyStatus,horizonFlexible:a.horizonFlexible,riskProfile:deriveRiskProfile(a)},
   onboardingDraft:null,onboardingComplete:true,
  });
  return true;
 },
 resetDemo:()=>set(createDefaultState()),
}),{name:'mono:financial-state',version:1,storage:createJSONStorage(()=>storage),partialize:state=>({profile:state.profile,goal:state.goal,allocation:state.allocation,selectedFundIds:state.selectedFundIds,scenario:state.scenario,holdings:state.holdings,preferences:state.preferences,journey:state.journey,onboardingDraft:state.onboardingDraft,onboardingComplete:state.onboardingComplete}),migrate:state=>normalizeState(state),merge:(persisted,current)=>({...current,...normalizeState(persisted)})}));}
export const useFinancialStore=createFinancialStore();
