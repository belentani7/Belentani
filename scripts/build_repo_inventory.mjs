import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('docs/repo-research/inventory');
const files = fs.readdirSync(root).filter((name) => name.endsWith('.json'));
const categories = new Map();
const repos = new Map();

for (const file of files) {
  const category = file.replace(/\.json$/, '');
  const raw = fs.readFileSync(path.join(root, file), 'utf8').replace(/\u001b\[[0-9;]*m/g, '');
  const entries = JSON.parse(raw);
  categories.set(category, entries);
  for (const entry of entries) {
    const key = entry.fullName.toLowerCase();
    const previous = repos.get(key);
    repos.set(key, {
      ...entry,
      categories: [...new Set([...(previous?.categories ?? []), category])],
    });
  }
}

const sorted = [...repos.values()].sort((a, b) => {
  const stars = (b.stargazersCount ?? 0) - (a.stargazersCount ?? 0);
  return stars || a.fullName.localeCompare(b.fullName);
});

const escape = (value) => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const lines = [
  '# Inventario de repositorios GitHub para NOIACORE LAB',
  '',
  `Inventario generado a partir de ${files.length} búsquedas temáticas. Incluye ${sorted.length} repositorios únicos; los resultados con licencia ausente, actividad antigua o bajo mantenimiento requieren revisión antes de cualquier uso.`,
  '',
  '| Repositorio | Estrellas | Actualizado | Licencia | Categorías | Encaje inicial |',
  '|---|---:|---|---|---|---|',
];

for (const repo of sorted) {
  const license = repo.license?.name || 'No identificada';
  const category = repo.categories.join(', ');
  lines.push(`| [${escape(repo.fullName)}](${repo.url}) | ${repo.stargazersCount ?? 0} | ${escape(repo.updatedAt).slice(0, 10)} | ${escape(license)} | ${escape(category)} | Pendiente de revisión técnica y de licencia |`);
}

lines.push('', '## Criterios', '', 'La lista es un inventario de candidatos, no una autorización de integración. Antes de incorporar un paquete se comprobarán licencia, seguridad, dependencia transitiva, compatibilidad con React/TypeScript/Tailwind/Drizzle, impacto de bundle, mantenimiento y cobertura de pruebas.');
fs.writeFileSync('docs/repo-research/github-inventory.md', `${lines.join('\n')}\n`);
fs.writeFileSync('docs/repo-research/github-inventory-summary.json', JSON.stringify({ generatedAt: new Date().toISOString(), files, uniqueRepositories: sorted.length, categories: [...categories.keys()] }, null, 2));
console.log(`Generated ${sorted.length} unique repositories from ${files.length} categories`);
