/**
 * Educational descriptions of investment types available in India.
 * Text may contain [[glossary-id|shown text]] tokens rendered as clickable definitions.
 * Deliberately no return figures or numeric risk scores: qualitative descriptions only.
 */
export type CategoryId = 'stability' | 'fixed-income' | 'growth' | 'diversification' | 'methods';

export interface InvestmentCategory { id: CategoryId; name: string; purpose: string; description: string }

export interface Investment {
  id: string;
  category: CategoryId;
  /** Methods (SIP, lump sum) describe how money goes in, so they are only compared with each other. */
  kind: 'asset' | 'method';
  name: string;
  shortName: string;
  tagline: string;
  analogy: string;
  detail: {
    what: string; how: string; returnSource: string; decline: string;
    access: string; lockIn: string; fees: string; goal: string;
  };
  why: string[];
  catches: string[];
  compare: { returns: string; risk: string; liquidity: string; horizon: string; fees: string; limitations: string };
}

export const categories: InvestmentCategory[] = [
  { id: 'stability', name: 'Saving & Stability', purpose: 'Keep money safe and close at hand.', description: 'Places where your rupees don’t swing in value. The trade-off: growth is modest, and inflation can quietly outpace it.' },
  { id: 'fixed-income', name: 'Fixed Income', purpose: 'Lend money, earn interest.', description: 'You lend to a government, bank or company and are paid interest. Steadier than shares — but “fixed” doesn’t mean “can’t lose”.' },
  { id: 'growth', name: 'Long-Term Growth', purpose: 'Own a share of businesses.', description: 'Owning parts of companies, through a fund. The most room to grow over many years, and the bumpiest ride along the way.' },
  { id: 'diversification', name: 'Diversification', purpose: 'Balance out the rest.', description: 'Gold often moves differently from shares and deposits, which is why people hold a little of it alongside them.' },
  { id: 'methods', name: 'Investment Methods', purpose: 'How money goes in, not where.', description: 'SIP and lump sum aren’t investments. They’re two ways of putting money into one — the investment underneath decides the risk.' },
];

