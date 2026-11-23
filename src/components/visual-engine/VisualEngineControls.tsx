import React from 'react';
import { VisualEngineSettings, GeneratorType, PaletteId, Language } from '../../types';
import { translations } from '../../locales/i18n';
import { 
  Sparkles, 
  RotateCw, 
  Camera, 
  Sliders, 
  Eye, 
  Layers, 
  Activity, 
  Sun, 
  Zap, 
  Compass,
  Shuffle
} from 'lucide-react';

interface ControlsProps {
  settings: VisualEngineSettings;
  onChange: (newSettings: VisualEngineSettings) => void;
  onResetCamera: () => void;
  onTakeSnapshot: () => void;
  onRandomizeSeed: () => void;
  fps: number;
  stats: { triangles: number; points: number };
  lang: Language;
}

const GENERATORS: { id: GeneratorType; label: string; icon: string }[] = [
  { id: 'galaxy', label: 'Galaxy / Celestial', icon: '🌌' },
  { id: 'cyber_matrix', label: 'Cyber Matrix / Grid', icon: '⚡' },
  { id: 'landscape_biomes', label: 'Landscape Biomes', icon: '🏔️' },
  { id: 'particle_vortex', label: 'Particle Vortex', icon: '🌀' },
  { id: 'atmospheric_nebula', label: 'Atmospheric Nebula', icon: '☁️' },
  { id: 'monumental_architecture', label: 'Monumental Arch', icon: '🏛️' },
];

const PALETTES: { id: PaletteId; label: string; colors: string[] }[] = [
  { id: 'cyberpunk', label: 'Cyberpunk Neon', colors: ['#00f0ff', '#ff007f', '#ffe600'] },
  { id: 'void_violet', label: 'Deep Void', colors: ['#9d4edd', '#7b2cbf', '#c77dff'] },
  { id: 'solar_flare', label: 'Solar Flare', colors: ['#ff6b35', '#f7b267', '#f25c54'] },
  { id: 'emerald_matrix', label: 'Emerald Quantum', colors: ['#00ff66', '#00e5a3', '#00b4d8'] },
  { id: 'aurora_borealis', label: 'Aurora Borealis', colors: ['#05ffa1', '#00c3ff', '#b900ff'] },
  { id: 'monolith_gold', label: 'Monolith Gold', colors: ['#e5c07b', '#d19a66', '#e76f51'] },
];

export const VisualEngineControls: React.FC<ControlsProps> = ({
  settings,
  onChange,
  onResetCamera,
  onTakeSnapshot,
  onRandomizeSeed,
  fps,
  stats,
  lang,
}) => {
  const t = translations[lang];

  const update = <K extends keyof VisualEngineSettings>(key: K, value: VisualEngineSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-2xl h-full overflow-y-auto">
      {/* Performance HUD header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-zinc-400">
            WebGL r185+ Engine
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className={`px-2 py-0.5 rounded font-bold ${
            fps >= 55 ? 'bg-emerald-500/20 text-emerald-400' :
            fps >= 30 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {fps} {t.fpsLabel}
          </span>
          <span className="text-zinc-500">
            {stats.triangles > 0 ? `${stats.triangles.toLocaleString()} Δ` : `${stats.points.toLocaleString()} •`}
          </span>
        </div>
      </div>

      {/* Generator selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          {t.presetLabel}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GENERATORS.map((gen) => {
            const active = settings.generator === gen.id;
            return (
              <button
                key={gen.id}
                onClick={() => update('generator', gen.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                    : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/50'
                }`}
              >
                <span className="text-base">{gen.icon}</span>
                <span className="truncate">{gen.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          {t.paletteLabel}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PALETTES.map((pal) => {
            const active = settings.palette === pal.id;
            return (
              <button
                key={pal.id}
                onClick={() => update('palette', pal.id)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-zinc-800 text-white border-2 border-indigo-500 shadow-md'
                    : 'bg-zinc-800/40 hover:bg-zinc-800/70 text-zinc-400 border border-zinc-800'
                }`}
              >
                <span className="truncate mr-1 text-[11px]">{pal.label}</span>
                <div className="flex gap-1 shrink-0">
                  {pal.colors.map((c, idx) => (
                    <span
                      key={idx}
                      className="w-2.5 h-2.5 rounded-full border border-black/30"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => update('wireframe', !settings.wireframe)}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
            settings.wireframe
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
              : 'bg-zinc-800/50 text-zinc-400 border-zinc-800 hover:text-zinc-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          {t.wireframe}
        </button>
        <button
          onClick={() => update('bloomGlow', !settings.bloomGlow)}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
            settings.bloomGlow
              ? 'bg-pink-500/20 text-pink-300 border-pink-500/50'
              : 'bg-zinc-800/50 text-zinc-400 border-zinc-800 hover:text-zinc-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          {t.bloomGlow}
        </button>
      </div>

      {/* Fine-Tuning Sliders */}
      <div className="space-y-4 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            {t.controlsTitle}
          </span>
          <span className="text-[11px] font-mono text-zinc-500">Seed: #{settings.seed}</span>
        </div>

        {/* Speed */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">{t.speed}</span>
            <span className="font-mono text-zinc-300">{settings.speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={settings.speed}
            onChange={(e) => update('speed', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Density */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">{t.density}</span>
            <span className="font-mono text-zinc-300">{Math.round(settings.density * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="2"
            step="0.1"
            value={settings.density}
            onChange={(e) => update('density', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Orbital Rotation */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">{t.rotationSpeed}</span>
            <span className="font-mono text-zinc-300">{settings.rotationSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0"
            max="2.5"
            step="0.1"
            value={settings.rotationSpeed}
            onChange={(e) => update('rotationSpeed', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Particle / Geometry Size */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">Scale / Geometry Size</span>
            <span className="font-mono text-zinc-300">{settings.particleSize.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={settings.particleSize}
            onChange={(e) => update('particleSize', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2 mt-auto">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onRandomizeSeed}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium transition-all"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            {t.randomizeSeed}
          </button>
          <button
            onClick={onResetCamera}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium transition-all"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            {t.resetCamera}
          </button>
        </div>

        <button
          onClick={onTakeSnapshot}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-pink-600 via-indigo-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
        >
          <Camera className="w-4 h-4" />
          {t.takeSnapshot}
        </button>
      </div>
    </div>
  );
};
