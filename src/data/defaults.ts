import type { FinancialState } from '@/types/financial';
/** Demo-persona defaults, not a recommended portfolio. Zero holdings means no invented performance. */
export const createDefaultState = (): FinancialState => ({
 profile:{name:'Aarav',age:19,monthlyIncome:8000,essentialExpenses:6000,monthlyInvestmentCapacity:2000,emergencySavings:0,riskTolerance:'moderate',investmentHorizonYears:10},
 goal:{name:'My first ₹10 lakh',amount:1000000,currency:'INR'},
 allocation:{safe:30,steady:40,growth:30},selectedFundIds:[],scenario:'baseline',holdings:[],
 preferences:{reducedMotion:false,calmMode:true},onboardingComplete:false,
});
