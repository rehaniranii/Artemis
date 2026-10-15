import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '@/App';
import { useFinancialStore } from '@/store/useFinancialStore';
import { createDefaultState } from '@/data/defaults';
import { applyMarketShock, blendedReturn, calculateFutureValue } from '@/lib/calculations';
import { formatINR } from '@/lib/format';

const renderLanding = () => render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
beforeEach(() => { act(() => useFinancialStore.getState().resetDemo()); });

describe('Morrow landing story', () => {
  it('renders the hero and all seven scenes, readable without motion', async () => {
    renderLanding();
    expect(await screen.findByRole('heading', { level: 1, name: /Your money\.\s*Your tomorrow\./ })).toBeInTheDocument();
    expect(screen.getByText(/Investing doesn’t have to be complicated/)).toBeInTheDocument();
    for (const name of [/Too many options\.\s*One big goal\./, /One idea\s*at a time\./, /Not every fund\s*is for everyone\./, /₹10,00,000\s*starts somewhere\./, /But markets don’t\s*always go up\./, /Your future starts with understanding\./])
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    expect(screen.getByText('Let’s make it simple.')).toBeInTheDocument();
    for (const word of ['Understand.', 'Plan.', 'Grow.']) expect(screen.getByText(word)).toBeVisible();
    for (const card of ['Fixed Deposits', 'Index Funds', 'Mutual Funds']) expect(screen.getByRole('heading', { level: 3, name: card })).toBeInTheDocument();
    expect(screen.getByText('Understand before you invest.')).toBeInTheDocument();
    expect(screen.getByText(/Bad years happen\./)).toBeInTheDocument();
  });

  it('links every call to action to the right place', async () => {
    renderLanding();
    await screen.findByRole('heading', { level: 1 });
    const links: [RegExp, string][] = [[/Start Your Journey/, '/onboarding'], [/Explore Investments/, '/explore'], [/Find Your Match/, '/explore/match'], [/Build Your Plan/, '/plan'], [/Experience a Market Downturn/, '/reality-lab'], [/Let’s Begin/, '/onboarding']];
    for (const [name, href] of links) expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
    expect(screen.getByRole('button', { name: 'See How It Works' })).toBeInTheDocument();
  });

  it('uses the shared calculation engine for its illustrative numbers', async () => {
    renderLanding();
    await screen.findByRole('heading', { level: 1 });
    const d = createDefaultState();
    const yearFive = calculateFutureValue({ monthlyAmount: 2000, annualReturn: blendedReturn(d.allocation), months: 60 });
    const shock = applyMarketShock(yearFive, d.allocation);
    expect(screen.getByText(new RegExp(`${formatINR(yearFive)} → ${formatINR(shock.after)}`))).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /bad year takes it to/ })).toBeInTheDocument();
  });

  it('starts the journey from the hero', async () => {
    const user = userEvent.setup();
    renderLanding();
    await user.click(await screen.findByRole('link', { name: /Start Your Journey/ }));
    expect(await screen.findByRole('heading', { level: 1, name: /Let’s figure out your first million\./i })).toBeInTheDocument();
  });
});
