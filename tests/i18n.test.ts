import { describe, expect, it } from 'vitest';
import { translations } from '../src/locales/i18n';
import { LANGUAGE_IDS } from '../src/lib/navigation';

describe('i18n: paridad entre idiomas', () => {
  const langs = Object.keys(translations);

  it('cubre exactamente pt, es, en, ca', () => {
    expect([...langs].sort()).toEqual([...LANGUAGE_IDS].sort());
  });

  it('todos los idiomas tienen exactamente las mismas claves', () => {
    const reference = Object.keys(translations.es).sort();
    for (const lang of langs) {
      expect(Object.keys(translations[lang as keyof typeof translations]).sort(), `idioma ${lang}`).toEqual(reference);
    }
  });

  it('ninguna cadena está vacía', () => {
    for (const lang of langs) {
      for (const [key, value] of Object.entries(translations[lang as keyof typeof translations])) {
        expect(typeof value === 'string' && value.trim().length > 0, `${lang}.${key}`).toBe(true);
      }
    }
  });
});
