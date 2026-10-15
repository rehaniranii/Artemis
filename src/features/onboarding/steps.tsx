import { useState, type ReactNode } from 'react';
import { ArrowDownRight, Pencil } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { formatINR } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { OnboardingAnswers } from '@/types/financial';
import { CurrencyInput, Chip, ChoiceList, Callout } from './fields';
import { GoalVisual } from './GoalVisual';
import {
  GOAL_CHIPS, HIGH_CONTRIBUTION_SHARE, HORIZON_CHIPS, LIMITS, accessOptions, amountInWords, deriveRiskProfile,
  emergencyOptions, horizonLabel, labelFor, riskComfortOptions, riskProfileCopy,
} from './journey';

export interface StepProps {
  answers: OnboardingAnswers;
  update: (patch: Partial<OnboardingAnswers>) => void;
  headingId: string;
  errorId: string;
  invalid: boolean;
  onEdit: (step: number) => void;
}

export interface QuestionStep { eyebrow: string; title: ReactNode; plainTitle: string; Body: (props: StepProps) => ReactNode }

function GoalStep({ answers, update, errorId, invalid }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <CurrencyInput label="Goal amount" value={answers.goalAmount} onChange={goalAmount => update({ goalAmount })} invalid={invalid} describedBy={errorId} autoFocus />
        <p className="mt-3 text-xs text-muted-foreground">{answers.goalAmount > 0 ? `That’s ₹${amountInWords(answers.goalAmount)}.` : 'Type any amount, or pick one below.'}</p>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Quick goal amounts" role="group">
        {GOAL_CHIPS.map(amount => (
          <Chip key={amount} selected={answers.goalAmount === amount} onClick={() => update({ goalAmount: amount })}>₹{amountInWords(amount)}</Chip>
        ))}
      </div>
      {answers.goalAmount >= LIMITS.goal.min && <GoalVisual amount={answers.goalAmount} />}
    </div>
  );
}

function IncomeStep({ answers, update, errorId, invalid }: StepProps) {
  return (
    <div className="space-y-6">
      <CurrencyInput label="Monthly income" suffix="/ month" value={answers.monthlyIncome} onChange={monthlyIncome => update({ monthlyIncome })} invalid={invalid} describedBy={errorId} autoFocus />
      <p className="text-sm text-muted-foreground">Salary, stipend, pocket money, freelance work — whatever reliably arrives. A rough number is perfectly fine.</p>
    </div>
  );
}

function SavingsStep({ answers, update, errorId, invalid }: StepProps) {
  const { monthlyIncome: income, monthlyContribution: amount } = answers;
  const remaining = Math.max(0, income - amount);
  const share = income > 0 ? amount / income : 0;
  const step = income > 200000 ? 1000 : 100;
  return (
    <div className="space-y-8">
      <div className="grid items-end gap-8 sm:grid-cols-[1fr_auto]">
        <CurrencyInput label="Monthly amount to set aside" suffix="/ month" size="md" value={amount} onChange={monthlyContribution => update({ monthlyContribution })} invalid={invalid} describedBy={errorId} autoFocus />
        <p className="text-xs text-muted-foreground sm:pb-3"><span className="text-foreground tabular-nums">{Math.round(share * 100)}%</span> of what you receive</p>
      </div>
      <div className="space-y-3">
        <Slider aria-label="Monthly amount to set aside" value={[Math.min(amount, income)]} min={0} max={income} step={step} onValueChange={([next]) => update({ monthlyContribution: next })} />
        <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums"><span>₹0</span><span>{formatINR(income)}</span></div>
      </div>
      {amount > 0 && amount <= income && (
        <div className="rounded-2xl ink-outline bg-white p-5 sm:p-6">
          <p className="font-serif text-2xl leading-snug sm:text-3xl">
            If you save <AnimatedNumber value={amount} />, you’ll have <AnimatedNumber value={remaining} className="text-plum" /> remaining.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">That remaining money still has work to do — rent, food, travel, family and the unexpected. It isn’t “spare”.</p>
        </div>
      )}
      {amount > income && <Callout tone="warning">That’s more than the {formatINR(income)} you receive each month. Try a smaller amount.</Callout>}
      {amount <= income && share > HIGH_CONTRIBUTION_SHARE && (
        <Callout tone="warning">
          <strong className="font-medium">That’s more than half of what you receive.</strong> It might be doable — but plans with breathing room tend to last longer. You can always start smaller and increase later.
        </Callout>
      )}
    </div>
  );
}

