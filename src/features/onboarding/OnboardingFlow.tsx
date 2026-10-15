import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppMotion } from '@/hooks/useAppMotion';
import { useFinancialStore } from '@/store/useFinancialStore';
import { cn } from '@/lib/utils';
import { ArrowUp, Coin, HeroArt, MoneyCard, Phone, Ring, Sparkle, Sprout } from '@/components/illustrations';
import { validateStep } from './journey';
import { questionSteps } from './steps';

const QUESTION_COUNT = questionSteps.length - 1;
const SUMMARY_STEP = questionSteps.length;

function StepProgress({ step }: { step: number }) {
  const question = Math.min(step, QUESTION_COUNT);
  return (
    <div className="mb-10 sm:mb-14">
      <div className="mb-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{step === SUMMARY_STEP ? 'Summary' : `Question ${question} of ${QUESTION_COUNT}`}</span>
        <span className="flex items-center gap-1.5"><Lock size={11} />Stays on this device</span>
      </div>
      <div role="progressbar" aria-label="Onboarding progress" aria-valuemin={0} aria-valuemax={QUESTION_COUNT} aria-valuenow={step === SUMMARY_STEP ? QUESTION_COUNT : question - 1} className="flex gap-1.5">
        {Array.from({ length: QUESTION_COUNT }, (_, index) => (
          <span key={index} className="h-2.5 flex-1 overflow-hidden rounded-full border-2 border-ink bg-white">
            <span className={cn('block h-full bg-plum transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)]', index < question - 1 || step === SUMMARY_STEP ? 'w-full' : index === question - 1 ? 'w-1/2' : 'w-0')} />
          </span>
        ))}
      </div>
    </div>
  );
}

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { reduceMotion } = useAppMotion();
  const draft = useFinancialStore(s => s.onboardingDraft);
  const name = useFinancialStore(s => s.profile.name);
  const onboardingComplete = useFinancialStore(s => s.onboardingComplete);
  const { startOnboarding, updateOnboarding, setOnboardingStep, finishOnboarding } = useFinancialStore.getState();
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState<string | null>(null);
  // When a summary row's edit button opens a question, Continue returns straight to the summary.
  const [returnToSummary, setReturnToSummary] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const headingId = useId();
  const errorId = useId();
  const step = draft?.step ?? 0;

  useEffect(() => { document.title = 'Your starting point | Morrow'; }, []);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }, [step]);

  function go(next: number) {
    setDirection(next > step ? 1 : -1);
    setError(null);
    setOnboardingStep(next);
  }

  function begin(target = 1) {
    if (!draft) startOnboarding();
    setDirection(1);
    setOnboardingStep(target);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    if (step === SUMMARY_STEP) {
      if (finishOnboarding()) {
        // A brief sunny wipe marks the end of onboarding; skipped under reduced motion.
        if (reduceMotion) navigate('/explore', { state: { fromOnboarding: true } });
        else { setFinishing(true); window.setTimeout(() => navigate('/explore', { state: { fromOnboarding: true } }), 900); }
      }
      else setError('A few answers need another look. Use the edit buttons above.');
      return;
    }
    const problem = validateStep(step, draft.answers);
    if (problem) { setError(problem); return; }
    if (returnToSummary) setReturnToSummary(false);
    go(returnToSummary ? SUMMARY_STEP : step + 1);
  }

  const slide = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, x: 32 * direction }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -32 * direction }, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const } };

  if (step === 0) {
    return (
      <motion.section key="intro" {...slide} className="mx-auto grid min-h-[64vh] max-w-6xl items-center gap-10 py-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col items-start">
        <p className="eyebrow mb-6 flex items-center gap-2"><span className="marker-dot" />YOUR STARTING POINT</p>
        <h1 ref={heading} tabIndex={-1} className="display text-[56px] outline-none sm:text-[96px]">
          Let’s figure out your <em className="italic text-plum">first million.</em>
        </h1>
        <p className="mt-6 text-base text-muted-foreground sm:text-lg">A few simple questions. No financial jargon.</p>
        <Button type="button" size="lg" onClick={() => begin()} className="mt-10 h-14 rounded-full px-9 text-sm">
          Let’s begin<ArrowRight size={16} />
        </Button>
        {onboardingComplete && !draft && (
          <button type="button" onClick={() => begin(SUMMARY_STEP)} className="mt-5 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Or jump to your saved answers
          </button>
        )}
        <p className="mt-10 max-w-sm text-xs text-muted-foreground">
          {QUESTION_COUNT} questions · about two minutes. {onboardingComplete ? `Your saved answers are filled in — change only what’s different.` : `We’ve filled in ${name}’s demo answers so you can see how it works. Change anything.`}
        </p>
        </div>
        <div aria-hidden="true" className="relative mx-auto hidden aspect-square w-full max-w-[460px] lg:block"><HeroArt className="absolute inset-0" /></div>
      </motion.section>
    );
  }

  const current = questionSteps[step - 1];
  const { Body } = current;
  const isSummary = step === SUMMARY_STEP;
  return (
    <div className="mx-auto grid max-w-6xl gap-10 py-2 sm:py-6 lg:grid-cols-[minmax(0,42rem)_1fr]">
      <div className="min-w-0">
      <StepProgress step={step} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.form key={step} {...slide} onSubmit={submit} noValidate aria-labelledby={headingId}>
          <div className="mb-6 flex items-center gap-4"><span aria-hidden="true" className="display text-6xl text-plum sm:text-7xl">{String(step).padStart(2, '0')}</span><p className="eyebrow text-ink">{isSummary ? 'The last chapter' : `Chapter ${step}`} · {current.eyebrow}</p></div>
          <h1 id={headingId} ref={heading} tabIndex={-1} className="display mb-10 text-[40px] outline-none sm:text-6xl">{current.title}</h1>
          {draft && <Body answers={draft.answers} update={patch => { setError(null); updateOnboarding(patch); }} headingId={headingId} errorId={errorId} invalid={Boolean(error)} onEdit={target => { setReturnToSummary(true); go(target); }} />}
          <p id={errorId} role="alert" className="mt-4 min-h-5 text-sm text-destructive">{error}</p>
          <div className="sticky bottom-0 z-10 -mx-6 mt-8 flex items-center justify-between gap-4 border-t bg-background/90 px-6 py-4 backdrop-blur-md sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-6 sm:backdrop-blur-none">
            <Button type="button" variant="ghost" className="rounded-full text-sm" onClick={() => { setReturnToSummary(false); go(step - 1); }}>
              <ArrowLeft size={16} />Back
            </Button>
            <Button type="submit" size="lg" className="h-12 rounded-full px-7 text-sm shadow-sm">
              {isSummary ? <>Explore My Options<ArrowRight size={16} /></> : returnToSummary ? 'Save and review' : <>Continue<ArrowRight size={16} /></>}
            </Button>
          </div>
        </motion.form>
      </AnimatePresence>
      </div>
      <aside aria-hidden="true" className="relative hidden items-start justify-center pt-24 lg:flex">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={reduceMotion ? false : { opacity: 0, scale: 0.7, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.8, rotate: 10 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }} className="relative w-64">
            <div className="float-slow">{STEP_ART[step - 1]}</div>
            <Sparkle className="absolute -right-6 -top-6 w-14" />
          </motion.div>
        </AnimatePresence>
      </aside>
      <AnimatePresence>
        {finishing && (
          <motion.div role="status" initial={{ clipPath: 'circle(0% at 50% 100%)' }} animate={{ clipPath: 'circle(150% at 50% 100%)' }} transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }} className="fixed inset-0 z-50 grid place-items-center bg-sun">
            <div className="text-center">
              <Sparkle className="mx-auto w-20 animate-spin [animation-duration:3s]" />
              <p className="display mt-6 text-5xl sm:text-7xl">Your journey<br />starts here.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const STEP_ART = [<Coin key="1" />, <Phone key="2" className="mx-auto w-40" />, <Sprout key="3" className="mx-auto w-48" />, <ArrowUp key="4" className="mx-auto w-44" />, <Ring key="5" fill="#FFD95A" />, <MoneyCard key="6" />, <Ring key="7" />, <Coin key="8" fill="#A8D5C2" />];
