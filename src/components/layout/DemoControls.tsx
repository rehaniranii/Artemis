import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialStore } from '@/store/useFinancialStore';

/** Loads Aarav's full demo (profile, plan, example funds, fictional portfolio). */
export function useDemoMode() {
  const navigate = useNavigate();
  const loadDemo = useFinancialStore(s => s.loadDemo);
  return () => { loadDemo(); navigate('/home'); };
}

/** Footer controls: try the demo, or reset everything to Aarav's defaults after a confirm step. */
export function DemoControls() {
  const navigate = useNavigate();
  const resetDemo = useFinancialStore(s => s.resetDemo);
  const tryDemo = useDemoMode();
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex flex-col items-start gap-2 text-[13px]">
      <button type="button" onClick={tryDemo} className="underline underline-offset-4">Try Morrow with Aarav</button>
      {confirming ? (
        <span className="flex items-center gap-2" role="group" aria-label="Confirm reset">
          <span className="opacity-70">Clear your answers and plan?</span>
          <button type="button" onClick={() => { resetDemo(); setConfirming(false); navigate('/'); }} className="font-medium text-sun underline underline-offset-4">Yes, reset</button>
          <button type="button" onClick={() => setConfirming(false)} className="underline underline-offset-4">Cancel</button>
        </span>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className="underline underline-offset-4">Reset Demo</button>
      )}
    </div>
  );
}
