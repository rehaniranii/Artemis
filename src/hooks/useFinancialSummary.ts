import { useFinancialStore } from '@/store/useFinancialStore';
import { capacitySummary, goalProgress, portfolioTotal } from '@/lib/calculations';
export function useFinancialSummary(){const profile=useFinancialStore(s=>s.profile),goal=useFinancialStore(s=>s.goal),holdings=useFinancialStore(s=>s.holdings);const balance=portfolioTotal(holdings);return {profile,goal,balance,progress:goalProgress(balance,goal.amount),capacity:capacitySummary(profile)};}
