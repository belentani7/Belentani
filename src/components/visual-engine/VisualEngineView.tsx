import React, { useState } from 'react';
import { VisualEngineSettings, Language } from '../../types';
import { VisualEngineCanvas } from './VisualEngineCanvas';
import { VisualEngineControls } from './VisualEngineControls';
import { translations } from '../../locales/i18n';
import { Sparkles, Maximize2, Move3d } from 'lucide-react';

interface Props {
  lang: Language;
}

const DEFAULT_SETTINGS: VisualEngineSettings = {
  generator: 'galaxy',
  palette: 'cyberpunk',
  speed: 1.0,
  density: 1.0,
  wireframe: false,
  bloomGlow: true,
  particleSize: 1.2,
  rotationSpeed: 0.5,
  seed: 42,
  fieldOfView: 60,
  ambientLight: 0.6,
};

export const VisualEngineView: React.FC<Props> = ({ lang }) => {
  const [settings, setSettings] = useState<VisualEngineSettings>(DEFAULT_SETTINGS);
  const [fps, setFps] = useState(60);
  const [stats, setStats] = useState({ triangles: 0, points: 12000 });
  const [exportTrigger, setExportTrigger] = useState(0);
  const t = translations[lang];

  const handleResetCamera = () => {
    setSettings((s) => ({ ...s, seed: s.seed })); // Trigger refresh
  };

  const handleTakeSnapshot = () => {
    setExportTrigger((prev) => prev + 1);
  };

  const handleRandomizeSeed = () => {
    setSettings((s) => ({
      ...s,
      seed: Math.floor(Math.random() * 10000) + 1,
    }));
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-145px)] min-h-[600px]">
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/80 px-5 py-3 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">⚡</span>
            {t.engineTitle}
          </h2>
          <p className="text-xs text-zinc-400">
            {t.engineSubtitle}
          </p>
        </div>

        {/* Quick Mode badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300">
            <Move3d className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Drag to Orbit • Scroll to Zoom</span>
            <span className="sm:hidden">Interactive 3D</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-mono">WebGPU / TSL Ready</span>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas + Controls Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
        {/* 3D Canvas Area (3 cols on large screen) */}
        <div className="lg:col-span-3 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
          <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-400 bg-zinc-950/80 px-2.5 py-1 rounded-md border border-indigo-500/30 backdrop-blur-sm">
              {settings.generator.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-800 backdrop-blur-sm">
              PALETTE: {settings.palette.toUpperCase()}
            </span>
          </div>

          <div className="flex-1 w-full h-full">
            <VisualEngineCanvas
              settings={settings}
              onFpsUpdate={setFps}
              onStatsUpdate={setStats}
              exportTrigger={exportTrigger}
            />
          </div>
        </div>

        {/* Controls Sidebar (1 col on large screen) */}
        <div className="lg:col-span-1 h-full min-h-[480px]">
          <VisualEngineControls
            settings={settings}
            onChange={setSettings}
            onResetCamera={handleResetCamera}
            onTakeSnapshot={handleTakeSnapshot}
            onRandomizeSeed={handleRandomizeSeed}
            fps={fps}
            stats={stats}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
};
