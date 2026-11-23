import React, { useState } from 'react';
import { Language, NavTabId } from './types';
import { Navigation } from './components/Navigation';
import { JudasExperienceView } from './components/judas-omega/JudasExperienceView';
import { OmegaPrimeView } from './components/omega-prime/OmegaPrimeView';
import { VisualEngineView } from './components/visual-engine/VisualEngineView';
import { SddMaestroView } from './components/sdd-maestro/SddMaestroView';
import { ProductionChecklistView } from './components/production-checklist/ProductionChecklistView';
import { WorkspaceHubView } from './components/workspace-hub/WorkspaceHubView';
import { ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTabId>('judas_omega');
  const [lang, setLang] = useState<Language>('es');

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-rose-500/30 selection:text-rose-100">
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        lang={lang}
        onLangChange={setLang}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
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