function TimelineStep({ answers, update, errorId, invalid }: StepProps) {
  const [custom, setCustom] = useState(!answers.horizonFlexible && !HORIZON_CHIPS.includes(answers.horizonYears));
  const contributed = answers.monthlyContribution * 12 * answers.horizonYears;
  const tile = (selected: boolean) => cn('rounded-2xl border-2 border-ink p-5 text-left transition-all sm:p-6', selected ? 'border-ink bg-sun shadow-[4px_4px_0_#10110F] -translate-x-0.5 -translate-y-0.5' : 'bg-white hover:bg-cream hover:bg-white');
  return (
    <div className="space-y-6">
      <div role="group" aria-label="Timeline options" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {HORIZON_CHIPS.map(years => {
          const selected = !custom && !answers.horizonFlexible && answers.horizonYears === years;
          return (
            <button key={years} type="button" aria-pressed={selected} className={tile(selected)} onClick={() => { setCustom(false); update({ horizonYears: years, horizonFlexible: false }); }}>
              <span className="block font-serif text-4xl">{years}</span><span className="text-xs text-muted-foreground">years</span>
            </button>
          );
        })}
        <button type="button" aria-pressed={answers.horizonFlexible} className={tile(answers.horizonFlexible)} onClick={() => { setCustom(false); update({ horizonFlexible: true }); }}>
          <span className="block font-serif text-2xl leading-[2.5rem]">I’m flexible</span><span className="text-xs text-muted-foreground">no fixed date</span>
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {custom ? (
          <label className="flex items-center gap-3">
            <span className="text-muted-foreground">Another timeline:</span>
            <input
              type="number" min={LIMITS.horizon.min} max={LIMITS.horizon.max} step={1} autoFocus
              aria-invalid={invalid || undefined} aria-describedby={errorId}
              value={answers.horizonYears || ''}
              onChange={event => update({ horizonYears: event.target.value === '' ? 0 : Math.round(Number(event.target.value)), horizonFlexible: false })}
              className="h-11 w-20 rounded-xl border border-input bg-white px-3 text-center outline-none focus-visible:border-plum"
            />
            <span className="text-muted-foreground">years</span>
          </label>
        ) : (
          <button type="button" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground" onClick={() => { setCustom(true); update({ horizonFlexible: false }); }}>
            Choose a different number of years
          </button>
        )}
      </div>
      {!answers.horizonFlexible && answers.horizonYears > 0 && (
        <Callout>
          Set aside {formatINR(answers.monthlyContribution)} a month for {horizonLabel(answers)} and you’ll have put in <strong className="font-medium">{formatINR(contributed)}</strong> — before any growth or losses. We’ll explore what could close the gap to {formatINR(answers.goalAmount)} together, without promises.
        </Callout>
      )}
      {answers.horizonFlexible && <Callout>No deadline is a fine answer. We’ll use roughly ten years as a placeholder when showing examples, and you can set a date later.</Callout>}
    </div>
  );
}

function RiskStep({ answers, update, headingId }: StepProps) {
  return (
    <div className="space-y-6">
      <div aria-hidden="true" className="flex items-center gap-4 font-serif text-3xl">
        <span>₹10,000</span><ArrowDownRight className="text-warning" /><span className="text-warning">₹8,000</span><span className="font-sans text-xs text-muted-foreground">−20%</span>
      </div>
      <ChoiceList labelledBy={headingId} options={riskComfortOptions} value={answers.riskComfort} onChange={riskComfort => update({ riskComfort })} />
      <p className="text-xs leading-relaxed text-muted-foreground">This is a simplified example. Real declines can be larger than 20%, and can last months or even years before values recover. Recovery isn’t guaranteed.</p>
    </div>
  );
}

function AccessStep({ answers, update, headingId }: StepProps) {
  return (
    <div className="space-y-6">
      <ChoiceList labelledBy={headingId} options={accessOptions} value={answers.accessNeed} onChange={accessNeed => update({ accessNeed })} />
      <p className="text-xs leading-relaxed text-muted-foreground">Money you’ll need soon has less time to recover from a dip, so it usually calls for steadier choices.</p>
    </div>
  );
}

