import { describe, expect, it } from 'vitest';
import {
  LANGUAGE_KEY,
  parseLanguage,
  parseView,
  readStoredLanguage,
  readView,
} from '../src/lib/navigation';

describe('parseView', () => {
  it('acepta las 6 vistas conocidas', () => {
    for (const v of ['judas_omega', 'omega_prime', 'visual_engine', 'sdd_maestro', 'production_checklist', 'workspace_hub']) {
      expect(parseView(v)).toBe(v);
    }
  });
  it('cae a judas_omega ante valores inválidos', () => {
    expect(parseView(null)).toBe('judas_omega');
    expect(parseView(undefined)).toBe('judas_omega');
    expect(parseView('')).toBe('judas_omega');
    expect(parseView('JUDAS_OMEGA')).toBe('judas_omega');
    expect(parseView('../../etc/passwd')).toBe('judas_omega');
  });
});

describe('parseLanguage', () => {
  it('acepta pt/es/en/ca y cae a es', () => {
    for (const l of ['pt', 'es', 'en', 'ca']) expect(parseLanguage(l)).toBe(l);
    expect(parseLanguage('fr')).toBe('es');
    expect(parseLanguage(null)).toBe('es');
  });
});

describe('readView / readStoredLanguage', () => {
  it('lee ?view= de una URL completa', () => {
    expect(readView('https://belentani.es/?view=visual_engine')).toBe('visual_engine');
    expect(readView('https://belentani.es/')).toBe('judas_omega');
  });
  it('tolera storage que lanza (modo privado)', () => {
    const throwing = { getItem: () => { throw new Error('denied'); } } as unknown as Storage;
    expect(readStoredLanguage(throwing)).toBe('es');
    expect(readStoredLanguage(null)).toBe('es');
    const ok = { getItem: (k: string) => (k === LANGUAGE_KEY ? 'ca' : null) } as unknown as Storage;
    expect(readStoredLanguage(ok)).toBe('ca');
  });
});
