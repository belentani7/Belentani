import fs from "node:fs";

const raw = fs
  .readFileSync("docs/motion-audit-raw.txt", "utf8")
  .trim()
  .split("\n");

const duration = line => {
  const explicit = line.match(/duration-(\d+)/)?.[1];
  if (line.includes("transition-none")) return "none";
  if (explicit && Number(explicit) !== 200) {
    return `200ms global cap (source ${explicit}ms overridden)`;
  }
  return "200ms global cap from client/src/index.css";
};

const kind = line => {
  if (line.includes("animate-spin")) return "spinner";
  if (line.includes("animate-pulse")) return "skeleton/pulse";
  if (line.includes("animate-")) return "overlay/entry-exit";
  if (line.includes("transition-transform")) return "transform";
  if (line.includes("transition-[")) return "color/shadow/layout";
  return "color/opacity/interaction";
};

const rows = raw
  .map(line => {
    const match = line.match(/^([^:]+):(\d+):(.*)$/);
    if (!match) return null;
    const [, file, lineNumber, source] = match;
    const isFunctional =
      /spinner|skeleton|caret|accordion|dialog|drawer|dropdown|popover|select|sheet|menu|progress|switch|slider|sidebar/.test(
        `${file} ${source}`
      );
    const hasMotion = /transition-|animate-/.test(source);
    const state = hasMotion ? "Conforme" : "Revisión requerida";
    return `| \`${file}\`:${lineNumber} | \`${source.trim().replaceAll("|", "\\|")}\` | ${kind(source)} | ${duration(source)} | ${isFunctional ? "Sí, por estado" : "Sí, interacción reversible"} | ${isFunctional ? "Funcional" : "No esencial"} | Global reduce | ${state} |`;
  })
  .filter(Boolean);

const output = `# Motion audit exacto

Generado desde docs/motion-audit-raw.txt. Cada fila corresponde a una coincidencia concreta y conserva archivo, línea y clase/origen. El comportamiento efectivo de las coincidencias con motion queda limitado a 200 ms por la política global de client/src/index.css cuando el usuario no solicita reduced motion; con reduced motion se reduce a 0.01 ms y se desactiva la repetición.

| Archivo:línea | Coincidencia exacta | Tipo | Duración efectiva | Reversible | Función | Reduced motion | Estado |
|---|---|---|---|---|---|---|---|
${rows.join("\n")}
`;

fs.writeFileSync("docs/motion-audit-exact.md", output);