export const investments: Investment[] = [
  {
    id: 'savings-account', category: 'stability', kind: 'asset', name: 'Savings account', shortName: 'Savings account',
    tagline: 'Everyday money that earns a little interest.',
    analogy: 'A wallet that pays you a small thank-you for keeping money in it.',
    detail: {
      what: 'A bank account for money you want to keep safe and reach any time. The bank pays you interest on the balance.',
      how: 'You deposit money; the bank lends some of it out to others and shares a small part of what it earns with you as interest, usually credited every quarter.',
      returnSource: 'Interest paid by the bank. The rate is set by the bank and can change at any time.',
      decline: 'The rupee balance doesn’t fall. But if interest is lower than [[inflation]], what your money can buy slowly shrinks. Deposits are insured by DICGC up to ₹5 lakh per depositor per bank if a bank fails.',
      access: 'Very easy — withdraw or transfer any time via UPI, ATM or net banking. The most [[liquidity|liquid]] option here.',
      lockIn: 'None — your money is never locked.',
      fees: 'Possible charges for not keeping a minimum balance, extra ATM withdrawals, or cards. Interest earned is taxable above a small exemption.',
      goal: 'Day-to-day spending and your emergency fund.',
    },
    why: ['Your money is available instantly.', 'The balance doesn’t swing up and down.', 'Deposit insurance adds a layer of protection.'],
    catches: ['Interest is usually low and may not keep up with inflation.', 'Easy access makes it easy to spend.', 'Minimum-balance penalties can eat into small balances.'],
    compare: {
      returns: 'Interest set by the bank; can change any time. Usually the lowest of these options.',
      risk: 'Very low in rupee terms; insured up to ₹5 lakh per bank. Main risk is losing ground to inflation.',
      liquidity: 'Instant.',
      horizon: 'Any — ideal for money you may need tomorrow.',
      fees: 'Minimum-balance and service charges at some banks.',
      limitations: 'Not designed for growth; long-term money parked here tends to lose purchasing power.',
    },
  },
  {
    id: 'fixed-deposit', category: 'stability', kind: 'asset', name: 'Fixed deposit (FD)', shortName: 'FD',
    tagline: 'Lock money away for a set time at a set rate.',
    analogy: 'Renting your money to a bank for an agreed period at an agreed rent.',
    detail: {
      what: 'A deposit with a bank (or a company) for a fixed period — from a few days to ten years — at an interest rate agreed on day one.',
      how: 'You choose an amount and a term. The rate is locked in for that term, and interest is either paid out regularly or added at the end so it [[compounding|compounds]].',
      returnSource: 'Interest paid by the bank for using your money for the agreed period.',
      decline: 'Bank FDs don’t fall in rupee value and are covered by DICGC insurance up to ₹5 lakh per depositor per bank (savings and FDs combined). Company FDs are not insured and carry the risk that the company can’t repay. Inflation can still erode real value.',
      access: 'You can usually break a bank FD early, but you’ll earn a lower rate and may pay a penalty. Money arrives quickly once you do.',
      lockIn: 'Tax-saving FDs have a 5-year lock-in with no early withdrawal. Regular FDs have no lock-in, but early withdrawal costs you.',
      fees: 'No ongoing fees. The cost is the premature-withdrawal penalty. Interest is taxed at your income-tax slab rate, and banks may deduct tax at source.',
      goal: 'Known expenses on a known date — fees due in two years, a planned purchase — or part of an emergency fund.',
    },
    why: ['You know exactly what you’ll get, and when.', 'Usually pays more than a savings account.', 'Bank FDs are insured up to the DICGC limit.'],
    catches: ['After tax and inflation, the real return can be small or even negative.', 'Breaking it early means a lower rate.', 'If rates rise after you lock in, you’re stuck with the old rate until maturity.'],
    compare: {
      returns: 'Fixed interest rate, agreed when you open it.',
      risk: 'Very low for bank FDs (insured to ₹5 lakh per bank). Company FDs carry default risk. Inflation risk applies.',
      liquidity: 'Good — can be broken early, with a reduced rate or penalty.',
      horizon: 'Short to medium term: weeks to a few years.',
      fees: 'No running fees; penalty for early withdrawal.',
      limitations: 'Interest is fully taxable at your slab rate; growth may trail inflation over long periods.',
    },
  },
  {
    id: 'bonds', category: 'fixed-income', kind: 'asset', name: 'Bonds', shortName: 'Bonds',
    tagline: 'Lend directly to a government or company.',
    analogy: 'A formal IOU: you lend money, receive regular interest, and get the loan back on a set date.',
    detail: {
      what: 'A loan you give to a government or company. In return they pay interest (the “coupon”) and promise to repay the original amount on a maturity date.',
      how: 'You buy a bond — when it’s issued, or later from another investor — and receive interest on a schedule. Government securities can be bought through RBI Retail Direct; corporate bonds usually need a broker and a [[demat]].',
      returnSource: 'Interest payments, plus any gain or loss if you sell the bond before maturity for a different price than you paid.',
      decline: 'Yes. When interest rates rise, existing bonds become less attractive and their price falls. Corporate bonds also carry credit risk — the company may fail to pay. Held to maturity, a bond from an issuer that doesn’t default returns its face value.',
      access: 'Varies. Many bonds trade rarely, so selling before maturity can be slow or mean accepting a lower price. Low [[liquidity]] is common.',
      lockIn: 'No formal lock-in for most bonds, but your money is effectively committed until maturity unless you find a buyer.',
      fees: 'Brokerage on purchase or sale and demat account charges. Interest is taxable.',
      goal: 'Predictable income, or a known future expense matched to the bond’s maturity date.',
    },
    why: ['Regular, predictable interest payments.', 'Government bonds are backed by the state.', 'Can be matched to a specific future date.'],
    catches: ['Prices fall when interest rates rise.', 'A company can default and not repay in full.', 'Can be hard to sell quickly at a fair price.', 'Higher-interest bonds usually mean higher risk — be wary of yields that look too good.'],
    compare: {
      returns: 'Fixed interest (coupon) plus any price change if sold before maturity.',
      risk: 'Interest-rate risk and, for companies, credit/default risk. Government bonds carry very little credit risk.',
      liquidity: 'Often limited — few buyers for many bonds.',
      horizon: 'Matches the bond’s maturity: from one to many years.',
      fees: 'Brokerage and demat charges; no ongoing fund fee.',
      limitations: 'Each bond is a single borrower, so diversifying takes many bonds and more money.',
    },
  },
  {
    id: 'debt-mutual-fund', category: 'fixed-income', kind: 'asset', name: 'Debt mutual funds', shortName: 'Debt fund',
    tagline: 'A professionally managed basket of loans.',
    analogy: 'Joining a group that lends to many borrowers at once, instead of lending to one yourself.',
    detail: {
      what: 'A mutual fund that pools money from many people to buy bonds, treasury bills and other [[debt]] instruments.',
      how: 'You buy units at the day’s [[nav|NAV]]. The fund manager decides which loans to hold. Types range from very short-term (liquid funds) to long-duration and credit-risk funds.',
      returnSource: 'Interest earned on everything the fund holds, plus changes in those holdings’ prices — reflected in a NAV that moves daily.',
      decline: 'Yes. NAVs fall when interest rates rise (more so for long-duration funds) or when a borrower defaults. Returns are not guaranteed, unlike an FD.',
      access: 'Usually redeemable any working day; money typically arrives within one to three working days (liquid funds often by the next day).',
      lockIn: 'Generally none. Some funds charge an [[exit-load|exit load]] if you withdraw within a short period.',
      fees: 'An annual [[expense-ratio|expense ratio]], lower for “direct” plans than “regular” plans. Gains are currently taxed at your income-tax slab rate (rules can change).',
      goal: 'Parking money for months to a few years, or a steadier part of a longer-term mix.',
    },
    why: ['Spreads your money across many borrowers.', 'Easier to withdraw than most individual bonds.', 'Start with small amounts, even via SIP.'],
    catches: ['Not guaranteed — the NAV can fall.', 'Higher-yielding funds may hold riskier borrowers.', 'Fees apply every year, whether returns are good or not.', 'Different fund types behave very differently; the name matters.'],
    compare: {
      returns: 'Interest from the fund’s holdings plus price changes, shown in a daily NAV.',
      risk: 'Interest-rate and credit risk, spread across many holdings. Varies a lot by fund type.',
      liquidity: 'Good — typically paid within 1–3 working days.',
      horizon: 'Months to a few years, depending on the fund type.',
      fees: 'Annual expense ratio; possible exit load.',
      limitations: 'No guaranteed return; you depend on the manager’s choices.',
    },
  },
  {
    id: 'equity-mutual-fund', category: 'growth', kind: 'asset', name: 'Equity mutual funds', shortName: 'Equity fund',
    tagline: 'A fund manager picks companies for you.',
    analogy: 'Hiring a coach to pick a team of players, hoping they outperform the league.',
    detail: {
      what: 'A mutual fund that invests mainly in company shares ([[equity]]). A professional manager chooses which companies to own.',
      how: 'Your money buys units at the [[nav|NAV]]. The manager buys and sells shares, aiming to do better than a benchmark [[index]]. Funds differ by focus — large companies, smaller ones, sectors, and more.',
      returnSource: 'Growth in the value of the companies owned, plus any dividends they pay — which depends on how those businesses perform over time.',
      decline: 'Yes, sharply. Share markets can fall a third or more in bad periods and can take years to recover. Most equity funds are labelled “Very High” on SEBI’s riskometer.',
      access: 'Redeem any working day; money usually arrives within a few working days.',
      lockIn: 'Usually none, but many funds charge an [[exit-load|exit load]] (often about 1%) if you withdraw within a year. Tax-saving ELSS funds have a 3-year lock-in.',
      fees: 'An annual [[expense-ratio|expense ratio]], typically higher than index funds. Direct plans cost less than regular plans. Gains are subject to capital-gains tax.',
      goal: 'Long-term goals at least five to seven years away, where you can wait out downturns.',
    },
    why: ['Historically, shares have grown faster than deposits over long periods (past results don’t guarantee future ones).', 'A professional handles the stock picking.', 'Spreads money across many companies.'],
    catches: ['Value can fall a lot, and stay down for years.', 'Many actively managed funds fail to beat their index after fees.', 'Higher fees compound against you over time.', 'Tempting to sell in a panic at exactly the wrong moment.'],
    compare: {
      returns: 'Growth and dividends from companies held; not fixed, not guaranteed.',
      risk: 'High volatility. Large, long-lasting declines are possible.',
      liquidity: 'Good — paid within a few working days; exit load may apply in year one.',
      horizon: 'Long term: at least five to seven years.',
      fees: 'Expense ratio (usually higher than index funds); possible exit load.',
      limitations: 'Results depend on the manager’s choices; many don’t beat the index after costs.',
    },
  },
  {
    id: 'index-fund', category: 'growth', kind: 'asset', name: 'Index funds', shortName: 'Index fund',
    tagline: 'Own the whole market, not just the picks.',
    analogy: 'Instead of betting on a few players, you buy a ticket to the whole league.',
    detail: {
      what: 'A fund that simply copies a market [[index]], such as the Nifty 50, owning the same companies in the same proportions.',
      how: 'No one picks stocks. The fund follows the index automatically, so its returns closely match the market’s, minus fees and a small “tracking error”.',
      returnSource: 'The overall performance of the companies in the index — their growth and dividends.',
      decline: 'Yes. When the market falls, an index fund falls with it, with no manager trying to avoid it. Large, long declines are possible.',
      access: 'Redeem any working day; money usually arrives within a few working days.',
      lockIn: 'None. Some funds charge a small [[exit-load|exit load]] for very early withdrawals; many charge none.',
      fees: 'Usually a low [[expense-ratio|expense ratio]] — one of the cheapest ways to own shares. Gains are subject to capital-gains tax.',
      goal: 'Long-term goals five-plus years away, especially for beginners who want simple, low-cost, broad [[diversification]].',
    },
    why: ['Low cost — more of the return stays with you.', 'Simple and transparent: you know what you own.', 'Instantly spread across many companies.'],
    catches: ['You get the market’s falls in full, with no cushion.', 'It will never beat its index — by design.', 'A narrow index (one sector, one theme) is far less diversified than a broad one.'],
    compare: {
      returns: 'Matches the index’s growth and dividends, minus small costs.',
      risk: 'High volatility — moves with the whole market.',
      liquidity: 'Good — paid within a few working days.',
      horizon: 'Long term: five years or more.',
      fees: 'Low expense ratio; exit load rare or small.',
      limitations: 'No downside protection; won’t outperform the market it tracks.',
    },
  },
  {
    id: 'gold', category: 'diversification', kind: 'asset', name: 'Physical gold', shortName: 'Gold',
    tagline: 'Coins, bars or jewellery you can hold.',
    analogy: 'An old family friend: dependable in a crisis, but it doesn’t pay rent.',
    detail: {
      what: 'Gold you own physically — jewellery, coins or bars — bought from a jeweller, bank or dealer.',
      how: 'You buy at today’s price plus extra charges, store it, and sell later at the price then.',
      returnSource: 'Only changes in the gold price. Gold pays no interest or dividends.',
      decline: 'Yes. Gold prices can fall, or go sideways for years. It often holds up when shares fall, which is why it’s used for [[diversification]].',
      access: 'You can sell to jewellers or dealers, but often at a deduction, and jewellery is valued on gold content only.',
      lockIn: 'None.',
      fees: 'Making charges on jewellery (often substantial), GST on purchase, and the cost of safe storage or a bank locker. Purity checks matter.',
      goal: 'A small portion of a long-term mix, or cultural and family needs.',
    },
    why: ['Tangible — you can hold it.', 'Has tended to hold value when other investments struggle.', 'Deep cultural and family significance.'],
    catches: ['Earns nothing while you hold it.', 'Making charges and resale deductions cut returns, especially on jewellery.', 'Storage and theft risk.', 'Prices can stay flat or fall for long stretches.'],
    compare: {
      returns: 'Price changes only; no income.',
      risk: 'Price can swing; often moves differently from shares. Theft and purity risk for physical gold.',
      liquidity: 'Moderate — easy to sell, but often below market price.',
      horizon: 'Long term, as a small diversifier.',
      fees: 'Making charges, GST, storage; resale deductions.',
      limitations: 'Costs of buying and selling can wipe out years of price gains on jewellery.',
    },
  },
  {
    id: 'gold-etf', category: 'diversification', kind: 'asset', name: 'Gold ETFs', shortName: 'Gold ETF',
    tagline: 'Gold’s price, without the locker.',
    analogy: 'A receipt for gold kept safely in a vault on your behalf.',
    detail: {
      what: 'An exchange-traded fund that holds physical gold and tracks its price. Each unit represents a small amount of gold.',
      how: 'You buy and sell units on the stock exchange through a broker, during market hours, using a [[demat]]. Gold mutual funds offer similar exposure without a demat account.',
      returnSource: 'Changes in the gold price, minus the fund’s costs.',
      decline: 'Yes — it falls whenever the gold price falls.',
      access: 'Sell any time the market is open; how easily depends on how actively the ETF trades. Money arrives after settlement, usually within a couple of working days.',
      lockIn: 'None.',
      fees: 'A small [[expense-ratio|expense ratio]], brokerage on each trade, and demat charges. Gains are subject to capital-gains tax.',
      goal: 'Adding a slice of gold to a long-term mix without the hassle of storing it.',
    },
    why: ['No making charges, purity worries or storage.', 'Buy in small amounts at close to market price.', 'Easy to sell on the exchange.'],
    catches: ['Still earns no income — you rely entirely on price.', 'Needs a demat and trading account.', 'Thinly traded ETFs can be harder to sell at a fair price.', 'Small tracking differences from the actual gold price.'],
    compare: {
      returns: 'Tracks the gold price, minus fees.',
      risk: 'Gold price swings; no storage or purity risk.',
      liquidity: 'Good on active ETFs — tradable during market hours.',
      horizon: 'Long term, as a small diversifier.',
      fees: 'Low expense ratio, brokerage, demat charges.',
      limitations: 'Requires a demat account; no income.',
    },
  },
  {
    id: 'sip', category: 'methods', kind: 'method', name: 'SIP (Systematic Investment Plan)', shortName: 'SIP',
    tagline: 'A little, regularly — into an investment you choose.',
    analogy: 'A gym membership for your money: the habit matters more than any one visit.',
    detail: {
      what: 'A way of investing a fixed amount at regular intervals — usually monthly — into a mutual fund. A [[sip|SIP]] is a method, not an investment: its risk comes entirely from the fund you choose.',
      how: 'Money is auto-debited on a set date and buys fund units at that day’s [[nav|NAV]]. When prices are lower, the same amount buys more units; when higher, fewer. Over time this averages your purchase price.',
      returnSource: 'Whatever the underlying fund earns. An SIP into an equity fund behaves like an equity fund; into a debt fund, like a debt fund.',
      decline: 'Yes, if the underlying fund falls. Investing regularly smooths your entry price; it does not prevent losses.',
      access: 'Same as the underlying fund. You can usually pause, change or stop an SIP at any time without penalty.',
      lockIn: 'Only if the fund has one. In an ELSS fund, each monthly instalment is locked for 3 years from its own date. Exit loads also apply per instalment.',
      fees: 'No separate charge for the SIP itself — you pay the underlying fund’s [[expense-ratio|expense ratio]] and any exit load.',
      goal: 'Building wealth from a monthly income, steadily and automatically.',
    },
    why: ['Start small — often from a few hundred rupees.', 'Automates the habit, so you don’t have to decide every month.', 'Removes the pressure of picking the “right” day.'],
    catches: ['It’s only as good (or as risky) as the fund underneath.', 'Doesn’t guarantee a profit or protect against falls.', 'Easy to stop during a downturn — often the worst time to stop.'],
    compare: {
      returns: 'Whatever the chosen fund earns; averages your purchase price over time.',
      risk: 'Same as the underlying fund; spreads out timing risk.',
      liquidity: 'Same as the underlying fund; SIPs can be paused or stopped.',
      horizon: 'Ongoing — suits goals funded from regular income.',
      fees: 'None for the method; the fund’s costs apply.',
      limitations: 'In a steadily rising market, investing gradually can mean buying at higher average prices than investing all at once.',
    },
  },
  {
    id: 'lump-sum', category: 'methods', kind: 'method', name: 'Lump-sum investing', shortName: 'Lump sum',
    tagline: 'Invest a larger amount all at once.',
    analogy: 'Diving in rather than wading in.',
    detail: {
      what: 'Putting a larger amount — a bonus, a gift, savings you’ve built — into an investment in one go. Like an SIP, it’s a method, not an investment.',
      how: 'The whole amount buys units or holdings at one price, on one day, and is invested from then on.',
      returnSource: 'Whatever the underlying investment earns, applied to the whole amount from day one.',
      decline: 'Yes, if the underlying investment falls. If a fall comes soon after you invest, the whole amount feels it.',
      access: 'Same as the underlying investment.',
      lockIn: 'Only if the investment has one.',
      fees: 'No charge for the method itself; the investment’s own costs apply.',
      goal: 'Investing money you already have, for a goal far enough away to ride out a bad start.',
    },
    why: ['All your money starts working immediately.', 'Over long periods, rising markets tend to reward being invested sooner.', 'Simple — one decision, done.'],
    catches: ['Bad timing hurts: a fall right after you invest affects everything.', 'Can be emotionally hard to watch a large amount drop.', 'Needs a large sum in hand, which many beginners don’t have.'],
    compare: {
      returns: 'Whatever the investment earns, on the full amount from day one.',
      risk: 'Same as the underlying investment, plus all-at-once timing risk.',
      liquidity: 'Same as the underlying investment.',
      horizon: 'Best when the goal is far enough away to recover from a poor start.',
      fees: 'None for the method; the investment’s costs apply.',
      limitations: 'Concentrates timing risk on a single day. Some spread a lump sum in instalments to soften this.',
    },
  },
];

