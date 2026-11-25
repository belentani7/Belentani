import type { Language, NavTabId } from '../types';

export const VIEW_IDS: readonly NavTabId[] = [
  'judas_omega',
  'omega_prime',
  'visual_engine',
  'sdd_maestro',
  'production_checklist',
  'workspace_hub',
];

export const LANGUAGE_IDS: readonly Language[] = ['pt', 'es', 'en', 'ca'];

export const LANGUAGE_KEY = 'belentani-workspace-language';

export const DEFAULT_VIEW: NavTabId = 'judas_omega';
export const DEFAULT_LANGUAGE: Language = 'es';

/** Vista activa a partir del query param `?view=`; cae a la vista por defecto. */
export function parseView(value: string | null | undefined): NavTabId {
  return VIEW_IDS.find((id) => id === value) ?? DEFAULT_VIEW;
}

/** Idioma válido a partir de un valor persistido; cae al idioma por defecto. */
export function parseLanguage(value: string | null | undefined): Language {
  return LANGUAGE_IDS.find((id) => id === value) ?? DEFAULT_LANGUAGE;
}

export function readView(href: string): NavTabId {
  return parseView(new URL(href).searchParams.get('view'));
}

export function readStoredLanguage(storage: Pick<Storage, 'getItem'> | null): Language {
  try {
    return parseLanguage(storage?.getItem(LANGUAGE_KEY));
  } catch {
    return DEFAULT_LANGUAGE;
  }
}
