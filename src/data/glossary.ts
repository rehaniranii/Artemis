/** Plain-language definitions used by <Term>. Educational descriptions, not product terms. */
export interface GlossaryEntry { term: string; short: string; example?: string }

export const glossary = {
  sip: {
    term: 'SIP',
    short: 'A Systematic Investment Plan: investing a fixed amount at regular intervals, usually monthly. It’s a method of investing, not an investment itself.',
    example: '₹2,000 going into the same mutual fund on the 5th of every month.',
  },
  nav: {
    term: 'NAV',
    short: 'Net Asset Value: the price of one unit of a mutual fund, calculated once each working day from the value of everything the fund owns.',
    example: 'If the NAV is ₹50, ₹2,000 buys 40 units.',
  },
  'expense-ratio': {
    term: 'Expense ratio',
    short: 'The yearly fee a fund charges to run itself, shown as a percentage of your investment. It’s deducted from the fund daily, so you never see a separate bill.',
    example: 'At 1%, roughly ₹100 a year on every ₹10,000 invested.',
  },
  inflation: {
    term: 'Inflation',
    short: 'Prices rising over time, so the same rupee buys a little less each year. A return below inflation means your money is quietly shrinking in real terms.',
    example: 'If prices rise 5% and your savings earn 3%, you can buy less than last year.',
  },
  equity: {
    term: 'Equity',
    short: 'Ownership. Buying a company’s shares (equity) makes you a part-owner, sharing in its growth — and its setbacks.',
  },
  debt: {
    term: 'Debt',
    short: 'Lending. Debt investments lend your money to a government, bank or company in return for interest. Usually steadier than equity, but not risk-free.',
  },
  liquidity: {
    term: 'Liquidity',
    short: 'How quickly and cheaply you can turn an investment back into cash without losing value in the process.',
    example: 'A savings account is very liquid; a house is not.',
  },
  diversification: {
    term: 'Diversification',
    short: 'Spreading money across different investments so one bad outcome doesn’t sink everything. It reduces risk; it doesn’t remove it.',
    example: 'Not keeping all your eggs in one basket.',
  },
  'exit-load': {
    term: 'Exit load',
    short: 'A charge some mutual funds take if you withdraw before a set period, to discourage short-term trading.',
    example: 'A 1% exit load on ₹10,000 withdrawn within a year costs ₹100.',
  },
  volatility: {
    term: 'Volatility',
    short: 'How much and how quickly an investment’s value moves up and down. High volatility means a bumpier ride, in both directions.',
  },
  compounding: {
    term: 'Compounding',
    short: 'Earning returns on your past returns, not just on what you put in. It works slowly at first and needs time — and it works on losses and fees too.',
    example: '₹100 growing 10% becomes ₹110, then ₹121 — the extra ₹1 is compounding.',
  },
  index: {
    term: 'Index',
    short: 'A list that tracks a group of investments, used as a scoreboard for a market. The Nifty 50, for example, follows 50 large Indian companies.',
  },
  demat: {
    term: 'Demat account',
    short: 'An account that holds shares, ETFs and bonds electronically, the way a bank account holds money. Usually opened alongside a trading account with a broker.',
  },
} satisfies Record<string, GlossaryEntry>;

export type GlossaryId = keyof typeof glossary;

/** Terms surfaced in the "words you'll meet" row; extra entries stay available inline. */
export const featuredTerms: GlossaryId[] = ['sip', 'nav', 'expense-ratio', 'inflation', 'equity', 'debt', 'liquidity', 'diversification', 'exit-load', 'volatility', 'compounding'];

export const isGlossaryId = (id: string): id is GlossaryId => id in glossary;
