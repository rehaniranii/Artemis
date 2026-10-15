import { beforeEach, describe, it, expect, vi } from 'vitest';
import { act, render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '@/App';
import { useFinancialStore } from '@/store/useFinancialStore';
import { formatINR } from '@/lib/format';
import { projectPlan } from '@/lib/calculations';

const page = (route: string) => render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
const store = () => useFinancialStore.getState();
const nav = () => screen.getByRole('navigation', { name: 'Main navigation' });
beforeEach(() => act(() => store().resetDemo()));

describe('Morrow Match', () => {
  it('suggests three categories for Aarav, starting with emergency-friendly liquid funds', async () => {
    page('/explore/match');
    const region = await screen.findByRole('region', { name: 'Categories for you' });
    expect(within(region).getAllByRole('heading', { level: 2 }).map(h => h.textContent)).toEqual(['Liquid Funds', 'Nifty 50 Index Funds', 'Hybrid Funds']);
    expect(within(region).getAllByText('Why it appears')).toHaveLength(3);
    expect(within(region).getAllByText('Watch out for')).toHaveLength(3);
  });

  it('reflects risk answers: a short horizon steers toward debt and liquid funds', async () => {
    act(() => { useFinancialStore.setState(s => ({ journey: { ...s.journey, accessNeed: 'within-3-years', emergencyStatus: 'yes' } })); });
    page('/explore/match');
    const region = await screen.findByRole('region', { name: 'Categories for you' });
    expect(within(region).getAllByRole('heading', { level: 2 }).map(h => h.textContent)).toEqual(['Debt Funds', 'Liquid Funds']);
  });

  it('filters the catalogue, adds a fund to the plan and shows it in My Plan', async () => {
    const user = userEvent.setup();
    page('/explore/match?tab=funds');
    await user.click(await screen.findByRole('button', { name: 'Small Cap Funds' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /Add to My Plan/ }));
    expect(store().planFunds.some(f => f.fundId === 'saffron-smallcap')).toBe(true);
    await user.click(within(nav()).getByRole('link', { name: 'My Plan' }));
    expect(await screen.findByRole('link', { name: 'Saffron Small Cap Fund' })).toBeInTheDocument();
  });

  it('compares two funds without declaring a winner', async () => {
    page('/explore/match?tab=compare&a=kestrel-nifty50&b=tidewater-nifty50');
    const table = await screen.findByRole('table');
    for (const label of ['Category', 'Risk (SEBI riskometer)', 'Expense ratio', 'Minimum SIP', 'Exit load', 'Investment strategy', 'Liquidity', 'Important limitations']) expect(within(table).getByText(label)).toBeInTheDocument();
    expect(screen.getByText(/Both are nifty 50 index funds/)).toBeInTheDocument();
    expect(screen.getByText(/costs 0.17% more a year/)).toBeInTheDocument();
    expect(screen.getByText(/no automatic winner/)).toBeInTheDocument();
  });

  it('opens fund details with compare and plan actions', async () => {
    const user = userEvent.setup();
    page('/explore/funds/kestrel-liquid');
    await screen.findByRole('heading', { level: 1, name: 'Kestrel Liquid Fund' });
    for (const text of ['What the fund does', 'Why someone might explore it', 'What could go wrong', 'Fees', 'Risk level', 'Minimum investment', 'Liquidity']) expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Compare Fund' })).toHaveAttribute('href', '/explore/match?tab=compare&a=kestrel-liquid');
    await user.click(screen.getByRole('button', { name: /In My Plan/ }));
    expect(store().planFunds.some(f => f.fundId === 'kestrel-liquid')).toBe(false);
  });
});

describe('My Plan', () => {
  it('updates projections immediately when the plan changes', async () => {
    const user = userEvent.setup();
    page('/plan');
    // The figure animates visually; its screen-reader copy always holds the exact value.
    const projected = () => screen.getByTestId('projected-value').querySelector('.sr-only')!.textContent;
    await screen.findByTestId('projected-value');
    const before = projected();
    expect(before).toBe(formatINR(projectPlan({ goal: 1000000, monthly: 2000, years: 15, allocation: store().allocation }).value));
    await user.click(screen.getByRole('button', { name: /Growth/ }));
    expect(store().allocation.equity).toBe(70);
    expect(projected()).toBe(formatINR(projectPlan({ goal: 1000000, monthly: 2000, years: 15, allocation: store().allocation }).value));
    expect(projected()).not.toBe(before);
    expect(screen.getByText(/70% in equity: growth-oriented investments can experience larger declines/)).toBeInTheDocument();
    await user.click(screen.getByText('What are we assuming?'));
    expect(screen.getByText(/Illustrative yearly returns/)).toBeVisible();
  });

  it('keeps fund shares inside their asset class', async () => {
    const user = userEvent.setup();
    page('/plan');
    expect(await screen.findByText(/27% of total/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove Monsoon Balanced Advantage Fund from plan' }));
    expect(screen.getByText(/45% of total/)).toBeInTheDocument();
  });

  it('runs the SIP calculator, time machine, futures and inflation toggle', async () => {
    const user = userEvent.setup();
    page('/plan?tab=sip');
    expect(await screen.findByText('Total invested')).toBeInTheDocument();
    expect(screen.getByText(formatINR(360000))).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Time machine' }));
    const slider = await screen.findByRole('slider', { name: 'Year on the timeline' });
    fireEvent.change(slider, { target: { value: '0' } });
    expect(screen.getByText('Today')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Compare futures' }));
    await user.click(screen.getByRole('button', { name: 'Start now vs in 2 years' }));
    expect(screen.getByText('Starting two years later')).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: /Show future purchasing power/ }));
    expect(screen.getAllByText('In today’s money').length).toBe(2);
  });
});

describe('Reality Lab', () => {
  it('walks through a bad year, decisions and scenarios without changing the plan', async () => {
    const user = userEvent.setup();
    const planBefore = JSON.stringify({ a: store().allocation, p: store().profile, f: store().planFunds });
    page('/reality-lab');
    await user.click(await screen.findByRole('button', { name: /Experience a Bad Year/ }));
    expect(screen.getByText(/Your financial goal hasn’t changed, but your expected journey may/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /What could I do next/ }));
    const value = screen.getByTestId('scenario-value');
    const slow = value.textContent;
    await user.click(screen.getByRole('radio', { name: /Faster recovery/ }));
    const fast = value.textContent;
    expect(fast).not.toBe(slow);
    await user.click(screen.getByRole('radio', { name: /Pause contributions/ }));
    expect(value.textContent).not.toBe(fast);
    expect(screen.getByRole('table', { name: /All three responses/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Reset simulation/ }));
    expect(screen.getByRole('button', { name: /Experience a Bad Year/ })).toBeInTheDocument();
    expect(JSON.stringify({ a: store().allocation, p: store().profile, f: store().planFunds })).toBe(planBefore);
  });
});

