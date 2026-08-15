import { afterEach, describe, expect, it } from "vitest";
import axe from "axe-core";
import { Window } from "happy-dom";

describe("accessibility semantic smoke audit", () => {
  let window: Window | undefined;

  afterEach(() => {
    window?.close();
    window = undefined;
  });

  it("has no axe violations in the shared public route contract", async () => {
    window = new Window();
    window.document.write(`<!doctype html>
      <html lang="es">
        <head><title>NOIACORE LAB</title></head>
        <body>
          <header><nav aria-label="Navegación principal">
            <a href="/">NOIACORE LAB</a>
            <a href="/catalogo">Catálogo</a>
            <a href="/recursos">Recursos</a>
            <a href="/transparencia">Transparencia</a>
          </nav></header>
          <main>
            <h1>Contenido verificable</h1>
            <p>Una superficie pública con contexto, límites y revisión humana.</p>
            <form aria-label="Consulta del agente">
              <label for="message">Mensaje para el agente</label>
              <input id="message" name="message" type="text" />
              <button type="submit">Enviar mensaje</button>
            </form>
          </main>
          <footer><a href="mailto:belentani7studio@proton.me">Contacto</a></footer>
        </body>
      </html>`);

    const globals = globalThis as Record<string, unknown>;
    globals.window = window;
    globals.document = window.document;
    globals.Node = window.Node;
    globals.Element = window.Element;
    globals.HTMLElement = window.HTMLElement;
    globals.getComputedStyle = window.getComputedStyle.bind(window);

    const results = await axe.run(window.document.documentElement);
    expect(results.violations).toEqual([]);
  });
});
