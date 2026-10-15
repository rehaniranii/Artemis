import { useRoutes } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import { useFinancialStore } from '@/store/useFinancialStore';
import { appRoutes } from './router';
export function App(){const content=useRoutes(appRoutes),reducedMotion=useFinancialStore(s=>s.preferences.reducedMotion);return <RouteErrorBoundary><MotionConfig reducedMotion={reducedMotion?'always':'user'}><TooltipProvider delayDuration={200}>{content}</TooltipProvider></MotionConfig></RouteErrorBoundary>;}
