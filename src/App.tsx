import React, { useEffect, useState } from 'react';
import { Language, NavTabId } from './types';
import { Navigation } from './components/Navigation';
import { JudasExperienceView } from './components/judas-omega/JudasExperienceView';
import { OmegaPrimeView } from './components/omega-prime/OmegaPrimeView';
import { VisualEngineView } from './components/visual-engine/VisualEngineView';
import { SddMaestroView } from './components/sdd-maestro/SddMaestroView';
import { ProductionChecklistView } from './components/production-checklist/ProductionChecklistView';
import { WorkspaceHubView } from './components/workspace-hub/WorkspaceHubView';
import { ShieldCheck } from 'lucide-react';

const VIEW_IDS: readonly NavTabId[] = ['judas_omega', 'omega_prime', 'visual_engine', 'sdd_maestro', 'production_checklist', 'workspace_hub'];
const LANGUAGE_IDS: readonly Language[] = ['pt', 'es', 'en', 'ca'];
const LANGUAGE_KEY = 'belentani-workspace-language';
const SKIP_LABELS: Record<Language, string> = { es: 'Saltar al contenido', pt: 'Ir para o conteúdo', en: 'Skip to content', ca: 'Salta al contingut' };

function readView(): NavTabId {
  const value = new URL(window.location.href).searchParams.get('view');
  return VIEW_IDS.find(id => id === value) ?? 'judas_omega';
}
function readLanguage(): Language {
  try {
    const value = window.localStorage.getItem(LANGUAGE_KEY);
    return LANGUAGE_IDS.find(id => id === value) ?? 'es';
  } catch { return 'es'; }
}

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTabId>(readView);
  const [lang, setLang] = useState<Language>(readLanguage);

  useEffect(() => {
    const onPopState = () => setCurrentTab(readView());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { window.localStorage.setItem(LANGUAGE_KEY, lang); } catch { /* storage is optional */ }
  }, [lang]);

  function navigate(tab: NavTabId) {
    if (tab === currentTab) return;
    const url = new URL(window.location.href);
    url.searchParams.set('view', tab);
    url.hash = '';
    try { window.history.pushState(null, '', url); } catch { /* preserve in-memory navigation */ }
    setCurrentTab(tab);
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-rose-500/30 selection:text-rose-100">
      <a href="#workspace-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-rose-100 focus:p-3 focus:font-bold focus:text-black">{SKIP_LABELS[lang]}</a>
      <Navigation
        currentTab={currentTab}
        onTabChange={navigate}
        lang={lang}
        onLangChange={setLang}
      />

      <main id="workspace-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        {currentTab === 'judas_omega' && <JudasExperienceView lang={lang} />}
        {currentTab === 'omega_prime' && <OmegaPrimeView lang={lang} />}
        {currentTab === 'visual_engine' && <VisualEngineView lang={lang} />}
        {currentTab === 'sdd_maestro' && <SddMaestroView lang={lang} />}
        {currentTab === 'production_checklist' && <ProductionChecklistView lang={lang} />}
        {currentTab === 'workspace_hub' && <WorkspaceHubView lang={lang} />}
      </main>

      <footer className="border-t border-zinc-900 bg-black py-4 px-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-zinc-400">
            belentani-workspace · Ecosistema de Pedro Belentani (belentani7)
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-amber-400/90">
              <ShieldCheck className="w-3.5 h-3.5" /> THE JUDAS EXPERIENCE // OMEGA
            </span>
            <span>432 Hz · 76 BPM · Three.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

