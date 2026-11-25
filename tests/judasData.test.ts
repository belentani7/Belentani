import { describe, expect, it } from 'vitest';
import {
  DISCOGRAPHY,
  JUDAS_LOCALE_COPY,
  JUDAS_PHASES,
  ODYSSEY_ACTS,
  ODYSSEY_DURATION_SEC,
  SIGNATURES,
  STATIONS,
  VIAJE3D_NODES,
} from '../src/components/judas-omega/judasData';

describe('judasData: integridad del lore canónico', () => {
  it('hay exactamente 5 firmas con frecuencias únicas y ascendentes', () => {
    expect(SIGNATURES).toHaveLength(5);
    const freqs = SIGNATURES.map((s) => s.freqHz);
    expect(new Set(freqs).size).toBe(5);
    expect([...freqs].sort((a, b) => a - b)).toEqual(freqs);
    expect(freqs[0]).toBe(432);
    for (const s of SIGNATURES) {
      expect(s.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(s.desc.length).toBeGreaterThan(10);
    }
  });

  it('la galaxia VIAJE-3D tiene 44 nodos con nombres únicos', () => {
    expect(VIAJE3D_NODES).toHaveLength(44);
    expect(new Set(VIAJE3D_NODES.map((n) => n.name)).size).toBe(44);
  });

  it('fases, estaciones y discografía no están vacías ni duplicadas', () => {
    expect(JUDAS_PHASES.length).toBeGreaterThan(0);
    expect(STATIONS.length).toBeGreaterThan(0);
    expect(new Set(STATIONS).size).toBe(STATIONS.length);
    expect(DISCOGRAPHY.length).toBeGreaterThan(0);
    expect(new Set(DISCOGRAPHY.map((t) => t.title)).size).toBe(DISCOGRAPHY.length);
  });

  it('los actos de la odisea cubren la duración total sin solaparse', () => {
    expect(ODYSSEY_ACTS.length).toBeGreaterThan(0);
    const sorted = [...ODYSSEY_ACTS].sort((a, b) => a.startSec - b.startSec);
    expect(sorted[0].startSec).toBe(0);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].startSec).toBeGreaterThanOrEqual(sorted[i - 1].startSec);
    }
    const last = sorted[sorted.length - 1];
    expect(last.startSec).toBeLessThan(ODYSSEY_DURATION_SEC);
  });

  it('hay copy localizado para los 4 idiomas', () => {
    for (const lang of ['pt', 'es', 'en', 'ca']) {
      expect(JUDAS_LOCALE_COPY[lang as keyof typeof JUDAS_LOCALE_COPY]).toBeTruthy();
    }
  });
});
