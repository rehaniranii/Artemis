const inr = new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
export const formatINR = (value: number) => inr.format(Number.isFinite(value)?value:0);
export const formatPercent = (value: number) => `${new Intl.NumberFormat('en-IN',{maximumFractionDigits:1}).format(Number.isFinite(value)?value:0)}%`;
