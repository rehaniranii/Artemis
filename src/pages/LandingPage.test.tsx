import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '@/App';
import { useFinancialStore } from '@/store/useFinancialStore';

function renderLanding() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
}

beforeEach(() => {
  act(() => useFinancialStore.getState().resetDemo());
});

describe('MONO Landing Page', () => {
  it('renders all 6 required sections with primary headings and copy', async () => {
    renderLanding();

    // 1. Hero
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Your first million starts with understanding\./i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/No confusing financial jargon\./i)).toBeInTheDocument();
    expect(screen.getByText(/No overwhelming choices\./i)).toBeInTheDocument();
    expect(screen.getByText(/Just a clearer way to build your financial future\./i)).toBeInTheDocument();

    // 2. The Problem
    expect(
      screen.getByRole('heading', {
        name: /Investing shouldn’t require a finance degree\./i,
      })
    ).toBeInTheDocument();

    // 3. How MONO Works (Understand, Plan, Prepare)
    expect(
      screen.getByRole('heading', {
        name: /Three steps to make money make sense\./i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Understand.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Plan.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Prepare.' })).toBeInTheDocument();

    // 4. Interactive Preview
    expect(
      screen.getByRole('heading', {
        name: /Simulate before you commit\./i,
      })
    ).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Monthly contribution amount/i).length).toBeGreaterThan(0);

    // 5. Reality Check Preview
    expect(
      screen.getByRole('heading', {
        name: /A good plan makes room for bad years\./i,
      })
    ).toBeInTheDocument();

    // 6. Final CTA
    expect(
      screen.getByRole('heading', {
        name: /Ready to make money make sense\?/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Build My Plan/i })
    ).toBeInTheDocument();
  });

  it('navigates to onboarding when primary CTA "Find My Path" is clicked', async () => {
    const user = userEvent.setup();
    renderLanding();

    const primaryCta = await screen.findByRole('link', { name: /Find My Path/i });
    expect(primaryCta).toHaveAttribute('href', '/onboarding');

    await user.click(primaryCta);
    expect(
      await screen.findByRole('heading', { level: 1, name: /Let’s figure out your first million\./i })
    ).toBeInTheDocument();
  });

  it('navigates to onboarding when final CTA "Build My Plan" is clicked', async () => {
    const user = userEvent.setup();
    renderLanding();

    const buildPlanBtn = await screen.findByRole('link', { name: /Build My Plan/i });
    expect(buildPlanBtn).toHaveAttribute('href', '/onboarding');

    await user.click(buildPlanBtn);
    expect(
      await screen.findByRole('heading', { level: 1, name: /Let’s figure out your first million\./i })
    ).toBeInTheDocument();
  });

  it('allows adjusting monthly contribution and goal presets in the interactive preview', async () => {
    const user = userEvent.setup();
    renderLanding();

    // Scope to the interactive preview section
    const previewSection = screen.getByText(/INTERACTIVE SIMULATOR/i).closest('section')!;
    expect(previewSection).toBeInTheDocument();

    // Switch goal preset to 50 Lakhs
    const goalBtn = within(previewSection).getByRole('button', { name: /50 Lakhs/i });
    await user.click(goalBtn);
    expect(goalBtn).toHaveAttribute('aria-pressed', 'true');

    // Switch monthly shortcut to 20,000 within the preview section
    const amtShortcut = within(previewSection).getByRole('button', { name: '₹20,000' });
    await user.click(amtShortcut);

    // Verify slider output updated
    const output = previewSection.querySelector('output');
    expect(output).toHaveTextContent(/20,000/);
  });

  it('allows switching scenarios in the Reality Check section', async () => {
    const user = userEvent.setup();
    renderLanding();

    const plateauBtn = screen.getByRole('button', { name: /3-Yr Plateau/i });
    await user.click(plateauBtn);
    expect(plateauBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/The 3-Year Plateau/i)).toBeInTheDocument();

    const bullBtn = screen.getByRole('button', { name: /\+15% Expansion/i });
    await user.click(bullBtn);
    expect(bullBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/The Bull Expansion/i)).toBeInTheDocument();
  });

  it('supports adjusting pacing in the hero geometric accumulation visual', async () => {
    const user = userEvent.setup();
    renderLanding();

    const acceleratedBtn = screen.getByRole('button', { name: /Accelerated/i });
    await user.click(acceleratedBtn);
    expect(acceleratedBtn).toHaveAttribute('aria-pressed', 'true');

    const timelineInput = screen.getByLabelText(/Accumulation timeline in years/i);
    expect(timelineInput).toBeInTheDocument();
  });
});