export const detailQuestions: { key: keyof Investment['detail']; question: string }[] = [
  { key: 'what', question: 'What is it?' },
  { key: 'how', question: 'How does it work?' },
  { key: 'returnSource', question: 'Where does the return come from?' },
  { key: 'decline', question: 'Can its value decline?' },
  { key: 'access', question: 'How easily can I get my money?' },
  { key: 'lockIn', question: 'Lock-ins or exit charges?' },
  { key: 'fees', question: 'What fees might apply?' },
  { key: 'goal', question: 'What goal might it help with?' },
];

export const compareCriteria: { key: keyof Investment['compare']; label: string }[] = [
  { key: 'returns', label: 'How returns work' },
  { key: 'risk', label: 'Risk' },
  { key: 'liquidity', label: 'Liquidity' },
  { key: 'horizon', label: 'Time horizon' },
  { key: 'fees', label: 'Fees' },
  { key: 'limitations', label: 'Important limitations' },
];

export const suggestedComparisons: [string, string][] = [
  ['fixed-deposit', 'index-fund'],
  ['gold', 'equity-mutual-fund'],
  ['bonds', 'debt-mutual-fund'],
];

export const findInvestment = (id: string | null | undefined) => investments.find(item => item.id === id);
export const investmentsIn = (category: CategoryId) => investments.filter(item => item.category === category);
