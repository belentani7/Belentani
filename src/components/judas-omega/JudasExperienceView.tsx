import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CosmosFocusId, Language } from '../../types';
import { Audio432Engine, AudioTelemetry } from './Audio432Engine';
import { OmegaCosmosCanvas } from './OmegaCosmosCanvas';
import { TerminalCharPlus } from './TerminalCharPlus';
import {
  DISCOGRAPHY,
  GalaxyNodeItem,
  JUDAS_LOCALE_COPY,
  JUDAS_PHASES,
  LORE_CHAPTERS,
  SIGNATURES,
  STATIONS,
  VIAJE3D_NODES,
  VISUAL_CODE_MEANINGS,
} from './judasData';
import {
  AudioWaveform,
  BookOpen,
  Compass,
  Disc3,
  Eye,
  Gem,
  KeyRound,
  Music,
  Play,
  Square,
  Upload,
} from 'lucide-react';

interface JudasExperienceViewProps {
  lang: Language;
}

const GEM_STORAGE_KEY = 'belentani_omega_gems_v1';

export const JudasExperienceView: React.FC<JudasExperienceViewProps> = ({ lang }) => {
  const copy = JUDAS_LOCALE_COPY[lang];

  const audioEngineRef = useRef<Audio432Engine | null>(null);
  if (!audioEngineRef.current) {
    audioEngineRef.current = new Audio432Engine();
  }
  const audioEngine = audioEngineRef.current;

  const [unlockedGems, setUnlockedGems] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(GEM_STORAGE_KEY);
      if (!saved) return [0];
      const parsed = JSON.parse(saved) as unknown;
      return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : [0];
    } catch {
      return [0];
    }
  });

  const [focusPreset, setFocusPreset] = useState<CosmosFocusId>('all');
  const [externalFocusSeq, setExternalFocusSeq] = useState<number>(0);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);
  const [activePhase, setActivePhase] = useState<number>(0);
  const [droneActive, setDroneActive] = useState<boolean>(false);
  const [beatActive, setBeatActive] = useState<boolean>(false);
  const [activeFreq, setActiveFreq] = useState<number>(432);
  const [customTrackName, setCustomTrackName] = useState<string | null>(null);
  const heroStageRef = useRef<HTMLElement>(null);

  // 50 Galaxies matrix filters
  const [filterSig, setFilterSig] = useState<string>('all');
  const [filterStation, setFilterStation] = useState<string>('all');

  const waveCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(GEM_STORAGE_KEY, JSON.stringify(unlockedGems));
    } catch {
      // Ignore storage errors
    }
  }, [unlockedGems]);

  // Clean up Web Audio context on unmount
  useEffect(() => {
    return () => {
      audioEngine.dispose();
    };
  }, [audioEngine]);

  // Radial FFT visualizer canvas synced at ~30fps
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const telemetry: AudioTelemetry = {
      overall: 0,
      bass: 0,
      mid: 0,
      high: 0,
      bins: new Uint8Array(64),
    };
    let rafId = 0;
    let start = performance.now();

    const draw = () => {
      const t = (performance.now() - start) / 1000;
      audioEngine.readTelemetry(telemetry);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Concentric obsidian core ring
      ctx.beginPath();
      ctx.arc(cx, cy, 38 + telemetry.bass * 16, 0, Math.PI * 2);
      ctx.strokeStyle = unlockedGems.length === 5 ? 'rgba(212, 175, 55, 0.7)' : 'rgba(255, 0, 51, 0.65)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // 48 radial frequency bars
      const bars = 48;
      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;
        const binVal = telemetry.bins[i % telemetry.bins.length] / 255;
        const synthWave = droneActive || beatActive ? Math.sin(t * 4 + i * 0.35) * 0.14 + 0.14 : 0.04;
        const mag = Math.max(binVal, synthWave);
        const rInner = 46;
        const rOuter = rInner + 12 + mag * 42;

        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
        ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
        ctx.strokeStyle =
          unlockedGems.length === 5 || i % 4 === 0 ? 'rgba(255, 212, 92, 0.9)' : 'rgba(255, 0, 51, 0.85)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      rafId = window.requestAnimationFrame(draw);
    };

    rafId = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(rafId);
  }, [audioEngine, beatActive, droneActive, unlockedGems.length]);

  const handleToggleGem = (idx: number) => {
    const sig = SIGNATURES[idx];
    if (sig) {
      audioEngine.triggerTone(sig.freqHz, 1.4);
      setActiveFreq(sig.freqHz);
    }
    setUnlockedGems((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx].sort()
    );
  };

  const handleUnlockAllGems = () => {
    setUnlockedGems([0, 1, 2, 3, 4]);
    setFocusPreset('diamonds');
  };

  const handleToggleDrone = () => {
    const active = audioEngine.toggleDrone();
    setDroneActive(active);
    if (active) setActiveFreq(432);
  };

  const handleToggleBeat = () => {
    const active = audioEngine.toggleBeat76Bpm();
    setBeatActive(active);
  };

  const handleTriggerSolfeggio = (hz: number) => {
    audioEngine.triggerTone(hz, 1.8);
    setActiveFreq(hz);
  };

  const handleAudioFile = (file: File | undefined) => {
    if (!file) return;
    const loaded = audioEngine.loadLocalAudioFile(file);
    if (loaded) setCustomTrackName(loaded);
  };

  const handleSelectNode = (idx: number, _node?: GalaxyNodeItem) => {
    setSelectedNodeIndex(idx);
  };

  const handleFocusInStage = (focus: CosmosFocusId) => {
    setFocusPreset(focus);
    setExternalFocusSeq((s) => s + 1);
    heroStageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const allGalaxies = useMemo(() => {
    const list: { num: number; sigIdx: number; staIdx: number; sig: (typeof SIGNATURES)[number]; station: string }[] = [];
    for (let s = 0; s < SIGNATURES.length; s++) {
      for (let st = 0; st < STATIONS.length; st++) {
        list.push({
          num: s * 10 + st + 1,
          sigIdx: s,
          staIdx: st,
          sig: SIGNATURES[s],
          station: STATIONS[st],
        });
      }
    }
    return list;
  }, []);

  const filteredGalaxies = useMemo(() => {
    return allGalaxies.filter(
      (g) =>
        (filterSig === 'all' || g.sigIdx === Number(filterSig)) &&
        (filterStation === 'all' || g.staIdx === Number(filterStation))
    );
  }, [allGalaxies, filterSig, filterStation]);

  const activeNode = VIAJE3D_NODES[selectedNodeIndex] ?? VIAJE3D_NODES[0];
  const currentPhase = JUDAS_PHASES[activePhase] ?? JUDAS_PHASES[0];
  const isAscended = unlockedGems.length === 5;

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* 00 HERO HEADER + LIVE WEBGL COSMOS STAGE */}
      <section ref={heroStageRef} className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rose-500/25 pb-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-[11px] font-mono tracking-[0.22em] text-amber-300/90 uppercase">
              {copy.eyebrow}
            </div>
            <h1 className="font-ritual text-3xl sm:text-4xl lg:text-5xl font-black tracking-wide text-white text-balance">
              BELENTANI <span className="text-rose-500">//</span> THE JUDAS EXPERIENCE
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">{copy.heroLead}</p>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono">
            <span className="text-zinc-400">432 HZ · 76 BPM</span>
            <span aria-hidden="true" className="text-rose-500">·</span>
            <span className={isAscended ? 'text-amber-300 font-bold' : 'text-rose-400 font-bold'}>
              {unlockedGems.length}/5 {isAscended ? 'ASCENDIDO' : 'GEMAS'}
            </span>
          </div>
        </div>

        <OmegaCosmosCanvas
          audioEngine={audioEngine}
          unlockedGems={unlockedGems}
          onToggleGem={handleToggleGem}
          selectedNodeIndex={selectedNodeIndex}
          onSelectNode={handleSelectNode}
          focusPreset={focusPreset}
          onFocusChange={setFocusPreset}
          droneActive={droneActive}
          onToggleDrone={handleToggleDrone}
          onSyncAudioStates={(drone) => setDroneActive(drone)}
          externalFocusSeq={externalFocusSeq}
        />

        {/* Selected 44-Node Galaxy Strip */}
        <div className="judas-milky-glass p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5 min-w-0">
            <div className="text-[11px] font-mono text-amber-300 uppercase tracking-wider">
              VIAJE-3D · PLANETA #{String(selectedNodeIndex + 1).padStart(2, '0')} · {activeNode.category}
            </div>
            <div className="text-base font-display font-bold text-white truncate">{activeNode.name}</div>
            <p className="text-xs text-zinc-300">{activeNode.desc}</p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {VIAJE3D_NODES.slice(0, 8).map((n, idx) => (
              <button
                key={n.name}
                type="button"
                onClick={() => {
                  setSelectedNodeIndex(idx);
                  handleFocusInStage('galaxy');
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  selectedNodeIndex === idx
                    ? 'bg-rose-600 text-white'
                    : 'bg-black/60 text-zinc-400 hover:text-amber-300 border border-rose-500/25'
                }`}
              >
                {String(idx + 1).padStart(2, '0')}. {n.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ANATOMÍA VISUAL DEL CÓDIGO */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-rose-400" />
            <h2 className="font-display text-lg font-bold tracking-wider text-white uppercase">
              Anatomía Visual del Código · Significado de Cada Símbolo 3D
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">6 ESTRUCTURAS WEBGL / GLSL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VISUAL_CODE_MEANINGS.map((item) => (
            <div
              key={item.id}
              className="judas-milky-glass p-4 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <h3 className="font-display text-sm font-bold text-amber-300">{item.codeElement}</h3>
                <p className="text-xs text-zinc-200 leading-relaxed">{item.symbolicMeaning}</p>
                <p className="text-[11px] font-mono text-zinc-400 leading-relaxed">{item.technicalMech}</p>
              </div>
              <button
                type="button"
                onClick={() => handleFocusInStage(item.focus)}
                className="self-start px-3 py-1.5 rounded-lg bg-black/70 hover:bg-rose-600/30 border border-rose-500/35 text-[11px] font-mono text-amber-300 hover:text-white transition-colors cursor-pointer"
              >
                Enfocar en 3D
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 01 LA LLAVE DORADA & LOS 5 DIAMANTES ARQUETIPO */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-lg font-bold tracking-wider text-white uppercase">
              La Llave Dorada &amp; 5 Diamantes Arquetipo (IOR 2.417)
            </h2>
          </div>
          <span className="text-xs font-mono text-amber-300">
            {isAscended ? copy.ascendedText : `${unlockedGems.length} / 5 SINCRONIZADOS`}
          </span>
        </div>

        <p className="text-xs text-zinc-400">{copy.portalHint}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {SIGNATURES.map((sig, idx) => {
            const unlocked = unlockedGems.includes(idx);
            return (
              <button
                key={sig.id}
                type="button"
                onClick={() => handleToggleGem(idx)}
                className={`judas-milky-glass p-4 text-left flex flex-col justify-between gap-3 transition-transform hover:-translate-y-0.5 ${
                  unlocked ? 'ring-1 ring-amber-400/70' : 'opacity-85'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span style={{ color: sig.color }}>{sig.code}</span>
                    <span className={unlocked ? 'text-amber-300 font-bold' : 'text-zinc-500'}>
                      {unlocked ? '◆ ACTIVA' : '○ SELLADA'}
                    </span>
                  </div>
                  <div className="font-display text-base font-bold text-white">{sig.name}</div>
                  <div className="text-[11px] font-mono" style={{ color: sig.color }}>
                    {sig.title} · {sig.freqHz} HZ
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed pt-1">{sig.desc}</p>
                </div>

                <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 pt-2 border-t border-white/10">
                  <Gem className="w-3 h-3" style={{ color: sig.color }} />
                  <span>{unlocked ? 'Pulsa para sintonizar' : 'Clic para despertar'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 02 BIOGRAFÍA OFICIAL & MITOLOGÍA SAN PEDRO / JUDAS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <article className="judas-milky-glass p-6 space-y-4">
          <div className="text-[11px] font-mono text-rose-400 uppercase tracking-widest">
            RECORD_01 // BELENTANI (@BELENTANI_)
          </div>
          <h2 className="font-display text-xl font-bold text-white">{copy.bioTitle}</h2>
          <p className="text-sm text-zinc-300 leading-relaxed">{copy.bioParagraph1}</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{copy.bioParagraph2}</p>
          <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-amber-300">
            <span>Dark Pop</span>
            <span>·</span>
            <span>Electro-R&amp;B</span>
            <span>·</span>
            <span>Funk Carioca 2000s</span>
            <span>·</span>
            <span>MPB Nocturna</span>
            <span>·</span>
            <span>Blue Yeti X</span>
          </div>
        </article>

        <article className="judas-milky-glass p-6 space-y-4">
          <div className="text-[11px] font-mono text-amber-300 uppercase tracking-widest">
            CRÓNICA NARRATIVA // {copy.phasesTitle}
          </div>
          <blockquote className="text-sm italic text-amber-200 border-b border-rose-500/25 pb-3">
            {copy.keyQuote}
          </blockquote>

          <div className="flex flex-wrap gap-1.5">
            {JUDAS_PHASES.map((phase, i) => (
              <button
                key={phase.id}
                type="button"
                onClick={() => setActivePhase(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activePhase === i
                    ? 'bg-rose-600 text-white'
                    : 'bg-black/60 text-zinc-400 hover:text-white border border-rose-500/25'
                }`}
              >
                {phase.code}
              </button>
            ))}
          </div>

          <div className="bg-black/60 border border-rose-500/25 rounded-xl p-4 space-y-2">
            <h3 className="font-display text-sm font-bold text-amber-300">{currentPhase.title}</h3>
            {currentPhase.body.map((paragraph, idx) => (
              <p key={idx} className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </section>

      {/* 03 SONIC 432 HZ LAB & DISCOGRAFÍA CANÓNICA */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 judas-milky-glass p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-display text-sm font-bold uppercase">
              <AudioWaveform className="w-4 h-4 text-rose-500" />
              <span>{copy.sonicTitle}</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">{activeFreq} HZ</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <canvas
              ref={waveCanvasRef}
              width={220}
              height={220}
              className="rounded-full bg-black/70 border border-rose-500/30"
            />
            {customTrackName && (
              <div className="mt-2 text-[11px] font-mono text-amber-300 truncate max-w-full">
                AUDIO LOCAL: {customTrackName}
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[432, 528, 639, 741].map((hz) => (
                <button
                  key={hz}
                  type="button"
                  onClick={() => handleTriggerSolfeggio(hz)}
                  className={`py-1.5 rounded-lg text-[11px] font-mono border transition-colors ${
                    activeFreq === hz
                      ? 'bg-rose-600/30 border-amber-400 text-amber-200'
                      : 'bg-black/60 border-rose-500/30 text-zinc-300 hover:text-white'
                  }`}
                >
                  {hz} HZ
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleToggleDrone}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                  droneActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-rose-600/20 border-rose-500/45 text-white hover:bg-rose-600/35'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>{droneActive ? 'STOP DRONE 432' : 'DRONE 432 HZ'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleBeat}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                  beatActive
                    ? 'bg-rose-600 border-rose-400 text-white'
                    : 'bg-black/70 border-amber-400/45 text-amber-300 hover:bg-amber-500/15'
                }`}
              >
                {beatActive ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{beatActive ? 'STOP 76 BPM' : 'BEAT 76 BPM'}</span>
              </button>
            </div>

            <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-amber-400/45 text-xs font-mono text-zinc-300 hover:bg-amber-500/10 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-amber-300" />
              <span>Cargar WAV / MP3 / FLAC local</span>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => handleAudioFile(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>

        <div className="lg:col-span-7 judas-milky-glass p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-rose-500/25 pb-3">
            <div className="flex items-center gap-2 text-white font-display text-sm font-bold uppercase">
              <Disc3 className="w-4 h-4 text-rose-500" />
              <span>Archivo Discográfico &amp; Sesiones Hey Duck</span>
            </div>
            <span className="text-[11px] font-mono text-amber-300">ERA 2026</span>
          </div>

          <div className="divide-y divide-rose-500/15 overflow-y-auto max-h-[340px] pr-1">
            {DISCOGRAPHY.map((track) => (
              <div
                key={track.id}
                onClick={() => handleTriggerSolfeggio(track.freq)}
                className="py-3 flex flex-col gap-1 cursor-pointer hover:bg-rose-500/10 px-2 rounded-lg transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-white">{track.title}</span>
                  <span className="text-[11px] font-mono text-amber-300">
                    {track.prod} · {track.bpm} BPM · {track.freq} HZ
                  </span>
                </div>
                <div className="text-[11px] font-mono text-rose-400">{track.genre}</div>
                <p className="text-xs text-zinc-300 leading-relaxed">{track.lore}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 MATRIZ DE 50 GALAXIAS (5 FIRMAS × 10 ESTACIONES) + CÓDICE */}
      <section className="judas-milky-glass p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-500/25 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-base sm:text-lg font-bold text-white uppercase">
              {copy.galaxiesTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterSig}
              onChange={(e) => setFilterSig(e.target.value)}
              aria-label="Filtrar por firma"
              className="bg-black/80 border border-rose-500/35 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">TODAS LAS FIRMAS (5)</option>
              {SIGNATURES.map((s, idx) => (
                <option key={s.id} value={String(idx)}>
                  {s.name} ({s.title})
                </option>
              ))}
            </select>

            <select
              value={filterStation}
              onChange={(e) => setFilterStation(e.target.value)}
              aria-label="Filtrar por estación"
              className="bg-black/80 border border-rose-500/35 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">TODAS LAS ESTACIONES (10)</option>
              {STATIONS.map((st, idx) => (
                <option key={st} value={String(idx)}>
                  ESTACIÓN {String(idx + 1).padStart(2, '0')} · {st}
                </option>
              ))}
            </select>

            <span className="text-xs font-mono text-amber-300">
              {filteredGalaxies.length} / 50 ACTIVOS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {filteredGalaxies.map((g) => (
            <div
              key={g.num}
              className="bg-black/65 border border-white/10 hover:border-rose-500/50 rounded-xl p-3 flex flex-col gap-1 transition-colors"
            >
              <span className="text-[10px] font-mono" style={{ color: g.sig.color }}>
                GALAXIA #{String(g.num).padStart(2, '0')}
              </span>
              <span className="text-xs font-bold text-white leading-snug">{g.station}</span>
              <span className="text-[10px] font-mono text-zinc-400">
                {g.sig.code} · {g.sig.freqHz} HZ
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 05 TERMINAL CHAR+ & CAPÍTULOS DEL CÓDICE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <TerminalCharPlus
            lang={lang}
            audioEngine={audioEngine}
            unlockedGems={unlockedGems}
            onToggleGem={handleToggleGem}
            onUnlockAllGems={handleUnlockAllGems}
            onSelectNode={(idx) => {
              setSelectedNodeIndex(idx);
              setFocusPreset('galaxy');
            }}
          />
        </div>

        <div className="lg:col-span-5 judas-milky-glass p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-rose-500/25 pb-2.5 text-amber-300 font-display text-sm font-bold uppercase">
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span>Códice de Lore Belentani</span>
          </div>
          <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
            {LORE_CHAPTERS.map((chap) => (
              <div key={chap.title} className="bg-black/55 border border-rose-500/20 rounded-xl p-3 space-y-1">
                <h3 className="text-xs font-display font-bold text-amber-200">{chap.title}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">{chap.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