describe('Home, Blueprint and demo mode', () => {
  it('shows the fictional demo portfolio with expandable holdings and quick actions', async () => {
    page('/home');
    await screen.findByRole('heading', { level: 1, name: /Aarav\./ });
    expect(screen.getByText('₹1,42,500')).toBeInTheDocument();
    expect(screen.getByText('₹1,20,000')).toBeInTheDocument();
    expect(screen.getByText('+₹22,500')).toBeInTheDocument();
    expect(screen.getByText('14.3% of the way there')).toBeInTheDocument();
    for (const label of ['Adjust My Plan', 'Explore a Scenario', 'View My Blueprint']) expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
  });

  it('builds the blueprint from the current plan, saves it and prints', async () => {
    const user = userEvent.setup();
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    act(() => { store().setMonthlyInvestment(3000); });
    page('/blueprint');
    await screen.findByRole('heading', { level: 1, name: 'Your Financial Blueprint' });
    expect(screen.getAllByText('₹3,000').length).toBeGreaterThan(0);
    expect(screen.getByText('Kestrel Nifty 50 Index Fund')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Save Blueprint/ }));
    expect(screen.getByText(/up to date/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Print \/ Export/ }));
    expect(print).toHaveBeenCalled();
  });

  it('loads the Aarav demo from the landing page and resets it from the footer', async () => {
    const user = userEvent.setup();
    act(() => { store().setGoal({ amount: 50000 }); store().setHoldings([]); });
    page('/');
    await user.click(await screen.findByRole('button', { name: 'Try Morrow with Aarav' }));
    expect(await screen.findByRole('heading', { level: 1, name: /Aarav\./ })).toBeInTheDocument();
    expect(store()).toMatchObject({ onboardingComplete: true, goal: { amount: 1000000 } });
    expect(screen.getByText('₹1,42,500')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset Demo' }));
    await user.click(screen.getByRole('button', { name: 'Yes, reset' }));
    expect(store().onboardingComplete).toBe(false);
  });
});
