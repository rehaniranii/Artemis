import { beforeEach, describe, it, expect } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '@/App';
import { useFinancialStore } from '@/store/useFinancialStore';
import { investments, detailQuestions } from '@/data/investments';
import { glossary } from '@/data/glossary';

const page = (route = '/explore') => render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
const heading = () => screen.findByRole('heading', { level: 1, name: 'Let’s make sense of your options.' });
beforeEach(() => act(() => useFinancialStore.getState().resetDemo()));

describe('Investment Explorer', () => {
  it('starts with four category cards plus methods, and no instruments', async () => {
    page();
    await heading();
    const section = screen.getByRole('region', { name: 'Investment categories' });
    expect(within(section).getAllByRole('button', { pressed: false })).toHaveLength(5);
    expect(within(section).getAllByRole('heading', { level: 3 }).map(h => h.textContent)).toEqual(['Saving & Stability', 'Fixed Income', 'Long-Term Growth', 'Diversification']);
    expect(screen.getByRole('button', { name: /Not a type of investment/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Fixed deposit (FD)' })).not.toBeInTheDocument();
  });

  it('reveals only the selected category’s instruments, and collapses on a second click', async () => {
    const user = userEvent.setup();
    page();
    await heading();
    await user.click(screen.getByRole('button', { name: /Long-Term Growth/ }));
    expect(await screen.findByRole('heading', { name: 'Index funds' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Equity mutual funds' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Savings account' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Long-Term Growth/ }));
    await act(() => new Promise(resolve => setTimeout(resolve, 50)));
    expect(screen.queryByRole('heading', { name: 'Index funds' })).not.toBeInTheDocument();
  });

  it('explains an investment with all eight questions and both sides of the catch', async () => {
    const user = userEvent.setup();
    page('/explore?category=stability');
    await user.click(await screen.findByRole('button', { name: /Understand FD/ }));
    const dialog = await screen.findByRole('dialog', { name: 'Fixed deposit (FD)' });
    for (const { question } of detailQuestions) expect(within(dialog).getByText(question)).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'What’s the catch?' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Why people consider it' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'What could go wrong?' })).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /MONO Match/ })).toHaveAttribute('href', '/mono-match');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('compares exactly two investments across categories', async () => {
    const user = userEvent.setup();
    page('/explore?category=stability');
    await user.click(await screen.findByRole('button', { name: 'Add FD to comparison' }));
    await user.click(screen.getByRole('button', { name: /Long-Term Growth/ }));
    await user.click(await screen.findByRole('button', { name: 'Add Index fund to comparison' }));
    expect(await screen.findByRole('button', { name: 'Add Equity fund to comparison' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add Equity fund to comparison' }));
    expect(screen.getByText(/Two at a time keeps it clear/)).toBeInTheDocument();
    await user.click(within(screen.getByRole('complementary', { name: 'Comparison tray' })).getByRole('button', { name: /Compare/ }));
    const dialog = await screen.findByRole('dialog', { name: 'FD vs Index fund' });
    for (const label of ['How returns work', 'Risk', 'Liquidity', 'Time horizon', 'Fees', 'Important limitations']) expect(within(dialog).getByText(label)).toBeInTheDocument();
    expect(within(dialog).queryByText(/\b\d+\s*\/\s*10\b/)).not.toBeInTheDocument();
  });

  it('keeps SIP comparable only with another method', async () => {
    const user = userEvent.setup();
    page('/explore?category=growth&compare=index-fund');
    await user.click(await screen.findByRole('button', { name: /Not a type of investment/ }));
    await user.click(await screen.findByRole('button', { name: 'Add SIP to comparison' }));
    expect(screen.getByText(/ways of investing, not investments/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add SIP to comparison' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('opens popular comparisons directly', async () => {
    const user = userEvent.setup();
    page();
    await user.click(await screen.findByRole('button', { name: /Bonds vs Debt fund/ }));
    expect(await screen.findByRole('dialog', { name: 'Bonds vs Debt fund' })).toBeInTheDocument();
  });

  it('opens plain-language definitions from the glossary and from inline terms', async () => {
    const user = userEvent.setup();
    page('/explore?item=index-fund');
    const dialog = await screen.findByRole('dialog', { name: 'Index funds' });
    await user.click(within(dialog).getAllByRole('button', { name: 'What is Expense ratio?' })[0]);
    expect(await screen.findByText(glossary['expense-ratio'].short)).toBeInTheDocument();
  });

  it('has complete, two-sided content for every investment', () => {
    expect(investments).toHaveLength(10);
    for (const item of investments) {
      for (const { key } of detailQuestions) expect(item.detail[key].length, `${item.id}.${key}`).toBeGreaterThan(3);
      expect(item.why.length).toBeGreaterThan(0);
      expect(item.catches.length).toBeGreaterThan(0);
      for (const text of Object.values(item.detail)) for (const [, id] of text.matchAll(/\[\[([a-z-]+)/g)) expect(glossary, `${item.id} uses ${id}`).toHaveProperty(id);
    }
  });
});