function EmergencyStep({ answers, update, headingId }: StepProps) {
  return (
    <div className="space-y-6">
      <ChoiceList labelledBy={headingId} options={emergencyOptions} value={answers.emergencyStatus} onChange={emergencyStatus => update({ emergencyStatus })} />
      {answers.emergencyStatus === 'not-yet' && (
        <Callout>
          <strong className="font-medium">That’s common, and worth knowing.</strong> An emergency fund is money you can reach quickly — in a savings account, for example — for a medical bill, a repair or a gap in income. Without it, a surprise can force you to sell investments at a bad moment. Many people build towards a few months of essential expenses, a little at a time. You can still continue.
        </Callout>
      )}
      {answers.emergencyStatus === 'a-little' && <Callout>A little is a real start. Topping it up alongside any investing keeps a surprise from derailing your goal.</Callout>}
    </div>
  );
}

function SummaryStep({ answers, onEdit }: StepProps) {
  const profile = riskProfileCopy[deriveRiskProfile(answers)];
  const rows: [string, string, number][] = [
    ['Goal amount', formatINR(answers.goalAmount), 1],
    ['Monthly contribution', `${formatINR(answers.monthlyContribution)} of ${formatINR(answers.monthlyIncome)}`, 3],
    ['Investment horizon', horizonLabel(answers), 4],
    ['Risk comfort', labelFor(riskComfortOptions, answers.riskComfort), 5],
    ['Access to money', labelFor(accessOptions, answers.accessNeed), 6],
    ['Emergency savings', labelFor(emergencyOptions, answers.emergencyStatus), 7],
  ];
  return (
    <div className="space-y-6">
      <dl className="divide-y rounded-2xl ink-outline bg-white">
        {rows.map(([label, value, step]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <dt className="eyebrow">{label}</dt>
              <dd className="mt-1 text-sm sm:text-base">{value}</dd>
            </div>
            <button type="button" onClick={() => onEdit(step)} aria-label={`Edit ${label.toLowerCase()}`} className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-cream hover:text-foreground">
              <Pencil size={14} />
            </button>
          </div>
        ))}
      </dl>
      <section aria-labelledby="learning-profile" className="rounded-2xl bg-cream p-6 sm:p-7">
        <p className="eyebrow">YOUR LEARNING PROFILE</p>
        <h2 id="learning-profile" className="mt-3 font-serif text-4xl">{profile.name}</h2>
        <p className="mt-2 text-sm">{profile.summary}</p>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Based on your comfort with dips, your timeline and when you might need the money — the most cautious of these sets the tone. It’s an educational starting point, not a suitability assessment or investment advice. Change your answers anytime.</p>
      </section>
    </div>
  );
}

export const questionSteps: QuestionStep[] = [
  { eyebrow: 'YOUR GOAL', plainTitle: 'What’s the number you’re working toward?', title: <>What’s the number you’re <em className="italic text-plum">working toward?</em></>, Body: GoalStep },
  { eyebrow: 'WHAT COMES IN', plainTitle: 'How much money do you receive each month?', title: 'How much money do you receive each month?', Body: IncomeStep },
  { eyebrow: 'WHAT YOU SET ASIDE', plainTitle: 'How much can you comfortably set aside?', title: <>How much can you <em className="italic text-plum">comfortably</em> set aside?</>, Body: SavingsStep },
  { eyebrow: 'YOUR TIMELINE', plainTitle: 'When would you like to reach your goal?', title: 'When would you like to reach your goal?', Body: TimelineStep },
  { eyebrow: 'UPS AND DOWNS', plainTitle: 'Imagine ₹10,000 temporarily becomes ₹8,000. How would you feel?', title: <>Imagine ₹10,000 temporarily becomes ₹8,000. <em className="italic text-plum">How would you feel?</em></>, Body: RiskStep },
  { eyebrow: 'ACCESS TO MONEY', plainTitle: 'Would you need access to these savings soon?', title: 'Would you need access to these savings soon?', Body: AccessStep },
  { eyebrow: 'A SAFETY NET', plainTitle: 'Do you have money set aside for emergencies?', title: 'Do you have money set aside for emergencies?', Body: EmergencyStep },
  { eyebrow: 'ALL SET', plainTitle: 'Your journey starts here.', title: 'Your journey starts here.', Body: SummaryStep },
];
