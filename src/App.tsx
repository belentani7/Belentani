import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Language, NavTabId } from './types';
import { Navigation } from './components/Navigation';
import { LANGUAGE_KEY, readStoredLanguage, readView } from './lib/navigation';
import { ShieldCheck } from 'lucide-react';

// Cada vista se carga bajo demanda: la vista inicial no arrastra el código
// (ni Three.js duplicado) de las demás. Ver manualChunks en vite.config.ts.
const JudasExperienceView = lazy(() =>
  import('./components/judas-omega/JudasExperienceView').then((m) => ({ default: m.JudasExperienceView })),
);
const OmegaPrimeView = lazy(() =>
  import('./components/omega-prime/OmegaPrimeView').then((m) => ({ default: m.OmegaPrimeView })),
);
const VisualEngineView = lazy(() =>
  import('./components/visual-engine/VisualEngineView').then((m) => ({ default: m.VisualEngineView })),
);
const SddMaestroView = lazy(() =>
  import('./components/sdd-maestro/SddMaestroView').then((m) => ({ default: m.SddMaestroView })),
);
const ProductionChecklistView = lazy(() =>
  import('./components/production-checklist/ProductionChecklistView').then((m) => ({
    default: m.ProductionChecklistView,
  })),
);
const WorkspaceHubView = lazy(() =>
  import('./components/workspace-hub/WorkspaceHubView').then((m) => ({ default: m.WorkspaceHubView })),
);

const SKIP_LABELS: Record<Language, string> = { es: 'Saltar al contenido', pt: 'Ir para o conteúdo', en: 'Skip to content', ca: 'Salta al contingut' };
const LOADING_LABELS: Record<Language, string> = { es: 'Cargando vista…', pt: 'Carregando vista…', en: 'Loading view…', ca: 'Carregant vista…' };

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTabId>(() => readView(window.location.href));
  const [lang, setLang] = useState<Language>(() => readStoredLanguage(window.localStorage));

  useEffect(() => {
    const onPopState = () => setCurrentTab(readView(window.location.href));
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
        <Suspense
          fallback={
            <p role="status" className="py-16 text-center font-mono text-sm text-zinc-400">
              {LOADING_LABELS[lang]}
            </p>
          }
        >
          {currentTab === 'judas_omega' && <JudasExperienceView lang={lang} />}
          {currentTab === 'omega_prime' && <OmegaPrimeView lang={lang} />}
          {currentTab === 'visual_engine' && <VisualEngineView lang={lang} />}
          {currentTab === 'sdd_maestro' && <SddMaestroView lang={lang} />}
          {currentTab === 'production_checklist' && <ProductionChecklistView lang={lang} />}
          {currentTab === 'workspace_hub' && <WorkspaceHubView lang={lang} />}
        </Suspense>
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
