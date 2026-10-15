/** Illustrative annual inputs only. Not historical performance, product rates, or forecasts. */
export const ILLUSTRATIVE_ASSUMPTIONS = {
 kind:'assumption' as const, annualReturns:{safe:0.04,steady:0.06,growth:0.09}, annualInflation:0.05,
 taxesIncluded:false, feesIncluded:false,
};
export const scenarios = [
 {id:'baseline',name:'A steady illustration',description:'A placeholder for a constant-return example.'},
 {id:'market-decline',name:'A market decline',description:'A placeholder for a hypothetical loss scenario.'},
 {id:'slow-recovery',name:'A slower recovery',description:'A placeholder for a prolonged-downturn scenario.'},
] as const;
