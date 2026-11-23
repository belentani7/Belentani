import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../../types';
import {
  DISCOGRAPHY,
  SIGNATURES,
  TAROT_OMEGA_CARDS,
  TERMINAL_LORE_DATABASE,
  VIAJE3D_NODES,
} from './judasData';
import { Audio432Engine } from './Audio432Engine';
import { Sparkles, Terminal } from 'lucide-react';

interface LogEntry {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  text: string;
}

interface TerminalCharPlusProps {
  lang: Language;
  audioEngine: Audio432Engine;
  unlockedGems: number[];
  onToggleGem: (idx: number) => void;
  onUnlockAllGems: () => void;
  onSelectNode: (idx: number) => void;
}

export const TerminalCharPlus: React.FC<TerminalCharPlusProps> = ({
  lang,
  audioEngine,
  unlockedGems,
  onToggleGem,
  onUnlockAllGems,
  onSelectNode,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'BELENTANI OS v2026.11 // KERNEL OBSIDIAN-CRIMSON ACTIVO',
    },
    {
      id: 'init-2',
      type: 'system',
      text: "Ejecuta 'help', 'char+ <entidad>' (belentani, judas, san-pedro, duck, thiago) o consulta libremente al núcleo Gemini (/api/lore).",
    },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isQueryingAi, setIsQueryingAi] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const streamTimerRef = useRef<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [logs]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current !== null) {
        window.clearInterval(streamTimerRef.current);
      }
    };
  }, []);

  const streamResponse = (fullText: string, type: 'output' | 'error' = 'output') => {
    if (streamTimerRef.current !== null) {
      window.clearInterval(streamTimerRef.current);
    }
    setIsStreaming(true);
    const entryId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setLogs((prev) => [...prev, { id: entryId, type, text: '' }]);

    let index = 0;
    streamTimerRef.current = window.setInterval(() => {
      index += 1;
      setLogs((prev) =>
        prev.map((item) => (item.id === entryId ? { ...item, text: fullText.slice(0, index) } : item))
      );

      if (index >= fullText.length) {
        if (streamTimerRef.current !== null) {
          window.clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
        }
        setIsStreaming(false);
      }
    }, 12);
  };

  const queryAiLore = async (prompt: string, mode: 'lore' | 'darvo' | 'tarot' = 'lore') => {
    setIsQueryingAi(true);
    try {
      const response = await fetch('/api/lore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: prompt,
          mode,
          lang,
          unlockedGems,
        }),
      });
      const data = (await response.json()) as { reply?: string; error?: string; code?: string };
      if (!response.ok) {
        streamResponse(
          `[KERNEL_AI ${response.status}] ${data.error || 'Error al consultar el endpoint /api/lore.'}`,
          'error'
        );
        return;
      }
      streamResponse(data.reply || '[KERNEL_AI] Sin respuesta del modelo.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fallo de red al contactar /api/lore.';
      streamResponse(`[NET ERROR] ${msg}`, 'error');
    } finally {
      setIsQueryingAi(false);
    }
  };

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed || isStreaming || isQueryingAi) return;

    setLogs((prev) => [
      ...prev,
      { id: `${Date.now()}-in`, type: 'input', text: `> ${trimmed}` },
    ]);
    setHistory((prev) => [trimmed, ...prev]);
    setHistoryIdx(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const argJoined = parts.slice(1).join('-').toLowerCase();
    const argSpace = parts.slice(1).join(' ');

    if (cmd === 'help' || cmd === '/help') {
      streamResponse(
        'COMANDOS DEL SISTEMA:\n' +
          '  char+ <entidad>  -> Dossier (belentani, judas, san-pedro, duck, thiago, pedro, marcos, santos, human)\n' +
          '  tracks           -> Catálogo sonoro 2026\n' +
          '  nodes            -> Estado de la galaxia VIAJE-3D (44 planetas)\n' +
          '  nodo <1-44>      -> Inspeccionar planeta específico en el cosmos\n' +
          '  432|528|639|741  -> Disparar frecuencia Solfeggio pura\n' +
          '  omega            -> Sincronizar las 5 gemas (Ascensión Dorada)\n' +
          '  tarot            -> Tirada local de 3 arcanos Omega\n' +
          '  ask <pregunta>   -> Consulta libre al núcleo Gemini (/api/lore)\n' +
          '  clear            -> Limpiar terminal'
      );
      return;
    }

    if (cmd === 'char+' || cmd === 'char') {
      if (!argJoined) {
        streamResponse(
          'USO: char+ <entidad>. Indexadas: belentani, judas, san-pedro, duck, thiago, pedro, marcos, santos, human.'
        );
        return;
      }
      const record = TERMINAL_LORE_DATABASE[argJoined];
      if (record) {
        streamResponse(record);
      } else {
        void queryAiLore(`Inspecciona o interpreta la entidad o concepto '${argSpace}' dentro del universo Belentani.`, 'lore');
      }
      return;
    }

    if (cmd === 'tracks') {
      streamResponse(
        'DISCOGRAFÍA ACTIVA [2026]:\n' +
          DISCOGRAPHY.map((d, i) => `  0${i + 1}. ${d.title} [${d.prod} · ${d.bpm} BPM]`).join('\n')
      );
      return;
    }

    if (cmd === 'nodes') {
      streamResponse(
        `GALAXIA VIAJE-3D: ${VIAJE3D_NODES.length}/44 planetas sincronizados · Firmas activas: ${unlockedGems.length}/5.`
      );
      return;
    }

    if (cmd === 'nodo' || cmd === '/nodo') {
      const n = Number(parts[1]);
      if (!Number.isInteger(n) || n < 1 || n > VIAJE3D_NODES.length) {
        streamResponse(`USO: nodo <1-${VIAJE3D_NODES.length}>`);
        return;
      }
      const node = VIAJE3D_NODES[n - 1];
      onSelectNode(n - 1);
      streamResponse(`[NODO #${String(n).padStart(2, '0')}] ${node.name} (${node.category})\n${node.desc}`);
      return;
    }

    if (['432', '528', '639', '741', '852'].includes(cmd)) {
      const hz = Number(cmd);
      audioEngine.triggerTone(hz, 1.8);
      streamResponse(`[AUDIO 432-ENGINE] Resonancia pura emitida a ${hz} Hz.`);
      return;
    }

    const sigMap: Record<string, number> = {
      pedro: 0,
      marcos: 1,
      santos: 2,
      belentani: 3,
      human: 4,
    };
    if (cmd in sigMap) {
      const idx = sigMap[cmd];
      onToggleGem(idx);
      const sig = SIGNATURES[idx];
      streamResponse(`[GEMA 0${idx + 1}] Firma ${sig.code} (${sig.title}) alternada a ${sig.freqHz} Hz.`);
      return;
    }

    if (cmd === 'omega') {
      onUnlockAllGems();
      audioEngine.triggerTone(432, 2.0);
      streamResponse('[ASCENSIÓN OMEGA] 5/5 Arquetipos sincronizados. Llave Dorada y Planeta Vivo en modo dorado.');
      return;
    }

    if (cmd === 'tarot') {
      const picked = [...TAROT_OMEGA_CARDS].sort(() => Math.random() - 0.5).slice(0, 3);
      streamResponse('TIRADA OMEGA (3 ARCANOS):\n  • ' + picked.join('\n  • '));
      return;
    }

    if (cmd === 'clear') {
      setLogs([]);
      return;
    }

    const aiPrompt = cmd === 'ask' && argSpace ? argSpace : trimmed;
    void queryAiLore(aiPrompt, 'lore');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx + 1 < history.length) {
        const next = historyIdx + 1;
        setHistoryIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const prev = historyIdx - 1;
        setHistoryIdx(prev);
        setInput(history[prev]);
      } else {
        setHistoryIdx(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="judas-milky-glass w-full p-5 font-mono text-sm text-zinc-100">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-rose-500/30 pb-2.5 text-xs">
        <div className="flex items-center gap-2 text-rose-400 font-bold tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>CHAR+ // TERMINAL DE ACCESO DIRECTO</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => executeCommand('tarot')}
            disabled={isStreaming || isQueryingAi}
            className="px-2.5 py-1 rounded bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/35 text-[11px] text-rose-200 transition-colors"
          >
            Tarot 3 Cartas
          </button>
          <button
            type="button"
            onClick={() =>
              void queryAiLore(
                'Explica el protocolo DARVO (Negación, Ataque e Inversión Víctima-Agresor) aplicado a relaciones creativas asimétricas.',
                'darvo'
              )
            }
            disabled={isStreaming || isQueryingAi}
            className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/40 text-[11px] text-amber-200 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Análisis DARVO IA</span>
          </button>
          <span className="text-[11px] text-amber-300/90 uppercase">
            {isQueryingAi ? 'QUERYING GEMINI...' : isStreaming ? 'STREAMING...' : 'READY'}
          </span>
        </div>
      </div>

      <div className="h-64 space-y-2 overflow-y-auto pr-2 leading-relaxed text-xs sm:text-[13px]">
        {logs.map((log) => (
          <div
            key={log.id}
            className={
              log.type === 'input'
                ? 'text-amber-300'
                : log.type === 'system'
                  ? 'text-rose-400/90'
                  : log.type === 'error'
                    ? 'whitespace-pre-wrap text-rose-300'
                    : 'whitespace-pre-wrap text-zinc-200'
            }
          >
            {log.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-rose-500/30 pt-3">
        <span className="font-bold text-rose-500 shrink-0">belentani@judas:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming || isQueryingAi}
          placeholder="char+ judas · tracks · 432 · omega · o pregunta al núcleo Gemini"
          className="w-full bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none text-xs sm:text-sm"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
