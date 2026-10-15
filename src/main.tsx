import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/dm-serif-display/latin-400.css';
import '@fontsource/dm-serif-display/latin-400-italic.css';
import './styles/globals.css';
import { App } from './App';
// Hash routing preserves direct links and reloads on static hosting without server rewrites.
const oldLinks:Record<string,string>={'#plan':'#/plan','#goal':'#/onboarding','#options':'#/explore','#progress':'#/home','#storm':'#/reality-lab'};
if(oldLinks[window.location.hash])window.history.replaceState(null,'',oldLinks[window.location.hash]);
createRoot(document.getElementById('root')!).render(<StrictMode><HashRouter><App/></HashRouter></StrictMode>);
