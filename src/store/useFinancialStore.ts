import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { createDefaultState } from '@/data/defaults';
import { browserStorage } from '@/lib/storage';
import { formatINR } from '@/lib/format';
import { validAllocation } from '@/lib/calculations';
import { fundConcepts } from '@/data/funds';
import { normalizeProfile, normalizeState } from './normalize';
import type { FinancialState, UserProfile, FinancialGoal, PortfolioAllocation, ScenarioId, DemoHolding, UserPreferences } from '@/types/financial';
interface Actions {
 setProfile:(profile:Partial<UserProfile>)=>void;
 setGoal:(goal:Partial<FinancialGoal>)=>void;
 setAllocation:(allocation:PortfolioAllocation)=>boolean;
 setSelectedFunds:(ids:string[])=>void;
 setScenario:(scenario:ScenarioId)=>void;
 setHoldings:(holdings:DemoHolding[])=>void;
 setPreferences:(preferences:Partial<UserPreferences>)=>void;
 completeOnboarding:()=>void;
 resetDemo:()=>void;
}
export type FinancialStore = FinancialState & Actions;
/** Versioned namespace deliberately isolated from the archived prototype. */
export function createFinancialStore(storage:StateStorage=browserStorage){return create<FinancialStore>()(persist((set)=>({
 ...createDefaultState(),
 setProfile:patch=>set(s=>({profile:normalizeProfile({...s.profile,...patch})})),
 setGoal:patch=>set(s=>{const goal=normalizeState({...s,goal:{...s.goal,...patch}}).goal;if(patch.amount!==undefined&&patch.name===undefined)goal.name=`My ${formatINR(goal.amount)} goal`;return {goal};}),
 setAllocation:allocation=>{if(!validAllocation(allocation))return false;set({allocation:{...allocation}});return true;},
 setSelectedFunds:ids=>set({selectedFundIds:[...new Set(ids.filter(id=>fundConcepts.some(f=>f.id===id)))]}),
 setScenario:scenario=>{if(['baseline','market-decline','slow-recovery'].includes(scenario))set({scenario});},
 setHoldings:holdings=>set(s=>({holdings:normalizeState({...s,holdings}).holdings})),
 setPreferences:preferences=>set(s=>({preferences:normalizeState({...s,preferences:{...s.preferences,...preferences}}).preferences})),
 completeOnboarding:()=>set({onboardingComplete:true}),resetDemo:()=>set(createDefaultState()),
}),{name:'mono:financial-state',version:1,storage:createJSONStorage(()=>storage),partialize:state=>({profile:state.profile,goal:state.goal,allocation:state.allocation,selectedFundIds:state.selectedFundIds,scenario:state.scenario,holdings:state.holdings,preferences:state.preferences,onboardingComplete:state.onboardingComplete}),migrate:state=>normalizeState(state),merge:(persisted,current)=>({...current,...normalizeState(persisted)})}));}
export const useFinancialStore=createFinancialStore();
