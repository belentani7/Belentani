import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

const SYSTEM_LORE_CONTEXT = `Eres KERNEL_OMEGA, la inteligencia de archivo de "BELENTANI // THE JUDAS EXPERIENCE" (belentani.es).
Contexto canónico:
- Artista: BELENTANI (Pedro Belentani, 1995), cantautor, productor e ingeniero de sistemas de IA nacido en São Paulo (Brasil) y afincado en Barcelona / L'Hospitalet de Llobregat. Voz íntima (Blue Yeti X, vocal fry, falsete aéreo, gallo emocional), fusión Dark Pop / Electro-R&B / Funk Carioca / MPB.
- Alianza creativa: Desde 2022 con el productor brasileño Hey Duck (Recife/Aracaju) en temas como "JUDAS" y "La Deuda".
- Obras clave 2026: "JUDAS (The Judas Experience)", "Cassandra (Molhou meus olhos)", "Nemo Throat Stone", "La Deuda", "Shark Eyes", "Apaga a Luz", "O Avesso do Mar".
- Dualidad central: San Pedro (guardián de las llaves y estructura) vs Judas (catalizador de la ruptura de febrero de 2026 que transforma la traición en soberanía creativa).
- Las 5 Firmas / Diamantes Arquetipo (IOR 2.417): PEDRO (La Roca, 432Hz), MARCOS (El Cronista, 528Hz), SANTOS (La Antena, 639Hz), BELENTANI (El Artefacto, 741Hz), THE HUMAN (La Interfaz, 852Hz).
- Arquitectura técnica: Galaxia espiral VIAJE-3D de 44 planetas-nodo (ecosistema github.com/belentani7), motor 432 Hz / 76 BPM, estética negro obsidiana (#000000), carmesí neón (#FF0033) y oro líquido (#D4AF37).

Directrices de respuesta:
- Responde en el idioma solicitado (pt, es, en o ca). Por defecto español.
- Tono: lúcido, poético-técnico, sin victimismo, directo estilo terminal de alto nivel.
- Máximo 110 palabras por respuesta para lectura fluida en terminal char+.`;

interface LoreRequestBody {
  query?: unknown;
  mode?: unknown;
  lang?: unknown;
  unlockedGems?: unknown;
}

async function createApp() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'belentani-omega-kernel',
      aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0),
    });
  });

  app.post('/api/lore', async (req: Request, res: Response) => {
    const body = (req.body || {}) as LoreRequestBody;
    const rawQuery = typeof body.query === 'string' ? body.query.trim() : '';
    const mode = typeof body.mode === 'string' ? body.mode : 'lore';
    const lang = typeof body.lang === 'string' ? body.lang : 'es';
    const unlockedCount = Array.isArray(body.unlockedGems) ? body.unlockedGems.length : 0;

    if (!rawQuery || rawQuery.length > 600) {
      res.status(400).json({
        error: 'Consulta inválida. Envía entre 1 y 600 caracteres.',
        code: 'INVALID_QUERY',
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      res.status(503).json({
        error: 'GEMINI_API_KEY no está configurada en Settings > Secrets.',
        code: 'MISSING_API_KEY',
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const promptText = `[MODO: ${mode.toUpperCase()} | IDIOMA: ${lang} | GEMAS_ACTIVAS: ${unlockedCount}/5]\nConsulta del visitante: ${rawQuery}`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: promptText,
        config: {
          systemInstruction: SYSTEM_LORE_CONTEXT,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const replyText = (response.text ?? '').trim();
      if (!replyText) {
        res.status(502).json({
          error: 'El núcleo devolvió una respuesta vacía.',
          code: 'EMPTY_RESPONSE',
        });
        return;
      }

      res.json({
        reply: replyText,
        model: 'gemini-4-hydrogen',
        mode,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al consultar Gemini API';
      const status =
        message.includes('403') || message.includes('PERMISSION_DENIED')
          ? 403
          : message.includes('429') || message.includes('RESOURCE_EXHAUSTED')
            ? 429
            : 502;
      res.status(status).json({
        error: message,
        code: 'UPSTREAM_GEMINI_ERROR',
      });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BELENTANI OMEGA KERNEL] listening on http://0.0.0.0:${PORT}`);
  });
}

createApp().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
