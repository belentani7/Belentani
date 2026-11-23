import React from 'react';
import { Language, NavTabId } from '../types';
import { translations } from '../locales/i18n';
import {
  Award,
  Cpu,
  Flame,
  FolderGit2,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

interface NavProps {
  currentTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'pt', label: 'Português' },
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
  { id: 'ca', label: 'Català' },
];

export const Navigation: React.FC<NavProps> = ({
  currentTab,
  onTabChange,
  lang,
  onLangChange,
}) => {
  const t = translations[lang];

  const tabs: { id: NavTabId; label: string; icon: React.ReactNode; accent?: 'omega' }[] = [
    {
      id: 'judas_omega',
      label: t.navJudasOmega,
      icon: <Flame className="w-3.5 h-3.5" />,
      accent: 'omega',
    },
    {
      id: 'omega_prime',
      label: t.navOmegaPrime,
      icon: <Zap className="w-3.5 h-3.5" />,
      accent: 'omega',
    },
    {
      id: 'visual_engine',
      label: t.navVisualEngine,
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'sdd_maestro',
      label: t.navSddMaestro,
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
    {
      id: 'production_checklist',
      label: t.navProductionChecklist,
      icon: <Award className="w-3.5 h-3.5" />,
    },
    {
      id: 'workspace_hub',
      label: t.navWorkspaceHub,
      icon: <FolderGit2 className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/95 border-b border-rose-500/25 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap lg:flex-nowrap items-center justify-between gap-3">
        {/* Brand identity */}
        <button
          type="button"
          onClick={() => onTabChange('judas_omega')}
          className="flex items-center gap-3 text-left shrink-0 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg border border-rose-500/40 bg-zinc-950 flex items-center justify-center group-hover:border-amber-400/60 transition-colors">
            <Cpu className="w-4.5 h-4.5 text-rose-400 group-hover:text-amber-300 transition-colors" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm tracking-wider text-white">
                BELENTANI
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                OMEGA
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden xl:block max-w-[260px] truncate">
              {t.tagline}
            </p>
          </div>
        </button>

        {/* Single-row scrollable Navigation Tabs */}
        <nav
          aria-label="Primary Workspace Navigation"
          className="flex items-center gap-1 bg-zinc-950 border border-zinc-800/90 p-1 rounded-xl overflow-x-auto max-w-full"
        >
          {tabs.map((tab) => {
            const active = currentTab === tab.id;
            const activeClasses =
              tab.accent === 'omega'
                ? 'bg-gradient-to-r from-rose-700 to-rose-600 text-white shadow-md shadow-rose-900/40 border border-rose-400/30'
                : 'bg-zinc-800 text-white border border-zinc-700';

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? activeClasses
                    : 'text-zinc-400 hover:text-zinc-100 border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side: Language Switcher (PT > ES > EN > CA) & Repo identifier */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-zinc-950 border border-zinc-800 p-0.5 rounded-xl">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => onLangChange(l.id)}
                title={l.label}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors uppercase whitespace-nowrap cursor-pointer ${
                  lang === l.id
                    ? 'bg-rose-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {l.id}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-zinc-400 whitespace-nowrap">
            <GitBranch className="w-3.5 h-3.5 text-amber-400/80" />
            <span>belentani7</span>
          </div>
        </div>
      </div>
    </header>
  );
};

